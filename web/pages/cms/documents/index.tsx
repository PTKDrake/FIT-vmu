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
        description="Danh sách tài liệu sẽ kế thừa layout CMS để gắn bộ lọc, phân quyền tải xuống và các workflow duyệt tài liệu."
      />
    </>
  );
}

CmsDocumentsPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
