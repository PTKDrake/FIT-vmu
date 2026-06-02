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
    fields: {
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
    render: ({ footer: Footer, header: Header, left: Left, right: Right }) => (
      <div className="min-h-[42rem] overflow-hidden rounded-3xl border border-border bg-bg text-fg shadow-xs">
        <header className="border-b border-border bg-overlay/85 p-4">
          {Header ? <Header /> : <EmptySlot label="Header" />}
        </header>
        <div className="flex flex-col gap-4 bg-muted/20 p-4 lg:flex-row">
          <aside className="w-full lg:w-72">
            {Left ? <Left /> : <EmptySlot label="Left sidebar" />}
          </aside>
          <main className="min-h-64 min-w-0 flex-1 rounded-2xl border border-dashed border-border bg-bg/80 p-6 text-center text-sm text-muted-fg">
            <div className="flex h-full min-h-52 items-center justify-center rounded-xl bg-muted/30 px-4">
              Nội dung trang sẽ được render ở vùng main và không lưu trong
              SiteLayout.
            </div>
          </main>
          <aside className="w-full lg:w-72">
            {Right ? <Right /> : <EmptySlot label="Right sidebar" />}
          </aside>
        </div>
        <footer className="border-t border-border bg-overlay/85 p-4">
          {Footer ? <Footer /> : <EmptySlot label="Footer" />}
        </footer>
      </div>
    ),
  };

function EmptySlot({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-sm font-medium text-muted-fg">
      Kéo block vào vùng {label}
    </div>
  );
}
