"use client";

import {
  Flag,
  GraduationCap,
  TrendingUp,
  Globe,
  Rocket,
  Award,
  BookOpen,
  Briefcase,
  HelpCircle,
  BarChart2,
} from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { twMerge } from "tailwind-merge";

export interface MilestoneItem {
  icon?: string;
  years?: string;
  title?: string;
  description?: string;
}

export interface MilestonesProps {
  title?: string;
  milestones?: MilestoneItem[];
  className?: string;
}

const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Flag,
  GraduationCap,
  TrendingUp,
  Globe,
  Rocket,
  Award,
  BookOpen,
  Briefcase,
  BarChart2,
};

export function Milestones({
  title = "Các cột mốc phát triển",
  milestones = [],
  className,
}: MilestonesProps) {
  const cols = milestones.length || 5;

  return (
    <div className={twMerge("w-full py-8 space-y-8 select-none", className)}>
      {/* Title */}
      {title && (
        <Heading
          level={2}
          className="text-2xl md:text-3xl font-extrabold text-fg tracking-tight leading-tight"
        >
          {title}
        </Heading>
      )}

      {milestones.length > 0 && (
        <div>
          {/* DESKTOP TIMELINE: Horizontal layout (lg screens and above) */}
          <div className="hidden lg:block relative pt-6 pb-2">
            {/* The Horizontal Connector Line (Track) */}
            <div
              className="absolute top-[34px] h-[2px] bg-border/60 z-0"
              style={{
                left: `${100 / (cols * 2)}%`,
                right: `${100 / (cols * 2)}%`,
              }}
            />

            <div
              className="grid gap-6 relative z-10"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {milestones.map((item, index) => {
                const IconComponent =
                  (item.icon && IconMap[item.icon]) || HelpCircle;

                return (
                  <div key={index} className="flex flex-col items-center group">
                    {/* The timeline node (dot) */}
                    <div className="size-5 rounded-full bg-primary shadow-sm flex items-center justify-center transition-transform duration-200 group-hover:scale-125 z-10" />

                    {/* Vertical dashed line from dot to card */}
                    <div className="w-[1.5px] h-8 border-l border-dashed border-border/80 my-2" />

                    {/* Card container */}
                    <div className="w-full min-h-[280px] flex flex-col items-center text-center p-6 rounded-2xl border border-border/40 bg-overlay shadow-md transition duration-300 hover:shadow-lg hover:border-border/80">
                      {/* Icon Container */}
                      <div className="size-16 rounded-full bg-[color-mix(in_oklab,var(--color-primary)_8%,transparent)] text-primary flex items-center justify-center mb-4 shrink-0 transition-transform duration-300 group-hover:rotate-6">
                        <IconComponent className="size-7" />
                      </div>

                      {/* Years */}
                      {item.years && (
                        <span className="text-sm font-bold text-primary tracking-wide">
                          {item.years}
                        </span>
                      )}

                      {/* Title */}
                      {item.title && (
                        <Heading
                          level={4}
                          className="text-base font-extrabold text-fg tracking-tight mt-1 mb-2 line-clamp-2"
                        >
                          {item.title}
                        </Heading>
                      )}

                      {/* Accent Blue Line */}
                      <div className="w-8 h-[2px] bg-primary/30 my-2 shrink-0" />

                      {/* Description */}
                      {item.description && (
                        <p className="text-xs text-muted-fg leading-relaxed line-clamp-4 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MOBILE TIMELINE: Vertical layout (below lg screens) */}
          <div className="block lg:hidden relative pl-4 sm:pl-8 py-2">
            {/* The Vertical Connector Line */}
            <div className="absolute top-[44px] bottom-[44px] left-[18px] sm:left-[26px] w-[2px] bg-border/60 z-0" />

            <div className="space-y-6">
              {milestones.map((item, index) => {
                const IconComponent =
                  (item.icon && IconMap[item.icon]) || HelpCircle;

                return (
                  <div
                    key={index}
                    className="flex items-start relative z-10 group"
                  >
                    {/* The timeline node (dot) */}
                    <div className="absolute left-[10px] sm:left-[18px] top-[44px] -translate-y-1/2 size-4 rounded-full bg-primary shadow-xs" />

                    {/* Small horizontal connecting line */}
                    <div className="absolute left-[18px] sm:left-[26px] top-[44px] -translate-y-1/2 w-[22px] sm:w-[38px] h-[2px] bg-border/60" />

                    {/* Card container */}
                    <div className="ml-10 sm:ml-16 flex-1 flex items-start gap-4 p-4 rounded-2xl border border-border/40 bg-overlay shadow-md transition duration-200 active:scale-[0.99]">
                      {/* Icon */}
                      <div className="size-14 rounded-full bg-[color-mix(in_oklab,var(--color-primary)_8%,transparent)] text-primary flex items-center justify-center shrink-0">
                        <IconComponent className="size-6" />
                      </div>

                      {/* Info side */}
                      <div className="flex-1 min-w-0 space-y-1">
                        {item.years && (
                          <span className="text-xs sm:text-sm font-bold text-primary block">
                            {item.years}
                          </span>
                        )}
                        {item.title && (
                          <Heading
                            level={4}
                            className="text-sm sm:text-base font-extrabold text-fg tracking-tight leading-snug"
                          >
                            {item.title}
                          </Heading>
                        )}
                        {item.description && (
                          <p className="text-xs text-muted-fg leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
