import { Link } from "@inertiajs/react";
import { AppLogo } from "@/components/brand/app-logo";
import { cmsDashboardHref } from "@/components/cms/navigation";
import { SidebarHeader, SidebarLabel } from "@/components/ui/sidebar";

export function CmsSidebarHeader() {
  return (
    <SidebarHeader>
      <Link href={cmsDashboardHref} className="flex items-center gap-x-2">
        <AppLogo size="sm" showWordmark={false} />
        <SidebarLabel className="font-medium">
          VMUFit <span className="text-muted-fg">CMS</span>
        </SidebarLabel>
      </Link>
    </SidebarHeader>
  );
}
