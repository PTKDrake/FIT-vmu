import { twMerge } from "tailwind-merge";
import { Separator } from "@/components/ui/separator";
import { getPuckImageUrl } from "@/lib/puck/media";
import { getPuckBlockDomId, isPuckEditorPreview } from "./shared";
import { getSurfaceClassName, puckSurfaceFields } from "./surface";
import type { PageBuilderComponentConfig } from "./types";

// --- HELPER CLASSES & FUNCTIONS ---

export function getHideOnClass(
  hideOn?: "none" | "mobile" | "tablet" | "desktop",
) {
  switch (hideOn) {
    case "mobile":
      return "hidden sm:block";
    case "tablet":
      return "sm:hidden lg:block";
    case "desktop":
      return "lg:hidden";
    default:
      return "";
  }
}

export function getGapClass(gap?: "sm" | "md" | "lg" | "xl" | number) {
  if (typeof gap === "number") {
    if (gap <= 16) {
      return "gap-4";
    }

    if (gap <= 24) {
      return "gap-6";
    }

    if (gap <= 32) {
      return "gap-8";
    }

    return "gap-12";
  }

  const gapClasses = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
    xl: "gap-12",
  };

  return gap ? (gapClasses[gap] ?? "gap-8") : "gap-8"; // lg as default
}

export function getGapAxisClass(
  axis: "x" | "y",
  gap?: "sm" | "md" | "lg" | "xl",
) {
  const gapClasses = {
    sm: axis === "x" ? "gap-x-4" : "gap-y-4",
    md: axis === "x" ? "gap-x-6" : "gap-y-6",
    lg: axis === "x" ? "gap-x-8" : "gap-y-8",
    xl: axis === "x" ? "gap-x-12" : "gap-y-12",
  };

  return gap ? (gapClasses[gap] ?? gapClasses.lg) : gapClasses.lg;
}

export function getPaddingTopClass(paddingTop?: "none" | "sm" | "md" | "lg") {
  const ptClasses = {
    none: "pt-0",
    sm: "pt-4 sm:pt-6",
    md: "pt-10 sm:pt-16",
    lg: "pt-16 sm:pt-24",
  };

  return paddingTop ? ptClasses[paddingTop] : "";
}

export function getPaddingBottomClass(
  paddingBottom?: "none" | "sm" | "md" | "lg",
) {
  const pbClasses = {
    none: "pb-0",
    sm: "pb-4 sm:pb-6",
    md: "pb-10 sm:pb-16",
    lg: "pb-16 sm:pb-24",
  };

  return paddingBottom ? pbClasses[paddingBottom] : "";
}

export function getPaddingXClass(paddingX?: "none" | "sm" | "md" | "lg") {
  const pxClasses = {
    none: "px-0",
    sm: "px-4 sm:px-6",
    md: "px-4 sm:px-6 md:px-8",
    lg: "px-5 sm:px-8 md:px-10",
  };

  return paddingX ? pxClasses[paddingX] : "";
}

export function getInsetYClass(insetY?: "none" | "xs" | "sm" | "md" | "lg") {
  const insetClasses = {
    none: "py-0",
    xs: "py-2",
    sm: "py-3 sm:py-4",
    md: "py-4 sm:py-6",
    lg: "py-8 sm:py-10",
  };

  return insetY ? insetClasses[insetY] : "";
}

export function getStickyTopClass(stickyTop?: "sm" | "md" | "lg" | "xl") {
  const stickyTopClasses = {
    sm: "lg:top-4",
    md: "lg:top-6",
    lg: "lg:top-8",
    xl: "lg:top-10",
  };

  return stickyTop ? stickyTopClasses[stickyTop] : stickyTopClasses.md;
}

export function getBackgroundClass(background?: string) {
  const bgClasses: Record<string, string> = {
    transparent: "bg-transparent text-fg",
    none: "bg-transparent text-fg",
    primarySubtle:
      "bg-primary-subtle/10 border border-primary-subtle/20 text-fg shadow-xs",
    "primary-subtle":
      "bg-primary-subtle/10 border border-primary-subtle/20 text-fg shadow-xs",
    infoSubtle:
      "bg-info-subtle/10 border border-info-subtle/20 text-fg shadow-xs",
    "info-subtle":
      "bg-info-subtle/10 border border-info-subtle/20 text-fg shadow-xs",
    dark: "bg-accent-subtle-fg text-bg shadow-sm",
  };

  return background
    ? (bgClasses[background] ?? "bg-transparent text-fg")
    : "bg-transparent text-fg";
}

