import {
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";
import {
  CmsDataTable,
  DataTableBadge,
  DataTableActions,
} from "@/components/cms/cms-data-table";
import type {
  CmsTablePaginationMeta,
  CmsPaginatedCollection,
} from "@/components/cms/types";
import { useCmsTableQueryState } from "@/components/cms/use-cms-table-query-state";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu";
import {
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { useCmsContentRealtime } from "@/hooks/use-cms-content-realtime";
import { useMountEffect } from "@/hooks/use-mount-effect";
import CmsLayout from "@/layouts/cms-layout";
import { t } from "@/lib/i18n";
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
  const [userPendingDelete, setUserPendingDelete] =
    useState<CmsUserTableRow | null>(null);

  const tableQueryState = useCmsTableQueryState({
    defaultPerPage: users.meta.perPage,
    defaultSortColumn: "created_at",
    initialItems: users.data,
    initialMeta: users.meta,
    resourceKey: "users",
  });

  useCmsContentRealtime("users", () => {
    reloadUsersList();
  });

  function reloadUsersList(): void {
    tableQueryState.list.reload();
  }

  const currentUserFromList = users.data.find((u) => u.id === auth.user?.id);
  const currentUserRoles =
    currentUserFromList?.roles ??
    (auth.permissions.length >= 35 ? ["super-admin"] : []);

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
              className="[--avatar-size:--spacing(9)] overflow-hidden bg-primary/10 text-primary font-medium"
            />
            <span className="font-semibold text-fg text-sm">
              {row.original.name}
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor("email", {
      id: "email",
      header: "Email",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs text-muted-fg">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("roles", {
      header: "Vai trò",
      enableSorting: false,
      cell: ({ getValue }) => {
        const roles = getValue() as string[];

        if (roles.length === 0) {
          return (
            <span className="text-xs text-muted-fg italic">
              {t("Chưa có vai trò")}
            </span>
          );
        }

        return (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {roles.map((role) => {
              const isSuper = role === "super-admin";
              const isAdmin = role === "admin";

              return (
                <DataTableBadge
                  key={role}
                  intent={
                    isSuper ? "danger" : isAdmin ? "primary" : "secondary"
                  }
                >
                  {role}
                </DataTableBadge>
              );
            })}
          </div>
        );
      },
    }),
    columnHelper.accessor("status", {
      id: "email_verified_at",
      header: "Xác thực email",
      cell: ({ row }) => (
        <DataTableBadge
          intent={row.original.isVerified ? "success" : "warning"}
        >
          {row.original.isVerified ? "Đã xác thực" : "Chưa xác thực"}
        </DataTableBadge>
      ),
    }),
    columnHelper.accessor("createdAt", {
      id: "created_at",
      header: "Ngày tạo",
      cell: ({ getValue }) => dateFormatter.format(new Date(getValue())),
    }),
    columnHelper.accessor("updatedAt", {
      header: "Cập nhật",
      enableSorting: false,
      cell: ({ getValue }) => dateFormatter.format(new Date(getValue())),
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const isTargetSuperAdmin = row.original.roles.includes("super-admin");
        const isCurrentUserSuperAdmin =
          currentUserRoles.includes("super-admin");
        const isCurrentUser = row.original.id === auth.user?.id;

        // Non-super-admins cannot update super-admins
        const isActionsDisabled =
          isTargetSuperAdmin && !isCurrentUserSuperAdmin;
        const canDeleteUser =
          can.manageUsers && !isActionsDisabled && !isCurrentUser;

        if (!can.manageUsers || isActionsDisabled) {
          return null;
        }

        return (
          <DataTableActions
            triggerAriaLabel={`Tác vụ cho ${row.original.name}`}
          >
            <MenuItem
              onAction={() => {
                router.visit(usersRoutes.edit.url({ user: row.original.id }));
              }}
            >
              <PencilSquareIcon />
              Chỉnh sửa
            </MenuItem>
            {canDeleteUser ? (
              <MenuItem
                onAction={() => {
                  setUserPendingDelete(row.original);
                }}
              >
                <TrashIcon />
                Xóa người dùng
              </MenuItem>
            ) : null}
          </DataTableActions>
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
          filterSections={[
            {
              id: "status",
              label: "Trạng thái",
              options: statusOptions.map((opt) => ({ ...opt })),
              selectedValue: tableQueryState.query.status,
              onChange: (value) => tableQueryState.setStatus(value),
            },
            {
              id: "role",
              label: "Vai trò",
              options: [
                { label: "Tất cả vai trò", value: "all" },
                ...roleOptions.map((opt) => ({ ...opt })),
              ],
              selectedValue: tableQueryState.query.role || "all",
              onChange: (value) =>
                tableQueryState.setRole(value === "all" ? "" : value),
            },
          ]}
          isReloading={tableQueryState.isReloading}
          meta={tableQueryState.meta}
          onPageChange={(page) => tableQueryState.setPage(page)}
          onPerPageChange={(value) => tableQueryState.setPerPage(value)}
          onSearchChange={(value) => tableQueryState.setSearch(value)}
          onSortingChange={(column, direction) =>
            tableQueryState.setSorting(column, direction)
          }
          primaryAction={
            can.createUsers || can.manageUsers ? (
              <Link
                href={usersRoutes.create.url()}
                className="inline-flex min-h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg shadow-xs transition hover:bg-primary/90 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-ring active:bg-primary"
              >
                <PlusIcon className="size-4 mr-1.5 shrink-0" />
                Thêm người dùng
              </Link>
            ) : null
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

      {userPendingDelete ? (
        <DeleteUserDialog
          isOpen={userPendingDelete !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setUserPendingDelete(null);
            }
          }}
          onDeleted={reloadUsersList}
          user={userPendingDelete}
        />
      ) : null}
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

function DeleteUserDialog({
  isOpen,
  onOpenChange,
  onDeleted,
  user,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDeleted: () => void;
  user: CmsUserTableRow;
}) {
  const form = useForm({});

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    form.delete(usersRoutes.destroy.url({ user: user.id }), {
      onSuccess: () => {
        onOpenChange(false);
        onDeleted();
      },
      onError: () => {
        toast.error("Không thể xóa người dùng.");
      },
      preserveScroll: true,
    });
  }

  return (
    <ModalContent
      aria-label={`Xóa người dùng ${user.name}`}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      role="alertdialog"
      size="md"
    >
      <form onSubmit={submit}>
        <ModalHeader>
          <ModalTitle>Xóa người dùng</ModalTitle>
          <ModalDescription>
            Hành động này không thể hoàn tác. Tài khoản "{user.name}" sẽ bị xóa
            khỏi hệ thống nếu không còn liên kết với nội dung hoặc tệp.
          </ModalDescription>
        </ModalHeader>

        <ModalBody>
          <div className="rounded-lg border border-danger-subtle bg-danger-subtle/10 p-3 text-sm text-danger-fg">
            Người dùng: <span className="font-semibold">{user.email}</span>
          </div>
        </ModalBody>

        <ModalFooter className="space-x-2">
          <Button
            type="button"
            intent="secondary"
            onPress={() => onOpenChange(false)}
            isDisabled={form.processing}
          >
            Hủy
          </Button>
          <Button type="submit" intent="danger" isDisabled={form.processing}>
            {form.processing ? "Đang xóa..." : "Xóa người dùng"}
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  );
}
