import { twMerge } from "tailwind-merge";
import { getHideOnClass, getGapAxisClass } from "./layouts";
import { getPuckBlockDomId, isPuckEditorPreview } from "./shared";
import type { PageBuilderComponentConfig } from "./types";

export const FlexComponentConfig: PageBuilderComponentConfig<"Flex"> = {
  label: "Hàng/Cột linh hoạt (Flex)",
  defaultProps: {
    flexDirection: "row",
    mobileDirection: "column",
    justifyContent: "start",
    alignItems: "center",
    gapX: "md",
    gapY: "md",
    wrap: true,
    childWidth: "auto",
    hideOn: "none",
    className: "",
  },
  fields: {
    anchorId: {
      type: "text",
      label: "ID điều hướng",
    },
    flexDirection: {
      type: "select",
      label: "Hướng từ tablet trở lên",
      options: [
        { label: "Ngang", value: "row" },
        { label: "Dọc", value: "column" },
        { label: "Ngang ngược", value: "rowReverse" },
        { label: "Dọc ngược", value: "columnReverse" },
      ],
    },
    mobileDirection: {
      type: "select",
      label: "Hướng trên mobile",
      options: [
        { label: "Ngang", value: "row" },
        { label: "Dọc", value: "column" },
      ],
    },
    justifyContent: {
      type: "select",
      label: "Phân bố phần tử theo trục chính",
      options: [
        { label: "Đầu", value: "start" },
        { label: "Giữa", value: "center" },
        { label: "Cuối", value: "end" },
        { label: "Giãn giữa", value: "between" },
        { label: "Giãn quanh", value: "around" },
        { label: "Cách đều", value: "evenly" },
      ],
    },
    alignItems: {
      type: "select",
      label: "Canh phần tử theo trục phụ",
      options: [
        { label: "Đầu", value: "start" },
        { label: "Giữa", value: "center" },
        { label: "Cuối", value: "end" },
        { label: "Kéo giãn", value: "stretch" },
      ],
    },
    gapX: {
      type: "select",
      label: "Khoảng cách ngang",
      options: [
        { label: "Nhỏ", value: "sm" },
        { label: "Vừa", value: "md" },
        { label: "Lớn", value: "lg" },
        { label: "Rất lớn", value: "xl" },
      ],
    },
    gapY: {
      type: "select",
      label: "Khoảng cách dọc",
      options: [
        { label: "Nhỏ", value: "sm" },
        { label: "Vừa", value: "md" },
        { label: "Lớn", value: "lg" },
        { label: "Rất lớn", value: "xl" },
      ],
    },
    wrap: {
      type: "radio",
      label: "Cho phép xuống dòng",
      options: [
        { label: "Có", value: true as any },
        { label: "Không", value: false as any },
      ],
    },
    childWidth: {
      type: "select",
      label: "Độ rộng phần tử con",
      options: [
        { label: "Tự động", value: "auto" },
        { label: "Chia đều", value: "equal" },
        { label: "Đầy dòng", value: "full" },
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
      flexDirection,
      mobileDirection,
      justifyContent,
      alignItems,
      gap,
      gapX,
      gapY,
      wrap,
      childWidth,
      hideOn,
      className,
      classes, // backwards compatibility
      children: Children,
    } = props;
    const id = getPuckBlockDomId(
      (props as { id?: string }).id,
      anchorId,
    );

    const mobileDirClass = {
      row: "flex-row",
      column: "flex-col",
    }[mobileDirection || "column"];

    const desktopDirClass = {
      row: "md:flex-row",
      column: "md:flex-col",
      rowReverse: "md:flex-row-reverse",
      "row-reverse": "md:flex-row-reverse",
      columnReverse: "md:flex-col-reverse",
      "column-reverse": "md:flex-col-reverse",
    }[flexDirection || "row"];

    const justifyClass = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    }[justifyContent || "start"];

    const alignClass = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    }[alignItems || "center"];

    const wrapClass = wrap !== false ? "flex-wrap" : "flex-nowrap";
    const emptyPreviewClass = isPuckEditorPreview()
      ? "empty:min-h-20 empty:min-w-20 empty:rounded-2xl empty:border empty:border-dashed empty:border-border/50 empty:bg-muted/20"
      : "";

    const childWidthClass = {
      auto: "",
      equal: "[&>*]:flex-1",
      full: "[&>*]:w-full md:[&>*]:w-auto",
    }[childWidth || "auto"];

    // Backward compatibility for inline gap styles
    const gapStyle = typeof gap === "number" ? { gap: `${gap}px` } : undefined;

    const resolvedClassName = twMerge(
      "flex min-h-16 min-w-xl flex-1 w-full py-2",
      mobileDirClass,
      desktopDirClass,
      justifyClass,
      alignClass,
      wrapClass,
      childWidthClass,
      typeof gap === "number"
        ? undefined
        : twMerge(
          getGapAxisClass("x", gapX ?? gap),
          getGapAxisClass("y", gapY ?? gap),
        ),
      emptyPreviewClass,
      getHideOnClass(hideOn),
      className,
      classes,
    );

    return (
      <Children
        collisionAxis={
          mobileDirection === "row" && flexDirection === "row"
            ? "x"
            : "dynamic"
        }
        id={id}
        className={resolvedClassName}
        minEmptyHeight={96}
        style={gapStyle}
      />
    );
  },
};
