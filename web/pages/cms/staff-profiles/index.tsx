import {
  EyeIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Head, Link, router } from "@inertiajs/react";
import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";
import {
  CmsDataTable,
  DataTableBadge,
  DataTableActions,
} from "@/components/cms/cms-data-table";
import type {
  CmsStaffProfileRow,
  CmsStaffProfilesPageProps,
} from "@/components/cms/types";
import { useCmsTableQueryState } from "@/components/cms/use-cms-table-query-state";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/components/ui/menu";
import {
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { useCmsContentRealtime } from "@/hooks/use-cms-content-realtime";
import { useMountEffect } from "@/hooks/use-mount-effect";
import CmsLayout from "@/layouts/cms-layout";
import { create, destroy, edit, show } from "@/routes/cms/staff-profiles";
import type { FlashData } from "@/types/shared";
const columnHelper = createColumnHelper<CmsStaffProfileRow>();

export default function CmsStaffProfilesPage({
  can,
  flash,
  profiles,
}: CmsStaffProfilesPageProps) {
  const [deleteTarget, setDeleteTarget] = useState<CmsStaffProfileRow | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const tableQueryState = useCmsTableQueryState({
    defaultPerPage: profiles.meta.perPage,
    defaultSortColumn: "created_at",
    initialItems: profiles.data,
    initialMeta: profiles.meta,
    resourceKey: "profiles",
  });

  useCmsContentRealtime("staff-profiles", (payload) => {
    toast.info(payload.message);
    tableQueryState.list.reload();
  });

  const columns: Array<ColumnDef<CmsStaffProfileRow, any>> = [
    columnHelper.accessor("fullName", {
      id: "full_name",
      header: "Cán bộ",
      cell: ({ row }) => {
        const profile = row.original;

        return (
          <div className="flex items-center gap-3 py-1">
            <Avatar
              src={profile.avatarUrl ?? undefined}
              initials={profile.fullName.substring(0, 2).toUpperCase()}
              size="lg"
              className="border border-border"
              aria-label={`Ảnh đại diện của ${profile.displayName}`}
            />
            <Link
              href={show.url({ staffProfile: profile.id })}
              className="font-medium text-fg transition hover:text-primary text-sm"
            >
              {profile.displayName}
            </Link>
          </div>
        );
      },
    }),
    columnHelper.accessor("userEmail", {
      id: "user_email",
      header: "Tài khoản liên kết",
      enableSorting: false,
      cell: ({ getValue }) => (
        <span className="font-mono text-xs text-muted-fg">
          {getValue() || "Không có"}
        </span>
      ),
    }),
    columnHelper.accessor("email", {
      header: "Email",
      enableSorting: false,
      cell: ({ getValue }) => getValue() ?? "Chưa thiết lập",
    }),
    columnHelper.accessor("phone", {
      header: "Điện thoại",
      enableSorting: false,
      cell: ({ getValue }) => getValue() ?? "Chưa thiết lập",
    }),
    columnHelper.accessor("isPublic", {
      header: "Trạng thái",
      enableSorting: false,
      cell: ({ row }) => (
        <DataTableBadge
          intent={row.original.isPublic ? "success" : "secondary"}
        >
          {row.original.isPublic ? "Công khai" : "Ẩn / Nội bộ"}
        </DataTableBadge>
      ),
    }),
    columnHelper.accessor("updatedAt", {
      header: "Cập nhật",
      enableSorting: false,
      cell: ({ getValue }) => formatDateTime(getValue()),
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const profile = row.original;

        return (
          <DataTableActions
            triggerAriaLabel={`Tác vụ cho ${profile.displayName}`}
          >
            <MenuItem href={show.url({ staffProfile: profile.id })}>
              <EyeIcon />
              Xem chi tiết
            </MenuItem>
            <MenuItem href={edit.url({ staffProfile: profile.id })}>
              <PencilSquareIcon />
              Chỉnh sửa
            </MenuItem>
            {can.deleteStaffProfile ? (
              <MenuItem
                intent="danger"
                onAction={() => setDeleteTarget(profile)}
              >
                <TrashIcon />
                Xóa hồ sơ
              </MenuItem>
            ) : null}
          </DataTableActions>
        );
      },
    }),
  ];

  function deleteProfile(): void {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    router.delete(destroy.url({ staffProfile: deleteTarget.id }), {
      onFinish: () => setIsDeleting(false),
      onSuccess: () => {
        setDeleteTarget(null);
        tableQueryState.list.reload();
      },
      preserveScroll: true,
    });
  }

  return (
    <>
      <Head title="Hồ sơ cán bộ" />
      {flash?.message ? (
        <ProfilesFlashToast
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
          description="Quản lý thông tin cán bộ, giảng viên khoa CNTT, hiển thị avatar, thông tin liên hệ và trạng thái công khai."
          emptyDescription="Không tìm thấy hồ sơ cán bộ phù hợp. Hãy đổi bộ lọc hoặc tạo hồ sơ mới để bắt đầu."
          emptyTitle="Không tìm thấy hồ sơ cán bộ"
          filterSections={[
            {
              id: "status",
              label: "Trạng thái",
              options: [
                { label: "Tất cả trạng thái", value: "all" },
                { label: "Công khai", value: "public" },
                { label: "Nội bộ / Ẩn", value: "private" },
              ],
              selectedValue: tableQueryState.query.status,
              onChange: (value) => tableQueryState.setStatus(value),
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
            can.createStaffProfile ? (
              <Link
                href={create.url()}
                className="inline-flex min-h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg shadow-xs transition hover:bg-primary/90 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-ring active:bg-primary"
              >
                <PlusIcon className="size-4 mr-1.5 shrink-0" />
                Tạo hồ sơ
              </Link>
            ) : null
          }
          searchPlaceholder="Tìm theo tên, email, điện thoại hoặc mô tả"
          searchValue={tableQueryState.query.search}
          sort={{
            column: tableQueryState.query.sort,
            direction: tableQueryState.query.direction,
          }}
          title="Hồ sơ cán bộ"
        />
      </div>

      {deleteTarget ? (
        <ModalContent
          aria-label="Xác nhận xóa hồ sơ"
          isOpen={deleteTarget !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setDeleteTarget(null);
            }
          }}
          size="lg"
        >
          <ModalHeader>
            <ModalTitle>Xóa hồ sơ cán bộ</ModalTitle>
            <ModalDescription>
              Bạn sắp xóa hồ sơ của <strong>{deleteTarget.fullName}</strong>.
              Thao tác này sẽ gỡ thông tin cán bộ khỏi hệ thống, nhưng KHÔNG xóa
              tài khoản người dùng tương ứng.
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div className="rounded-2xl border border-danger-subtle bg-danger-subtle/40 px-4 py-3">
              <Text className="text-danger">
                Hãy kiểm tra lại dữ liệu phân công công tác hoặc lịch sử trước
                khi xóa.
              </Text>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button intent="outline" onPress={() => setDeleteTarget(null)}>
              Hủy
            </Button>
            <Button
              intent="danger"
              isDisabled={isDeleting}
              onPress={deleteProfile}
            >
              Xác nhận xóa
            </Button>
          </ModalFooter>
        </ModalContent>
      ) : null}
    </>
  );
}

CmsStaffProfilesPage.layout = (page: ReactNode) => (
  <CmsLayout>{page}</CmsLayout>
);

function ProfilesFlashToast({
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

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
