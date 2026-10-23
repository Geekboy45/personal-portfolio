import { afterEach, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

it.each(["", "/personal-portfolio"])(
  "preserves localized and asset paths under %s",
  async (prefix) => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", prefix);
    vi.resetModules();
    const { sitePath } = await import("./site-path");
    expect(sitePath("/es/")).toBe(`${prefix}/es/`);
    expect(sitePath("/images/profile/luis-graduation.jpeg")).toBe(
      `${prefix}/images/profile/luis-graduation.jpeg`,
    );
  },
);

it.each(["/repo/", "https://example.com", "/../repo"])(
  "rejects invalid build prefix %s",
  async (prefix) => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", prefix);
    vi.resetModules();
    await expect(import("./site-path")).rejects.toThrow(
      "NEXT_PUBLIC_BASE_PATH",
    );
  },
);
