import type { Data } from "@puckeditor/core";
import type { PuckSurfaceStyleProps } from "./blocks/surface";
import type { PuckImageValue } from "./media";

export const PUCK_PAGE_CONTENT_FORMAT = "puck_json" as const;

export interface VmuFitPageBuilderComponents {
  SiteLayoutFrame: PuckSurfaceStyleProps & {
    className?: string;
    header?: any;
    left?: any;
    right?: any;
    footer?: any;
  };

  // 1. Layout blocks
  Section: PuckSurfaceStyleProps & {
    anchorId?: string;
    background?: "transparent" | "primarySubtle" | "infoSubtle" | "dark";
    paddingTop?: "none" | "sm" | "md" | "lg";
    paddingBottom?: "none" | "sm" | "md" | "lg";
    paddingY?: "none" | "sm" | "md" | "lg"; // For backwards compatibility
    paddingX?: "none" | "sm" | "md" | "lg";
    minHeight?: "auto" | "md" | "lg" | "screen";
    backgroundImage?: PuckImageValue;
    backgroundPosition?: "top" | "center" | "bottom";
    backgroundSize?: "cover" | "contain" | "auto";
    overlay?: "none" | "light" | "dark" | "primary";
    contentAlign?: "top" | "center" | "bottom";
    borderRadius?: "none" | "lg" | "xl" | "2xl" | "3xl";
    hideOn?: "none" | "mobile" | "tablet" | "desktop";
    className?: string;
    children?: any;
  };
  Container: PuckSurfaceStyleProps & {
    anchorId?: string;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
    paddingX?: "yes" | "no" | boolean; // Supports boolean for backwards compatibility
    horizontalPadding?: "none" | "sm" | "md" | "lg";
    align?: "center" | "left" | "right";
    insetY?: "none" | "xs" | "sm" | "md" | "lg";
    hideOn?: "none" | "mobile" | "tablet" | "desktop";
    className?: string;
    children?: any;
  };
  Grid: PuckSurfaceStyleProps & {
    anchorId?: string;
    columns?: number; // Backwards compatibility
    mobileColumns?: 1 | 2;
    tabletColumns?: 1 | 2 | 3 | 4;
    desktopColumns?: 1 | 2 | 3 | 4 | 5 | 6;
    gap?: "sm" | "md" | "lg" | "xl" | number; // Number for backwards compatibility
    gapX?: "sm" | "md" | "lg" | "xl";
    gapY?: "sm" | "md" | "lg" | "xl";
    alignItems?: "start" | "center" | "stretch";
    justifyItems?: "start" | "center" | "end" | "stretch";
    insetY?: "none" | "xs" | "sm" | "md" | "lg";
    hideOn?: "none" | "mobile" | "tablet" | "desktop";
    className?: string;
    children?: any;
  };
  TwoColumns: PuckSurfaceStyleProps & {
    anchorId?: string;
    columnRatio?: "equal" | "leftWide" | "rightWide";
    gap?: "sm" | "md" | "lg" | "xl" | number; // Number for backwards compatibility
    stackOnMobile?: boolean;
    reverseOnMobile?: boolean;
    verticalAlign?: "top" | "center" | "bottom" | "stretch";
    hideOn?: "none" | "mobile" | "tablet" | "desktop";
    className?: string;
    left?: any;
    right?: any;
  };
  Spacer: {
    anchorId?: string;
    height?: "xs" | "sm" | "md" | "lg" | "xl";
    mobileHeight?: "xs" | "sm" | "md" | "lg" | "xl";
    hideOn?: "none" | "mobile" | "tablet" | "desktop";
    className?: string;
  };
  Divider: {
    anchorId?: string;
    type?: "solid" | "dashed" | "dotted";
    color?: "default" | "primary" | "muted";
    spacingY?: "none" | "sm" | "md" | "lg";
    width?: "full" | "container" | "xl" | "lg" | "md" | "sm" | "short";
    align?: "left" | "center" | "right";
    hideOn?: "none" | "mobile" | "tablet" | "desktop";
    className?: string;
  };
  Flex: PuckSurfaceStyleProps & {
    anchorId?: string;
    flexDirection?:
      | "row"
      | "column"
      | "rowReverse"
      | "columnReverse"
      | "row-reverse"
      | "column-reverse";
    mobileDirection?: "row" | "column";
    justifyContent?:
      | "start"
      | "center"
      | "end"
      | "between"
      | "around"
      | "evenly";
    alignItems?: "start" | "center" | "end" | "stretch";
    gap?: "sm" | "md" | "lg" | "xl" | number;
    gapX?: "sm" | "md" | "lg" | "xl";
    gapY?: "sm" | "md" | "lg" | "xl";
    wrap?: boolean;
    childWidth?: "auto" | "equal" | "full";
    insetY?: "none" | "xs" | "sm" | "md" | "lg";
    hideOn?: "none" | "mobile" | "tablet" | "desktop";
    className?: string;
    classes?: string;
    children?: any;
  };

