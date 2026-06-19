import type { FormDataConvertible } from "@inertiajs/core";

export type NavigationItemType =
  | "custom_url"
  | "post_category"
  | "page"
  | "post"
  | "unit"
  | "none";

export type NavigationInternalResourceType = Exclude<
  NavigationItemType,
  "custom_url" | "unit" | "none"
>;

export type NavigationItemTarget = "_self" | "_blank";
export type NavigationDropPosition = "after" | "before" | "on";

export interface NavigationResourceOption {
  id: number;
  label: string;
  meta: string;
  type: NavigationInternalResourceType;
}

export interface NavigationItemDraft {
  id: number;
  isActive: boolean;
  linkableId: number | null;
  linkableType: NavigationInternalResourceType | null;
  menuId: number;
  parentId: number | null;
  sortOrder: number;
  target: NavigationItemTarget;
  title: string;
  type: NavigationItemType;
  url: string | null;
  children: NavigationItemDraft[];
}

export interface NavigationItemSyncPayload extends Record<
  string,
  FormDataConvertible
> {
  id: number;
  is_active: boolean;
  linkable_id: number | null;
  linkable_type: NavigationInternalResourceType | null;
  parent_id: number | null;
  sort_order: number;
  target: NavigationItemTarget;
  title: string;
  type: NavigationItemType;
  url: string | null;
}

export interface NavigationMenuDraft {
  id: number;
  isActive: boolean;
  location: string;
  name: string;
  slug: string;
  items: NavigationItemDraft[];
}

export interface NavigationParentOption {
  id: number;
  label: string;
}

function createNavigationItem(
  item: Omit<NavigationItemDraft, "children"> & {
    children?: NavigationItemDraft[];
  },
): NavigationItemDraft {
  return {
    ...item,
    children: normalizeNavigationTree(item.children ?? [], item.id),
  };
}

export const navigationResourceCatalog: Record<
  NavigationInternalResourceType,
  NavigationResourceOption[]
> = {
  page: [
    {
      id: 301,
      label: "Trang Giới thiệu khoa",
      meta: "/gioi-thieu-khoa",
      type: "page",
    },
    {
      id: 302,
      label: "Trang Tuyển sinh VMU FIT",
      meta: "/tuyen-sinh",
      type: "page",
    },
    {
      id: 303,
      label: "Trang Liên hệ",
      meta: "/lien-he",
      type: "page",
    },
    {
      id: 304,
      label: "Trang Chương trình đào tạo",
      meta: "/chuong-trinh-dao-tao",
      type: "page",
    },
    {
      id: 305,
      label: "Trang Hợp tác doanh nghiệp",
      meta: "/hop-tac-doanh-nghiep",
      type: "page",
    },
    {
      id: 306,
      label: "Trang Đội ngũ giảng viên",
      meta: "/doi-ngu-giang-vien",
      type: "page",
    },
  ],
  post: [
    {
      id: 401,
      label: "Thông báo lịch bảo vệ đồ án",
      meta: "Bài viết published",
      type: "post",
    },
    {
      id: 402,
      label: "Tin tức cuộc thi nghiên cứu khoa học",
      meta: "Bài viết published",
      type: "post",
    },
    {
      id: 403,
      label: "Hướng dẫn nhập học cho tân sinh viên",
      meta: "Bài viết published",
      type: "post",
    },
    {
      id: 404,
      label: "Thông báo lịch đăng ký học phần",
      meta: "Bài viết published",
      type: "post",
    },
    {
      id: 405,
      label: "Sinh viên đạt giải Olympic tin học",
      meta: "Bài viết published",
      type: "post",
    },
    {
      id: 406,
      label: "Bản tin hợp tác doanh nghiệp tháng 5",
      meta: "Bài viết published",
      type: "post",
    },
  ],
  post_category: [
    {
      id: 201,
      label: "Tin tức",
      meta: "Danh mục gốc",
      type: "post_category",
    },
    {
      id: 202,
      label: "Thông báo đào tạo",
      meta: "Danh mục con",
      type: "post_category",
    },
    {
      id: 203,
      label: "Sự kiện sinh viên",
      meta: "Danh mục con",
      type: "post_category",
    },
    {
      id: 204,
      label: "Tuyển sinh",
      meta: "Danh mục gốc",
      type: "post_category",
    },
    {
      id: 205,
      label: "Hợp tác doanh nghiệp",
      meta: "Danh mục gốc",
      type: "post_category",
    },
    {
      id: 206,
      label: "Nghiên cứu khoa học",
      meta: "Danh mục con",
      type: "post_category",
    },
  ],
};

