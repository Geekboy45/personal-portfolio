"use client";

import {
  setMotionPreference,
  useMotionPreference,
} from "@/lib/reduced-motion.client";

export function MotionPreference({ locale }: { locale: "en" | "es" }) {
  const { reducedMotion, systemReducedMotion } = useMotionPreference();
  return (
    <label className="inline-flex min-h-8 cursor-pointer items-center gap-2 text-xs text-muted-foreground">
      <input
        type="checkbox"
        checked={reducedMotion}
        disabled={systemReducedMotion}
        onChange={(event) => setMotionPreference(event.target.checked)}
        className="h-4 w-4 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      />
      <span>{locale === "es" ? "Reducir movimiento" : "Reduce motion"}</span>
      {systemReducedMotion && (
        <span className="sr-only">
          {locale === "es"
            ? "Preferencia del sistema activa"
            : "System preference is active"}
        </span>
      )}
    </label>
  );
}
