import { PuckPageRender } from "@/components/page-builder/puck-page-render";
import {
  footerConfig,
  headerConfig,
  sideConfig,
} from "@/lib/puck/page-builder-config";
import { parsePuckLayoutData } from "@/lib/puck/page-builder-data";
import type { VmuFitPageBuilderValue } from "@/lib/puck/page-builder-data";
import type { ReactNode } from "react";

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
        <header className="border-b border-border bg-overlay/80">
          <PuckPageRender
            className="mx-auto max-w-7xl rounded-none border-0 bg-transparent p-4 shadow-none sm:p-5"
            config={headerConfig}
            content={layout?.headerData}
            mode="slot"
          />
        </header>
      ) : null}

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:items-start sm:px-6">
        {hasLeft ? (
          <aside className="w-full shrink-0 lg:w-72">
            <PuckPageRender
              className="rounded-2xl border-border bg-overlay p-4 shadow-xs"
              config={sideConfig}
              content={layout?.leftData}
              mode="slot"
            />
          </aside>
        ) : null}

        <main className="min-w-0 flex-1">{children}</main>

        {hasRight ? (
          <aside className="w-full shrink-0 lg:w-72">
            <PuckPageRender
              className="rounded-2xl border-border bg-overlay p-4 shadow-xs"
              config={sideConfig}
              content={layout?.rightData}
              mode="slot"
            />
          </aside>
        ) : null}
      </div>

      {hasFooter ? (
        <footer className="border-t border-border bg-overlay/80">
          <PuckPageRender
            className="mx-auto max-w-7xl rounded-none border-0 bg-transparent p-4 shadow-none sm:p-5"
            config={footerConfig}
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