export function createMockNavigationMenus(): NavigationMenuDraft[] {
  return [
    {
      id: 1,
      isActive: true,
      location: "header",
      name: "Header chính",
      slug: "header-main",
      items: normalizeNavigationTree([
        createNavigationItem({
          id: 11,
          isActive: true,
          linkableId: 301,
          linkableType: "page",
          menuId: 1,
          parentId: null,
          sortOrder: 1,
          target: "_self",
          title: "Giới thiệu",
          type: "page",
          url: null,
        }),
        createNavigationItem({
          id: 12,
          isActive: true,
          linkableId: null,
          linkableType: null,
          menuId: 1,
          parentId: null,
          sortOrder: 2,
          target: "_self",
          title: "Đào tạo",
          type: "custom_url",
          url: "/dao-tao",
          children: [
            createNavigationItem({
              id: 121,
              isActive: true,
              linkableId: 202,
              linkableType: "post_category",
              menuId: 1,
              parentId: 12,
              sortOrder: 1,
              target: "_self",
              title: "Thông báo đào tạo",
              type: "post_category",
              url: null,
            }),
            createNavigationItem({
              id: 122,
              isActive: true,
              linkableId: 302,
              linkableType: "page",
              menuId: 1,
              parentId: 12,
              sortOrder: 2,
              target: "_self",
              title: "Tuyển sinh",
              type: "page",
              url: null,
            }),
          ],
        }),
        createNavigationItem({
          id: 13,
          isActive: true,
          linkableId: 403,
          linkableType: "post",
          menuId: 1,
          parentId: null,
          sortOrder: 3,
          target: "_blank",
          title: "Cẩm nang tân sinh viên",
          type: "post",
          url: null,
        }),
        createNavigationItem({
          id: 14,
          isActive: true,
          linkableId: null,
          linkableType: null,
          menuId: 1,
          parentId: null,
          sortOrder: 4,
          target: "_self",
          title: "Tuyển sinh",
          type: "custom_url",
          url: "/tuyen-sinh",
          children: [
            createNavigationItem({
              id: 141,
              isActive: true,
              linkableId: 204,
              linkableType: "post_category",
              menuId: 1,
              parentId: 14,
              sortOrder: 1,
              target: "_self",
              title: "Tin tuyển sinh",
              type: "post_category",
              url: null,
            }),
            createNavigationItem({
              id: 142,
              isActive: true,
              linkableId: 304,
              linkableType: "page",
              menuId: 1,
              parentId: 14,
              sortOrder: 2,
              target: "_self",
              title: "Chương trình đào tạo",
              type: "page",
              url: null,
              children: [
                createNavigationItem({
                  id: 1421,
                  isActive: true,
                  linkableId: 404,
                  linkableType: "post",
                  menuId: 1,
                  parentId: 142,
                  sortOrder: 1,
                  target: "_self",
                  title: "Lịch đăng ký học phần",
                  type: "post",
                  url: null,
                }),
                createNavigationItem({
                  id: 1422,
                  isActive: false,
                  linkableId: 302,
                  linkableType: "page",
                  menuId: 1,
                  parentId: 142,
                  sortOrder: 2,
                  target: "_self",
                  title: "Thông tin tuyển sinh",
                  type: "page",
                  url: null,
                }),
              ],
            }),
            createNavigationItem({
              id: 143,
              isActive: true,
              linkableId: null,
              linkableType: null,
              menuId: 1,
              parentId: 14,
              sortOrder: 3,
              target: "_blank",
              title: "Đăng ký xét tuyển online",
              type: "custom_url",
              url: "https://tuyensinh.vimaru.edu.vn",
            }),
          ],
        }),
        createNavigationItem({
          id: 15,
          isActive: true,
          linkableId: 305,
          linkableType: "page",
          menuId: 1,
          parentId: null,
          sortOrder: 5,
          target: "_self",
          title: "Hợp tác doanh nghiệp",
          type: "page",
          url: null,
          children: [
            createNavigationItem({
              id: 151,
              isActive: true,
              linkableId: 205,
              linkableType: "post_category",
              menuId: 1,
              parentId: 15,
              sortOrder: 1,
              target: "_self",
              title: "Tin hợp tác",
              type: "post_category",
              url: null,
            }),
            createNavigationItem({
              id: 152,
              isActive: true,
              linkableId: 406,
              linkableType: "post",
              menuId: 1,
              parentId: 15,
              sortOrder: 2,
              target: "_blank",
              title: "Bản tin tháng 5",
              type: "post",
              url: null,
            }),
          ],
        }),
      ]),
    },
    {
      id: 2,
      isActive: true,
      location: "footer",
      name: "Footer nhanh",
      slug: "footer-quick-links",
      items: normalizeNavigationTree([
        createNavigationItem({
          id: 21,
          isActive: true,
          linkableId: 303,
          linkableType: "page",
          menuId: 2,
          parentId: null,
          sortOrder: 1,
          target: "_self",
          title: "Liên hệ",
          type: "page",
          url: null,
        }),
        createNavigationItem({
          id: 22,
          isActive: true,
          linkableId: null,
          linkableType: null,
          menuId: 2,
          parentId: null,
          sortOrder: 2,
          target: "_blank",
          title: "Cổng thông tin sinh viên",
          type: "custom_url",
          url: "https://student.vimaru.edu.vn",
        }),
        createNavigationItem({
          id: 23,
          isActive: true,
          linkableId: null,
          linkableType: null,
          menuId: 2,
          parentId: null,
          sortOrder: 3,
          target: "_self",
          title: "Liên kết nhanh",
          type: "custom_url",
          url: "/lien-ket-nhanh",
          children: [
            createNavigationItem({
              id: 231,
              isActive: true,
              linkableId: 303,
              linkableType: "page",
              menuId: 2,
              parentId: 23,
              sortOrder: 1,
              target: "_self",
              title: "Liên hệ",
              type: "page",
              url: null,
            }),
            createNavigationItem({
              id: 232,
              isActive: true,
              linkableId: 405,
              linkableType: "post",
              menuId: 2,
              parentId: 23,
              sortOrder: 2,
              target: "_self",
              title: "Sinh viên tiêu biểu",
              type: "post",
              url: null,
            }),
          ],
        }),
      ]),
    },
    {
      id: 3,
      isActive: true,
      location: "header",
      name: "Header tuyển sinh",
      slug: "header-admission",
      items: normalizeNavigationTree([
        createNavigationItem({
          id: 31,
          isActive: true,
          linkableId: 302,
          linkableType: "page",
          menuId: 3,
          parentId: null,
          sortOrder: 1,
          target: "_self",
          title: "Tổng quan tuyển sinh",
          type: "page",
          url: null,
        }),
        createNavigationItem({
          id: 32,
          isActive: true,
          linkableId: 204,
          linkableType: "post_category",
          menuId: 3,
          parentId: null,
          sortOrder: 2,
          target: "_self",
          title: "Tin tuyển sinh",
          type: "post_category",
          url: null,
        }),
        createNavigationItem({
          id: 33,
          isActive: false,
          linkableId: null,
          linkableType: null,
          menuId: 3,
          parentId: null,
          sortOrder: 3,
          target: "_blank",
          title: "Tư vấn trực tuyến",
          type: "custom_url",
          url: "https://zalo.me/vmu-fit",
        }),
      ]),
    },
    {
      id: 4,
      isActive: true,
      location: "footer",
      name: "Footer học thuật",
      slug: "footer-academic",
      items: normalizeNavigationTree([
        createNavigationItem({
          id: 41,
          isActive: true,
          linkableId: 304,
          linkableType: "page",
          menuId: 4,
          parentId: null,
          sortOrder: 1,
          target: "_self",
          title: "Chương trình đào tạo",
          type: "page",
          url: null,
        }),
        createNavigationItem({
          id: 42,
          isActive: true,
          linkableId: 206,
          linkableType: "post_category",
          menuId: 4,
          parentId: null,
          sortOrder: 2,
          target: "_self",
          title: "Nghiên cứu khoa học",
          type: "post_category",
          url: null,
        }),
        createNavigationItem({
          id: 43,
          isActive: true,
          linkableId: 306,
          linkableType: "page",
          menuId: 4,
          parentId: null,
          sortOrder: 3,
          target: "_self",
          title: "Đội ngũ giảng viên",
          type: "page",
          url: null,
        }),
      ]),
    },
  ];
}

