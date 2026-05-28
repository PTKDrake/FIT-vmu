import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface StickyActionBarProps {
  children: ReactNode;
  className?: string;
}

export function StickyActionBar({ children, className }: StickyActionBarProps) {
  return (
    <div className="sticky bottom-4 z-40 mt-8 flex justify-end w-full">
      <div
        className={twMerge(
          "w-full lg:w-1/3 rounded-2xl border border-border bg-overlay/85 p-3 shadow-lg backdrop-blur-md transition-all duration-300",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
