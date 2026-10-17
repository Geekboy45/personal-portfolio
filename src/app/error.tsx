"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const incidentDigest = error.digest;

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-24 sm:py-32">
      <div className="rounded-panel border border-border bg-surface-raised p-8 sm:p-12 shadow-panel">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-danger">
            RENDERING ERROR
          </span>
          <span className="font-mono text-xs text-muted-foreground/40">/</span>
          <span className="font-mono text-xs text-muted-foreground">
            CIRCUIT BREAK
          </span>
        </div>

        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Telemetry Link Interrupted
        </h1>

        <p className="mt-3 max-w-xl text-base text-muted-foreground leading-relaxed">
          An unexpected interruption occurred while rendering the laboratory
          telemetry pipeline. Try again. If the problem persists, contact the
          project support team.
        </p>

        {/* Opaque support reference as mandated by docs/observability.md */}
        {incidentDigest && (
          <div
            role="alert"
            className="my-6 rounded-control border border-border/80 bg-surface-muted p-4"
          >
            <p className="font-mono text-xs font-semibold text-muted-foreground">
              Support Diagnostic Digest:
            </p>
            <code className="mt-1 block font-mono text-xs text-foreground select-all">
              {incidentDigest}
            </code>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border">
          <Button
            variant="primary"
            onClick={reset}
            className="font-mono text-xs font-semibold uppercase tracking-wider"
          >
            ↻ Retry Telemetry Pipeline
          </Button>
          <Link
            href="/explore/"
            className="rounded-control border border-border bg-surface px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-focus"
          >
            Return to Registry
          </Link>
        </div>
      </div>
    </main>
  );
}
