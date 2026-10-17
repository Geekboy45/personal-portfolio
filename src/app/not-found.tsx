import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-24 sm:py-32">
      <div className="rounded-panel border border-border bg-surface-raised p-8 sm:p-12 shadow-panel">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-danger">
            STATUS 404 // ROUTE_NOT_FOUND
          </span>
          <span className="font-mono text-xs text-muted-foreground/40">/</span>
          <span className="font-mono text-xs text-muted-foreground">
            ARCHIVE TELEMETRY
          </span>
        </div>

        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Specimen Record Not Located
        </h1>

        <p className="mt-3 max-w-xl text-base text-muted-foreground leading-relaxed">
          The requested coordinate or specimen file does not exist in the active
          Silph biological catalog. The entry may have been reclassified,
          relocated, or withdrawn from laboratory archives.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4 pt-6 border-t border-border">
          <Link
            href="/explore/"
            className="rounded-control bg-primary px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-focus"
          >
            ← Return to Specimen Registry
          </Link>
          <Link
            href="/"
            className="rounded-control border border-border bg-surface px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-focus"
          >
            Laboratory Terminal Home
          </Link>
        </div>
      </div>
    </main>
  );
}
