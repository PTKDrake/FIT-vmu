"use client";

import { CheckIcon } from "@heroicons/react/20/solid";
import { Collection } from "react-aria-components/Collection";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { Header } from "react-aria-components/Header";
import type {
  ListBoxItemProps,
  ListBoxSectionProps,
} from "react-aria-components/ListBox";
import {
  ListBoxItem as ListBoxItemPrimitive,
  ListBoxSection,
} from "react-aria-components/ListBox";
import {
  Separator,
  type SeparatorProps,
} from "react-aria-components/Separator";
import { Text, type TextProps } from "react-aria-components/Text";
import { twJoin, twMerge } from "tailwind-merge";
import { dropdownItemStyles, dropdownSectionStyles } from "./dropdown.styles";
import { Keyboard } from "./keyboard";

const { section, header } = dropdownSectionStyles();

interface DropdownSectionProps<T> extends ListBoxSectionProps<T> {
  title?: string;
}

const DropdownSection = <T extends object>({
  className,
  children,
  ...props
}: DropdownSectionProps<T>) => {
  return (
    <ListBoxSection className={section({ className })}>
      {"title" in props && <Header className={header()}>{props.title}</Header>}
      <Collection items={props.items}>{children}</Collection>
    </ListBoxSection>
  );
};

interface DropdownItemProps extends ListBoxItemProps {
  intent?: "danger" | "warning";
}

const DropdownItem = ({
  className,
  children,
  intent,
  ...props
}: DropdownItemProps) => {
  const textValue = typeof children === "string" ? children : undefined;
  return (
    <ListBoxItemPrimitive
      textValue={textValue}
      className={composeRenderProps(className, (className, renderProps) =>
        dropdownItemStyles({ ...renderProps, intent, className }),
      )}
      {...props}
    >
      {composeRenderProps(children, (children, { isSelected }) => (
        <>
          {isSelected && (
            <CheckIcon
              className={twJoin(
                "-ms-0.5 me-1.5 h-lh w-4 shrink-0",
                "group-has-[svg:not([data-slot='check-indicator'])]:absolute group-has-[svg:not([data-slot='check-indicator'])]:inset-e-0.5 group-has-[svg:not([data-slot='check-indicator'])]:top-1/2 group-has-[svg:not([data-slot='check-indicator'])]:-translate-y-1/2",
                "group-has-data-[slot=avatar]:absolute group-has-data-[slot=avatar]:inset-e-0.5 group-has-data-[slot=avatar]:top-1/2 group-has-data-[slot=avatar]:-translate-y-1/2",
              )}
              data-slot="check-indicator"
            />
          )}
          {typeof children === "string" ? (
            <DropdownLabel>{children}</DropdownLabel>
          ) : (
            children
          )}
        </>
      ))}
    </ListBoxItemPrimitive>
  );
};

const DropdownLabel = ({ className, ...props }: TextProps) => (
  <Text
    slot="label"
    className={twMerge("col-start-2 [&:has(+svg)]:pe-6", className)}
    {...props}
  />
);

const DropdownDescription = ({ className, ...props }: TextProps) => (
  <Text
    slot="description"
    className={twMerge(
      "col-start-2 font-normal text-muted-fg text-sm",
      className,
    )}
    {...props}
  />
);

const DropdownSeparator = ({
  className,
  ...props
}: Omit<SeparatorProps, "orientation">) => (
  <Separator
    orientation="horizontal"
    className={twMerge("col-span-full -mx-1 h-px bg-fg/10", className)}
    {...props}
  />
);

const DropdownKeyboard = ({
  className,
  ...props
}: React.ComponentProps<typeof Keyboard>) => {
  return (
    <Keyboard
      className={twMerge(
        "absolute end-2 ps-2 group-hover:text-primary-fg group-focus:text-primary-fg",
        className,
      )}
      {...props}
    />
  );
};

export type { DropdownItemProps, DropdownSectionProps };
export {
  DropdownDescription,
  DropdownItem,
  DropdownKeyboard,
  DropdownLabel,
  DropdownSection,
  DropdownSeparator,
};
