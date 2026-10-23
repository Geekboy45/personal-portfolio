import type { ComponentProps } from "react";
import { buttonBase, buttonVariants } from "./button-variants";
type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof buttonVariants;
};
export function Button({
  variant = "primary",
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${buttonBase} ${buttonVariants[variant]} ${className}`}
      {...props}
    />
  );
}
