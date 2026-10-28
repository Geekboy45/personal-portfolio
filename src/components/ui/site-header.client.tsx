"use client";
import Link from "next/link";
import { useLocale } from "@/lib/i18n.client";
import { LanguageSelector } from "@/components/ui/language-selector.client";

export function SiteHeader() {
  const { t, locale } = useLocale();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-3">
          <Link
            href={locale === "es" ? "/es/" : "/"}
            className="flex items-center gap-2"
          >
            <span className="font-display text-base font-bold tracking-tight text-foreground sm:text-xl">
              LUIS<span className="text-primary font-normal">.ELIZONDO</span>
            </span>
            <span className="hidden border-l border-border pl-3 font-mono text-[10px] font-medium tracking-wider text-muted-foreground lg:inline">
              TECH LEAD
            </span>
          </Link>
        </div>

        <nav
          aria-label={
            locale === "es" ? "Navegación principal" : "Main navigation"
          }
          className="flex items-center gap-2 sm:gap-5 text-sm font-medium"
        >
          <Link
            href={`${locale === "es" ? "/es/" : "/"}#impact`}
            className="text-muted-foreground transition-colors hover:text-foreground hidden sm:inline"
          >
            {t.nav.impact}
          </Link>
          <Link
            href={`${locale === "es" ? "/es/" : "/"}#projects`}
            className="text-muted-foreground transition-colors hover:text-foreground hidden sm:inline"
          >
            {t.nav.projects}
          </Link>
          <Link
            href={`${locale === "es" ? "/es/" : "/"}#employment`}
            className="text-muted-foreground transition-colors hover:text-foreground hidden md:inline"
          >
            {t.nav.experience}
          </Link>
          <Link
            href={`${locale === "es" ? "/es/" : "/"}#skills`}
            className="text-muted-foreground transition-colors hover:text-foreground hidden md:inline"
          >
            {t.nav.skills}
          </Link>
          <Link
            href={`${locale === "es" ? "/es/" : "/"}#education`}
            className="text-muted-foreground transition-colors hover:text-foreground hidden lg:inline"
          >
            {t.nav.education}
          </Link>
          <Link
            href={`${locale === "es" ? "/es/" : "/"}#contact`}
            className="hidden font-bold text-primary transition-colors hover:text-primary-hover sm:inline"
          >
            {t.nav.contact}
          </Link>
          <LanguageSelector />
          <details
            className="relative sm:hidden"
            onClick={(event) => {
              if (
                event.target instanceof Element &&
                event.target.closest("a")
              ) {
                event.currentTarget.removeAttribute("open");
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.currentTarget.removeAttribute("open");
                event.currentTarget.querySelector("summary")?.focus();
              }
            }}
          >
            <summary className="cursor-pointer rounded-control px-2 py-3 focus-visible:outline-2 focus-visible:outline-focus">
              {t.nav.contact === "Contacto" ? "Menú" : "Menu"}
            </summary>
            <div className="absolute right-0 top-full mt-2 grid min-w-48 rounded-panel border border-border bg-surface-raised p-3 shadow-panel">
              <Link
                className="rounded-control p-3 hover:bg-surface-muted"
                href={`${locale === "es" ? "/es/" : "/"}#impact`}
              >
                {t.nav.impact}
              </Link>
              <Link
                className="rounded-control p-3 hover:bg-surface-muted"
                href={`${locale === "es" ? "/es/" : "/"}#projects`}
              >
                {t.nav.projects}
              </Link>
              <Link
                className="rounded-control p-3 hover:bg-surface-muted"
                href={`${locale === "es" ? "/es/" : "/"}#employment`}
              >
                {t.nav.experience}
              </Link>
              <Link
                className="rounded-control p-3 hover:bg-surface-muted"
                href={`${locale === "es" ? "/es/" : "/"}#skills`}
              >
                {t.nav.skills}
              </Link>
              <Link
                className="rounded-control p-3 hover:bg-surface-muted"
                href={`${locale === "es" ? "/es/" : "/"}#education`}
              >
                {t.nav.education}
              </Link>
              <Link
                className="rounded-control p-3 hover:bg-surface-muted"
                href={`${locale === "es" ? "/es/" : "/"}#contact`}
              >
                {t.nav.contact}
              </Link>
            </div>
          </details>
        </nav>
      </div>
    </header>
  );
}
