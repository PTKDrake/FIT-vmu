"use client";

import {
  FieldError as FieldErrorPrimitive,
  type FieldErrorProps,
} from "react-aria-components/FieldError";
import {
  Label as LabelPrimitive,
  type LabelProps,
} from "react-aria-components/Label";
import { Text, type TextProps } from "react-aria-components/Text";
import { twMerge } from "tailwind-merge";
import { cx } from "@/lib/primitive";
import {
  descriptionStyles,
  fieldErrorStyles,
  fieldStyles,
  labelStyles,
} from "./field.styles";

export function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive
      data-slot="label"
      {...props}
      className={labelStyles({ className })}
    />
  );
}

export function Description({ className, ...props }: TextProps) {
  return (
    <Text
      {...props}
      slot="description"
      className={descriptionStyles({ className })}
    />
  );
}

export function Fieldset({
  className,
  ...props
}: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      className={twMerge(
        "*:data-[slot=text]:mt-1 [&>*+[data-slot=control]]:mt-6",
        className,
      )}
      {...props}
    />
  );
}

export function FieldGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="control"
      className={twMerge("space-y-6", className)}
      {...props}
    />
  );
}

export function FieldError({ className, ...props }: FieldErrorProps) {
  return (
    <FieldErrorPrimitive
      {...props}
      className={cx(fieldErrorStyles(), className)}
    />
  );
}

export function Legend({
  className,
  ...props
}: React.ComponentProps<"legend">) {
  return (
    <legend
      data-slot="legend"
      {...props}
      className={twMerge(
        "font-semibold text-base/6 data-disabled:opacity-50",
        className,
      )}
    />
  );
}