export function getMinHeightClass(minHeight?: "auto" | "md" | "lg" | "screen") {
  const mhClasses = {
    auto: "min-h-0",
    md: "min-h-[400px] sm:min-h-[500px]",
    lg: "min-h-[600px] sm:min-h-[750px]",
    screen: "min-h-screen",
  };

  return minHeight ? mhClasses[minHeight] : "min-h-0";
}

export function getOverlayClass(
  overlay?: "none" | "light" | "dark" | "primary",
) {
  const overlayClasses = {
    none: "",
    light: "absolute inset-0 bg-bg/70 z-0 pointer-events-none",
    dark: "absolute inset-0 bg-fg/45 z-0 pointer-events-none",
    primary: "absolute inset-0 bg-primary/15 z-0 pointer-events-none",
  };

  return overlay ? overlayClasses[overlay] : "";
}

export function getBorderRadiusClass(
  borderRadius?: "none" | "lg" | "xl" | "2xl" | "3xl",
) {
  const radiusClasses = {
    none: "rounded-none",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
  };

  return borderRadius ? radiusClasses[borderRadius] : "";
}

export function getAlignItemsClass(
  alignItems?: "start" | "center" | "stretch",
) {
  const alignClasses = {
    start: "items-start",
    center: "items-center",
    stretch: "items-stretch",
  };

  return alignItems ? alignClasses[alignItems] : "items-stretch";
}

export function getJustifyItemsClass(
  justifyItems?: "start" | "center" | "end" | "stretch",
) {
  const justifyClasses = {
    start: "justify-items-start",
    center: "justify-items-center",
    end: "justify-items-end",
    stretch: "justify-items-stretch",
  };

  return justifyItems ? justifyClasses[justifyItems] : "justify-items-stretch";
}

