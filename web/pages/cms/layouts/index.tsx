import {
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  PlusIcon,
  StarIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Head, router } from "@inertiajs/react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import { Text } from "@/components/ui/text";
import CmsLayout from "@/layouts/cms-layout";
import {
  create,
  defaultMethod,
  destroy,
  draft,
  edit,
  publish,
} from "@/routes/cms/layouts";
import type { SharedData } from "@/types/shared";

interface CmsLayoutRow {
  id: number;
  isDefault: boolean;
  key: string;
  name: string;
  pagesCount: number;
  status: "draft" | "published";
  updatedAt: string;
}

interface CmsLayoutsPageProps extends SharedData {
  layouts: CmsLayoutRow[];
}

export default function CmsLayoutsPage({ layouts }: CmsLayoutsPageProps) {
  return (
    <>
      <Head title="Layouts" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-overlay px-5 py-4">
          <div>
            <h1 className="text-lg font-semibold text-fg">Layouts</h1>
            <Text className="text-sm text-muted-fg">
              Quản lý shell dùng chung cho header, sidebar và footer public.
            </Text>
          </div>
          <Button onPress={() => router.visit(create.url())}>
            <PlusIcon className="size-4" />
            Tạo layout
          </Button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-overlay">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-fg">
              <tr>
                <th className="px-4 py-3 font-semibold">Layout</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold">Trang dùng</th>
                <th className="px-4 py-3 font-semibold">Cập nhật</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {layouts.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-10 text-center text-muted-fg"
                    colSpan={5}
                  >
                    Chưa có layout nào.
                  </td>
                </tr>
              ) : (
                layouts.map((layout) => (
                  <tr
                    className="border-b border-border last:border-b-0"
                    key={layout.id}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-semibold text-fg">
                            {layout.name}
                          </div>
                          <div className="font-mono text-xs text-muted-fg">
                            {layout.key}
                          </div>
                        </div>
                        {layout.isDefault ? (
                          <Badge intent="success">Mặc định</Badge>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        intent={
                          layout.status === "published"
                            ? "success"
                            : "secondary"
                        }
                      >
                        {layout.status === "published"
                          ? "Đã xuất bản"
                          : "Bản nháp"}
                      </Badge>
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
                          <MenuItem href={edit.url({ siteLayout: layout.id })}>
                            <PencilSquareIcon />
                            Chỉnh sửa
                          </MenuItem>
                          {!layout.isDefault ? (
                            <MenuItem
                              onAction={() =>
                                router.patch(
                                  defaultMethod.url({ siteLayout: layout.id }),
                                  {},
                                  { preserveScroll: true },
                                )
                              }
                            >
                              <StarIcon />
                              Đặt mặc định
                            </MenuItem>
                          ) : null}
                          <MenuItem
                            onAction={() =>
                              router.patch(
                                (layout.status === "published"
                                  ? draft
                                  : publish
                                ).url({
                                  siteLayout: layout.id,
                                }),
                                {},
                                { preserveScroll: true },
                              )
                            }
                          >
                            {layout.status === "published"
                              ? "Chuyển nháp"
                              : "Xuất bản"}
                          </MenuItem>
                          <MenuItem
                            intent="danger"
                            onAction={() =>
                              router.delete(
                                destroy.url({ siteLayout: layout.id }),
                                {
                                  preserveScroll: true,
                                },
                              )
                            }
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
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

CmsLayoutsPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
