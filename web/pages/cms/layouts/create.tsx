import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import { SiteLayoutForm } from "@/components/layout-builder/site-layout-form";
import CmsLayout from "@/layouts/cms-layout";

export default function CreateSiteLayoutPage() {
  return (
    <>
      <Head title="Tạo layout" />
      <SiteLayoutForm />
    </>
  );
}

CreateSiteLayoutPage.layout = (page: ReactNode) => (
  <CmsLayout>{page}</CmsLayout>
);
