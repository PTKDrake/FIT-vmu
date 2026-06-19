import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const pnpmWorkspaceSource = readFileSync(
    new URL("../../pnpm-workspace.yaml", import.meta.url),
    "utf8",
);
const mediaSelectorSource = readFileSync(
    new URL("../components/cms/media-selector.tsx", import.meta.url),
    "utf8",
);
const sectionsSource = readFileSync(
    new URL("../lib/puck/blocks/sections.tsx", import.meta.url),
    "utf8",
);
const publicPostCategorySource = readFileSync(
    new URL("../pages/public/post-category.tsx", import.meta.url),
    "utf8",
);

test("pnpm workspace enables package release hardening", () => {
    assert.match(pnpmWorkspaceSource, /minimumReleaseAge:\s+10080/);
    assert.match(pnpmWorkspaceSource, /trustPolicy:\s+no-downgrade/);
});

test("media selector hoists pagination helpers and avoids index keys", () => {
    assert.match(
        mediaSelectorSource,
        /const MEDIA_LIBRARY_SKELETON_KEYS = Array\.from/,
    );
    assert.match(mediaSelectorSource, /function buildPaginationPages\(/);
    assert.match(mediaSelectorSource, /key=\{item\.key\}/);
    assert.doesNotMatch(mediaSelectorSource, /key=\{index\}/);
});

test("media selector supports uploading pasted clipboard images", () => {
    assert.match(mediaSelectorSource, /function getImageFilesFromClipboard\(/);
    assert.match(mediaSelectorSource, /item\.kind === "file"/);
    assert.match(mediaSelectorSource, /ACCEPTED_IMAGE_MIME_TYPES\.includes/);
    assert.match(mediaSelectorSource, /const handlePasteUpload = \(/);
    assert.match(
        mediaSelectorSource,
        /activeTab === "upload" \? handlePasteUpload : undefined/,
    );
    assert.match(mediaSelectorSource, /dán ảnh từ clipboard/);
});

test("public content lists use stable keys derived from data", () => {
    assert.match(
        publicPostCategorySource,
        /key=\{`\$\{crumb\.url \?\? "current"\}:\$\{crumb\.label\}`\}/,
    );
    assert.match(
        sectionsSource,
        /key=\{`\$\{stat\.label\}:\$\{stat\.value\}`\}/,
    );
    assert.match(sectionsSource, /key=\{item\.question\}/);
    assert.match(
        sectionsSource,
        /key=\{`\$\{testimonial\.name\}:\$\{testimonial\.roleAndCompany\}`\}/,
    );
    assert.match(
        sectionsSource,
        /key=\{`\$\{item\.title\}:\$\{item\.imageUrl \?\? "placeholder"\}`\}/,
    );
});
