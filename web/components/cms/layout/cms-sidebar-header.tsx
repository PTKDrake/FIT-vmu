import { Link } from "@inertiajs/react";
import { cmsDashboardHref } from "@/components/cms/navigation";
import { Avatar } from "@/components/ui/avatar";
import { SidebarHeader, SidebarLabel } from "@/components/ui/sidebar";

export function CmsSidebarHeader() {
  return (
    <SidebarHeader>
      <Link href={cmsDashboardHref} className="flex items-center gap-x-2">
        <Avatar
          isSquare
          size="sm"
          className="outline-hidden"
          src="https://design.intentui.com/logo"
        />
        <SidebarLabel className="font-medium">
          VMUFit <span className="text-muted-fg">CMS</span>
        </SidebarLabel>
      </Link>
    </SidebarHeader>
  );
}
