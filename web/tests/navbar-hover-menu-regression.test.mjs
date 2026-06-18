import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const navbarSource = readFileSync(
    new URL("../components/ui/navbar.tsx", import.meta.url),
    "utf8",
);

test("Navbar shared primitives expose hover-driven submenu support", () => {
    assert.match(navbarSource, /const NavbarMenu =/);
    assert.match(navbarSource, /const NavbarGroup =/);
    assert.match(navbarSource, /activeMenuId/);
    assert.match(navbarSource, /requestOpen/);
    assert.match(navbarSource, /requestClose/);
    assert.doesNotMatch(navbarSource, /from "react-aria\/useHover"/);
    assert.match(navbarSource, /onMouseEnter=/);
    assert.match(navbarSource, /onMouseLeave=/);
    assert.match(navbarSource, /const NavbarSubmenu =/);
    assert.match(navbarSource, /onFocusCapture=/);
    assert.match(navbarSource, /delayOpenMs/);
    assert.match(navbarSource, /scheduleOpen/);
    assert.match(navbarSource, /delayCloseMs/);
    assert.match(navbarSource, /scheduleClose/);
    assert.match(navbarSource, /md:after:pointer-events-none/);
    assert.match(navbarSource, /md:after:top-full/);
    assert.match(navbarSource, /md:after:h-3/);
    assert.match(navbarSource, /md:after:z-\[200\]/);
    assert.match(
        navbarSource,
        /isOpen\s*\?\s*"z-\[200\] md:after:pointer-events-auto"/,
    );
    assert.match(navbarSource, /data-open=\{open \? "true" : "false"\}/);
    assert.match(navbarSource, /data-\[open=true\]:visible/);
    assert.match(navbarSource, /md:z-\[210\]/);
    assert.match(navbarSource, /top-\[calc\(100%-0\.25rem\)\]/);
    assert.doesNotMatch(navbarSource, /mt-1\.5/);
    assert.match(
        navbarSource,
        /export \{ NavbarGroup, NavbarItem, NavbarMenu, NavbarSubmenu \}/,
    );
});
