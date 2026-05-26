import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import { NavigationTreeEditor } from "@/components/navigation/navigation-tree-editor";
import CmsLayout from "@/layouts/cms-layout";

export default function CmsNavigationPage() {
  return (
    <>
      <Head title="Navigation" />
      <NavigationTreeEditor />
    </>
  );
}

CmsNavigationPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
