"use client";

import { router } from "@inertiajs/react";
import {
  Link as LinkPrimitive,
  type LinkProps as LinkPrimitiveProps,
} from "react-aria-components/Link";
import { shouldInterceptInternalAnchorNavigation } from "@/lib/navigation/anchor-navigation";
import { cx } from "@/lib/primitive";

export interface LinkProps extends LinkPrimitiveProps {
  ref?: React.RefObject<HTMLAnchorElement>;
}

export function Link({ className, ref, ...props }: LinkProps) {
  return (
    <LinkPrimitive
      ref={ref}
      onClick={(event) => {
        props.onClick?.(event);
        const currentTarget = event.currentTarget as HTMLAnchorElement;

        if (
          !shouldInterceptInternalAnchorNavigation({
            altKey: event.altKey,
            button: event.button,
            ctrlKey: event.ctrlKey,
            currentUrl: window.location.href,
            defaultPrevented: event.defaultPrevented,
            download: currentTarget.hasAttribute("download"),
            href: currentTarget.getAttribute("href"),
            metaKey: event.metaKey,
            shiftKey: event.shiftKey,
            target: currentTarget.getAttribute("target"),
          })
        ) {
          return;
        }

        event.preventDefault();
        router.visit(currentTarget.href);
      }}
      className={cx(
        "font-medium text-(--text)",
        "outline-0 outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring forced-colors:outline-[Highlight]",
        "disabled:cursor-default disabled:opacity-50 forced-colors:disabled:text-[GrayText]",
        "href" in props && "cursor-pointer",
        className,
      )}
      {...props}
    />
  );
}
