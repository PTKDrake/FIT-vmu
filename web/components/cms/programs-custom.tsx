"use client";

import {
  Monitor,
  Database,
  Code,
  Shield,
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Cloud,
  Lock,
  School,
  HelpCircle,
} from "lucide-react";
import { Link } from "@/components/ui/link";
import { Heading } from "@/components/ui/heading";
import { twMerge } from "tailwind-merge";

export interface ProgramItem {
  icon?: string;
  title?: string;
  description?: string;
  href?: string;
}

export interface ProgramsCustomProps {
  badge?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  programs?: ProgramItem[];
  className?: string;
}

const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Monitor,
  Database,
  Code,
  Shield,
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Cloud,
  Lock,
  School,
};

export function ProgramsCustom({
  badge = "CHƯƠNG TRÌNH ĐÀO TẠO",
  title = "Các hướng đào tạo nổi bật",
  description = "Các chương trình đào tạo chất lượng cao, cập nhật xu hướng công nghệ và đáp ứng nhu cầu thực tiễn của thị trường lao động.",
  actionLabel = "Xem tất cả chương trình",
  actionHref = "#",
  programs = [],
  className,
}: ProgramsCustomProps) {
  return (
    <div className={twMerge("w-full py-8 space-y-8 lg:space-y-12", className)}>
      {/* Header section: Badge, Heading, and Subtext on left; Action Link on right */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-12 pb-2">
        <div className="space-y-2.5 max-w-3xl">
          {badge && (
            <span className="hidden md:inline-block text-xs font-bold text-primary tracking-wider uppercase">
              {badge}
            </span>
          )}
          <Heading
            level={2}
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-fg tracking-tight leading-tight"
          >
            {title}
          </Heading>
          {description && (
            <p className="hidden md:block text-sm md:text-base text-muted-fg leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Action Link: Long version on desktop, short on mobile */}
        <div className="shrink-0 flex items-center">
          <Link
            href={actionHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-subtle-fg transition-colors group/link cursor-pointer"
          >
            <span className="hidden md:inline">{actionLabel}</span>
            <span className="inline md:hidden">Xem tất cả</span>
            <span className="inline-block transition-transform duration-250 group-hover/link:translate-x-1 font-bold">
              →
            </span>
          </Link>
        </div>
      </div>

      {/* Grid of Program Cards: 4-cols on desktop, 2-cols on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        {programs.map((prog, index) => {
          const IconComponent = (prog.icon && IconMap[prog.icon]) || HelpCircle;

          return (
            <div
              key={index}
              className={twMerge(
                "flex flex-col items-center text-center p-5 lg:p-7 rounded-2xl lg:rounded-3xl border border-border/60 bg-overlay shadow-xs",
                "transition duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary/15 select-none group flex-1",
              )}
            >
              {/* Icon Container */}
              <div
                className={twMerge(
                  "size-16 rounded-full bg-[color-mix(in_oklab,var(--color-primary)_8%,transparent)] text-primary border border-primary/10 flex items-center justify-center mb-5",
                  "transition-transform duration-300 group-hover:scale-105",
                )}
              >
                <IconComponent className="size-8" />
              </div>

              {/* Title */}
              <Heading
                level={3}
                className="text-base lg:text-lg font-bold text-fg tracking-tight leading-snug mb-3 min-h-[3rem] flex items-center justify-center"
              >
                {prog.title || ""}
              </Heading>

              {/* Description */}
              <p className="text-xs lg:text-sm text-muted-fg leading-relaxed mb-6 flex-1 line-clamp-4">
                {prog.description || ""}
              </p>

              {/* Card Action Link */}
              <Link
                href={prog.href || "#"}
                className="inline-flex items-center gap-1 text-xs lg:text-sm font-semibold text-primary hover:underline group/card-link cursor-pointer mt-auto"
              >
                <span>Xem chi tiết</span>
                <span className="inline-block transition-transform duration-250 group-hover/card-link:translate-x-1 font-bold">
                  →
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
