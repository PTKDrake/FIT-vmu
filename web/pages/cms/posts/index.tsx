import {
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Head, Link, router } from "@inertiajs/react";
import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CmsDataTable } from "@/components/cms/cms-data-table";
import type {
  CmsPostTableRow,
  CmsPostsPageProps,
} from "@/components/cms/types";
import { useCmsTableQueryState } from "@/components/cms/use-cms-table-query-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectLabel } from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { useMountEffect } from "@/hooks/use-mount-effect";
import CmsLayout from "@/layouts/cms-layout";
import postsRoutes from "@/routes/cms/posts";
import type { FlashData } from "@/types/shared";

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
  hour: "2-digit",
  minute: "2-digit",
});

export default function CmsPostsPage({ can, flash, posts, categoryOptions }: CmsPostsPageProps) {
  const [deleteTarget, setDeleteTarget] = useState<CmsPostTableRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const tableQueryState = useCmsTableQueryState({
    defaultPerPage: posts.meta.perPage,
    defaultSortColumn: "created_at",
    initialItems: posts.data,
    initialMeta: posts.meta,
    resourceKey: "posts",
  });

  const columns = useMemo<Array<ColumnDef<CmsPostTableRow, any>>>(
    () => [
      columnHelper.accessor("title", {
        header: "Bài viết",
        cell: ({ row }) => (
          <div className="space-y-1">
            <p className="font-medium text-fg">{row.original.title}</p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <Text className="text-xs text-muted-fg font-mono">
                {row.original.slug}
              </Text>
              {row.original.categoryNames.length > 0 ? (
                <>
                  <span className="text-muted-fg/40 text-xs">•</span>
                  {row.original.categoryNames.map((categoryName) => (
                    <Badge key={categoryName} intent="info" isCircle={false}>
                      {categoryName}
                    </Badge>
                  ))}
                </>
              ) : null}
            </div>
            {row.original.excerpt ? (
              <Text className="line-clamp-2 text-sm text-muted-fg mt-1">
                {row.original.excerpt}
              </Text>
            ) : null}
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
        cell: ({ getValue }) => getValue() ?? "Chính hệ thống",
      }),
      columnHelper.accessor("publishedAt", {
        header: "Ngày xuất bản",
        cell: ({ getValue }) => formatDate(getValue()),
      }),
      columnHelper.accessor("updatedAt", {
        header: "Cập nhật",
        cell: ({ getValue }) => formatDate(getValue()),
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const showApproval = can.publishPosts && (row.original.status === "pending" || row.original.status === "draft");
          const showManage = can.managePosts;

          if (!showManage && !showApproval) {
            return null;
          }

          return (
            <Menu>
              <MenuTrigger
                aria-label={`Tác vụ cho ${row.original.title}`}
                className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-bg text-muted-fg transition hover:text-fg"
              >
                <EllipsisHorizontalIcon className="size-5" />
              </MenuTrigger>
              <MenuContent placement="bottom right">
                {showManage ? (
                  <MenuItem
                    onAction={() => {
                      router.visit(postsRoutes.edit.url({ post: row.original.id }));
                    }}
                  >
                    <PencilSquareIcon />
                    Chỉnh sửa
                  </MenuItem>
                ) : null}

                {showApproval ? (
                  <>
                    <MenuItem
                      onAction={() => {
                        handlePublishStatus(row.original.id, "published");
                      }}
                    >
                      <CheckCircleIcon className="text-success" />
                      Phê duyệt đăng bài
                    </MenuItem>
                    <MenuItem
                      intent="danger"
                      onAction={() => {
                        handlePublishStatus(row.original.id, "rejected");
                      }}
                    >
                      <XCircleIcon className="text-danger" />
                      Từ chối bài viết
                    </MenuItem>
                  </>
                ) : null}

                {showManage ? (
                  <MenuItem intent="danger" onAction={() => setDeleteTarget(row.original)}>
                    <TrashIcon />
                    Xóa bài viết
                  </MenuItem>
                ) : null}
              </MenuContent>
            </Menu>
          );
        },
      }),
    ],
    [can.managePosts, can.publishPosts],
  );

  function handlePublishStatus(postId: number, status: "published" | "rejected"): void {
    setIsPublishing(true);
    router.patch(postsRoutes.publish.url({ post: postId }), {
      status,
    }, {
      onFinish: () => setIsPublishing(false),
      preserveScroll: true,
    });
  }

  function deletePost(): void {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    router.delete(postsRoutes.destroy.url({ post: deleteTarget.id }), {
      onFinish: () => setIsDeleting(false),
      onSuccess: () => setDeleteTarget(null),
      preserveScroll: true,
    });
  }

  return (
    <>
      <Head title="Bài viết" />
      {flash?.message ? (
        <PostsFlashToast key={`${flash.type}:${flash.message}`} message={flash.message} type={flash.type} />
      ) : null}

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <CmsDataTable
          columns={columns}
          data={tableQueryState.data}
          defaultSort={{ column: "created_at", direction: "desc" }}
          description="Quản lý nội dung bài viết, tin tức sự kiện khoa học và phê duyệt lịch xuất bản."
          emptyDescription="Chưa có bài viết phù hợp với bộ lọc hiện tại."
          emptyTitle="Chưa có bài viết phù hợp"
          filterOptions={statusOptions.map((option) => ({ ...option }))}
          filterValue={tableQueryState.query.status}
          isReloading={tableQueryState.isReloading}
          meta={tableQueryState.meta}
          onFilterChange={(value) => tableQueryState.setStatus(value)}
          onPageChange={(page) => tableQueryState.setPage(page)}
          onPerPageChange={(value) => tableQueryState.setPerPage(value)}
          onSearchChange={(value) => tableQueryState.setSearch(value)}
          onSortingChange={(column, direction) => tableQueryState.setSorting(column, direction)}
          primaryAction={
            <div className="flex items-center gap-3">
              <Select
                aria-label="Lọc theo chuyên mục"
                selectedKey={
                  tableQueryState.query.categoryId === null
                    ? "all"
                    : String(tableQueryState.query.categoryId)
                }
                onSelectionChange={(key) => {
                  void tableQueryState.setCategoryId(key === "all" ? null : Number(key));
                }}
              >
                <SelectTrigger className="w-48 text-start" />
                <SelectContent>
                  <SelectItem id="all" textValue="Tất cả chuyên mục">
                    <SelectLabel>Tất cả chuyên mục</SelectLabel>
                  </SelectItem>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} id={opt.value} textValue={opt.label}>
                      <SelectLabel>{opt.label}</SelectLabel>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {can.managePosts ? (
                <Link
                  href={postsRoutes.create.url()}
                  className="inline-flex min-h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg shadow-xs transition hover:bg-primary/90 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-ring active:bg-primary"
                >
                  <PlusIcon className="size-4 mr-1.5 shrink-0" />
                  Tạo bài viết
                </Link>
              ) : null}
            </div>
          }
          searchPlaceholder="Tìm theo tiêu đề, slug hoặc mô tả"
          searchValue={tableQueryState.query.search}
          sort={{
            column: tableQueryState.query.sort,
            direction: tableQueryState.query.direction,
          }}
          title="Bài viết"
        />
      </div>

      {deleteTarget ? (
        <ModalContent
          aria-label="Xác nhận xóa bài viết"
          isOpen={deleteTarget !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setDeleteTarget(null);
            }
          }}
          size="lg"
        >
          <ModalHeader>
            <ModalTitle>Xóa bài viết</ModalTitle>
            <ModalDescription>
              Bạn sắp xóa bài viết <strong>{deleteTarget.title}</strong>. Hành động này không thể phục hồi lại.
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div className="rounded-2xl border border-danger-subtle bg-danger-subtle/40 px-4 py-3">
              <Text className="text-danger">
                Sau khi xóa, mọi liên kết đến bài viết này từ navigation menu hoặc trang công khai sẽ bị hỏng.
              </Text>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button intent="outline" onPress={() => setDeleteTarget(null)}>
              Hủy
            </Button>
            <Button intent="danger" isDisabled={isDeleting} onPress={deletePost}>
              Xác nhận xóa
            </Button>
          </ModalFooter>
        </ModalContent>
      ) : null}
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

function PostsFlashToast({ message, type }: { message: string; type: FlashData["type"] }) {
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
