import {
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilSquareIcon,
  PlusIcon,
  Squares2X2Icon,
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
import type { PageFormValues } from "@/components/cms/page-form-dialog";
import type {
  CmsPageTableRow,
  CmsPagesPageProps,
} from "@/components/cms/types";
import { useCmsTableQueryState } from "@/components/cms/use-cms-table-query-state";
import { Button } from "@/components/ui/button";
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu";
import {
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { useCmsContentRealtime } from "@/hooks/use-cms-content-realtime";
import CmsLayout from "@/layouts/cms-layout";
import { t } from "@/lib/i18n";
import {
  clone,
  destroy,
  edit,
  create,
  builder,
  show,
} from "@/routes/cms/pages";

const columnHelper = createColumnHelper<CmsPageTableRow>();

const visibilityOptions = [
  { label: "Tất cả phạm vi", value: "all" },
  { label: "Công khai", value: "public" },
  { label: "Cần đăng nhập", value: "authenticated" },
  { label: "Mọi sinh viên", value: "students" },
  { label: "Nhóm sinh viên", value: "student_groups" },
  { label: "Ẩn", value: "hidden" },
] as const;

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default function CmsPagesPage({ pages }: CmsPagesPageProps) {
  const [deleteTarget, setDeleteTarget] = useState<CmsPageTableRow | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const tableQueryState = useCmsTableQueryState({
    defaultPerPage: pages.meta.perPage,
    defaultSortColumn: "created_at",
    initialItems: pages.data,
    initialMeta: pages.meta,
    resourceKey: "pages",
  });

  function reloadPagesList(): void {
    tableQueryState.list.reload();
  }

  useCmsContentRealtime("pages", (payload) => {
    toast.info(payload.message);
    reloadPagesList();
  });

  const columns: Array<ColumnDef<CmsPageTableRow, any>> = [
    columnHelper.accessor("title", {
      header: "Trang",
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="font-medium text-fg">{row.original.title}</p>
          <Text className="line-clamp-2 text-sm text-muted-fg">
            {row.original.excerpt ?? `Đường dẫn: ${row.original.slug}`}
          </Text>
        </div>
      ),
    }),
    columnHelper.accessor("urlPath", {
      header: "Đường dẫn",
      enableSorting: false,
      cell: ({ getValue }) => (
        <Text className="font-medium text-fg">{getValue()}</Text>
      ),
    }),
    columnHelper.accessor("slug", {
      id: "slug",
      header: "Đường dẫn",
      enableSorting: false,
      cell: ({ getValue }) => (
        <Text className="text-xs text-muted-fg font-mono">{getValue()}</Text>
      ),
    }),
    columnHelper.accessor("seoTitle", {
      header: "Tiêu đề SEO",
      enableSorting: false,
      cell: ({ getValue }) => (
        <Text className="font-medium text-fg">
          {getValue() ?? (
            <span className="text-xs text-muted-fg italic">
              {t("Chưa cấu hình")}
            </span>
          )}
        </Text>
      ),
    }),
    columnHelper.accessor("seoDescription", {
      id: "seo_description",
      header: "Mô tả SEO",
      enableSorting: false,
      cell: ({ getValue }) => (
        <Text className="text-xs text-muted-fg">
          {getValue() ?? (
            <span className="text-xs text-muted-fg italic">
              {t("Chưa cấu hình")}
            </span>
          )}
        </Text>
      ),
    }),
    columnHelper.accessor("visibility", {
      header: "Phạm vi",
      cell: ({ getValue }) => {
        const value = getValue() as CmsPageTableRow["visibility"];

        return (
          <DataTableBadge
            intent={visibilityIntentMap[value]}
            className="capitalize"
          >
            {visibilityLabelMap[value]}
          </DataTableBadge>
        );
      },
    }),
    columnHelper.accessor("updatedAt", {
      id: "updated_at",
      header: "Cập nhật",
      cell: ({ getValue }) => formatDate(getValue()),
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DataTableActions
          triggerAriaLabel={`Tác vụ cho trang ${row.original.title}`}
        >
          <MenuItem href={builder.url({ page: row.original.id })}>
            <Squares2X2Icon />
            Mở trình dựng
          </MenuItem>
          <MenuItem href={edit.url({ page: row.original.id })}>
            <PencilSquareIcon />
            Sửa URL và SEO
          </MenuItem>
          <MenuItem href={show.url({ page: row.original.id })}>
            <EyeIcon />
            Xem trước trang
          </MenuItem>
          <MenuItem
            onAction={() => {
              router.post(
                clone.url({ page: row.original.id }),
                {},
                {
                  onSuccess: reloadPagesList,
                  preserveScroll: true,
                },
              );
            }}
          >
            <PlusIcon />
            Nhân bản
          </MenuItem>
          <MenuItem
            intent="danger"
            onAction={() => setDeleteTarget(row.original)}
          >
            <TrashIcon />
            Xóa trang
          </MenuItem>
        </DataTableActions>
      ),
    }),
  ];

  function deletePage(): void {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    router.delete(destroy.url({ page: deleteTarget.id }), {
      onFinish: () => setIsDeleting(false),
      onSuccess: () => {
        setDeleteTarget(null);
        reloadPagesList();
      },
      preserveScroll: true,
    });
  }

  return (
    <>
      <Head title="Trang" />
      {deleteTarget ? (
        <ModalContent
          aria-label="Xác nhận xóa trang"
          isOpen={deleteTarget !== null}
          role="alertdialog"
          size="md"
          onOpenChange={(isOpen) => {
            if (!isOpen && !isDeleting) {
              setDeleteTarget(null);
            }
          }}
        >
          <ModalHeader>
            <ModalTitle>Xóa trang</ModalTitle>
            <ModalDescription>
              {`Bạn có chắc muốn xóa trang "${deleteTarget.title}"? Hành động này không thể hoàn tác.`}
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button
              intent="outline"
              isDisabled={isDeleting}
              onPress={() => setDeleteTarget(null)}
            >
              Hủy
            </Button>
            <Button
              intent="danger"
              isDisabled={isDeleting}
              onPress={deletePage}
            >
              {isDeleting ? "Đang xóa..." : "Xóa trang"}
            </Button>
          </ModalFooter>
        </ModalContent>
      ) : null}
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <CmsDataTable
          columns={columns}
          data={tableQueryState.data}
          defaultSort={{ column: "created_at", direction: "desc" }}
          description="Quản lý trang tĩnh, đường dẫn hiển thị và thông tin SEO."
          emptyDescription="Tạo trang đầu tiên để bắt đầu quản lý nội dung."
          emptyTitle="Chưa có trang nào"
          filterOptions={visibilityOptions.map((option) => ({ ...option }))}
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
            <Button onPress={() => router.visit(create())}>
              <PlusIcon />
              Tạo trang
            </Button>
          }
          searchPlaceholder="Tìm theo tiêu đề, đường dẫn, mô tả hoặc SEO"
          searchValue={tableQueryState.query.search}
          sort={{
            column: tableQueryState.query.sort,
            direction: tableQueryState.query.direction,
          }}
          title="Trang"
        />
      </div>
    </>
  );
}

CmsPagesPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;

function formatDate(value: string | null): string {
  if (!value) {
    return "Chưa xuất bản";
  }

  return dateFormatter.format(new Date(value));
}

const visibilityIntentMap = {
  public: "success",
  authenticated: "secondary",
  students: "primary",
  student_groups: "warning",
  hidden: "danger",
} as const;

const visibilityLabelMap = {
  public: "Công khai",
  authenticated: "Cần đăng nhập",
  students: "Mọi sinh viên",
  student_groups: "Nhóm sinh viên",
  hidden: "Ẩn",
} as const;
