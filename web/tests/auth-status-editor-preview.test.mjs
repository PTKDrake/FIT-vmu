import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const authStatusSource = readFileSync(
    new URL("../lib/puck/blocks/auth-status.tsx", import.meta.url),
    "utf8",
);

test("auth status preview is neutralized inside puck editor iframes", () => {
    assert.match(authStatusSource, /window\.self !== window\.top/);
    assert.match(authStatusSource, /Tài khoản/);
    assert.match(authStatusSource, /Xem trước layout/);
});
