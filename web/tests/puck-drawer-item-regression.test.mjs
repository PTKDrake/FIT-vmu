import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("puck drawer item preserves default draggable children from Puck", async () => {
    const source = await readFile(
        new URL("../components/puck/puck-drawer-item.tsx", import.meta.url),
        "utf8",
    );

    assert.doesNotMatch(source, /children:\s*_children/);
    assert.match(source, /normalizeDrawerChildren\(children, englishName\)/);
    assert.match(source, /\{normalizedChildren\}/);
    assert.match(source, /getPuckEnglishName\(name\)/);
    assert.match(source, /stripEnglishSuffix/);
    assert.match(source, /border border-border bg-white px-3 py-2/);
});
