import { Head, usePage } from "@inertiajs/react";
import type { ReactNode } from "react";
import { DashboardOverviewPanel } from "@/components/cms/dashboard/dashboard-overview-panel";
import type { CmsDashboardPageProps } from "@/components/cms/types";
import CmsLayout from "@/layouts/cms-layout";

export default function CmsDashboardPage() {
  const { overview } = usePage<CmsDashboardPageProps>().props;

  return (
    <>
      <Head title="Dashboard" />
      <DashboardOverviewPanel overview={overview} />
    </>
  );
}

CmsDashboardPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
