import Link from "next/link";
import { SpecimenScrollDeconstruction } from "@/features/landing/specimen-scroll-deconstruction.client";

export default function HomePage() {
  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <section className="lg:col-span-7">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              SILPH RESEARCH // OS V9.2
            </span>
          </div>
          <h1 className="mt-4 max-w-xl font-display text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl">
            Biological Telemetry.
            <br />
            <span className="text-primary">Accurate Specimen Data.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
            A clinical, distraction-free field archive for researchers and
            curious explorers. Inspect biological measurements, elemental
            classifications, and real-time telemetry from all 9 generations.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/explore"
              className="inline-flex min-h-11 items-center gap-3 rounded-control bg-primary px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
            >
              Access Registry <span aria-hidden="true">→</span>
            </Link>
            <span className="font-mono text-xs text-muted-foreground">
              Press{" "}
              <kbd className="rounded border border-border bg-surface-muted px-1.5 py-0.5 text-[10px] font-semibold text-foreground">
                Ctrl+K
              </kbd>{" "}
              or{" "}
              <kbd className="rounded border border-border bg-surface-muted px-1.5 py-0.5 text-[10px] font-semibold text-foreground">
                ⌘K
              </kbd>{" "}
              to search
            </span>
          </div>
        </section>

        {/* Hero Quick Telemetry Card */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-border bg-gradient-to-b from-surface-raised to-surface p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                Active Protocol // #0025
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                CALIBRATED
              </span>
            </div>

            <div className="my-5 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between rounded-lg bg-surface-muted/60 p-3">
                <span className="text-muted-foreground">Chamber Status</span>
                <span className="font-semibold text-foreground">
                  Diagnostic Ready
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-muted/60 p-3">
                <span className="text-muted-foreground">Target Specimen</span>
                <span className="font-semibold text-primary">
                  Pikachu (#0025)
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-muted/60 p-3">
                <span className="text-muted-foreground">Animation Tier</span>
                <span className="font-semibold text-foreground">
                  Tier 3 (GSAP + Scroll)
                </span>
              </div>
            </div>

            <div className="border-t border-border/50 pt-3 text-center">
              <span className="font-mono text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
                Scroll down to engage deconstruction sequence{" "}
                <span className="text-primary animate-bounce">↓</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* GSAP Scroll-driven Specimen Deconstruction Sequence */}
      <section
        className="mt-20 border-t border-border/40 pt-12"
        aria-labelledby="deconstruction-heading"
      >
        <div className="mb-8 max-w-xl">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            INSPECTION PROTOCOL // SILPH LABS
          </span>
          <h2
            id="deconstruction-heading"
            className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Live Specimen Deconstruction
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Scroll down to dissect and inspect specimen #0025 Pikachu across
            three calibrated biological layers.
          </p>
        </div>

        <SpecimenScrollDeconstruction />
      </section>

      {/* System Specifications Card */}
      <aside
        aria-label="About the collection"
        className="mt-16 rounded-panel border border-border bg-surface-raised p-8 shadow-panel sm:p-10"
      >
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            System Specifications
          </span>
          <span className="flex items-center gap-1.5 font-mono text-xs font-medium text-success">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
            REST 2.0 Connected
          </span>
        </div>
        <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-foreground">
          Comprehensive Field Index
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Bounded name and ID lookup across the public catalog with BMI ratio
          calculations, weight-to-height analysis, and dual-type classification
          matrices.
        </p>
        <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-border/50 pt-6 sm:grid-cols-4">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Engine
            </dt>
            <dd className="mt-1 font-mono text-sm font-semibold text-foreground">
              Next.js 16 + Turbopack
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Telemetry Source
            </dt>
            <dd className="mt-1 font-mono text-sm font-semibold text-foreground">
              PokéAPI v2
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Static Assets
            </dt>
            <dd className="mt-1 font-mono text-sm font-semibold text-foreground">
              Next.js /public directory
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Favicon & Icons
            </dt>
            <dd className="mt-1 font-mono text-sm font-semibold text-foreground">
              SVG + ICO Multi-format
            </dd>
          </div>
        </dl>
      </aside>
    </main>
  );
}
