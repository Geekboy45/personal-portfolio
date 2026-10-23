"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/lib/reduced-motion.client";

gsap.registerPlugin(useGSAP);

function photoOffset(track: HTMLElement, index: number, distance: number) {
  const photo = track.children[index] as HTMLElement | undefined;
  const first = track.children[0] as HTMLElement | undefined;
  return Math.min(
    distance,
    Math.max(0, (photo?.offsetLeft ?? 0) - (first?.offsetLeft ?? 0)),
  );
}

function closestPhoto(track: HTMLElement, offset: number, distance: number) {
  let closest = 0;
  for (let index = 1; index < track.children.length; index++) {
    if (
      Math.abs(photoOffset(track, index, distance) - offset) <
      Math.abs(photoOffset(track, closest, distance) - offset)
    )
      closest = index;
  }
  return closest;
}

export function EducationGallery({
  children,
  locale,
  total,
}: {
  children: ReactNode;
  locale: "en" | "es";
  total: number;
}) {
  const galleryId = useId();
  const scope = useRef<HTMLDivElement>(null);
  const progressTrigger = useRef<ScrollTrigger | null>(null);
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null);
  const [track, setTrack] = useState<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState(0);
  const reducedMotion = useReducedMotion();
  const active = !reducedMotion;
  const isEs = locale === "es";

  // Authorized imperative-animation exception (docs/animations.md): vertical
  // reading progress drives horizontal photo translation and a bounded pin.
  // Native overflow remains the no-JS/reduced/disabled fallback. CSS transitions
  // cannot coordinate this sequence or its pin spacing across our browser matrix.
  // useGSAP owns transforms, overflow restoration, trigger/spacer disposal and
  // replacement. No wheel/touch listener or custom scroll engine is installed.
  useGSAP(
    () => {
      if (!active || !viewport || !track) return;
      gsap.registerPlugin(ScrollTrigger);
      viewport.scrollTo?.({ left: 0, behavior: "instant" });
      gsap.set(viewport, { overflowX: "hidden" });
      const distance = () =>
        Math.max(0, track.scrollWidth - viewport.clientWidth);
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: scope.current,
          pin: true,
          pinSpacing: true,
          start: "top top+=88",
          end: () => `+=${Math.max(1, distance())}`,
          scrub: 0.35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) =>
            setCurrent(
              closestPhoto(track, self.progress * distance(), distance()),
            ),
        },
      });
      progressTrigger.current = tween.scrollTrigger ?? null;
      return () => {
        progressTrigger.current = null;
      };
    },
    {
      scope,
      dependencies: [active, viewport, track, total],
      revertOnUpdate: true,
    },
  );

  function move(direction: number) {
    const next = Math.max(0, Math.min(total - 1, current + direction));
    const trigger = progressTrigger.current;
    if (!viewport || !track) return;
    const distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
    const target = photoOffset(track, next, distance);
    if (active && trigger) {
      window.scrollTo({
        top:
          trigger.start +
          ((trigger.end - trigger.start) * target) / Math.max(1, distance),
        behavior: "instant",
      });
      return;
    }
    viewport.scrollTo({
      left: target,
      behavior: "auto",
    });
  }

  return (
    <div
      ref={scope}
      className={`mt-10 bg-surface py-3 ${active ? "flex min-h-[calc(100svh-6rem)] flex-col justify-center" : ""}`}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-xs text-muted-foreground">
          {active
            ? isEs
              ? "Sigue bajando para recorrer las fotos ↓"
              : "Keep scrolling down to explore the photos ↓"
            : isEs
              ? "Desliza para explorar →"
              : "Scroll sideways to explore →"}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <p
            aria-live="polite"
            className="font-mono text-xs text-muted-foreground"
          >
            {current + 1} {isEs ? "de" : "of"} {total}
          </p>
          <Button
            variant="secondary"
            aria-label={isEs ? "Fotografía anterior" : "Previous photo"}
            aria-controls={galleryId}
            disabled={!track || current === 0}
            onClick={() => move(-1)}
          >
            <span aria-hidden="true">←</span>
          </Button>
          <Button
            variant="secondary"
            aria-label={isEs ? "Fotografía siguiente" : "Next photo"}
            aria-controls={galleryId}
            disabled={!track || current === total - 1}
            onClick={() => move(1)}
          >
            <span aria-hidden="true">→</span>
          </Button>
        </div>
      </div>
      <div
        id={galleryId}
        ref={setViewport}
        tabIndex={0}
        role="region"
        aria-label={
          isEs
            ? "Galería de educación, desplazamiento horizontal"
            : "Education gallery, horizontal scrolling"
        }
        className="overflow-x-auto overscroll-x-contain rounded-panel pb-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
        onScroll={(event) => {
          if (progressTrigger.current || !track) return;
          setCurrent(
            closestPhoto(
              track,
              event.currentTarget.scrollLeft,
              Math.max(0, track.scrollWidth - event.currentTarget.clientWidth),
            ),
          );
        }}
      >
        <div ref={setTrack} className="relative flex gap-6">
          {children}
        </div>
      </div>
    </div>
  );
}
