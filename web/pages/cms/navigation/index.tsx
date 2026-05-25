import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import { CmsPagePlaceholder } from "@/components/cms/cms-page-placeholder";
import CmsLayout from "@/layouts/cms-layout";

export default function CmsNavigationPage() {
  return (
    <>
      <Head title="Navigation" />
      <CmsPagePlaceholder
        title="Navigation"
        description="Trang quản lý navigation sẽ chia sẻ cùng sidebar, topbar và footer menu của khu vực CMS."
      />
    </>
  );
}

CmsNavigationPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
