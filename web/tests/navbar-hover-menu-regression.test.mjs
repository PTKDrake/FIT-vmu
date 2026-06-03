import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const navbarSource = readFileSync(
  new URL("../components/ui/navbar.tsx", import.meta.url),
  "utf8",
);

test("Navbar shared primitives expose hover-driven submenu support", () => {
  assert.match(navbarSource, /from "react-aria\/useHover"/);
  assert.match(navbarSource, /const NavbarMenu =/);
  assert.match(navbarSource, /onHoverChange:\s*handleOpenState/);
  assert.match(navbarSource, /const NavbarSubmenu =/);
  assert.match(navbarSource, /onFocusCapture:/);
  assert.match(navbarSource, /delayCloseMs/);
  assert.match(navbarSource, /scheduleClose/);
});
