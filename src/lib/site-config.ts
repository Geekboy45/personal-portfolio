const configuredOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN;
const isIndexable = process.env.ALLOW_INDEXING === "true";
let canonicalOrigin: string | undefined;
if (configuredOrigin) {
  const url = new URL(configuredOrigin);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "NEXT_PUBLIC_SITE_ORIGIN must be an HTTPS origin without credentials, path, query or fragment.",
    );
  }
  canonicalOrigin = url.origin;
}

if (
  isIndexable &&
  (!canonicalOrigin || process.env.RELEASE_STAGE !== "production")
) {
  throw new Error(
    "Indexing requires an explicit canonical origin and RELEASE_STAGE=production.",
  );
}

export const siteConfig = {
  name: "Luis Elizondo | Tech Lead & Software Engineer",
  titleTemplate: "%s | Luis Elizondo",
  defaultTitle: "Luis Elizondo | Tech Lead & Software Engineer",
  description:
    "Tech Lead & Software Engineer building scalable cloud systems, automation platforms and data-driven products. Engineering, Cloud, AI & Business Impact.",
  canonicalOrigin,
  locale: "en-US",
  isIndexable,
} as const;
