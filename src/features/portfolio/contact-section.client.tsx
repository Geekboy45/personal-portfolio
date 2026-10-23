"use client";

import Image from "next/image";
import { sitePath } from "@/lib/site-path";
import { profileData } from "@/data/profile";
import { useToast } from "@/components/ui/toast.client";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";

export function ContactSection({ locale = "en" }: { locale?: "en" | "es" }) {
  const isEs = locale === "es";
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
      <div className="grid overflow-hidden rounded-panel bg-foreground text-inverse-foreground lg:grid-cols-[1.2fr_1fr]">
        <div className="p-7 sm:p-12 xl:p-14">
          <p className="font-mono text-xs uppercase tracking-widest text-inverse-accent">
            06 / {isEs ? "La siguiente conversación" : "The next conversation"}
          </p>
          <h2
            id="contact-heading"
            className="mt-6 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl xl:text-6xl"
          >
            {isEs ? "Construyamos lo que sigue." : "Let’s build what’s next."}
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-inverse-foreground/80">
            {isEs
              ? "Hablemos de ingeniería, arquitectura cloud y de cómo ayudar a un equipo a llegar más lejos."
              : "Let’s talk about engineering, cloud architecture, and helping a team go further."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton
              variant="secondary"
              href={`mailto:${profileData.email}`}
            >
              {isEs ? "Escríbeme" : "Email me"}
              <span aria-hidden="true">↗</span>
            </LinkButton>
            <Button variant="secondary" onClick={copyEmail}>
              {isEs ? "Copiar correo" : "Copy email"}
            </Button>
          </div>
          <p className="mt-5 break-all font-mono text-xs text-inverse-foreground/70">
            {profileData.email}
          </p>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-4 border-t border-inverse-foreground/20 pt-6 text-sm">
            {profileData.socials.map((link) => (
              <a
                key={link.icon}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-8 items-center gap-2 underline-offset-4 hover:underline"
              >
                {link.label}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>
        <div className="relative min-h-64 border-t-4 border-primary sm:min-h-80 lg:min-h-full lg:border-l-4 lg:border-t-0">
          <Image
            src={sitePath("/images/profile/contact-connections.webp")}
            alt=""
            fill
            sizes="(min-width: 1280px) 550px, (min-width: 1024px) 45vw, 100vw"
            className="object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-foreground/40 to-transparent"
          />
        </div>
      </div>
    </section>
  );
}