// 1. SECTION LAYOUT BLOCK
export const SectionComponentConfig: PageBuilderComponentConfig<"Section"> = {
  label: "Vùng nội dung (Section)",
  defaultProps: {
    background: "transparent",
    paddingTop: "md",
    paddingBottom: "md",
    paddingX: "none",
    minHeight: "auto",
    backgroundPosition: "center",
    backgroundSize: "cover",
    overlay: "none",
    contentAlign: "top",
    borderRadius: "none",
    hideOn: "none",
    className: "",
  },
  fields: {
    anchorId: {
      type: "text",
      label: "ID điều hướng",
    },
    ...puckSurfaceFields,
    background: {
      type: "select",
      label: "Kiểu nền",
      options: [
        { label: "Không màu", value: "transparent" },
        { label: "Xanh nhạt", value: "primarySubtle" },
        { label: "Trời nhạt", value: "infoSubtle" },
        { label: "Nền tối", value: "dark" },
      ],
    },
    paddingTop: {
      type: "select",
      label: "Khoảng đệm trên",
      options: [
        { label: "Không", value: "none" },
        { label: "Nhỏ", value: "sm" },
        { label: "Vừa", value: "md" },
        { label: "Lớn", value: "lg" },
      ],
    },
    paddingBottom: {
      type: "select",
      label: "Khoảng đệm dưới",
      options: [
        { label: "Không", value: "none" },
        { label: "Nhỏ", value: "sm" },
        { label: "Vừa", value: "md" },
        { label: "Lớn", value: "lg" },
      ],
    },
    paddingX: {
      type: "select",
      label: "Khoảng đệm ngang",
      options: [
        { label: "Không", value: "none" },
        { label: "Nhỏ", value: "sm" },
        { label: "Vừa", value: "md" },
        { label: "Lớn", value: "lg" },
      ],
    },
    minHeight: {
      type: "select",
      label: "Chiều cao tối thiểu",
      options: [
        { label: "Tự động", value: "auto" },
        { label: "Vừa", value: "md" },
        { label: "Lớn", value: "lg" },
        { label: "Đầy màn hình", value: "screen" },
      ],
    },
    backgroundImage: {
      type: "text",
      label: "URL ảnh nền",
    },
    backgroundPosition: {
      type: "select",
      label: "Vị trí ảnh nền",
      options: [
        { label: "Trên", value: "top" },
        { label: "Giữa", value: "center" },
        { label: "Dưới", value: "bottom" },
      ],
    },
    backgroundSize: {
      type: "select",
      label: "Cách hiển thị ảnh nền",
      options: [
        { label: "Phủ kín", value: "cover" },
        { label: "Hiển thị toàn ảnh", value: "contain" },
        { label: "Kích thước gốc", value: "auto" },
      ],
    },
    overlay: {
      type: "select",
      label: "Lớp phủ màu",
      options: [
        { label: "Không", value: "none" },
        { label: "Sáng", value: "light" },
        { label: "Tối", value: "dark" },
        { label: "Xanh", value: "primary" },
      ],
    },
    contentAlign: {
      type: "select",
      label: "Canh nội dung theo chiều dọc",
      options: [
        { label: "Trên", value: "top" },
        { label: "Giữa", value: "center" },
        { label: "Dưới", value: "bottom" },
      ],
    },
    borderRadius: {
      type: "select",
      label: "Bo góc khối",
      options: [
        { label: "Không", value: "none" },
        { label: "Nhẹ", value: "lg" },
        { label: "Vừa", value: "xl" },
        { label: "Lớn", value: "2xl" },
        { label: "Rất lớn", value: "3xl" },
      ],
    },
    hideOn: {
      type: "select",
      label: "Ẩn theo thiết bị",
      options: [
        { label: "Không ẩn", value: "none" },
        { label: "Di động", value: "mobile" },
        { label: "Máy tính bảng", value: "tablet" },
        { label: "Máy tính", value: "desktop" },
      ],
    },
    className: {
      type: "text",
      label: "CSS class bổ sung",
    },
    children: {
      type: "slot",
      label: "Nội dung",
    },
  },
  render: (props) => {
    const {
      background,
      paddingTop,
      paddingBottom,
      paddingY,
      paddingX,
      minHeight,
      backgroundImage,
      backgroundPosition,
      backgroundSize,
      overlay,
      contentAlign,
      borderRadius,
      anchorId,
      hideOn,
      className,
      children: Children,
    } = props;
    const id = getPuckBlockDomId((props as { id?: string }).id, anchorId);
    const resolvedBackgroundImage = getPuckImageUrl(backgroundImage);

    // Backward compatibility for paddingY
    const pt = paddingTop ?? paddingY ?? "md";
    const pb = paddingBottom ?? paddingY ?? "md";
    const emptyPreviewClass = isPuckEditorPreview()
      ? "empty:min-h-20 empty:min-w-20 empty:w-full empty:rounded-2xl empty:border empty:border-dashed empty:border-border/50 empty:bg-muted/20"
      : "";

    const alignClass =
      minHeight && minHeight !== "auto"
        ? {
            top: "justify-start",
            center: "justify-center",
            bottom: "justify-end",
          }[contentAlign || "top"]
        : "";

    return (
      <section
        id={id}
        className={twMerge(
          "relative w-full transition-colors duration-300",
          getBackgroundClass(background),
          getPaddingTopClass(pt),
          getPaddingBottomClass(pb),
          getPaddingXClass(paddingX),
          getMinHeightClass(minHeight),
          getBorderRadiusClass(borderRadius),
          getSurfaceClassName(props, "", { includeDefaults: false }),
          minHeight && minHeight !== "auto" ? "flex flex-col" : "",
          alignClass,
          getHideOnClass(hideOn),
          className,
        )}
        style={
          resolvedBackgroundImage
            ? {
                backgroundImage: `url(${resolvedBackgroundImage})`,
                backgroundSize: backgroundSize || "cover",
                backgroundPosition: backgroundPosition || "center",
                backgroundRepeat: "no-repeat",
              }
            : undefined
        }
      >
        {resolvedBackgroundImage && overlay && overlay !== "none" && (
          <div className={getOverlayClass(overlay)} />
        )}
        <div
          className={twMerge(
            "relative z-10 w-full",
            minHeight && minHeight !== "auto"
              ? "flex h-full flex-col grow"
              : "",
          )}
        >
          <Children
            className={twMerge("h-full w-full", emptyPreviewClass)}
            minEmptyHeight={96}
          />
        </div>
      </section>
    );
  },
};

