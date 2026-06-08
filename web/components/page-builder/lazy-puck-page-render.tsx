import { lazy, Suspense } from "react";
import type { PuckPageRenderConfigName } from "@/components/page-builder/puck-page-render";
import type { VmuFitPageBuilderValue } from "@/lib/puck/page-builder-data";

const LazyPuckPageRenderComponent = lazy(() =>
  import("@/components/page-builder/puck-page-render").then((module) => ({
    default: module.PuckPageRender,
  })),
);

interface LazyPuckPageRenderProps {
  className?: string;
  configName?: PuckPageRenderConfigName;
  content?: VmuFitPageBuilderValue;
  mode?: "page" | "slot";
}

export function LazyPuckPageRender(props: LazyPuckPageRenderProps) {
  return (
    <Suspense fallback={null}>
      <LazyPuckPageRenderComponent {...props} />
    </Suspense>
  );
}
