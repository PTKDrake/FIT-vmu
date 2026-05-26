import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import { NavigationTreeEditor } from "@/components/navigation/navigation-tree-editor";
import CmsLayout from "@/layouts/cms-layout";

interface CmsNavigationShowPageProps {
  navigationMenuId: number;
}

export default function CmsNavigationShowPage({
  navigationMenuId,
}: CmsNavigationShowPageProps) {
  return (
    <>
      <Head title="Chỉnh sửa navigation" />
      <NavigationTreeEditor initialMenuId={navigationMenuId} />
    </>
  );
}

CmsNavigationShowPage.layout = (page: ReactNode) => (
  <CmsLayout>{page}</CmsLayout>
);
