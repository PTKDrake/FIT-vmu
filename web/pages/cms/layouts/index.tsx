import {
  EllipsisHorizontalIcon,
  InformationCircleIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { SiteLayoutInfoFormDialog } from "@/components/layout-builder/site-layout-info-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
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
import { clone, create, destroy, edit } from "@/routes/cms/layouts";
import type { FlashData, SharedData } from "@/types/shared";

interface CmsLayoutRow {
  id: number;
  key: string;
  name: string;
  pagesCount: number;
  updatedAt: string;
}

interface DefaultLayoutIds {
  category: number | null;
  page: number | null;
  post: number | null;
}

interface CmsLayoutsPageProps extends SharedData {
  defaultLayoutIds: DefaultLayoutIds;
  layouts: CmsLayoutRow[];
}

const defaultTypeLabels: Record<keyof DefaultLayoutIds, string> = {
  page: "Mặc định trang",
  category: "Mặc định danh mục",
  post: "Mặc định bài viết",
};

const VIETNAMESE_DATE_FORMATTER = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function reloadLayouts(): void {
  router.reload({ only: ["defaultLayoutIds", "layouts"] });
}

export default function CmsLayoutsPage({
  flash,
  defaultLayoutIds,
  layouts,
}: CmsLayoutsPageProps) {
  const [editingLayout, setEditingLayout] = useState<CmsLayoutRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CmsLayoutRow | null>(null);

  useCmsContentRealtime("layouts", () => {
    reloadLayouts();
  });

  return (
    <>
      <Head title="Bố cục" />
      {flash?.message ? (
        <LayoutsFlashToast
          key={`${flash.type}:${flash.message}`}
          message={flash.message}
          type={flash.type}
        />
      ) : null}
      <SiteLayoutInfoFormDialog
        initialValues={{
          id: editingLayout?.id ?? 0,
          name: editingLayout?.name ?? "",
          key: editingLayout?.key ?? "",
        }}
        isOpen={editingLayout !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditingLayout(null);
          }
        }}
        onSaved={reloadLayouts}
      />
      {deleteTarget ? (
        <ModalContent
          aria-label="Xác nhận xóa layout"
          isOpen={deleteTarget !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setDeleteTarget(null);
            }
          }}
          role="alertdialog"
          size="lg"
        >
          <ModalHeader>
            <ModalTitle>Xóa layout</ModalTitle>
            <ModalDescription>
              Bạn sắp xóa layout <strong>{deleteTarget.name}</strong>. Thao tác
              này sẽ gỡ bố cục khỏi hệ thống và có thể ảnh hưởng đến các bản ghi
              đang tham chiếu tới layout này.
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div className="rounded-2xl border border-danger-subtle bg-danger-subtle/40 px-4 py-3">
              <Text className="text-danger">
                Layout đang được dùng trong `site_settings` sẽ không thể xóa.
                Hãy kiểm tra page, post hoặc category đang gán layout này trước
                khi xác nhận.
              </Text>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              intent="outline"
              onPress={() => setDeleteTarget(null)}
              type="button"
            >
              Hủy
            </Button>
            <Button
              intent="danger"
              onPress={() =>
                router.delete(destroy.url({ siteLayout: deleteTarget.id }), {
                  onSuccess: () => {
                    setDeleteTarget(null);
                    reloadLayouts();
                  },
                  preserveScroll: true,
                })
              }
            >
              Xác nhận xóa
            </Button>
          </ModalFooter>
        </ModalContent>
      ) : null}

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-overlay px-5 py-4">
          <div>
            <h1 className="text-lg font-semibold text-fg">Bố cục</h1>
            <Text className="text-sm text-muted-fg">
              Quản lý khung dùng chung cho đầu trang, thanh bên và chân trang
              công khai.
            </Text>
          </div>
          <Button onPress={() => router.visit(create.url())}>
            <PlusIcon className="size-4" />
            Tạo bố cục
          </Button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-overlay">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-fg">
              <tr>
                <th className="px-4 py-3 font-semibold">Bố cục</th>
                <th className="px-4 py-3 font-semibold">Trang dùng</th>
                <th className="px-4 py-3 font-semibold">Cập nhật</th>
                <th className="px-4 py-3">
                  <span className="sr-only">Tác vụ</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {layouts.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-10 text-center text-muted-fg"
                    colSpan={4}
                  >
                    Chưa có bố cục nào.
                  </td>
                </tr>
              ) : (
                layouts.map((layout) => (
                  <tr
                    className="border-b border-border last:border-b-0"
                    key={layout.id}
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div>
                          <div className="font-semibold text-fg">
                            {layout.name}
                          </div>
                          <div className="font-mono text-xs text-muted-fg">
                            {layout.key}
                          </div>
                        </div>
                        {defaultLayoutIds.page === layout.id ? (
                          <Badge intent="success">
                            {defaultTypeLabels.page}
                          </Badge>
                        ) : null}
                        {defaultLayoutIds.category === layout.id ? (
                          <Badge intent="success">
                            {defaultTypeLabels.category}
                          </Badge>
                        ) : null}
                        {defaultLayoutIds.post === layout.id ? (
                          <Badge intent="success">
                            {defaultTypeLabels.post}
                          </Badge>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-fg">
                      {layout.pagesCount}
                    </td>
                    <td className="px-4 py-3 text-muted-fg">
                      {formatDate(layout.updatedAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Menu>
                        <MenuTrigger aria-label={`Tác vụ cho ${layout.name}`}>
                          <EllipsisHorizontalIcon className="size-5" />
                        </MenuTrigger>
                        <MenuContent placement="bottom right">
                          <MenuItem onAction={() => setEditingLayout(layout)}>
                            <InformationCircleIcon />
                            Chỉnh sửa thông tin
                          </MenuItem>
                          <MenuItem href={edit.url({ siteLayout: layout.id })}>
                            <PencilSquareIcon />
                            Chỉnh sửa thành phần
                          </MenuItem>
                          <MenuItem
                            onAction={() =>
                              router.post(
                                clone.url({ siteLayout: layout.id }),
                                {},
                                {
                                  onSuccess: reloadLayouts,
                                  preserveScroll: true,
                                },
                              )
                            }
                          >
                            <PlusIcon />
                            Nhân bản
                          </MenuItem>
                          <MenuItem
                            intent="danger"
                            onAction={() => setDeleteTarget(layout)}
                          >
                            <TrashIcon />
                            Xóa
                          </MenuItem>
                        </MenuContent>
                      </Menu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function formatDate(value: string): string {
  return VIETNAMESE_DATE_FORMATTER.format(new Date(value));
}

function LayoutsFlashToast({
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

CmsLayoutsPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