// 2. CONTAINER LAYOUT BLOCK
export const ContainerComponentConfig: PageBuilderComponentConfig<"Container"> =
  {
    label: "Giới hạn chiều rộng (Container)",
    defaultProps: {
      maxWidth: "lg",
      horizontalPadding: "md",
      align: "center",
      insetY: "none",
      stackChildren: false,
      childGap: "md",
      stickyOnDesktop: false,
      stickyTop: "md",
      hideOn: "none",
      className: "",
    },
    fields: {
      anchorId: {
        type: "text",
        label: "ID điều hướng",
      },
      ...puckSurfaceFields,
      maxWidth: {
        type: "select",
        label: "Chiều rộng tối đa",
        options: [
          { label: "Nhỏ", value: "sm" },
          { label: "Vừa", value: "md" },
          { label: "Lớn", value: "lg" },
          { label: "Rất lớn", value: "xl" },
          { label: "Cực lớn", value: "2xl" },
          { label: "Tràn màn hình", value: "full" },
        ],
      },
      horizontalPadding: {
        type: "select",
        label: "Khoảng đệm ngang",
        options: [
          { label: "Không", value: "none" },
          { label: "Nhỏ", value: "sm" },
          { label: "Vừa", value: "md" },
          { label: "Lớn", value: "lg" },
        ],
      },
      align: {
        type: "select",
        label: "Canh container",
        options: [
          { label: "Giữa", value: "center" },
          { label: "Trái", value: "left" },
          { label: "Phải", value: "right" },
        ],
      },
      insetY: {
        type: "select",
        label: "Khoảng đệm trên và dưới",
        options: [
          { label: "Không", value: "none" },
          { label: "Rất nhỏ", value: "xs" },
          { label: "Nhỏ", value: "sm" },
          { label: "Vừa", value: "md" },
          { label: "Lớn", value: "lg" },
        ],
      },
      stackChildren: {
        type: "radio",
        label: "Xếp các block con theo cột",
        options: [
          { label: "Có", value: true },
          { label: "Không", value: false },
        ],
      },
      childGap: {
        type: "select",
        label: "Khoảng cách giữa các block con",
        options: [
          { label: "Nhỏ", value: "sm" },
          { label: "Vừa", value: "md" },
          { label: "Lớn", value: "lg" },
          { label: "Rất lớn", value: "xl" },
        ],
      },
      stickyOnDesktop: {
        type: "radio",
        label: "Sticky trên desktop",
        options: [
          { label: "Có", value: true },
          { label: "Không", value: false },
        ],
      },
      stickyTop: {
        type: "select",
        label: "Khoảng cách sticky từ đỉnh",
        options: [
          { label: "Nhỏ", value: "sm" },
          { label: "Vừa", value: "md" },
          { label: "Lớn", value: "lg" },
          { label: "Rất lớn", value: "xl" },
        ],
      },
      hideOn: {
        type: "select",
        label: "Ẩn theo thiết bị",
        options: [
          { label: "Không ẩn", value: "none" },
          { label: "Di động", value: "mobile" },
          { label: "Máy tính bảng", value: "tablet" },
          { label: "Máy tính", value: "desktop" },
        ],
      },
      className: {
        type: "text",
        label: "CSS class bổ sung",
      },
      children: {
        type: "slot",
        label: "Nội dung",
      },
    },
    render: (props) => {
      const {
        anchorId,
        maxWidth,
        paddingX,
        horizontalPadding,
        align,
        insetY,
        stackChildren,
        childGap,
        stickyOnDesktop,
        stickyTop,
        hideOn,
        className,
        children: Children,
      } = props;
      const id = getPuckBlockDomId((props as { id?: string }).id, anchorId);

      const widthClass = {
        sm: "max-w-3xl",
        md: "max-w-5xl",
        lg: "max-w-7xl",
        xl: "max-w-[1440px]",
        "2xl": "max-w-[1680px]",
        full: "max-w-full",
      }[maxWidth || "lg"];

      const alignClass = {
        center: "mx-auto",
        left: "mr-auto ml-0",
        right: "ml-auto mr-0",
      }[align || "center"];

      const resolvedHorizontalPadding =
        horizontalPadding ??
        (paddingX === false || paddingX === "no"
          ? "none"
          : paddingX === true || paddingX === "yes" || paddingX === undefined
            ? "md"
            : "none");
      const emptyPreviewClass = isPuckEditorPreview()
        ? "empty:min-h-20 empty:min-w-20 empty:w-full empty:rounded-2xl empty:border empty:border-dashed empty:border-border/50 empty:bg-muted/20"
        : "";
      const stickyClassName = stickyOnDesktop
        ? twMerge("lg:sticky", getStickyTopClass(stickyTop))
        : "";
      const childrenClassName = twMerge(
        "w-full",
        stackChildren ? "flex flex-col" : "",
        stackChildren ? getGapClass(childGap) : "",
        emptyPreviewClass,
      );

      return (
        <div
          id={id}
          className={twMerge(
            "@container w-full min-w-0",
            stickyClassName,
            alignClass,
            widthClass,
            getPaddingXClass(resolvedHorizontalPadding),
            getInsetYClass(insetY),
            getSurfaceClassName(props, "", { includeDefaults: false }),
            getHideOnClass(hideOn),
            className,
          )}
        >
          <Children className={childrenClassName} minEmptyHeight={96} />
        </div>
      );
    },
  };

