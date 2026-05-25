import {
  cmsDashboardHref,
  findCmsNavigationLeaf,
} from "@/components/cms/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { SidebarNav, SidebarTrigger } from "@/components/ui/sidebar";

export function CmsTopbar({ currentUrl }: { currentUrl: string }) {
  const currentItem = findCmsNavigationLeaf(currentUrl);

  return (
    <SidebarNav isSticky>
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumbs>
          <Breadcrumbs.Item href={cmsDashboardHref}>Dashboard</Breadcrumbs.Item>
          <Breadcrumbs.Item>
            {currentItem?.title ?? "Dashboard"}
          </Breadcrumbs.Item>
        </Breadcrumbs>
      </div>
    </SidebarNav>
  );
}
