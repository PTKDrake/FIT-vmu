import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const exportMenuSource = readFileSync(
    new URL("../components/page-builder/puck-export-menu.tsx", import.meta.url),
    "utf8",
);
const pageBuilderSource = readFileSync(
    new URL("../components/page-builder/puck-page-builder.tsx", import.meta.url),
    "utf8",
);
const layoutBuilderSource = readFileSync(
    new URL("../components/layout-builder/puck-layout-builder.tsx", import.meta.url),
    "utf8",
);
const pageBuilderPageSource = readFileSync(
    new URL("../pages/cms/pages/builder.tsx", import.meta.url),
    "utf8",
);
const layoutEditPageSource = readFileSync(
    new URL("../pages/cms/layouts/edit.tsx", import.meta.url),
    "utf8",
);

test("puck export menu supports both file download and clipboard copy", () => {
    assert.match(exportMenuSource, /TooltipContent>Xuất JSON builder</);
    assert.match(exportMenuSource, /aria-label="Xuất JSON builder"/);
    assert.match(exportMenuSource, /Tải file JSON/);
    assert.match(exportMenuSource, /Sao chép clipboard/);
    assert.match(exportMenuSource, /Sao chép cho Seeder/);
    assert.match(exportMenuSource, /serializePuckPageData\(getData\(\)\)/);
    assert.match(exportMenuSource, /createPuckSeederExpression\(getData\(\), exportTarget\)/);
    assert.match(exportMenuSource, /navigator\.clipboard|useClipboard/);
    assert.match(exportMenuSource, /URL\.createObjectURL/);
});

test("site layout seeder export emits direct assignment lines instead of array spread", () => {
    const seederExportSource = readFileSync(
        new URL("../lib/puck/seeder-export.ts", import.meta.url),
        "utf8",
    );

    assert.match(seederExportSource, /\$layoutData = /);
    assert.match(seederExportSource, /'header_data' => \$layoutData\['header_data'\],/);
    assert.doesNotMatch(seederExportSource, /\.\.\.PuckSeedData::splitSiteLayout/);
});

test("page and layout builders gate export controls behind explicit permissions", () => {
    assert.match(pageBuilderSource, /canExport\?: boolean;/);
    assert.match(pageBuilderSource, /<PuckExportMenu/);
    assert.match(pageBuilderSource, /exportTarget="page"/);
    assert.match(layoutBuilderSource, /canExport\?: boolean;/);
    assert.match(layoutBuilderSource, /<PuckExportMenu/);
    assert.match(layoutBuilderSource, /exportTarget="site-layout"/);
    assert.match(pageBuilderPageSource, /canExport=\{can\.exportPuckJson\}/);
    assert.match(layoutEditPageSource, /canExport=\{can\.exportPuckJson\}/);
});
