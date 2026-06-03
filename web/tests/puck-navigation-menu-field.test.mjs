import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("NavigationMenu Puck block uses external data source for menuId", async () => {
  const source = await readFile("web/lib/puck/blocks/dynamic.tsx", "utf8");

  assert.match(source, /menuId:\s*\{\s*type:\s*"select"/s);
  assert.match(source, /layoutBuilderRoutes\.sources\.url\("navigation-menus"\)/);
  assert.match(source, /resolveFields:\s*async/);
  assert.match(source, /Menu đầu tiên khả dụng/);
});
