import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const pretextTextareaSource = readFileSync(
    new URL("../components/ui/textarea.tsx", import.meta.url),
    "utf8",
);
const pageCreateSource = readFileSync(
    new URL("../pages/cms/pages/create.tsx", import.meta.url),
    "utf8",
);
const pageEditSource = readFileSync(
    new URL("../pages/cms/pages/edit.tsx", import.meta.url),
    "utf8",
);
const postFormSource = readFileSync(
    new URL("../components/cms/post-form.tsx", import.meta.url),
    "utf8",
);

test("pretext textarea uses DOM-free multiline measurement", () => {
    assert.match(pretextTextareaSource, /@chenglou\/pretext/);
    assert.match(
        pretextTextareaSource,
        /prepare\(textarea\.value, resolveFont\(style\), \{/,
    );
    assert.match(pretextTextareaSource, /whiteSpace: "pre-wrap"/);
    assert.match(pretextTextareaSource, /layout\(/);
    assert.match(
        pretextTextareaSource,
        /new ResizeObserver\(scheduleMeasurement\)/,
    );
    assert.match(pretextTextareaSource, /autosize\?: boolean/);
});

test("cms forms opt into the pretext textarea wrapper", () => {
    assert.match(pageCreateSource, /PretextTextarea/);
    assert.match(pageEditSource, /PretextTextarea/);
    assert.match(postFormSource, /PretextTextarea/);
    assert.match(postFormSource, /<Textarea\s+autosize/);
});
