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
import { CategoryFormDialog } from "@/components/cms/category-form-dialog";
import type { CategoryFormValues } from "@/components/cms/category-form-dialog";
import {
  CmsDataTable,
  DataTableBadge,
  DataTableActions,
} from "@/components/cms/cms-data-table";
import type {
  CmsPostCategoryRow,
  CmsPostCategoriesPageProps,
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
import { useMountEffect } from "@/hooks/use-mount-effect";
import CmsLayout from "@/layouts/cms-layout";
import postCategoriesRoutes from "@/routes/cms/post-categories";
import type { FlashData } from "@/types/shared";

const categoryColumnHelper = createColumnHelper<CmsPostCategoryRow>();

const statusOptions = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Đang hoạt động", value: "active" },
  { label: "Đang ẩn", value: "inactive" },
] as const;

const emptyCategoryFormValues: CategoryFormValues = {
  description: "",
  is_active: true,
  name: "",
  parent_id: null,
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

export default function CmsPostCategoriesPage({
  can,
  flash,
  categories,
  parentOptions,
}: CmsPostCategoriesPageProps) {
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryFormValues>(
    emptyCategoryFormValues,
  );
  const [deleteTarget, setDeleteTarget] = useState<CmsPostCategoryRow | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const tableQueryState = useCmsTableQueryState({
    defaultPerPage: categories.meta.perPage,
    defaultSortColumn: "sort_order",
    defaultSortDirection: "asc",
    initialItems: categories.data,
    initialMeta: categories.meta,
    resourceKey: "categories",
  });

  const columns: Array<ColumnDef<CmsPostCategoryRow, any>> = [
      categoryColumnHelper.accessor("name", {
        header: "Danh mục",
        cell: ({ getValue }) => (
          <Text className="font-medium text-fg">{getValue()}</Text>
        ),
      }),
      categoryColumnHelper.accessor("slug", {
        id: "slug",
        header: "Slug",
        enableSorting: false,
        cell: ({ getValue }) => (
          <Text className="text-xs text-muted-fg font-mono">{getValue()}</Text>
        ),
      }),
      categoryColumnHelper.accessor("parentName", {
        header: "Danh mục cha",
        enableSorting: false,
        cell: ({ getValue }) => (
          <Text className="text-sm text-muted-fg">
            {getValue() ? (
              <DataTableBadge intent="info">{getValue()}</DataTableBadge>
            ) : (
              <span className="text-muted-fg/60 italic">Cấp cao nhất</span>
            )}
          </Text>
        ),
      }),
      categoryColumnHelper.accessor("sortOrder", {
        id: "sort_order",
        header: "Thứ tự",
        cell: ({ getValue }) => (
          <Text className="font-medium text-fg">{getValue()}</Text>
        ),
      }),
      categoryColumnHelper.accessor("postCount", {
        header: "Số bài viết",
        enableSorting: false,
        cell: ({ getValue }) => (
          <Text className="font-medium text-fg">{getValue()} bài viết</Text>
        ),
      }),
      categoryColumnHelper.accessor("childrenCount", {
        header: "Danh mục con",
        enableSorting: false,
        cell: ({ getValue }) => (
          <Text className="font-medium text-fg">{getValue()} con</Text>
        ),
      }),
      categoryColumnHelper.accessor("isActive", {
        header: "Trạng thái",
        enableSorting: false,
        cell: ({ getValue }) => (
          <DataTableBadge intent={getValue() ? "success" : "secondary"}>
            {getValue() ? "Đang hoạt động" : "Đang ẩn"}
          </DataTableBadge>
        ),
      }),
      categoryColumnHelper.accessor("updatedAt", {
        header: "Cập nhật",
        enableSorting: false,
        cell: ({ getValue }) => dateFormatter.format(new Date(getValue())),
      }),
      categoryColumnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) =>
          can.manageCategories ? (
            <DataTableActions
              triggerAriaLabel={`Tác vụ cho ${row.original.name}`}
            >
              <MenuItem
                onAction={() => {
                  setDialogMode("edit");
                  setActiveCategory({
                    description: row.original.description ?? "",
                    id: row.original.id,
                    is_active: row.original.isActive,
                    name: row.original.name,
                    parent_id: row.original.parentId,
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
                Xóa danh mục
              </MenuItem>
            </DataTableActions>
          ) : null,
      }),
  ];

  function deleteCategory(): void {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    router.delete(
      postCategoriesRoutes.destroy.url({ post_category: deleteTarget.id }),
      {
        onFinish: () => setIsDeleting(false),
        onSuccess: () => setDeleteTarget(null),
        preserveScroll: true,
      },
    );
  }

  return (
    <>
      <Head title="Danh mục bài viết" />
      {flash?.message ? (
        <CategoriesFlashToast
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
          description="Quản lý danh mục bài viết dùng để phân loại bài viết, tin tức trên website và làm đích liên kết cho menu navigation."
          emptyDescription="Tạo danh mục đầu tiên để có thể phân loại các bài viết trong hệ thống."
          emptyTitle="Chưa có danh mục nào"
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
            can.manageCategories ? (
              <Button
                onPress={() => {
                  setDialogMode("create");
                  setActiveCategory(emptyCategoryFormValues);
                  setDialogOpen(true);
                }}
              >
                <PlusIcon />
                Tạo danh mục
              </Button>
            ) : null
          }
          searchPlaceholder="Tìm theo tên danh mục hoặc slug"
          searchValue={tableQueryState.query.search}
          sort={{
            column: tableQueryState.query.sort,
            direction: tableQueryState.query.direction,
          }}
          title="Danh mục bài viết"
        />
      </div>

      <CategoryFormDialog
        key={`${dialogMode}-${activeCategory.id ?? "new"}`}
        initialValues={activeCategory}
        isOpen={dialogOpen}
        mode={dialogMode}
        onOpenChange={setDialogOpen}
        parentOptions={parentOptions}
      />

      {deleteTarget ? (
        <ModalContent
          aria-label="Xác nhận xóa danh mục"
          isOpen={deleteTarget !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setDeleteTarget(null);
            }
          }}
          size="lg"
        >
          <ModalHeader>
            <ModalTitle>Xóa danh mục bài viết</ModalTitle>
            <ModalDescription>
              Bạn sắp xóa danh mục <strong>{deleteTarget.name}</strong>. Các
              danh mục con hoặc bài viết thuộc danh mục này sẽ bị hủy liên kết
              danh mục.
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div className="rounded-2xl border border-danger-subtle bg-danger-subtle/40 px-4 py-3">
              <Text className="text-danger">
                Hành động này không thể hoàn tác. Các danh mục con sẽ chuyển về
                danh mục cấp cao nhất.
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
              onPress={deleteCategory}
            >
              Xác nhận xóa
            </Button>
          </ModalFooter>
        </ModalContent>
      ) : null}
    </>
  );
}

CmsPostCategoriesPage.layout = (page: ReactNode) => (
  <CmsLayout>{page}</CmsLayout>
);

function CategoriesFlashToast({
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
