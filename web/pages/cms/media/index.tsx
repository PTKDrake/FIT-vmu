import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import { CmsPagePlaceholder } from "@/components/cms/cms-page-placeholder";
import CmsLayout from "@/layouts/cms-layout";

export default function CmsMediaPage() {
  return (
    <>
      <Head title="Media" />
      <CmsPagePlaceholder
        title="Media"
        description="Thư viện media sẽ tái sử dụng shell CMS hiện tại để hiển thị grid tài nguyên, tìm kiếm và thao tác tải lên."
      />
    </>
  );
}

CmsMediaPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
