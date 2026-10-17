"use client";
import { useLocale, type Locale } from "@/lib/i18n.client";

export function LanguageSelector() {
  const { locale, setLocale } = useLocale();

  const options: { code: Locale; label: string; title: string }[] = [
    { code: "en", label: "EN", title: "English" },
    { code: "es", label: "ES", title: "Español" },
  ];

  return (
    <div
      role="group"
      aria-label="Language selector"
      className="inline-flex items-center rounded-control border border-border bg-surface-raised p-0.5 shadow-xs"
    >
      {options.map(({ code, label, title }) => {
        const isActive = locale === code;
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
