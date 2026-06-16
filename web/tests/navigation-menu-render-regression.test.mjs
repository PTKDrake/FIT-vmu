import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const dynamicBlocksSource = readFileSync(
  new URL("../lib/puck/blocks/dynamic.tsx", import.meta.url),
  "utf8",
);
const flexBlockSource = readFileSync(
  new URL("../lib/puck/blocks/flex.tsx", import.meta.url),
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

test("NavigationMenu block stacks safely before container space allows horizontal layout", () => {
  assert.match(dynamicBlocksSource, /@container\/nav min-w-0 space-y-3/);
  assert.match(dynamicBlocksSource, /flex-row flex-wrap items-center justify-center/);
  assert.match(dynamicBlocksSource, /whitespace-nowrap/);
  assert.match(dynamicBlocksSource, /w-full max-w-none min-w-fit md:basis-\[44rem\] md:grow/);
  assert.match(dynamicBlocksSource, /data-vmu-puck-block="navigation-menu"/);
  assert.match(dynamicBlocksSource, /data-vmu-navigation-orientation=/);
  assert.match(flexBlockSource, /data-vmu-puck-block='navigation-menu'/);
  assert.match(flexBlockSource, /data-puck-component\]:has/);
  assert.match(flexBlockSource, /md:\[&>\[data-puck-component\]:has\(\[data-vmu-puck-block='navigation-menu'\]\)\]:basis-\[44rem\]/);
  assert.match(dynamicBlocksSource, /return "w-full min-w-0 md:grow md:basis-\[44rem\] md:max-w-none"/);
  assert.match(dynamicBlocksSource, /growFromMd \? "md:grow" : ""/);
  assert.doesNotMatch(dynamicBlocksSource, /growFromMd \? "md:flex-1" : ""/);
  assert.doesNotMatch(dynamicBlocksSource, /md:flex-1 md:basis-\[44rem\]/);
});

test("NavigationMenu block includes a dedicated mobile drawer path for horizontal menus", () => {
  assert.match(dynamicBlocksSource, /function MobileNavigationMenu/);
  assert.match(dynamicBlocksSource, /mobileButtonLabel/);
  assert.match(dynamicBlocksSource, /mobileLogoUrl/);
  assert.match(dynamicBlocksSource, /fixed inset-0 z-\[120\] md:hidden/);
  assert.match(dynamicBlocksSource, /function MobileNavigationMenuEntry/);
});
