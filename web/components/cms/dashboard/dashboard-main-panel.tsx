import type { DashboardOverview } from "@/components/cms/types";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

export function DashboardMainPanel({
  overview,
}: {
  overview: DashboardOverview;
}) {
  return (
    <div className="min-h-[100vh] flex-1 rounded-2xl border border-border bg-overlay md:min-h-min">
      <div className="border-b border-border px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-lg font-semibold text-fg">Tổng quan CMS</p>
            <p className="max-w-3xl text-sm text-muted-fg">
              Theo dõi nội dung đang hoạt động và các hạng mục cần xử lý.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-muted/50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-fg">
                Chờ duyệt
              </p>
              <p className="mt-2 text-2xl font-semibold text-fg">
                {overview.pendingReview.length.toLocaleString("vi-VN")}
              </p>
              <Text>Hạng mục đang chờ xử lý.</Text>
            </div>
            <div className="rounded-xl border border-border bg-muted/50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-fg">
                Cập nhật gần đây
              </p>
              <p className="mt-2 text-2xl font-semibold text-fg">
                {overview.recentActivity.length.toLocaleString("vi-VN")}
              </p>
              <Text>Các thay đổi mới nhất trong hệ thống.</Text>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.9fr)]">
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-fg">Hoạt động gần đây</p>
              <Badge intent="outline" isCircle={false}>
                {overview.recentActivity.length} mục
              </Badge>
            </div>
            <div className="mt-4 space-y-3">
              {overview.recentActivity.slice(0, 4).map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-xl border border-border bg-overlay px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-fg">{activity.title}</p>
                    <p className="text-xs text-muted-fg">
                      {formatDate(activity.updatedAt)}
                    </p>
                  </div>
                  <Text className="mt-1">{activity.description}</Text>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-fg">Tài liệu gần đây</p>
              <Badge intent="outline" isCircle={false}>
                {overview.recentDocuments.length} mục
              </Badge>
            </div>
            <div className="mt-4 space-y-3">
              {overview.recentDocuments.slice(0, 3).map((document) => (
                <div
                  key={document.id}
                  className="rounded-xl border border-border bg-overlay px-4 py-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-fg">{document.title}</p>
                    <Badge intent="outline" isCircle={false}>
                      {document.documentType.replaceAll("_", " ")}
                    </Badge>
                  </div>
                  <Text className="mt-1">
                    Cập nhật ngày {formatDate(document.updatedAt)}.
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <p className="font-medium text-fg">Không gian làm việc</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-border bg-overlay px-4 py-3">
                <p className="text-sm font-medium text-fg">
                  Bộ sưu tập khả dụng
                </p>
                <p className="mt-2 text-3xl font-semibold text-fg">
                  {overview.workspace.accessibleCollections.toLocaleString(
                    "vi-VN",
                  )}
                </p>
                <Text>Số module quản trị đang khả dụng.</Text>
              </div>
              <div className="rounded-xl border border-border bg-overlay px-4 py-3">
                <p className="text-sm font-medium text-fg">Nút tổ chức</p>
                <p className="mt-2 text-3xl font-semibold text-fg">
                  {overview.workspace.organizationNodes.toLocaleString("vi-VN")}
                </p>
                <Text>Tổng số đơn vị và cấu trúc đang quản lý.</Text>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <p className="font-medium text-fg">Mục chờ duyệt</p>
            <div className="mt-4 space-y-3">
              {overview.pendingReview.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-border bg-overlay px-4 py-3"
                >
                  <p className="font-medium text-fg">{item.title}</p>
                  <Text className="mt-1">Phụ trách: {item.owner}</Text>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
