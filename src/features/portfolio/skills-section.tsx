import { skillDomains, corePhilosophy } from "@/data/skills";

interface SkillsSectionProps {
  locale?: "es" | "en";
}

export function SkillsSection({ locale = "en" }: SkillsSectionProps) {
  const isEs = locale === "es";

  return (
    <section
      id="skills"
      className="scroll-mt-24 border-b border-border/80 py-16 sm:py-24"
      aria-labelledby="skills-heading"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/80 pb-6">
        <div className="max-w-2xl">
          <div className="inline-flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary">
            <span>04 / {isEs ? "Capacidades" : "Capabilities"}</span>
            <span>{"//"}</span>
            <span className="text-primary font-semibold">
              {isEs ? "Áreas técnicas" : "Core domains"}
            </span>
          </div>
          <h2
            id="skills-heading"
            className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            {isEs
              ? "Dominios Técnicos & Ecosistema"
              : "Technical Domains & Cloud Stack"}
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            {isEs
              ? "Herramientas y tecnologías en producción: arquitectura cloud, servicios de backend y pipelines de inteligencia artificial."
              : "Production-grade tools: cloud architecture, distributed backends, and operational machine learning."}
          </p>
        </div>
      </div>

      {/* Direct Convergence Philosophy */}
      <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:p-7 shadow-xs">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary block mb-2">
          {isEs ? "ENFOQUE DE ARQUITECTURA" : "ENGINEERING APPROACH"}
        </span>
        <p className="text-base sm:text-lg font-semibold text-foreground leading-relaxed">
          &ldquo;{corePhilosophy[locale]}&rdquo;
        </p>
      </div>

      {/* Clean 3-Column Domains Grid */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillDomains.map((domain, index) => (
          <article
            key={domain.id}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-surface-raised p-6 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-panel"
          >
            <div>
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <span className="font-mono text-xs font-bold text-primary">
                  0{index + 1}
                </span>
                <span className="font-mono text-[10px] uppercase font-semibold text-muted-foreground">
                  {isEs ? "ÁREA" : "DOMAIN"}
                </span>
              </div>

              <h3 className="mt-3 font-display text-lg font-bold text-foreground">
                {domain.name[locale]}
              </h3>

              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                {domain.description[locale]}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-1.5 pt-3 border-t border-border/50">
              {domain.skills[locale].map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-surface px-2 py-0.5 font-mono text-[11px] font-medium text-foreground border border-border/70 shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
