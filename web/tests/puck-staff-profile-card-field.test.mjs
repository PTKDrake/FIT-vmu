import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("StaffProfileCard Puck block loads selectable staff options from source data", async () => {
  const source = await readFile("web/lib/puck/blocks/dynamic.tsx", "utf8");

  assert.match(source, /StaffProfileCardComponentConfig/);
  assert.match(source, /staffId:\s*\{\s*type:\s*"select"/s);
  assert.match(source, /layoutBuilderRoutes\.sources\.url\("staff"\)/);
  assert.match(source, /label:\s*"Chưa chọn cán bộ"/);
  assert.match(source, /resolveFields:\s*async/);
  assert.match(source, /<StaffProfileCardBlock \{\.\.\.props\} \/>/);
});
