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
        description="Trang hồ sơ cán bộ sẽ tái sử dụng layout CMS để hiển thị danh sách, trạng thái công khai và thao tác cập nhật hồ sơ."
      />
    </>
  );
}

CmsStaffProfilesPage.layout = (page: ReactNode) => (
  <CmsLayout>{page}</CmsLayout>
);
