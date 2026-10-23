import Image from "next/image";
import { sitePath } from "@/lib/site-path";
import { profileData } from "@/data/profile";
import { LinkButton } from "@/components/ui/link-button";
import { ArrowRightIcon } from "@/components/ui/icons";

interface HeroProps {
  locale?: "es" | "en";
}

export function Hero({ locale = "en" }: HeroProps) {
  const isEs = locale === "es";
  return (
    <section
      aria-labelledby="hero-heading"
      className="border-b border-border pb-12 pt-8 sm:pb-16 sm:pt-16"
    >
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="min-w-0 lg:col-span-7">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs text-muted-foreground">
            <span
              className="h-2 w-2 rounded-full bg-success"
              aria-hidden="true"
            />
            <span>
              {isEs ? "TECH LEAD EN" : "TECH LEAD AT"}{" "}
              {profileData.currentRole.company.toUpperCase()}
            </span>
            <span aria-hidden="true">/</span>
            <span>MONTERREY, MX</span>
          </p>
          <p className="mt-9 text-base font-medium text-muted-foreground">
            {isEs ? "Hola, soy Luis." : "Hello, I’m Luis."}
          </p>
          <h1
            id="hero-heading"
            className="mt-3 font-display text-5xl font-semibold leading-[1.06] tracking-tight text-foreground sm:text-7xl lg:text-6xl xl:text-7xl"
          >
            <span className="block">Luis Ángel</span>{" "}
            <span className="block text-primary">
              Elizondo Gallegos<span className="text-foreground">.</span>
            </span>
          </h1>
          <p className="mt-6 max-w-xl font-display text-xl font-medium leading-snug text-foreground sm:text-2xl">
            {isEs
              ? "Diseño sistemas. Conecto equipos. Multiplico el impacto."
              : "Build systems. Connect teams. Multiply impact."}
          </p>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
            {isEs
              ? "Liderazgo técnico, arquitectura cloud e IA aplicada. Transformo desafíos operativos en software que libera capacidad y escala con el negocio."
              : "Technical leadership, cloud architecture, and applied AI. I turn operational challenges into software that unlocks capacity and scales with the business."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="#projects" variant="ink">
              {isEs ? "Ver proyectos" : "Explore selected work"}
              <ArrowRightIcon size={16} />
            </LinkButton>
            <LinkButton href="#contact" variant="secondary">
              {isEs ? "Hablemos" : "Let’s talk"}
              <span aria-hidden="true">↗</span>
            </LinkButton>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-border pt-5 font-mono text-xs text-muted-foreground">
            <span>.NET / C#</span>
            <span>Azure</span>
            <span>Python & AI</span>
            <span>Next.js</span>
          </div>
        </div>
        <figure className="relative mx-auto w-full max-w-md lg:col-span-5">
          <div
            className="absolute -left-4 -top-4 h-16 w-16 border-l border-t border-primary/40"
            aria-hidden="true"
          />
          <div className="relative aspect-4/5 overflow-hidden rounded-panel bg-surface-muted">
            <Image
              src={sitePath("/images/profile/luis-avatar.jpeg")}
              alt={
                isEs
                  ? "Luis Ángel Elizondo Gallegos en su graduación"
                  : "Luis Ángel Elizondo Gallegos at his graduation"
              }
              fill
              preload
              sizes="(min-width: 1152px) 432px, (min-width: 1024px) 40vw, (min-width: 640px) 448px, 100vw"
              className="object-cover object-center"
            />
          </div>
          <figcaption className="mt-4 flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {isEs
                  ? "De la estrategia a producción."
                  : "From strategy to production."}
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {isEs
                  ? "Liderazgo técnico e ingeniería de software"
                  : "Tech Lead & Software Engineer"}
              </p>
            </div>
            <span aria-hidden="true" className="text-2xl text-primary">
              ↗
            </span>
          </figcaption>
        </figure>
      </div>
      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-muted-foreground sm:mt-16">
        <span>
          {isEs
            ? "INGENIERÍA CON IMPACTO DE NEGOCIO"
            : "ENGINEERING WITH BUSINESS IMPACT"}
        </span>
        <a
          href="#impact"
          className="inline-flex min-h-8 items-center gap-3 text-foreground transition-colors hover:text-primary"
        >
          {isEs ? "Conoce los resultados" : "See the results"}
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
