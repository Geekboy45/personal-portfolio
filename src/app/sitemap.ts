import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { sitePath } from "@/lib/site-path";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteConfig.canonicalOrigin;
  if (!siteConfig.isIndexable || !origin) return [];
  return [
    {
      url: `${origin}${sitePath("/")}`,
      alternates: {
        languages: {
          en: `${origin}${sitePath("/")}`,
          es: `${origin}${sitePath("/es/")}`,
        },
      },
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${origin}${sitePath("/es/")}`,
      alternates: {
        languages: {
          en: `${origin}${sitePath("/")}`,
          es: `${origin}${sitePath("/es/")}`,
        },
      },
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
