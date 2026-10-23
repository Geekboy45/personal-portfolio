import Link from "next/link";

export function NotFoundView({ locale }: { locale: "en" | "es" }) {
  const isEs = locale === "es";
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-6 py-24">
      <p className="font-mono text-xs text-primary">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">
        {isEs ? "Esta página no existe." : "This page doesn’t exist."}
      </h1>
      <p className="mt-4 text-muted-foreground">
        {isEs
          ? "Puedes volver al inicio para seguir explorando el portafolio."
          : "Head back to the homepage to explore the portfolio."}
      </p>
      <Link
        href={isEs ? "/es/" : "/"}
        className="mt-8 inline-flex min-h-11 items-center text-primary underline-offset-4 hover:underline"
      >
        {isEs ? "Volver al inicio" : "Back to home"} →
      </Link>
    </main>
  );
}
