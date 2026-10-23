import type { Metadata } from "next";
import { profileData } from "@/data/profile";
import { siteConfig } from "@/lib/site-config";
import { sitePath } from "@/lib/site-path";
import { ToastProvider } from "@/components/ui/toast.client";
import { LocaleProvider } from "@/lib/i18n.client";
import { SiteHeader } from "@/components/ui/site-header.client";
import { MotionPreference } from "@/components/ui/motion-preference.client";
import "./globals.css";
import type { Locale } from "@/lib/i18n.client";

export function getSiteMetadata(locale: Locale): Metadata {
  const isEs = locale === "es";
  return {
    metadataBase: siteConfig.canonicalOrigin
      ? new URL(siteConfig.canonicalOrigin)
      : undefined,
    title: {
      default: isEs
        ? "Luis Elizondo | Liderazgo técnico e ingeniería de software"
        : siteConfig.defaultTitle,
      template: siteConfig.titleTemplate,
    },
    description: isEs
      ? "Liderazgo técnico, arquitectura cloud e inteligencia artificial aplicada. Conoce mi trayectoria y enfoque de ingeniería."
      : siteConfig.description,
    icons: {
      icon: [
        { url: sitePath("/favicon.svg"), type: "image/svg+xml" },
        { url: sitePath("/favicon.ico"), sizes: "any" },
      ],
      apple: sitePath("/favicon.png"),
    },
    alternates: siteConfig.canonicalOrigin
      ? {
          canonical: sitePath(isEs ? "/es/" : "/"),
          languages: {
            en: sitePath("/"),
            es: sitePath("/es/"),
            "x-default": sitePath("/"),
          },
        }
      : undefined,
    robots: {
      index: siteConfig.isIndexable,
      follow: siteConfig.isIndexable,
    },
    openGraph: {
      title: isEs
        ? "Luis Elizondo | Liderazgo técnico e ingeniería de software"
        : siteConfig.defaultTitle,
      description: isEs
        ? "Liderazgo técnico, arquitectura cloud e inteligencia artificial aplicada. Conoce mi trayectoria y enfoque de ingeniería."
        : siteConfig.description,
      url: siteConfig.canonicalOrigin
        ? `${siteConfig.canonicalOrigin}${sitePath(isEs ? "/es/" : "/")}`
        : undefined,
      siteName: siteConfig.name,
      locale: isEs ? "es_MX" : "en_US",
      type: "website",
    },
  };
}

export function SiteShell({
  children,
  locale,
}: Readonly<{ children: React.ReactNode; locale: Locale }>) {
  return (
    <html lang={locale}>
      <body className="min-h-screen bg-surface font-sans text-foreground antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-control focus:bg-surface-raised focus:p-4 font-mono text-xs"
        >
          {locale === "es" ? "Saltar al contenido" : "Skip to content"}
        </a>
        <LocaleProvider routeLocale={locale}>
          <ToastProvider>
            <SiteHeader />
            {children}
            <footer className="mx-auto mt-20 max-w-7xl border-t border-border px-6 py-8">
              <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground">
                    Luis Ángel Elizondo Gallegos
                  </span>
                  <span>·</span>
                  <span>
                    {locale === "es"
                      ? "Liderazgo técnico e ingeniería de software"
                      : "Tech Lead & Software Engineer"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span>
                    {locale === "es"
                      ? "Monterrey, NL, México"
                      : "Monterrey, NL, Mexico"}
                  </span>
                  <span>·</span>
                  {profileData.socials.map((link) => (
                    <a
                      key={link.icon}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              </div>
              <div className="mt-6 border-t border-border pt-4">
                <MotionPreference locale={locale} />
              </div>
            </footer>
          </ToastProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
