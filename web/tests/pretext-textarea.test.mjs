import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const pretextTextareaSource = readFileSync(
    new URL("../components/ui/textarea.tsx", import.meta.url),
    "utf8",
);
const postListSectionSource = readFileSync(
    new URL("../components/public/post-list-section.tsx", import.meta.url),
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
const pageFormDialogSource = readFileSync(
    new URL("../components/cms/page-form-dialog.tsx", import.meta.url),
    "utf8",
);
const postsIndexSource = readFileSync(
    new URL("../pages/cms/posts/index.tsx", import.meta.url),
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

test("post list categories collapse with pretext width measurement", () => {
    assert.match(postListSectionSource, /@chenglou\/pretext/);
    assert.match(postListSectionSource, /measureNaturalWidth/);
    assert.match(postListSectionSource, /prepareWithSegments/);
    assert.match(
        postListSectionSource,
        /measuredCategoryBadgeWidths = new Map/,
    );
    assert.match(postListSectionSource, /new ResizeObserver/);
    assert.match(
        postListSectionSource,
        /\+\{visibleCategoryBadges\.hiddenCount\}/,
    );
    assert.doesNotMatch(postListSectionSource, /categoryNames\[0\]/);
});

test("cms forms opt into textarea autosize", () => {
    assert.match(pageFormDialogSource, /<Textarea\s+autosize/);
    assert.match(pageCreateSource, /<Textarea\s+autosize/);
    assert.match(pageEditSource, /<Textarea\s+autosize/);
    assert.match(postFormSource, /<Textarea\s+autosize/);
    assert.match(postsIndexSource, /<Textarea\s+autosize/);
});
