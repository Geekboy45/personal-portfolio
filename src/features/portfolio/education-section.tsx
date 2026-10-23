import Image from "next/image";
import { sitePath } from "@/lib/site-path";
import { educationData } from "@/data/education";
import { awardsData } from "@/data/achievements";
import { educationPhotos } from "@/data/education-gallery";
import { EducationGallery } from "./education-gallery.client";

export function EducationSection({ locale = "en" }: { locale?: "en" | "es" }) {
  const isEs = locale === "es";
  return (
    <section
      id="education"
      className="scroll-mt-24 border-b border-border py-16 sm:py-24"
      aria-labelledby="education-heading"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-primary">
        05 / {isEs ? "Los cimientos" : "The foundations"}
      </p>
      <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <h2
            id="education-heading"
            className="font-display text-3xl font-semibold tracking-tight sm:text-5xl"
          >
            {isEs
              ? "Aprender. Conectar. Ir más lejos."
              : "Learn. Connect. Go further."}
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            {isEs
              ? "Una formación en inteligencia de negocios que se convirtió en una forma de entender la tecnología: con curiosidad y propósito."
              : "A foundation in business intelligence that became a way of approaching technology: with curiosity and purpose."}
          </p>
        </div>
        <p className="shrink-0 text-muted-foreground">
          <strong className="font-display text-4xl font-semibold text-primary">
            99.43
          </strong>{" "}
          / 100
          <br />
          <span className="font-mono text-xs">
            {isEs ? "PROMEDIO UNIVERSITARIO" : "UNIVERSITY GPA"}
          </span>
        </p>
      </div>
      <EducationGallery locale={locale} total={educationPhotos.length}>
        {educationPhotos.map((photo, index) => (
          <figure
            key={photo.id}
            className={`min-w-0 shrink-0 ${photo.orientation === "portrait" ? "basis-[52%] max-w-[calc((100svh-15rem)*21/32)] md:basis-[32%] lg:basis-[29%]" : "basis-[88%] md:basis-[82%] lg:basis-[78%]"}`}
          >
            <div
              className={`relative flex max-h-[calc(100svh-15rem)] min-h-40 items-center justify-center overflow-hidden rounded-panel border border-border bg-surface-muted ${photo.orientation === "portrait" ? "aspect-[21/32]" : "aspect-video"}`}
            >
              {photo.src ? (
                <Image
                  src={sitePath(photo.src)}
                  alt={photo.alt[locale]}
                  fill
                  sizes={
                    photo.orientation === "portrait"
                      ? "(min-width: 1280px) 360px, (min-width: 768px) 32vw, 52vw"
                      : "(min-width: 1280px) 960px, (min-width: 768px) 82vw, 88vw"
                  }
                  className={
                    photo.orientation === "portrait"
                      ? "object-contain"
                      : "object-cover"
                  }
                />
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 80 56"
                    fill="none"
                    className="mx-auto h-14 w-20 text-primary/40"
                  >
                    <rect
                      x="1"
                      y="1"
                      width="78"
                      height="54"
                      rx="6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="55"
                      cy="17"
                      r="5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="m7 48 21-25 17 18 9-10 19 17"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <p className="mt-4 font-mono text-xs">
                    {isEs ? "Fotografía pendiente" : "Photo to be added"}
                  </p>
                </div>
              )}
            </div>
            <figcaption className="mt-3 flex items-center justify-between gap-4 text-sm">
              <span>{photo.caption[locale]}</span>
              <span className="font-mono text-xs text-muted-foreground">
                0{index + 1} / 03
              </span>
            </figcaption>
          </figure>
        ))}
      </EducationGallery>
      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest text-primary">
            {isEs ? "Formación académica" : "Education"}
          </h3>
          {educationData.map((item) => (
            <article key={item.id} className="mt-5 border-t border-border pt-5">
              <p className="text-sm text-muted-foreground">
                {item.institution} · {item.period[locale]}
              </p>
              <h4 className="mt-2 text-lg font-medium">
                {item.degree[locale]}
              </h4>
              {item.grade && (
                <p className="mt-2 font-mono text-xs text-primary">
                  {isEs ? "Promedio" : "Grade"}: {item.grade}
                </p>
              )}
            </article>
          ))}
        </div>
        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest text-primary">
            {isEs ? "Distinciones" : "Honors"}
          </h3>
          {awardsData.map((award) => (
            <article
              key={award.id}
              className="mt-5 border-t border-border pt-5"
            >
              <p className="text-sm text-muted-foreground">
                {award.institution} · {award.date[locale]}
              </p>
              <h4 className="mt-2 text-lg font-medium">
                {award.title[locale]}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {award.context[locale]}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
