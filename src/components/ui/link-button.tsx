import type { ComponentProps } from "react";
import { buttonBase, buttonVariants } from "./button-variants";

type LinkButtonProps = ComponentProps<"a"> & {
  variant?: keyof typeof buttonVariants;
};

export function LinkButton({
  variant = "primary",
  className = "",
  ...props
}: LinkButtonProps) {
  return (
    <a
      className={`${buttonBase} ${buttonVariants[variant]} ${className}`}
      {...props}
    />
  );
}
