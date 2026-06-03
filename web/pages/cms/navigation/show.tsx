import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import type { CmsNavigationShowPageProps } from "@/components/cms/types";
import { NavigationTreeEditor } from "@/components/navigation/navigation-tree-editor";
import CmsLayout from "@/layouts/cms-layout";

export default function CmsNavigationShowPage({
  navigationMenuId,
  navigationMenuName,
  navigationMenus,
  navigationStateVersion,
  resourceCatalog,
}: CmsNavigationShowPageProps) {
  return (
    <>
      <Head title={`Điều hướng · ${navigationMenuName}`} />
      <NavigationTreeEditor
        key={navigationStateVersion}
        initialMenuId={navigationMenuId}
        initialMenus={navigationMenus}
        resourceCatalog={resourceCatalog}
      />
    </>
  );
}

CmsNavigationShowPage.layout = (page: ReactNode) => (
  <CmsLayout>{page}</CmsLayout>
);