export function normalizeNavigationTree(
  items: NavigationItemDraft[],
  parentId: number | null = null,
): NavigationItemDraft[] {
  return [...items]
    .sort((leftItem, rightItem) => leftItem.sortOrder - rightItem.sortOrder)
    .map((item, index) => ({
      ...item,
      parentId,
      sortOrder: index + 1,
      children: normalizeNavigationTree(item.children, item.id),
    }));
}

export function findNavigationItem(
  items: NavigationItemDraft[],
  itemId: number,
): NavigationItemDraft | null {
  for (const item of items) {
    if (item.id === itemId) {
      return item;
    }

    const nestedMatch = findNavigationItem(item.children, itemId);

    if (nestedMatch) {
      return nestedMatch;
    }
  }

  return null;
}

export function removeNavigationItem(
  items: NavigationItemDraft[],
  itemId: number,
): {
  items: NavigationItemDraft[];
  removedItem: NavigationItemDraft | null;
} {
  let removedItem: NavigationItemDraft | null = null;

  const nextItems = items.reduce<NavigationItemDraft[]>((carry, item) => {
    if (item.id === itemId) {
      removedItem = item;

      return carry;
    }

    const nestedResult = removeNavigationItem(item.children, itemId);

    if (nestedResult.removedItem) {
      removedItem = nestedResult.removedItem;
      carry.push({
        ...item,
        children: normalizeNavigationTree(nestedResult.items, item.id),
      });

      return carry;
    }

    carry.push(item);

    return carry;
  }, []);

  return {
    items: normalizeNavigationTree(nextItems),
    removedItem,
  };
}

