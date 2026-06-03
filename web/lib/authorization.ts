import {
  Cog6ToothIcon,
  DocumentTextIcon,
  HomeIcon,
  NewspaperIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";
import { home } from "@/routes";
import { edit } from "@/routes/profile";

export type PermissionName = string;

export interface NavigationItem {
  description: string;
  href?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  matchUrls?: string[];
  title: string;
}

export interface NavigationGroup {
  items: NavigationItem[];
  label: string;
}

interface NavigationBlueprint extends NavigationItem {
  requiredPermissions?: PermissionName[];
}

const ADMIN_NAVIGATION: Array<{ items: NavigationBlueprint[]; label: string }> =
  [
    {
      label: "Tổng quan",
      items: [
        {
          title: "Bảng điều khiển",
          description:
            "Trang tổng quan vận hành CMS và các module bạn có thể truy cập.",
          href: "/cms",
          icon: HomeIcon,
          matchUrls: ["/cms"],
          requiredPermissions: ["view admin dashboard"],
        },
      ],
    },
    {
      label: "Nội dung",
      items: [
        {
          title: "Bài viết",
          description: "Biên tập tin tức, thông báo và nội dung xuất bản.",
          icon: NewspaperIcon,
          requiredPermissions: ["view posts"],
        },
        {
          title: "Nhóm sinh viên",
          description:
            "Tái sử dụng danh sách sinh viên cho quyền truy cập nội dung hạn chế.",
          icon: UserGroupIcon,
          requiredPermissions: [
            "manage student groups",
            "manage shared student groups",
          ],
        },
      ],
    },
    {
      label: "Tài liệu",
      items: [
        {
          title: "Tài liệu",
          description:
            "Quản lý tài liệu công khai, hạn chế và dữ liệu theo sinh viên.",
          icon: DocumentTextIcon,
          requiredPermissions: ["view documents", "view own documents"],
        },
      ],
    },
    {
      label: "Nhân sự",
      items: [
        {
          title: "Hồ sơ cán bộ",
          description:
            "Quản lý hồ sơ giảng viên, cán bộ và trang hiển thị công khai.",
          icon: UsersIcon,
          requiredPermissions: ["view staff profiles"],
        },
        {
          title: "Đơn vị và chức vụ",
          description: "Cấu trúc đơn vị, chức vụ và bổ nhiệm trong nhà trường.",
          icon: Squares2X2Icon,
          requiredPermissions: [
            "view units",
            "manage units",
            "manage positions",
            "manage staff appointments",
          ],
        },
      ],
    },
    {
      label: "Hệ thống",
      items: [
        {
          title: "Người dùng và truy cập",
          description: "Quản lý tài khoản, vai trò và quyền truy cập CMS.",
          icon: ShieldCheckIcon,
          requiredPermissions: [
            "manage users",
            "manage roles",
            "manage permissions",
          ],
        },
        {
          title: "Hồ sơ cá nhân",
          description: "Cập nhật thông tin tài khoản và tùy chỉnh đăng nhập.",
          href: edit.url(),
          icon: Cog6ToothIcon,
          matchUrls: [edit.url()],
        },
        {
          title: "Website công khai",
          description: "Quay lại trang VMUFit dành cho người dùng bên ngoài.",
          href: home.url(),
          icon: UserGroupIcon,
          matchUrls: [home.url()],
        },
      ],
    },
  ];

const PERMISSION_GROUPS = [
  {
    label: "Bài viết",
    permissions: [
      "view posts",
      "create posts",
      "update posts",
      "delete posts",
      "publish posts",
      "review posts",
    ],
  },
  {
    label: "Tài liệu",
    permissions: [
      "view documents",
      "create documents",
      "update documents",
      "delete documents",
      "publish documents",
      "review documents",
      "download restricted documents",
      "view student scoped documents",
      "view own documents",
      "create own documents",
      "update own documents",
      "delete own documents",
      "view own personalized documents",
    ],
  },
  {
    label: "Nhân sự và đơn vị",
    permissions: [
      "view staff profiles",
      "create staff profiles",
      "update staff profiles",
      "delete staff profiles",
      "publish staff profiles",
      "view units",
      "manage units",
      "manage positions",
      "manage staff appointments",
    ],
  },
  {
    label: "Nhóm sinh viên",
    permissions: [
      "manage student groups",
      "manage shared student groups",
    ],
  },
  {
    label: "Truy cập và hồ sơ",
    permissions: [
      "view admin dashboard",
      "manage users",
      "manage roles",
      "manage permissions",
      "view own profile",
      "update own profile",
      "view student profile",
    ],
  },
] as const;

export function hasPermission(
  grantedPermissions: PermissionName[],
  requiredPermissions: PermissionName | PermissionName[],
): boolean {
  const required = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];

  return required.some((permission) => grantedPermissions.includes(permission));
}

export function buildAdminNavigation(
  grantedPermissions: PermissionName[],
): NavigationGroup[] {
  return ADMIN_NAVIGATION.map((group) => ({
    label: group.label,
    items: group.items.filter((item) =>
      item.requiredPermissions
        ? hasPermission(grantedPermissions, item.requiredPermissions)
        : true,
    ),
  })).filter((group) => group.items.length > 0);
}

export function permissionsByGroup(grantedPermissions: PermissionName[]) {
  return PERMISSION_GROUPS.map((group) => ({
    label: group.label,
    permissions: group.permissions.filter((permission) =>
      grantedPermissions.includes(permission),
    ),
  })).filter((group) => group.permissions.length > 0);
}
