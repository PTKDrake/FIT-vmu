import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const pageBuilderSource = readFileSync(
    new URL("../components/page-builder/puck-page-builder.tsx", import.meta.url),
    "utf8",
);
const pageBuilderPageSource = readFileSync(
    new URL("../pages/cms/pages/builder.tsx", import.meta.url),
    "utf8",
);
const layoutBuilderSource = readFileSync(
    new URL("../components/layout-builder/puck-layout-builder.tsx", import.meta.url),
    "utf8",
);
const layoutBuilderEditorSource = readFileSync(
    new URL(
        "../components/layout-builder/site-layout-builder-editor.tsx",
        import.meta.url,
    ),
    "utf8",
);
const layoutFormSource = readFileSync(
    new URL("../components/layout-builder/site-layout-form.tsx", import.meta.url),
    "utf8",
);

test("page builder keeps typing changes local to Puck until save", () => {
    assert.match(pageBuilderSource, /onDirtyChange\?\.\(true\);/);
    assert.match(pageBuilderSource, /if \(onChange === undefined\) \{\s+return;\s+\}/);
    assert.match(pageBuilderPageSource, /const \[isDirty, setIsDirty\] = useState\(false\);/);
    assert.match(pageBuilderPageSource, /onDirtyChange=\{setIsDirty\}/);
    assert.doesNotMatch(pageBuilderPageSource, /draftJson|savedJson|setDraftJson|setSavedJson/);
    assert.doesNotMatch(pageBuilderPageSource, /onChange=\{\(nextValue\) =>/);
});

test("layout builder no longer splits and stores slot JSON on every input change", () => {
    assert.match(layoutBuilderSource, /onDirtyChange\?\.\(true\);/);
    assert.match(layoutBuilderSource, /if \(callback === undefined\) \{\s+return;\s+\}/);
    assert.match(layoutBuilderEditorSource, /form\.setData\(payload\);/);
    assert.match(layoutFormSource, /form\.setData\(payload\);/);
    assert.doesNotMatch(layoutBuilderEditorSource, /onChange=\{\(value\) => applySlotData\(value\.data\)\}/);
    assert.doesNotMatch(layoutFormSource, /onChange=\{\(value\) => applySlotData\(value\.data\)\}/);
});

test("preview iframe sync observers are scoped and animation-frame throttled", () => {
    assert.match(pageBuilderSource, /window\.requestAnimationFrame/);
    assert.match(pageBuilderSource, /window\.cancelAnimationFrame/);
    assert.match(layoutBuilderSource, /window\.requestAnimationFrame/);
    assert.match(layoutBuilderSource, /window\.cancelAnimationFrame/);
    assert.match(pageBuilderSource, /document\.querySelector\("\.vmu-puck-page-builder"\) \?\? document\.body/);
    assert.match(layoutBuilderSource, /document\.querySelector\("\.vmu-puck-page-builder"\) \?\? document\.body/);
});
