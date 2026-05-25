import { tv } from "tailwind-variants"

export const dropdownSectionStyles = tv({
  slots: {
    section: "col-span-full grid grid-cols-[auto_1fr]",
    header:
      "col-span-full px-3 py-2 font-medium text-muted-fg text-sm/6 sm:px-2.5 sm:py-1.5 sm:text-xs/3",
  },
})

export const dropdownItemStyles = tv({
  base: [
    "min-w-0 [--me-icon:--spacing(2.5)] sm:[--me-icon:--spacing(2)]",
    "col-span-full grid grid-cols-[auto_1fr_1.5rem_0.5rem_auto] px-3 py-2 supports-[grid-template-columns:subgrid]:grid-cols-subgrid sm:px-2.5 sm:py-1.5",
    "not-has-[[slot=description]]:items-center",
    "group relative cursor-default select-none rounded-[calc(var(--radius-lg)-(--spacing(1)))] outline-0",
    "text-base/6 text-fg sm:text-sm/6 forced-colors:text-[CanvasText]",
    "*:data-[slot=avatar]:*:me-(--me-icon) *:data-[slot=avatar]:me-(--me-icon) has-[[slot=description]]:*:data-[slot=avatar]:row-span-2 *:data-[slot=avatar]:[--avatar-size:--spacing(5)] sm:*:data-[slot=avatar]:[--avatar-size:--spacing(4)]",
    "[&_svg:not([class*='text-'])]:text-muted-fg *:[svg:not([data-slot='check-indicator'])]:col-start-1 *:[svg:not([data-slot='check-indicator'])]:row-start-1 *:[svg:not([data-slot='check-indicator'])]:-ms-0.5 *:[svg:not([data-slot='check-indicator'])]:me-(--me-icon) *:[svg]:shrink-0",
    "not-has-[[slot=description]]:*:[svg]:size-5 sm:not-has-[[slot=description]]:*:[svg]:size-4",
    "has-[[slot=description]]:[&_svg:not([class*='w-'])]:w-5 sm:has-[[slot=description]]:[&_svg:not([class*='w-'])]:w-4 has-[[slot=description]]:*:[svg]:h-lh",
    "[&>[slot=label]+svg:not([data-slot='check-indicator'])]:absolute [&>[slot=label]+svg:not([data-slot='check-indicator'])]:inset-e-0 [&>[slot=label]+svg:not([data-slot='check-indicator'])]:top-1",
    "selected:[&>svg:not([data-slot='check-indicator']):has(+svg:not([data-slot='check-indicator']))]:absolute selected:[&>svg:not([data-slot='check-indicator']):has(+svg:not([data-slot='check-indicator']))]:inset-e-0 selected:[&>svg:not([data-slot='check-indicator']):has(+svg:not([data-slot='check-indicator']))]:top-1",
    "selected:[&>svg:not([data-slot='check-indicator']):has(+[data-slot=avatar])]:absolute selected:[&>svg:not([data-slot='check-indicator']):has(+[data-slot=avatar])]:inset-e-0 selected:[&>svg:not([data-slot='check-indicator']):has(+[data-slot=avatar])]:top-1",
    "selected:[&>[data-slot=avatar]+[slot=label]]:me-6 selected:[&>[data-slot=avatar]+svg:not([data-slot='check-indicator'])+[slot=label]]:me-6 selected:[&>svg:not([data-slot='check-indicator'])+[data-slot=avatar]+[slot=label]]:me-6 selected:[&>svg:not([data-slot='check-indicator'])+[slot=label]]:me-6",
    "*:data-[slot=keyboard]:inset-e-3",
    "forced-color-adjust-none forced-colors:focus:bg-[Highlight] forced-colors:focus:text-[HighlightText] forced-colors:focus:*:[svg]:text-[HighlightText]",
  ],
  variants: {
    intent: {
      danger: [
        "text-danger-subtle-fg focus:text-danger-subtle-fg [&_svg:not([class*='text-'])]:text-danger-subtle-fg/70",
        "*:[[slot=description]]:text-danger-subtle-fg/80 focus:*:[[slot=description]]:text-danger-subtle-fg focus:*:[[slot=label]]:text-danger-subtle-fg",
        "focus:bg-danger-subtle focus:text-danger-subtle-fg forced-colors:focus:text-[Mark] focus:[&_svg:not([class*='text-'])]:text-danger-subtle-fg",
        "*:data-[slot=keyboard]:text-danger-subtle-fg/70 focus:*:data-[slot=keyboard]:text-danger-subtle-fg",
      ],
      warning: [
        "text-warning-subtle-fg focus:text-warning-subtle-fg [&_svg:not([class*='text-'])]:text-warning-subtle-fg/70",
        "*:[[slot=description]]:text-warning-subtle-fg/80 focus:*:[[slot=description]]:text-warning-subtle-fg focus:*:[[slot=label]]:text-warning-subtle-fg",
        "focus:bg-warning-subtle focus:text-warning-subtle-fg focus:[&_svg:not([class*='text-'])]:text-warning-subtle-fg",
        "*:data-[slot=keyboard]:text-warning-subtle-fg/70 focus:*:data-[slot=keyboard]:text-warning-subtle-fg",
      ],
    },
    isDisabled: {
      true: "opacity-50 forced-colors:text-[GrayText]",
    },
    isSelected: {
      true: "[&_svg:not([class*='text-'])]:text-accent-fg",
    },
    isFocused: {
      true: [
        "*:data-[slot=keyboard]:text-accent-fg [&_svg:not([class*='text-'])]:text-accent-fg",
        "bg-accent text-accent-fg forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]",
        "[&_.text-muted-fg]:text-accent-fg/80 *:[[slot=description]]:text-accent-fg *:[[slot=label]]:text-accent-fg",
      ],
    },
    isHovered: {
      true: [
        "*:data-[slot=keyboard]:text-accent-fg [&_svg:not([class*='text-'])]:text-accent-fg",
        "bg-accent text-accent-fg forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]",
        "[&_.text-muted-fg]:text-accent-fg/80 *:[[slot=description]]:text-accent-fg *:[[slot=label]]:text-accent-fg",
      ],
    },
  },
})
