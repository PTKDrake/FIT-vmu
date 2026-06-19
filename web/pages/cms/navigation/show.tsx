import { Head, router } from "@inertiajs/react";
import type { ReactNode } from "react";
import type { CmsNavigationShowPageProps } from "@/components/cms/types";
import { useCmsContentRealtime } from "@/hooks/use-cms-content-realtime";
import { NavigationTreeEditor } from "@/components/navigation/navigation-tree-editor";
import CmsLayout from "@/layouts/cms-layout";

export default function CmsNavigationShowPage({
  navigationMenuId,
  navigationMenuName,
  navigationMenus,
  navigationStateVersion,
  resourceCatalog,
}: CmsNavigationShowPageProps) {
  useCmsContentRealtime("navigation", () => {
    router.reload({
      only: ["navigationMenus", "navigationStateVersion", "resourceCatalog"],
    });
  });

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
