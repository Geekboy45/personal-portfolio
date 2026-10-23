import type { ComponentProps } from "react";
import { buttonBase, buttonVariants, buttonSizes } from "./button-variants";

type LinkButtonProps = ComponentProps<"a"> & {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
};

export function LinkButton({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: LinkButtonProps) {
  return (
    <a
      className={`${buttonBase} ${buttonSizes[size]} ${buttonVariants[variant]} ${className}`}
      {...props}
    />
  );
}
