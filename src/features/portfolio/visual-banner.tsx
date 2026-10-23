import Image from "next/image";
import { sitePath } from "@/lib/site-path";

interface VisualBannerProps {
  locale?: "es" | "en";
}

export function VisualBanner({ locale = "en" }: VisualBannerProps) {
  const isEs = locale === "es";

  return (
    <section
      aria-label={
        isEs ? "Perspectiva de ingeniería" : "Engineering perspective"
      }
      className="my-14 sm:my-20 overflow-hidden rounded-3xl border border-border bg-surface-raised shadow-elevated relative"
    >
      <div className="relative min-h-[300px] w-full overflow-hidden sm:aspect-21/9 sm:min-h-[380px]">
        <Image
          src={sitePath("/images/profile/horizontal-workspace.jpg")}
          alt={
            isEs ? "Espacio de trabajo de ingeniería" : "Engineering workspace"
          }
          fill
          sizes="(min-width: 1280px) 1232px, 100vw"
          className="object-cover "
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/30" />

        {/* Content Overlaid Elegantly */}
        <div className="relative flex min-h-[300px] flex-col justify-end p-6 sm:absolute sm:inset-0 sm:min-h-0 sm:p-10 lg:p-14">
          <div className="max-w-2xl font-mono">
            <span className="inline-flex items-center gap-2 rounded-full border border-inverse-foreground/20 bg-inverse-foreground/10 px-3.5 py-1 text-xs font-semibold text-inverse-foreground/90 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>
                {isEs ? "FILOSOFÍA DE ARQUITECTURA" : "ARCHITECTURE PHILOSOPHY"}
              </span>
            </span>

            <blockquote className="mt-4 font-display text-base leading-relaxed font-extrabold text-inverse-foreground sm:text-2xl sm:leading-snug lg:text-3xl">
              {isEs
                ? "“La ingeniería de software de alto impacto no consiste en complejizar, sino en transformar cuellos de botella operativos en infraestructura invisible y escalable.”"
                : "“High-impact software engineering isn’t about unnecessary complexity — it’s about transforming operational bottlenecks into invisible, scalable infrastructure.”"}
            </blockquote>

            <p className="mt-3 text-xs sm:text-sm text-inverse-foreground/70 font-mono">
              Luis Angel Elizondo Gallegos ·{" "}
              {isEs
                ? "Liderazgo técnico e ingeniería de software"
                : "Tech Lead & Software Engineer"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
