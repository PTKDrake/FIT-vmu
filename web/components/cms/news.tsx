"use client";

import { ArrowRight } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { twMerge } from "tailwind-merge";
import { getPuckImageUrl } from "@/lib/puck/media";
import type { PuckImageValue } from "@/lib/puck/media";

export interface FeaturedNewsItem {
  image?: PuckImageValue;
  imageUrl?: string | null;
  date?: string;
  title?: string;
  description?: string;
  href?: string;
}

export interface SecondaryNewsItem {
  image?: PuckImageValue;
  imageUrl?: string | null;
  date?: string;
  title?: string;
  href?: string;
}

export interface NewsCustomProps {
  title?: string;
  viewAllLabel?: string;
  viewAllHref?: string;
  featured?: FeaturedNewsItem;
  items?: SecondaryNewsItem[];
  className?: string;
}

export function NewsCustom({
  title = "Tin tức nổi bật",
  viewAllLabel = "Xem tất cả",
  viewAllHref = "#",
  featured,
  items = [],
  className,
}: NewsCustomProps) {
  const hasFeatured = !!featured;
  const resolvedFeaturedImage = hasFeatured
    ? featured.imageUrl ||
      getPuckImageUrl(featured.image) ||
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80"
    : "";

  return (
    <div
      className={twMerge(
        "w-full p-6 md:p-8 rounded-3xl border border-border/80 bg-overlay shadow-md hover:shadow-lg transition duration-300 space-y-6 select-none",
        className,
      )}
    >
      {/* Header: Title & View All */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        {title && (
          <Heading
            level={2}
            className="text-2xl md:text-3xl font-extrabold text-fg tracking-tight"
          >
            {title}
          </Heading>
        )}
        {viewAllLabel && (
          <Link
            href={viewAllHref}
            className="text-sm font-bold text-primary hover:text-primary-subtle-fg transition-colors flex items-center gap-1.5"
          >
            <span>{viewAllLabel}</span>
            <ArrowRight className="size-4" />
          </Link>
        )}
      </div>

      {/* Main Grid Section */}
      <div className="space-y-6">
        {/* 1. FEATURED ARTICLE */}
        {hasFeatured && (
          <div className="group">
            {/* DESKTOP FEATURED: Horizontal layout */}
            <div className="hidden lg:grid grid-cols-12 gap-8 items-center">
              {/* Image Column */}
              <Link
                href={featured.href || "#"}
                className="col-span-6 block overflow-hidden rounded-2xl border border-border/50 shadow-xs relative aspect-video cursor-pointer"
              >
                <img
                  src={resolvedFeaturedImage}
                  alt={featured.title || "Featured News"}
                  className="w-full h-full object-cover"
                />
                {/* Featured Badge */}
                <div className="absolute top-4 left-4 bg-primary text-primary-fg font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm tracking-wider uppercase">
                  NỔI BẬT
                </div>
              </Link>

              {/* Text Column */}
              <div className="col-span-6 space-y-4">
                {featured.date && (
                  <p className="text-sm font-semibold text-muted-fg">
                    {featured.date}
                  </p>
                )}
                {featured.title && (
                  <Heading level={3}>
                    <Link
                      href={featured.href || "#"}
                      className="text-xl md:text-2xl font-extrabold text-fg hover:text-primary transition-colors leading-tight block"
                    >
                      {featured.title}
                    </Link>
                  </Heading>
                )}
                {featured.description && (
                  <p className="text-sm md:text-base text-muted-fg leading-relaxed line-clamp-3">
                    {featured.description}
                  </p>
                )}
                <div>
                  <Link
                    href={featured.href || "#"}
                    className="text-sm font-bold text-primary hover:text-primary-subtle-fg transition-colors flex items-center gap-1.5 hover:underline"
                  >
                    <span>Đọc thêm</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* MOBILE FEATURED: Vertical layout */}
            <div className="block lg:hidden space-y-3 transition duration-200 active:scale-[0.99]">
              <Link
                href={featured.href || "#"}
                className="block relative aspect-video overflow-hidden rounded-2xl border border-border/40"
              >
                <img
                  src={resolvedFeaturedImage}
                  alt={featured.title || "Featured News"}
                  className="w-full h-full object-cover"
                />
                {/* Featured Badge */}
                <div className="absolute top-3 left-3 bg-primary text-primary-fg font-bold text-[10px] px-2.5 py-1 rounded-md shadow-sm tracking-wider uppercase">
                  NỔI BẬT
                </div>
              </Link>
              <div className="space-y-3">
                {featured.date && (
                  <p className="text-xs font-semibold text-muted-fg">
                    {featured.date}
                  </p>
                )}
                {featured.title && (
                  <Heading level={3}>
                    <Link
                      href={featured.href || "#"}
                      className="text-lg font-bold text-fg hover:text-primary transition-colors leading-snug block"
                    >
                      {featured.title}
                    </Link>
                  </Heading>
                )}
                {featured.description && (
                  <p className="text-xs sm:text-sm text-muted-fg leading-relaxed line-clamp-3">
                    {featured.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Horizontal separator line */}
        {hasFeatured && items.length > 0 && (
          <div className="border-t border-border/40" />
        )}

        {/* 2. SECONDARY LIST ITEMS */}
        {items.length > 0 && (
          <div className="flex flex-col">
            {items.map((item, index) => {
              const itemImage =
                item.imageUrl ||
                getPuckImageUrl(item.image) ||
                "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80";

              return (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 py-4 border-b border-border/40 last:border-b-0 last:pb-0 group"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Small Image */}
                    <Link
                      href={item.href || "#"}
                      className="w-24 sm:w-40 aspect-video shrink-0 overflow-hidden rounded-xl border border-border/50 cursor-pointer"
                    >
                      <img
                        src={itemImage}
                        alt={item.title || "News Image"}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Meta and Title */}
                    <div className="flex-1 min-w-0 space-y-1">
                      {item.date && (
                        <p className="text-[10px] sm:text-xs font-semibold text-muted-fg">
                          {item.date}
                        </p>
                      )}
                      {item.title && (
                        <Link
                          href={item.href || "#"}
                          className="text-xs sm:text-base font-bold text-fg hover:text-primary transition-colors leading-snug line-clamp-2 block"
                        >
                          {item.title}
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Desktop Right Arrow (Hidden on Mobile) */}
                  <Link
                    href={item.href || "#"}
                    className="hidden lg:flex size-10 items-center justify-center rounded-full border border-border/60 hover:border-primary/80 text-muted-fg hover:text-primary bg-bg shadow-2xs shrink-0 transition"
                    aria-label="Xem chi tiết"
                  >
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
