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
        description="Quản lý cây danh mục và thứ tự hiển thị cho bài viết."
      />
    </>
  );
}

CmsPostCategoriesPage.layout = (page: ReactNode) => (
  <CmsLayout>{page}</CmsLayout>
);