// 3. TWO COLUMNS LAYOUT BLOCK
export const TwoColumnsComponentConfig: PageBuilderComponentConfig<"TwoColumns"> =
  {
    label: "2 cột nội dung",
    defaultProps: {
      columnRatio: "equal",
      gap: "lg",
      stackOnMobile: true,
      reverseOnMobile: false,
      verticalAlign: "center",
      hideOn: "none",
      className: "",
    },
    fields: {
      anchorId: {
        type: "text",
        label: "ID điều hướng",
      },
      ...puckSurfaceFields,
      columnRatio: {
        type: "select",
        label: "Tỷ lệ 2 cột",
        options: [
          { label: "Đều nhau", value: "equal" },
          { label: "Trái rộng", value: "leftWide" },
          { label: "Phải rộng", value: "rightWide" },
        ],
      },
      gap: {
        type: "select",
        label: "Khoảng cách giữa 2 cột",
        options: [
          { label: "Nhỏ", value: "sm" },
          { label: "Vừa", value: "md" },
          { label: "Lớn", value: "lg" },
          { label: "Rất lớn", value: "xl" },
        ],
      },
      stackOnMobile: {
        type: "radio",
        label: "Xếp thành 1 cột trên mobile",
        options: [
          { label: "Có", value: true as any },
          { label: "Không", value: false as any },
        ],
      },
      reverseOnMobile: {
        type: "radio",
        label: "Đảo thứ tự trên mobile",
        options: [
          { label: "Có", value: true as any },
          { label: "Không", value: false as any },
        ],
      },
      verticalAlign: {
        type: "select",
        label: "Canh 2 cột theo chiều dọc",
        options: [
          { label: "Trên", value: "top" },
          { label: "Giữa", value: "center" },
          { label: "Dưới", value: "bottom" },
          { label: "Kéo giãn", value: "stretch" },
        ],
      },
      hideOn: {
        type: "select",
        label: "Ẩn theo thiết bị",
        options: [
          { label: "Không ẩn", value: "none" },
          { label: "Di động", value: "mobile" },
          { label: "Máy tính bảng", value: "tablet" },
          { label: "Máy tính", value: "desktop" },
        ],
      },
      className: {
        type: "text",
        label: "CSS class bổ sung",
      },
      left: {
        type: "slot",
        label: "Nội dung cột trái",
      },
      right: {
        type: "slot",
        label: "Nội dung cột phải",
      },
    },
    render: (props) => {
      const {
        columnRatio,
        gap,
        stackOnMobile,
        reverseOnMobile,
        verticalAlign,
        anchorId,
        hideOn,
        className,
        left: Left,
        right: Right,
      } = props;
      const id = getPuckBlockDomId((props as { id?: string }).id, anchorId);

      const ratioClass = {
        equal: "grid-cols-1 md:grid-cols-2 @3xl:grid-cols-2",
        leftWide: "grid-cols-1 md:grid-cols-[2fr_1fr] @3xl:grid-cols-[2fr_1fr]",
        rightWide:
          "grid-cols-1 md:grid-cols-[1fr_2fr] @3xl:grid-cols-[1fr_2fr]",
        // Backwards compatibility mappings:
        "1:1": "grid-cols-1 md:grid-cols-2 @3xl:grid-cols-2",
        "2:1": "grid-cols-1 md:grid-cols-[2fr_1fr] @3xl:grid-cols-[2fr_1fr]",
        "1:2": "grid-cols-1 md:grid-cols-[1fr_2fr] @3xl:grid-cols-[1fr_2fr]",
      }[columnRatio || "equal"];

      const isStack = stackOnMobile !== false;
      const isReverse = reverseOnMobile === true;

      const gapStyle =
        typeof gap === "number" ? { gap: `${gap}px` } : undefined;

      const wrapperClass = twMerge(
        "@container grid w-full min-w-0 items-start gap-6 md:gap-8",
        isStack
          ? twMerge(
              "flex",
              isReverse ? "flex-col-reverse" : "flex-col",
              "md:grid @3xl:grid",
              ratioClass,
            )
          : twMerge("grid", ratioClass),
        typeof gap === "number" ? undefined : getGapClass(gap),
        getSurfaceClassName(props, "", { includeDefaults: false }),
        verticalAlign
          ? {
              top: "items-start",
              center: "items-center",
              bottom: "items-end",
              stretch: "items-stretch",
            }[verticalAlign]
          : "items-center",
        getHideOnClass(hideOn),
        className,
      );

      const emptyPreviewClass = isPuckEditorPreview()
        ? "empty:min-h-20 empty:w-full empty:rounded-2xl empty:border empty:border-dashed empty:border-border/50 empty:bg-muted/20 empty:flex empty:items-center empty:justify-center"
        : "";

      return (
        <div id={id} className={wrapperClass} style={gapStyle}>
          <div className="flex h-full w-full flex-col">
            <Left
              className={twMerge(
                "w-full rounded-2xl border border-border/60 bg-overlay/50 p-4 shadow-xs",
                emptyPreviewClass,
              )}
              minEmptyHeight={96}
            />
          </div>
          <div className="flex h-full w-full flex-col">
            <Right
              className={twMerge(
                "w-full rounded-2xl border border-border/60 bg-overlay/50 p-4 shadow-xs",
                emptyPreviewClass,
              )}
              minEmptyHeight={96}
            />
          </div>
        </div>
      );
    },
  };

