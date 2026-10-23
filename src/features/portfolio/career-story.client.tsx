"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/lib/reduced-motion.client";

gsap.registerPlugin(useGSAP);

export function CareerStoryMotion({
  children,
  locale,
}: {
  children: ReactNode;
  locale: "en" | "es";
}) {
  const scope = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const active = !reducedMotion;
  const isEs = locale === "es";

  // Authorized lifecycle exception (docs/animations.md): synchronize decorative
  // planes with reading progress. CSS transitions cannot coordinate the stages;
  // native scroll timelines have no agreed browser matrix. Scoped useGSAP and
  // matchMedia revert on preference changes, Strict Mode cleanup and unmount.
  useGSAP(
    () => {
      if (!active) return;
      const media = gsap.matchMedia();
      media.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.registerPlugin(ScrollTrigger);
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: scope.current,
                start: "top 45%",
                end: "bottom 75%",
                scrub: 0.35,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(
              "[data-story-plane]",
              { y: 48, x: -24, opacity: 0.55 },
              { y: 0, x: 0, opacity: 1, stagger: 0.45, duration: 1.1 },
              0,
            )
            .fromTo(
              "[data-story-rise]",
              { scaleY: 0.3, transformOrigin: "50% 100%" },
              { scaleY: 1, stagger: 0.1, duration: 1.2 },
              0.3,
            )
            .fromTo(
              "[data-story-arrow]",
              { x: -28, y: 28 },
              { x: 0, y: 0, duration: 1 },
              1.3,
            );
        },
      );
      return () => media.revert();
    },
    { scope, dependencies: [active], revertOnUpdate: true },
  );

  return (
    <div
      ref={scope}
      className="mt-10 grid items-start gap-10 md:grid-cols-2 lg:gap-20"
    >
      <div className="md:sticky md:top-24">
        <div className="relative isolate overflow-hidden rounded-panel bg-foreground px-6 pt-7 pb-6 text-inverse-foreground sm:px-8 sm:pt-8">
          <div className="flex justify-between gap-4 font-mono text-xs uppercase tracking-widest text-inverse-accent">
            <span>
              {isEs ? "Una perspectiva más amplia" : "A broader perspective"}
            </span>
            <span aria-hidden="true">↗</span>
          </div>
          <p className="relative z-10 mt-6 max-w-xs font-display text-4xl font-semibold leading-none tracking-tight sm:text-5xl">
            {isEs ? "Cada etapa suma." : "Every layer counts."}
          </p>
          <svg
            aria-hidden="true"
            viewBox="0 0 480 370"
            fill="none"
            className="-mx-2 mt-2 max-h-72 w-full overflow-visible md:max-h-[36svh]"
          >
            <g stroke="var(--color-inverse-accent)" strokeOpacity=".13">
              <path d="M0 260 240 130 480 260M0 310 240 180 480 310M60 370 300 240M180 370 420 240" />
            </g>
            <g data-story-plane>
              <path
                d="m40 238 200-105 200 105-200 108Z"
                fill="var(--color-primary)"
              />
              <path
                d="m40 238 200 108 200-108v12L240 358 40 250Z"
                fill="var(--color-primary-hover)"
              />
              <g stroke="var(--color-inverse-accent)" strokeWidth="2">
                <path d="m105 236 135 72 134-72M140 216l100 54 99-54M175 197l65 35 64-35" />
              </g>
            </g>
            <g data-story-plane>
              <path
                d="m60 166 180-95 180 95-180 97Z"
                fill="var(--color-inverse-accent)"
              />
              <path
                d="m60 166 180 97 180-97v10l-180 97-180-97Z"
                fill="var(--color-primary)"
              />
              <g
                stroke="var(--color-primary)"
                strokeWidth="3"
                strokeLinecap="round"
              >
                <path d="m139 159-24 13 24 13m202-26 24 13-24 13m-88-48-26 63" />
              </g>
            </g>
            <g data-story-plane>
              <path
                d="m100 96 140-74 140 74-140 76Z"
                fill="var(--color-surface-raised)"
              />
              <path
                d="m100 96 140 76 140-76v9l-140 76-140-76Z"
                fill="var(--color-inverse-accent)"
              />
              <g fill="var(--color-primary)">
                <path data-story-rise d="m178 103 22 12V89l-22-12Z" />
                <path data-story-rise d="m211 120 22 12V80l-22-12Z" />
                <path data-story-rise d="m244 133 22-12V55l-22 12Z" />
                <path data-story-rise d="m277 115 22-12V35l-22 12Z" />
              </g>
            </g>
            <path
              data-story-arrow
              d="M374 109V40m0 0h-46m46 0-60 60"
              stroke="var(--color-inverse-accent)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="relative grid grid-cols-3 gap-3 border-t border-inverse-foreground/20 pt-5">
            {(isEs
              ? ["Datos", "Producto", "Liderazgo"]
              : ["Data", "Product", "Leadership"]
            ).map((label, index) => (
              <div key={label}>
                <span className="font-mono text-xs text-inverse-accent">
                  0{index + 1}
                </span>
                <p className="mt-1 text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          {isEs
            ? "Distintas disciplinas. Un mismo propósito."
            : "Different disciplines. A shared purpose."}
        </p>
      </div>
      <div>{children}</div>
    </div>
  );
}
