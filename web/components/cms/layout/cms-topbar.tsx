import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { usePage, Link } from "@inertiajs/react";
import {
  cmsDashboardHref,
  findCmsNavigationLeaf,
  findCmsNavigationMenuTitle,
} from "@/components/cms/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { SidebarNav, SidebarTrigger } from "@/components/ui/sidebar";

export function CmsTopbar({ currentUrl }: { currentUrl: string }) {
  const currentItem = findCmsNavigationLeaf(currentUrl);
  const currentNavigationMenuTitle = findCmsNavigationMenuTitle(currentUrl);

  const page = usePage<any>();
  const props = page.props;

  // Identify if the current URL is a subpage of the current item (resource)
  let subpageTitle = "";
  let parentHref = "";

  if (currentItem && currentUrl.split("?")[0] !== currentItem.href) {
    parentHref = currentItem.href;

    const normalizedUrl = currentUrl.split("?")[0];

    if (currentNavigationMenuTitle) {
      subpageTitle = currentNavigationMenuTitle;
    } else {
      // 1. Identify specific entity name from props if available
      const entityName =
        props.profile?.fullName || props.unit?.name || props.page?.title || "";

      // 2. Identify the action / subpage
      if (normalizedUrl.endsWith("/create")) {
        subpageTitle = entityName ? `Tạo mới: ${entityName}` : "Thêm mới";
      } else if (normalizedUrl.endsWith("/edit")) {
        subpageTitle = entityName ? `Chỉnh sửa: ${entityName}` : "Chỉnh sửa";
      } else {
        // Show/detail page or other subpage
        subpageTitle = entityName || "Chi tiết";
      }
    }
  }

  return (
    <SidebarNav isSticky>
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        {parentHref && (
          <>
            <Link
              href={parentHref}
              className="mr-1 inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg/50 px-2.5 py-1 text-xs font-medium text-muted-fg transition-all hover:bg-muted/50 hover:text-fg active:scale-95 shadow-sm"
              aria-label="Quay lại trang cha"
            >
              <ArrowLeftIcon className="size-3.5" />
              <span>Quay lại</span>
            </Link>
            <Separator orientation="vertical" className="mr-2 h-4" />
          </>
        )}

        <Breadcrumbs>
          <Breadcrumbs.Item href={cmsDashboardHref}>Dashboard</Breadcrumbs.Item>
          {currentItem && currentItem.href !== cmsDashboardHref ? (
            <Breadcrumbs.Item href={parentHref ? currentItem.href : undefined}>
              {currentItem.title}
            </Breadcrumbs.Item>
          ) : null}
          {subpageTitle ? (
            <Breadcrumbs.Item>{subpageTitle}</Breadcrumbs.Item>
          ) : null}
        </Breadcrumbs>
      </div>
    </SidebarNav>
  );
}
