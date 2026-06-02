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

test("layout blocks expose clearer Vietnamese labels for editor fields", () => {
    assert.match(layoutsSource, /label: "Giới hạn chiều rộng \(Container\)"/);
    assert.match(layoutsSource, /label: "2 cột nội dung"/);
    assert.match(layoutsSource, /label: "Khoảng cách trên và dưới"/);
    assert.match(layoutsSource, /label: "Canh nội dung theo chiều dọc"/);
    assert.match(gridSource, /label: "Số cột trên desktop"/);
    assert.match(flexSource, /label: "Phân bố phần tử theo trục chính"/);
});

test("layout blocks include common design fields for spacing and presentation", () => {
    assert.match(layoutsSource, /paddingX: \{/);
    assert.match(layoutsSource, /backgroundPosition: \{/);
    assert.match(layoutsSource, /backgroundSize: \{/);
    assert.match(layoutsSource, /borderRadius: \{/);
    assert.match(layoutsSource, /horizontalPadding: \{/);
    assert.match(gridSource, /gapX: \{/);
    assert.match(gridSource, /gapY: \{/);
    assert.match(gridSource, /justifyItems: \{/);
    assert.match(flexSource, /gapX: \{/);
    assert.match(flexSource, /gapY: \{/);
});

test("page builder data types stay aligned with the new layout fields", () => {
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
    assert.match(dataSource, /SiteLayoutFrame: \{/);
    assert.match(siteLayoutFrameSource, /header: \{\s+type: "slot"/);
    assert.match(siteLayoutFrameSource, /left: \{\s+type: "slot"/);
    assert.match(siteLayoutFrameSource, /right: \{\s+type: "slot"/);
    assert.match(siteLayoutFrameSource, /footer: \{\s+type: "slot"/);
    assert.match(layoutConfigsSource, /export const layoutBuilderConfig/);
    assert.match(layoutConfigsSource, /components: \["SiteLayoutFrame"\]/);
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
    assert.match(siteLayoutBuilderDataSource, /header_data: serializeSlotData/);
    assert.match(siteLayoutBuilderDataSource, /footer_data: serializeSlotData/);
});
