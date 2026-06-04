import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const sharedSource = readFileSync(
  new URL("../lib/puck/blocks/shared.tsx", import.meta.url),
  "utf8",
);
const pageConfigSource = readFileSync(
  new URL("../lib/puck/configs/page-config.tsx", import.meta.url),
  "utf8",
);

test("page builder components are normalized to backfill select defaults", () => {
  assert.match(pageConfigSource, /withSelectFieldDefaults\(\{/);
  assert.match(sharedSource, /nextProps\[fieldName\] = field\.options\[0\]\?\.value;/);
});

test("array fields also receive select defaults for new items", () => {
  assert.match(sharedSource, /defaultItemProps: nextDefaultItemProps/);
  assert.match(sharedSource, /field\.type === "array"/);
});
