import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
} from "react-aria-components/Button"
import { type VariantProps } from "tailwind-variants"
import { cx } from "@/lib/primitive"
import { buttonStyles } from "./button.styles"

export interface ButtonProps extends ButtonPrimitiveProps, VariantProps<typeof buttonStyles> {
  ref?: React.Ref<HTMLButtonElement>
}

export function Button({ className, intent, size, isCircle, ref, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      ref={ref}
      {...props}
      className={cx(
        buttonStyles({
          intent,
          size,
          isCircle,
        }),
        className,
      )}
    />
  )
}
