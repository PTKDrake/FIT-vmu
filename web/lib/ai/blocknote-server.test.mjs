import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getLatestBlockNoteRequestMessages } from "./blocknote-server.mjs";

describe("getLatestBlockNoteRequestMessages", () => {
    it("keeps only the latest user request and following messages", () => {
        const messages = [
            { id: "user-1", role: "user" },
            { id: "assistant-1", role: "assistant" },
            { id: "user-2", role: "user" },
        ];

        assert.deepEqual(getLatestBlockNoteRequestMessages(messages), [
            { id: "user-2", role: "user" },
        ]);
    });

    it("keeps non-chat payloads unchanged enough for validation to reject them", () => {
        assert.deepEqual(getLatestBlockNoteRequestMessages("invalid"), []);
    });
});
