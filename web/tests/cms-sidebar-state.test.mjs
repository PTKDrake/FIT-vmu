import assert from "node:assert/strict";
import test from "node:test";
import {
    getCmsNavigationCompactLabel,
    parseCmsSidebarExpandedGroups,
    resolveCmsSidebarExpandedGroups,
    stringifyCmsSidebarExpandedGroups,
} from "../components/cms/layout/cms-sidebar-navigation-state.ts";
import { parseSidebarOpenState } from "../components/ui/sidebar-state.ts";

test("parses sidebar open state from cookies", () => {
    assert.equal(parseSidebarOpenState("foo=bar; sidebar_state=true"), true);
    assert.equal(parseSidebarOpenState("sidebar_state=false; foo=bar"), false);
    assert.equal(parseSidebarOpenState("foo=bar"), null);
    assert.equal(parseSidebarOpenState("sidebar_state=maybe"), null);
});

test("parses and stringifies expanded cms sidebar groups", () => {
    assert.deepEqual(parseCmsSidebarExpandedGroups('["Nội dung","Quản trị"]'), [
        "Nội dung",
        "Quản trị",
    ]);
    assert.deepEqual(parseCmsSidebarExpandedGroups('{"invalid":true}'), []);
    assert.deepEqual(parseCmsSidebarExpandedGroups("not-json"), []);

    assert.equal(
        stringifyCmsSidebarExpandedGroups(["Nội dung", "Quản trị", "Nội dung"]),
        '["Nội dung","Quản trị"]',
    );
});

test("keeps stored groups and forces the active cms group expanded", () => {
    assert.deepEqual(resolveCmsSidebarExpandedGroups("Nhân sự", ["Nội dung"]), [
        "Nội dung",
        "Nhân sự",
    ]);
    assert.deepEqual(resolveCmsSidebarExpandedGroups(null, ["Nội dung"]), [
        "Nội dung",
    ]);
});

test("builds compact labels for collapsed cms sidebar items", () => {
    assert.equal(getCmsNavigationCompactLabel("Bài viết"), "BV");
    assert.equal(getCmsNavigationCompactLabel("Trang"), "TR");
    assert.equal(getCmsNavigationCompactLabel("Vai trò & quyền"), "VT");
});
