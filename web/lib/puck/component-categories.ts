import type {
  PageBuilderCategory,
  PageBuilderComponentName,
} from "./blocks/types";

const LAYOUT_COMPONENTS = [
  "SiteLayoutFrame",
  "Section",
  "Container",
  "Grid",
  "TwoColumns",
  "Spacer",
  "Divider",
  "Flex",
] as const;

const CONTENT_COMPONENTS = [
  "Heading",
  "RichText",
  "Image",
  "ImageText",
  "Button",
  "ButtonGroup",
  "Card",
  "Note",
  "BadgeList",
  "TagList",
  "SocialLinks",
  "NewsletterForm",
  "CopyrightBar",
] as const;

const SECTION_COMPONENTS = [
  "HeroBanner",
  "HeroSplit",
  "FeaturedHero",
  "HighlightStats",
  "ProgramGrid",
  "AboutFeature",
  "AboutSection",
  "FeatureGrid",
  "StatsSection",
  "CTASection",
  "TimelineSection",
  "FAQSection",
  "TestimonialSection",
  "CarouselSection",
  "Milestones",
  "FeaturedNews",
  "FeaturedAnnouncements",
  "EnrollmentCta",
] as const;

const DATA_COMPONENTS = [
  "PostFeed",
  "AnnouncementFeed",
  "StaffGrid",
  "StaffProfileCard",
  "UnitList",
  "RelatedPostFeed",
  "SiteHeader",
  "SiteFooter",
  "NavigationMenu",
  "PostCategoryList",
  "PageLinkList",
  "CustomLinkList",
  "ContactInfo",
  "AuthLinks",
  "PostDetailHeader",
  "SidebarQuickLinks",
  "SidebarSupport",
] as const;

export const PUCK_CATEGORY_COMPONENTS = {
  layout_blocks: [...LAYOUT_COMPONENTS],
  content_blocks: [...CONTENT_COMPONENTS],
  section_blocks: [...SECTION_COMPONENTS],
  dynamic_blocks: [...DATA_COMPONENTS],
} satisfies Record<PageBuilderCategory, PageBuilderComponentName[]>;

export const PUCK_CATEGORY_TITLES: Record<PageBuilderCategory, string> = {
  layout_blocks: "Bố cục",
  content_blocks: "Nội dung",
  section_blocks: "Khối dựng sẵn",
  dynamic_blocks: "Dữ liệu & hệ thống",
};

export function createPuckCategories(
  allowedComponents?: PageBuilderComponentName[],
): Record<
  PageBuilderCategory,
  { title: string; components: PageBuilderComponentName[] }
> {
  const allowed = allowedComponents ? new Set(allowedComponents) : null;

  return {
    layout_blocks: {
      title: PUCK_CATEGORY_TITLES.layout_blocks,
      components: filterAllowed(
        PUCK_CATEGORY_COMPONENTS.layout_blocks,
        allowed,
      ),
    },
    content_blocks: {
      title: PUCK_CATEGORY_TITLES.content_blocks,
      components: filterAllowed(
        PUCK_CATEGORY_COMPONENTS.content_blocks,
        allowed,
      ),
    },
    section_blocks: {
      title: PUCK_CATEGORY_TITLES.section_blocks,
      components: filterAllowed(
        PUCK_CATEGORY_COMPONENTS.section_blocks,
        allowed,
      ),
    },
    dynamic_blocks: {
      title: PUCK_CATEGORY_TITLES.dynamic_blocks,
      components: filterAllowed(PUCK_CATEGORY_COMPONENTS.dynamic_blocks, allowed),
    },
  };
}

function filterAllowed(
  components: readonly PageBuilderComponentName[],
  allowed: Set<PageBuilderComponentName> | null,
): PageBuilderComponentName[] {
  if (allowed === null) {
    return [...components];
  }

  return components.filter((component) => allowed.has(component));
}
