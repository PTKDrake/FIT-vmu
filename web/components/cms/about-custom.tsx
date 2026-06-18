"use client";

import {
  GraduationCap,
  Award,
  BookOpen,
  TrendingUp,
  Users,
  Briefcase,
  School,
  Globe,
  MapPin,
  Phone,
  Mail,
  HelpCircle,
} from "lucide-react";
import { Link } from "@/components/ui/link";
import { Heading } from "@/components/ui/heading";
import { twMerge } from "tailwind-merge";
import { getPuckImageUrl } from "@/lib/puck/media";
import type { PuckImageValue } from "@/lib/puck/media";

export interface AboutFeatureItem {
  icon?: string;
  title?: string;
  description?: string;
}

export interface AboutCustomProps {
  badge?: string;
  title?: string;
  imageUrl?: PuckImageValue;
  imageMaxHeight?: "xs" | "sm" | "md" | "lg" | "xl" | "none";
  mobileHighlightText?: string;
  aboutDescription?: string;
  features?: AboutFeatureItem[];
  cardTitle?: string;
  cardSubtitle?: string;
  cardHighlightText?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  buttonLabel?: string;
  buttonHref?: string;
  className?: string;
}

const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Award,
  BookOpen,
  TrendingUp,
  Users,
  Briefcase,
  School,
  Globe,
};

