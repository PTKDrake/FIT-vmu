import {
  siteLayoutFooterComponents,
  siteLayoutHeaderComponents,
  siteLayoutSideComponents,
} from "../blocks/site-layout-frame";
import { pageBuilderComponents } from "../component-registry";
import { createPuckCategories } from "../component-categories";
import type {
  PageBuilderComponentName,
  PageBuilderConfig,
} from "../blocks/types";

const slotRoot: PageBuilderConfig["root"] = {
  permissions: {
    insert: false,
  },
  render: ({ children }) => (
    <div className="@container/puck-slot flex h-full min-h-full min-w-0 flex-col font-sans">
      {children}
    </div>
  ),
};

const layoutBuilderComponentNames = [
  "SiteLayoutFrame",
  ...new Set([
    ...siteLayoutHeaderComponents,
    ...siteLayoutSideComponents,
    ...siteLayoutFooterComponents,
  ]),
] as PageBuilderComponentName[];

const components = Object.fromEntries(
  layoutBuilderComponentNames.map((componentName) => [
    componentName,
    pageBuilderComponents[componentName as PageBuilderComponentName],
  ]),
) as PageBuilderConfig["components"];

export const layoutBuilderConfig: PageBuilderConfig = {
  categories: createPuckCategories(layoutBuilderComponentNames),
  root: slotRoot,
  components,
};

export const headerConfig: PageBuilderConfig = {
  categories: createPuckCategories(siteLayoutHeaderComponents),
  root: slotRoot,
  components,
};

export const footerConfig: PageBuilderConfig = {
  categories: createPuckCategories(siteLayoutFooterComponents),
  root: slotRoot,
  components,
};

export const sideConfig: PageBuilderConfig = {
  categories: createPuckCategories(siteLayoutSideComponents),
  root: slotRoot,
  components,
};
