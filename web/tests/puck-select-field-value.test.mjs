import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("puck select field uses the field value passed by Puck", async () => {
    const source = await readFile(
        "web/components/layout-builder/puck-select-field.tsx",
        "utf8",
    );

    assert.match(source, /value: fieldValue/);
    assert.match(
        source,
        /const value = fieldValue !== undefined \? fieldValue : puckValue;/,
    );
    assert.match(source, /const selectedKey = toOptionKey\(value\);/);
});
