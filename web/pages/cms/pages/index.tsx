import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import { CmsPagePlaceholder } from "@/components/cms/cms-page-placeholder";
import CmsLayout from "@/layouts/cms-layout";

export default function CmsContentPagesPage() {
  return (
    <>
      <Head title="Trang" />
      <CmsPagePlaceholder
        title="Trang"
        description="Khu vực quản lý trang tĩnh sẽ dùng chung layout CMS để đảm bảo trải nghiệm nhất quán với phần Bài viết và Tài liệu."
      />
    </>
  );
}

CmsContentPagesPage.layout = (page: ReactNode) => (
  <CmsLayout>{page}</CmsLayout>
);
