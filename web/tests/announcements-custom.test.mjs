import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("announcements custom component matches styling and structure", async () => {
    const source = await readFile(
        new URL("../components/cms/announcements-custom.tsx", import.meta.url),
        "utf8",
    );

    assert.match(
        source,
        /import \{ BellIcon \} from "@heroicons\/react\/24\/outline";/,
    );
    assert.doesNotMatch(source, /from "lucide-react";/);
    assert.match(source, /export function AnnouncementsCustom/);
    assert.match(source, /border-border\/60/);
    assert.match(source, /bg-overlay/);
    assert.match(source, /size-12/);
    assert.match(source, /size-5/);
    assert.match(source, /hover:shadow-xs/);
});

test("announcements custom puck block hides empty public output", async () => {
    const source = await readFile(
        new URL("../lib/puck/blocks/announcements-custom.tsx", import.meta.url),
        "utf8",
    );

    assert.match(source, /if \(!isPuckEditorPreview\(\)\) \{\s*return null;\s*\}/);
    assert.match(
        source,
        /<EmptyDynamicState label="Không có thông báo nào để hiển thị\." \/>/,
    );
});
