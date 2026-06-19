import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const componentCategoriesSource = readFileSync(
    new URL("../lib/puck/component-categories.ts", import.meta.url),
    "utf8",
);
const componentRegistrySource = readFileSync(
    new URL("../lib/puck/component-registry.ts", import.meta.url),
    "utf8",
);
const componentTypesSource = readFileSync(
    new URL("../lib/puck/component-types.ts", import.meta.url),
    "utf8",
);
const pageBuilderDataSource = readFileSync(
    new URL("../lib/puck/page-builder-data.ts", import.meta.url),
    "utf8",
);
const pageBuilderSource = readFileSync(
    new URL("../components/page-builder/puck-page-builder.tsx", import.meta.url),
    "utf8",
);
const layoutBuilderSource = readFileSync(
    new URL(
        "../components/layout-builder/puck-layout-builder.tsx",
        import.meta.url,
    ),
    "utf8",
);

test("page and layout builders share the same four Vietnamese Puck categories", () => {
    assert.match(componentCategoriesSource, /layout_blocks: "Bố cục"/);
    assert.match(componentCategoriesSource, /content_blocks: "Nội dung"/);
    assert.match(componentCategoriesSource, /section_blocks: "Khối dựng sẵn"/);
    assert.match(
        componentCategoriesSource,
        /dynamic_blocks: "Dữ liệu & hệ thống"/,
    );
    assert.match(componentCategoriesSource, /export function createPuckCategories/);
});

test("canonical component aliases are centralized and normalized recursively", () => {
    assert.match(componentTypesSource, /HeroCustom: "FeaturedHero"/);
    assert.match(componentTypesSource, /FitNavigationHeader: "SiteHeader"/);
    assert.match(componentTypesSource, /LatestPosts: "PostFeed"/);
    assert.match(componentTypesSource, /LinkList: "CustomLinkList"/);
    assert.match(
        pageBuilderDataSource,
        /const normalizedType = normalizePuckComponentType\(value\.type\)/,
    );
    assert.match(pageBuilderDataSource, /type: normalizedType/);
    assert.match(pageBuilderDataSource, /return value\.map\(\(item\) => normalizePuckComponentData\(item, config\)\)/);
});

test("canonical registry adds English picker subtitles to every block config", () => {
    assert.match(componentRegistrySource, /metadata:\s*\{\s*\.\.\.\(componentConfig\.metadata \?\? \{\}\),\s*englishName:/s);
    assert.match(componentTypesSource, /FeaturedHero: "Featured Hero"/);
    assert.match(componentTypesSource, /PostDetailHeader: "Post Detail Header"/);
});

test("both builders use the shared drawer item override for subtitle rendering", () => {
    assert.match(pageBuilderSource, /drawerItem: PuckDrawerItem as any/);
    assert.match(layoutBuilderSource, /drawerItem: PuckDrawerItem as any/);
    assert.match(pageBuilderSource, /import \{ PuckDrawerItem \} from "@\/components\/puck\/puck-drawer-item"/);
    assert.match(layoutBuilderSource, /import \{ PuckDrawerItem \} from "@\/components\/puck\/puck-drawer-item"/);
});
