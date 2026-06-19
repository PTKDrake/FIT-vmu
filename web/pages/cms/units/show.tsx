import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Head, Link } from "@inertiajs/react";
import type { ReactNode } from "react";
import type { CmsUnitShowPageProps } from "@/components/cms/types";
import { BlockNoteReadonly } from "@/components/editor/blocknote-readonly";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import CmsLayout from "@/layouts/cms-layout";
import { units as unitsIndex } from "@/routes/cms";
import { create, edit } from "@/routes/cms/units";

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function CmsUnitShowPage({ can, unit }: CmsUnitShowPageProps) {
  return (
    <>
      <Head title={unit.name} />

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="rounded-2xl border border-border bg-overlay px-5 py-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  intent={unit.isActive ? "success" : "secondary"}
                  isCircle={false}
                >
                  {unit.isActive ? "Đang hoạt động" : "Đang ẩn"}
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-xl font-semibold text-fg">{unit.name}</p>
                <p className="text-sm text-muted-fg">Đường dẫn: {unit.slug}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {can.manageUnits ? (
                <>
                  <Link
                    href={create.url()}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-4 text-sm font-medium text-secondary-fg transition hover:opacity-90"
                  >
                    <PlusIcon className="size-4" />
                    Tạo đơn vị
                  </Link>
                  <Link
                    href={edit.url({ unit: unit.id })}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-fg transition hover:opacity-90"
                  >
                    <PencilSquareIcon className="size-4" />
                    Chỉnh sửa
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.8fr)]">
          <div className="rounded-2xl border border-border bg-overlay px-5 py-5">
            <div className="space-y-2 pb-4">
              <p className="text-lg font-semibold text-fg">Mô tả đơn vị</p>
              <p className="text-sm text-muted-fg">
                Nội dung readonly được render trực tiếp từ BlockNote JSON đang
                lưu trong hệ thống.
              </p>
            </div>

            <BlockNoteReadonly content={unit.description} />
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-overlay px-5 py-5">
              <p className="text-lg font-semibold text-fg">Thông tin nhanh</p>
              <div className="mt-4 space-y-3">
                <UnitMeta label="Thứ tự" value={String(unit.sortOrder)} />
                <UnitMeta
                  label="Nhân sự gắn kết"
                  value={`${unit.appointmentCount}`}
                />
                <UnitMeta
                  label="Cập nhật"
                  value={dateFormatter.format(new Date(unit.updatedAt))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

CmsUnitShowPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;

function UnitMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-bg px-4 py-3">
      <Text className="text-sm text-muted-fg">{label}</Text>
      <Text className="mt-1 font-medium text-fg">{value}</Text>
    </div>
  );
}
