import {
  DocumentTextIcon,
  DocumentIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import type { DashboardOverview } from "@/components/cms/types";

export function DashboardStatGrid({
  overview,
}: {
  overview: DashboardOverview;
}) {
  const statCards = [
    {
      icon: DocumentTextIcon,
      label: "Bài viết",
      value: overview.stats.find((stat) => stat.key === "posts")?.value ?? 0,
      subtext: "Đã xuất bản",
      iconBg: "bg-primary-subtle",
      iconColor: "text-primary",
    },
    {
      icon: DocumentIcon,
      label: "Trang",
      value: overview.workspace.pagesCount ?? 0,
      subtext: "Đã xuất bản",
      iconBg: "bg-success-subtle",
      iconColor: "text-success",
    },
    {
      icon: FolderIcon,
      label: "Tệp",
      value: overview.workspace.mediaAssets ?? 0,
      subtext: "Trong thư viện",
      iconBg: "bg-[oklch(0.6_0.2_295)/0.1]",
      iconColor: "text-[oklch(0.6_0.2_295)]",
    },
  ];

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      {statCards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-overlay px-6 py-5 shadow-xs"
          >
            <div className="flex items-center gap-5">
              <div
                className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${card.iconBg} ${card.iconColor}`}
              >
                <Icon className="size-7" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-muted-fg">
                  {card.label}
                </p>
                <p className="text-3xl font-bold tracking-tight text-fg">
                  {card.value.toLocaleString("vi-VN")}
                </p>
                <p className="text-xs text-muted-fg">{card.subtext}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
