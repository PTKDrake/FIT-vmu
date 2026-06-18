import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface AppLogoProps extends HTMLAttributes<HTMLDivElement> {
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses: Record<NonNullable<AppLogoProps["size"]>, string> = {
  sm: "size-8",
  md: "size-12",
  lg: "size-20",
};

const wordmarkSizeClasses: Record<NonNullable<AppLogoProps["size"]>, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export function AppLogo({
  className,
  showWordmark = true,
  size = "md",
  ...props
}: AppLogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-3", className)} {...props}>
      <img
        src="/logo.png"
        alt="FIT logo"
        className={cn(
          "rounded-full object-cover ring-1 ring-border/70 shadow-sm",
          sizeClasses[size],
        )}
      />
      {showWordmark ? (
        <div className="flex flex-col leading-none">
          <span
            className={cn("font-semibold text-fg", wordmarkSizeClasses[size])}
          >
            VMUFit
          </span>
          <span className="text-xs text-muted-fg">
            Khoa Công nghệ Thông tin
          </span>
        </div>
      ) : null}
    </div>
  );
}
