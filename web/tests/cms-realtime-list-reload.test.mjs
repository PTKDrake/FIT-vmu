import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("CMS posts realtime refreshes the async table list", async () => {
    const source = await readFile("web/pages/cms/posts/index.tsx", "utf8");

    assert.match(source, /useCmsContentRealtime\("posts", \(payload\) => \{/);
    assert.match(source, /tableQueryState\.list\.reload\(\);/);
    assert.doesNotMatch(source, /router\.reload\(\{ only: \["posts"\] \}\);/);
});

test("CMS shared list realtime refreshes current collection loaders", async () => {
    const pagesSource = await readFile("web/pages/cms/pages/index.tsx", "utf8");
    const unitsSource = await readFile("web/pages/cms/units/index.tsx", "utf8");

    assert.match(pagesSource, /tableQueryState\.list\.reload\(\);/);
    assert.match(unitsSource, /unitList\.reload\(\);/);
});
