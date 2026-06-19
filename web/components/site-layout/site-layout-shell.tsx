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
  isPuckPage?: boolean;
}

export function SiteLayoutShell({
  children,
  layout,
  isPuckPage = false,
}: SiteLayoutShellProps) {
  const hasHeader = hasSlotContent(layout?.headerData);
  const hasFooter = hasSlotContent(layout?.footerData);
  const hasLeft = hasSlotContent(layout?.leftData);
  const hasRight = hasSlotContent(layout?.rightData);

  return (
    <SiteLayoutShellFrame
      isPuckPage={isPuckPage}
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
  isPuckPage?: boolean;
}

export function SiteLayoutShellFrame({
  children,
  footer,
  header,
  left,
  right,
  isPuckPage = false,
}: SiteLayoutShellFrameProps) {
  const bodyClassName = getSiteLayoutBodyClassName(
    Boolean(left),
    Boolean(right),
    isPuckPage,
  );

  return (
    <div className="min-h-dvh bg-bg text-fg">
      {header ? (
        <header className="relative z-[200] overflow-visible">{header}</header>
      ) : null}

      <div className={bodyClassName}>
        {left ? (
          <aside className="@container/layout-side w-full min-w-0 lg:w-72">
            {left}
          </aside>
        ) : null}

        <main className="@container/layout-main min-w-0">{children}</main>

        {right ? (
          <aside className="@container/layout-side w-full min-w-0 lg:w-72">
            {right}
          </aside>
        ) : null}
      </div>

      {footer ? <footer>{footer}</footer> : null}
    </div>
  );
}

function getSiteLayoutBodyClassName(
  hasLeft: boolean,
  hasRight: boolean,
  isPuckPage: boolean = false,
): string {
  const maxWidth = isPuckPage ? "" : " max-w-7xl";

  if (hasLeft && hasRight) {
    return `mx-auto grid w-full${maxWidth} min-w-0 grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)_18rem] lg:items-start lg:gap-8`;
  }

  if (hasLeft) {
    return `mx-auto grid w-full${maxWidth} min-w-0 grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start lg:gap-8`;
  }

  if (hasRight) {
    return `mx-auto grid w-full${maxWidth} min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-8`;
  }

  return `mx-auto grid w-full${maxWidth} min-w-0 grid-cols-1 py-5`;
}

function hasSlotContent(value: VmuFitPageBuilderValue): boolean {
  return parsePuckLayoutData(value).content.length > 0;
}
