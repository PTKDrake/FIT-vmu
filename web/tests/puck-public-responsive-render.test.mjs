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
    assert.match(
        siteLayoutShellSource,
        /@container\/layout-main min-w-0 flex-1/,
    );
    assert.match(
        siteLayoutShellSource,
        /@container\/layout-side w-full min-w-0 shrink-0/,
    );
    assert.match(siteLayoutShellSource, /export function SiteLayoutShellFrame/);
    assert.match(
        siteLayoutShellSource,
        /mx-auto flex w-full min-w-0 flex-col lg:flex-row lg:items-start/,
    );
    assert.match(siteLayoutShellSource, /lg:w-72/);
});

test("default site layout seed keeps header navigation responsive", () => {
    assert.match(defaultSiteLayoutSeederSource, /'id' => 'public-header-row'/);
    assert.match(defaultSiteLayoutSeederSource, /'wrap' => true/);
    assert.match(defaultSiteLayoutSeederSource, /'childWidth' => 'auto'/);
    assert.match(defaultSiteLayoutSeederSource, /'insetY' => 'sm'/);
    assert.match(
        defaultSiteLayoutSeederSource,
        /'fullWidthOnMobile' => true/,
    );
    assert.match(
        defaultSiteLayoutSeederSource,
        /'buttonLabel' => 'Đăng nhập'/,
    );
    assert.match(
        defaultSiteLayoutSeederSource,
        /'growFromMd' => true/,
    );
    assert.match(
        defaultSiteLayoutSeederSource,
        /'id' => 'public-footer-container'/,
    );
    assert.match(defaultSiteLayoutSeederSource, /'maxWidth' => 'xl'/);
    assert.match(defaultSiteLayoutSeederSource, /'insetY' => 'lg'/);
    assert.match(defaultSiteLayoutSeederSource, /'textAlignFromLg' => 'left'/);
    assert.match(defaultSiteLayoutSeederSource, /'type' => 'Grid'/);
});
