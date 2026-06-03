import { twMerge } from "tailwind-merge";

export type PuckSurfaceTone =
  | "transparent"
  | "bg"
  | "overlay"
  | "muted"
  | "subtle";

export type PuckSurfaceBorder =
  | "none"
  | "subtle"
  | "default"
  | "strong"
  | "dashed";

export type PuckSurfaceRadius =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "full";

export type PuckSurfacePadding = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export type PuckSurfaceShadow = "none" | "sm" | "md";

export interface PuckSurfaceStyleProps {
  surfaceTone?: PuckSurfaceTone;
  surfaceBorder?: PuckSurfaceBorder;
  surfaceRadius?: PuckSurfaceRadius;
  surfacePadding?: PuckSurfacePadding;
  surfaceShadow?: PuckSurfaceShadow;
}

export const puckSurfaceDefaultProps: Required<PuckSurfaceStyleProps> = {
  surfaceTone: "overlay",
  surfaceBorder: "default",
  surfaceRadius: "3xl",
  surfacePadding: "lg",
  surfaceShadow: "sm",
};

export const puckSurfaceFields = {
  surfaceTone: {
    type: "select",
    label: "Kiểu nền",
    options: [
      { label: "Trong suốt", value: "transparent" },
      { label: "Nền cơ bản", value: "bg" },
      { label: "Nền nổi", value: "overlay" },
      { label: "Nền mờ", value: "muted" },
      { label: "Nền nhạt", value: "subtle" },
    ],
  },
  surfaceBorder: {
    type: "select",
    label: "Kiểu viền",
    options: [
      { label: "Không viền", value: "none" },
      { label: "Mảnh", value: "subtle" },
      { label: "Chuẩn", value: "default" },
      { label: "Đậm", value: "strong" },
      { label: "Nét đứt", value: "dashed" },
    ],
  },
  surfaceRadius: {
    type: "select",
    label: "Bo góc",
    options: [
      { label: "Không bo", value: "none" },
      { label: "Nhỏ", value: "sm" },
      { label: "Vừa", value: "md" },
      { label: "Lớn", value: "lg" },
      { label: "Rất lớn", value: "xl" },
      { label: "2XL", value: "2xl" },
      { label: "3XL", value: "3xl" },
      { label: "Tròn", value: "full" },
    ],
  },
  surfacePadding: {
    type: "select",
    label: "Khoảng đệm",
    options: [
      { label: "Không", value: "none" },
      { label: "Rất nhỏ", value: "xs" },
      { label: "Nhỏ", value: "sm" },
      { label: "Vừa", value: "md" },
      { label: "Lớn", value: "lg" },
      { label: "Rất lớn", value: "xl" },
    ],
  },
  surfaceShadow: {
    type: "select",
    label: "Đổ bóng",
    options: [
      { label: "Không", value: "none" },
      { label: "Nhẹ", value: "sm" },
      { label: "Vừa", value: "md" },
    ],
  },
} as const;

export function getSurfaceToneClass(surfaceTone?: PuckSurfaceTone): string {
  const toneClasses: Record<PuckSurfaceTone, string> = {
    transparent: "bg-transparent",
    bg: "bg-bg",
    overlay: "bg-overlay/90",
    muted: "bg-muted/40",
    subtle: "bg-muted/20",
  };

  return toneClasses[surfaceTone ?? "transparent"];
}

export function getSurfaceBorderClass(
  surfaceBorder?: PuckSurfaceBorder,
): string {
  const borderClasses: Record<PuckSurfaceBorder, string> = {
    none: "border-0",
    subtle: "border border-border/50",
    default: "border border-border",
    strong: "border border-border/80",
    dashed: "border border-dashed border-border/60",
  };

  return borderClasses[surfaceBorder ?? "none"];
}

export function getSurfaceRadiusClass(
  surfaceRadius?: PuckSurfaceRadius,
): string {
  const radiusClasses: Record<PuckSurfaceRadius, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  };

  return radiusClasses[surfaceRadius ?? "none"];
}

export function getSurfacePaddingClass(
  surfacePadding?: PuckSurfacePadding,
): string {
  const paddingClasses: Record<PuckSurfacePadding, string> = {
    none: "p-0",
    xs: "p-2",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  };

  return paddingClasses[surfacePadding ?? "none"];
}

export function getSurfaceShadowClass(
  surfaceShadow?: PuckSurfaceShadow,
): string {
  const shadowClasses: Record<PuckSurfaceShadow, string> = {
    none: "shadow-none",
    sm: "shadow-xs",
    md: "shadow-sm",
  };

  return shadowClasses[surfaceShadow ?? "none"];
}

export function getSurfaceClassName(
  props: PuckSurfaceStyleProps,
  baseClassName = "",
): string {
  return twMerge(
    baseClassName,
    getSurfaceToneClass(props.surfaceTone),
    getSurfaceBorderClass(props.surfaceBorder),
    getSurfaceRadiusClass(props.surfaceRadius),
    getSurfacePaddingClass(props.surfacePadding),
    getSurfaceShadowClass(props.surfaceShadow),
  );
}
