import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const fitNavigationBarSource = readFileSync(
    new URL(
        "../components/page-builder/fit-navigation-bar.tsx",
        import.meta.url,
    ),
    "utf8",
);

test("fit navigation profile exposes quick theme switching for desktop and mobile", () => {
    assert.match(
        fitNavigationBarSource,
        /import \{ useTheme \} from "@\/hooks\/use-theme"/,
    );
    assert.match(fitNavigationBarSource, /<MenuSubMenu>/);
    assert.match(fitNavigationBarSource, /<PaintBrushIcon \/>/);
    assert.match(
        fitNavigationBarSource,
        /Giao diện: \{getThemeLabel\(theme\)\}/,
    );
    assert.match(
        fitNavigationBarSource,
        /<MenuItem onAction=\{\(\) => updateTheme\("light"\)\}>/,
    );
    assert.match(
        fitNavigationBarSource,
        /<MenuItem onAction=\{\(\) => updateTheme\("dark"\)\}>/,
    );
    assert.match(
        fitNavigationBarSource,
        /<MenuItem onAction=\{\(\) => updateTheme\("system"\)\}>/,
    );
    assert.match(fitNavigationBarSource, /function MobileThemeButton/);
    assert.match(fitNavigationBarSource, /grid grid-cols-3 gap-2/);
});
