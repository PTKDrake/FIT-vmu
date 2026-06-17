import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const files = [
    "web/lib/puck/blocks/content.tsx",
    "web/lib/puck/blocks/sections.tsx",
    "web/lib/puck/blocks/dynamic.tsx",
    "web/lib/puck/blocks/site-layout-frame.tsx",
    "web/lib/puck/blocks/surface.ts",
];

test("Puck blocks share configurable surface fields", async () => {
    for (const file of files) {
        const source = await readFile(file, "utf8");

        if (file.endsWith("surface.ts")) {
            assert.match(source, /export const puckSurfaceFields/);
            assert.match(source, /export function getSurfaceClassName/);
            continue;
        }

        assert.match(source, /puckSurfaceFields/);
        assert.match(source, /surfaceTone/);
        assert.match(source, /surfaceBorder/);
        assert.match(source, /surfaceRadius/);
        assert.match(source, /surfacePadding/);
        assert.match(source, /surfaceShadow/);
    }
});

test("Puck layout blocks share configurable surface fields without changing legacy defaults", async () => {
    for (const file of [
        "web/lib/puck/blocks/layouts.tsx",
        "web/lib/puck/blocks/grid.tsx",
        "web/lib/puck/blocks/flex.tsx",
    ]) {
        const source = await readFile(file, "utf8");

        assert.match(source, /puckSurfaceFields/);
        assert.match(source, /getSurfaceClassName\(props, "", \{ includeDefaults: false \}\)/);
    }
});
