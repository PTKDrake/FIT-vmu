import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("NavigationMenu Puck block uses external data source for menuId", async () => {
  const source = await readFile("web/lib/puck/blocks/dynamic/navigation.tsx", "utf8");
  const sharedSource = await readFile("web/lib/puck/blocks/dynamic/shared.tsx", "utf8");

  assert.match(source, /menuId:\s*\{\s*type:\s*"select"/s);
  assert.match(sharedSource, /fetchSourceOptions\("navigation-menus"\)/);
  assert.match(source, /resolveFields:\s*async/);
  assert.match(source, /Chưa chọn menu điều hướng/);
  assert.match(source, /isPuckEditorPreview\(\) \? previewMenu : null/);
  assert.match(source, /if \(!menuId && !menu\) \{/);
});

test("FitFooter quick links use external navigation menu source", async () => {
  const source = await readFile("web/lib/puck/blocks/dynamic/footer.tsx", "utf8");
  const sharedSource = await readFile("web/lib/puck/blocks/dynamic/shared.tsx", "utf8");

  assert.match(source, /export const FitFooterComponentConfig/);
  assert.match(source, /quickLinksMenuId:\s*\{\s*type:\s*"select"/s);
  assert.match(sharedSource, /fetchSourceOptions\("navigation-menus"\)/);
  assert.match(source, /resolveFields:\s*async/);
  assert.match(source, /Chưa chọn menu điều hướng/);
  assert.match(source, /quickLinksMenu\?\.items \?\? \[\]/);
});
