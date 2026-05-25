import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import { CmsPagePlaceholder } from "@/components/cms/cms-page-placeholder";
import CmsLayout from "@/layouts/cms-layout";

export default function CmsUsersPage() {
  return (
    <>
      <Head title="Người dùng" />
      <CmsPagePlaceholder
        title="Người dùng"
        description="Trang người dùng sẽ tái sử dụng layout CMS để quản lý danh sách tài khoản, vai trò và trạng thái truy cập."
      />
    </>
  );
}

CmsUsersPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
