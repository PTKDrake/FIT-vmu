import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const layoutsSource = readFileSync(
    new URL("../lib/puck/blocks/layouts.tsx", import.meta.url),
    "utf8",
);
const gridSource = readFileSync(
    new URL("../lib/puck/blocks/grid.tsx", import.meta.url),
    "utf8",
);
const flexSource = readFileSync(
    new URL("../lib/puck/blocks/flex.tsx", import.meta.url),
    "utf8",
);
const dataSource = readFileSync(
    new URL("../lib/puck/page-builder-data.ts", import.meta.url),
    "utf8",
);
const siteLayoutFrameSource = readFileSync(
    new URL("../lib/puck/blocks/site-layout-frame.tsx", import.meta.url),
    "utf8",
);
const layoutConfigsSource = readFileSync(
    new URL("../lib/puck/configs/layout-configs.tsx", import.meta.url),
    "utf8",
);
const siteLayoutBuilderDataSource = readFileSync(
    new URL("../lib/puck/site-layout-builder-data.ts", import.meta.url),
    "utf8",
);
const contentSource = readFileSync(
    new URL("../lib/puck/blocks/content.tsx", import.meta.url),
    "utf8",
);
const layoutBuilderSource = readFileSync(
    new URL("../components/layout-builder/puck-layout-builder.tsx", import.meta.url),
    "utf8",
);
const siteLayoutShellSource = readFileSync(
    new URL("../components/site-layout/site-layout-shell.tsx", import.meta.url),
    "utf8",
);
const siteLayoutBuilderEditorSource = readFileSync(
    new URL("../components/layout-builder/site-layout-builder-editor.tsx", import.meta.url),
    "utf8",
);
const siteLayoutOutlinePluginSource = readFileSync(
    new URL("../components/layout-builder/site-layout-outline-plugin.tsx", import.meta.url),
    "utf8",
);

test("layout blocks expose clearer Vietnamese labels for editor fields", () => {
    assert.match(layoutsSource, /label: "Giới hạn chiều rộng \(Container\)"/);
    assert.match(layoutsSource, /label: "2 cột nội dung"/);
    assert.match(layoutsSource, /label: "Khoảng cách trên và dưới"/);
    assert.match(layoutsSource, /label: "Canh nội dung theo chiều dọc"/);
    assert.match(gridSource, /label: "Số cột trên desktop"/);
    assert.match(flexSource, /label: "Phân bố phần tử theo trục chính"/);
});

test("puck note blocks use a quieter accent treatment instead of circular indicators", () => {
    assert.match(contentSource, /indicator=\{false\}/);
    assert.match(contentSource, /border-l-3 px-4 py-3/);
    assert.match(contentSource, /text-sm\/relaxed opacity-85/);
});