  // 2. Content blocks
  Heading: {
    title: string;
    subtitle: string;
    level: 1 | 2 | 3 | 4;
    alignment: "left" | "center" | "right";
    layoutPreset?: "default" | "headerBrand";
    fullWidthOnMobile?: boolean;
    autoWidthFromMd?: boolean;
    noShrinkFromMd?: boolean;
    className?: string;
  };
  RichText: {
    body: string;
    className?: string;
  };
  Image: PuckSurfaceStyleProps & {
    imageUrl: PuckImageValue;
    alt: string;
    caption: string;
    objectFit: "cover" | "contain";
    rounded: boolean;
    className?: string;
  };
  ImageText: PuckSurfaceStyleProps & {
    imageUrl: PuckImageValue;
    alt: string;
    title: string;
    description: string;
    imagePosition: "left" | "right";
    className?: string;
  };
  Button: PuckSurfaceStyleProps & {
    text: string;
    url: string;
    variant: "primary" | "secondary" | "outline" | "plain";
    size: "sm" | "md" | "lg";
    openInNewTab: boolean;
    className?: string;
  };
  ButtonGroup: PuckSurfaceStyleProps & {
    buttons: {
      text: string;
      url: string;
      variant: "primary" | "secondary" | "outline" | "plain";
      size: "sm" | "md" | "lg";
      openInNewTab: boolean;
    }[];
    className?: string;
  };
  Card: PuckSurfaceStyleProps & {
    title: string;
    description: string;
    imageUrl: PuckImageValue;
    linkUrl: string;
    linkLabel: string;
    className?: string;
  };
  Note: PuckSurfaceStyleProps & {
    title: string;
    body: string;
    intent: "info" | "warning" | "success" | "danger";
    className?: string;
  };
  BadgeList: PuckSurfaceStyleProps & {
    badges: {
      text: string;
      intent:
        | "primary"
        | "secondary"
        | "success"
        | "info"
        | "warning"
        | "danger";
    }[];
    className?: string;
  };
  TagList: PuckSurfaceStyleProps & {
    tags: {
      text: string;
    }[];
    className?: string;
  };

  // 3. Section blocks
  HeroBanner: {
    eyebrow: string;
    title: string;
    description: string;
    primaryActionHref: string;
    primaryActionLabel: string;
    secondaryActionHref: string;
    secondaryActionLabel: string;
    className?: string;
  };
  HeroSplit: {
    title: string;
    description: string;
    imageUrl: PuckImageValue;
    primaryActionHref: string;
    primaryActionLabel: string;
    secondaryActionHref: string;
    secondaryActionLabel: string;
    stats: {
      title: string;
      subtitle: string;
    }[];
    className?: string;
  };
  AboutSection: PuckSurfaceStyleProps & {
    badge: string;
    header: string;
    description: string;
    unitName: string;
    address: string;
    phone: string;
    email: string;
    imageUrl: PuckImageValue;
    className?: string;
  };
  FeatureGrid: PuckSurfaceStyleProps & {
    badge: string;
    header: string;
    description: string;
    features: {
      icon: string;
      title: string;
      description: string;
    }[];
    columns: number;
    className?: string;
  };
  StatsSection: PuckSurfaceStyleProps & {
    badge: string;
    header: string;
    description: string;
    stats: {
      value: string;
      label: string;
      trendValue?: string;
      isPositive?: boolean;
    }[];
    className?: string;
  };
  CTASection: PuckSurfaceStyleProps & {
    header: string;
    description: string;
    primaryActionLabel: string;
    primaryActionHref: string;
    secondaryActionLabel: string;
    secondaryActionHref: string;
    layoutPreset?: "default" | "containedWide";
    align?: "left" | "center" | "right";
    maxWidth?: "none" | "4xl";
    className?: string;
  };
  TimelineSection: PuckSurfaceStyleProps & {
    badge: string;
    header: string;
    description: string;
    steps: {
      title: string;
      description: string;
    }[];
    className?: string;
  };
  FAQSection: PuckSurfaceStyleProps & {
    title: string;
    description: string;
    items: {
      question: string;
      answer: string;
    }[];
    className?: string;
  };
  TestimonialSection: PuckSurfaceStyleProps & {
    badge: string;
    header: string;
    description: string;
    testimonials: {
      name: string;
      roleAndCompany: string;
      content: string;
      avatar: PuckImageValue;
    }[];
    className?: string;
  };
  CarouselSection: PuckSurfaceStyleProps & {
    badge: string;
    header: string;
    description: string;
    items: {
      imageUrl: PuckImageValue;
      title: string;
      description: string;
      linkUrl: string;
    }[];
    className?: string;
  };

