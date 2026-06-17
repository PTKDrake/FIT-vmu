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
    <SiteLayoutShellFrame
      footer={
        hasFooter ? (
          <LazyPuckPageRender
            configName="footer"
            content={layout?.footerData}
            mode="slot"
          />
        ) : null
      }
      header={
        hasHeader ? (
          <LazyPuckPageRender
            configName="header"
            content={layout?.headerData}
            mode="slot"
          />
        ) : null
      }
      left={
        hasLeft ? (
          <LazyPuckPageRender
            configName="side"
            content={layout?.leftData}
            mode="slot"
          />
        ) : null
      }
      right={
        hasRight ? (
          <LazyPuckPageRender
            configName="side"
            content={layout?.rightData}
            mode="slot"
          />
        ) : null
      }
    >
      {children}
    </SiteLayoutShellFrame>
  );
}

interface SiteLayoutShellFrameProps {
  children: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
}

export function SiteLayoutShellFrame({
  children,
  footer,
  header,
  left,
  right,
}: SiteLayoutShellFrameProps) {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      {header ? <header>{header}</header> : null}

      <div className="mx-auto flex w-full min-w-0 flex-col lg:flex-row lg:items-start">
        {left ? (
          <aside className="@container/layout-side w-full min-w-0 shrink-0 lg:w-72">
            {left}
          </aside>
        ) : null}

        <main className="@container/layout-main min-w-0 flex-1">{children}</main>

        {right ? (
          <aside className="@container/layout-side w-full min-w-0 shrink-0 lg:w-72">
            {right}
          </aside>
        ) : null}
      </div>

      {footer ? <footer>{footer}</footer> : null}
    </div>
  );
}

function hasSlotContent(value: VmuFitPageBuilderValue): boolean {
  return parsePuckLayoutData(value).content.length > 0;
}
