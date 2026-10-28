"use client";

import { useReducedMotion } from "@/lib/reduced-motion.client";
import { sitePath } from "@/lib/site-path";

import { profileData } from "@/data/profile";
import { useToast } from "@/components/ui/toast.client";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";

export function ContactSection({ locale = "en" }: { locale?: "en" | "es" }) {
  const isEs = locale === "es";
  const reducedMotion = useReducedMotion();
  const { showToast } = useToast();
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profileData.email);
      showToast({
        title: isEs ? "Correo copiado" : "Email copied",
        description: profileData.email,
        variant: "success",
      });
    } catch {
      showToast({
        title: isEs ? "No se pudo copiar el correo" : "Could not copy email",
        description: profileData.email,
        variant: "info",
      });
    }
  }
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-24 py-16 sm:py-24"
    >
      <div className="group/contact isolate overflow-hidden rounded-panel bg-primary text-primary-foreground">
        <div className="relative px-7 pt-8 pb-10 sm:px-12 sm:pt-12 sm:pb-14 lg:px-14">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-primary-foreground/25 pb-6 font-mono text-xs uppercase tracking-widest">
            <p>
              06 /{" "}
              {isEs ? "La siguiente conversación" : "The next conversation"}
            </p>
            <span className="text-primary-foreground/80">Monterrey, MX</span>
          </div>
          <div className="mt-10 grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <h2
                id="contact-heading"
                className="max-w-3xl font-display text-4xl font-semibold leading-none tracking-tight sm:text-6xl md:text-5xl lg:text-7xl xl:text-8xl"
              >
                {isEs ? "Una buena idea." : "A good idea."}
                <br />
                <span className="text-inverse-accent">
                  {isEs ? "Una conversación." : "One conversation."}
                </span>
              </h2>
              <p className="mt-7 max-w-lg text-base leading-relaxed text-primary-foreground/90 sm:text-lg">
                {isEs
                  ? "¿Qué te gustaría construir? Hablemos de tecnología, equipos y de lo que viene después."
                  : "What would you like to build? Let’s talk about technology, teams, and what comes next."}
              </p>
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none relative hidden size-40 items-center justify-center md:flex lg:size-52"
            >
              <div
                className={`absolute inset-0 rounded-full border border-primary-foreground/35 ${reducedMotion ? "" : "motion-safe:transition-transform motion-safe:duration-(--motion-contact-duration) motion-safe:ease-(--ease-portfolio) motion-safe:group-hover/contact:scale-110 motion-safe:group-focus-within/contact:scale-110"}`}
              />
              <div className="absolute inset-4 rounded-full border border-primary-foreground/20" />
              <svg
                viewBox="0 0 100 100"
                fill="none"
                className={`size-24 lg:size-32 ${reducedMotion ? "" : "motion-safe:transition-transform motion-safe:duration-(--motion-contact-duration) motion-safe:ease-(--ease-portfolio) motion-safe:group-hover/contact:translate-x-2 motion-safe:group-hover/contact:-translate-y-2 motion-safe:group-focus-within/contact:translate-x-2 motion-safe:group-focus-within/contact:-translate-y-2"}`}
              >
                <path
                  d="M22 78 78 22M23 22h55v55"
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-7 bg-foreground px-7 py-7 text-inverse-foreground sm:px-12 lg:flex-row lg:items-center lg:justify-between lg:px-14">
          <div className="flex flex-wrap items-center gap-3">
            <LinkButton
              variant="secondary"
              href={`mailto:${profileData.email}`}
            >
              {isEs ? "Iniciemos la conversación" : "Start a conversation"}
              <span aria-hidden="true">↗</span>
            </LinkButton>
            <Button variant="secondary" onClick={copyEmail}>
              {isEs ? "Copiar correo" : "Copy email"}
            </Button>
            <LinkButton
              variant="secondary"
              href={sitePath("/files/luis-elizondo-cv.pdf")}
              download="Luis-Elizondo-CV.pdf"
            >
              {isEs
                ? "Descargar CV · PDF en inglés"
                : "Download CV · PDF in English"}
              <span aria-hidden="true">↓</span>
            </LinkButton>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <p className="break-all font-mono text-xs text-inverse-foreground/80">
              {profileData.email}
            </p>
            {profileData.socials.map((link) => (
              <a
                key={link.icon}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-8 items-center gap-2 text-sm underline-offset-4 hover:underline"
              >
                {link.label}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
