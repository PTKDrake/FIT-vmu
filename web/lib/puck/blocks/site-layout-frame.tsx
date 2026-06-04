import { twMerge } from "tailwind-merge";
import { Text } from "@/components/ui/text";
import { getPuckBlockDomId } from "./shared";
import {
  getSurfaceBorderClass,
  getSurfacePaddingClass,
  getSurfaceRadiusClass,
  getSurfaceShadowClass,
  getSurfaceToneClass,
  puckSurfaceFields,
} from "./surface";
import type { PageBuilderComponentConfig } from "./types";

const siteLayoutSlotClassName =
  "w-full";

const siteLayoutEmptySlotClassName =
  "empty:flex empty:min-h-24 empty:w-full empty:flex-col empty:gap-4 empty:rounded-2xl empty:border empty:border-dashed empty:border-border/40 empty:bg-muted/10 empty:p-4";

export const siteLayoutHeaderComponents = [
  "Container",
  "Grid",
  "Flex",
  "Spacer",
  "Divider",
  "Heading",
  "Image",
  "Button",
  "NavigationMenu",
  "AuthStatus",
  "TagList",
  "UnitList",
  "PageLinks",
];

export const siteLayoutFooterComponents = [
  "Section",
  "Container",
  "Grid",
  "Flex",
  "Divider",
  "Heading",
  "RichText",
  "Button",
  "NavigationMenu",
  "AuthStatus",
  "LinkList",
  "ContactInfo",
  "SocialLinks",
  "NewsletterForm",
  "CopyrightBar",
  "TagList",
  "Card",
  "LatestPosts",
  "LatestAnnouncements",
  "Categories",
  "PageLinks",
  "UnitList",
];

export const siteLayoutSideComponents = [
  "Container",
  "Flex",
  "Spacer",
  "Divider",
  "Heading",
  "RichText",
  "Button",
  "NavigationMenu",
  "AuthStatus",
  "LinkList",
  "Card",
  "TagList",
  "LatestPosts",
  "LatestAnnouncements",
  "Categories",
  "StaffGrid",
  "PageLinks",
  "UnitList",
];

export const SiteLayoutFrameComponentConfig: PageBuilderComponentConfig<"SiteLayoutFrame"> =
{
  label: "Khung site layout",
  permissions: {
    delete: false,
    drag: false,
    duplicate: false,
    insert: false,
  },
  defaultProps: {
    surfaceTone: "overlay",
    surfaceBorder: "none",
    surfaceRadius: "none",
    surfacePadding: "md",
    surfaceShadow: "none",
  },
  fields: {
    ...puckSurfaceFields,
    header: {
      type: "slot",
      label: "Header",
      allow: siteLayoutHeaderComponents,
    },
    left: {
      type: "slot",
      label: "Left sidebar",
      allow: siteLayoutSideComponents,
    },
    right: {
      type: "slot",
      label: "Right sidebar",
      allow: siteLayoutSideComponents,
    },
    footer: {
      type: "slot",
      label: "Footer",
      allow: siteLayoutFooterComponents,
    },
  },
  render: ({
    footer: Footer,
    header: Header,
    id,
    left: Left,
    right: Right,
    surfaceTone,
    surfaceBorder,
    surfaceRadius,
    surfacePadding,
    surfaceShadow,
  }) => {
    const domId = getPuckBlockDomId(id);
    const slotClassName = twMerge(
      siteLayoutSlotClassName,
      siteLayoutEmptySlotClassName,
    );
    const frameClassName = twMerge(
      "flex min-h-full h-full flex-col",
      getSurfaceToneClass(surfaceTone),
      getSurfaceBorderClass(surfaceBorder),
      getSurfaceRadiusClass(surfaceRadius),
      getSurfaceShadowClass(surfaceShadow),
    );

    const frameInsetClassName = getSurfacePaddingClass(surfacePadding);

    return (
      <div id={domId} className={frameClassName}>
        <div
          className={twMerge(
            frameInsetClassName,
            "flex min-h-full h-full flex-1 flex-col",
          )}
        >
          <div className="min-h-dvh overflow-hidden rounded-[inherit] border border-border/50 bg-bg text-fg">
            <header className="w-full border-b border-border/60">
              <Header className={slotClassName} minEmptyHeight={120} />
            </header>

            <div className="mx-auto flex w-full flex-col lg:flex-row lg:items-start">
              <aside className="w-full shrink-0 border-b border-border/60 lg:w-72 lg:border-r lg:border-b-0">
                <Left className={slotClassName} minEmptyHeight={120} />
              </aside>

              <main className="min-w-0 flex-1 border-b border-border/60 lg:border-r lg:border-b-0">
                <div className="flex min-h-0 flex-1 p-4 lg:min-h-[22rem] lg:p-6">
                  <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-border/40 bg-muted/10 px-4 py-8">
                    <Text className="text-center text-sm text-muted-fg">
                      Nội dung trang sẽ được render ở vùng main và không lưu
                      trong SiteLayout.
                    </Text>
                  </div>
                </div>
              </main>

              <aside className="w-full shrink-0 lg:w-72">
                <Right className={slotClassName} minEmptyHeight={120} />
              </aside>
            </div>

            <footer className="border-t border-border/60">
              <Footer className={slotClassName} minEmptyHeight={120} />
            </footer>
          </div>
        </div>
      </div>
    );
  },
};
