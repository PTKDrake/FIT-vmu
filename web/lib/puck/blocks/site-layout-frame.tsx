import { twMerge } from "tailwind-merge";
import { Text } from "@/components/ui/text";
import { SiteLayoutShellFrame } from "@/components/site-layout/site-layout-shell";
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
  "w-full h-full rounded-2xl border border-dashed border-border/40 bg-muted/10 p-4";

const siteLayoutEmptySlotClassName =
  "empty:flex empty:min-h-24 empty:w-full";

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
  "StaffProfileCard",
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
  "StaffProfileCard",
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
    className: "",
  },
  fields: {
    ...puckSurfaceFields,
    className: {
      type: "text",
      label: "Lớp CSS bổ sung",
    },
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
    className,
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
      className,
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
            <SiteLayoutShellFrame
              footer={<Footer className={slotClassName} minEmptyHeight={120} />}
              header={<Header className={slotClassName} minEmptyHeight={120} />}
              left={<Left className={slotClassName} minEmptyHeight={200} />}
              right={<Right className={slotClassName} minEmptyHeight={200} />}
            >
              <div className="flex min-h-full flex-1">
                <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-border/40 bg-muted/10 px-4 py-8">
                  <Text className="text-center text-sm text-muted-fg">
                    Nội dung trang sẽ được render ở vùng main và không lưu
                    trong SiteLayout.
                  </Text>
                </div>
              </div>
            </SiteLayoutShellFrame>
          </div>
        </div>
      </div>
    );
  },
};
