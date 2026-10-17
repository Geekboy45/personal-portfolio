"use client";
import { useLocale } from "@/lib/i18n.client";

export function ExploreHeader() {
  const { t } = useLocale();

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
          {t.explore.tag}
        </span>
        <span className="font-mono text-xs text-muted-foreground/40">/</span>
        <span className="font-mono text-xs text-muted-foreground">
          {t.explore.subtag}
        </span>
      </div>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {t.explore.title}
      </h1>
      <p className="mt-3 max-w-2xl text-base text-muted-foreground">
        {t.explore.description}
      </p>
    </div>
  );
}