export function AboutCustom({
  badge = "• Về chúng tôi",
  title = "Giới thiệu khoa",
  imageUrl,
  imageMaxHeight = "sm",
  mobileHighlightText = "Khoa Công nghệ thông tin – Trường Đại học Hàng hải Việt Nam thành lập ngày 16/12/1997, là một trong 5 khoa CNTT đầu tiên tại Việt Nam.",
  aboutDescription = "Khoa Công nghệ thông tin – Trường Đại học Hàng hải Việt Nam là đơn vị đào tạo, nghiên cứu và chuyển giao tri thức hàng đầu trong lĩnh vực công nghệ thông tin, góp phần đào tạo nguồn nhân lực chất lượng cao, đáp ứng yêu cầu của thời đại số và hội nhập quốc tế.",
  features = [],
  cardTitle = "Khoa Công nghệ thông tin",
  cardSubtitle = "Trường Đại học Hàng hải Việt Nam",
  cardHighlightText = "Nơi ươm mầm tài năng công nghệ, kiến tạo tương lai số, vươn tầm quốc tế.",
  address = "Phòng 301, Nhà A3, 484 Lạch Tray, Ngô Quyền, Hải Phòng",
  phone = "0225 3783 138",
  email = "fit@vimaru.edu.vn",
  website = "https://fit.vimaru.edu.vn",
  buttonLabel = "Xem thêm về khoa",
  buttonHref = "#",
  className,
}: AboutCustomProps) {
  const resolvedImageUrl =
    getPuckImageUrl(imageUrl) ||
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80";

  const maxHClass = `max-h-${imageMaxHeight || "sm"}`;

  return (
    <div className={twMerge("w-full py-8 space-y-6", className)}>
      {/* Badge & Title */}
      <div className="space-y-2">
        {badge && (
          <span className="inline-block text-sm font-semibold text-primary select-none">
            {badge}
          </span>
        )}
        <Heading
          level={2}
          className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-fg tracking-tight leading-tight"
        >
          {title}
        </Heading>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Left Column: Image/Description, Strengths List */}
        <div className="lg:col-span-3 space-y-6">
          {/* DESKTOP ONLY: Standalone Image & Text */}
          <div className="hidden lg:block space-y-5">
            <div
              className={twMerge(
                "overflow-hidden rounded-2xl border border-border/60 shadow-xs aspect-video w-full",
                maxHClass,
              )}
            >
              <img
                src={resolvedImageUrl}
                alt={title || "FIT-VMU"}
                className="h-full w-full object-cover transition duration-300 hover:scale-[1.01]"
              />
            </div>
            {aboutDescription && (
              <p className="text-sm md:text-base text-muted-fg leading-relaxed">
                {aboutDescription}
              </p>
            )}
          </div>

          {/* MOBILE ONLY: Combined Image + Navy text card */}
          <div className="block lg:hidden space-y-4">
            <div className="overflow-hidden rounded-2xl border border-border/50 shadow-sm">
              <div
                className={twMerge(
                  "aspect-video w-full overflow-hidden",
                  maxHClass,
                )}
              >
                <img
                  src={resolvedImageUrl}
                  alt={title || "FIT-VMU"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="bg-[#083a96] text-white p-5 sm:p-6 rounded-b-2xl">
                <p className="text-sm sm:text-base leading-relaxed font-medium">
                  {mobileHighlightText}
                </p>
              </div>
            </div>
          </div>

          {/* DESKTOP Strengths List (With icon, title & description) */}
          <div className="hidden lg:flex flex-col gap-5 pt-2">
            {features.map((feat, index) => {
              const IconComponent =
                (feat.icon && IconMap[feat.icon]) || HelpCircle;

              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="size-12 rounded-full bg-primary/10 text-primary border border-primary/5 flex items-center justify-center shrink-0">
                    <IconComponent className="size-5 font-semibold" />
                  </div>
                  <div className="space-y-1">
                    <Heading
                      level={4}
                      className="text-base font-bold text-fg tracking-tight"
                    >
                      {feat.title || ""}
                    </Heading>
                    {feat.description && (
                      <p className="text-sm text-muted-fg leading-relaxed">
                        {feat.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* MOBILE Strengths List (With icon & title, divided by border) */}
          <div className="flex lg:hidden flex-col gap-4 pt-2">
            {features.map((feat, index) => {
              const IconComponent =
                (feat.icon && IconMap[feat.icon]) || HelpCircle;

              return (
                <div
                  key={index}
                  className="flex items-center gap-4 pb-4 border-b border-border/50 last:border-b-0 last:pb-0"
                >
                  <div className="size-10 rounded-xl bg-primary/10 text-primary border border-primary/5 flex items-center justify-center shrink-0">
                    <IconComponent className="size-5" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-fg">
                    {feat.title || ""}
                  </span>
                </div>
              );
            })}
          </div>

          {/* MOBILE ONLY: Outline Button below features list */}
          <div className="block lg:hidden pt-4">
            <Link
              href={buttonHref}
              className="flex w-full justify-center items-center gap-2 border border-primary text-primary hover:bg-primary-subtle/10 font-bold py-3.5 px-4 rounded-xl text-sm transition duration-150 cursor-pointer"
            >
              <span>{buttonLabel}</span>
              <span className="font-bold">→</span>
            </Link>
          </div>
        </div>

        {/* DESKTOP ONLY Right Column: Contact card */}
        <div className="lg:col-span-2 hidden lg:block">
          <div className="rounded-3xl border border-border/60 bg-overlay p-4 shadow-sm flex flex-col gap-6 select-none h-fit">
            {/* Top Gradient Card */}
            <div className="bg-gradient-to-br from-[#0e56cc] to-[#083a96] text-white p-6 rounded-2xl relative overflow-hidden shadow-xs">
              {/* Concentric Circle Logo Watermark at bottom right */}
              <div className="absolute right-[-10%] bottom-[-15%] size-44 rounded-full border border-white/5 flex items-center justify-center opacity-15 pointer-events-none">
                <div className="size-36 rounded-full border border-white/5 flex items-center justify-center">
                  <div className="size-28 rounded-full border border-white/5 flex items-center justify-center">
                    <School className="size-12 text-white" />
                  </div>
                </div>
              </div>

              <div className="relative z-10 space-y-1">
                <Heading
                  level={3}
                  className="text-lg md:text-xl font-extrabold text-white tracking-tight"
                >
                  {cardTitle}
                </Heading>
                <p className="text-xs md:text-sm text-blue-100 font-medium tracking-wide">
                  {cardSubtitle}
                </p>
                <div className="w-12 h-0.5 bg-white/20 my-4" />
                <p className="text-xs md:text-sm leading-relaxed text-blue-50 font-medium italic">
                  "{cardHighlightText}"
                </p>
              </div>
            </div>

            {/* Contact Information Rows */}
            <div className="space-y-4 px-2">
              {address && (
                <div className="flex gap-3.5 group/item">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/5 transition shrink-0 mt-0.5">
                    <MapPin className="size-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-muted-fg uppercase tracking-wider block">
                      Địa chỉ
                    </span>
                    <p className="text-sm font-semibold text-fg leading-normal">
                      {address}
                    </p>
                  </div>
                </div>
              )}

              {phone && (
                <div className="flex gap-3.5 group/item">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/5 transition shrink-0 mt-0.5">
                    <Phone className="size-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-muted-fg uppercase tracking-wider block">
                      Điện thoại
                    </span>
                    <p className="text-sm font-semibold text-fg leading-normal">
                      {phone}
                    </p>
                  </div>
                </div>
              )}

              {email && (
                <div className="flex gap-3.5 group/item">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/5 transition shrink-0 mt-0.5">
                    <Mail className="size-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-muted-fg uppercase tracking-wider block">
                      Email
                    </span>
                    <p className="text-sm font-semibold text-fg leading-normal break-all">
                      {email}
                    </p>
                  </div>
                </div>
              )}

              {website && (
                <div className="flex gap-3.5 group/item">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/5 transition shrink-0 mt-0.5">
                    <Globe className="size-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-muted-fg uppercase tracking-wider block">
                      Website
                    </span>
                    <p className="text-sm font-semibold text-fg leading-normal break-all">
                      {website}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Outline Button */}
            <div className="pt-2">
              <Link
                href={buttonHref}
                className="flex w-full justify-center items-center gap-2 border border-primary text-primary hover:bg-primary-subtle/10 font-bold py-3.5 px-4 rounded-xl text-sm transition duration-150 cursor-pointer"
              >
                <span>{buttonLabel}</span>
                <span className="font-bold">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
