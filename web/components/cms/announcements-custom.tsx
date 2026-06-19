"use client";

import { BellIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";

export interface AnnouncementItem {
  title?: string;
  date?: string;
  href?: string;
}

export interface AnnouncementsCustomProps {
  title?: string;
  actionLabel?: string;
  actionHref?: string;
  items?: AnnouncementItem[];
  className?: string;
}

export function AnnouncementsCustom({
  title = "Thông báo",
  actionLabel = "Xem tất cả",
  actionHref = "#",
  items = [],
  className,
}: AnnouncementsCustomProps) {
  return (
    <div className={twMerge("w-full py-8 space-y-6", className)}>
      {/* Container Card */}
      <div className="rounded-3xl border border-border/60 bg-overlay p-6 md:p-8 shadow-xs">
        {/* Header section: Title and Action link */}
        <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-6">
          <Heading
            level={2}
            className="text-xl md:text-2xl font-extrabold text-fg tracking-tight"
          >
            {title}
          </Heading>

          {actionHref && (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-subtle-fg transition-colors group/link cursor-pointer"
            >
              <span>{actionLabel}</span>
              <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-1 font-bold">
                →
              </span>
            </Link>
          )}
        </div>

        {/* List of Announcement cards */}
        {items.length === 0 ? (
          <div className="text-center py-8">
            <Text className="text-sm text-muted-fg">
              Không có thông báo mới nào.
            </Text>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href || "#"}
                className={twMerge(
                  "flex items-start md:items-center gap-4 p-4 rounded-2xl border border-border/50 bg-bg transition duration-200",
                  "hover:shadow-xs hover:border-primary/20 hover:-translate-y-px hover:bg-muted/5 group select-none block",
                )}
              >
                {/* Bell Icon Container */}
                <div className="size-12 rounded-xl bg-[color-mix(in_oklab,var(--color-primary)_8%,transparent)] text-primary border border-primary/5 flex items-center justify-center shrink-0">
                  <BellIcon className="size-5 shrink-0" aria-hidden="true" />
                </div>

                {/* Title and Date */}
                <div className="space-y-1 min-w-0 flex-1">
                  <Heading
                    level={3}
                    className="text-sm md:text-base font-bold text-fg group-hover:text-primary transition-colors line-clamp-2 leading-snug"
                  >
                    {item.title}
                  </Heading>
                  {item.date && (
                    <span className="text-xs text-muted-fg font-medium block">
                      {item.date}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
