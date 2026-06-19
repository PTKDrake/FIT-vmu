import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("cta custom component matches responsive structure and styles", async () => {
    const source = await readFile(
        new URL("../components/cms/cta-custom.tsx", import.meta.url),
        "utf8",
    );

    assert.match(source, /@heroicons\/react\/24\/outline/);
    assert.match(source, /AcademicCapIcon/);
    assert.match(source, /PhoneIcon/);
    assert.match(source, /ArrowRightIcon/);
    assert.match(source, /ShieldCheckIcon/);
    assert.match(source, /UsersIcon/);
    assert.match(source, /ArrowTrendingUpIcon/);
    assert.doesNotMatch(source, /from "lucide-react";/);
    assert.match(source, /export function CtaCustom/);
    assert.match(source, /getPuckImageUrl/);
    assert.match(source, /highlightWords/);
    assert.match(source, /lg:grid-cols-12/);
    assert.match(source, /lg:col-span-7/);
    assert.match(source, /size-10/);
    assert.match(source, /size-12/);
    assert.match(source, /size-3\.5/);
});
