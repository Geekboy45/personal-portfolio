import { projectsData } from "@/data/projects";

export function ProjectsSection({ locale = "en" }: { locale?: "en" | "es" }) {
  const isEs = locale === "es";
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="scroll-mt-24 border-b border-border py-16 sm:py-24"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-primary">
        03 / {isEs ? "Trabajo seleccionado" : "Selected work"}
      </p>
      <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <h2
          id="projects-heading"
          className="max-w-xl font-display text-3xl font-semibold tracking-tight sm:text-5xl"
        >
          {isEs
            ? "La experiencia detrás del impacto."
            : "The work behind the impact."}
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          {isEs
            ? "Productos internos y proyectos privados. Comparto mi contribución a grandes rasgos; los detalles de implementación son confidenciales."
            : "Internal products and private projects. A high-level look at my contribution; implementation details are confidential."}
        </p>
      </div>
      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {projectsData.map((project, index) => (
          <article key={project.id} className="border-t border-border pt-5">
            <p className="font-mono text-xs text-muted-foreground">
              0{index + 1} / {project.company}
            </p>
            <h3 className="mt-5 font-display text-xl font-semibold">
              {project.title[locale]}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {project.summary[locale]}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
