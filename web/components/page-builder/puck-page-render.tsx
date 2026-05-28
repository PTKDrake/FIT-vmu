import { Render } from "@puckeditor/core";
import { twMerge } from "tailwind-merge";
import { vmuFitPageBuilderConfig } from "@/lib/puck/page-builder-config";
import {
  parsePuckPageData
  
} from "@/lib/puck/page-builder-data";
import type {VmuFitPageBuilderValue} from "@/lib/puck/page-builder-data";

interface PuckPageRenderProps {
  className?: string;
  content?: VmuFitPageBuilderValue;
}

export function PuckPageRender({
  className,
  content,
}: PuckPageRenderProps) {
  return (
    <div
      className={twMerge(
        "vmu-puck-page-render rounded-3xl border border-border bg-overlay p-4 shadow-xs sm:p-6",
        className,
      )}
    >
      <Render config={vmuFitPageBuilderConfig} data={parsePuckPageData(content)} />
    </div>
  );
}
