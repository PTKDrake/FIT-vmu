import * as LucideIcons from "lucide-react";
import type { ComponentType } from "react";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { SiZalo } from "react-icons/si";
import { twMerge } from "tailwind-merge";
import { Link } from "@/components/ui/link";
import { getPuckBlockDomId } from "./shared";
import { getSurfaceClassName, puckSurfaceFields } from "./surface";
import type { PageBuilderComponentConfig } from "./types";

type SocialPlatform =
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

interface SocialLinkItem {
  platform: SocialPlatform;
  url: string;
  label?: string;
}

type IconComponent = ComponentType<{ className?: string }>;

const PLATFORM_ICON_MAP: Record<SocialPlatform, IconComponent> = {
  facebook: FaFacebook,
  youtube: FaYoutube,
  linkedin: FaLinkedin,
  twitter: FaXTwitter,
  instagram: FaInstagram,
  github: FaGithub,
  tiktok: FaTiktok,
  zalo: SiZalo,
  email: LucideIcons.Mail,
  phone: LucideIcons.Phone,
  website: LucideIcons.Globe,
};

const PLATFORM_LABEL_MAP: Record<SocialPlatform, string> = {
  facebook: "Facebook",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  twitter: "X (Twitter)",
  instagram: "Instagram",
  github: "GitHub",
  tiktok: "TikTok",
  zalo: "Zalo",
  email: "Email",
  phone: "Điện thoại",
  website: "Website",
};

function PlatformIcon({
  platform,
  className,
}: {
  platform: SocialPlatform;
  className?: string;
}) {
  const IconComponent = PLATFORM_ICON_MAP[platform] || LucideIcons.Link;

  return <IconComponent className={className} />;
}

