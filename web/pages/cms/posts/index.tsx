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
import { useState } from "react";
import { toast } from "sonner";
import {
  CmsDataTable,
  DataTableBadge,
  DataTableActions,
} from "@/components/cms/cms-data-table";
import { PretextTextarea } from "@/components/cms/pretext-textarea";
import type {
  CmsPostTableRow,
  CmsPostsPageProps,
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
import { useCmsContentRealtime } from "@/hooks/use-cms-content-realtime";
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

export default function CmsPostsPage({
  can,
  flash,
  posts,
  categoryOptions,
}: CmsPostsPageProps) {
  const [deleteTarget, setDeleteTarget] = useState<CmsPostTableRow | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<CmsPostTableRow | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError] = useState("");

  useCmsContentRealtime("posts", (payload) => {
    toast.info(payload.message);
    router.reload({ only: ["posts"] });
  });

  const tableQueryState = useCmsTableQueryState({
    defaultPerPage: posts.meta.perPage,
    defaultSortColumn: "created_at",
    initialItems: posts.data,
    initialMeta: posts.meta,
    resourceKey: "posts",
  });

  const columns: Array<ColumnDef<CmsPostTableRow, any>> = [
    columnHelper.accessor("title", {
      header: "Bài viết",
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="font-medium text-fg">{row.original.title}</p>
          <Text className="text-xs text-muted-fg font-mono block">
            {row.original.slug}
          </Text>
          {row.original.excerpt ? (
            <Text className="line-clamp-2 text-sm text-muted-fg mt-1">
              {row.original.excerpt}
            </Text>
          ) : null}
          {row.original.status === "rejected" &&
          row.original.rejectionReason ? (
            <div className="mt-2 text-xs text-danger border border-danger/20 bg-danger/5 p-2.5 rounded-lg max-w-lg">
              <span className="font-semibold block">Lý do từ chối:</span>
              <p className="mt-1 whitespace-pre-wrap">
                {row.original.rejectionReason}
              </p>
              {row.original.reviewerName ? (
                <span className="text-muted-fg block mt-1.5 text-[10px]">
                  Người từ chối: {row.original.reviewerName}
                  {row.original.reviewedAt
                    ? ` - ${formatDate(row.original.reviewedAt)}`
                    : ""}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      ),
    }),
    columnHelper.accessor("categoryNames", {
      id: "categories",
      header: "Chuyên mục",
      enableSorting: false,
      cell: ({ getValue }) => {
        const categoryNames = getValue() as string[];

        if (categoryNames.length === 0) {
          return (
            <span className="text-xs text-muted-fg italic">
              {t("Chưa phân loại")}
            </span>
          );
        }

        return (
          <div className="flex flex-wrap gap-1 max-w-[180px]">
            {categoryNames.map((categoryName) => (
              <DataTableBadge key={categoryName} intent="info">
                {categoryName}
              </DataTableBadge>
            ))}
          </div>
        );
      },
    }),
    columnHelper.accessor("status", {
      header: "Trạng thái",
      cell: ({ getValue }) => {
        const value = getValue() as CmsPostTableRow["status"];

        return (
          <DataTableBadge
            intent={statusIntentMap[value]}
            className="capitalize"
          >
            {statusLabelMap[value]}
          </DataTableBadge>
        );
      },
    }),
    columnHelper.accessor("authorName", {
      id: "author",
      header: "Tác giả",
      cell: ({ getValue }) => getValue() ?? "Chính hệ thống",
    }),
    columnHelper.accessor("publishedAt", {
      id: "published_at",
      header: "Ngày xuất bản",
      cell: ({ getValue }) => formatDate(getValue()),
    }),
    columnHelper.accessor("updatedAt", {
      header: "Cập nhật",
      enableSorting: false,
      cell: ({ getValue }) => formatDate(getValue()),
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const showApproval =
          can.publishPosts && row.original.status === "pending";
        const showManage = can.managePosts;

        if (!showManage && !showApproval) {
          return null;
        }

        return (
          <DataTableActions
            triggerAriaLabel={`Tác vụ cho ${row.original.title}`}
          >
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
                  className="text-primary"
                >
                  <CheckCircleIcon className="text-primary" />
                  Phê duyệt bài đăng
                </MenuItem>
                <MenuItem
                  intent="danger"
                  onAction={() => {
                    setRejectTarget(row.original);
                  }}
                >
                  <XCircleIcon className="text-danger" />
                  Từ chối bài viết
                </MenuItem>
              </>
            ) : null}

            {showManage ? (
              <MenuItem
                intent="danger"
                onAction={() => setDeleteTarget(row.original)}
              >
                <TrashIcon />
                Xóa bài viết
              </MenuItem>
            ) : null}
          </DataTableActions>
        );
      },
    }),
  ];

  function handlePublishStatus(
    postId: number,
    status: "published" | "rejected",
  ): void {
    setIsPublishing(true);
    router.patch(
      postsRoutes.publish.url({ post: postId }),
      {
        status,
      },
      {
        onFinish: () => setIsPublishing(false),
        preserveScroll: true,
      },
    );
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
        <PostsFlashToast
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
          description="Quản lý nội dung bài viết, tin tức sự kiện khoa học và phê duyệt lịch xuất bản."
          emptyDescription="Chưa có bài viết phù hợp với bộ lọc hiện tại."
          emptyTitle="Chưa có bài viết phù hợp"
          filterSections={[
            {
              id: "status",
              label: "Trạng thái",
              options: statusOptions.map((opt) => ({ ...opt })),
              selectedValue: tableQueryState.query.status,
              onChange: (value) => tableQueryState.setStatus(value),
            },
            {
              id: "categoryId",
              label: "Chuyên mục",
              options: [
                { label: "Tất cả chuyên mục", value: "all" },
                ...categoryOptions.map((opt) => ({ ...opt })),
              ],
              selectedValue:
                tableQueryState.query.categoryId === null
                  ? "all"
                  : String(tableQueryState.query.categoryId),
              onChange: (value) =>
                tableQueryState.setCategoryId(
                  value === "all" ? null : Number(value),
                ),
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
            can.managePosts ? (
              <Link
                href={postsRoutes.create.url()}
                className="inline-flex min-h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg shadow-xs transition hover:bg-primary/90 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-ring active:bg-primary"
              >
                <PlusIcon className="size-4 mr-1.5 shrink-0" />
                Tạo bài viết
              </Link>
            ) : null
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

      {rejectTarget ? (
        <ModalContent
          aria-label="Xác nhận từ chối bài viết"
          isOpen={rejectTarget !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setRejectTarget(null);
              setRejectionReason("");
              setRejectionError("");
            }
          }}
          size="lg"
        >
          <ModalHeader>
            <ModalTitle>Từ chối bài viết</ModalTitle>
            <ModalDescription>
              Bạn sắp từ chối bài viết <strong>{rejectTarget.title}</strong>.
              Vui lòng nhập lý do từ chối để tác giả có thể chỉnh sửa lại.
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-fg">
                  Lý do từ chối <span className="text-danger">*</span>
                </label>
                <PretextTextarea
                  className="min-h-24 rounded-lg border border-border bg-transparent p-3 focus:ring-2 focus:ring-primary"
                  maxRows={12}
                  placeholder="Ví dụ: Nội dung chưa phù hợp, thiếu hình ảnh minh họa..."
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => {
                    setRejectionReason(e.target.value);
                    if (e.target.value.trim()) {
                      setRejectionError("");
                    }
                  }}
                />
                {rejectionError ? (
                  <p className="text-xs text-danger">{rejectionError}</p>
                ) : null}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              intent="outline"
              onPress={() => {
                setRejectTarget(null);
                setRejectionReason("");
                setRejectionError("");
              }}
            >
              Hủy
            </Button>
            <Button
              intent="danger"
              isDisabled={isPublishing}
              onPress={() => {
                if (!rejectionReason.trim()) {
                  setRejectionError("Lý do từ chối là bắt buộc.");
                  return;
                }
                setIsPublishing(true);
                router.patch(
                  postsRoutes.publish.url({ post: rejectTarget.id }),
                  {
                    status: "rejected",
                    rejection_reason: rejectionReason,
                  },
                  {
                    onFinish: () => {
                      setIsPublishing(false);
                      setRejectTarget(null);
                      setRejectionReason("");
                      setRejectionError("");
                    },
                    preserveScroll: true,
                  },
                );
              }}
            >
              Xác nhận từ chối
            </Button>
          </ModalFooter>
        </ModalContent>
      ) : null}

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
              Bạn sắp xóa bài viết <strong>{deleteTarget.title}</strong>. Hành
              động này không thể phục hồi lại.
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div className="rounded-2xl border border-danger-subtle bg-danger-subtle/40 px-4 py-3">
              <Text className="text-danger">
                {t(
                  "Sau khi xóa, mọi liên kết đến bài viết này từ navigation menu hoặc trang công khai sẽ bị hỏng.",
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
              onPress={deletePost}
            >
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

function PostsFlashToast({
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
