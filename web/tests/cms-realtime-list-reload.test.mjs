import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("CMS posts realtime refreshes the async table list", async () => {
    const source = await readFile("web/pages/cms/posts/index.tsx", "utf8");

    assert.match(source, /useCmsContentRealtime\("posts", \(payload\) => \{/);
    assert.match(source, /reloadPostsList\(\);/);
    assert.match(
        source,
        /function reloadPostsList\(\): void \{\s*tableQueryState\.list\.reload\(\);\s*\}/,
    );
    assert.doesNotMatch(source, /router\.reload\(\{ only: \["posts"\] \}\);/);
});

test("CMS post review and delete actions refresh the async table list after success", async () => {
    const source = await readFile("web/pages/cms/posts/index.tsx", "utf8");
    const successReloads = source.match(/onSuccess: reloadPostsList/g) ?? [];

    assert.ok(successReloads.length >= 2);
    assert.match(source, /setDeleteTarget\(null\);\s*reloadPostsList\(\);/);
});

test("CMS page realtime, clone, and delete actions refresh the async table list", async () => {
    const source = await readFile("web/pages/cms/pages/index.tsx", "utf8");

    assert.match(source, /useCmsContentRealtime\("pages", \(payload\) => \{/);
    assert.match(
        source,
        /function reloadPagesList\(\): void \{\s*tableQueryState\.list\.reload\(\);\s*\}/,
    );
    assert.match(source, /onSuccess: reloadPagesList/);
    assert.match(source, /setDeleteTarget\(null\);\s*reloadPagesList\(\);/);
});

test("CMS shared list realtime refreshes current collection loaders", async () => {
    const pagesSource = await readFile("web/pages/cms/pages/index.tsx", "utf8");
    const unitsSource = await readFile("web/pages/cms/units/index.tsx", "utf8");
    const staffProfilesSource = await readFile(
        "web/pages/cms/staff-profiles/index.tsx",
        "utf8",
    );

    assert.match(pagesSource, /reloadPagesList\(\);/);
    assert.match(unitsSource, /unitList\.reload\(\);/);
    assert.match(staffProfilesSource, /tableQueryState\.list\.reload\(\);/);
});

test("CMS secondary modules listen for realtime content changes", async () => {
    const sources = new Map(
        await Promise.all(
            [
                ["layouts", "web/pages/cms/layouts/index.tsx"],
                ["media", "web/pages/cms/media/index.tsx"],
                ["navigation", "web/pages/cms/navigation/index.tsx"],
                ["positions", "web/pages/cms/positions/index.tsx"],
                ["post-categories", "web/pages/cms/post-categories/index.tsx"],
                ["roles", "web/pages/cms/roles-permissions/index.tsx"],
                ["settings", "web/pages/cms/settings/index.tsx"],
                ["student-groups", "web/pages/cms/student-groups/index.tsx"],
                ["users", "web/pages/cms/users/index.tsx"],
            ].map(async ([resource, path]) => [resource, await readFile(path, "utf8")]),
        ),
    );

    for (const [resource, source] of sources) {
        assert.match(
            source,
            new RegExp(`useCmsContentRealtime\\("${resource}"`),
            `${resource} page should subscribe to CMS realtime changes`,
        );
    }
});

test("CMS users delete action refreshes the current async table list", async () => {
    const source = await readFile("web/pages/cms/users/index.tsx", "utf8");

    assert.match(source, /useCmsContentRealtime\("users", \(\) => \{/);
    assert.match(
        source,
        /function reloadUsersList\(\): void \{\s*tableQueryState\.list\.reload\(\);\s*\}/,
    );
    assert.match(source, /onDeleted=\{reloadUsersList\}/);
    assert.match(source, /onSuccess: \(\) => \{\s*onOpenChange\(false\);\s*onDeleted\(\);/);
});

test("CMS dialog mutations refresh their current page without waiting for Reverb", async () => {
    const categoryPage = await readFile("web/pages/cms/post-categories/index.tsx", "utf8");
    const positionPage = await readFile("web/pages/cms/positions/index.tsx", "utf8");
    const studentGroupsPage = await readFile("web/pages/cms/student-groups/index.tsx", "utf8");
    const rolesPage = await readFile("web/pages/cms/roles-permissions/index.tsx", "utf8");
    const layoutsPage = await readFile("web/pages/cms/layouts/index.tsx", "utf8");
    const navigationEditor = await readFile(
        "web/components/navigation/navigation-tree-editor.tsx",
        "utf8",
    );

    assert.match(categoryPage, /onSaved=\{\(\) => tableQueryState\.list\.reload\(\)\}/);
    assert.match(positionPage, /onSaved=\{\(\) => tableQueryState\.list\.reload\(\)\}/);
    assert.match(studentGroupsPage, /function reloadStudentGroups\(\): void \{/);
    assert.match(studentGroupsPage, /onSaved=\{reloadStudentGroups\}/);
    assert.match(studentGroupsPage, /reloadStudentGroups\(\);/);
    assert.match(rolesPage, /function reloadRoles\(\): void \{/);
    assert.match(rolesPage, /onSaved=\{reloadRoles\}/);
    assert.match(layoutsPage, /function reloadLayouts\(\): void \{/);
    assert.match(layoutsPage, /onSaved=\{reloadLayouts\}/);
    assert.match(layoutsPage, /onSuccess: reloadLayouts/);
    assert.match(navigationEditor, /router\.reload\(\{\s*only: \[/);
});
