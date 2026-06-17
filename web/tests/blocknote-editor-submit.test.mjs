import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const editorSource = readFileSync(
    new URL("../components/editor/blocknote-editor.tsx", import.meta.url),
    "utf8",
);
const postFormSource = readFileSync(
    new URL("../components/cms/post-form.tsx", import.meta.url),
    "utf8",
);

test("BlockNote editor prevents internal buttons from submitting parent forms", () => {
    assert.match(editorSource, /onClickCapture=\{preventEditorButtonSubmit\}/);
    assert.match(editorSource, /event\.target\.closest\("button"\)/);
    assert.match(editorSource, /button\.hasAttribute\("form"\)/);
    assert.match(
        editorSource,
        /buttonType !== "button" && buttonType !== "reset"/,
    );
    assert.match(editorSource, /event\.preventDefault\(\)/);
});

test("Post form only accepts explicit toolbar-triggered submits", () => {
    assert.match(postFormSource, /const allowNextSubmitRef = useRef\(false\)/);
    assert.match(
        postFormSource,
        /const submitButtonRef = useRef<HTMLButtonElement>\(null\)/,
    );
    assert.match(postFormSource, /allowNextSubmitRef\.current = true;/);
    assert.match(postFormSource, /submitButtonRef\.current\.click\(\);/);
    assert.match(
        postFormSource,
        /if \(!allowNextSubmitRef\.current\) \{[\s\S]*?return;[\s\S]*?\}/,
    );
    assert.match(postFormSource, /allowNextSubmitRef\.current = false;/);
    assert.match(postFormSource, /ref=\{submitButtonRef\}/);
});
