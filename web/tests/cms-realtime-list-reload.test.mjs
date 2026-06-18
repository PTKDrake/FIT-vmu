import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("CMS posts realtime refreshes the async table list", async () => {
    const source = await readFile("web/pages/cms/posts/index.tsx", "utf8");

    assert.match(source, /useCmsContentRealtime\("posts", \(payload\) => \{/);
    assert.match(source, /reloadPostsList\(\);/);
    assert.match(
        source,
        /function reloadPostsList\(\): void \{\s*tableQueryState\.list\.reload\(\);\s*\}/,
    );
    assert.doesNotMatch(source, /router\.reload\(\{ only: \["posts"\] \}\);/);
});

test("CMS post review and delete actions refresh the async table list after success", async () => {
    const source = await readFile("web/pages/cms/posts/index.tsx", "utf8");
    const successReloads = source.match(/onSuccess: reloadPostsList/g) ?? [];

    assert.ok(successReloads.length >= 2);
    assert.match(source, /setDeleteTarget\(null\);\s*reloadPostsList\(\);/);
});

test("CMS page realtime, clone, and delete actions refresh the async table list", async () => {
    const source = await readFile("web/pages/cms/pages/index.tsx", "utf8");

    assert.match(source, /useCmsContentRealtime\("pages", \(payload\) => \{/);
    assert.match(
        source,
        /function reloadPagesList\(\): void \{\s*tableQueryState\.list\.reload\(\);\s*\}/,
    );
    assert.match(source, /onSuccess: reloadPagesList/);
    assert.match(source, /setDeleteTarget\(null\);\s*reloadPagesList\(\);/);
});

test("CMS shared list realtime refreshes current collection loaders", async () => {
    const pagesSource = await readFile("web/pages/cms/pages/index.tsx", "utf8");
    const unitsSource = await readFile("web/pages/cms/units/index.tsx", "utf8");
    const staffProfilesSource = await readFile(
        "web/pages/cms/staff-profiles/index.tsx",
        "utf8",
    );

    assert.match(pagesSource, /reloadPagesList\(\);/);
    assert.match(unitsSource, /unitList\.reload\(\);/);
    assert.match(staffProfilesSource, /tableQueryState\.list\.reload\(\);/);
});
