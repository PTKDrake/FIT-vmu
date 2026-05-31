import assert from "node:assert/strict";
import test from "node:test";
import {
    createMockNavigationMenus,
    findNavigationItem,
    moveNavigationItemsToTarget,
} from "../lib/navigation/tree.ts";

test("moves a root navigation item after another root item", () => {
    const menu = createMockNavigationMenus()[0];
    const movedItems = moveNavigationItemsToTarget(
        menu.items,
        [11],
        13,
        "after",
    );

    assert.deepEqual(
        movedItems.map((item) => item.id),
        [12, 13, 11],
    );
});

test("moves a navigation item onto another item to become its child", () => {
    const menu = createMockNavigationMenus()[0];
    const movedItems = moveNavigationItemsToTarget(menu.items, [13], 12, "on");
    const parentItem = findNavigationItem(movedItems, 12);

    assert.ok(parentItem);
    assert.deepEqual(
        parentItem.children.map((item) => item.id),
        [121, 122, 13],
    );
    assert.equal(findNavigationItem(movedItems, 13)?.parentId, 12);
});

test("does not allow dropping a parent item onto its own descendant", () => {
    const menu = createMockNavigationMenus()[0];
    const movedItems = moveNavigationItemsToTarget(menu.items, [12], 121, "on");

    assert.deepEqual(movedItems, menu.items);
});