// 4. SPACER LAYOUT BLOCK
export const SpacerComponentConfig: PageBuilderComponentConfig<"Spacer"> = {
  label: "Khoảng cách dọc (Spacer)",
  defaultProps: {
    height: "md",
    mobileHeight: "sm",
    hideOn: "none",
    className: "",
  },
  fields: {
    anchorId: {
      type: "text",
      label: "ID điều hướng",
    },
    height: {
      type: "select",
      label: "Chiều cao từ tablet trở lên",
      options: [
        { label: "Cực nhỏ", value: "xs" },
        { label: "Nhỏ", value: "sm" },
        { label: "Vừa", value: "md" },
        { label: "Lớn", value: "lg" },
        { label: "Cực lớn", value: "xl" },
      ],
    },
    mobileHeight: {
      type: "select",
      label: "Chiều cao trên mobile",
      options: [
        { label: "Cực nhỏ", value: "xs" },
        { label: "Nhỏ", value: "sm" },
        { label: "Vừa", value: "md" },
        { label: "Lớn", value: "lg" },
        { label: "Cực lớn", value: "xl" },
      ],
    },
    hideOn: {
      type: "select",
      label: "Ẩn theo thiết bị",
      options: [
        { label: "Không ẩn", value: "none" },
        { label: "Di động", value: "mobile" },
        { label: "Máy tính bảng", value: "tablet" },
        { label: "Máy tính", value: "desktop" },
      ],
    },
    className: {
      type: "text",
      label: "CSS class bổ sung",
    },
  },
  render: (props) => {
    const { anchorId, height, mobileHeight, hideOn, className } = props;
    const id = getPuckBlockDomId((props as { id?: string }).id, anchorId);

    const desktopHeightClass = {
      xs: "sm:h-4",
      sm: "sm:h-8",
      md: "sm:h-16",
      lg: "sm:h-24",
      xl: "sm:h-36",
    }[height || "md"];

    const activeMobileHeight = mobileHeight || height || "sm";
    const mobileHeightClass = {
      xs: "h-3",
      sm: "h-6",
      md: "h-12",
      lg: "h-20",
      xl: "h-28",
    }[activeMobileHeight];

    return (
      <div
        id={id}
        className={twMerge(
          "w-full clear-both",
          mobileHeightClass,
          desktopHeightClass,
          getHideOnClass(hideOn),
          className,
        )}
      />
    );
  },
};

