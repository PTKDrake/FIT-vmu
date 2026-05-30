import type { Config } from "@puckeditor/core";
import type {
  PageBuilderRootProps,
  VmuFitPageBuilderComponents,
} from "../page-builder-data";

export type PageBuilderCategory =
  | "layout_blocks"
  | "content_blocks"
  | "section_blocks"
  | "dynamic_blocks";

export type PageBuilderConfig = Config<
  VmuFitPageBuilderComponents,
  PageBuilderRootProps,
  PageBuilderCategory
>;

export type PageBuilderComponentName = keyof VmuFitPageBuilderComponents;

export type PageBuilderComponentConfig<
  TComponentName extends PageBuilderComponentName,
> = PageBuilderConfig["components"][TComponentName];
