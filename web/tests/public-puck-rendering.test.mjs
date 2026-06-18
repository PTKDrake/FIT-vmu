import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const publicCssSource = readFileSync(
    new URL("../../resources/css/public.css", import.meta.url),
    "utf8",
);
const authStatusSource = readFileSync(
    new URL("../lib/puck/blocks/auth-status.tsx", import.meta.url),
    "utf8",
);
const renderSource = readFileSync(
    new URL("../components/page-builder/puck-page-render.tsx", import.meta.url),
    "utf8",
);
const pageBuilderDataSource = readFileSync(
    new URL("../lib/puck/page-builder-data.ts", import.meta.url),
    "utf8",
);

test("public CSS safelists common Puck card utilities stored in content data", () => {
    assert.match(publicCssSource, /@source inline\("/);
    assert.match(publicCssSource, /rounded-2xl/);
    assert.match(publicCssSource, /border-border/);
    assert.match(publicCssSource, /bg-overlay/);
    assert.match(publicCssSource, /shadow-xs/);
    assert.match(publicCssSource, /@container/);
    assert.match(publicCssSource, /@md:grid-cols-2/);
    assert.match(publicCssSource, /@5xl:grid-cols-6/);
    assert.match(publicCssSource, /bg-transparent/);
    assert.match(publicCssSource, /bg-muted\/40/);
    assert.match(publicCssSource, /bg-primary-subtle\/10/);
    assert.match(publicCssSource, /bg-info-subtle\/10/);
    assert.match(publicCssSource, /bg-accent-subtle-fg/);
    assert.match(publicCssSource, /border-0/);
    assert.match(publicCssSource, /rounded-full/);
    assert.match(publicCssSource, /p-0/);
    assert.match(publicCssSource, /gap-x-12/);
    assert.match(publicCssSource, /pt-16/);
    assert.match(publicCssSource, /sm:min-h-\[750px\]/);
    assert.match(publicCssSource, /md:flex-row-reverse/);
});

test("auth status menu links CMS access through the shared gate result", () => {
    assert.match(
        authStatusSource,
        /auth\.permissions\.includes\("view admin dashboard"\)/,
    );
    assert.match(authStatusSource, /cmsDashboard\.url\(\)/);
    assert.match(authStatusSource, /Mở CMS/);
});

test("public Puck render hydrates missing block fields from builder defaults", () => {
    assert.match(
        renderSource,
        /applyPuckDefaultProps\(parsedData, resolvedConfig\)/,
    );
    assert.match(
        pageBuilderDataSource,
        /export function applyPuckDefaultProps/,
    );
    assert.match(pageBuilderDataSource, /componentConfig\?\.defaultProps/);
    assert.match(pageBuilderDataSource, /if \(value === undefined\)/);
    assert.match(
        pageBuilderDataSource,
        /normalizePuckComponentList\(\s+data\.content,\s+config,\s+\)/,
    );
    assert.match(pageBuilderDataSource, /normalizePuckZones/);
});
