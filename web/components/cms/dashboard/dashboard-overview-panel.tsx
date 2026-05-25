import { DashboardMainPanel } from "@/components/cms/dashboard/dashboard-main-panel";
import { DashboardStatGrid } from "@/components/cms/dashboard/dashboard-stat-grid";
import type { DashboardOverview } from "@/components/cms/types";

export function DashboardOverviewPanel({
  overview,
}: {
  overview: DashboardOverview;
}) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardStatGrid overview={overview} />
      <DashboardMainPanel overview={overview} />
    </div>
  );
}