export function insertNavigationItem(
  items: NavigationItemDraft[],
  item: NavigationItemDraft,
  parentId: number | null,
): NavigationItemDraft[] {
  if (parentId === null) {
    return normalizeNavigationTree([...items, { ...item, parentId: null }]);
  }

  return normalizeNavigationTree(
    items.map((existingItem) => {
      if (existingItem.id === parentId) {
        return {
          ...existingItem,
          children: normalizeNavigationTree(
            [...existingItem.children, { ...item, parentId }],
            parentId,
          ),
        };
      }

      return {
        ...existingItem,
        children: insertNavigationItem(existingItem.children, item, parentId),
      };
    }),
  );
}

export function updateNavigationItem(
  items: NavigationItemDraft[],
  itemId: number,
  updater: (item: NavigationItemDraft) => NavigationItemDraft,
): NavigationItemDraft[] {
  return normalizeNavigationTree(
    items.map((item) => {
      if (item.id === itemId) {
        return updater(item);
      }

      return {
        ...item,
        children: updateNavigationItem(item.children, itemId, updater),
      };
    }),
  );
}

export function moveNavigationItem(
  items: NavigationItemDraft[],
  itemId: number,
  direction: "up" | "down",
): NavigationItemDraft[] {
  const itemIndex = items.findIndex((item) => item.id === itemId);

  if (itemIndex >= 0) {
    const targetIndex = direction === "up" ? itemIndex - 1 : itemIndex + 1;

    if (targetIndex < 0 || targetIndex >= items.length) {
      return normalizeNavigationTree(items);
    }

    const reorderedItems = [...items];
    const [movedItem] = reorderedItems.splice(itemIndex, 1);

    reorderedItems.splice(targetIndex, 0, movedItem);

    return normalizeNavigationTree(reorderedItems);
  }

  return normalizeNavigationTree(
    items.map((item) => ({
      ...item,
      children: moveNavigationItem(item.children, itemId, direction),
    })),
  );
}

