import {
  DocumentDuplicateIcon,
  NewspaperIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import type { DashboardOverview } from "@/components/cms/types";
import { Text } from "@/components/ui/text";

export function DashboardStatGrid({
  overview,
}: {
  overview: DashboardOverview;
}) {
  const statCards = [
    {
      icon: NewspaperIcon,
      label: "Bài viết đã xuất bản",
      value: overview.stats.find((stat) => stat.key === "posts")?.value ?? 0,
    },
    {
      icon: DocumentDuplicateIcon,
      label: "Tài liệu công khai",
      value:
        overview.stats.find((stat) => stat.key === "documents")?.value ?? 0,
    },
    {
      icon: PhotoIcon,
      label: "Tệp media",
      value: overview.workspace.mediaAssets,
    },
  ];

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      {statCards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-overlay"
          >
            <div className="px-5 py-4">
              <div className="space-y-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-fg">
                  <Icon className="size-5" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-fg">{card.label}</p>
                  <Text>{card.value.toLocaleString("vi-VN")} mục</Text>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
