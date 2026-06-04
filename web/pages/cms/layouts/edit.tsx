import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import { SiteLayoutBuilderEditor } from "@/components/layout-builder/site-layout-builder-editor";
import CmsLayout from "@/layouts/cms-layout";
import type { SharedData } from "@/types/shared";

interface EditSiteLayoutPageProps extends SharedData {
  layout: {
    footerData: string | null;
    headerData: string | null;
    id: number;
    key: string;
    leftData: string | null;
    name: string;
    rightData: string | null;
    updatedAt: string;
  };
}

export default function EditSiteLayoutPage({
  layout,
}: EditSiteLayoutPageProps) {
  return (
    <>
      <Head title={`Chỉnh sửa thành phần - ${layout.name}`} />
      <SiteLayoutBuilderEditor layout={layout} />
    </>
  );
}

EditSiteLayoutPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
