"use client";
import * as Primitive from "@radix-ui/react-dialog";
import type { ReactElement, ReactNode } from "react";
import { Button } from "./button";
type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactElement;
  title: string;
  description: string;
  children: ReactNode;
  size?: "default" | "wide";
  variant?: "default" | "bare";
};
export function Dialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  size = "default",
  variant = "default",
}: DialogProps) {
  const isBare = variant === "bare";

  return (
    <Primitive.Root open={open} onOpenChange={onOpenChange}>
      <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>
      <Primitive.Portal>
        <Primitive.Overlay className="fixed inset-0 z-40 bg-overlay backdrop-blur-sm" />
        <Primitive.Content
          className={`fixed left-1/2 top-1/2 z-50 max-h-[94dvh] w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overflow-x-hidden focus:outline-none ${
            isBare
              ? "border-0 bg-transparent p-0 shadow-none"
              : "rounded-panel border border-border bg-surface-raised p-4 sm:p-6 shadow-panel"
          } ${size === "wide" ? "max-w-4xl" : "max-w-md"}`}
        >
          <Primitive.Title
            className={isBare ? "sr-only" : "text-2xl font-semibold capitalize"}
          >
            {title}
          </Primitive.Title>
          <Primitive.Description
            className={
              isBare ? "sr-only" : "mt-2 text-sm text-muted-foreground"
            }
          >
            {description}
          </Primitive.Description>
          <div className={isBare ? "" : "my-6"}>{children}</div>
          {!isBare && (
            <Primitive.Close asChild>
              <Button variant="secondary" className="w-full">
                Close
              </Button>
            </Primitive.Close>
          )}
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