// 5. DIVIDER LAYOUT BLOCK
export const DividerComponentConfig: PageBuilderComponentConfig<"Divider"> = {
  label: "Đường phân tách (Divider)",
  defaultProps: {
    type: "solid",
    color: "default",
    spacingY: "md",
    width: "full",
    align: "center",
    hideOn: "none",
    className: "",
  },
  fields: {
    anchorId: {
      type: "text",
      label: "ID điều hướng",
    },
    type: {
      type: "select",
      label: "Kiểu đường kẻ",
      options: [
        { label: "Liền mạch", value: "solid" },
        { label: "Đứt nét", value: "dashed" },
        { label: "Chấm nét", value: "dotted" },
      ],
    },
    color: {
      type: "select",
      label: "Màu đường kẻ",
      options: [
        { label: "Mặc định", value: "default" },
        { label: "Nổi bật", value: "primary" },
        { label: "Mờ", value: "muted" },
      ],
    },
    spacingY: {
      type: "select",
      label: "Khoảng cách trên và dưới",
      options: [
        { label: "Không", value: "none" },
        { label: "Nhỏ", value: "sm" },
        { label: "Vừa", value: "md" },
        { label: "Lớn", value: "lg" },
      ],
    },
    width: {
      type: "select",
      label: "Độ dài đường kẻ",
      options: [
        { label: "Đầy đủ (100%)", value: "full" },
        { label: "Rất lớn (max-w-5xl)", value: "xl" },
        { label: "Lớn (max-w-3xl)", value: "lg" },
        { label: "Vừa (max-w-xl)", value: "md" },
        { label: "Nhỏ (max-w-sm)", value: "sm" },
        { label: "Ngắn (w-24)", value: "short" },
      ],
    },
    align: {
      type: "select",
      label: "Canh đường kẻ",
      options: [
        { label: "Trái", value: "left" },
        { label: "Giữa", value: "center" },
        { label: "Phải", value: "right" },
      ],
    },
    hideOn: {
      type: "select",
      label: "Ẩn theo thiết bị",
      options: [
        { label: "Không ẩn", value: "none" },
        { label: "Di động", value: "mobile" },
        { label: "Máy tính bảng", value: "tablet" },
        { label: "Máy tính", value: "desktop" },
      ],
    },
    className: {
      type: "text",
      label: "CSS class bổ sung",
    },
  },
  render: (props) => {
    const { type, color, spacingY, width, align, anchorId, hideOn, className } =
      props;
    const id = getPuckBlockDomId((props as { id?: string }).id, anchorId);

    const activeColor =
      (color as string) === "border" ? "default" : color || "default";
    const borderColorClass = {
      default: "bg-border",
      primary: "bg-primary/45",
      muted: "bg-border/30",
    }[activeColor];

    const spacingYClass = {
      none: "py-0",
      sm: "py-4",
      md: "py-8",
      lg: "py-12",
    }[spacingY || "md"];

    const widthClass = {
      full: "w-full",
      container: "max-w-7xl mx-auto px-4 sm:px-6 md:px-8",
      xl: "max-w-5xl mx-auto",
      lg: "max-w-3xl mx-auto",
      md: "max-w-xl mx-auto",
      sm: "max-w-sm mx-auto",
      short: "w-24",
    }[width || "full"];

    const alignClass = {
      left: "mr-auto ml-0",
      center: "mx-auto",
      right: "ml-auto mr-0",
    }[align || "center"];

    return (
      <div
        id={id}
        className={twMerge(
          "w-full",
          spacingYClass,
          getHideOnClass(hideOn),
          className,
        )}
      >
        <Separator
          className={twMerge(
            "h-px border-0",
            borderColorClass,
            widthClass,
            width === "short" ? alignClass : "",
            type === "dashed" && "bg-transparent border-t border-dashed",
            type === "dotted" && "bg-transparent border-t border-dotted",
          )}
        />
      </div>
    );
  },
};
