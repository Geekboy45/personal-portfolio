import { SiteShell, getSiteMetadata } from "@/app/site-shell";
export const metadata = getSiteMetadata("es");
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="es">{children}</SiteShell>;
}