  // 4. Dynamic blocks
  LatestPosts: PuckSurfaceStyleProps & {
    title: string;
    limit: number;
    categoryId: string;
    layout: "grid" | "list" | "carousel";
    showCTA: boolean;
    className?: string;
  };
  LatestAnnouncements: PuckSurfaceStyleProps & {
    title: string;
    limit: number;
    layout: "grid" | "list";
    showCTA: boolean;
    className?: string;
  };
  StaffGrid: PuckSurfaceStyleProps & {
    title: string;
    limit: number;
    departmentId: string;
    className?: string;
  };
  StaffProfileCard: PuckSurfaceStyleProps & {
    title?: string;
    staffId?: string;
    fallbackRole?: string;
    showEmail?: boolean;
    showPosition?: boolean;
    className?: string;
  };
  UnitList: PuckSurfaceStyleProps & {
    title: string;
    limit: number;
    type: string;
    className?: string;
  };
  RelatedPosts: PuckSurfaceStyleProps & {
    title: string;
    limit: number;
    className?: string;
  };
  FitNavigationHeader: {
    logoUrl?: PuckImageValue;
    logoAlt?: string;
    siteName?: string;
    organizationName?: string;
    menuId?: string;
    menuAriaLabel?: string;
    searchHref?: string;
    searchLabel?: string;
    loginLabel?: string;
    profileLabel?: string;
    className?: string;
  };
  FitFooter: {
    showBrand?: boolean;
    showContact?: boolean;
    showQuickLinks?: boolean;
    showSupportLinks?: boolean;
    showSocialLinks?: boolean;
    showCopyright?: boolean;
    showLegalLinks?: boolean;
    logoUrl?: PuckImageValue;
    logoAlt?: string;
    siteName?: string;
    organizationName?: string;
    description?: string;
    contactTitle?: string;
    address?: string;
    phone?: string;
    email?: string;
    quickLinksTitle?: string;
    quickLinksMenuId?: string;
    supportTitle?: string;
    supportLinks?: {
      label: string;
      url: string;
      icon: "users" | "mail" | "book" | "help" | "globe";
    }[];
    socialTitle?: string;
    socialLinks?: {
      platform:
        | "facebook"
        | "youtube"
        | "x"
        | "instagram"
        | "github"
        | "tiktok"
        | "zalo"
        | "email"
        | "phone"
        | "website";
      url: string;
      label?: string;
    }[];
    copyrightText?: string;
    legalLinks?: {
      label: string;
      url: string;
    }[];
    className?: string;
  };
  NavigationMenu: PuckSurfaceStyleProps & {
    title?: string;
    menuId?: string;
    mobileButtonLabel?: string;
    mobileLogoAlt?: string;
    mobileLogoUrl?: PuckImageValue;
    mobilePanelTitle?: string;
    layoutPreset?: "default" | "headerPrimary" | "footerMenu";
    fullWidthOnMobile?: boolean;
    autoWidthFromMd?: boolean;
    noShrinkFromMd?: boolean;
    growFromMd?: boolean;
    basisFromMd?: "none" | "44rem";
    maxWidth?: "default" | "none" | "sm";
    textAlign?: "left" | "center" | "right";
    textAlignFromLg?: "inherit" | "left" | "center" | "right";
    positionFromLg?: "inherit" | "start" | "center" | "end";
    orientation?: "horizontal" | "vertical";
    className?: string;
  };
  Categories: PuckSurfaceStyleProps & {
    title: string;
    parentId?: string;
    limit: number;
    className?: string;
  };
  PageLinks: PuckSurfaceStyleProps & {
    title: string;
    limit: number;
    className?: string;
  };
  LinkList: PuckSurfaceStyleProps & {
    title: string;
    links: {
      label: string;
      url: string;
      openInNewTab?: boolean;
    }[];
    className?: string;
  };
  ContactInfo: PuckSurfaceStyleProps & {
    title: string;
    address?: string;
    phone?: string;
    email?: string;
    layoutPreset?: "default" | "footerContact";
    maxWidth?: "default" | "sm";
    textAlign?: "left" | "center" | "right";
    textAlignFromLg?: "inherit" | "left" | "center" | "right";
    positionFromLg?: "inherit" | "start" | "center" | "end";
    className?: string;
  };
  SocialLinks: PuckSurfaceStyleProps & {
    links: {
      platform:
        | "facebook"
        | "youtube"
        | "linkedin"
        | "twitter"
        | "instagram"
        | "github"
        | "tiktok"
        | "zalo"
        | "email"
        | "phone"
        | "website";
      url: string;
      label?: string;
    }[];
    layout?: "horizontal" | "vertical";
    iconSize?: "sm" | "md" | "lg";
    showLabels?: boolean;
    className?: string;
  };
  NewsletterForm: PuckSurfaceStyleProps & {
    title: string;
    description: string;
    placeholder: string;
    buttonLabel: string;
    actionUrl: string;
    layout?: "inline" | "stacked";
    className?: string;
  };
  CopyrightBar: PuckSurfaceStyleProps & {
    text: string;
    links: {
      label: string;
      url: string;
    }[];
    className?: string;
  };
  AuthStatus: PuckSurfaceStyleProps & {
    alignment?: "left" | "center" | "right";
    buttonLabel?: string;
    showName?: boolean;
    showEmail?: boolean;
    showRegisterLink?: boolean;
    showCmsLink?: boolean;
    profileVariant?: "avatar" | "avatarName" | "compact";
    layoutPreset?: "default" | "headerActions";
    fullWidthOnMobile?: boolean;
    autoWidthFromMd?: boolean;
    noShrinkFromMd?: boolean;
    className?: string;
  };
}

