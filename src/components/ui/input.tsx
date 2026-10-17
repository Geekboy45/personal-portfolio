import type { ComponentProps } from "react";

export type InputProps = ComponentProps<"input">;

export function Input({ className = "", type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      className={`min-h-11 w-full rounded-control border border-border bg-surface-raised px-4 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden ${className}`}
      {...props}
    />
  );
}
