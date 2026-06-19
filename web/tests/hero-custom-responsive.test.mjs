import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("hero custom keeps mobile layout below 1440px", async () => {
    const source = await readFile(
        new URL("../components/cms/hero-custom.tsx", import.meta.url),
        "utf8",
    );

    assert.match(source, /min-\[1440px\]:flex-row/);
    assert.match(source, /min-\[1440px\]:w-1\/2/);
    assert.match(source, /min-\[1440px\]:block/);
    assert.match(source, /min-\[1440px\]:hidden/);
    assert.match(source, /min-\[1440px\]:bg-gradient-to-r/);
    assert.match(source, /relative block aspect-video w-full/);
    assert.doesNotMatch(source, /sm:aspect-\[21\/9\]/);
    assert.doesNotMatch(source, /md:flex-row/);
    assert.doesNotMatch(source, /md:block/);
    assert.doesNotMatch(source, /md:hidden/);
});
