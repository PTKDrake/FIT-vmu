import { pageBuilderComponents } from "../component-registry";
import { createPuckCategories } from "../component-categories";
import type {
  PageBuilderComponentName,
  PageBuilderConfig,
} from "../blocks/types";

const pageBuilderCategoryComponents = Object.keys(pageBuilderComponents).filter(
  (componentName) => componentName !== "SiteLayoutFrame",
) as PageBuilderComponentName[];

export const pageConfig: PageBuilderConfig = {
  categories: createPuckCategories(pageBuilderCategoryComponents),
  root: {
    render: ({ children }) => (
      <article className="font-sans space-y-12 rounded-3xl bg-bg p-4 sm:p-8">
        {children}
      </article>
    ),
  },
  components: pageBuilderComponents,
};
