"use client";

import { layout, prepare } from "@chenglou/pretext";
import { useLayoutEffect, useRef } from "react";
import { TextArea, type TextAreaProps } from "react-aria-components/TextArea";
import { twJoin } from "tailwind-merge";
import { cx } from "@/lib/primitive";

export interface TextareaProps extends TextAreaProps {
  autosize?: boolean;
  maxRows?: number;
}

function parsePx(value: string): number {
  const parsed = Number.parseFloat(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function resolveFont(style: CSSStyleDeclaration): string {
  return [
    style.fontStyle,
    style.fontVariant,
    style.fontWeight,
    style.fontStretch,
    style.fontSize,
    style.fontFamily,
  ]
    .filter((part) => part.length > 0)
    .join(" ");
}

function resolveLineHeight(style: CSSStyleDeclaration): number {
  const explicitLineHeight = parsePx(style.lineHeight);

  if (explicitLineHeight > 0) {
    return explicitLineHeight;
  }

  return parsePx(style.fontSize) * 1.5;
}

function resolveLetterSpacing(style: CSSStyleDeclaration): number | undefined {
  if (style.letterSpacing === "normal") {
    return undefined;
  }

  const letterSpacing = parsePx(style.letterSpacing);

  return letterSpacing === 0 ? undefined : letterSpacing;
}

export function Textarea({
  autosize = false,
  className,
  maxRows,
  rows,
  ...props
}: TextareaProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!autosize) {
      return;
    }

    const container = containerRef.current;

    if (container === null) {
      return;
    }

    const textarea = container.querySelector("textarea");

    if (!(textarea instanceof HTMLTextAreaElement)) {
      return;
    }

    let frameId = 0;

    const measure = () => {
      const style = window.getComputedStyle(textarea);
      const paddingX = parsePx(style.paddingLeft) + parsePx(style.paddingRight);
      const paddingY = parsePx(style.paddingTop) + parsePx(style.paddingBottom);
      const borderY =
        parsePx(style.borderTopWidth) + parsePx(style.borderBottomWidth);
      const contentWidth = Math.max(1, textarea.clientWidth - paddingX);
      const lineHeight = resolveLineHeight(style);
      const minRows = rows && rows > 0 ? rows : 3;
      const letterSpacing = resolveLetterSpacing(style);
      const measurement = layout(
        prepare(textarea.value, resolveFont(style), {
          whiteSpace: "pre-wrap",
          ...(letterSpacing !== undefined ? { letterSpacing } : {}),
        }),
        contentWidth,
        lineHeight,
      );
      const rawLineCount = Math.max(measurement.lineCount, minRows);
      const clampedLineCount =
        maxRows !== undefined ? Math.min(rawLineCount, maxRows) : rawLineCount;
      const outerHeight = Math.ceil(
        clampedLineCount * lineHeight + paddingY + borderY,
      );

      textarea.style.height = `${outerHeight}px`;
      textarea.style.overflowY =
        maxRows !== undefined && rawLineCount > maxRows ? "auto" : "hidden";
    };

    const scheduleMeasurement = () => {
      if (frameId !== 0) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        frameId = 0;
        measure();
      });
    };

    const resizeObserver = new ResizeObserver(scheduleMeasurement);
    resizeObserver.observe(container);
    textarea.addEventListener("input", scheduleMeasurement);
    scheduleMeasurement();

    return () => {
      if (frameId !== 0) {
        cancelAnimationFrame(frameId);
      }

      textarea.removeEventListener("input", scheduleMeasurement);
      resizeObserver.disconnect();
    };
  }, [
    autosize,
    maxRows,
    rows,
    props.defaultValue,
    props.placeholder,
    props.value,
  ]);

  return (
    <span
      ref={containerRef}
      data-slot="control"
      className="relative block w-full"
    >
      <TextArea
        {...props}
        rows={rows}
        className={cx(
          twJoin([
            "field-sizing-content relative block min-h-16 w-full appearance-none rounded-lg bg-(--control-bg,transparent) px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]",
            "text-base/6 text-fg placeholder:text-muted-fg sm:text-sm/6",
            "border border-input enabled:hover:border-muted-fg/30",
            "outline-hidden focus:border-ring/70 focus:ring-3 focus:ring-ring/20 focus:enabled:hover:border-ring/80",
            "invalid:border-danger-subtle-fg/70 focus:invalid:border-danger-subtle-fg/70 focus:invalid:ring-danger-subtle-fg/20 invalid:enabled:hover:border-danger-subtle-fg/80 invalid:focus:enabled:hover:border-danger-subtle-fg/80",
            "disabled:bg-muted forced-colors:in-disabled:text-[GrayText]",
            "in-disabled:bg-muted forced-colors:in-disabled:text-[GrayText]",
            "dark:scheme-dark",
            autosize && "resize-none overflow-y-hidden",
          ]),
          className,
        )}
      />
    </span>
  );
}
