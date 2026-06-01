import {
  HomeIcon,
  NewspaperIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { createMockNavigationMenus } from "@/lib/navigation/tree";

export const cmsDashboardHref = "/cms";

export type CmsNavigationLeaf = {
  href: string;
  title: string;
};

export type CmsNavigationItem = {
  href?: string;
  icon: typeof HomeIcon;
  items?: CmsNavigationLeaf[];
  title: string;
};

export const cmsNavigationItems: CmsNavigationItem[] = [
  {
    href: cmsDashboardHref,
    icon: HomeIcon,
    title: "Dashboard",
  },
  {
    icon: NewspaperIcon,
    items: [
      { href: "/cms/posts", title: "Bài viết" },
      { href: "/cms/post-categories", title: "Danh mục bài viết" },
      { href: "/cms/pages", title: "Trang" },
      { href: "/cms/navigation", title: "Navigation" },
      { href: "/cms/media", title: "Media" },
    ],
    title: "Nội dung",
  },
  {
    icon: UserCircleIcon,
    items: [
      { href: "/cms/staff-profiles", title: "Hồ sơ cán bộ" },
      { href: "/cms/units", title: "Đơn vị" },
      { href: "/cms/positions", title: "Chức vụ" },
    ],
    title: "Nhân sự",
  },
  {
    icon: ShieldCheckIcon,
    items: [
      { href: "/cms/users", title: "Người dùng" },
      { href: "/cms/roles-permissions", title: "Vai trò & quyền" },
    ],
    title: "Quản trị",
  },
];

export function findCmsNavigationLeaf(
  currentUrl: string,
): CmsNavigationLeaf | null {
  const normalizedUrl = currentUrl.split("?")[0];

  if (normalizedUrl === cmsDashboardHref) {
    return {
      href: cmsDashboardHref,
      title: "Dashboard",
    };
  }

  for (const section of cmsNavigationItems) {
    for (const item of section.items ?? []) {
      if (
        item.href === normalizedUrl ||
        normalizedUrl.startsWith(`${item.href}/`)
      ) {
        return item;
      }
    }
  }

  return null;
}

export function findCmsNavigationGroupTitle(currentUrl: string): string | null {
  const normalizedUrl = currentUrl.split("?")[0];

  for (const section of cmsNavigationItems) {
    if (
      section.items?.some(
        (item) =>
          item.href === normalizedUrl ||
          normalizedUrl.startsWith(`${item.href}/`),
      )
    ) {
      return section.title;
    }
  }

  return null;
}

export function findCmsNavigationMenuTitle(currentUrl: string): string | null {
  const normalizedUrl = currentUrl.split("?")[0];
  const navigationMatch = normalizedUrl.match(/^\/cms\/navigation\/(\d+)$/);

  if (!navigationMatch) {
    return null;
  }

  const navigationMenuId = Number(navigationMatch[1]);

  return (
    createMockNavigationMenus().find((menu) => menu.id === navigationMenuId)
      ?.name ?? null
  );
}
