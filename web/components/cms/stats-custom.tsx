"use client";

import {
  Calendar,
  GraduationCap,
  TrendingUp,
  Users,
  Rocket,
  Presentation,
  Globe,
  Award,
  HelpCircle,
} from "lucide-react";
import { Link } from "@/components/ui/link";
import { Heading } from "@/components/ui/heading";
import { twMerge } from "tailwind-merge";
import { cx } from "@/lib/primitive";

export interface StatDataItem {
  icon?: string;
  value?: string;
  label?: string;
}

export interface StatsCustomProps {
  title?: string;
  viewAllLabel?: string;
  viewAllHref?: string;
  stats?: StatDataItem[];
  className?: string;
}

const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Calendar,
  GraduationCap,
  BarChart: TrendingUp,
  TrendingUp,
  Users,
  Rocket,
  Presentation,
  Globe,
  Award,
};

export function StatsCustom({
  title,
  viewAllLabel,
  viewAllHref,
  stats = [],
  className,
}: StatsCustomProps) {
  return (
    <div className={twMerge("w-full space-y-6", className)}>
      {/* Mobile-only Header */}
      {title && (
        <div className="flex items-center justify-between md:hidden px-1">
          <Heading
            level={3}
            className="text-xl font-bold text-fg tracking-tight"
          >
            {title}
          </Heading>
          {viewAllLabel && (
            <Link
              href={viewAllHref || "#"}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
            >
              <span>{viewAllLabel}</span>
              <span className="text-sm">→</span>
            </Link>
          )}
        </div>
      )}

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const IconComponent = (stat.icon && IconMap[stat.icon]) || HelpCircle;

          return (
            <div
              key={index}
              className={twMerge(
                "flex flex-col items-center text-center p-6 md:p-8 rounded-2xl md:rounded-3xl border border-border/80 bg-overlay shadow-xs",
                "transition duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary/10 select-none group",
              )}
            >
              {/* Icon Container */}
              <div
                className={twMerge(
                  "size-12 md:size-16 rounded-full bg-primary-subtle/30 text-primary flex items-center justify-center mb-4 md:mb-6",
                  "transition-transform duration-300 group-hover:scale-110",
                )}
              >
                <IconComponent className="size-5 md:size-7" />
              </div>

              {/* Number Value */}
              <span className="text-2xl md:text-4xl font-extrabold text-primary tracking-tight mb-1 md:mb-2">
                {stat.value || "0"}
              </span>

              {/* Muted Label */}
              <span className="text-xs md:text-sm font-semibold text-fg/80 leading-snug">
                {stat.label || ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