export interface PageBuilderRootProps {
  title?: string;
}

export type VmuFitPageBuilderData = Data<
  VmuFitPageBuilderComponents,
  PageBuilderRootProps
>;

export type VmuFitPageBuilderValue =
  | Partial<VmuFitPageBuilderData>
  | string
  | null
  | undefined;

interface PuckDefaultPropsComponentConfig {
  defaultProps?: unknown;
}

interface PuckDefaultPropsConfig {
  components: Record<string, PuckDefaultPropsComponentConfig | undefined>;
}

const DEFAULT_PAGE_DATA: VmuFitPageBuilderData = {
  root: {
    props: {
      title: "Trang chủ Khoa CNTT - FIT-VMU",
    },
  },
  content: [
    {
      type: "HeroBanner",
      props: {
        id: "hero-banner-default",
        eyebrow: "Tuyển sinh 2026",
        title: "Chào mừng bạn đến với Khoa Công nghệ thông tin - FIT-VMU",
        description:
          "Nơi ươm mầm tài năng công nghệ, định hình tương lai số. Khoa CNTT trường Đại học Hàng hải Việt Nam tự hào mang đến môi trường giáo dục chuẩn quốc tế, trang thiết bị tiên tiến cùng đội ngũ giảng viên giàu nhiệt huyết.",
        primaryActionHref: "/posts",
        primaryActionLabel: "Thông tin Tuyển sinh",
        secondaryActionHref: "/dashboard",
        secondaryActionLabel: "Quản trị CMS",
      },
    },
    {
      type: "AboutSection",
      props: {
        id: "about-section-default",
        badge: "Về đơn vị",
        header: "Giới thiệu Khoa Công nghệ thông tin",
        description:
          "Tìm hiểu về cơ cấu tổ chức, nhiệm vụ đào tạo và phương châm hoạt động của Khoa Công nghệ thông tin.",
        unitName: "Khoa Công nghệ thông tin - Trường Đại học Hàng hải Việt Nam",
        address:
          "Phòng 402, Nhà A5, Số 484 Lạch Tray, Kênh Dương, Lê Chân, Hải Phòng",
        phone: "0225.3735138",
        email: "fit@vimaru.edu.vn",
        imageUrl: "",
      },
    },
    {
      type: "FeatureGrid",
      props: {
        id: "features-default",
        badge: "Thế mạnh",
        header: "Tại Sao Nên Chọn FIT-VMU?",
        description:
          "Những ưu thế vượt trội tạo nên uy tín và chất lượng đào tạo hàng đầu của Khoa.",
        features: [
          {
            icon: "GraduationCap",
            title: "Chương Trình Đào Tạo Chuẩn",
            description:
              "Chương trình được xây dựng tiệm cận tiêu chuẩn quốc tế và cập nhật liên tục theo xu hướng công nghệ.",
          },
          {
            icon: "Users",
            title: "Giảng Viên Đầu Ngành",
            description:
              "Đội ngũ giảng viên có học vị cao, nhiệt huyết, giàu kinh nghiệm thực tế và nghiên cứu khoa học.",
          },
          {
            icon: "Briefcase",
            title: "Liên Kết Doanh Nghiệp Rộng Mở",
            description:
              "Hợp tác chặt chẽ với các doanh nghiệp công nghệ lớn mang đến cơ hội thực tập và việc làm 100% cho sinh viên.",
          },
        ],
        columns: 3,
      },
    },
    {
      type: "TimelineSection",
      props: {
        id: "steps-default",
        badge: "Lộ trình",
        header: "Lộ Trình Đào Tạo 4 Năm",
        description:
          "Quy trình học tập bài bản, khoa học giúp sinh viên vững vàng kiến thức và kỹ năng thực chiến.",
        steps: [
          {
            title: "Năm 1: Đại cương & Cơ sở ngành",
            description:
              "Trang bị tư duy lập trình căn bản, kỹ năng mềm và toán chuyên ngành.",
          },
          {
            title: "Năm 2: Kiến thức cốt lõi",
            description:
              "Đi sâu cấu trúc dữ liệu, thuật toán, cơ sở dữ liệu và mạng máy tính.",
          },
          {
            title: "Năm 3: Chuyên ngành & Dự án",
            description:
              "Phát triển ứng dụng Web/Mobile, học máy, an toàn thông tin và làm dự án nhóm.",
          },
          {
            title: "Năm 4: Thực tập & Khóa luận",
            description:
              "Thực chiến tại doanh nghiệp đối tác, hoàn thành khóa luận tốt nghiệp.",
          },
        ],
      },
    },
    {
      type: "TestimonialSection",
      props: {
        id: "testimonials-default",
        badge: "Cựu Sinh Viên Thành Đạt",
        header: "Sinh viên nói gì về chúng tôi?",
        description:
          "Ý kiến từ những thế hệ sinh viên đã trưởng thành từ chiếc nôi FIT-VMU.",
        testimonials: [
          {
            name: "Phạm Văn Minh",
            roleAndCompany:
              "Senior Software Engineer tại FPT Software (Cựu SV K58)",
            content:
              "Những năm tháng học tập tại FIT-VMU đã rèn luyện cho tôi tư duy lập trình vững chắc và khả năng tự nghiên cứu, giúp tôi tự tin hòa nhập vào môi trường công nghệ toàn cầu.",
            avatar: "",
          },
          {
            name: "Nguyễn Thị Mai",
            roleAndCompany: "Data Analyst tại Viettel Telecom (Cựu SV K59)",
            content:
              "Giảng viên của khoa cực kỳ tâm huyết và luôn sẵn sàng hỗ trợ sinh viên tham gia các đề tài nghiên cứu khoa học thú vị, là bước đệm tuyệt vời cho công việc phân tích dữ liệu của tôi hiện tại.",
            avatar: "",
          },
        ],
      },
    },
    {
      type: "FAQSection",
      props: {
        id: "faq-default",
        title: "Câu Hỏi Thường Gặp",
        description:
          "Giải đáp các thắc mắc phổ biến nhất dành cho phụ huynh và học sinh quan tâm tuyển sinh.",
        items: [
          {
            question: "Chỉ tiêu tuyển sinh năm nay của Khoa CNTT là bao nhiêu?",
            answer:
              "Chỉ tiêu tuyển sinh được công bố chính thức trên website của trường Đại học Hàng hải Việt Nam, thông thường dao động từ 300 - 450 sinh viên cho các chuyên ngành CNTT, Kỹ thuật phần mềm và Hệ thống thông tin.",
          },
          {
            question:
              "Cơ hội việc làm của sinh viên sau khi tốt nghiệp như thế nào?",
            answer:
              "Tỷ lệ sinh viên Khoa CNTT có việc làm đúng chuyên ngành trong vòng 6 tháng sau khi tốt nghiệp đạt trên 95% tại các doanh nghiệp đối tác hàng đầu trong và ngoài nước.",
          },
        ],
      },
    },
    {
      type: "CTASection",
      props: {
        id: "cta-default",
        header: "Sẵn sàng gia nhập mái nhà chung FIT-VMU?",
        description:
          "Đăng ký ứng tuyển trực tuyến ngay hôm nay để nhận thông báo xét tuyển sớm nhất.",
        primaryActionLabel: "Xét tuyển trực tuyến",
        primaryActionHref: "https://vimaru.edu.vn",
        secondaryActionLabel: "Tin tức mới",
        secondaryActionHref: "/posts",
      },
    },
  ],
};

