import {
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Head, router } from "@inertiajs/react";
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
import { PositionFormDialog } from "@/components/cms/position-form-dialog";
import type { PositionFormValues } from "@/components/cms/position-form-dialog";
import type {
  CmsPositionRow,
  CmsPositionsPageProps,
} from "@/components/cms/types";
import { useCmsTableQueryState } from "@/components/cms/use-cms-table-query-state";
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
import { Text } from "@/components/ui/text";
import { t } from "@/lib/i18n";
import { useMountEffect } from "@/hooks/use-mount-effect";
import CmsLayout from "@/layouts/cms-layout";
import positionsRoutes from "@/routes/cms/positions";
import type { FlashData } from "@/types/shared";

const positionColumnHelper = createColumnHelper<CmsPositionRow>();

const statusOptions = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Đang hoạt động", value: "active" },
  { label: "Đang ẩn", value: "inactive" },
] as const;

const emptyPositionFormValues: PositionFormValues = {
  is_active: true,
  name: "",
  slug: "",
  sort_order: 0,
};

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function CmsPositionsPage({
  can,
  flash,
  positions,
}: CmsPositionsPageProps) {
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activePosition, setActivePosition] = useState<PositionFormValues>(
    emptyPositionFormValues,
  );
  const [deleteTarget, setDeleteTarget] = useState<CmsPositionRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const tableQueryState = useCmsTableQueryState({
    defaultPerPage: positions.meta.perPage,
    defaultSortColumn: "sort_order",
    defaultSortDirection: "asc",
    initialItems: positions.data,
    initialMeta: positions.meta,
    resourceKey: "positions",
  });

  const columns: Array<ColumnDef<CmsPositionRow, any>> = [
      positionColumnHelper.accessor("name", {
        header: "Chức vụ",
        cell: ({ getValue }) => (
          <Text className="font-medium text-fg">{getValue()}</Text>
        ),
      }),
      positionColumnHelper.accessor("slug", {
        id: "slug",
        header: "Slug",
        enableSorting: false,
        cell: ({ getValue }) => (
          <Text className="text-xs text-muted-fg font-mono">{getValue()}</Text>
        ),
      }),
      positionColumnHelper.accessor("sortOrder", {
        id: "sort_order",
        header: "Thứ tự",
        cell: ({ getValue }) => (
          <Text className="font-medium text-fg">{getValue()}</Text>
        ),
      }),
      positionColumnHelper.accessor("appointmentCount", {
        header: "Đang dùng",
        enableSorting: false,
        cell: ({ getValue }) => (
          <Text className="font-medium text-fg">{getValue()} bổ nhiệm</Text>
        ),
      }),
      positionColumnHelper.accessor("isActive", {
        header: "Trạng thái",
        enableSorting: false,
        cell: ({ getValue }) => (
          <DataTableBadge intent={getValue() ? "success" : "secondary"}>
            {getValue() ? "Đang hoạt động" : "Đang ẩn"}
          </DataTableBadge>
        ),
      }),
      positionColumnHelper.accessor("updatedAt", {
        header: "Cập nhật",
        enableSorting: false,
        cell: ({ getValue }) => dateFormatter.format(new Date(getValue())),
      }),
      positionColumnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) =>
          can.managePositions ? (
            <DataTableActions
              triggerAriaLabel={`Tác vụ cho ${row.original.name}`}
            >
              <MenuItem
                onAction={() => {
                  setDialogMode("edit");
                  setActivePosition({
                    id: row.original.id,
                    is_active: row.original.isActive,
                    name: row.original.name,
                    slug: row.original.slug,
                    sort_order: row.original.sortOrder,
                  });
                  setDialogOpen(true);
                }}
              >
                <PencilSquareIcon />
                Chỉnh sửa
              </MenuItem>
              <MenuItem
                intent="danger"
                onAction={() => setDeleteTarget(row.original)}
              >
                <TrashIcon />
                Xóa chức vụ
              </MenuItem>
            </DataTableActions>
          ) : null,
      }),
  ];

  function deletePosition(): void {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    router.delete(positionsRoutes.destroy.url({ position: deleteTarget.id }), {
      onFinish: () => setIsDeleting(false),
      onSuccess: () => setDeleteTarget(null),
      preserveScroll: true,
    });
  }

  return (
    <>
      <Head title="Chức vụ" />
      {flash?.message ? (
        <PositionsFlashToast
          key={`${flash.type}:${flash.message}`}
          message={flash.message}
          type={flash.type}
        />
      ) : null}

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <CmsDataTable
          columns={columns}
          data={tableQueryState.data}
          defaultSort={{ column: "sort_order", direction: "asc" }}
          description="Quản lý danh mục chức vụ dùng chung cho staff appointments và thứ tự hiển thị."
          emptyDescription="Tạo chức vụ đầu tiên để hồ sơ cán bộ có thể gắn vai trò theo từng đơn vị."
          emptyTitle="Chưa có chức vụ nào"
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
            can.managePositions ? (
              <Button
                onPress={() => {
                  setDialogMode("create");
                  setActivePosition(emptyPositionFormValues);
                  setDialogOpen(true);
                }}
              >
                <PlusIcon />
                Tạo chức vụ
              </Button>
            ) : null
          }
          searchPlaceholder="Tìm theo tên chức vụ hoặc slug"
          searchValue={tableQueryState.query.search}
          sort={{
            column: tableQueryState.query.sort,
            direction: tableQueryState.query.direction,
          }}
          title="Chức vụ"
        />
      </div>

      <PositionFormDialog
        key={`${dialogMode}-${activePosition.id ?? "new"}`}
        initialValues={activePosition}
        isOpen={dialogOpen}
        mode={dialogMode}
        onOpenChange={setDialogOpen}
      />

      {deleteTarget ? (
        <ModalContent
          aria-label="Xác nhận xóa chức vụ"
          isOpen={deleteTarget !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setDeleteTarget(null);
            }
          }}
          size="lg"
        >
          <ModalHeader>
            <ModalTitle>Xóa chức vụ</ModalTitle>
            <ModalDescription>
              Bạn sắp xóa <strong>{deleteTarget.name}</strong>. Hãy chắc chắn
              rằng không còn cần giữ các bổ nhiệm đang tham chiếu đến chức vụ
              này.
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div className="rounded-2xl border border-danger-subtle bg-danger-subtle/40 px-4 py-3">
              <Text className="text-danger">
                {t(
                  "Việc xóa danh mục chức vụ có thể ảnh hưởng đến dữ liệu staff appointments đã tồn tại.",
                )}
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
              onPress={deletePosition}
            >
              Xác nhận xóa
            </Button>
          </ModalFooter>
        </ModalContent>
      ) : null}
    </>
  );
}

CmsPositionsPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;

function PositionsFlashToast({
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
