import {
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { CmsDataTable } from "@/components/cms/cms-data-table";
import type { CmsTablePaginationMeta, CmsPaginatedCollection } from "@/components/cms/types";
import { useCmsTableQueryState } from "@/components/cms/use-cms-table-query-state";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { useMountEffect } from "@/hooks/use-mount-effect";
import CmsLayout from "@/layouts/cms-layout";
import usersRoutes from "@/routes/cms/users";
import type { FlashData, SharedData } from "@/types/shared";

interface CmsUserTableRow {
  id: number;
  name: string;
  email: string;
  roles: string[];
  status: "verified" | "unverified";
  isVerified: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CmsUsersPageProps extends SharedData {
  can: {
    createUsers: boolean;
    manageUsers: boolean;
    manageRoles: boolean;
  };
  users: CmsPaginatedCollection<CmsUserTableRow>;
  roleOptions: Array<{ value: string; label: string }>;
}

const columnHelper = createColumnHelper<CmsUserTableRow>();

const statusOptions = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Đã xác thực", value: "verified" },
  { label: "Chưa xác thực", value: "unverified" },
] as const;

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function CmsUsersPage({
  can,
  flash,
  users,
  roleOptions,
}: CmsUsersPageProps) {
  const { auth } = usePage<SharedData>().props;

  const tableQueryState = useCmsTableQueryState({
    defaultPerPage: users.meta.perPage,
    defaultSortColumn: "created_at",
    initialItems: users.data,
    initialMeta: users.meta,
    resourceKey: "users",
  });

  const currentUserFromList = users.data.find((u) => u.id === auth.user?.id);
  const currentUserRoles = currentUserFromList?.roles ?? (auth.permissions.length >= 35 ? ["super-admin"] : []);

  const columns: Array<ColumnDef<CmsUserTableRow, any>> = [
    columnHelper.accessor("name", {
      header: "Người dùng",
      cell: ({ row }) => {
        // Gravatar URL fallback
        const gravatarUrl = `https://www.gravatar.com/avatar/${row.original.id}?d=mp`;
        return (
          <div className="flex items-center gap-3">
            <Avatar
              src={gravatarUrl}
              initials={row.original.name.substring(0, 2).toUpperCase()}
              alt={row.original.name}
              className="size-9 bg-primary/10 text-primary font-medium"
            />
            <div className="space-y-0.5">
              <p className="font-semibold text-fg text-sm">{row.original.name}</p>
              <p className="text-xs text-muted-fg font-mono">{row.original.email}</p>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor("roles", {
      header: "Vai trò",
      cell: ({ getValue }) => {
        const roles = getValue() as string[];
        if (roles.length === 0) {
          return <span className="text-xs text-muted-fg italic">Chưa có vai trò</span>;
        }

        return (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {roles.map((role) => {
              const isSuper = role === "super-admin";
              const isAdmin = role === "admin";
              
              return (
                <Badge
                  key={role}
                  intent={isSuper ? "danger" : isAdmin ? "primary" : "secondary"}
                  isCircle={false}
                  className="text-xs py-0.5 font-medium"
                >
                  {role}
                </Badge>
              );
            })}
          </div>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: "Xác thực email",
      cell: ({ row }) => (
        <Badge
          intent={row.original.isVerified ? "success" : "warning"}
          isCircle={false}
        >
          {row.original.isVerified ? "Đã xác thực" : "Chưa xác thực"}
        </Badge>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Ngày tạo",
      cell: ({ getValue }) => dateFormatter.format(new Date(getValue())),
    }),
    columnHelper.accessor("updatedAt", {
      header: "Cập nhật",
      cell: ({ getValue }) => dateFormatter.format(new Date(getValue())),
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const isTargetSuperAdmin = row.original.roles.includes("super-admin");
        const isCurrentUserSuperAdmin = currentUserRoles.includes("super-admin");
        
        // Non-super-admins cannot update super-admins
        const isActionsDisabled = isTargetSuperAdmin && !isCurrentUserSuperAdmin;

        if (!can.manageUsers || isActionsDisabled) {
          return null;
        }

        return (
          <Menu>
            <MenuTrigger
              aria-label={`Tác vụ cho ${row.original.name}`}
              className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-bg text-muted-fg transition hover:text-fg"
            >
              <EllipsisHorizontalIcon className="size-5" />
            </MenuTrigger>
            <MenuContent placement="bottom right">
              <MenuItem
                onAction={() => {
                  router.visit(usersRoutes.edit.url({ user: row.original.id }));
                }}
              >
                <PencilSquareIcon />
                Chỉnh sửa
              </MenuItem>
            </MenuContent>
          </Menu>
        );
      },
    }),
  ];

  return (
    <>
      <Head title="Người dùng" />
      {flash?.message ? (
        <UsersFlashToast
          key={`${flash.type}:${flash.message}`}
          message={flash.message}
          type={flash.type}
        />
      ) : null}

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <CmsDataTable
          columns={columns}
          data={tableQueryState.data}
          defaultSort={{ column: "created_at", direction: "desc" }}
          description="Quản lý tài khoản quản trị nội bộ, phân quyền vai trò Spatie và theo dõi trạng thái xác thực."
          emptyDescription="Không tìm thấy tài khoản người dùng nào khớp với bộ lọc hiện tại."
          emptyTitle="Không tìm thấy người dùng"
          filterOptions={statusOptions.map((option) => ({ ...option }))}
          filterValue={tableQueryState.query.status}
          isReloading={tableQueryState.isReloading}
          meta={tableQueryState.meta}
          onFilterChange={(value) => tableQueryState.setStatus(value)}
          onPageChange={(page) => tableQueryState.setPage(page)}
          onPerPageChange={(value) => tableQueryState.setPerPage(value)}
          onSearchChange={(value) => tableQueryState.setSearch(value)}
          onSortingChange={(column, direction) =>
            tableQueryState.setSorting(column, direction)
          }
          primaryAction={
            <div className="flex items-center gap-3">
              <Select
                aria-label="Lọc theo vai trò"
                selectedKey={tableQueryState.query.role || "all"}
                onSelectionChange={(key) => {
                  void tableQueryState.setRole(key === "all" ? "" : String(key));
                }}
              >
                <SelectTrigger className="w-48 text-start" />
                <SelectContent>
                  <SelectItem id="all" textValue="Tất cả vai trò">
                    <SelectLabel>Tất cả vai trò</SelectLabel>
                  </SelectItem>
                  {roleOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      id={opt.value}
                      textValue={opt.label}
                    >
                      <SelectLabel>{opt.label}</SelectLabel>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {can.createUsers || can.manageUsers ? (
                <Link
                  href={usersRoutes.create.url()}
                  className="inline-flex min-h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg shadow-xs transition hover:bg-primary/90 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-ring active:bg-primary"
                >
                  <PlusIcon className="size-4 mr-1.5 shrink-0" />
                  Thêm người dùng
                </Link>
              ) : null}
            </div>
          }
          searchPlaceholder="Tìm theo tên, email"
          searchValue={tableQueryState.query.search}
          sort={{
            column: tableQueryState.query.sort,
            direction: tableQueryState.query.direction,
          }}
          title="Người dùng"
        />
      </div>
    </>
  );
}

CmsUsersPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;

function UsersFlashToast({
  message,
  type,
}: {
  message: string;
  type: FlashData["type"];
}) {
  useMountEffect(() => {
    switch (type) {
      case "error":
        toast.error(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      case "info":
        toast.info(message);
        break;
      default:
        toast.success(message);
        break;
    }
  });

  return null;
}
