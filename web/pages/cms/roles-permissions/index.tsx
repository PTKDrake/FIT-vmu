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
        description="Quản lý vai trò, nhóm quyền và quyền truy cập trong CMS."
      />
    </>
  );
}

CmsRolesPermissionsPage.layout = (page: ReactNode) => (
  <CmsLayout>{page}</CmsLayout>
);
