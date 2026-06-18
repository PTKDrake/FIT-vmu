import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("StaffProfileCard Puck block loads selectable staff options from source data", async () => {
    const source = await readFile(
        "web/lib/puck/blocks/dynamic/feeds.tsx",
        "utf8",
    );
    const sharedSource = await readFile(
        "web/lib/puck/blocks/dynamic/shared.tsx",
        "utf8",
    );

    assert.match(source, /StaffProfileCardComponentConfig/);
    assert.match(source, /staffId:\s*\{\s*type:\s*"select"/s);
    assert.match(sharedSource, /fetchSourceOptions\("staff"\)/);
    assert.match(source, /label:\s*"Chưa chọn cán bộ"/);
    assert.match(source, /resolveFields:\s*async/);
    assert.match(source, /<StaffProfileCardBlock \{\.\.\.props\} \/>/);
});
