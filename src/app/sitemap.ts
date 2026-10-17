import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteConfig.canonicalOrigin;
  if (!siteConfig.isIndexable || !origin) return [];
  return [
    {
      url: `${origin}/`,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${origin}/explore/`,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
}
