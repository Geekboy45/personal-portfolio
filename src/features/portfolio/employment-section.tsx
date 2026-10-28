import { employmentHistory } from "@/data/experience";
import { LinkButton } from "@/components/ui/link-button";
import { sitePath } from "@/lib/site-path";
import { EmploymentList } from "./employment-list.client";

export function EmploymentSection({ locale }: { locale: "en" | "es" }) {
  const isEs = locale === "es";
  return (
    <section
      id="employment"
      aria-labelledby="employment-heading"
      className="scroll-mt-24 pt-12 sm:pt-16"
    >
      <div className="flex flex-wrap items-end justify-between gap-6 pb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-primary">
            {isEs ? "Experiencia profesional" : "Professional experience"}
          </p>
          <h3
            id="employment-heading"
            className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {isEs ? "Dónde he contribuido." : "Where I’ve contributed."}
          </h3>
        </div>
        <LinkButton
          href={sitePath("/files/luis-elizondo-cv.pdf")}
          download="Luis-Elizondo-CV.pdf"
          variant="secondary"
        >
          {isEs
            ? "Descargar CV · PDF en inglés"
            : "Download CV · PDF in English"}
          <span aria-hidden="true">↓</span>
        </LinkButton>
      </div>
      <EmploymentList>
        {employmentHistory.map((job, index) => (
          <li key={job.id} className="relative pl-8 sm:pl-14">
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-2 top-0 w-px bg-border sm:left-5"
            />
            <span
              aria-hidden="true"
              data-marker
              className="absolute left-0 top-8 size-4 rounded-full border-4 border-surface bg-primary sm:left-3"
            />
            <article
              className={`grid gap-5 rounded-panel border p-6 sm:grid-cols-12 sm:gap-8 sm:p-8 ${index === 0 ? "border-foreground bg-foreground text-inverse-foreground" : "border-border bg-surface-raised"}`}
            >
              <div className="sm:col-span-4">
                <p
                  className={`mb-4 font-mono text-xs uppercase tracking-widest ${index === 0 ? "text-inverse-accent" : "text-muted-foreground"}`}
                >
                  {index === 0
                    ? isEs
                      ? "Actualmente"
                      : "Current role"
                    : `0${index + 1}`}
                </p>
                <p className="font-display text-2xl font-semibold">
                  {job.company}
                </p>
                <p
                  className={`mt-2 font-mono text-xs leading-relaxed ${index === 0 ? "text-inverse-foreground/80" : "text-muted-foreground"}`}
                >
                  {job.period[locale]}
                </p>
              </div>
              <div className="sm:col-span-8">
                <h4
                  className={`font-display text-xl font-semibold sm:text-2xl ${index === 0 ? "text-inverse-accent" : "text-primary"}`}
                >
                  {job.role[locale]}
                </h4>
                <p
                  className={`mt-3 max-w-2xl text-sm leading-relaxed ${index === 0 ? "text-inverse-foreground/80" : "text-muted-foreground"}`}
                >
                  {job.summary[locale]}
                </p>
              </div>
            </article>
          </li>
        ))}
      </EmploymentList>
    </section>
  );
}
