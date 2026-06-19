import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("news custom puck block renders from dynamic posts", async () => {
    const source = await readFile("web/lib/puck/blocks/news.tsx", "utf8");

    assert.match(source, /usePuckDynamicData\(\)/);
    assert.match(source, /parseCategorySelections\(includedCategories\)/);
    assert.match(source, /parseCategorySelections\(excludedCategories\)/);
    assert.match(source, /featuredPost\.thumbnailUrl/);
    assert.match(source, /featuredPost\.excerpt/);
    assert.match(source, /post\.url \?\? "#"/);
    assert.match(
        source,
        /<EmptyDynamicState label="Không có tin tức nào để hiển thị\." \/>/,
    );
    assert.doesNotMatch(source, /label: "Bài viết nổi bật chính"/);
    assert.doesNotMatch(source, /label: "Danh sách bài viết khác"/);
});

test("news custom puck block supports category include and exclude fields", async () => {
    const source = await readFile("web/lib/puck/blocks/news.tsx", "utf8");
    const sharedSource = await readFile(
        "web/lib/puck/blocks/dynamic/shared.tsx",
        "utf8",
    );

    assert.match(source, /includedCategories: \{/);
    assert.match(source, /label: "Chỉ lấy từ danh mục"/);
    assert.match(source, /excludedCategories: \{/);
    assert.match(source, /label: "Loại trừ danh mục"/);
    assert.match(source, /buildCategoryFieldOptions\("Chọn danh mục"\)/);
    assert.match(sharedSource, /fetchSourceOptions\("categories"\)/);
});

test("news custom component accepts post thumbnail urls", async () => {
    const source = await readFile("web/components/cms/news.tsx", "utf8");

    assert.match(source, /imageUrl\?: string \| null/);
    assert.match(source, /featured\.imageUrl \|\|/);
    assert.match(source, /item\.imageUrl \|\|/);
    assert.doesNotMatch(source, /group-hover:scale-102/);
});
