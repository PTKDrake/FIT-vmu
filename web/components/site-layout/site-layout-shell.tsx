import type { ReactNode } from "react";
import { LazyPuckPageRender } from "@/components/page-builder/lazy-puck-page-render";
import { parsePuckLayoutData } from "@/lib/puck/page-builder-data";
import type { VmuFitPageBuilderValue } from "@/lib/puck/page-builder-data";

export interface SiteLayoutShellData {
  footerData?: VmuFitPageBuilderValue;
  headerData?: VmuFitPageBuilderValue;
  leftData?: VmuFitPageBuilderValue;
  rightData?: VmuFitPageBuilderValue;
}

interface SiteLayoutShellProps {
  children: ReactNode;
  layout?: SiteLayoutShellData | null;
}

export function SiteLayoutShell({ children, layout }: SiteLayoutShellProps) {
  const hasHeader = hasSlotContent(layout?.headerData);
  const hasFooter = hasSlotContent(layout?.footerData);
  const hasLeft = hasSlotContent(layout?.leftData);
  const hasRight = hasSlotContent(layout?.rightData);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      {hasHeader ? (
        <header>
          <LazyPuckPageRender
            configName="header"
            content={layout?.headerData}
            mode="slot"
          />
        </header>
      ) : null}

      <div className="mx-auto flex w-full flex-col lg:flex-row lg:items-start">
        {hasLeft ? (
          <aside className="w-full shrink-0 lg:w-72">
            <LazyPuckPageRender
              configName="side"
              content={layout?.leftData}
              mode="slot"
            />
          </aside>
        ) : null}

        <main className="min-w-0 flex-1">{children}</main>

        {hasRight ? (
          <aside className="w-full shrink-0 lg:w-72">
            <LazyPuckPageRender
              configName="side"
              content={layout?.rightData}
              mode="slot"
            />
          </aside>
        ) : null}
      </div>

      {hasFooter ? (
        <footer>
          <LazyPuckPageRender
            configName="footer"
            content={layout?.footerData}
            mode="slot"
          />
        </footer>
      ) : null}
    </div>
  );
}

function hasSlotContent(value: VmuFitPageBuilderValue): boolean {
  return parsePuckLayoutData(value).content.length > 0;
}
