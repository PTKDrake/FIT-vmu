import { Render } from "@puckeditor/core";
import { twMerge } from "tailwind-merge";
import { vmuFitPageBuilderConfig } from "@/lib/puck/page-builder-config";
import {
  parsePuckLayoutData,
  parsePuckPageData,
} from "@/lib/puck/page-builder-data";
import type { VmuFitPageBuilderValue } from "@/lib/puck/page-builder-data";
import type { PageBuilderConfig } from "@/lib/puck/blocks/types";

interface PuckPageRenderProps {
  className?: string;
  config?: PageBuilderConfig;
  content?: VmuFitPageBuilderValue;
  mode?: "page" | "slot";
}

export function PuckPageRender({
  className,
  config = vmuFitPageBuilderConfig,
  content,
  mode = "page",
}: PuckPageRenderProps) {
  const data =
    mode === "slot" ? parsePuckLayoutData(content) : parsePuckPageData(content);

  return (
    <div
      className={twMerge(
        "vmu-puck-page-render rounded-3xl border border-border bg-overlay p-4 shadow-xs sm:p-6",
        className,
      )}
    >
      <Render config={config} data={data} />
    </div>
  );
}
