import { impactMetrics } from "@/data/metrics";

export function ImpactMetrics({ locale = "en" }: { locale?: "es" | "en" }) {
  const isEs = locale === "es";
  return (
    <section
      id="impact"
      className="scroll-mt-24 border-b border-border py-16 sm:py-20"
      aria-labelledby="impact-heading"
    >
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-primary">
            01 / {isEs ? "Impacto" : "The impact"}
          </p>
          <h2
            id="impact-heading"
            className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            {isEs
              ? "Menos fricción. Más capacidad."
              : "Less friction. More capacity."}
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          {isEs
            ? "Resultados de plataformas y automatización en producción."
            : "Outcomes from platforms and automation running in production."}
        </p>
      </div>
      <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {impactMetrics.map((item, index) => (
          <article key={item.id} className="border-t border-border pt-5">
            <span className="font-mono text-xs text-muted-foreground">
              / 0{index + 1}
            </span>
            <p className="mt-4 font-display text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
              {item.displayValue}
            </p>
            <h3 className="mt-3 text-sm font-semibold text-foreground">
              {item.title[locale]}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {item.copy[locale]}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
