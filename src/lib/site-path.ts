// Public build-time prefix: empty on a custom domain, /repository on project Pages.
export const siteBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

if (
  siteBasePath &&
  (!/^(?:\/[A-Za-z0-9._-]+)+$/.test(siteBasePath) ||
    siteBasePath.split("/").some((part) => part === "." || part === ".."))
) {
  throw new Error(
    "NEXT_PUBLIC_BASE_PATH must be empty or a path such as /personal-portfolio, without a trailing slash.",
  );
}

export function sitePath(path: string) {
  return `${siteBasePath}${path}`;
}
