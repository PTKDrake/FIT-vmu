"use client";

import Autoplay from "embla-carousel-autoplay";
import {
  AcademicCapIcon,
  BookOpenIcon,
  BuildingLibraryIcon,
  CircleStackIcon,
  CloudIcon,
  CodeBracketIcon,
  ComputerDesktopIcon,
  LockClosedIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  TrophyIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselButton,
  CarouselContent,
  CarouselHandler,
  CarouselItem,
} from "@/components/ui/carousel";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";

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
  Monitor: ComputerDesktopIcon,
  Database: CircleStackIcon,
  Code: CodeBracketIcon,
  Shield: ShieldCheckIcon,
  GraduationCap: AcademicCapIcon,
  BookOpen: BookOpenIcon,
  Users: UsersIcon,
  Award: TrophyIcon,
  Cloud: CloudIcon,
  Lock: LockClosedIcon,
  School: BuildingLibraryIcon,
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
  const carouselPlugins =
    programs.length > 1
      ? [
          Autoplay({
            delay: 4500,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]
      : undefined;

  return (
    <div className={twMerge("w-full py-8 space-y-8 lg:space-y-12", className)}>
      {/* Header section: Badge, Heading, and Subtext on left; Action Link on right */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-12 pb-2">
        <div className="space-y-2.5 max-w-3xl">
          {badge && (
            <Badge
              intent="primary"
              className="hidden font-bold tracking-wider uppercase md:inline-flex"
            >
              {badge}
            </Badge>
          )}
          <Heading
            level={2}
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-fg tracking-tight leading-tight"
          >
            {title}
          </Heading>
          {description && (
            <Text className="hidden text-sm/relaxed md:block md:text-base/relaxed">
              {description}
            </Text>
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

      {/* Program Cards Carousel: 1-col on mobile, 2-cols on tablet, 4-cols on desktop */}
      <Carousel
        opts={{ loop: true, align: "start" }}
        plugins={carouselPlugins}
        className="w-full"
      >
        <CarouselContent className="-ms-4">
          {programs.map((prog, index) => {
            const IconComponent =
              (prog.icon && IconMap[prog.icon]) || QuestionMarkCircleIcon;

            return (
              <CarouselItem
                key={index}
                className="basis-full md:basis-1/2 lg:basis-1/4 ps-4 py-2"
              >
                <div
                  className={twMerge(
                    "flex flex-col items-center text-center p-5 lg:p-7 rounded-2xl lg:rounded-3xl border border-border/60 bg-overlay shadow-xs h-full",
                    "transition duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary/15 select-none group w-full",
                  )}
                >
                  {/* Icon Container */}
                  <div
                    className={twMerge(
                      "size-16 rounded-full bg-[color-mix(in_oklab,var(--color-primary)_8%,transparent)] text-primary border border-primary/10 flex items-center justify-center mb-5",
                      "transition-transform duration-300 group-hover:scale-105",
                    )}
                  >
                    <IconComponent aria-hidden="true" className="size-8" />
                  </div>

                  {/* Title */}
                  <Heading
                    level={3}
                    className="text-base lg:text-lg font-bold text-fg tracking-tight leading-snug mb-3 min-h-[3rem] flex items-center justify-center"
                  >
                    {prog.title || ""}
                  </Heading>

                  {/* Description */}
                  <Text className="mb-6 line-clamp-4 flex-1 text-xs/relaxed lg:text-sm/relaxed">
                    {prog.description || ""}
                  </Text>

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
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {programs.length > 1 && (
          <CarouselHandler
            className={twMerge(
              "mt-6 justify-center",
              programs.length <= 2 ? "md:hidden" : "",
              programs.length <= 4 ? "lg:hidden" : "",
            )}
          >
            <CarouselButton segment="previous" isDisabled={false} />
            <CarouselButton segment="next" isDisabled={false} />
          </CarouselHandler>
        )}
      </Carousel>
    </div>
  );
}