test("layout blocks include common design fields for spacing and presentation", () => {
    assert.match(layoutsSource, /export function getInsetYClass/);
    assert.match(layoutsSource, /insetY: \{/);
    assert.match(layoutsSource, /paddingX: \{/);
    assert.match(layoutsSource, /backgroundPosition: \{/);
    assert.match(layoutsSource, /backgroundSize: \{/);
    assert.match(layoutsSource, /borderRadius: \{/);
    assert.match(layoutsSource, /horizontalPadding: \{/);
    assert.match(gridSource, /gapX: \{/);
    assert.match(gridSource, /gapY: \{/);
    assert.match(gridSource, /insetY: \{/);
    assert.match(gridSource, /justifyItems: \{/);
    assert.match(flexSource, /gapX: \{/);
    assert.match(flexSource, /gapY: \{/);
    assert.match(flexSource, /insetY: \{/);
});

test("puck layout primitives use container-aware responsive classes", () => {
    assert.match(flexSource, /@container flex min-h-16 min-w-0/);
    assert.doesNotMatch(flexSource, /min-w-xl/);
    assert.match(flexSource, /@3xl:flex-row/);
    assert.match(gridSource, /@container grid min-h-16 min-w-0/);
    assert.match(gridSource, /@md:grid-cols-2/);
    assert.match(gridSource, /@5xl:grid-cols-3/);
    assert.match(layoutsSource, /@container w-full min-w-0/);
    assert.match(layoutsSource, /@3xl:grid-cols-2/);
});

test("page builder data types stay aligned with the new layout fields", () => {
    assert.match(
        dataSource,
        /SiteLayoutFrame: PuckSurfaceStyleProps & \{\s+className\?: string;/,
    );
    assert.match(
        dataSource,
        /insetY\?: "none" \| "xs" \| "sm" \| "md" \| "lg"/,
    );
    assert.match(
        dataSource,
        /layoutPreset\?: "default" \| "headerBrand"/,
    );
    assert.match(dataSource, /fullWidthOnMobile\?: boolean/);
    assert.match(dataSource, /autoWidthFromMd\?: boolean/);
    assert.match(dataSource, /noShrinkFromMd\?: boolean/);
    assert.match(
        dataSource,
        /layoutPreset\?: "default" \| "containedWide"/,
    );
    assert.match(dataSource, /align\?: "left" \| "center" \| "right"/);
    assert.match(dataSource, /maxWidth\?: "none" \| "4xl"/);
    assert.match(
        dataSource,
        /layoutPreset\?: "default" \| "headerPrimary" \| "footerMenu"/,
    );
    assert.match(dataSource, /growFromMd\?: boolean/);
    assert.match(dataSource, /basisFromMd\?: "none" \| "44rem"/);
    assert.match(
        dataSource,
        /textAlignFromLg\?: "inherit" \| "left" \| "center" \| "right"/,
    );
    assert.match(
        dataSource,
        /positionFromLg\?: "inherit" \| "start" \| "center" \| "end"/,
    );
    assert.match(
        dataSource,
        /layoutPreset\?: "default" \| "footerContact"/,
    );
    assert.match(
        dataSource,
        /layoutPreset\?: "default" \| "headerActions"/,
    );
    assert.match(dataSource, /paddingX\?: "none" \| "sm" \| "md" \| "lg"/);
    assert.match(
        dataSource,
        /backgroundPosition\?: "top" \| "center" \| "bottom"/,
    );
    assert.match(
        dataSource,
        /justifyItems\?: "start" \| "center" \| "end" \| "stretch"/,
    );
    assert.match(
        dataSource,
        /horizontalPadding\?: "none" \| "sm" \| "md" \| "lg"/,
    );
});

test("site layout builder uses one frame with four puck slots", () => {
    assert.match(dataSource, /SiteLayoutFrame: PuckSurfaceStyleProps & \{/);
    assert.match(layoutConfigsSource, /permissions:\s*\{\s*insert:\s*false,\s*\}/);
    assert.match(siteLayoutFrameSource, /defaultProps: \{/);
    assert.match(siteLayoutFrameSource, /permissions: \{/);
    assert.match(siteLayoutFrameSource, /delete: false/);
    assert.match(siteLayoutFrameSource, /drag: false/);
    assert.match(siteLayoutFrameSource, /duplicate: false/);
    assert.match(siteLayoutFrameSource, /insert: false/);
    assert.match(siteLayoutFrameSource, /surfacePadding: "md"/);
    assert.match(siteLayoutFrameSource, /className: ""/);
    assert.match(
        siteLayoutFrameSource,
        /className: \{\s+type: "text",\s+label: "Lớp CSS bổ sung",\s+\}/,
    );
    assert.match(siteLayoutFrameSource, /header: \{\s+type: "slot"/);
    assert.match(siteLayoutFrameSource, /left: \{\s+type: "slot"/);
    assert.match(siteLayoutFrameSource, /right: \{\s+type: "slot"/);
    assert.match(siteLayoutFrameSource, /footer: \{\s+type: "slot"/);
    assert.match(siteLayoutFrameSource, /siteLayoutSlotClassName =/);
    assert.match(
        siteLayoutFrameSource,
        /getSurfaceShadowClass\(surfaceShadow\),\s+className,/,
    );
    assert.match(siteLayoutFrameSource, /<Header className=\{slotClassName\} minEmptyHeight=\{120\} \/>/);
    assert.match(siteLayoutFrameSource, /<Left className=\{slotClassName\} minEmptyHeight=\{200\} \/>/);
    assert.match(siteLayoutFrameSource, /<Right className=\{slotClassName\} minEmptyHeight=\{200\} \/>/);
    assert.match(siteLayoutFrameSource, /<Footer className=\{slotClassName\} minEmptyHeight=\{120\} \/>/);
    assert.match(siteLayoutFrameSource, /"SocialLinks"/);
    assert.match(siteLayoutFrameSource, /"NewsletterForm"/);
    assert.match(siteLayoutFrameSource, /"CopyrightBar"/);
    assert.match(
        siteLayoutFrameSource,
        /<SiteLayoutShellFrame/,
    );
    assert.match(layoutConfigsSource, /export const layoutBuilderConfig/);
    assert.match(layoutConfigsSource, /const layoutBuilderComponentNames = \[/);
    assert.match(layoutConfigsSource, /"SiteLayoutFrame"/);
    assert.match(siteLayoutShellSource, /export function SiteLayoutShellFrame/);
    assert.match(siteLayoutBuilderEditorSource, /plugins=\{\[createSiteLayoutOutlinePlugin\(\)\]\}/);
    assert.match(siteLayoutOutlinePluginSource, /name: "outline"/);
    assert.match(siteLayoutOutlinePluginSource, /Header/);
    assert.match(siteLayoutOutlinePluginSource, /Left sidebar/);
    assert.match(siteLayoutOutlinePluginSource, /Right sidebar/);
    assert.match(siteLayoutOutlinePluginSource, /Footer/);
});

test("site layout builder data helpers compose and split slot payloads", () => {
    assert.match(
        siteLayoutBuilderDataSource,
        /export function createCombinedSiteLayoutData/,
    );
    assert.match(
        siteLayoutBuilderDataSource,
        /export function splitCombinedSiteLayoutData/,
    );
    assert.match(
        siteLayoutBuilderDataSource,
        /export function sanitizeCombinedSiteLayoutData/,
    );
    assert.match(
        siteLayoutBuilderDataSource,
        /item\.type === "SiteLayoutFrame"/,
    );
    assert.match(siteLayoutBuilderDataSource, /header_data: serializeSlotData/);
    assert.match(siteLayoutBuilderDataSource, /footer_data: serializeSlotData/);
    assert.match(layoutBuilderSource, /normalizeData\?:/);
    assert.match(layoutBuilderSource, /key=\{`\$\{editorKey\}:\$\{editorRevision\}`\}/);
    assert.match(layoutBuilderSource, /setEditorRevision/);
    assert.match(layoutBuilderSource, /layoutBuilderPreviewFrameStyles/);
    assert.match(layoutBuilderSource, /#vmu-layout-builder-preview-fixes/);
    assert.match(
        layoutBuilderSource,
        /data-puck-component\]:has\(\[data-vmu-puck-block="navigation-menu"\]\[data-vmu-navigation-orientation="horizontal"\]\)/,
    );
});
