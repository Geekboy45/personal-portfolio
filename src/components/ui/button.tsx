import type { ComponentProps } from "react";
import { buttonBase, buttonVariants, buttonSizes } from "./button-variants";
type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
};
export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${buttonBase} ${buttonSizes[size]} ${buttonVariants[variant]} ${className}`}
      {...props}
    />
  );
}
