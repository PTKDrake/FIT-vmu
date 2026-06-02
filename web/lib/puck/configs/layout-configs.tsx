import type { PageBuilderConfig } from "../blocks/types";
import { pageConfig } from "./page-config";

const slotRoot: PageBuilderConfig["root"] = {
  render: ({ children }) => <div className="font-sans w-full">{children}</div>,
};

const components = pageConfig.components;

export const layoutBuilderConfig: PageBuilderConfig = {
  categories: {
    layout_blocks: {
      title: "1. Site layout",
      components: ["SiteLayoutFrame"],
    },
    content_blocks: {
      title: "2. Nội dung",
      components: [],
    },
    section_blocks: {
      title: "3. Khối",
      components: [],
    },
    dynamic_blocks: {
      title: "4. Dữ liệu",
      components: [],
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
      components: [
        "Heading",
        "Image",
        "Button",
        "NavigationMenu",
        "AuthStatus",
      ],
    },
    section_blocks: {
      title: "3. Nhóm nhanh",
      components: ["TagList"],
    },
    dynamic_blocks: {
      title: "4. Dữ liệu",
      components: ["UnitList", "PageLinks"],
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
        "NavigationMenu",
        "AuthStatus",
        "LinkList",
        "ContactInfo",
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
        "PageLinks",
        "UnitList",
      ],
    },
  },
  root: slotRoot,
  components,
};
