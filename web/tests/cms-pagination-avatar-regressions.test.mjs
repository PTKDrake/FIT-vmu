import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("CMS data table disables boundary pagination controls", async () => {
    const source = await readFile("web/components/cms/cms-data-table.tsx", "utf8");

    assert.match(source, /const isFirstPage = meta\.currentPage <= 1;/);
    assert.match(source, /const isLastPage = meta\.currentPage >= meta\.lastPage;/);
    assert.match(
        source,
        /<PaginationFirst\s+isDisabled=\{isFirstPage\}[\s\S]*?if \(!isFirstPage\) \{[\s\S]*?void onPageChange\(1\);/,
    );
    assert.match(
        source,
        /<PaginationPrevious\s+isDisabled=\{isFirstPage\}[\s\S]*?if \(!isFirstPage\) \{[\s\S]*?void onPageChange\(Math\.max\(meta\.currentPage - 1, 1\)\);/,
    );
    assert.match(
        source,
        /<PaginationNext\s+isDisabled=\{isLastPage\}[\s\S]*?if \(!isLastPage\) \{[\s\S]*?void onPageChange\(/,
    );
});

test("CMS staff avatars use Avatar size props instead of overriding child image size", async () => {
    const indexSource = await readFile(
        "web/pages/cms/staff-profiles/index.tsx",
        "utf8",
    );
    const showSource = await readFile(
        "web/pages/cms/staff-profiles/show.tsx",
        "utf8",
    );
    const formSource = await readFile(
        "web/components/cms/staff-profile-form.tsx",
        "utf8",
    );

    assert.match(indexSource, /size="lg"\s+className="border border-border"/);
    assert.match(
        showSource,
        /size="6xl"\s+className="border-2 border-border shadow-xs"/,
    );
    assert.match(
        formSource,
        /size="5xl"\s+className="border border-border shadow-xs"/,
    );

    assert.doesNotMatch(indexSource, /className="size-9 rounded-full/);
    assert.doesNotMatch(showSource, /className="size-28 rounded-full/);
    assert.doesNotMatch(formSource, /className="size-24 rounded-full/);
});
