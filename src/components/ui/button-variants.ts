export const buttonVariants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary:
    "border border-border bg-surface-raised text-foreground hover:bg-surface-muted",
  ink: "bg-foreground text-inverse-foreground hover:bg-muted-foreground",
  danger: "bg-danger text-danger-foreground hover:opacity-90",
};

export const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50";

export const buttonSizes = {
  md: "min-h-11 px-4 py-2 text-sm",
  lg: "min-h-14 px-7 py-4 text-base",
};
