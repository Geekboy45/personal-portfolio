// @vitest-environment node
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
const css = readFileSync(new URL("./tokens.css", import.meta.url), "utf8");
function luminance(token: string) {
  const hex = css.match(new RegExp(`${token}:\\s*#([a-f0-9]{6})`, "i"))?.[1];
  if (!hex) throw new Error(`Expected an opaque hex token: ${token}`);
  const rgb = [0, 2, 4].map((offset) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0]! * 0.2126 + rgb[1]! * 0.7152 + rgb[2]! * 0.0722;
}
it.each([
  ["--color-error-foreground", "--color-surface-raised", 4.5],
  ["--color-error-foreground", "--color-surface", 4.5],
  ["--color-danger-foreground", "--color-danger", 4.5],
  ["--color-muted-foreground", "--color-surface-muted", 4.5],
  ["--color-focus", "--color-surface-raised", 3],
])("checks contrast between %s and %s", (foreground, background, minimum) => {
  const a = luminance(foreground),
    b = luminance(background);
  expect(
    (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
  ).toBeGreaterThanOrEqual(minimum);
});
