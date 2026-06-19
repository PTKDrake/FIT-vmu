import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const renderSource = readFileSync(
    new URL("../components/page-builder/puck-page-render.tsx", import.meta.url),
    "utf8",
);
const siteLayoutShellSource = readFileSync(
    new URL("../components/site-layout/site-layout-shell.tsx", import.meta.url),
    "utf8",
);
const layoutConfigsSource = readFileSync(
    new URL("../lib/puck/configs/layout-configs.tsx", import.meta.url),
    "utf8",
);
const defaultSiteLayoutSeederSource = readFileSync(
    new URL(
        "../../database/seeders/DefaultSiteLayoutSeeder.php",
        import.meta.url,
    ),
    "utf8",
);

test("public puck rendering provides container boundaries for responsive blocks", () => {
    assert.match(
        renderSource,
        /vmu-puck-page-render @container\/puck w-full min-w-0/,
    );
    assert.doesNotMatch(renderSource, /createPublicRenderConfig/);
    assert.doesNotMatch(renderSource, /mergePublicBlockClassName/);
    assert.match(
        layoutConfigsSource,
        /@container\/puck-slot flex h-full min-h-full min-w-0/,
    );
    assert.match(siteLayoutShellSource, /@container\/layout-main min-w-0/);
    assert.match(
        siteLayoutShellSource,
        /@container\/layout-side w-full min-w-0 lg:w-72/,
    );
    assert.match(siteLayoutShellSource, /export function SiteLayoutShellFrame/);
    assert.match(
        siteLayoutShellSource,
        /getSiteLayoutBodyClassName\(\s*Boolean\(left\),\s*Boolean\(right\),\s*isPuckPage\s*,?\s*\)/,
    );
    assert.match(siteLayoutShellSource, /mx-auto grid w-full\$\{maxWidth\}/);
    assert.match(
        siteLayoutShellSource,
        /lg:grid-cols-\[minmax\(0,1fr\)_18rem\]/,
    );
    assert.match(
        siteLayoutShellSource,
        /lg:grid-cols-\[18rem_minmax\(0,1fr\)_18rem\]/,
    );
    assert.match(siteLayoutShellSource, /lg:w-72/);
});

test("default post layout seed wraps the sidebar blocks in a sticky container", () => {
    assert.match(
        defaultSiteLayoutSeederSource,
        /'key' => 'default-post-layout'/,
    );
    assert.match(defaultSiteLayoutSeederSource, /'type' => 'Container'/);
    assert.match(defaultSiteLayoutSeederSource, /'maxWidth' => 'full'/);
    assert.match(defaultSiteLayoutSeederSource, /'horizontalPadding' => 'md'/);
    assert.match(defaultSiteLayoutSeederSource, /'stackChildren' => true/);
    assert.match(defaultSiteLayoutSeederSource, /'childGap' => 'lg'/);
    assert.match(defaultSiteLayoutSeederSource, /'stickyOnDesktop' => true/);
    assert.match(defaultSiteLayoutSeederSource, /'stickyTop' => 'lg'/);
    assert.match(defaultSiteLayoutSeederSource, /'type' => 'SidebarSupport'/);
});
