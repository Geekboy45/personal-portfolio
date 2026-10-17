import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { ToastProvider } from "@/components/ui/toast.client";
import { LocaleProvider } from "@/lib/i18n.client";
import { SiteHeader } from "@/components/ui/site-header.client";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteConfig.canonicalOrigin
    ? new URL(siteConfig.canonicalOrigin)
    : undefined,
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/favicon.png",
  },
  robots: {
    index: siteConfig.isIndexable,
    follow: siteConfig.isIndexable,
  },
  openGraph: {
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    url: siteConfig.canonicalOrigin,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface font-sans text-foreground antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-control focus:bg-surface-raised focus:p-4 font-mono text-xs"
        >
          Skip to content
        </a>
        <LocaleProvider>
          <ToastProvider>
            <SiteHeader />
            {children}
            <footer className="mx-auto mt-20 max-w-6xl border-t border-border px-6 py-8">
              <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">
                    Silph Research Division
                  </span>
                  <span>·</span>
                  <span>Biological Telemetry & Analysis System</span>
                </div>
                <a
                  href="https://pokeapi.co/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Data powered by PokéAPI ↗
                </a>
              </div>
            </footer>
          </ToastProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
