import {
  BookOpen,
  ChevronRight,
  CircleHelp,
  Globe,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import type { ComponentType, CSSProperties, ReactNode } from "react";
import {
  SiFacebook,
  SiGithub,
  SiInstagram,
  SiTiktok,
  SiX,
  SiYoutube,
  SiZalo,
} from "react-icons/si";
import { twMerge } from "tailwind-merge";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { getPuckImageUrl } from "@/lib/puck/media";
import type { PuckImageValue } from "@/lib/puck/media";
import { getPuckBlockDomId, isPuckEditorPreview } from "../shared";
import { getSurfaceClassName, puckSurfaceFields } from "../surface";
import type { PageBuilderComponentConfig } from "../types";
import {
  EmptyDynamicState,
  buildNavigationMenuFieldOptions,
  getBlockLayoutPresetClass,
  getResponsiveMaxWidthClass,
  getResponsivePositionClass,
  getResponsiveTextAlignClass,
  parseOptionalId,
  usePuckDynamicData,
} from "./shared";
import type { PuckDynamicNavigationItem } from "./shared";

type FitFooterSupportIcon = "users" | "mail" | "book" | "help" | "globe";

type FitFooterSocialPlatform =
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

interface FitFooterSupportLink {
  icon?: FitFooterSupportIcon;
  label: string;
  url: string;
}

interface FitFooterSocialLink {
  label?: string;
  platform: FitFooterSocialPlatform;
  url: string;
}

interface FitFooterLegalLink {
  label: string;
  url: string;
}

interface FitFooterBlockProps {
  address?: string;
  className?: string;
  contactTitle?: string;
  copyrightText?: string;
  description?: string;
  email?: string;
  id?: string;
  legalLinks?: FitFooterLegalLink[];
  logoAlt?: string;
  logoUrl?: PuckImageValue;
  organizationName?: string;
  phone?: string;
  quickLinksMenuId?: string;
  quickLinksTitle?: string;
  showBrand?: boolean;
  showContact?: boolean;
  showCopyright?: boolean;
  showLegalLinks?: boolean;
  showQuickLinks?: boolean;
  showSocialLinks?: boolean;
  showSupportLinks?: boolean;
  siteName?: string;
  socialLinks?: FitFooterSocialLink[];
  socialTitle?: string;
  supportLinks?: FitFooterSupportLink[];
  supportTitle?: string;
}

type FitFooterFields = NonNullable<
  PageBuilderComponentConfig<"FitFooter">["fields"]
>;

const fitFooterToggleFields = {
  showBrand: {
    type: "radio",
    label: "Hiển thị thương hiệu",
    options: [
      { label: "Có", value: true },
      { label: "Không", value: false },
    ],
  },
  showContact: {
    type: "radio",
    label: "Hiển thị liên hệ",
    options: [
      { label: "Có", value: true },
      { label: "Không", value: false },
    ],
  },
  showQuickLinks: {
    type: "radio",
    label: "Hiển thị liên kết nhanh",
    options: [
      { label: "Có", value: true },
      { label: "Không", value: false },
    ],
  },
  showSupportLinks: {
    type: "radio",
    label: "Hiển thị hỗ trợ",
    options: [
      { label: "Có", value: true },
      { label: "Không", value: false },
    ],
  },
  showSocialLinks: {
    type: "radio",
    label: "Hiển thị mạng xã hội",
    options: [
      { label: "Có", value: true },
      { label: "Không", value: false },
    ],
  },
  showCopyright: {
    type: "radio",
    label: "Hiển thị bản quyền",
    options: [
      { label: "Có", value: true },
      { label: "Không", value: false },
    ],
  },
  showLegalLinks: {
    type: "radio",
    label: "Hiển thị liên kết pháp lý",
    options: [
      { label: "Có", value: true },
      { label: "Không", value: false },
    ],
  },
} satisfies Partial<FitFooterFields>;

const fitFooterBrandFields = {
  logoUrl: { type: "text", label: "Logo" },
  logoAlt: { type: "text", label: "Mô tả logo" },
  siteName: { type: "text", label: "Tên hiển thị" },
  organizationName: { type: "text", label: "Tên đơn vị / trường" },
  description: { type: "textarea", label: "Mô tả ngắn" },
} satisfies Partial<FitFooterFields>;

const fitFooterContactFields = {
  contactTitle: { type: "text", label: "Tiêu đề liên hệ" },
  address: { type: "textarea", label: "Địa chỉ" },
  phone: { type: "text", label: "Số điện thoại" },
  email: { type: "text", label: "Email" },
} satisfies Partial<FitFooterFields>;

const fitFooterQuickLinkFields = {
  quickLinksTitle: { type: "text", label: "Tiêu đề liên kết nhanh" },
  quickLinksMenuId: {
    type: "select",
    label: "Menu liên kết nhanh",
    options: [{ label: "Chưa chọn menu điều hướng", value: "" }],
  },
} satisfies Partial<FitFooterFields>;

const fitFooterSupportFields = {
  supportTitle: { type: "text", label: "Tiêu đề hỗ trợ" },
  supportLinks: {
    type: "array",
    label: "Danh sách hỗ trợ",
    getItemSummary: (item: FitFooterSupportLink) => item.label || "Liên kết",
    arrayFields: {
      label: { type: "text", label: "Nhãn" },
      url: { type: "text", label: "URL" },
      icon: {
        type: "select",
        label: "Biểu tượng",
        options: [
          { label: "Sinh viên", value: "users" },
          { label: "Email", value: "mail" },
          { label: "Thư viện", value: "book" },
          { label: "Hướng dẫn", value: "help" },
          { label: "Website", value: "globe" },
        ],
      },
    },
  },
} satisfies Partial<FitFooterFields>;

const fitFooterSocialFields = {
  socialTitle: { type: "text", label: "Tiêu đề mạng xã hội" },
  socialLinks: {
    type: "array",
    label: "Danh sách mạng xã hội",
    getItemSummary: (item: FitFooterSocialLink) =>
      item.label || fitFooterSocialLabelMap[item.platform] || item.platform,
    arrayFields: {
      platform: {
        type: "select",
        label: "Nền tảng",
        options: [
          { label: "Facebook", value: "facebook" },
          { label: "YouTube", value: "youtube" },
          { label: "X (Twitter)", value: "x" },
          { label: "Instagram", value: "instagram" },
          { label: "GitHub", value: "github" },
          { label: "TikTok", value: "tiktok" },
          { label: "Zalo", value: "zalo" },
          { label: "Email", value: "email" },
          { label: "Điện thoại", value: "phone" },
          { label: "Website", value: "website" },
        ],
      },
      url: { type: "text", label: "Đường dẫn" },
      label: { type: "text", label: "Nhãn (tùy chọn)" },
    },
  },
} satisfies Partial<FitFooterFields>;

const fitFooterCopyrightFields = {
  copyrightText: { type: "textarea", label: "Nội dung bản quyền" },
} satisfies Partial<FitFooterFields>;

const fitFooterLegalFields = {
  legalLinks: {
    type: "array",
    label: "Liên kết pháp lý",
    getItemSummary: (item: FitFooterLegalLink) => item.label || "Liên kết",
    arrayFields: {
      label: { type: "text", label: "Nhãn" },
      url: { type: "text", label: "URL" },
    },
  },
} satisfies Partial<FitFooterFields>;

const fitFooterSupportIconMap = {
  users: Users,
  mail: Mail,
  book: BookOpen,
  help: CircleHelp,
  globe: Globe,
} satisfies Record<FitFooterSupportIcon, typeof Users>;

const fitFooterSocialIconMap = {
  facebook: SiFacebook,
  youtube: SiYoutube,
  x: SiX,
  instagram: SiInstagram,
  github: SiGithub,
  tiktok: SiTiktok,
  zalo: SiZalo,
  email: Mail,
  phone: Phone,
  website: Globe,
} satisfies Record<
  FitFooterSocialPlatform,
  ComponentType<{ className?: string }>
>;

export const SOCIAL_COLORS = {
  facebook: "#1877F2",
  youtube: "#FF0000",
  x: "#000000",
  instagram: "#E4405F",
  github: "#181717",
  tiktok: "#000000",
  zalo: "#0068FF",
  email: "#EA4335",
  phone: "#22C55E",
  website: "#3B82F6",
} as const;

const fitFooterSocialLabelMap: Record<FitFooterSocialPlatform, string> = {
  facebook: "Facebook",
  youtube: "YouTube",
  x: "X (Twitter)",
  instagram: "Instagram",
  github: "GitHub",
  tiktok: "TikTok",
  zalo: "Zalo",
  email: "Email",
  phone: "Điện thoại",
  website: "Website",
};

function FitFooterBlock(props: FitFooterBlockProps) {
  const {
    address,
    contactTitle = "Thông tin liên hệ",
    copyrightText = "© {year} Khoa CNTT - Trường Đại học Hàng hải Việt Nam. All rights reserved.",
    description = "Khoa CNTT tiên phong trong đào tạo gắn thực tiễn, phát triển năng lực công nghệ, nghiên cứu ứng dụng và kết nối doanh nghiệp.",
    email,
    legalLinks = [],
    logoAlt,
    logoUrl,
    organizationName = "Trường Đại học Hàng hải Việt Nam",
    phone,
    quickLinksMenuId,
    quickLinksTitle = "Liên kết nhanh",
    showBrand = true,
    showContact = true,
    showCopyright = true,
    showLegalLinks = true,
    showQuickLinks = true,
    showSocialLinks = true,
    showSupportLinks = true,
    siteName = "Khoa CNTT",
    socialLinks = [],
    socialTitle = "Kết nối với chúng tôi",
    supportLinks = [],
    supportTitle = "Hỗ trợ",
  } = props;
  const id = getPuckBlockDomId(props.id);
  const navigationMenus = usePuckDynamicData().navigationMenus;
  const selectedMenuId = parseOptionalId(quickLinksMenuId);
  const preview = isPuckEditorPreview();
  const quickLinksMenu =
    navigationMenus.find((navigationMenu) =>
      selectedMenuId ? navigationMenu.id === selectedMenuId : true,
    ) ?? (preview ? (navigationMenus[0] ?? null) : null);
  const quickLinks = quickLinksMenu?.items ?? [];
  const resolvedCopyright = copyrightText.replace(
    /\{year\}/g,
    new Date().getFullYear().toString(),
  );
  const hasBottomRow =
    (showCopyright && resolvedCopyright.trim() !== "") ||
    (showLegalLinks && legalLinks.length > 0);

  return (
    <div
      className="mx-auto w-full rounded-3xl border border-sidebar-border/60 bg-sidebar px-6 py-8 text-sidebar-fg shadow-2xl shadow-fg/10 sm:px-8 lg:px-10 lg:py-12"
      data-vmu-puck-block="fit-footer"
      id={id}
    >
      <div className="grid gap-10 lg:grid-cols-[1.35fr_1.4fr_1fr_1.25fr_1.15fr] lg:gap-9">
        {showBrand ? (
          <FitFooterBrand
            description={description}
            logoAlt={logoAlt}
            logoUrl={getPuckImageUrl(logoUrl)}
            organizationName={organizationName}
            siteName={siteName}
          />
        ) : null}

        {showContact ? (
          <FitFooterContact
            address={address}
            email={email}
            phone={phone}
            title={contactTitle}
          />
        ) : null}

        {showQuickLinks ? (
          <FitFooterQuickLinks
            isEditorPreview={preview}
            items={quickLinks}
            title={quickLinksTitle}
          />
        ) : null}

        {showSupportLinks ? (
          <FitFooterSupport links={supportLinks} title={supportTitle} />
        ) : null}

        {showSocialLinks ? (
          <FitFooterSocial links={socialLinks} title={socialTitle} />
        ) : null}
      </div>

      {hasBottomRow ? (
        <div className="mt-10 flex flex-col gap-5 border-t border-sidebar-border/70 pt-6 text-sm text-sidebar-fg/70 lg:flex-row lg:items-center lg:justify-between">
          {showCopyright && resolvedCopyright.trim() !== "" ? (
            <p className="max-w-2xl text-center leading-7 lg:text-left">
              {resolvedCopyright}
            </p>
          ) : (
            <span />
          )}

          {showLegalLinks && legalLinks.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-end">
              {legalLinks.map((link) => (
                <Link
                  className="text-sidebar-fg/75 transition [--text:var(--color-sidebar-fg)] hover:text-primary"
                  href={link.url || "#"}
                  key={`${link.label}-${link.url}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function FitFooterBrand({
  description,
  logoAlt,
  logoUrl,
  organizationName,
  siteName,
}: {
  description?: string;
  logoAlt?: string;
  logoUrl?: string;
  organizationName: string;
  siteName: string;
}) {
  return (
    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
      <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
        {logoUrl ? (
          <img
            alt={logoAlt || siteName}
            className="size-24 rounded-full bg-bg object-contain p-3 shadow-lg shadow-fg/10 lg:size-20 lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none"
            src={logoUrl}
          />
        ) : (
          <span className="flex size-24 items-center justify-center rounded-full bg-bg text-xl font-extrabold text-primary lg:size-20 lg:rounded-2xl">
            FIT
          </span>
        )}

        <div className="min-w-0">
          <h2 className="text-2xl font-extrabold tracking-normal text-sidebar-fg uppercase lg:text-lg">
            {siteName}
          </h2>
          <p className="mt-1 text-lg font-medium leading-7 text-sidebar-fg/90 lg:text-base lg:leading-6">
            {organizationName}
          </p>
        </div>
      </div>

      {description ? (
        <>
          <div className="mt-7 h-1 w-16 rounded-full bg-primary" />
          <p className="mt-6 max-w-md text-lg leading-8 text-sidebar-fg/75 lg:text-base lg:leading-7">
            {description}
          </p>
        </>
      ) : null}
    </div>
  );
}

function FitFooterContact({
  address,
  email,
  phone,
  title,
}: {
  address?: string;
  email?: string;
  phone?: string;
  title: string;
}) {
  const items = [
    { icon: MapPin, label: address },
    { icon: Phone, label: phone },
    { icon: Mail, label: email },
  ].filter((item) => item.label);

  if (items.length === 0) {
    return null;
  }

  return (
    <FitFooterColumn icon={MapPin} title={title}>
      <div className="space-y-5">
        {items.map((item) => {
          const IconComponent = item.icon;

          return (
            <div
              className="flex items-start gap-4 border-sidebar-border/65 pb-5 last:pb-0 lg:border-b lg:last:border-b-0"
              key={`${title}-${item.label}`}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary lg:size-9">
                <IconComponent className="size-6 lg:size-5" />
              </span>
              <p className="pt-2 text-lg leading-8 text-sidebar-fg lg:pt-1 lg:text-sm lg:leading-6">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </FitFooterColumn>
  );
}

function FitFooterQuickLinks({
  isEditorPreview,
  items,
  title,
}: {
  isEditorPreview: boolean;
  items: PuckDynamicNavigationItem[];
  title: string;
}) {
  if (items.length === 0) {
    if (!isEditorPreview) {
      return null;
    }

    return (
      <FitFooterColumn icon={LinkIcon} title={title}>
        <div className="rounded-2xl border border-dashed border-sidebar-border/70 p-4 text-sm text-sidebar-fg/60">
          Chưa chọn menu điều hướng hoặc menu chưa có liên kết.
        </div>
      </FitFooterColumn>
    );
  }

  return (
    <FitFooterColumn icon={LinkIcon} title={title}>
      <div className="divide-y divide-sidebar-border/65">
        {items.map((item) => (
          <Link
            className="flex min-h-12 items-center justify-between gap-3 py-3 text-lg font-medium text-sidebar-fg [--text:var(--color-sidebar-fg)] transition hover:text-primary lg:text-sm"
            href={item.url}
            key={item.id}
            target={item.target === "_blank" ? "_blank" : undefined}
          >
            <span>{item.title}</span>
            <ChevronRight className="size-5 shrink-0 text-primary" />
          </Link>
        ))}
      </div>
    </FitFooterColumn>
  );
}

function FitFooterSupport({
  links,
  title,
}: {
  links: FitFooterSupportLink[];
  title: string;
}) {
  if (links.length === 0) {
    return null;
  }

  return (
    <FitFooterColumn icon={CircleHelp} title={title}>
      <div className="space-y-3">
        {links.map((link) => {
          const IconComponent = fitFooterSupportIconMap[link.icon || "help"];

          return (
            <Link
              className="flex min-h-12 items-center gap-4 border-b border-sidebar-border/65 py-3 text-lg text-sidebar-fg [--text:var(--color-sidebar-fg)] transition last:border-b-0 hover:text-primary lg:text-sm"
              href={link.url || "#"}
              key={`${link.label}-${link.url}`}
            >
              <IconComponent className="size-6 shrink-0 text-primary lg:size-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </FitFooterColumn>
  );
}

function FitFooterSocial({
  links,
  title,
}: {
  links: FitFooterSocialLink[];
  title: string;
}) {
  if (links.length === 0) {
    return null;
  }

  return (
    <FitFooterColumn icon={Users} title={title}>
      <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
        {links.map((link) => {
          const IconComponent = fitFooterSocialIconMap[link.platform];
          const label =
            link.label ||
            fitFooterSocialLabelMap[link.platform] ||
            link.platform;

          return (
            <Link
              aria-label={label}
              className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-(--fit-footer-social-color) [--text:var(--fit-footer-social-color)] transition hover:bg-(--fit-footer-social-color) hover:text-primary-fg hover:[--text:var(--color-primary-fg)] lg:size-9"
              href={link.url || "#"}
              key={`${link.platform}-${link.url}-${label}`}
              rel="noopener noreferrer"
              style={
                {
                  "--fit-footer-social-color": SOCIAL_COLORS[link.platform],
                } as CSSProperties
              }
              target="_blank"
            >
              <IconComponent className="size-6 lg:size-5" />
            </Link>
          );
        })}
      </div>
    </FitFooterColumn>
  );
}

function FitFooterColumn({
  children,
  icon: IconComponent,
  title,
}: {
  children: ReactNode;
  icon: ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <div className="min-w-0 space-y-5">
      <div className="flex items-center justify-center gap-3 lg:justify-start">
        <IconComponent className="size-6 shrink-0 text-primary lg:hidden" />
        <h3 className="text-2xl font-extrabold tracking-normal text-sidebar-fg uppercase lg:text-base">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

export const FitFooterComponentConfig: PageBuilderComponentConfig<"FitFooter"> =
  {
    label: "Footer FIT",
    defaultProps: {
      showBrand: true,
      showContact: true,
      showQuickLinks: true,
      showSupportLinks: true,
      showSocialLinks: true,
      showCopyright: true,
      showLegalLinks: true,
      logoUrl: "/logo.png",
      logoAlt: "Logo Khoa CNTT",
      siteName: "Khoa CNTT",
      organizationName: "Trường Đại học Hàng hải Việt Nam",
      description:
        "Khoa CNTT tiên phong trong đào tạo gắn thực tiễn, phát triển năng lực công nghệ, nghiên cứu ứng dụng và kết nối doanh nghiệp.",
      contactTitle: "Thông tin liên hệ",
      address: "Phòng 301, Nhà A3, 484 Lạch Tray, Ngô Quyền, Hải Phòng",
      phone: "0225 3783 138",
      email: "fit@vimaru.edu.vn",
      quickLinksTitle: "Liên kết nhanh",
      quickLinksMenuId: "",
      supportTitle: "Hỗ trợ",
      supportLinks: [
        {
          label: "Cổng thông tin sinh viên",
          url: "#",
          icon: "users",
        },
        {
          label: "Email sinh viên",
          url: "mailto:fit@vimaru.edu.vn",
          icon: "mail",
        },
        {
          label: "Thư viện số",
          url: "#",
          icon: "book",
        },
        {
          label: "Hướng dẫn",
          url: "#",
          icon: "help",
        },
      ],
      socialTitle: "Kết nối với chúng tôi",
      socialLinks: [
        { platform: "facebook", url: "https://facebook.com", label: "" },
        { platform: "youtube", url: "https://youtube.com", label: "" },
        { platform: "email", url: "mailto:fit@vimaru.edu.vn", label: "" },
      ],
      copyrightText:
        "© {year} Khoa CNTT - Trường Đại học Hàng hải Việt Nam. All rights reserved.",
      legalLinks: [
        { label: "Chính sách bảo mật", url: "#" },
        { label: "Điều khoản sử dụng", url: "#" },
        { label: "Sơ đồ website", url: "#" },
      ],
      className: "",
    },
    fields: {
      ...fitFooterToggleFields,
      ...fitFooterBrandFields,
      ...fitFooterContactFields,
      ...fitFooterQuickLinkFields,
      ...fitFooterSupportFields,
      ...fitFooterSocialFields,
      ...fitFooterCopyrightFields,
      ...fitFooterLegalFields,
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    resolveFields: async (data, { fields, lastFields }) => {
      const resolvedFields = {
        ...fitFooterToggleFields,
      } as NonNullable<PageBuilderComponentConfig<"FitFooter">["fields"]>;
      const props = data.props;

      if (props.showBrand) {
        Object.assign(resolvedFields, {
          logoUrl: fields.logoUrl,
          logoAlt: fields.logoAlt,
          siteName: fields.siteName,
          organizationName: fields.organizationName,
          description: fields.description,
        });
      }

      if (props.showContact) {
        Object.assign(resolvedFields, fitFooterContactFields);
      }

      if (props.showQuickLinks) {
        const lastMenuField = lastFields.quickLinksMenuId;
        let quickLinksMenuField = fields.quickLinksMenuId;

        if (
          lastMenuField &&
          "options" in lastMenuField &&
          Array.isArray(lastMenuField.options) &&
          lastMenuField.options.length > 1
        ) {
          quickLinksMenuField = lastMenuField;
        } else {
          const options = await buildNavigationMenuFieldOptions(
            "Chưa chọn menu điều hướng",
          );

          if (options !== null) {
            quickLinksMenuField = {
              type: "select",
              label: "Menu liên kết nhanh",
              options,
            };
          }
        }

        Object.assign(resolvedFields, {
          quickLinksTitle: fields.quickLinksTitle,
          quickLinksMenuId: quickLinksMenuField,
        });
      }

      if (props.showSupportLinks) {
        Object.assign(resolvedFields, fitFooterSupportFields);
      }

      if (props.showSocialLinks) {
        Object.assign(resolvedFields, fitFooterSocialFields);
      }

      if (props.showCopyright) {
        Object.assign(resolvedFields, fitFooterCopyrightFields);
      }

      if (props.showLegalLinks) {
        Object.assign(resolvedFields, fitFooterLegalFields);
      }

      resolvedFields.className = fields.className;

      return resolvedFields;
    },
    render: (props) => <FitFooterBlock {...props} />,
  };

export const LinkListComponentConfig: PageBuilderComponentConfig<"LinkList"> = {
  label: "Danh sách link tùy chỉnh",
  defaultProps: {
    title: "Liên kết nhanh",
    links: [
      {
        label: "Website VMU",
        url: "https://vimaru.edu.vn",
        openInNewTab: true,
      },
    ],
    surfaceTone: "transparent",
    surfaceBorder: "none",
    surfaceRadius: "none",
    surfacePadding: "none",
    surfaceShadow: "none",
    className: "",
  },
  fields: {
    ...puckSurfaceFields,
    title: { type: "text", label: "Tiêu đề khối" },
    links: {
      type: "array",
      label: "Danh sách link",
      arrayFields: {
        label: { type: "text", label: "Nhãn" },
        url: { type: "text", label: "URL" },
        openInNewTab: {
          type: "radio",
          label: "Mở tab mới",
          options: [
            { label: "Có", value: true },
            { label: "Không", value: false },
          ],
        },
      },
    },
    className: { type: "text", label: "Lớp CSS bổ sung" },
  },
  render: (props) => {
    const {
      title,
      links,
      surfaceTone,
      surfaceBorder,
      surfaceRadius,
      surfacePadding,
      surfaceShadow,
      className,
    } = props;
    const id = getPuckBlockDomId((props as { id?: string }).id);

    return (
      <section
        id={id}
        className={twMerge(
          "space-y-3",
          getSurfaceClassName(
            {
              surfaceTone,
              surfaceBorder,
              surfaceRadius,
              surfacePadding,
              surfaceShadow,
            },
            "",
          ),
          className,
        )}
      >
        <Heading level={3} className="text-base font-bold text-fg">
          {title}
        </Heading>
        <div className="grid gap-2">
          {(links ?? []).map((link, index) => (
            <Link
              className="text-sm font-semibold text-muted-fg hover:text-fg"
              href={link.url || "#"}
              key={`${link.label}-${index}`}
              target={link.openInNewTab ? "_blank" : undefined}
            >
              {link.label || link.url}
            </Link>
          ))}
        </div>
      </section>
    );
  },
};

export const ContactInfoComponentConfig: PageBuilderComponentConfig<"ContactInfo"> =
  {
    label: "Thông tin liên hệ",
    defaultProps: {
      title: "Liên hệ",
      address: "",
      phone: "",
      email: "",
      layoutPreset: "default",
      maxWidth: "default",
      textAlign: "left",
      textAlignFromLg: "inherit",
      positionFromLg: "inherit",
      surfaceTone: "transparent",
      surfaceBorder: "none",
      surfaceRadius: "none",
      surfacePadding: "none",
      surfaceShadow: "none",
      className: "",
    },
    fields: {
      ...puckSurfaceFields,
      title: { type: "text", label: "Tiêu đề" },
      address: { type: "textarea", label: "Địa chỉ" },
      phone: { type: "text", label: "Số điện thoại" },
      email: { type: "text", label: "Email" },
      layoutPreset: {
        type: "select",
        label: "Bố cục sẵn",
        options: [
          { label: "Mặc định", value: "default" },
          { label: "Khối liên hệ footer", value: "footerContact" },
        ],
      },
      maxWidth: {
        type: "select",
        label: "Chiều rộng tối đa",
        options: [
          { label: "Mặc định", value: "default" },
          { label: "Nhỏ (sm)", value: "sm" },
        ],
      },
      textAlign: {
        type: "select",
        label: "Canh chữ trên mobile",
        options: [
          { label: "Trái", value: "left" },
          { label: "Giữa", value: "center" },
          { label: "Phải", value: "right" },
        ],
      },
      textAlignFromLg: {
        type: "select",
        label: "Canh chữ từ desktop",
        options: [
          { label: "Giữ như mobile", value: "inherit" },
          { label: "Trái", value: "left" },
          { label: "Giữa", value: "center" },
          { label: "Phải", value: "right" },
        ],
      },
      positionFromLg: {
        type: "select",
        label: "Vị trí khối từ desktop",
        options: [
          { label: "Giữ mặc định", value: "inherit" },
          { label: "Bám trái", value: "start" },
          { label: "Giữa", value: "center" },
          { label: "Bám phải", value: "end" },
        ],
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => {
      const {
        title,
        address,
        phone,
        email,
        layoutPreset,
        maxWidth,
        textAlign,
        textAlignFromLg,
        positionFromLg,
        surfaceTone,
        surfaceBorder,
        surfaceRadius,
        surfacePadding,
        surfaceShadow,
        className,
      } = props;
      const id = getPuckBlockDomId((props as { id?: string }).id);
      const layoutClassName = twMerge(
        getBlockLayoutPresetClass(layoutPreset),
        getResponsiveMaxWidthClass(maxWidth),
        getResponsiveTextAlignClass(textAlign),
        textAlignFromLg === "inherit"
          ? ""
          : getResponsiveTextAlignClass(textAlignFromLg, "lg"),
        positionFromLg === "inherit"
          ? ""
          : getResponsivePositionClass(positionFromLg, "lg"),
      );

      return (
        <section
          id={id}
          className={twMerge(
            "space-y-3 text-sm",
            getSurfaceClassName(
              {
                surfaceTone,
                surfaceBorder,
                surfaceRadius,
                surfacePadding,
                surfaceShadow,
              },
              "",
            ),
            layoutClassName,
            className,
          )}
        >
          <Heading level={3} className="text-base font-bold text-fg">
            {title}
          </Heading>
          <div className="space-y-2 text-muted-fg">
            {address ? <p className="whitespace-pre-line">{address}</p> : null}
            {phone ? <p>Điện thoại: {phone}</p> : null}
            {email ? (
              <p>
                Email:{" "}
                <Link className="text-primary" href={`mailto:${email}`}>
                  {email}
                </Link>
              </p>
            ) : null}
          </div>
        </section>
      );
    },
  };
