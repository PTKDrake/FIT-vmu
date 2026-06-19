import type { CSSProperties, ReactNode } from "react";
import { Children, cloneElement, isValidElement } from "react";
import { twMerge } from "tailwind-merge";
import { getPuckEnglishName } from "@/lib/puck/component-types";

interface PuckDrawerItemProps {
  className?: string;
  children?: ReactNode;
  name?: string;
  [key: string]: unknown;
}

function stripEnglishSuffix(label: string, englishName: string): string {
  const suffix = ` (${englishName})`;

  if (englishName.length > 0 && label.endsWith(suffix)) {
    return label.slice(0, -suffix.length);
  }

  return label;
}

function mergeStyle(
  currentStyle: unknown,
  extraStyle: CSSProperties,
): CSSProperties {
  return {
    ...(currentStyle as CSSProperties | undefined),
    ...extraStyle,
  };
}

function normalizeDrawerChildren(
  node: ReactNode,
  englishName: string,
): ReactNode {
  return Children.map(node, (child) => {
    if (typeof child === "string") {
      return stripEnglishSuffix(child, englishName);
    }

    if (!isValidElement(child)) {
      return child;
    }

    const childProps = child.props as {
      children?: ReactNode;
      className?: string;
      style?: CSSProperties;
    };
    const className = childProps.className ?? "";
    const nextProps: Record<string, unknown> = {};

    if (className.includes("DrawerItem-draggable_")) {
      nextProps.style = mergeStyle(childProps.style, {
        background: "transparent",
        border: 0,
        borderRadius: 0,
        padding: 0,
        fontSize: "0.95rem",
        gap: "0.5rem",
      });
    }

    if (className.includes("DrawerItem-name_")) {
      nextProps.style = mergeStyle(childProps.style, {
        overflow: "visible",
        textOverflow: "clip",
        whiteSpace: "normal",
        fontSize: "0.95rem",
        fontWeight: 500,
        lineHeight: 1.35,
      });
    }

    if ("children" in childProps) {
      nextProps.children = normalizeDrawerChildren(
        childProps.children,
        englishName,
      );
    }

    return cloneElement(child, nextProps);
  });
}

export function PuckDrawerItem({
  className,
  children,
  name,
  ...props
}: PuckDrawerItemProps) {
  const englishName =
    typeof name === "string" && name.length > 0 ? getPuckEnglishName(name) : "";
  const normalizedChildren = normalizeDrawerChildren(children, englishName);

  return (
    <div
      {...(props as Record<string, unknown>)}
      className={twMerge(
        "flex w-full flex-col items-start gap-1 rounded-md border border-border bg-white px-3 py-2 text-left",
        className,
      )}
    >
      {normalizedChildren}

      {englishName ? (
        <span className="text-xs leading-tight text-muted-fg">
          {englishName}
        </span>
      ) : null}
    </div>
  );
}
