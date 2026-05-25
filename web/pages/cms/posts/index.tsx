import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import { CmsPagePlaceholder } from "@/components/cms/cms-page-placeholder";
import CmsLayout from "@/layouts/cms-layout";

export default function CmsPostsPage() {
  return (
    <>
      <Head title="Bài viết" />
      <CmsPagePlaceholder
        title="Bài viết"
        description="Trang quản lý bài viết sẽ dùng lại layout CMS, sidebar và header hiện tại để triển khai danh sách, bộ lọc và trình biên tập."
      />
    </>
  );
}

CmsPostsPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
