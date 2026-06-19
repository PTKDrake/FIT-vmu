export const PUCK_COMPONENT_TYPE_ALIASES = {
  HeroCustom: "FeaturedHero",
  StatsCustom: "HighlightStats",
  ProgramsCustom: "ProgramGrid",
  AboutCustom: "AboutFeature",
  NewsCustom: "FeaturedNews",
  AnnouncementsCustom: "FeaturedAnnouncements",
  CtaCustom: "EnrollmentCta",
  FitNavigationHeader: "SiteHeader",
  FitFooter: "SiteFooter",
  PostHeader: "PostDetailHeader",
  LatestPosts: "PostFeed",
  LatestAnnouncements: "AnnouncementFeed",
  RelatedPosts: "RelatedPostFeed",
  Categories: "PostCategoryList",
  PageLinks: "PageLinkList",
  LinkList: "CustomLinkList",
  AuthStatus: "AuthLinks",
} as const;

export const PUCK_COMPONENT_ENGLISH_NAMES: Record<string, string> = {
  SiteLayoutFrame: "Site Layout Frame",
  Section: "Section",
  Container: "Container",
  Grid: "Grid",
  TwoColumns: "Two Columns",
  Spacer: "Spacer",
  Divider: "Divider",
  Flex: "Flex",
  Heading: "Heading",
  RichText: "Rich Text",
  Image: "Image",
  ImageText: "Image with Text",
  Button: "Button",
  ButtonGroup: "Button Group",
  Card: "Card",
  Note: "Note",
  BadgeList: "Badge List",
  TagList: "Tag List",
  SocialLinks: "Social Links",
  NewsletterForm: "Newsletter Form",
  CopyrightBar: "Copyright Bar",
  HeroBanner: "Hero Banner",
  HeroSplit: "Split Hero",
  FeaturedHero: "Featured Hero",
  HighlightStats: "Highlight Stats",
  ProgramGrid: "Program Grid",
  AboutFeature: "About Feature",
  Milestones: "Milestones",
  FeaturedNews: "Featured News",
  FeaturedAnnouncements: "Featured Announcements",
  EnrollmentCta: "Enrollment CTA",
  AboutSection: "About Section",
  FeatureGrid: "Feature Grid",
  StatsSection: "Stats Section",
  CTASection: "CTA Section",
  TimelineSection: "Timeline Section",
  FAQSection: "FAQ Section",
  TestimonialSection: "Testimonial Section",
  CarouselSection: "Carousel Section",
  PostFeed: "Post Feed",
  AnnouncementFeed: "Announcement Feed",
  StaffGrid: "Staff Grid",
  StaffProfileCard: "Staff Profile Card",
  UnitList: "Unit List",
  RelatedPostFeed: "Related Post Feed",
  SiteHeader: "Site Header",
  SiteFooter: "Site Footer",
  NavigationMenu: "Navigation Menu",
  PostCategoryList: "Post Category List",
  PageLinkList: "Page Link List",
  CustomLinkList: "Custom Link List",
  ContactInfo: "Contact Info",
  AuthLinks: "Auth Links",
  PostDetailHeader: "Post Detail Header",
  SidebarQuickLinks: "Sidebar Quick Links",
  SidebarSupport: "Sidebar Support",
} as const;

export function normalizePuckComponentType(type: string): string {
  return PUCK_COMPONENT_TYPE_ALIASES[
    type as keyof typeof PUCK_COMPONENT_TYPE_ALIASES
  ] ?? type;
}

export function getPuckEnglishName(type: string): string {
  const canonicalType = normalizePuckComponentType(type);

  return (
    PUCK_COMPONENT_ENGLISH_NAMES[canonicalType] ??
    canonicalType.replace(/([a-z0-9])([A-Z])/g, "$1 $2").trim()
  );
}
