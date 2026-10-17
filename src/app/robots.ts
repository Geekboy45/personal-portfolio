import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/explore"],
      disallow: ["/api/"],
    },
    sitemap:
      siteConfig.isIndexable && siteConfig.canonicalOrigin
        ? `${siteConfig.canonicalOrigin}/sitemap.xml`
        : undefined,
  };
}
