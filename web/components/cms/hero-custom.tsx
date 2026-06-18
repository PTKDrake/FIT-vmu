"use client";

import { School } from "lucide-react";
import { Link } from "@/components/ui/link";
import { buttonStyles } from "@/components/ui/button.styles";
import { cx } from "@/lib/primitive";
import { twMerge } from "tailwind-merge";
import { getPuckImageUrl } from "@/lib/puck/media";
import type { PuckImageValue } from "@/lib/puck/media";

export interface HeroCustomProps {
  badge?: string;
  title?: string;
  description?: string;
  imageUrl?: PuckImageValue;
  primaryActionLabel?: string;
  primaryActionHref?: string;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  className?: string;
}

export function HeroCustom({
  badge,
  title,
  description,
  imageUrl,
  primaryActionLabel,
  primaryActionHref,
  secondaryActionLabel,
  secondaryActionHref,
  className,
}: HeroCustomProps) {
  const resolvedImageUrl = getPuckImageUrl(imageUrl);

  return (
    <div
      className={twMerge(
        "relative overflow-hidden rounded-3xl p-6 md:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-8",
        "bg-gradient-to-b from-[#0e56cc] to-[#083a96] text-white",
        "md:bg-gradient-to-r md:from-[#ebf3fe] md:via-[#f1f7ff] md:to-white md:text-fg",
        "shadow-xs transition duration-300 hover:shadow-sm",
        className,
      )}
    >
      {/* Left Column: Text & Actions */}
      <div className="w-full md:w-1/2 flex flex-col gap-5 md:gap-6 z-10 relative">
        {badge && (
          <div
            className={twMerge(
              "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold shadow-xs select-none w-fit border",
              "border-white/20 bg-white/10 text-white",
              "md:border-primary/10 md:bg-white/90 md:text-primary md:backdrop-blur-xs",
            )}
          >
            <School className="size-4 shrink-0 text-white md:text-primary" />
            <span>{badge}</span>
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white md:text-fg">
          {title}
        </h1>

        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line text-blue-100 md:text-muted-fg max-w-xl">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row md:flex-wrap gap-4 pt-2 w-full sm:w-auto">
          {primaryActionLabel && (
            <Link
              href={primaryActionHref || "#"}
              className={cx(
                buttonStyles({ size: "lg" }),
                "w-full sm:w-auto justify-center gap-2 group/btn cursor-pointer font-semibold",
                "bg-white text-[#0e56cc] hover:bg-blue-50 border-transparent",
                "md:bg-primary md:text-primary-fg md:hover:bg-primary/95",
              )}
            >
              <span>{primaryActionLabel}</span>
              <span className="inline-block transition-transform group-hover/btn:translate-x-1">
                →
              </span>
            </Link>
          )}

          {secondaryActionLabel && (
            <Link
              href={secondaryActionHref || "#"}
              className={cx(
                buttonStyles({ size: "lg" }),
                "w-full sm:w-auto justify-center gap-2 group/btn cursor-pointer font-semibold",
                "border-white/30 text-white hover:bg-white/10 bg-transparent",
                "md:border-primary/20 md:text-primary md:hover:bg-primary-subtle/25",
              )}
            >
              <span>{secondaryActionLabel}</span>
              <span className="inline-block transition-transform group-hover/btn:translate-x-1">
                →
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* Right Column / Background: Building Image */}
      {resolvedImageUrl && (
        <>
          {/* Desktop Right Panel (Arc clipped image) */}
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/2 rounded-l-full overflow-hidden select-none">
            <img
              src={resolvedImageUrl}
              alt={title || "FIT-VMU building"}
              className="h-full w-full object-cover object-center"
              onError={(e) => {
                // Fallback to placeholder if url fails
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80";
              }}
            />
            {/* Decorative bottom-right blue gradient overlay */}
            <div className="absolute right-0 bottom-0 bg-gradient-to-tr from-[#083a96] to-[#0e56cc] rounded-tl-full w-48 h-48 translate-x-12 translate-y-12 opacity-90 pointer-events-none" />
          </div>

          {/* Mobile Stacked Image (below text) */}
          <div className="block md:hidden relative w-full aspect-video sm:aspect-[21/9] overflow-hidden rounded-2xl shadow-sm select-none">
            <img
              src={resolvedImageUrl}
              alt={title || "FIT-VMU building"}
              className="h-full w-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80";
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