const EMPTY_PUCK_DATA: VmuFitPageBuilderData = {
  root: {
    props: {},
  },
  content: [],
};

export function createDefaultPuckPageData(): VmuFitPageBuilderData {
  return clonePuckPageData(DEFAULT_PAGE_DATA);
}

export function createEmptyPuckData(): VmuFitPageBuilderData {
  return clonePuckPageData(EMPTY_PUCK_DATA);
}

export type PageTemplateType =
  | "basic"
  | "landing"
  | "academic"
  | "article"
  | "empty";

export function createPuckPageDataFromTemplate(
  template: PageTemplateType,
  title: string,
): VmuFitPageBuilderData {
  const root = {
    props: {
      title: title || "Trang mới",
    },
  };

  let content: any[] = [];

  if (template === "basic") {
    content = [
      {
        type: "HeroBanner",
        props: {
          id: "hero-banner-basic",
          eyebrow: "Trang thông tin",
          title: title || "Tiêu đề trang",
          description:
            "Mô tả ngắn hoặc lời giới thiệu chung về trang nội dung này.",
          primaryActionHref: "#content",
          primaryActionLabel: "Khám phá ngay",
          secondaryActionHref: "",
          secondaryActionLabel: "",
        },
      },
      {
        type: "RichText",
        props: {
          id: "richtext-basic",
          body: `<h3>1. Giới thiệu chung</h3>
<p>Đây là phần nội dung chính của trang. Bạn có thể sử dụng trình soạn thảo trực quan để chỉnh sửa định dạng chữ, thêm danh sách, bảng biểu, liên kết, hoặc chèn thêm các hình ảnh minh họa sinh động.</p>
<h3>2. Các điều khoản & Quy định</h3>
<p>Vui lòng điền thông tin chi tiết về các quy định, hướng dẫn hoặc quy trình cụ thể tại đây để người dùng dễ dàng theo dõi.</p>`,
        },
      },
      {
        type: "CTASection",
        props: {
          id: "cta-basic",
          header: "Cần thêm thông tin trợ giúp?",
          description:
            "Hãy liên hệ trực tiếp với bộ phận hỗ trợ hoặc văn phòng Khoa để được giải đáp nhanh nhất.",
          primaryActionLabel: "Liên hệ văn phòng",
          primaryActionHref: "/contact",
          secondaryActionLabel: "Tin tức liên quan",
          secondaryActionHref: "/posts",
        },
      },
    ];
  } else if (template === "landing") {
    content = [
      {
        type: "HeroSplit",
        props: {
          id: "hero-split-landing",
          title: title || "Chiêu sinh & Tuyển sinh 2026",
          description:
            "Chào mừng bạn đến với sự kiện lớn nhất trong năm của Khoa CNTT - FIT-VMU. Đăng ký tham gia ngay để nhận được các đặc quyền học thuật và học bổng giá trị.",
          imageUrl: "",
          primaryActionHref: "#register",
          primaryActionLabel: "Đăng ký tuyển sinh",
          secondaryActionHref: "#features",
          secondaryActionLabel: "Tìm hiểu chương trình",
          stats: [
            { title: "98%", subtitle: "Tỷ lệ có việc làm" },
            { title: "150+", subtitle: "Doanh nghiệp đối tác" },
            { title: "20+", subtitle: "Câu lạc bộ SV" },
          ],
        },
      },
      {
        type: "FeatureGrid",
        props: {
          id: "features-landing",
          badge: "Lợi ích nổi bật",
          header: "Lợi thế vượt trội",
          description:
            "Những ưu thế vượt trội mang tính quyết định khi bạn lựa chọn đồng hành cùng chúng tôi.",
          features: [
            {
              icon: "Sparkles",
              title: "Học bổng hấp dẫn",
              description:
                "Học bổng lên tới 100% học phí dành cho sinh viên xuất sắc và tài năng trẻ vượt khó.",
            },
            {
              icon: "Cpu",
              title: "Lab nghiên cứu hiện đại",
              description:
                "Hệ thống phòng Lab AI, IoT và An toàn thông tin trang bị cấu hình cực mạnh, mở cửa 24/7.",
            },
            {
              icon: "Globe",
              title: "Trao đổi quốc tế",
              description:
                "Cơ hội học chuyển tiếp hoặc trao đổi học thuật 1-2 học kỳ tại Nhật Bản, Hàn Quốc, Đài Loan.",
            },
          ],
          columns: 3,
        },
      },
      {
        type: "RichText",
        props: {
          id: "richtext-landing",
          body: `<p>Môi trường học tập năng động, đề cao tính thực hành và tư duy phản biện. Sinh viên được tham gia các dự án nghiên cứu khoa học ngay từ năm thứ hai dưới sự hướng dẫn sát sao của các Giáo sư, Tiến sĩ giàu kinh nghiệm.</p>
<p>Chương trình học chuẩn CDIO, tích hợp kỹ năng chuyên môn sâu cùng kỹ năng mềm, ngoại ngữ (tiếng Anh/tiếng Nhật) giúp sinh viên tự tin làm việc tại các tập đoàn công nghệ đa quốc gia ngay sau khi ra trường.</p>`,
        },
      },
      {
        type: "FAQSection",
        props: {
          id: "faq-landing",
          title: "Câu hỏi thường gặp (FAQ)",
          description:
            "Giải đáp nhanh những băn khoăn phổ biến nhất của thí sinh và phụ huynh học sinh.",
          items: [
            {
              question: "Phương thức xét tuyển của khoa năm nay là gì?",
              answer:
                "Chúng tôi xét tuyển thẳng, xét theo điểm thi THPT Quốc gia, xét học bạ THPT và kết quả kỳ thi Đánh giá năng lực của ĐHQG.",
            },
            {
              question:
                "Sinh viên năm mấy thì bắt đầu đi thực tập tại doanh nghiệp?",
              answer:
                "Sinh viên bắt đầu đi thực tập thực tế tại doanh nghiệp từ cuối năm thứ 3 và làm khóa luận/thực tập tốt nghiệp ở năm thứ 4.",
            },
          ],
        },
      },
      {
        type: "CTASection",
        props: {
          id: "cta-landing",
          header: "Mở cánh cửa tương lai công nghệ của bạn ngay!",
          description:
            "Thời gian đăng ký có hạn. Hãy điền thông tin trực tuyến để nhận tư vấn chuyên sâu miễn phí từ các giảng viên.",
          primaryActionLabel: "Nộp hồ sơ ngay",
          primaryActionHref: "#register",
          secondaryActionLabel: "Tải cẩm nang tuyển sinh",
          secondaryActionHref: "#download",
        },
      },
    ];
  } else if (template === "academic") {
    content = [
      {
        type: "HeroBanner",
        props: {
          id: "hero-banner-academic",
          eyebrow: "Đơn vị học thuật / Phòng ban",
          title: title || "Tên đơn vị học thuật",
          description:
            "Giới thiệu ngắn gọn về chức năng, nhiệm vụ và phương châm hoạt động chuyên môn của Bộ môn / Phòng ban.",
          primaryActionHref: "#about",
          primaryActionLabel: "Giới thiệu chung",
          secondaryActionHref: "#staffs",
          secondaryActionLabel: "Đội ngũ cán bộ",
        },
      },
      {
        type: "AboutSection",
        props: {
          id: "about-us-academic",
          badge: "Giới thiệu bộ môn",
          header: "Bộ môn đào tạo chuyên môn",
          description:
            "Đơn vị chịu trách nhiệm xây dựng chương trình giảng dạy chuyên sâu, quản lý các học phần chuyên ngành và định hướng nghiên cứu khoa học cốt lõi cho sinh viên.",
          unitName: title || "Bộ môn Khoa học máy tính",
          address: "Phòng 401, Nhà A5, Trường Đại học Hàng hải Việt Nam",
          phone: "0225.3735138",
          email: "bomon@vimaru.edu.vn",
          imageUrl: "",
        },
      },
      {
        type: "LatestPosts",
        props: {
          id: "news-academic",
          title: "Tin tức nổi bật liên quan",
          limit: 3,
          categoryId: "",
          layout: "grid",
          showCTA: true,
        },
      },
      {
        type: "CTASection",
        props: {
          id: "docs-academic",
          header: "Tài liệu & Học liệu liên quan",
          description:
            "Tải về các biểu mẫu, đề cương chi tiết môn học, slide bài giảng hoặc tài liệu hướng dẫn làm đồ án tốt nghiệp.",
          primaryActionLabel: "Xem tin tức liên quan",
          primaryActionHref: "/posts",
          secondaryActionLabel: "Lịch tiếp SV",
          secondaryActionHref: "/appointment",
        },
      },
    ];
  } else if (template === "article") {
    content = [
      {
        type: "HeroBanner",
        props: {
          id: "hero-banner-article",
          eyebrow: "Hướng dẫn & Quy chế",
          title: title || "Tiêu đề bài hướng dẫn chi tiết",
          description:
            "Mô tả ngắn gọn, tóm tắt nội dung chính hoặc đối tượng áp dụng của tài liệu hướng dẫn/quy trình xét tốt nghiệp này.",
          primaryActionHref: "#content",
          primaryActionLabel: "Bắt đầu đọc",
          secondaryActionHref: "",
          secondaryActionLabel: "",
        },
      },
      {
        type: "RichText",
        props: {
          id: "content-article",
          body: `<blockquote>
  <p><strong>Lưu ý quan trọng:</strong> Đọc kỹ toàn bộ quy trình dưới đây để tránh những sai sót đáng tiếc trong quá trình chuẩn bị hồ sơ xét tốt nghiệp/hướng dẫn thực tập.</p>
</blockquote>
<h2>1. Điều kiện tiên quyết</h2>
<p>Sinh viên phải hoàn thành đầy đủ tất cả các học phần trong chương trình đào tạo, tích lũy đủ số tín chỉ quy định và không bị kỷ luật từ mức cảnh cáo trở lên.</p>
<h2>2. Hồ sơ cần chuẩn bị</h2>
<ul>
  <li>Đơn xin xét tốt nghiệp (theo mẫu quy định tại phòng Đào tạo).</li>
  <li>Bản sao công chứng Bằng tốt nghiệp THPT.</li>
  <li>Chứng chỉ ngoại ngữ và tin học đạt chuẩn đầu ra theo quy định của nhà trường.</li>
</ul>
<h2>3. Quy trình thực hiện</h2>
<p>Nộp hồ sơ trực tuyến qua cổng thông tin sinh viên -> Bộ phận một cửa tiếp nhận và thẩm định -> Hội đồng khoa xét duyệt -> Công bố danh sách tốt nghiệp tạm thời.</p>`,
        },
      },
    ];
  }

  return clonePuckPageData({
    root,
    content,
  });
}

