import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { sitePath } from "@/lib/site-path";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [sitePath("/"), sitePath("/es/")],
      disallow: [sitePath("/api/")],
    },
    sitemap:
      siteConfig.isIndexable && siteConfig.canonicalOrigin
        ? `${siteConfig.canonicalOrigin}${sitePath("/sitemap.xml")}`
        : undefined,
  };
}
