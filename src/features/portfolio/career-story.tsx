import { CareerStoryMotion } from "./career-story.client";
import { EmploymentSection } from "./employment-section";

import { careerChapters } from "@/data/experience";

export function CareerStory({ locale = "en" }: { locale?: "en" | "es" }) {
  const isEs = locale === "es";
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="scroll-mt-24 border-b border-border py-16 sm:py-24"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-primary">
        02 / {isEs ? "Mi recorrido" : "My journey"}
      </p>
      <h2
        id="experience-heading"
        className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-5xl"
      >
        {isEs
          ? "De entender los datos a conectar personas y sistemas."
          : "From understanding data to connecting people and systems."}
      </h2>
      <CareerStoryMotion locale={locale}>
        {careerChapters.map((chapter, index) => (
          <article
            key={chapter.id}
            className="flex flex-col justify-center border-t border-border py-10 md:min-h-[55vh] md:py-16"
          >
            <p className="font-mono text-xs text-primary">
              0{index + 1} / {chapter.year}
            </p>
            <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {chapter.title[locale]}
            </h3>
            <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">
              {chapter.body[locale]}
            </p>
            <p className="mt-6 font-mono text-xs text-primary">
              {chapter.tag[locale]}
            </p>
          </article>
        ))}
      </CareerStoryMotion>
      <EmploymentSection locale={locale} />
    </section>
  );
}
