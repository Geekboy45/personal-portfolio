"use client";

import { ArrowRightIcon } from "@/components/ui/icons";
import { useReducedMotion } from "@/lib/reduced-motion.client";

export function HeroContactArrow() {
  const reducedMotion = useReducedMotion();
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 ${reducedMotion ? "" : "motion-safe:transition-transform motion-safe:duration-(--motion-action-duration) motion-safe:ease-(--ease-portfolio) motion-safe:group-hover/hero-cta:translate-x-1 motion-safe:group-focus-visible/hero-cta:translate-x-1"}`}
    >
      <ArrowRightIcon size={20} />
    </span>
  );
}
