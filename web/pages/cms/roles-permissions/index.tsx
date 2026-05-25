import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import { CmsPagePlaceholder } from "@/components/cms/cms-page-placeholder";
import CmsLayout from "@/layouts/cms-layout";

export default function CmsRolesPermissionsPage() {
  return (
    <>
      <Head title="Vai trò & quyền" />
      <CmsPagePlaceholder
        title="Vai trò & quyền"
        description="Trang vai trò và quyền sẽ dùng cùng shell CMS để cấu hình nhóm quyền, gán vai trò và theo dõi quyền truy cập."
      />
    </>
  );
}

CmsRolesPermissionsPage.layout = (page: ReactNode) => (
  <CmsLayout>{page}</CmsLayout>
);
