import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import { CmsPagePlaceholder } from "@/components/cms/cms-page-placeholder";
import CmsLayout from "@/layouts/cms-layout";

export default function CmsStaffProfilesPage() {
  return (
    <>
      <Head title="Hồ sơ cán bộ" />
      <CmsPagePlaceholder
        title="Hồ sơ cán bộ"
        description="Quản lý hồ sơ, trạng thái hiển thị và nội dung công khai."
      />
    </>
  );
}

CmsStaffProfilesPage.layout = (page: ReactNode) => (
  <CmsLayout>{page}</CmsLayout>
);
