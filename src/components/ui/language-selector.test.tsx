import { expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocaleProvider, useLocale } from "@/lib/i18n.client";
import { LanguageSelector } from "./language-selector.client";

function SampleConsumer() {
  const { t } = useLocale();
  return <p data-testid="msg">{t.nav.registry}</p>;
}

it("switches translated consumers without relabeling untranslated content when selecting EN or ES", async () => {
  document.documentElement.lang = "en";
  const user = userEvent.setup();
  render(
    <LocaleProvider>
      <LanguageSelector />
      <SampleConsumer />
    </LocaleProvider>,
  );

  // Default is English
  expect(screen.getByTestId("msg")).toHaveTextContent("Specimen Registry");
  expect(screen.getByRole("button", { name: "EN" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  // Switch to Spanish
  const esButton = screen.getByRole("button", { name: "ES" });
  await user.click(esButton);

  expect(screen.getByTestId("msg")).toHaveTextContent(
    "Registro de Especímenes",
  );
  expect(esButton).toHaveAttribute("aria-pressed", "true");
  expect(document.documentElement.lang).toBe("en");
});

it("uses the route locale even when an opposite browser preference is stored", () => {
  localStorage.setItem("portfolio_locale", "en");
  render(
    <LocaleProvider routeLocale="es">
      <LanguageSelector />
      <SampleConsumer />
    </LocaleProvider>,
  );
  expect(screen.getByTestId("msg")).toHaveTextContent(
    "Registro de Especímenes",
  );
  expect(screen.getByRole("link", { name: "Español" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(screen.getByRole("link", { name: "Español" })).toHaveAttribute(
    "href",
    "/es/",
  );
  expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
    "href",
    "/",
  );
});
