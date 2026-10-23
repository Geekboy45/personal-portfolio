"use client";
import { useLocale, type Locale } from "@/lib/i18n.client";
import { sitePath } from "@/lib/site-path";

export function LanguageSelector() {
  const { locale, routeLocale, setLocale } = useLocale();

  const options: { code: Locale; label: string; title: string }[] = [
    { code: "en", label: "EN", title: "English" },
    { code: "es", label: "ES", title: "Español" },
  ];

  return (
    <div
      role="group"
      aria-label={locale === "es" ? "Selector de idioma" : "Language selector"}
      className="inline-flex items-center rounded-control border border-border bg-surface-raised p-0.5 shadow-xs"
    >
      {options.map(({ code, label, title }) => {
        const isActive = locale === code;
        if (routeLocale) {
          return (
            <a
              key={code}
              href={sitePath(code === "es" ? "/es/" : "/")}
              hrefLang={code}
              lang={code}
              aria-label={title}
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex min-h-8 min-w-8 items-center justify-center rounded-sm px-2 font-mono text-xs font-semibold transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {label}
            </a>
          );
        }
        return (
          <button
            key={code}
            type="button"
            aria-pressed={isActive}
            title={title}
            onClick={() => setLocale(code)}
            className={`rounded-sm px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
