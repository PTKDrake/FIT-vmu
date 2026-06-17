import { Render } from "@puckeditor/core";
import { twMerge } from "tailwind-merge";
import type { PageBuilderConfig } from "@/lib/puck/blocks/types";
import {
  footerConfig,
  headerConfig,
  sideConfig,
  vmuFitPageBuilderConfig,
} from "@/lib/puck/page-builder-config";
import {
  applyPuckDefaultProps,
  parsePuckLayoutData,
  parsePuckPageData,
} from "@/lib/puck/page-builder-data";
import type { VmuFitPageBuilderValue } from "@/lib/puck/page-builder-data";

interface PuckPageRenderProps {
  className?: string;
  config?: PageBuilderConfig;
  configName?: PuckPageRenderConfigName;
  content?: VmuFitPageBuilderValue;
  mode?: "page" | "slot";
}

export type PuckPageRenderConfigName = "page" | "header" | "footer" | "side";

export function PuckPageRender({
  className,
  config,
  configName = "page",
  content,
  mode = "page",
}: PuckPageRenderProps) {
  const resolvedConfig = config ?? getPuckPageRenderConfig(configName);
  const parsedData =
    mode === "slot" ? parsePuckLayoutData(content) : parsePuckPageData(content);
  const data = applyPuckDefaultProps(parsedData, resolvedConfig);

  return (
    <div
      className={twMerge(
        "vmu-puck-page-render @container/puck w-full min-w-0",
        className,
      )}
    >
      <Render config={resolvedConfig} data={data} />
    </div>
  );
}

function getPuckPageRenderConfig(
  configName: PuckPageRenderConfigName,
): PageBuilderConfig {
  if (configName === "header") {
    return headerConfig;
  }

  if (configName === "footer") {
    return footerConfig;
  }

  if (configName === "side") {
    return sideConfig;
  }

  return vmuFitPageBuilderConfig;
}
