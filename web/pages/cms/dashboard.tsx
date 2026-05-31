import { Head, router, usePage } from "@inertiajs/react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { DashboardOverviewPanel } from "@/components/cms/dashboard/dashboard-overview-panel";
import type { CmsDashboardPageProps } from "@/components/cms/types";
import { useCmsContentRealtime } from "@/hooks/use-cms-content-realtime";
import CmsLayout from "@/layouts/cms-layout";

export default function CmsDashboardPage() {
  const { overview } = usePage<CmsDashboardPageProps>().props;

  useCmsContentRealtime("posts", (payload) => {
    toast.info(payload.message);
    router.reload({ only: ["overview"] });
  });

  useCmsContentRealtime("pages", (payload) => {
    toast.info(payload.message);
    router.reload({ only: ["overview"] });
  });

  useCmsContentRealtime("units", (payload) => {
    toast.info(payload.message);
    router.reload({ only: ["overview"] });
  });

  useCmsContentRealtime("staff-profiles", (payload) => {
    toast.info(payload.message);
    router.reload({ only: ["overview"] });
  });

  return (
    <>
      <Head title="Dashboard" />
      <DashboardOverviewPanel overview={overview} />
    </>
  );
}

CmsDashboardPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
