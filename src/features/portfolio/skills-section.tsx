import { skillDomains, corePhilosophy } from "@/data/skills";

const domainSymbols = ["</>", "☁", "{ }", "✳", "↗", "◎"];

export function SkillsSection({ locale = "en" }: { locale?: "es" | "en" }) {
  const isEs = locale === "es";
  return (
    <section
      id="skills"
      className="scroll-mt-24 border-b border-border py-16 sm:py-24"
      aria-labelledby="skills-heading"
    >
      <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-20">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-primary">
            04 / {isEs ? "Capacidades" : "Capabilities"}
          </p>
          <h2
            id="skills-heading"
            className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
          >
            {isEs ? "Las herramientas cambian." : "Tools evolve."}
            <br />
            <span className="text-primary">
              {isEs ? "El criterio conecta." : "Perspective connects."}
            </span>
          </h2>
        </div>
        <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
          {corePhilosophy[locale]}
        </p>
      </div>
      <div className="mt-12 grid gap-px overflow-hidden rounded-panel border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
        {skillDomains.map((domain, index) => (
          <article
            key={domain.id}
            className={`group relative flex flex-col p-6 sm:p-8 ${index === 0 ? "bg-foreground text-inverse-foreground" : "bg-surface-raised text-foreground"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <span
                aria-hidden="true"
                className={`font-mono text-5xl leading-none ${index === 0 ? "text-inverse-accent" : "text-primary"}`}
              >
                {domainSymbols[index]}
              </span>
              <span
                className={`font-mono text-xs ${index === 0 ? "text-inverse-accent" : "text-muted-foreground"}`}
              >
                / 0{index + 1}
              </span>
            </div>
            <h3 className="mt-8 max-w-xs font-display text-2xl font-semibold leading-tight tracking-tight">
              {domain.name[locale]}
            </h3>
            <p
              className={`mt-4 text-sm leading-relaxed ${index === 0 ? "text-inverse-foreground/80" : "text-muted-foreground"}`}
            >
              {domain.description[locale]}
            </p>
            <ul
              className={`mt-8 flex flex-wrap gap-x-4 gap-y-3 border-t pt-5 text-sm ${index === 0 ? "border-inverse-foreground/20" : "border-border"}`}
            >
              {domain.skills[locale].map((skill, skillIndex) => (
                <li
                  key={skill}
                  className={
                    skillIndex < 3
                      ? "font-semibold"
                      : index === 0
                        ? "text-inverse-foreground/80"
                        : "text-muted-foreground"
                  }
                >
                  {skill}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="mt-5 text-right font-mono text-xs text-muted-foreground">
        {isEs
          ? "De la idea a producción. De los datos al impacto."
          : "From idea to production. From data to impact."}
      </p>
    </section>
  );
}
