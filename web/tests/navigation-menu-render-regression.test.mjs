import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const dynamicBlocksSource = readFileSync(
  new URL("../lib/puck/blocks/dynamic.tsx", import.meta.url),
  "utf8",
);

test("NavigationMenu block uses shared navbar primitives without pulling in menu primitives", () => {
  assert.match(dynamicBlocksSource, /from "@\/components\/ui\/navbar"/);
  assert.doesNotMatch(dynamicBlocksSource, /from "@\/components\/ui\/menu"/);
  assert.doesNotMatch(dynamicBlocksSource, /<NavbarProvider>/);
  assert.match(dynamicBlocksSource, /<nav\s+aria-label=\{menu\.name\}/);
  assert.match(dynamicBlocksSource, /<NavbarItem/);
  assert.match(dynamicBlocksSource, /<NavbarMenu/);
  assert.match(dynamicBlocksSource, /<NavbarSubmenu/);
});
