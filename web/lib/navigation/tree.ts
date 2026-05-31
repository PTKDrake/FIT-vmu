export type NavigationItemType = "custom_url" | "post_category" | "page" | "post";

export type NavigationInternalResourceType = Exclude<NavigationItemType, "custom_url">;

export type NavigationItemTarget = "_self" | "_blank";

export interface NavigationResourceOption {
  id: number;
  label: string;
  meta: string;
  type: NavigationInternalResourceType;
}

export type NavigationResourceCatalog = Record<
  NavigationInternalResourceType,
  NavigationResourceOption[]
>;

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

export const navigationResourceCatalog: NavigationResourceCatalog = {
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

export function collectNavigationParentOptions(
  items: NavigationItemDraft[],
  currentItemId: number | null = null,
  depth = 0,
): NavigationParentOption[] {
  const descendantIds = currentItemId === null ? new Set<number>() : collectDescendantIds(items, currentItemId);

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
      ...collectNavigationParentOptions(item.children, currentItemId, depth + 1),
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
  resourceCatalog: NavigationResourceCatalog = navigationResourceCatalog,
): string {
  if (item.type === "custom_url") {
    return item.url || "Chưa nhập URL";
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
