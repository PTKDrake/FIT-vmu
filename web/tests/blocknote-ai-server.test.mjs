import assert from "node:assert/strict";
import test from "node:test";

import {
    chunkString,
    createNimToolInstruction,
    extractJsonObject,
    normalizeOpenAiCompatibleBaseURL,
    parseToolInputFromText,
    transformNimRequestBody,
} from "../lib/ai/blocknote-server.mjs";

test("normalizes OpenAI-compatible base URLs for NIM", () => {
    assert.equal(
        normalizeOpenAiCompatibleBaseURL("https://integrate.api.nvidia.com/v1"),
        "https://integrate.api.nvidia.com/v1",
    );

    assert.equal(
        normalizeOpenAiCompatibleBaseURL(
            "https://integrate.api.nvidia.com/v1/chat/completions",
        ),
        "https://integrate.api.nvidia.com/v1",
    );

    assert.equal(
        normalizeOpenAiCompatibleBaseURL(
            "https://integrate.api.nvidia.com/v1/chat/completions/",
        ),
        "https://integrate.api.nvidia.com/v1",
    );
});

test("transforms NIM request bodies toward NVIDIA chat completions compatibility", () => {
    assert.deepEqual(
        transformNimRequestBody({
            model: "minimaxai/minimax-m3",
            messages: [{ role: "user", content: "Rewrite this." }],
            stream: true,
            temperature: 0.2,
            tools: [
                {
                    type: "function",
                    function: {
                        name: "applyDocumentOperations",
                        parameters: { type: "object" },
                    },
                },
            ],
            tool_choice: "required",
        }),
        {
            max_tokens: 8192,
            top_p: 0.95,
            model: "minimaxai/minimax-m3",
            messages: [{ role: "user", content: "Rewrite this." }],
            stream: true,
            temperature: 0.2,
            tools: [
                {
                    type: "function",
                    function: {
                        name: "applyDocumentOperations",
                        parameters: { type: "object" },
                    },
                },
            ],
            tool_choice: {
                type: "function",
                function: {
                    name: "applyDocumentOperations",
                },
            },
        },
    );
});

test("builds NIM instructions from the BlockNote tool input schema", () => {
    const instruction = createNimToolInstruction({
        inputSchema: {
            type: "object",
            properties: {
                operations: {
                    type: "array",
                },
            },
        },
    });

    assert.match(instruction, /applyDocumentOperations/);
    assert.match(instruction, /Return only valid JSON/);
    assert.match(instruction, /"operations"/);
});

test("extracts JSON objects from plain and fenced NIM responses", () => {
    assert.equal(
        extractJsonObject('Here is the JSON: {"operations":[{"block":"}"}]}'),
        '{"operations":[{"block":"}"}]}',
    );

    assert.equal(
        extractJsonObject('```json\n{"operations":[]}\n```'),
        '{"operations":[]}',
    );
});

test("parses BlockNote tool input from NIM text responses", () => {
    assert.deepEqual(
        parseToolInputFromText(
            '```json\n{"operations":[{"type":"delete","id":"ref1$"}]}\n```',
        ),
        {
            operations: [
                {
                    type: "delete",
                    id: "ref1$",
                },
            ],
        },
    );

    assert.throws(
        () => parseToolInputFromText('{"message":"no operations"}'),
        /operations array/,
    );
});

test("chunks generated NIM tool input for UI message streaming", () => {
    assert.deepEqual(chunkString("abcdef", 2), ["ab", "cd", "ef"]);
});
