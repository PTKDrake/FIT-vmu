import { convertToModelMessages, streamText } from "ai";
import {
  injectDocumentStateMessages,
  toolDefinitionsToToolSet,
} from "@blocknote/xl-ai/server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

function writeChunk(chunk) {
  process.stdout.write(`data: ${JSON.stringify(chunk)}\n\n`);
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
  const apiKey = process.env.OPENROUTER_API_KEY;
  const modelId = process.env.OPENROUTER_BLOCKNOTE_MODEL;

  if (!apiKey || !modelId) {
    throw new Error("OpenRouter API key or BlockNote model is not configured.");
  }

  const payload = await readJsonInput();
  const messages = Array.isArray(payload.messages) ? payload.messages : [];
  const toolDefinitions =
    payload.toolDefinitions && typeof payload.toolDefinitions === "object"
      ? payload.toolDefinitions
      : {};

  if (messages.length === 0) {
    throw new Error("BlockNote AI request must include at least one message.");
  }

  if (Object.keys(toolDefinitions).length === 0) {
    throw new Error("BlockNote AI request must include stream tool definitions.");
  }

  const openrouter = createOpenRouter({
    apiKey,
    appName: process.env.OPENROUTER_APP_NAME,
    appUrl: process.env.OPENROUTER_APP_URL,
    compatibility: "strict",
  });

  const result = streamText({
    model: openrouter(modelId),
    messages: await convertToModelMessages(
      injectDocumentStateMessages(messages),
    ),
    tools: toolDefinitionsToToolSet(toolDefinitions),
    toolChoice: "auto",
  });

  const reader = result.toUIMessageStream().getReader();

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

main().catch((error) => {
  writeChunk({
    type: "error",
    errorText: getErrorMessage(error),
  });

  process.exitCode = 1;
});
