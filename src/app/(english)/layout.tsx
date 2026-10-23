import { SiteShell, getSiteMetadata } from "@/app/site-shell";
export const metadata = getSiteMetadata("en");
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
