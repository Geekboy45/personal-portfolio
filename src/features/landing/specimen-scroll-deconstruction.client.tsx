"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register GSAP plugins only in real browser environments with matchMedia support
if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

function subscribeReducedMotion(callback: () => void) {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return () => {};
  }
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSnapshotReducedMotion() {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshotReducedMotion() {
  return false;
}

interface SpecimenHotspot {
  id: string;
  label: string;
  metric: string;
  coords: { x: number; y: number }; // Percentage relative to image container
  direction: "left" | "right";
}

const HOTSPOTS: SpecimenHotspot[] = [
  {
    id: "ears",
    label: "Audio Radar / Ear Tips",
    metric: "Conductive melanin tips (48 kHz)",
    coords: { x: 38, y: 14 },
    direction: "left",
  },
  {
    id: "cheeks",
    label: "Dual Electric Sacs",
    metric: "Voltage: 250V idle / 100kV peak",
    coords: { x: 36, y: 46 },
    direction: "left",
  },
  {
    id: "tail",
    label: "Lightning Grounding Conductor",
    metric: "Ground dispersion: 84.6% efficiency",
    coords: { x: 74, y: 38 },
    direction: "right",
  },
];

export function SpecimenScrollDeconstruction() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [activePhase, setActivePhase] = useState<1 | 2 | 3>(1);
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getSnapshotReducedMotion,
    getServerSnapshotReducedMotion,
  );

  // GSAP ScrollTrigger Sequence
  useGSAP(
    () => {
      if (
        reducedMotion ||
        !containerRef.current ||
        !pinRef.current ||
        typeof window === "undefined" ||
        typeof window.matchMedia !== "function"
      ) {
        return;
      }

      // Check for mobile viewport; pinning can be uncomfortable on small screens
      const isMobile = window.innerWidth < 768;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: pinRef.current,
          start: "top top+=72",
          end: isMobile ? "+=1200" : "+=1800",
          scrub: 0.6,
          onUpdate: (self) => {
            const progress = self.progress;
            if (progress < 0.35) {
              setActivePhase(1);
            } else if (progress < 0.7) {
              setActivePhase(2);
            } else {
              setActivePhase(3);
            }
          },
        },
      });

      timelineRef.current = tl;

      // PHASE 1: Photonic Scan Laser & Grid Sweep (0% -> 33%)
      tl.fromTo(
        ".gsap-laser-beam",
        { top: "0%", opacity: 0 },
        { top: "100%", opacity: 1, duration: 1, ease: "power1.inOut" },
        0,
      )
        .fromTo(
          ".gsap-scan-grid",
          { opacity: 0, scale: 0.95 },
          { opacity: 0.85, scale: 1, duration: 0.8 },
          0.2,
        )
        // Transition to PHASE 2: Bioelectric Wireframe & Hotspots (33% -> 66%)
        .to(
          ".gsap-phase-1-text",
          { opacity: 0, y: -15, duration: 0.5, ease: "power2.in" },
          1,
        )
        .fromTo(
          ".gsap-phase-2-text",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          1.3,
        )
        .to(
          ".gsap-specimen-base",
          {
            filter:
              "brightness(0.9) contrast(1.1) drop-shadow(0 0 20px rgba(14, 165, 233, 0.4))",
            duration: 0.8,
          },
          1,
        )
        .fromTo(
          ".gsap-bioelectric-aura",
          { opacity: 0, scale: 0.9 },
          { opacity: 0.9, scale: 1.05, duration: 0.8 },
          1.2,
        )
        .fromTo(
          ".gsap-hotspot-pin",
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            stagger: 0.15,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          1.3,
        )
        .fromTo(
          ".gsap-hotspot-callout",
          { opacity: 0, x: (i) => (i === 2 ? 15 : -15) },
          { opacity: 1, x: 0, stagger: 0.15, duration: 0.5 },
          1.4,
        )
        // Transition to PHASE 3: Biomechanical Metrics & Telemetry Bars (66% -> 100%)
        .to(
          ".gsap-phase-2-text",
          { opacity: 0, y: -15, duration: 0.5, ease: "power2.in" },
          2,
        )
        .fromTo(
          ".gsap-phase-3-text",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          2.3,
        )
        .to(
          ".gsap-radar-rings",
          { rotation: 180, scale: 1.15, opacity: 0.7, duration: 1 },
          2,
        )
        .fromTo(
          ".gsap-telemetry-bar-fill",
          { width: "0%" },
          {
            width: (i) => (i === 0 ? "92%" : i === 1 ? "85%" : "74%"),
            stagger: 0.2,
            duration: 0.8,
            ease: "power2.out",
          },
          2.2,
        );
    },
    { scope: containerRef, dependencies: [reducedMotion] },
  );

  // Jump directly to a phase when clicking phase buttons
  const jumpToPhase = (phaseNumber: 1 | 2 | 3) => {
    setActivePhase(phaseNumber);
    if (!containerRef.current) return;

    const st = ScrollTrigger.getAll().find(
      (trigger) => trigger.trigger === containerRef.current,
    );

    if (st && st.start && st.end) {
      const targetRatio =
        phaseNumber === 1 ? 0.05 : phaseNumber === 2 ? 0.5 : 0.95;
      const targetScroll = st.start + (st.end - st.start) * targetRatio;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
    const st = ScrollTrigger.getAll().find(
      (trigger) => trigger.trigger === containerRef.current,
    );
    if (st) {
      if (!isPaused) {
        st.disable(false);
      } else {
        st.enable();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${reducedMotion ? "py-12" : "min-h-[200vh] lg:min-h-[220vh]"}`}
      aria-label="Silph Specimen Deconstruction Laboratory"
    >
      {/* Pinned Stage Container */}
      <div ref={pinRef} className="w-full flex flex-col justify-center py-6">
        {/* Laboratory Chamber Header & Controller */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/70 bg-surface-raised/80 p-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 items-center justify-center">
              <span
                className={`h-2.5 w-2.5 rounded-full ${isPaused ? "bg-warning" : "bg-primary animate-pulse"}`}
              />
            </span>
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                Silph Biomechanical Scanner // Chamber 04
              </p>
              <p className="font-mono text-[11px] text-muted-foreground">
                Specimen Target: Pikachu (#0025) · Scroll-driven dissection
                sequence
              </p>
            </div>
          </div>

          {/* Phase Selectors & Pause Switch */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border bg-surface-muted p-1">
              {([1, 2, 3] as const).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => jumpToPhase(num)}
                  aria-pressed={activePhase === num}
                  className={`rounded-md px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider transition-all ${
                    activePhase === num
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Phase 0{num}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={togglePause}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 font-mono text-[10px] font-medium text-foreground transition-colors hover:bg-surface-raised"
              aria-label={
                isPaused
                  ? "Resume scroll telemetry animation"
                  : "Pause scroll telemetry animation"
              }
            >
              {isPaused ? "▶ Resume" : "⏸ Pause"}
            </button>
          </div>
        </div>

        {/* 2-Column Laboratory Diagnostic Deck */}
        <div className="grid items-center gap-8 lg:grid-cols-12">
          {/* Left: Active Diagnostic Readout HUD */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="rounded-2xl border border-border bg-surface-raised p-6 shadow-panel">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-primary">
                  Phase 0{activePhase} Telemetry Readout
                </span>
                <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                  {activePhase === 1
                    ? "MORPHOLOGY"
                    : activePhase === 2
                      ? "BIOELECTRIC"
                      : "SYNTHESIS"}
                </span>
              </div>

              {/* Dynamic Phase Text Content */}
              <div className="relative min-h-[220px] pt-4">
                {/* Phase 1 Copy */}
                <div
                  className={`gsap-phase-1-text transition-opacity duration-300 ${
                    activePhase === 1
                      ? "block"
                      : "hidden lg:block lg:opacity-0 lg:absolute lg:top-4"
                  }`}
                >
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Photonic Outer Morphology
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Calibrated high-resolution optical sweep. Epidermal layer
                    displays balanced hydration, dorsal dual-stripe conductive
                    marking, and sensory micro-fur suitable for electrostatic
                    build-up.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border/40 pt-3 font-mono text-xs">
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground">
                        Specimen ID
                      </span>
                      <p className="font-semibold text-foreground">
                        #0025 (Kanto Registry)
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground">
                        Photonic Status
                      </span>
                      <p className="font-semibold text-success">
                        Calibrated // Stable
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phase 2 Copy */}
                <div
                  className={`gsap-phase-2-text transition-opacity duration-300 ${
                    activePhase === 2
                      ? "block"
                      : "hidden lg:block lg:opacity-0 lg:absolute lg:top-4"
                  }`}
                >
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Internal Bioelectric Subsystem
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Cheek pouch dissection reveals specialized myoelectric sacks
                    capable of generating up to 100,000 volts under acute
                    physiological excitation. The zigzag caudal appendage acts
                    as an earthing conductor.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border/40 pt-3 font-mono text-xs">
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground">
                        Discharge Peak
                      </span>
                      <p className="font-semibold text-warning">
                        100,000 V AC/DC
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground">
                        Earthing Vector
                      </span>
                      <p className="font-semibold text-primary">
                        Caudal Lightning Dispersal
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phase 3 Copy */}
                <div
                  className={`gsap-phase-3-text transition-opacity duration-300 ${
                    activePhase === 3
                      ? "block"
                      : "hidden lg:block lg:opacity-0 lg:absolute lg:top-4"
                  }`}
                >
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Biomechanical Ratio & Synthesis
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Weight-to-height volumetric analysis determines a Body Mass
                    Index of 37.5 kg/m², maintaining low center-of-gravity
                    ground contact for rapid sprint acceleration during
                    discharge discharges.
                  </p>

                  {/* Telemetry Progress Bars */}
                  <div className="mt-4 space-y-2.5 border-t border-border/40 pt-3 font-mono text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                        <span>Energy Storage Density</span>
                        <span className="font-bold text-foreground">92%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-surface-muted overflow-hidden">
                        <div className="gsap-telemetry-bar-fill h-full rounded-full bg-primary w-[92%] transition-all" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                        <span>Earthing Dissipation Ratio</span>
                        <span className="font-bold text-foreground">85%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-surface-muted overflow-hidden">
                        <div className="gsap-telemetry-bar-fill h-full rounded-full bg-warning w-[85%] transition-all" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                        <span>Bioelectric Stability</span>
                        <span className="font-bold text-foreground">74%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-surface-muted overflow-hidden">
                        <div className="gsap-telemetry-bar-fill h-full rounded-full bg-success w-[74%] transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Indicator Track */}
              <div className="mt-6 border-t border-border/50 pt-3">
                <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground mb-1.5">
                  <span>DISSECTION SCRUB STATUS</span>
                  <span className="font-bold text-primary">
                    STAGE 0{activePhase} / 03
                  </span>
                </div>
                <div className="h-1 w-full rounded-full bg-surface-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(activePhase / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Holographic Specimen Dissection Chamber */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-lg aspect-square rounded-2xl border border-primary/30 bg-gradient-to-b from-surface-raised via-surface to-surface-raised p-6 shadow-2xl overflow-hidden flex items-center justify-center">
              {/* Background Radar Rings */}
              <div className="gsap-radar-rings pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
                <div className="h-[90%] w-[90%] rounded-full border border-dashed border-primary/40 animate-[spin_60s_linear_infinite]" />
                <div className="absolute h-[65%] w-[65%] rounded-full border border-primary/30" />
                <div className="absolute h-[40%] w-[40%] rounded-full border border-dashed border-warning/30" />
                {/* Crosshairs */}
                <div className="absolute h-full w-[1px] bg-primary/20" />
                <div className="absolute w-full h-[1px] bg-primary/20" />
              </div>

              {/* Scanning Laser Beam */}
              <div
                className="gsap-laser-beam pointer-events-none absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_#0ea5e9] opacity-80"
                style={{ top: "15%" }}
              />

              {/* Holographic Wireframe Scan Grid Overlay */}
              <div className="gsap-scan-grid pointer-events-none absolute inset-4 rounded-xl border border-primary/20 bg-[linear-gradient(to_right,#0ea5e910_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e910_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

              {/* Specimen Asset Container */}
              <div className="relative z-10 flex h-72 w-72 sm:h-80 sm:w-80 items-center justify-center">
                {/* Glow Aura behind specimen */}
                <div className="gsap-bioelectric-aura pointer-events-none absolute inset-0 rounded-full bg-primary/10 blur-2xl opacity-60" />

                {/* Base Specimen Image */}
                <Image
                  src="/images/hero-specimen.png"
                  alt="Silph canonical specimen asset - Pikachu #0025 under biomechanical scan"
                  width={300}
                  height={300}
                  priority
                  className="gsap-specimen-base relative z-10 max-h-full w-auto object-contain transition-all duration-300 drop-shadow-2xl"
                />

                {/* Interactive Telemetry Hotspots */}
                {HOTSPOTS.map((hotspot) => (
                  <div
                    key={hotspot.id}
                    className="absolute z-20"
                    style={{
                      left: `${hotspot.coords.x}%`,
                      top: `${hotspot.coords.y}%`,
                    }}
                  >
                    {/* Glowing Pin Pulse */}
                    <div className="gsap-hotspot-pin relative flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                      <span className="absolute h-full w-full rounded-full bg-warning/50 animate-ping" />
                      <span className="relative h-2.5 w-2.5 rounded-full border border-background bg-warning shadow-[0_0_8px_#f59e0b]" />
                    </div>

                    {/* Hotspot Floating Callout Label */}
                    <div
                      className={`gsap-hotspot-callout pointer-events-none absolute top-1/2 w-48 -translate-y-1/2 rounded-md border border-border bg-surface/90 p-2 font-mono shadow-md backdrop-blur-sm ${
                        hotspot.direction === "left"
                          ? "right-6 text-right"
                          : "left-6 text-left"
                      }`}
                    >
                      <p className="text-[10px] font-bold text-warning">
                        {hotspot.label}
                      </p>
                      <p className="text-[9px] text-muted-foreground">
                        {hotspot.metric}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Corner Coordinate Badges */}
              <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[9px] text-muted-foreground">
                LAT: 35.6895° N // LON: 139.6917° E
              </div>
              <div className="pointer-events-none absolute bottom-4 right-4 font-mono text-[9px] text-primary">
                OPTICAL SENSOR // ACTIVE
              </div>
              <div className="pointer-events-none absolute top-4 left-4 font-mono text-[9px] text-primary font-bold">
                REF // SILPH-P25-LAB
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
