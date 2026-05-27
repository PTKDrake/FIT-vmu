import {
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  PlusIcon,
  Squares2X2Icon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Head, router } from "@inertiajs/react";
import { createColumnHelper  } from "@tanstack/react-table";
import type {ColumnDef} from "@tanstack/react-table";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { CmsDataTable } from "@/components/cms/cms-data-table";
import { PageFormDialog  } from "@/components/cms/page-form-dialog";
import type {PageFormValues} from "@/components/cms/page-form-dialog";
import type { CmsPageTableRow, CmsPagesPageProps } from "@/components/cms/types";
import { useCmsTableQueryState } from "@/components/cms/use-cms-table-query-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/components/ui/menu";
import { Text } from "@/components/ui/text";
import CmsLayout from "@/layouts/cms-layout";
import { clone, destroy, edit } from "@/routes/cms/pages";

const columnHelper = createColumnHelper<CmsPageTableRow>();

const statusOptions = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Bản nháp", value: "draft" },
  { label: "Chờ duyệt", value: "pending" },
  { label: "Đã xuất bản", value: "published" },
  { label: "Bị từ chối", value: "rejected" },
] as const;

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const emptyPageFormValues: PageFormValues = {
  excerpt: "",
  seo_description: "",
  seo_title: "",
  slug: "",
  title: "",
};

export default function CmsPagesPage({ pages }: CmsPagesPageProps) {
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activePage, setActivePage] = useState<PageFormValues>(emptyPageFormValues);

  const tableQueryState = useCmsTableQueryState({
    defaultPerPage: pages.meta.perPage,
    defaultSortColumn: "created_at",
    initialItems: pages.data,
    initialMeta: pages.meta,
    resourceKey: "pages",
  });

  const columns = useMemo<Array<ColumnDef<CmsPageTableRow, any>>>(
    () => [
      columnHelper.accessor("title", {
        header: "Trang",
        cell: ({ row }) => (
          <div className="space-y-1">
            <p className="font-medium text-fg">{row.original.title}</p>
            <Text className="line-clamp-2 text-sm text-muted-fg">
              {row.original.excerpt ?? `Slug: ${row.original.slug}`}
            </Text>
          </div>
        ),
      }),
      columnHelper.accessor("urlPath", {
        header: "URL",
        cell: ({ getValue, row }) => (
          <div className="space-y-1">
            <Text className="font-medium text-fg">{getValue()}</Text>
            <Text className="text-sm text-muted-fg">{row.original.slug}</Text>
          </div>
        ),
      }),
      columnHelper.accessor("seoTitle", {
        header: "SEO",
        cell: ({ row }) => (
          <div className="space-y-1">
            <Text className="line-clamp-1 font-medium text-fg">
              {row.original.seoTitle ?? "Chưa cấu hình SEO title"}
            </Text>
            <Text className="line-clamp-2 text-sm text-muted-fg">
              {row.original.seoDescription ?? "Chưa có SEO description"}
            </Text>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Trạng thái",
        cell: ({ getValue }) => {
          const value = getValue() as CmsPageTableRow["status"];

          return (
            <Badge
              intent={statusIntentMap[value]}
              isCircle={false}
              className="capitalize"
            >
              {statusLabelMap[value]}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("updatedAt", {
        header: "Cập nhật",
        cell: ({ getValue }) => formatDate(getValue()),
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Menu>
            <MenuTrigger
              aria-label={`Tác vụ cho trang ${row.original.title}`}
              className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-bg text-muted-fg transition hover:text-fg"
            >
              <EllipsisHorizontalIcon className="size-5" />
            </MenuTrigger>
            <MenuContent placement="bottom right">
              <MenuItem href={edit.url({ page: row.original.id })}>
                <Squares2X2Icon />
                Mở trình dựng
              </MenuItem>
              <MenuItem
                onAction={() => {
                  setDialogMode("edit");
                  setActivePage({
                    excerpt: row.original.excerpt ?? "",
                    id: row.original.id,
                    seo_description: row.original.seoDescription ?? "",
                    seo_title: row.original.seoTitle ?? "",
                    slug: row.original.slug,
                    title: row.original.title,
                  });
                  setDialogOpen(true);
                }}
              >
                <PencilSquareIcon />
                Sửa URL và SEO
              </MenuItem>
              <MenuItem
                onAction={() => {
                  router.post(clone.url({ page: row.original.id }), {}, { preserveScroll: true });
                }}
              >
                <PlusIcon />
                Nhân bản
              </MenuItem>
              <MenuItem
                intent="danger"
                onAction={() => {
                  if (!window.confirm(`Xóa trang "${row.original.title}"?`)) {
                    return;
                  }

                  router.delete(destroy.url({ page: row.original.id }), {
                    preserveScroll: true,
                  });
                }}
              >
                <TrashIcon />
                Xóa trang
              </MenuItem>
            </MenuContent>
          </Menu>
        ),
      }),
    ],
    [],
  );

  return (
    <>
      <Head title="Trang" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <CmsDataTable
          columns={columns}
          data={tableQueryState.data}
          defaultSort={{ column: "created_at", direction: "desc" }}
          description="Quản lý trang tĩnh, đường dẫn hiển thị và thông tin SEO."
          emptyDescription="Tạo trang đầu tiên để bắt đầu quản lý nội dung."
          emptyTitle="Chưa có trang nào"
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
            <Button
              onPress={() => {
                setDialogMode("create");
                setActivePage(emptyPageFormValues);
                setDialogOpen(true);
              }}
            >
              <PlusIcon />
              Tạo trang
            </Button>
          }
          searchPlaceholder="Tìm theo tiêu đề, slug, mô tả hoặc SEO"
          searchValue={tableQueryState.query.search}
          sort={{
            column: tableQueryState.query.sort,
            direction: tableQueryState.query.direction,
          }}
          title="Trang"
        />
      </div>

      <PageFormDialog
        key={`${dialogMode}-${activePage.id ?? "new"}`}
        initialValues={activePage}
        isOpen={dialogOpen}
        mode={dialogMode}
        onOpenChange={setDialogOpen}
      />
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

const statusIntentMap = {
  draft: "secondary",
  pending: "warning",
  published: "success",
  rejected: "danger",
} as const;

const statusLabelMap = {
  draft: "Bản nháp",
  pending: "Chờ duyệt",
  published: "Đã xuất bản",
  rejected: "Bị từ chối",
} as const;
