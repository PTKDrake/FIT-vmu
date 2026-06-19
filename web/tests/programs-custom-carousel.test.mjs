import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("programs custom carousel navigation remains enabled on mobile", async () => {
    const source = await readFile(
        new URL("../components/cms/programs-custom.tsx", import.meta.url),
        "utf8",
    );

    assert.match(source, /import Autoplay from "embla-carousel-autoplay";/);
    assert.match(source, /from "@heroicons\/react\/24\/outline";/);
    assert.doesNotMatch(source, /from "lucide-react";/);
    assert.match(source, /import \{ Badge \} from "@\/components\/ui\/badge";/);
    assert.match(source, /import \{ Text \} from "@\/components\/ui\/text";/);
    assert.match(source, /<Badge\s+intent="primary"/);
    assert.match(
        source,
        /<Text className="hidden text-sm\/relaxed md:block md:text-base\/relaxed">/,
    );
    assert.match(source, /const carouselPlugins =\s+programs\.length > 1/s);
    assert.match(source, /Autoplay\(\{\s+delay:\s*4500,/s);
    assert.match(source, /stopOnInteraction:\s*false,/);
    assert.match(source, /stopOnMouseEnter:\s*true,/);
    assert.match(
        source,
        /<Carousel\s+opts=\{\{\s*loop:\s*true,\s*align:\s*"start"\s*\}\}/s,
    );
    assert.match(source, /plugins=\{carouselPlugins\}/);
    assert.match(source, /programs\.length > 1 &&/);
    assert.match(
        source,
        /<CarouselButton segment="previous" isDisabled=\{false\} \/>/,
    );
    assert.match(
        source,
        /<CarouselButton segment="next" isDisabled=\{false\} \/>/,
    );
});
