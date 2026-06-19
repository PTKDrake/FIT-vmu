import {
    aiDocumentFormats,
    injectDocumentStateMessages,
    toolDefinitionsToToolSet,
} from "@blocknote/xl-ai/server";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, generateText, streamText } from "ai";
import { pathToFileURL } from "node:url";

const BLOCKNOTE_TOOL_NAME = "applyDocumentOperations";

function writeChunk(chunk) {
    process.stdout.write(`data: ${JSON.stringify(chunk)}\n\n`);
}

function writeLog(level, message, context = {}) {
    process.stderr.write(
        `${JSON.stringify({
            context,
            level,
            message,
            timestamp: new Date().toISOString(),
        })}\n`,
    );
}

function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }

    return typeof error === "string" ? error : "Unknown BlockNote AI error.";
}

async function readJsonInput() {
    const chunks = [];

    for await (const chunk of process.stdin) {
        chunks.push(chunk);
    }

    const rawInput = chunks.join("").trim();

    if (rawInput === "") {
        throw new Error("Missing BlockNote AI request payload.");
    }

    return JSON.parse(rawInput);
}

async function main() {
    const startedAt = performance.now();
    const apiKey = process.env.BLOCKNOTE_AI_API_KEY;
    const modelId = process.env.BLOCKNOTE_AI_MODEL;
    const provider = process.env.BLOCKNOTE_AI_PROVIDER ?? "openrouter";

    if (!apiKey || !modelId) {
        throw new Error(
            "BlockNote AI provider API key or model is not configured.",
        );
    }

    const payload = await readJsonInput();
    const messages = Array.isArray(payload.messages) ? payload.messages : [];
    const requestMessages = getLatestBlockNoteRequestMessages(messages);
    const toolDefinitions =
        payload.toolDefinitions && typeof payload.toolDefinitions === "object"
            ? payload.toolDefinitions
            : {};

    if (messages.length === 0) {
        throw new Error(
            "BlockNote AI request must include at least one message.",
        );
    }

    if (Object.keys(toolDefinitions).length === 0) {
        throw new Error(
            "BlockNote AI request must include stream tool definitions.",
        );
    }

    if (requestMessages.length < messages.length) {
        writeLog("debug", "BlockNote AI request history was pruned.", {
            originalMessages: messages.length,
            prunedMessages: requestMessages.length,
        });
    }

    const model = createModelProvider({
        apiKey,
        modelId,
        provider,
    });

    if (provider === "nim") {
        await streamNimCompatibleToolCall({
            model,
            modelId,
            requestMessages,
            startedAt,
            toolDefinitions,
        });

        return;
    }

    const result = streamText({
        maxRetries: 1,
        model,
        messages: await convertToModelMessages(
            injectDocumentStateMessages(requestMessages),
        ),
        onError({ error }) {
            writeLog("error", "BlockNote AI provider stream error.", {
                error: getErrorMessage(error),
                model: modelId,
            });
        },
        onFinish({ finishReason, totalUsage }) {
            writeLog("info", "BlockNote AI provider stream finished.", {
                durationMs: Math.round(performance.now() - startedAt),
                finishReason,
                model: modelId,
                provider,
                totalUsage,
            });

            if (finishReason !== "tool-calls") {
                writeLog(
                    "warning",
                    "BlockNote AI provider finished without tool calls.",
                    {
                        finishReason,
                        model: modelId,
                        provider,
                    },
                );
            }
        },
        system: aiDocumentFormats.html.systemPrompt,
        temperature: 0.2,
        tools: toolDefinitionsToToolSet(toolDefinitions),
        toolChoice: "required",
    });

    const reader = result
        .toUIMessageStream({
            onError: getErrorMessage,
            sendReasoning: false,
        })
        .getReader();

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }

            writeChunk(value);
        }
    } finally {
        reader.releaseLock();
    }
}

async function streamNimCompatibleToolCall({
    model,
    modelId,
    requestMessages,
    startedAt,
    toolDefinitions,
}) {
    const toolDefinition = toolDefinitions[BLOCKNOTE_TOOL_NAME];

    if (!toolDefinition || typeof toolDefinition !== "object") {
        throw new Error(
            `BlockNote AI request must include the ${BLOCKNOTE_TOOL_NAME} tool definition.`,
        );
    }

    const toolCallId = `call_${crypto.randomUUID().replaceAll("-", "")}`;

    writeChunk({
        type: "start",
    });
    writeChunk({
        type: "start-step",
    });
    writeChunk({
        type: "tool-input-start",
        toolCallId,
        toolName: BLOCKNOTE_TOOL_NAME,
    });

    const modelMessages = await convertToModelMessages(
        injectDocumentStateMessages(requestMessages),
    );
    const result = await generateText({
        maxOutputTokens: 8192,
        maxRetries: 1,
        messages: modelMessages,
        model,
        system: createNimToolInstruction(toolDefinition),
        temperature: 0.2,
    });
    const input = parseToolInputFromText(result.text);
    const inputText = JSON.stringify(input);

    for (const delta of chunkString(inputText, 256)) {
        writeChunk({
            type: "tool-input-delta",
            toolCallId,
            inputTextDelta: delta,
        });
    }

    writeChunk({
        type: "tool-input-available",
        toolCallId,
        toolName: BLOCKNOTE_TOOL_NAME,
        input,
    });
    writeChunk({
        type: "finish-step",
    });
    writeChunk({
        type: "finish",
        finishReason: "tool-calls",
    });
    writeLog("info", "BlockNote AI provider generated compatible tool input.", {
        durationMs: Math.round(performance.now() - startedAt),
        finishReason: result.finishReason,
        model: modelId,
        operationCount: input.operations.length,
        operationTypes: input.operations.map((operation) => operation.type),
        provider: "nim",
        totalUsage: result.totalUsage,
    });
}

