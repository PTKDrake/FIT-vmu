import React from "react";
import { cn } from "@/lib/utils";
import {
  getHideOnClass,
  getGapAxisClass,
  getAlignItemsClass,
  getJustifyItemsClass,
} from "./layouts";
import type { PageBuilderComponentConfig } from "./types";

export const GridComponentConfig: PageBuilderComponentConfig<"Grid"> = {
  label: "Lưới nội dung (Grid)",
  defaultProps: {
    mobileColumns: 1,
    tabletColumns: 2,
    desktopColumns: 3,
    gapX: "lg",
    gapY: "lg",
    alignItems: "stretch",
    justifyItems: "stretch",
    hideOn: "none",
    className: "",
  },
  fields: {
    anchorId: {
      type: "text",
      label: "ID điều hướng",
    },
    mobileColumns: {
      type: "select",
      label: "Số cột trên mobile",
      options: [
        { label: "1 cột", value: 1 },
        { label: "2 cột", value: 2 },
      ],
    },
    tabletColumns: {
      type: "select",
      label: "Số cột trên tablet",
      options: [
        { label: "1 cột", value: 1 },
        { label: "2 cột", value: 2 },
        { label: "3 cột", value: 3 },
        { label: "4 cột", value: 4 },
      ],
    },
    desktopColumns: {
      type: "select",
      label: "Số cột trên desktop",
      options: [
        { label: "1 cột", value: 1 },
        { label: "2 cột", value: 2 },
        { label: "3 cột", value: 3 },
        { label: "4 cột", value: 4 },
        { label: "5 cột", value: 5 },
        { label: "6 cột", value: 6 },
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
    alignItems: {
      type: "select",
      label: "Canh ô theo chiều dọc",
      options: [
        { label: "Trên", value: "start" },
        { label: "Giữa", value: "center" },
        { label: "Cao đều", value: "stretch" },
      ],
    },
    justifyItems: {
      type: "select",
      label: "Canh ô theo chiều ngang",
      options: [
        { label: "Trái", value: "start" },
        { label: "Giữa", value: "center" },
        { label: "Phải", value: "end" },
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
    children: {
      type: "slot",
      label: "Nội dung",
    },
  },
  render: ({
    columns,
    mobileColumns,
    tabletColumns,
    desktopColumns,
    gap,
    gapX,
    gapY,
    alignItems,
    justifyItems,
    anchorId,
    hideOn,
    className,
    children: Children,
  }) => {
    if (!Children) {
      return <></>;
    }

    // Backwards compatibility for old columns count
    const finalDesktopCols =
      desktopColumns !== undefined
        ? desktopColumns
        : columns !== undefined
          ? (columns as any)
          : 3;
    const finalTabletCols =
      tabletColumns !== undefined
        ? tabletColumns
        : columns !== undefined
          ? Math.min(columns as number, 4)
          : 2;
    const finalMobileCols = mobileColumns !== undefined ? mobileColumns : 1;

    const mobileColsClass =
      {
        1: "grid-cols-1",
        2: "grid-cols-2",
      }[finalMobileCols as 1 | 2] || "grid-cols-1";

    const tabletColsClass =
      {
        1: "sm:grid-cols-1",
        2: "sm:grid-cols-2",
        3: "sm:grid-cols-3",
        4: "sm:grid-cols-4",
      }[finalTabletCols as 1 | 2 | 3 | 4] || "sm:grid-cols-2";

    const desktopColsClass =
      {
        1: "lg:grid-cols-1",
        2: "lg:grid-cols-2",
        3: "lg:grid-cols-3",
        4: "lg:grid-cols-4",
        5: "lg:grid-cols-5",
        6: "lg:grid-cols-6",
      }[finalDesktopCols as 1 | 2 | 3 | 4 | 5 | 6] || "lg:grid-cols-3";

    // For inline style gap backwards compatibility
    const gapStyle = typeof gap === "number" ? { gap: `${gap}px` } : undefined;

    return (
      <Children
        id={anchorId || undefined}
        className={cn(
          "grid min-h-16 w-full py-2",
          mobileColsClass,
          tabletColsClass,
          desktopColsClass,
          typeof gap === "number"
            ? undefined
            : cn(
                getGapAxisClass("x", gapX ?? gap),
                getGapAxisClass("y", gapY ?? gap),
              ),
          getAlignItemsClass(alignItems),
          getJustifyItemsClass(justifyItems),
          getHideOnClass(hideOn),
          className,
        )}
        style={gapStyle}
      />
    );
  },
};
