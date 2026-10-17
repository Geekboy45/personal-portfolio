"use client";
import Link from "next/link";
import { useLocale } from "@/lib/i18n.client";
import { LanguageSelector } from "@/components/ui/language-selector.client";

export function SiteHeader() {
  const { t } = useLocale();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              SILPH<span className="text-primary font-normal">.OS</span>
            </span>
            <span className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
              {t.nav.version}
            </span>
          </Link>
          <div className="hidden items-center gap-2 rounded-full border border-border/80 bg-surface-raised px-3 py-1 font-mono text-xs text-muted-foreground md:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span>{t.nav.online}</span>
          </div>
        </div>
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-4 sm:gap-6"
        >
          <Link
            href="/explore/"
            className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.nav.registry} <span aria-hidden="true">↗</span>
          </Link>
          <LanguageSelector />
        </nav>
      </div>
    </header>
  );
}
