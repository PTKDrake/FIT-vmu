import { usePage } from "@inertiajs/react";
import type { PropsWithChildren } from "react";
import { CmsSidebar } from "@/components/cms/layout/cms-sidebar";
import { CmsTopbar } from "@/components/cms/layout/cms-topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { SharedData } from "@/types/shared";
import { UnsavedChangesProvider } from "@/hooks/use-unsaved-changes";

export default function CmsLayout({ children }: PropsWithChildren) {
  const page = usePage<SharedData>();

  return (
    <UnsavedChangesProvider>
      <SidebarProvider>
        <CmsSidebar currentUrl={page.url} user={page.props.auth.user} />
        <SidebarInset>
          <CmsTopbar currentUrl={page.url} />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </UnsavedChangesProvider>
  );
}

