import type { Metadata } from "next";
import { Suspense } from "react";
import { PokemonExplorer } from "@/features/pokemon/pokemon-explorer.client";
import { ExploreHeader } from "@/features/pokemon/explore-header.client";

export const metadata: Metadata = {
  title: "Specimen Registry",
  description:
    "Browse the Silph Research biological specimen registry and inspect detailed field analysis telemetry.",
};

export default function ExplorePage() {
  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10">
        <ExploreHeader />

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-control border border-border bg-surface-raised p-4">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Cataloged
            </span>
            <p className="mt-1 font-mono text-2xl font-bold text-foreground">
              PokéAPI
            </p>
            <span className="font-mono text-[10px] text-muted-foreground">
              Public catalog
            </span>
          </div>
          <div className="rounded-control border border-border bg-surface-raised p-4">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Classifications
            </span>
            <p className="mt-1 font-mono text-2xl font-bold text-foreground">
              18
            </p>
            <span className="font-mono text-[10px] text-muted-foreground">
              Elemental types
            </span>
          </div>
          <div className="rounded-control border border-border bg-surface-raised p-4">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Generations
            </span>
            <p className="mt-1 font-mono text-2xl font-bold text-foreground">
              IX
            </p>
            <span className="font-mono text-[10px] text-muted-foreground">
              Regional archives
            </span>
          </div>
          <div className="rounded-control border border-border bg-surface-raised p-4">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </span>
            <p className="mt-1 font-mono text-2xl font-bold text-success">
              DEMO
            </p>
            <span className="font-mono text-[10px] text-muted-foreground">
              External REST API
            </span>
          </div>
        </div>
      </div>

      <Suspense
        fallback={
          <p role="status" className="font-mono text-sm text-muted-foreground">
            Loading registry telemetry…
          </p>
        }
      >
        <PokemonExplorer />
      </Suspense>
    </main>
  );
}
