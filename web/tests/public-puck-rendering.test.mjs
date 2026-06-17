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

test("public CSS safelists common Puck card utilities stored in content data", () => {
    assert.match(publicCssSource, /@source inline\("/);
    assert.match(publicCssSource, /rounded-2xl/);
    assert.match(publicCssSource, /border-border/);
    assert.match(publicCssSource, /bg-overlay/);
    assert.match(publicCssSource, /shadow-xs/);
});

test("auth status menu links CMS access through the shared gate result", () => {
    assert.match(
        authStatusSource,
        /auth\.permissions\.includes\("view admin dashboard"\)/,
    );
    assert.match(authStatusSource, /cmsDashboard\.url\(\)/);
    assert.match(authStatusSource, /Mở CMS/);
});
