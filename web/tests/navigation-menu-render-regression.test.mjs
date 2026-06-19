import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const dynamicBlocksSource = readFileSync(
    new URL("../lib/puck/blocks/dynamic/navigation.tsx", import.meta.url),
    "utf8",
);
const dynamicSharedSource = readFileSync(
    new URL("../lib/puck/blocks/dynamic/shared.tsx", import.meta.url),
    "utf8",
);
const flexBlockSource = readFileSync(
    new URL("../lib/puck/blocks/flex.tsx", import.meta.url),
    "utf8",
);
const fitNavigationBarSource = readFileSync(
    new URL(
        "../components/page-builder/fit-navigation-bar.tsx",
        import.meta.url,
    ),
    "utf8",
);
const drawerSource = readFileSync(
    new URL("../components/ui/drawer.tsx", import.meta.url),
    "utf8",
);
const siteLayoutShellSource = readFileSync(
    new URL("../components/site-layout/site-layout-shell.tsx", import.meta.url),
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
    assert.match(dynamicBlocksSource, /<NavbarGroup/);
    assert.match(
        dynamicBlocksSource,
        /delayOpenMs=\{orientation === "vertical" \? 0 : 100\}/,
    );
    assert.match(
        dynamicBlocksSource,
        /menuId=\{`puck-navigation-item-\$\{item\.id\}`\}/,
    );
});

test("NavigationMenu block stacks safely before container space allows horizontal layout", () => {
    assert.match(dynamicBlocksSource, /@container\/nav min-w-0 space-y-3/);
    assert.match(
        dynamicBlocksSource,
        /flex-row flex-wrap items-center justify-center/,
    );
    assert.match(dynamicBlocksSource, /whitespace-nowrap/);
    assert.match(
        dynamicBlocksSource,
        /w-full max-w-none min-w-fit md:basis-\[44rem\] md:grow/,
    );
    assert.match(dynamicBlocksSource, /data-vmu-puck-block="navigation-menu"/);
    assert.match(dynamicBlocksSource, /data-vmu-navigation-orientation=/);
    assert.match(flexBlockSource, /data-vmu-puck-block='navigation-menu'/);
    assert.match(flexBlockSource, /data-puck-component\]:has/);
    assert.match(
        flexBlockSource,
        /md:\[&>\[data-puck-component\]:has\(\[data-vmu-puck-block='navigation-menu'\]\)\]:basis-\[44rem\]/,
    );
    assert.match(
        dynamicSharedSource,
        /return "w-full min-w-0 md:grow md:basis-\[44rem\] md:max-w-none"/,
    );
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

test("Fit navigation header creates an unclipped dropdown stacking layer", () => {
    assert.match(fitNavigationBarSource, /relative z-200/);
    assert.match(fitNavigationBarSource, /overflow-visible/);
    assert.match(fitNavigationBarSource, /backdrop-blur/);
    assert.match(fitNavigationBarSource, /<NavbarGroup/);
    assert.match(fitNavigationBarSource, /delayOpenMs=\{100\}/);
    assert.match(fitNavigationBarSource, /backdropBlur=\{false\}/);
    assert.match(
        fitNavigationBarSource,
        /overlay=\{\{ className: "z-\[300\]" \}\}/,
    );
    assert.match(drawerSource, /backdropBlur\?: boolean/);
    assert.match(drawerSource, /backdropBlur = true/);
    assert.match(drawerSource, /backdropBlur \? \{ backdropFilter/);
    assert.match(
        fitNavigationBarSource,
        /aria-label=\{`Mở hoặc đóng menu \$\{item\.title\}`\}/,
    );
    assert.match(fitNavigationBarSource, /href=\{item\.url\}/);
    assert.match(
        fitNavigationBarSource,
        /inset-ring-transparent bg-transparent/,
    );
    assert.match(fitNavigationBarSource, /space-y-1 pl-4/);
    assert.doesNotMatch(fitNavigationBarSource, /Tất cả \{item\.title\}/);
    assert.match(
        fitNavigationBarSource,
        /menuId=\{`fit-navigation-item-\$\{item\.id\}`\}/,
    );
    assert.match(
        siteLayoutShellSource,
        /<header className="relative z-\[200\] overflow-visible">/,
    );
});

test("Fit navigation header falls back to the mobile drawer when desktop items do not fit", () => {
    assert.match(
        fitNavigationBarSource,
        /measureNaturalWidth, prepareWithSegments/,
    );
    assert.match(fitNavigationBarSource, /shouldUseMobileNavigationLayout/);
    assert.match(fitNavigationBarSource, /getDesktopNavigationRequiredWidth/);
    assert.match(
        fitNavigationBarSource,
        /useElementInlineSize\(headerElementRef\)/,
    );
    assert.match(
        fitNavigationBarSource,
        /shouldUseCompactNavigation \? "lg:hidden" : ""/,
    );
    assert.match(
        fitNavigationBarSource,
        /shouldUseCompactNavigation \? "lg:flex" : ""/,
    );
    assert.doesNotMatch(fitNavigationBarSource, /fit-navigation-overflow/);
    assert.doesNotMatch(
        fitNavigationBarSource,
        /desktopNavigationOverflowLabel/,
    );
});
