import { Render } from "@puckeditor/core";
import { cloneElement, isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { PageBuilderConfig } from "@/lib/puck/blocks/types";
import { vmuFitPageBuilderConfig } from "@/lib/puck/page-builder-config";
import {
  parsePuckLayoutData,
  parsePuckPageData,
} from "@/lib/puck/page-builder-data";
import type { VmuFitPageBuilderValue } from "@/lib/puck/page-builder-data";

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
  const publicConfig = createPublicRenderConfig(config);

  return (
    <div
      className={twMerge(
        "vmu-puck-page-render",
        className,
      )}
    >
      <Render config={publicConfig} data={data} />
    </div>
  );
}

function createPublicRenderConfig(
  config: PageBuilderConfig,
): PageBuilderConfig {
  return {
    ...config,
    components: Object.fromEntries(
      Object.entries(config.components).map(
        ([componentName, componentConfig]) => [
          componentName,
          {
            ...componentConfig,
            render: (props: Record<string, unknown>) =>
              mergePublicBlockClassName(
                componentConfig.render(props as never),
                (props as { className?: string }).className,
              ),
          },
        ],
      ),
    ) as unknown as PageBuilderConfig["components"],
  };
}

function mergePublicBlockClassName(node: ReactNode, blockClassName?: string) {
  if (!blockClassName?.trim() || !isValidElement(node)) {
    return node;
  }

  const existingClassName =
    typeof (node.props as { className?: unknown }).className === "string"
      ? (node.props as { className?: string }).className
      : undefined;

  return cloneElement(node as ReactElement<{ className?: string }>, {
    className: twMerge(existingClassName, blockClassName),
  });
}
