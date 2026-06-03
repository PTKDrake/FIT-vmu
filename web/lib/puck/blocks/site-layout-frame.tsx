import { twMerge } from "tailwind-merge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
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

const headerComponents = [
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

const footerComponents = [
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
  "TagList",
  "Card",
  "LatestPosts",
  "LatestAnnouncements",
  "Categories",
  "PageLinks",
  "UnitList",
];

const sideComponents = [
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
  defaultProps: {
    surfaceTone: "overlay",
    surfaceBorder: "default",
    surfaceRadius: "3xl",
    surfacePadding: "md",
    surfaceShadow: "sm",
  },
  fields: {
    ...puckSurfaceFields,
    header: {
      type: "slot",
      label: "Header",
      allow: headerComponents,
    },
    left: {
      type: "slot",
      label: "Left sidebar",
      allow: sideComponents,
    },
    right: {
      type: "slot",
      label: "Right sidebar",
      allow: sideComponents,
    },
    footer: {
      type: "slot",
      label: "Footer",
      allow: footerComponents,
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
    const frameClassName = twMerge(
      "min-h-[42rem]",
      getSurfaceToneClass(surfaceTone),
      getSurfaceBorderClass(surfaceBorder),
      getSurfaceRadiusClass(surfaceRadius),
      getSurfaceShadowClass(surfaceShadow),
    );

    const frameInsetClassName = getSurfacePaddingClass(surfacePadding);

    return (
      <div id={domId} className={frameClassName}>
        <div className={frameInsetClassName}>
          <div className="overflow-hidden rounded-[inherit] border border-border/50 bg-bg/30">
            <header className="bg-overlay/70 backdrop-blur-sm">
              <Container className="py-4">
                {Header ? <Header /> : <EmptySlot label="Header" />}
              </Container>
            </header>

            <div className="grid gap-4 bg-muted/20 p-4 lg:grid-cols-[18rem_minmax(0,1fr)_18rem]">
              <aside className="w-full">
                <Card className="h-full rounded-none border-border/70 bg-overlay/80 shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base/6">
                      Thanh bên trái
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Left ? <Left /> : <EmptySlot label="Left sidebar" />}
                  </CardContent>
                </Card>
              </aside>

              <main className="min-w-0">
                <Card className="h-full rounded-none border-border/70 bg-overlay/90 shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base/6">
                      Vùng nội dung trang
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Text className="text-sm text-muted-fg">
                      Nội dung trang sẽ được render ở vùng main và không lưu
                      trong SiteLayout.
                    </Text>
                    <Separator />
                    <div className="border border-dashed border-border/50 bg-muted/20 px-4 py-8">
                      <Text className="text-center text-sm text-muted-fg">
                        Khu vực này được dành cho page builder của từng trang.
                      </Text>
                    </div>
                  </CardContent>
                </Card>
              </main>

              <aside className="w-full">
                <Card className="h-full rounded-none border-border/70 bg-overlay/80 shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base/6">
                      Thanh bên phải
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Right ? <Right /> : <EmptySlot label="Right sidebar" />}
                  </CardContent>
                </Card>
              </aside>
            </div>

            <footer className="border-t border-border/70 bg-overlay/70 backdrop-blur-sm">
              <Container className="py-4">
                {Footer ? <Footer /> : <EmptySlot label="Footer" />}
              </Container>
            </footer>
          </div>
        </div>
      </div>
    );
  },
};

function EmptySlot({ label }: { label: string }) {
  return (
    <div
      className={twMerge(
        "border border-dashed border-border/50 bg-muted/20 px-4 py-6 text-center",
      )}
    >
      <Text className="text-sm font-medium text-muted-fg">
        Kéo block vào vùng {label}
      </Text>
    </div>
  );
}
