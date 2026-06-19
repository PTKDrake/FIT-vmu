import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const editorSource = readFileSync(
    new URL("../components/editor/blocknote-editor.tsx", import.meta.url),
    "utf8",
);
const readonlySource = readFileSync(
    new URL("../components/editor/blocknote-readonly.tsx", import.meta.url),
    "utf8",
);
const aiSource = readFileSync(
    new URL("../components/editor/blocknote-ai.tsx", import.meta.url),
    "utf8",
);
const schemaSource = readFileSync(
    new URL("../components/editor/blocknote-schema.ts", import.meta.url),
    "utf8",
);
const postFormSource = readFileSync(
    new URL("../components/cms/post-form.tsx", import.meta.url),
    "utf8",
);
const unsavedChangesSource = readFileSync(
    new URL("../hooks/use-unsaved-changes.tsx", import.meta.url),
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

test("BlockNote editor enables multi-column blocks consistently", () => {
    assert.match(schemaSource, /@blocknote\/xl-multi-column/);
    assert.match(
        schemaSource,
        /withMultiColumn\(BlockNoteSchema\.create\(\)\)/,
    );
    assert.match(schemaSource, /multiColumnDropCursor/);
    assert.match(schemaSource, /getMultiColumnSlashMenuItems\(editor\)/);
    assert.match(schemaSource, /multiColumnLocales\.vi/);
    assert.match(editorSource, /schema: blockNoteSchema/);
    assert.match(editorSource, /dropCursor: multiColumnDropCursor/);
    assert.match(editorSource, /slashMenu=\{false\}/);
    assert.match(
        editorSource,
        /<SuggestionMenuController[\s\S]*?getBlockNoteSlashMenuItems\(editor, query\)/,
    );
    assert.match(readonlySource, /schema: blockNoteSchema/);
    assert.match(aiSource, /useBlockNoteEditor\(blockNoteSchema\)/);
    assert.match(aiSource, /getBlockNoteSlashMenuItems\(/);
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

test("Post form unsaved-change saves wait for Inertia validation result", () => {
    assert.match(
        postFormSource,
        /pendingSubmitOptionsRef = useRef<PostFormSubmitOptions \| null>\(null\)/,
    );
    assert.match(
        postFormSource,
        /return new Promise<boolean>\(\(resolve\) => \{/,
    );
    assert.match(
        postFormSource,
        /onError: \(\) => \{[\s\S]*?resolve\(false\);[\s\S]*?\}/,
    );
    assert.match(
        postFormSource,
        /onSuccess: \(\) => \{[\s\S]*?resolve\(true\);[\s\S]*?\}/,
    );
    assert.match(
        postFormSource,
        /return triggerSubmitWithStatus\(targetStatus, \{\}\);/,
    );
    assert.match(
        postFormSource,
        /onSubmit\(form\.data, form, submitOptions\);/,
    );
    assert.match(postFormSource, /function handleInvalid/);
    assert.match(postFormSource, /completePendingSubmit\(false\);/);
    assert.match(postFormSource, /onInvalid=\{handleInvalid\}/);
});

test("Unsaved changes dialog closes when save fails validation", () => {
    assert.match(
        unsavedChangesSource,
        /if \(allSaved\) \{[\s\S]*?continuePendingNavigation\(\);[\s\S]*?return;[\s\S]*?\}/,
    );
    assert.match(
        unsavedChangesSource,
        /setIsModalOpen\(false\);[\s\S]*?pendingNavigationRef\.current = null;/,
    );
});

test("Pending post edit mode collapses workflow actions into a single save button", () => {
    assert.match(
        postFormSource,
        /const isPendingEdit = Boolean\([\s\S]*initialValues\.id && initialValues\.status === "pending"/,
    );
    assert.match(
        postFormSource,
        /const primarySubmitStatus: "pending" \| "published" = isPendingEdit[\s\S]*\? "pending"/,
    );
    assert.match(
        postFormSource,
        /const primarySubmitLabel = isPendingEdit[\s\S]*\? "Lưu"/,
    );
    assert.match(
        postFormSource,
        /className=\{isPendingEdit \? "hidden" : undefined\}/,
    );
    assert.match(postFormSource, /canPublish &&[\s\S]*!isPendingEdit \? \(/);
});
