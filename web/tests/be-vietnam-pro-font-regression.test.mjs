import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const appStyles = readFileSync(
    new URL("../../resources/css/app.css", import.meta.url),
    "utf8",
);
const publicStyles = readFileSync(
    new URL("../../resources/css/public.css", import.meta.url),
    "utf8",
);
const rootTemplateSource = readFileSync(
    new URL("../../resources/views/app.blade.php", import.meta.url),
    "utf8",
);
const pageBuilderSource = readFileSync(
    new URL(
        "../components/page-builder/puck-page-builder.tsx",
        import.meta.url,
    ),
    "utf8",
);
const layoutBuilderSource = readFileSync(
    new URL(
        "../components/layout-builder/puck-layout-builder.tsx",
        import.meta.url,
    ),
    "utf8",
);
const navigationBarSource = readFileSync(
    new URL(
        "../components/page-builder/fit-navigation-bar.tsx",
        import.meta.url,
    ),
    "utf8",
);
const postListSource = readFileSync(
    new URL("../components/public/post-list-section.tsx", import.meta.url),
    "utf8",
);

test("web shell loads Be Vietnam Pro from Google Fonts", () => {
    assert.match(rootTemplateSource, /fonts\.googleapis\.com/);
    assert.match(rootTemplateSource, /Be\+Vietnam\+Pro/);
});

test("global Tailwind font tokens point to Be Vietnam Pro", () => {
    assert.match(appStyles, /"Be Vietnam Pro"/);
    assert.match(publicStyles, /"Be Vietnam Pro"/);
    assert.doesNotMatch(appStyles, /"Inter"/);
    assert.doesNotMatch(publicStyles, /"Inter"/);
});

test("builder previews and measured text helpers use Be Vietnam Pro", () => {
    assert.match(pageBuilderSource, /Be Vietnam Pro/);
    assert.match(
        layoutBuilderSource,
        /font-family: var\(--font-sans\), sans-serif/,
    );
    assert.match(navigationBarSource, /Be Vietnam Pro/);
    assert.match(postListSource, /Be Vietnam Pro/);
    assert.doesNotMatch(pageBuilderSource, /Google Sans/);
    assert.doesNotMatch(layoutBuilderSource, /Google Sans/);
    assert.doesNotMatch(navigationBarSource, /"Inter"/);
    assert.doesNotMatch(postListSource, /"Inter"/);
});
