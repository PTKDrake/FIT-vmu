import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import { NavigationTreeEditor } from "@/components/navigation/navigation-tree-editor";
import CmsLayout from "@/layouts/cms-layout";
import type {
  NavigationMenuDraft,
  NavigationResourceCatalog,
} from "@/lib/navigation/tree";

interface CmsNavigationPageProps {
  editorStateKey: string;
  menus: NavigationMenuDraft[];
  resourceCatalog: NavigationResourceCatalog;
}

export default function CmsNavigationPage({
  editorStateKey,
  menus,
  resourceCatalog,
}: CmsNavigationPageProps) {
  return (
    <>
      <Head title="Navigation" />
      <NavigationTreeEditor
        key={editorStateKey}
        initialMenus={menus}
        resourceCatalog={resourceCatalog}
      />
    </>
  );
}

CmsNavigationPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
