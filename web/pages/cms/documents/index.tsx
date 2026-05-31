import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import { CmsPagePlaceholder } from "@/components/cms/cms-page-placeholder";
import CmsLayout from "@/layouts/cms-layout";

export default function CmsDocumentsPage() {
  return (
    <>
      <Head title="Tài liệu" />
      <CmsPagePlaceholder
        title="Tài liệu"
        description="Quản lý tài liệu, bộ lọc và quyền truy cập tải xuống."
      />
    </>
  );
}

CmsDocumentsPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
