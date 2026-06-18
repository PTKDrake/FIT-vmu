import {
  siteLayoutFooterComponents,
  siteLayoutHeaderComponents,
  siteLayoutSideComponents,
} from "../blocks/site-layout-frame";
import type {
  PageBuilderComponentName,
  PageBuilderConfig,
} from "../blocks/types";
import { pageConfig } from "./page-config";

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
];

const pageComponents = pageConfig.components as Record<
  PageBuilderComponentName,
  PageBuilderConfig["components"][PageBuilderComponentName]
>;

const components = Object.fromEntries(
  layoutBuilderComponentNames.map((componentName) => [
    componentName,
    pageComponents[componentName as PageBuilderComponentName],
  ]),
) as PageBuilderConfig["components"];

export const layoutBuilderConfig: PageBuilderConfig = {
  categories: {
    layout_blocks: {},
    content_blocks: {
      title: "Nội dung",
      components: [
        "Container",
        "Grid",
        "Flex",
        "Spacer",
        "Divider",
        "Heading",
        "RichText",
        "Image",
        "Button",
        "FitNavigationHeader",
        "NavigationMenu",
        "AuthStatus",
        "LinkList",
        "ContactInfo",
        "SocialLinks",
        "NewsletterForm",
        "CopyrightBar",
      ],
    },
    section_blocks: {
      title: "Khối",
      components: ["Section", "Card", "TagList"],
    },
    dynamic_blocks: {
      title: "Dữ liệu",
      components: [
        "LatestPosts",
        "LatestAnnouncements",
        "Categories",
        "PageLinks",
        "UnitList",
        "StaffGrid",
        "StaffProfileCard",
      ],
    },
  },
  root: slotRoot,
  components,
};

export const headerConfig: PageBuilderConfig = {
  categories: {
    layout_blocks: {
      title: "1. Bố cục header",
      components: ["Container", "Grid", "Flex", "Spacer", "Divider"],
    },
    content_blocks: {
      title: "2. Nội dung header",
      components: ["Heading", "Image", "Button", "FitNavigationHeader"],
    },
    section_blocks: {
      title: "3. Nhóm nhanh",
      components: ["TagList"],
    },
    dynamic_blocks: {
      title: "4. Dữ liệu",
      components: ["UnitList", "PageLinks", "StaffProfileCard"],
    },
  },
  root: slotRoot,
  components,
};

export const footerConfig: PageBuilderConfig = {
  categories: {
    layout_blocks: {
      title: "1. Bố cục footer",
      components: ["Section", "Container", "Grid", "Flex", "Divider"],
    },
    content_blocks: {
      title: "2. Nội dung footer",
      components: [
        "Heading",
        "RichText",
        "Button",
        "FitFooter",
        "NewsletterForm",
        "TagList",
      ],
    },
    section_blocks: {
      title: "3. Khối",
      components: ["Card"],
    },
    dynamic_blocks: {
      title: "4. Dữ liệu",
      components: [
        "LatestPosts",
        "LatestAnnouncements",
        "Categories",
        "PageLinks",
        "UnitList",
        "StaffProfileCard",
      ],
    },
  },
  root: slotRoot,
  components,
};

export const sideConfig: PageBuilderConfig = {
  categories: {
    layout_blocks: {
      title: "1. Bố cục sidebar",
      components: ["Container", "Flex", "Spacer", "Divider"],
    },
    content_blocks: {
      title: "2. Nội dung sidebar",
      components: [
        "Heading",
        "RichText",
        "Button",
        "NavigationMenu",
        "AuthStatus",
        "LinkList",
        "Card",
      ],
    },
    section_blocks: {
      title: "3. Danh sách",
      components: ["TagList"],
    },
    dynamic_blocks: {
      title: "4. Dữ liệu",
      components: [
        "LatestPosts",
        "LatestAnnouncements",
        "Categories",
        "StaffGrid",
        "StaffProfileCard",
        "PageLinks",
        "UnitList",
      ],
    },
  },
  root: slotRoot,
  components,
};
