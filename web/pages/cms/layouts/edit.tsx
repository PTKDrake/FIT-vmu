import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import { SiteLayoutForm } from "@/components/layout-builder/site-layout-form";
import CmsLayout from "@/layouts/cms-layout";
import type { SharedData } from "@/types/shared";

interface EditSiteLayoutPageProps extends SharedData {
  layout: {
    footerData: string | null;
    headerData: string | null;
    id: number;
    isDefault: boolean;
    key: string;
    leftData: string | null;
    name: string;
    rightData: string | null;
    status: "draft" | "published";
    updatedAt: string;
  };
}

export default function EditSiteLayoutPage({
  layout,
}: EditSiteLayoutPageProps) {
  return (
    <>
      <Head title={`Layout - ${layout.name}`} />
      <SiteLayoutForm layout={layout} />
    </>
  );
}

EditSiteLayoutPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