export function clonePuckPageData(
  data: Partial<VmuFitPageBuilderData>,
): VmuFitPageBuilderData {
  return JSON.parse(
    JSON.stringify(normalizePuckPageData(data)),
  ) as VmuFitPageBuilderData;
}

export function getPuckPageContentFormat(): typeof PUCK_PAGE_CONTENT_FORMAT {
  return PUCK_PAGE_CONTENT_FORMAT;
}

export function isEmptyPuckPageData(data: VmuFitPageBuilderData): boolean {
  return data.content.length === 0;
}

export function parsePuckPageData(
  value: VmuFitPageBuilderValue,
): VmuFitPageBuilderData {
  if (!value) {
    return createDefaultPuckPageData();
  }

  if (typeof value === "string") {
    try {
      const parsedValue = JSON.parse(value) as unknown;

      if (isPuckPageData(parsedValue)) {
        return clonePuckPageData(parsedValue);
      }
    } catch {
      return createDefaultPuckPageData();
    }

    return createDefaultPuckPageData();
  }

  if (isPuckPageData(value)) {
    return clonePuckPageData(value);
  }

  return createDefaultPuckPageData();
}

export function parsePuckLayoutData(
  value: VmuFitPageBuilderValue,
): VmuFitPageBuilderData {
  if (!value) {
    return createEmptyPuckData();
  }

  if (typeof value === "string") {
    try {
      const parsedValue = JSON.parse(value) as unknown;

      if (isPuckPageData(parsedValue)) {
        return clonePuckPageData(parsedValue);
      }
    } catch {
      return createEmptyPuckData();
    }

    return createEmptyPuckData();
  }

  if (isPuckPageData(value)) {
    return clonePuckPageData(value);
  }

  return createEmptyPuckData();
}

