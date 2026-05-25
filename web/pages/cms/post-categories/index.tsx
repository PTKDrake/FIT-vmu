import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import { CmsPagePlaceholder } from "@/components/cms/cms-page-placeholder";
import CmsLayout from "@/layouts/cms-layout";

export default function CmsPostCategoriesPage() {
  return (
    <>
      <Head title="Danh mục bài viết" />
      <CmsPagePlaceholder
        title="Danh mục bài viết"
        description="Trang này sẽ tái sử dụng shell CMS để quản lý cây danh mục, thứ tự hiển thị và các metadata liên quan tới nội dung."
      />
    </>
  );
}

CmsPostCategoriesPage.layout = (page: ReactNode) => (
  <CmsLayout>{page}</CmsLayout>
);
