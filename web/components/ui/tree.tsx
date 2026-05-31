"use client";

import { Bars3Icon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Button } from "react-aria-components/Button";
import type {
  TreeItemContentProps,
  TreeItemContentRenderProps,
  TreeItemProps,
  TreeProps,
} from "react-aria-components/Tree";
import {
  TreeItemContent,
  TreeItem as TreeItemPrimitive,
  Tree as TreePrimitive,
} from "react-aria-components/Tree";
import {
  DropIndicator as DropIndicatorPrimitive,
  type DropIndicatorProps,
} from "react-aria-components/useDragAndDrop";
import { twJoin, twMerge } from "tailwind-merge";
import { cx } from "@/lib/primitive";
import { Checkbox } from "./checkbox";

const Tree = <T extends object>({ className, ...props }: TreeProps<T>) => {
  return (
    <TreePrimitive
      className={cx(
        twJoin(
          "flex cursor-default flex-col gap-y-2 overflow-auto outline-hidden forced-color-adjust-none",
          "[--tree-active-bg:var(--color-primary-subtle)] [--tree-active-fg:var(--color-primary-subtle-fg)]",
        ),
        className,
      )}
      {...props}
    />
  );
};

const TreeItem = <T extends object>({
  className,
  ...props
}: TreeItemProps<T>) => {
  return (
    <TreeItemPrimitive
      className={cx(
        [
          "shrink-0 rounded-lg px-5 py-1.5 pe-2",
          "group/tree-item relative flex select-none rounded-lg focus:outline-hidden",
          "focus:bg-(--tree-active-bg) focus:text-(--tree-active-fg) focus:**:[.text-muted-fg]:text-(--tree-active-fg)",
          "**:data-[slot=avatar]:*:size-6 **:data-[slot=avatar]:size-6 sm:**:data-[slot=avatar]:*:size-5 sm:**:data-[slot=avatar]:size-5",
          "**:[svg]:size-5 **:[svg]:shrink-0 sm:**:[svg]:size-4",
          "disabled:opacity-50 forced-colors:[",
          "href" in props ? "cursor-pointer" : "cursor-default",
        ],
        className,
      )}
      {...props}
    />
  );
};

interface TreeContentProps extends TreeItemContentProps {
  className?: string;
}

const TreeContent = ({ className, children, ...props }: TreeContentProps) => {
  return (
    <TreeItemContent {...props}>
      {(values) => (
        <div
          className={twMerge(
            "relative flex w-full min-w-0 items-center gap-x-1 truncate text-sm/6",
            className,
          )}
        >
          {values.allowsDragging && (
            <Button
              slot="drag"
              className="shrink-0 cursor-grab rounded-md p-0.5 text-muted-fg outline-hidden hover:text-fg active:cursor-grabbing"
            >
              <Bars3Icon className="size-4 me-1" />
            </Button>
          )}
          {values.selectionMode === "multiple" &&
            values.selectionBehavior === "toggle" && (
              <Checkbox
                className="[--indicator-mt:0] sm:[--indicator-mt:0]"
                slot="selection"
              />
            )}
          <div
            className={twJoin(
              "relative w-[calc(calc(var(--tree-item-level)-1)*(--spacing(5)))] shrink-0",
              "before:absolute before:inset-0 before:-ms-1 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-item-level)-1px),var(--border)_calc(var(--tree-item-level)-1px),var(--border)_calc(var(--tree-item-level)))]",
            )}
          />
          {values.hasChildItems ? (
            <TreeIndicator
              values={{
                isDisabled: values.isDisabled,
                isExpanded: values.isExpanded,
              }}
            />
          ) : (
            <span aria-hidden className="block w-5 shrink-0" />
          )}
          {typeof children === "function" ? children(values) : children}
        </div>
      )}
    </TreeItemContent>
  );
};

const TreeIndicator = ({
  values,
}: {
  values: Pick<TreeItemContentRenderProps, "isDisabled" | "isExpanded">;
}) => {
  return (
    <Button
      slot="chevron"
      isDisabled={values.isDisabled}
      className={twJoin(
        "shrink-0 content-center text-muted-fg hover:text-fg",
        values.isExpanded && "text-fg",
      )}
    >
      <ChevronRightIcon
        data-slot="chevron"
        className={twJoin(
          "me-1 -mx-0.5 size-5 transition-transform duration-200 ease-in-out sm:size-4",
          values.isExpanded && "rotate-90",
        )}
      />
    </Button>
  );
};

const TreeDropIndicator = (props: DropIndicatorProps) => {
  return (
    <DropIndicatorPrimitive
      className={({ isDropTarget }) =>
        twMerge(
          "relative block h-2 rounded-full",
          "before:absolute before:inset-x-2 before:top-1/2 before:h-0.5 before:-translate-y-1/2 before:rounded-full before:bg-primary/35",
          isDropTarget && "before:bg-primary",
        )
      }
      {...props}
    />
  );
};

export type { TreeItemProps, TreeProps };
export { Tree, TreeContent, TreeDropIndicator, TreeIndicator, TreeItem };