export function getLatestBlockNoteRequestMessages(messages) {
    if (!Array.isArray(messages)) {
        return [];
    }

    const lastUserMessageIndex = messages.findLastIndex(
        (message) =>
            message && typeof message === "object" && message.role === "user",
    );

    if (lastUserMessageIndex === -1) {
        return messages;
    }

    return messages.slice(lastUserMessageIndex);
}

export function createNimToolInstruction(toolDefinition) {
    const inputSchema =
        toolDefinition.inputSchema &&
        typeof toolDefinition.inputSchema === "object"
            ? toolDefinition.inputSchema
            : {};

    return [
        aiDocumentFormats.html.systemPrompt,
        "You are editing a BlockNote document.",
        `Return only valid JSON for the ${BLOCKNOTE_TOOL_NAME} tool input.`,
        "Do not wrap the JSON in Markdown. Do not include explanations.",
        "The JSON must satisfy this schema:",
        JSON.stringify(inputSchema),
    ].join("\n");
}

export function parseToolInputFromText(text) {
    const jsonText = extractJsonObject(text);
    const value = JSON.parse(jsonText);

    if (
        !value ||
        typeof value !== "object" ||
        !Array.isArray(value.operations)
    ) {
        throw new Error(
            "NIM response did not include a valid BlockNote operations array.",
        );
    }

    if (value.operations.length === 0) {
        throw new Error("NIM response did not include any BlockNote operations.");
    }

    return value;
}

export function extractJsonObject(text) {
    const trimmedText = text.trim();
    const fencedJson = trimmedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);

    if (fencedJson?.[1]) {
        return extractJsonObject(fencedJson[1]);
    }

    const start = trimmedText.indexOf("{");

    if (start === -1) {
        throw new Error("NIM response did not contain a JSON object.");
    }

    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let index = start; index < trimmedText.length; index += 1) {
        const character = trimmedText[index];

        if (escaped) {
            escaped = false;

            continue;
        }

        if (character === "\\") {
            escaped = true;

            continue;
        }

        if (character === '"') {
            inString = !inString;

            continue;
        }

        if (inString) {
            continue;
        }

        if (character === "{") {
            depth += 1;
        }

        if (character === "}") {
            depth -= 1;

            if (depth === 0) {
                return trimmedText.slice(start, index + 1);
            }
        }
    }

    throw new Error("NIM response contained an incomplete JSON object.");
}

export function chunkString(value, size) {
    const chunks = [];

    for (let index = 0; index < value.length; index += size) {
        chunks.push(value.slice(index, index + size));
    }

    return chunks;
}

if (
    process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href
) {
    main().catch((error) => {
        writeLog("error", "BlockNote AI bridge failed.", {
            error: getErrorMessage(error),
        });

        writeChunk({
            type: "error",
            errorText: getErrorMessage(error),
        });

        process.exitCode = 1;
    });
}

function createModelProvider({ apiKey, modelId, provider }) {
    switch (provider) {
        case "nim": {
            const baseURL = normalizeOpenAiCompatibleBaseURL(
                process.env.BLOCKNOTE_AI_BASE_URL ||
                    "https://integrate.api.nvidia.com/v1",
            );
            const nim = createOpenAICompatible({
                name: "nim",
                apiKey,
                baseURL,
                transformRequestBody: transformNimRequestBody,
            });

            return nim.chatModel(modelId);
        }

        case "openrouter": {
            const openrouter = createOpenRouter({
                apiKey,
                appName: process.env.BLOCKNOTE_AI_APP_NAME,
                appUrl: process.env.BLOCKNOTE_AI_APP_URL,
                compatibility: "strict",
            });

            return openrouter(modelId);
        }

        default:
            throw new Error(`Unsupported BlockNote AI provider: ${provider}.`);
    }
}

export function normalizeOpenAiCompatibleBaseURL(baseURL) {
    return baseURL
        .trim()
        .replace(/\/+$/, "")
        .replace(/\/chat\/completions$/i, "");
}

export function transformNimRequestBody(body) {
    const nextBody = { ...body };

    if (nextBody.max_tokens == null) {
        nextBody.max_tokens = 8192;
    }

    if (nextBody.top_p == null) {
        nextBody.top_p = 0.95;
    }

    if (
        nextBody.tool_choice === "required" &&
        Array.isArray(nextBody.tools) &&
        nextBody.tools.length === 1
    ) {
        const [tool] = nextBody.tools;
        const toolName =
            tool &&
            typeof tool === "object" &&
            "function" in tool &&
            tool.function &&
            typeof tool.function === "object" &&
            "name" in tool.function &&
            typeof tool.function.name === "string"
                ? tool.function.name
                : null;

        if (toolName) {
            nextBody.tool_choice = {
                type: "function",
                function: {
                    name: toolName,
                },
            };
        }
    }

    return nextBody;
}