export function serializePuckPageData(data: VmuFitPageBuilderData): string {
  return JSON.stringify(data, null, 2);
}

export function applyPuckDefaultProps(
  data: VmuFitPageBuilderData,
  config: PuckDefaultPropsConfig,
): VmuFitPageBuilderData {
  return clonePuckPageData({
    ...data,
    content: normalizePuckComponentList(
      data.content,
      config,
    ) as VmuFitPageBuilderData["content"],
    ...(data.zones
      ? {
          zones: normalizePuckZones(data.zones, config),
        }
      : {}),
  });
}

function isPuckPageData(
  value: unknown,
): value is Partial<VmuFitPageBuilderData> {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as {
    content?: unknown;
    root?: { props?: unknown } | null;
    zones?: unknown;
  };

  if (!candidate.root || typeof candidate.root !== "object") {
    return false;
  }

  return Array.isArray(candidate.content);
}

function normalizePuckPageData(
  data: Partial<VmuFitPageBuilderData>,
): VmuFitPageBuilderData {
  return {
    root: {
      props:
        data.root && typeof data.root === "object" && "props" in data.root
          ? ((data.root.props as { title?: string } | undefined) ?? {})
          : {},
    },
    content: Array.isArray(data.content) ? data.content : [],
    ...(data.zones ? { zones: data.zones } : {}),
  };
}

