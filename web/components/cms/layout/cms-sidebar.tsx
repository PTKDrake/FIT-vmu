import { CmsSidebarFooter } from "@/components/cms/layout/cms-sidebar-footer";
import { CmsSidebarHeader } from "@/components/cms/layout/cms-sidebar-header";
import { CmsSidebarNavigation } from "@/components/cms/layout/cms-sidebar-navigation";
import { Sidebar } from "@/components/ui/sidebar";
import type { SharedData } from "@/types/shared";

export function CmsSidebar({
  currentUrl,
  user,
}: {
  currentUrl: string;
  user: SharedData["auth"]["user"];
}) {
  return (
    <Sidebar collapsible="dock" intent="inset">
      <CmsSidebarHeader />
      <CmsSidebarNavigation currentUrl={currentUrl} />
      <CmsSidebarFooter user={user} />
    </Sidebar>
  );
}