export const SocialLinksComponentConfig: PageBuilderComponentConfig<"SocialLinks"> =
  {
    label: "Liên kết mạng xã hội",
    defaultProps: {
      links: [
        { platform: "facebook", url: "https://facebook.com", label: "" },
        { platform: "youtube", url: "https://youtube.com", label: "" },
        { platform: "email", url: "mailto:fit@vimaru.edu.vn", label: "" },
      ],
      layout: "horizontal",
      iconSize: "md",
      showLabels: false,
      surfaceTone: "transparent",
      surfaceBorder: "none",
      surfaceRadius: "none",
      surfacePadding: "none",
      surfaceShadow: "none",
      className: "",
    },
    fields: {
      ...puckSurfaceFields,
      links: {
        type: "array",
        label: "Danh sách liên kết",
        getItemSummary: (item: SocialLinkItem) =>
          PLATFORM_LABEL_MAP[item.platform] || item.platform,
        arrayFields: {
          platform: {
            type: "select",
            label: "Nền tảng",
            options: [
              { label: "Facebook", value: "facebook" },
              { label: "YouTube", value: "youtube" },
              { label: "LinkedIn", value: "linkedin" },
              { label: "X (Twitter)", value: "twitter" },
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
      layout: {
        type: "select",
        label: "Bố cục",
        options: [
          { label: "Ngang", value: "horizontal" },
          { label: "Dọc", value: "vertical" },
        ],
      },
      iconSize: {
        type: "select",
        label: "Kích thước biểu tượng",
        options: [
          { label: "Nhỏ", value: "sm" },
          { label: "Vừa", value: "md" },
          { label: "Lớn", value: "lg" },
        ],
      },
      showLabels: {
        type: "radio",
        label: "Hiển thị tên nền tảng",
        options: [
          { label: "Có", value: true },
          { label: "Không", value: false },
        ],
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => {
      const {
        links,
        layout,
        iconSize,
        showLabels,
        surfaceTone,
        surfaceBorder,
        surfaceRadius,
        surfacePadding,
        surfaceShadow,
        className,
      } = props;
      const id = getPuckBlockDomId(props.id);

      const iconSizeClass = {
        sm: "size-4",
        md: "size-5",
        lg: "size-6",
      }[iconSize || "md"];

      const containerSizeClass = {
        sm: "size-8",
        md: "size-10",
        lg: "size-12",
      }[iconSize || "md"];

      const layoutClass =
        layout === "vertical"
          ? "flex flex-col gap-2"
          : "flex flex-wrap items-center gap-3";

      return (
        <div
          id={id}
          className={twMerge(
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
          <div className={layoutClass}>
            {links.map((link, index) => {
              const displayLabel =
                link.label || PLATFORM_LABEL_MAP[link.platform] || "";
              const href = link.url || "#";

              return (
                <Link
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={twMerge(
                    "inline-flex items-center gap-2 rounded-full text-muted-fg transition duration-200 hover:text-primary hover:bg-primary/10",
                    showLabels
                      ? "px-3 py-1.5 text-sm font-medium"
                      : `${containerSizeClass} justify-center`,
                  )}
                  aria-label={displayLabel}
                >
                  <PlatformIcon
                    platform={link.platform}
                    className={iconSizeClass}
                  />
                  {showLabels && <span>{displayLabel}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      );
    },
  };

export const NewsletterFormComponentConfig: PageBuilderComponentConfig<"NewsletterForm"> =
  {
    label: "Form đăng ký nhận tin",
    defaultProps: {
      title: "Đăng ký nhận tin",
      description: "Đăng ký để nhận thông tin mới nhất từ chúng tôi",
      placeholder: "Nhập email của bạn",
      buttonLabel: "Đăng ký",
      actionUrl: "#",
      layout: "inline",
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
      description: { type: "text", label: "Mô tả" },
      placeholder: { type: "text", label: "Chữ giữ chỗ (input)" },
      buttonLabel: { type: "text", label: "Nhãn nút gửi" },
      actionUrl: { type: "text", label: "Đường dẫn xử lý" },
      layout: {
        type: "select",
        label: "Bố cục",
        options: [
          { label: "Ngang (input + nút cùng hàng)", value: "inline" },
          { label: "Dọc (input trên, nút dưới)", value: "stacked" },
        ],
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => {
      const {
        title,
        description,
        placeholder,
        buttonLabel,
        actionUrl,
        layout,
        surfaceTone,
        surfaceBorder,
        surfaceRadius,
        surfacePadding,
        surfaceShadow,
        className,
      } = props;
      const id = getPuckBlockDomId(props.id);

      return (
        <div
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
          {title && <h3 className="text-lg font-bold text-fg">{title}</h3>}
          {description && (
            <p className="text-sm text-muted-fg">{description}</p>
          )}
          <form
            action={actionUrl || "#"}
            method="POST"
            className={twMerge(
              "w-full",
              layout === "inline"
                ? "flex flex-col sm:flex-row gap-0"
                : "flex flex-col gap-3",
            )}
          >
            <input
              type="email"
              placeholder={placeholder || "Nhập email của bạn"}
              className={twMerge(
                "flex-1 px-4 py-2.5 text-sm bg-bg text-fg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50",
                layout === "inline"
                  ? "rounded-l-lg rounded-r-none sm:rounded-r-none"
                  : "rounded-lg",
              )}
            />
            <button
              type="submit"
              className={twMerge(
                "bg-primary text-primary-fg font-semibold px-6 py-2.5 text-sm transition hover:bg-primary/90 shrink-0",
                layout === "inline"
                  ? "rounded-r-lg rounded-l-none sm:rounded-l-none"
                  : "rounded-lg",
              )}
            >
              {buttonLabel || "Đăng ký"}
            </button>
          </form>
        </div>
      );
    },
  };

export const CopyrightBarComponentConfig: PageBuilderComponentConfig<"CopyrightBar"> =
  {
    label: "Thanh bản quyền",
    defaultProps: {
      text: "© {year} Faculty of Information Technology, VMU. All rights reserved.",
      links: [
        { label: "Chính sách bảo mật", url: "#" },
        { label: "Điều khoản sử dụng", url: "#" },
      ],
      surfaceTone: "transparent",
      surfaceBorder: "none",
      surfaceRadius: "none",
      surfacePadding: "md",
      surfaceShadow: "none",
      className: "",
    },
    fields: {
      ...puckSurfaceFields,
      text: {
        type: "text",
        label: "Văn bản bản quyền (dùng {year} cho năm hiện tại)",
      },
      links: {
        type: "array",
        label: "Liên kết phụ",
        getItemSummary: (item: { label: string }) => item.label || "Liên kết",
        arrayFields: {
          label: { type: "text", label: "Nhãn" },
          url: { type: "text", label: "Đường dẫn" },
        },
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => {
      const {
        text,
        links,
        surfaceTone,
        surfaceBorder,
        surfaceRadius,
        surfacePadding,
        surfaceShadow,
        className,
      } = props;
      const id = getPuckBlockDomId(props.id);
      const currentYear = new Date().getFullYear();
      const copyrightText = (text || "").replace("{year}", String(currentYear));

      return (
        <div
          id={id}
          className={twMerge(
            "text-center",
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
          {links && links.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mb-3">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || "#"}
                  className="text-xs text-muted-fg hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-fg">{copyrightText}</p>
        </div>
      );
    },
  };
