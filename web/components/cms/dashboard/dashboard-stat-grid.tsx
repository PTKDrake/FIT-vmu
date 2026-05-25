import {
  DocumentDuplicateIcon,
  NewspaperIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import type { DashboardOverview } from "@/components/cms/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
          <Card
            key={card.label}
            className="overflow-hidden rounded-xl border-border bg-overlay shadow-none"
          >
            <CardHeader className="gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="rounded-xl bg-muted p-3 text-fg">
                  <Icon className="size-5" />
                </div>
                <Badge intent="outline" isCircle={false}>
                  Tổng quan
                </Badge>
              </div>
              <div className="space-y-1">
                <CardTitle>{card.label}</CardTitle>
                <Text>{card.value.toLocaleString("vi-VN")} mục</Text>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
