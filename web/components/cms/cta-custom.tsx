"use client";

import {
  AcademicCapIcon,
  PhoneIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { getPuckImageUrl } from "@/lib/puck/media";
import type { PuckImageValue } from "@/lib/puck/media";

export interface TrustItem {
  icon?: string;
  label?: string;
}

export interface CtaCustomProps {
  logoUrl?: PuckImageValue;
  logoAlt?: string;
  siteName?: string;
  organizationName?: string;
  badge?: string;
  title?: string;
  highlightWords?: string;
  description?: string;
  imageUrl?: PuckImageValue;
  primaryActionLabel?: string;
  primaryActionHref?: string;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  trustItems?: TrustItem[];
  className?: string;
}

const TrustIconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Shield: ShieldCheckIcon,
  Users: UsersIcon,
  TrendingUp: ArrowTrendingUpIcon,
};

export function CtaCustom({
  logoUrl,
  logoAlt = "Logo FIT",
  siteName = "Khoa CNTT",
  organizationName = "Trường Đại học Hàng hải Việt Nam",
  badge = "Tuyển sinh 2025",
  title = "Khám phá chương trình đào tạo – Kiến tạo tương lai số cùng Khoa CNTT",
  highlightWords = "tương lai số, Khoa CNTT",
  description = "Tham gia Khoa CNTT – Trường Đại học Hàng hải Việt Nam để học tập trong môi trường hiện đại, sáng tạo và kiến tạo sự nghiệp vững chắc trong thời đại số.",
  imageUrl,
  primaryActionLabel = "Tìm hiểu tuyển sinh",
  primaryActionHref = "#",
  secondaryActionLabel = "Liên hệ tư vấn",
  secondaryActionHref = "#",
  trustItems = [
    { icon: "Shield", label: "Đào tạo chất lượng chuẩn quốc tế" },
    { icon: "Users", label: "Đội ngũ giảng viên giàu kinh nghiệm" },
    { icon: "TrendingUp", label: "Cơ hội việc làm rộng mở" },
  ],
  className,
}: CtaCustomProps) {
  const resolvedLogoUrl = getPuckImageUrl(logoUrl) || "/logo.png";
  const resolvedImageUrl = getPuckImageUrl(imageUrl);

  // Helper to parse and highlight specific words
  const renderHighlightedTitle = () => {
    if (!title) return "";
    if (!highlightWords) return title;

    const keywords = highlightWords
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean);

    if (keywords.length === 0) return title;

    // Escape regex characters
    const escapedKeywords = keywords.map((k) =>
      k.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"),
    );
    const pattern = `(${escapedKeywords.join("|")})`;
    const regex = new RegExp(pattern, "gi");
    const parts = title.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="text-primary font-extrabold">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div className={twMerge("w-full py-8", className)}>
      <div className="rounded-3xl border border-border/60 bg-overlay p-6 md:p-10 lg:p-12 shadow-xs relative overflow-hidden">
        {/* Background Decorative Pattern (Desktop only) */}
        <div className="absolute right-0 top-0 size-48 md:size-64 opacity-5 pointer-events-none hidden md:block">
          <div className="grid grid-cols-6 gap-3 p-6">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="size-1.5 rounded-full bg-fg" />
            ))}
          </div>
        </div>

        {/* Outer Grid: Left Text Column & Right Graphic Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Content Area */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            {/* Header: Logo and Site Title */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                {resolvedLogoUrl && (
                  <img
                    src={resolvedLogoUrl}
                    alt={logoAlt}
                    className="size-10 md:size-12 object-contain select-none"
                  />
                )}
                <div className="space-y-0.5">
                  <span className="text-sm md:text-base font-extrabold text-fg block tracking-tight">
                    {siteName}
                  </span>
                  <span className="text-[10px] md:text-xs text-muted-fg font-medium block">
                    {organizationName}
                  </span>
                </div>
              </div>

              {/* Mobile Only: Top Right Badge */}
              {badge && (
                <div className="inline-flex lg:hidden items-center gap-1 bg-primary/10 text-primary border border-primary/5 rounded-full px-3 py-1 text-xs font-bold select-none">
                  <AcademicCapIcon className="size-3.5" />
                  <span>{badge}</span>
                </div>
              )}
            </div>

            {/* Title / Heading */}
            <div className="space-y-3">
              <Heading
                level={2}
                className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-fg tracking-tight leading-tight"
              >
                {renderHighlightedTitle()}
              </Heading>

              {/* Mobile Decorative Accent Line */}
              <div className="w-16 h-1 bg-primary rounded-full lg:hidden" />
            </div>

            {/* Description */}
            <Text className="text-sm md:text-base text-muted-fg leading-relaxed">
              {description}
            </Text>

            {/* Action Buttons: Row on desktop, vertical stack on mobile */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              {/* Primary Button */}
              <Link
                href={primaryActionHref}
                className={twMerge(
                  "inline-flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-xl text-sm transition duration-200 select-none shadow-xs cursor-pointer",
                  "bg-primary text-primary-fg hover:bg-primary/95 active:scale-[0.98]",
                )}
              >
                <AcademicCapIcon className="size-4 shrink-0" />
                <span>{primaryActionLabel}</span>
                {/* Mobile version has right arrow */}
                <ArrowRightIcon className="size-4 shrink-0 sm:hidden ml-auto" />
              </Link>

              {/* Secondary Button */}
              <Link
                href={secondaryActionHref}
                className={twMerge(
                  "inline-flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-xl text-sm transition duration-200 select-none cursor-pointer",
                  "border border-primary text-primary hover:bg-primary/5 active:scale-[0.98]",
                )}
              >
                <PhoneIcon className="size-4 shrink-0" />
                <span>{secondaryActionLabel}</span>
              </Link>
            </div>
          </div>

          {/* Right Image/Graphic Area */}
          <div className="lg:col-span-5 flex justify-center items-center">
            {resolvedImageUrl ? (
              <div className="relative w-full aspect-square max-w-[340px] md:max-w-[400px] lg:max-w-none flex items-center justify-center select-none">
                {/* Background decorative circles */}
                <div className="absolute inset-0 bg-primary/5 rounded-full scale-95 animate-pulse duration-[6000ms] pointer-events-none" />
                <img
                  src={resolvedImageUrl}
                  alt={title || "CTA Graphic"}
                  className="relative z-10 w-full h-auto max-h-[380px] object-contain transition duration-500 hover:scale-103"
                />
              </div>
            ) : (
              <div className="w-full aspect-video md:aspect-[4/3] rounded-2xl border border-dashed border-border/80 flex flex-col items-center justify-center text-muted-fg gap-2 p-6">
                <AcademicCapIcon className="size-12 opacity-35" />
                <span className="text-xs">
                  Bấm chọn ảnh CTA từ thư viện CMS
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section (Trust/Value props) - Mobile only row at the bottom */}
        {trustItems.length > 0 && (
          <div className="border-t border-border/40 mt-8 pt-6 flex lg:hidden flex-col gap-4">
            {trustItems.map((item, index) => {
              const IconComponent =
                (item.icon && TrustIconMap[item.icon]) || ShieldCheckIcon;

              return (
                <div key={index} className="flex items-center gap-3.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/5 shrink-0">
                    <IconComponent className="size-4.5" />
                  </div>
                  <span className="text-xs font-semibold text-fg leading-normal">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
