import type { ComponentProps } from "react";
const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary:
    "border border-border bg-surface-raised text-foreground hover:bg-surface-muted",
  danger: "bg-danger text-danger-foreground hover:opacity-90",
};
type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof variants;
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
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
