"use client";

import { School } from "lucide-react";
import { Link } from "@/components/ui/link";
import { buttonStyles } from "@/components/ui/button.styles";
import { cx } from "@/lib/primitive";
import { twMerge } from "tailwind-merge";
import { getPuckImageUrl } from "@/lib/puck/media";
import type { PuckImageValue } from "@/lib/puck/media";
import { useTheme } from "@/hooks/use-theme";

export interface HeroCustomProps {
  badge?: string;
  title?: string;
  description?: string;
  imageUrl?: PuckImageValue;
  primaryActionLabel?: string;
  primaryActionHref?: string;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  theme?: "light" | "dark";
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
  theme = "light",
  className,
}: HeroCustomProps) {
  const resolvedImageUrl = getPuckImageUrl(imageUrl);
  const { resolvedTheme } = useTheme();
  const isDark = theme === "dark" || resolvedTheme === "dark";

  return (
    <div
      className={twMerge(
        "relative flex flex-col items-center gap-8 overflow-hidden rounded-3xl p-6 min-[1440px]:flex-row min-[1440px]:p-16",
        "bg-gradient-to-b from-[#0e56cc] to-[#083a96] text-white",
        !isDark &&
          "min-[1440px]:bg-gradient-to-r min-[1440px]:from-[#ebf3fe] min-[1440px]:via-[#f1f7ff] min-[1440px]:to-white min-[1440px]:text-fg",
        "shadow-xs transition duration-300 hover:shadow-sm",
        className,
      )}
    >
      {/* Left Column: Text & Actions */}
      <div className="relative z-10 flex w-full flex-col gap-5 min-[1440px]:w-1/2 min-[1440px]:gap-6">
        {badge && (
          <div
            className={twMerge(
              "inline-flex w-fit select-none items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold shadow-xs",
              "border-white/20 bg-white/10 text-white",
              !isDark &&
                "min-[1440px]:border-primary/10 min-[1440px]:bg-white/90 min-[1440px]:text-primary min-[1440px]:backdrop-blur-xs dark:min-[1440px]:border-white/20 dark:min-[1440px]:bg-white/10 dark:min-[1440px]:text-white",
            )}
          >
            <School
              className={twMerge(
                "size-4 shrink-0 text-white",
                !isDark &&
                  "min-[1440px]:text-primary dark:min-[1440px]:text-white",
              )}
            />
            <span>{badge}</span>
          </div>
        )}

        <h1
          className={twMerge(
            "text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl min-[1440px]:text-5xl",
            !isDark && "min-[1440px]:text-fg dark:min-[1440px]:text-white",
          )}
        >
          {title}
        </h1>

        <p
          className={twMerge(
            "whitespace-pre-line text-sm leading-relaxed text-blue-100 sm:text-base",
            !isDark &&
              "min-[1440px]:text-muted-fg dark:min-[1440px]:text-blue-100",
          )}
        >
          {description}
        </p>

        <div className="flex w-full flex-col gap-4 pt-2 sm:w-auto sm:flex-row min-[1440px]:flex-wrap">
          {primaryActionLabel && (
            <Link
              href={primaryActionHref || "#"}
              className={cx(
                buttonStyles({ size: "lg" }),
                "group/btn w-full cursor-pointer justify-center gap-2 font-semibold sm:w-auto",
                "bg-white text-[#0e56cc] hover:bg-blue-50 border-transparent",
                !isDark
                  ? "min-[1440px]:bg-primary min-[1440px]:text-primary-fg min-[1440px]:hover:bg-primary/95 dark:min-[1440px]:border-transparent dark:min-[1440px]:bg-white dark:min-[1440px]:text-[#0e56cc] dark:min-[1440px]:hover:bg-blue-50"
                  : "",
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
                "group/btn w-full cursor-pointer justify-center gap-2 font-semibold sm:w-auto",
                "border-white/30 text-white hover:bg-white/10 bg-transparent",
                !isDark
                  ? "min-[1440px]:border-primary/20 min-[1440px]:text-primary min-[1440px]:hover:bg-primary-subtle/25 dark:min-[1440px]:border-white/30 dark:min-[1440px]:bg-transparent dark:min-[1440px]:text-white dark:min-[1440px]:hover:bg-white/10"
                  : "",
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
          <div className="absolute top-0 right-0 bottom-0 hidden w-1/2 select-none overflow-hidden rounded-l-full min-[1440px]:block">
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
            <div className="pointer-events-none absolute right-0 bottom-0 size-48 translate-x-12 translate-y-12 rounded-tl-full bg-gradient-to-tr from-[#083a96] to-[#0e56cc] opacity-90" />
          </div>

          {/* Mobile Stacked Image (below text) */}
          <div className="relative block aspect-video w-full select-none overflow-hidden rounded-2xl shadow-sm min-[1440px]:hidden">
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