export function moveNavigationItemsToTarget(
  items: NavigationItemDraft[],
  itemIds: number[],
  targetId: number,
  dropPosition: NavigationDropPosition,
): NavigationItemDraft[] {
  const movingItemIds = new Set(itemIds);

  if (movingItemIds.size === 0 || movingItemIds.has(targetId)) {
    return normalizeNavigationTree(items);
  }

  for (const itemId of movingItemIds) {
    if (collectDescendantIds(items, itemId).has(targetId)) {
      return normalizeNavigationTree(items);
    }
  }

  let remainingItems = items;
  const movedItems: NavigationItemDraft[] = [];

  for (const itemId of movingItemIds) {
    const result = removeNavigationItem(remainingItems, itemId);

    if (result.removedItem) {
      remainingItems = result.items;
      movedItems.push(result.removedItem);
    }
  }

  if (movedItems.length === 0) {
    return normalizeNavigationTree(items);
  }

  if (dropPosition === "on") {
    const targetItem = findNavigationItem(remainingItems, targetId);

    if (!targetItem) {
      return normalizeNavigationTree(items);
    }

    return insertNavigationItemsAtIndex(
      remainingItems,
      movedItems,
      targetItem.id,
      targetItem.children.length,
    );
  }

  const targetItem = findNavigationItem(remainingItems, targetId);

  if (!targetItem) {
    return normalizeNavigationTree(items);
  }

  const siblingItems = getNavigationSiblingItems(
    remainingItems,
    targetItem.parentId,
  );
  const targetIndex = siblingItems.findIndex(
    (item) => item.id === targetItem.id,
  );

  if (targetIndex === -1) {
    return normalizeNavigationTree(items);
  }

  return insertNavigationItemsAtIndex(
    remainingItems,
    movedItems,
    targetItem.parentId,
    dropPosition === "before" ? targetIndex : targetIndex + 1,
  );
}

export function collectNavigationParentOptions(
  items: NavigationItemDraft[],
  currentItemId: number | null = null,
  depth = 0,
): NavigationParentOption[] {
  const descendantIds =
    currentItemId === null
      ? new Set<number>()
      : collectDescendantIds(items, currentItemId);

  return items.flatMap((item) => {
    if (item.id === currentItemId || descendantIds.has(item.id)) {
      return [];
    }

    const prefix = depth > 0 ? `${"— ".repeat(depth)}` : "";

    return [
      {
        id: item.id,
        label: `${prefix}${item.title}`,
      },
      ...collectNavigationParentOptions(
        item.children,
        currentItemId,
        depth + 1,
      ),
    ];
  });
}

export function countNavigationItems(items: NavigationItemDraft[]): number {
  return items.reduce(
    (total, item) => total + 1 + countNavigationItems(item.children),
    0,
  );
}

