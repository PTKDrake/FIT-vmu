import {
  DocumentTextIcon,
  HomeIcon,
  NewspaperIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

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
    icon: DocumentTextIcon,
    items: [{ href: "/cms/documents", title: "Tài liệu" }],
    title: "Tài liệu",
  },
  {
    icon: UserCircleIcon,
    items: [
      { href: "/cms/staff-profiles", title: "Hồ sơ cán bộ" },
      { href: "/cms/units", title: "Đơn vị" },
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
      if (item.href === normalizedUrl) {
        return item;
      }
    }
  }

  return null;
}
