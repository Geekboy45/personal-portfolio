"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n.client";

export function ErrorView({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale } = useLocale();
  const isEs = locale === "es";
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-display text-3xl font-semibold">
        {isEs
          ? "No se pudo cargar esta página."
          : "This page couldn’t be loaded."}
      </h1>
      <p className="mt-4 text-muted-foreground">
        {isEs
          ? "Inténtalo de nuevo o vuelve al inicio."
          : "Please try again or return to the homepage."}
      </p>
      {error.digest && (
        <div
          role="alert"
          className="mt-6 rounded-panel border border-border p-4"
        >
          <p className="text-sm text-muted-foreground">
            {isEs ? "Referencia de diagnóstico:" : "Support Diagnostic Digest:"}
          </p>
          <code className="break-all text-sm">{error.digest}</code>
        </div>
      )}
      <div className="mt-8 flex items-center gap-6">
        <Button onClick={reset}>{isEs ? "Reintentar" : "Retry"}</Button>
        <Link
          href={isEs ? "/es/" : "/"}
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          {isEs ? "Volver al inicio" : "Back to home"}
        </Link>
      </div>
    </main>
  );
}