function normalizePuckComponentList(
  value: unknown,
  config: PuckDefaultPropsConfig,
): unknown[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => normalizePuckComponentData(item, config));
}

function normalizePuckComponentData(
  value: unknown,
  config: PuckDefaultPropsConfig,
): unknown {
  if (!isPuckComponentData(value)) {
    return normalizePuckPropValue(value, config);
  }

  const componentConfig = config.components[value.type];
  const defaultProps = isPlainRecord(componentConfig?.defaultProps)
    ? componentConfig.defaultProps
    : {};
  const props = isPlainRecord(value.props) ? value.props : {};

  return {
    ...value,
    props: mergePuckDefaultProps(defaultProps, props, config),
  };
}

function mergePuckDefaultProps(
  defaultProps: Record<string, unknown>,
  props: Record<string, unknown>,
  config: PuckDefaultPropsConfig,
): Record<string, unknown> {
  const mergedProps: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(defaultProps)) {
    mergedProps[key] = normalizePuckPropValue(value, config);
  }

  for (const [key, value] of Object.entries(props)) {
    if (value === undefined) {
      continue;
    }

    mergedProps[key] = normalizePuckPropValue(value, config);
  }

  return mergedProps;
}

function normalizePuckPropValue(
  value: unknown,
  config: PuckDefaultPropsConfig,
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => normalizePuckComponentData(item, config));
  }

  if (!isPlainRecord(value)) {
    return value;
  }

  if (isPuckComponentData(value)) {
    return normalizePuckComponentData(value, config);
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      normalizePuckPropValue(item, config),
    ]),
  );
}

function normalizePuckZones(
  zones: NonNullable<VmuFitPageBuilderData["zones"]>,
  config: PuckDefaultPropsConfig,
): NonNullable<VmuFitPageBuilderData["zones"]> {
  return Object.fromEntries(
    Object.entries(zones).map(([zoneName, value]) => [
      zoneName,
      Array.isArray(value)
        ? normalizePuckComponentList(value, config)
        : normalizePuckPropValue(value, config),
    ]),
  ) as NonNullable<VmuFitPageBuilderData["zones"]>;
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isPuckComponentData(
  value: unknown,
): value is { props?: unknown; type: string } & Record<string, unknown> {
  return isPlainRecord(value) && typeof value.type === "string";
}
