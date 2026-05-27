import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import { CmsPagePlaceholder } from "@/components/cms/cms-page-placeholder";
import CmsLayout from "@/layouts/cms-layout";

export default function CmsUnitsPage() {
  return (
    <>
      <Head title="Đơn vị" />
      <CmsPagePlaceholder
        title="Đơn vị"
        description="Quản lý cấu trúc tổ chức, cây đơn vị và thông tin hiển thị."
      />
    </>
  );
}

CmsUnitsPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
