import { ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  findCmsNavigationGroupTitle,
  cmsNavigationItems,
} from "@/components/cms/navigation";
import {
  CMS_SIDEBAR_EXPANDED_GROUPS_STORAGE_KEY,
  getCmsNavigationCompactLabel,
  parseCmsSidebarExpandedGroups,
  resolveCmsSidebarExpandedGroups,
  stringifyCmsSidebarExpandedGroups,
} from "@/components/cms/layout/cms-sidebar-navigation-state";
import { useState, type Key } from "react";
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
  const [storedExpandedGroups, setStoredExpandedGroups] = useState<string[]>(
    () => {
      if (typeof window === "undefined") {
        return [];
      }

      return parseCmsSidebarExpandedGroups(
        window.localStorage.getItem(CMS_SIDEBAR_EXPANDED_GROUPS_STORAGE_KEY),
      );
    },
  );
  const activeGroupTitle = findCmsNavigationGroupTitle(normalizedUrl);
  const expandedGroupKeys = resolveCmsSidebarExpandedGroups(
    activeGroupTitle,
    storedExpandedGroups,
  );

  const handleExpandedChange = (keys: Iterable<Key>) => {
    const nextExpandedGroups = Array.from(keys, (key) => String(key));

    if (activeGroupTitle && !nextExpandedGroups.includes(activeGroupTitle)) {
      nextExpandedGroups.push(activeGroupTitle);
    }

    setStoredExpandedGroups(nextExpandedGroups);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        CMS_SIDEBAR_EXPANDED_GROUPS_STORAGE_KEY,
        stringifyCmsSidebarExpandedGroups(nextExpandedGroups),
      );
    }
  };

  return (
    <SidebarContent>
      <SidebarSectionGroup>
        <SidebarDisclosureGroup
          expandedKeys={expandedGroupKeys}
          onExpandedChange={handleExpandedChange}
        >
          {cmsNavigationItems.map((group) => {
            const Icon = group.icon;

            if (group.href) {
              return (
                <SidebarSection key={group.title}>
                  <SidebarItem
                    href={group.href}
                    isCurrent={normalizedUrl === group.href}
                    tooltip={group.title}
                  >
                    <Icon />
                    <SidebarLabel>{group.title}</SidebarLabel>
                  </SidebarItem>
                </SidebarSection>
              );
            }

            return (
              <SidebarDisclosure key={group.title} id={group.title}>
                <SidebarDisclosureTrigger
                  aria-label={group.title}
                  className="in-data-[state=collapsed]:pointer-events-none in-data-[state=collapsed]:cursor-default"
                >
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
                      tooltip={item.title}
                    >
                      {({ isCollapsed }) => (
                        <>
                          {isCollapsed ? (
                            <span
                              aria-hidden
                              className="flex size-5 items-center justify-center rounded-md bg-sidebar-accent text-[10px]/none font-semibold text-sidebar-accent-fg sm:size-4"
                            >
                              {getCmsNavigationCompactLabel(item.title)}
                            </span>
                          ) : (
                            <ChevronRightIcon className="size-4" />
                          )}
                          <SidebarLabel>{item.title}</SidebarLabel>
                        </>
                      )}
                    </SidebarItem>
                  ))}
                </SidebarDisclosurePanel>
              </SidebarDisclosure>
            );
          })}
        </SidebarDisclosureGroup>
      </SidebarSectionGroup>
    </SidebarContent>
  );
}
