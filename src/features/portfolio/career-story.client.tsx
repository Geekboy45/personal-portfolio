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

  // Authorized animation lifecycle exception (docs/animations.md): one scoped,
  // scroll-scrubbed SVG sequence. CSS transitions do not coordinate its stages
  // with reading progress; native scroll timelines lack an agreed browser matrix.
  // useGSAP + matchMedia own teardown, including preference/toggle replacement,
  // Strict Mode and unmount. Narrative children always retain server-rendered text.
  useGSAP(
    () => {
      if (!active) return;
      const media = gsap.matchMedia();
      media.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.registerPlugin(ScrollTrigger);
          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: scope.current,
              start: "top 45%",
              end: "bottom 75%",
              scrub: 0.35,
              invalidateOnRefresh: true,
            },
          });
          timeline
            .fromTo(
              "[data-story-node]",
              { scale: 0.55, opacity: 0.35, transformOrigin: "50% 50%" },
              { scale: 1, opacity: 1, stagger: 0.12, duration: 0.8 },
              0,
            )
            .fromTo(
              "[data-story-connection]",
              { attr: { "stroke-dashoffset": 700 }, opacity: 0.3 },
              {
                attr: { "stroke-dashoffset": 0 },
                opacity: 1,
                stagger: 0.1,
                duration: 1,
              },
              0.6,
            )
            .fromTo(
              "[data-story-core]",
              { scale: 0.8, transformOrigin: "50% 50%" },
              { scale: 1, duration: 0.9 },
              1.3,
            )
            .fromTo(
              "[data-story-orbit]",
              { rotation: -35, transformOrigin: "50% 50%" },
              { rotation: 0, duration: 1.2 },
              1,
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
        <div className="overflow-hidden rounded-panel border border-border bg-primary-subtle p-5 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-xs uppercase tracking-widest text-primary">
              {isEs ? "Conectar las piezas" : "Connecting the dots"}
            </span>
            <span
              className="font-mono text-xs text-muted-foreground"
              aria-hidden="true"
            >
              01 → 03
            </span>
          </div>
          <svg
            aria-hidden="true"
            viewBox="0 0 440 360"
            fill="none"
            className="mx-auto my-4 w-full max-w-md text-primary"
          >
            <g data-story-orbit>
              <circle
                cx="220"
                cy="180"
                r="145"
                stroke="currentColor"
                strokeOpacity=".16"
                strokeDasharray="3 10"
              />
            </g>
            <g stroke="currentColor" strokeWidth="1.5">
              <path
                data-story-connection
                d="M80 100 Q180 80 220 180"
                strokeDasharray="700"
              />
              <path
                data-story-connection
                d="M360 100 Q260 80 220 180"
                strokeDasharray="700"
              />
              <path
                data-story-connection
                d="M80 260 Q180 280 220 180"
                strokeDasharray="700"
              />
              <path
                data-story-connection
                d="M360 260 Q260 280 220 180"
                strokeDasharray="700"
              />
            </g>
            {[
              [80, 100],
              [360, 100],
              [80, 260],
              [360, 260],
            ].map(([x, y], index) => (
              <g key={index} transform={`translate(${x} ${y})`}>
                <g data-story-node>
                  <rect
                    x="-25"
                    y="-25"
                    width="50"
                    height="50"
                    rx="13"
                    fill="var(--color-surface-raised)"
                    stroke="currentColor"
                    strokeOpacity=".3"
                  />
                  <circle r="5" fill="currentColor" />
                  <path
                    d="M-10 12H10"
                    stroke="currentColor"
                    strokeOpacity=".4"
                  />
                </g>
              </g>
            ))}
            <g data-story-core>
              <rect
                x="164"
                y="124"
                width="112"
                height="112"
                rx="28"
                fill="currentColor"
              />
              <path
                d="m197 180 16 16 30-32"
                stroke="var(--color-primary-foreground)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
          <p className="text-center font-mono text-xs text-muted-foreground">
            {isEs
              ? "Datos → Producto → Liderazgo"
              : "Data → Product → Leadership"}
          </p>
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