export function describeNavigationDestination(
  item: NavigationItemDraft,
  resourceCatalog: Record<
    NavigationInternalResourceType,
    NavigationResourceOption[]
  > = navigationResourceCatalog,
): string {
  if (item.type === "custom_url") {
    return item.url || "Chưa nhập URL";
  }

  if (item.type === "unit") {
    return "Tự động tải danh sách đơn vị";
  }

  if (item.type === "none") {
    return "Không điều hướng";
  }

  const selectedResource = item.linkableType
    ? resourceCatalog[item.linkableType].find(
        (resource) => resource.id === item.linkableId,
      )
    : null;

  if (!selectedResource) {
    return "Chưa chọn tài nguyên nội bộ";
  }

  return `${selectedResource.label} · ${selectedResource.meta}`;
}

export function flattenNavigationTree(
  items: NavigationItemDraft[],
  parentId: number | null = null,
): NavigationItemSyncPayload[] {
  return items.flatMap((item, index) => [
    {
      id: item.id,
      is_active: item.isActive,
      linkable_id: item.type === "none" ? null : item.linkableId,
      linkable_type: item.type === "none" ? null : item.linkableType,
      parent_id: parentId,
      sort_order: index + 1,
      target: item.target,
      title: item.title,
      type: item.type,
      url: item.type === "none" ? null : item.url,
    },
    ...flattenNavigationTree(item.children, item.id),
  ]);
}

export function createEmptyNavigationItem(
  itemId: number,
  menuId: number,
  parentId: number | null,
): NavigationItemDraft {
  return {
    children: [],
    id: itemId,
    isActive: true,
    linkableId: null,
    linkableType: null,
    menuId,
    parentId,
    sortOrder: 0,
    target: "_self",
    title: parentId === null ? "Navigation item mới" : "Mục con mới",
    type: "custom_url",
    url: "",
  };
}

function collectDescendantIds(
  items: NavigationItemDraft[],
  currentItemId: number,
): Set<number> {
  const currentItem = findNavigationItem(items, currentItemId);

  if (!currentItem) {
    return new Set<number>();
  }

  const descendantIds = new Set<number>();

  const visitChildren = (children: NavigationItemDraft[]): void => {
    for (const child of children) {
      descendantIds.add(child.id);
      visitChildren(child.children);
    }
  };

  visitChildren(currentItem.children);

  return descendantIds;
}

function getNavigationSiblingItems(
  items: NavigationItemDraft[],
  parentId: number | null,
): NavigationItemDraft[] {
  if (parentId === null) {
    return items;
  }

  return findNavigationItem(items, parentId)?.children ?? [];
}

function insertNavigationItemsAtIndex(
  items: NavigationItemDraft[],
  movedItems: NavigationItemDraft[],
  parentId: number | null,
  index: number,
): NavigationItemDraft[] {
  if (parentId === null) {
    const nextItems = [...items];

    nextItems.splice(
      index,
      0,
      ...movedItems.map((item) => ({ ...item, parentId: null })),
    );

    return normalizeNavigationTree(
      nextItems.map((item, itemIndex) => ({
        ...item,
        sortOrder: itemIndex + 1,
      })),
    );
  }

  return normalizeNavigationTree(
    items.map((item) => {
      if (item.id === parentId) {
        const nextChildren = [...item.children];

        nextChildren.splice(
          index,
          0,
          ...movedItems.map((movedItem) => ({ ...movedItem, parentId })),
        );

        return {
          ...item,
          children: normalizeNavigationTree(
            nextChildren.map((childItem, childIndex) => ({
              ...childItem,
              sortOrder: childIndex + 1,
            })),
            parentId,
          ),
        };
      }

      return {
        ...item,
        children: insertNavigationItemsAtIndex(
          item.children,
          movedItems,
          parentId,
          index,
        ),
      };
    }),
  );
}
