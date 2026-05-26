import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { CmsDataTable } from "@/components/cms/cms-data-table";
import type {
  CmsPostTableRow,
  CmsPostsPageProps,
} from "@/components/cms/types";
import { useCmsTableQueryState } from "@/components/cms/use-cms-table-query-state";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import CmsLayout from "@/layouts/cms-layout";

const columnHelper = createColumnHelper<CmsPostTableRow>();

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

export default function CmsPostsPage({ posts }: CmsPostsPageProps) {
  const tableQueryState = useCmsTableQueryState({
    defaultPerPage: posts.meta.perPage,
    defaultSortColumn: "created_at",
    only: ["posts"],
  });

  const columns = useMemo<Array<ColumnDef<CmsPostTableRow, any>>>(
    () => [
      columnHelper.accessor("title", {
        header: "Bài viết",
        cell: ({ row }) => (
          <div className="space-y-1">
            <p className="font-medium text-fg">{row.original.title}</p>
            <Text className="line-clamp-2 text-sm text-muted-fg">
              {row.original.excerpt ?? `Slug: ${row.original.slug}`}
            </Text>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Trạng thái",
        cell: ({ getValue }) => {
          const value = getValue() as CmsPostTableRow["status"];

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
      columnHelper.accessor("authorName", {
        id: "author",
        header: "Tác giả",
        cell: ({ getValue }) => getValue() ?? "Chưa gán",
      }),
      columnHelper.accessor("publishedAt", {
        header: "Ngày xuất bản",
        cell: ({ getValue }) => formatDate(getValue()),
      }),
      columnHelper.accessor("updatedAt", {
        header: "Cập nhật",
        cell: ({ getValue }) => formatDate(getValue()),
      }),
    ],
    [],
  );

  return (
    <>
      <Head title="Bài viết" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <CmsDataTable
          columns={columns}
          data={posts.data}
          defaultSort={{ column: "created_at", direction: "desc" }}
          description="Danh sách bài viết này dùng TanStack Table cho cấu hình cột và trạng thái bảng, đồng thời đồng bộ tìm kiếm, lọc, sắp xếp, phân trang với query string bằng nuqs."
          emptyDescription="Hãy thử thay đổi bộ lọc hoặc tạo dữ liệu bài viết để kiểm tra luồng phân trang từ backend."
          emptyTitle="Chưa có bài viết phù hợp"
          filterOptions={statusOptions.map((option) => ({ ...option }))}
          filterValue={tableQueryState.query.status}
          isReloading={tableQueryState.isReloading}
          meta={posts.meta}
          onFilterChange={(value) => tableQueryState.setStatus(value)}
          onPageChange={(page) => tableQueryState.setPage(page)}
          onPerPageChange={(value) => tableQueryState.setPerPage(value)}
          onSearchChange={(value) => tableQueryState.setSearch(value)}
          onSortingChange={(column, direction) =>
            tableQueryState.setSorting(column, direction)
          }
          searchPlaceholder="Tìm theo tiêu đề, slug hoặc mô tả ngắn"
          searchValue={tableQueryState.query.search}
          sort={{
            column: tableQueryState.query.sort,
            direction: tableQueryState.query.direction,
          }}
          title="Bài viết"
        />
      </div>
    </>
  );
}

CmsPostsPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;

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
