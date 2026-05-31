import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { cmsNavigationItems } from "@/components/cms/navigation";
import {
  SidebarContent,
  SidebarDisclosure,
  SidebarDisclosureGroup,
  SidebarDisclosurePanel,
  SidebarDisclosureTrigger,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSectionGroup,
} from "@/components/ui/sidebar";

export function CmsSidebarNavigation({ currentUrl }: { currentUrl: string }) {
  const normalizedUrl = currentUrl.split("?")[0];

  return (
    <SidebarContent>
      <SidebarSectionGroup>
        {cmsNavigationItems.map((group) => {
          const Icon = group.icon;

          if (group.href) {
            return (
              <SidebarSection key={group.title}>
                <SidebarItem
                  href={group.href}
                  isCurrent={normalizedUrl === group.href}
                >
                  <Icon />
                  <SidebarLabel>{group.title}</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
            );
          }

          const isExpanded =
            group.items?.some(
              (item) =>
                item.href === normalizedUrl ||
                normalizedUrl.startsWith(`${item.href}/`),
            ) ?? false;

          return (
            <SidebarDisclosureGroup key={group.title}>
              <SidebarDisclosure defaultExpanded={isExpanded} id={group.title}>
                <SidebarDisclosureTrigger>
                  <Icon />
                  <SidebarLabel>{group.title}</SidebarLabel>
                </SidebarDisclosureTrigger>
                <SidebarDisclosurePanel>
                  {group.items?.map((item) => (
                    <SidebarItem
                      key={item.href}
                      href={item.href}
                      isCurrent={
                        normalizedUrl === item.href ||
                        normalizedUrl.startsWith(`${item.href}/`)
                      }
                    >
                      <ChevronRightIcon className="size-4" />
                      <SidebarLabel>{item.title}</SidebarLabel>
                    </SidebarItem>
                  ))}
                </SidebarDisclosurePanel>
              </SidebarDisclosure>
            </SidebarDisclosureGroup>
          );
        })}
      </SidebarSectionGroup>
    </SidebarContent>
  );
}
