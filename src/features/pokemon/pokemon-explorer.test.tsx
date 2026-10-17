import { StrictMode, type ReactNode } from "react";
import { ToastProvider } from "@/components/ui/toast.client";
import { expect, it, vi } from "vitest";
import { render as baseRender, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import { PokemonExplorer } from "./pokemon-explorer.client";
import { LocaleProvider } from "@/lib/i18n.client";
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));
const render = (ui: ReactNode) =>
  baseRender(
    <StrictMode>
      <ToastProvider>{ui}</ToastProvider>
    </StrictMode>,
  );
const listUrl = "https://pokeapi.co/api/v2/pokemon";
const speciesUrl = "https://pokeapi.co/api/v2/pokemon-species";
it("loads the collection, opens a named dialog and restores focus after Escape", async () => {
  server.use(
    http.get(listUrl, () =>
      HttpResponse.json({
        count: 13,
        results: [{ name: "bulbasaur", url: listUrl + "/1/" }],
      }),
    ),
    http.get(listUrl + "/bulbasaur", () =>
      HttpResponse.json({
        id: 1,
        name: "bulbasaur",
        height: 7,
        weight: 69,
        species: { name: "bulbasaur" },
        types: [{ type: { name: "grass" } }],
        sprites: { front_default: null },
      }),
    ),
    http.get(speciesUrl + "/bulbasaur", () =>
      HttpResponse.json({
        id: 1,
        name: "bulbasaur",
        flavor_text_entries: [
          {
            flavor_text: "A strange seed was planted on its back.",
            language: { name: "en" },
          },
        ],
        genera: [
          { genus: "Seed Pokémon", language: { name: "en" } },
          { genus: "Pokémon Semilla", language: { name: "es" } },
        ],
        habitat: { name: "grassland" },
        capture_rate: 45,
      }),
    ),
  );
  const user = userEvent.setup();
  render(<PokemonExplorer />);
  expect(screen.getByRole("status")).toHaveTextContent("Opening");
  const trigger = await screen.findByRole("button", {
    name: "Read about bulbasaur",
  });
  expect(screen.getByRole("link", { name: "Next →" })).toHaveAttribute(
    "href",
    "?page=2",
  );
  await user.click(trigger);
  const dialog = await screen.findByRole("dialog", {
    name: "bulbasaur",
  });
  expect(await within(dialog).findByText("0.7 m")).toBeVisible();
  expect(within(dialog).getByText("No illustration available")).toBeVisible();

  // Test screen navigation to Field Lore tab
  const loreTab = within(dialog).getByRole("tab", { name: /Field Lore/i });
  const telemetryTab = within(dialog).getByRole("tab", {
    name: /^Telemetry$/i,
  });
  telemetryTab.focus();
  await user.keyboard("{ArrowRight}");
  expect(loreTab).toHaveFocus();
  expect(loreTab).toHaveAttribute("tabindex", "0");
  expect(
    await within(dialog).findByText(/A strange seed was planted on its back/),
  ).toBeVisible();

  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

it("renders an empty result without inventing cards", async () => {
  server.use(
    http.get(listUrl, () => HttpResponse.json({ count: 0, results: [] })),
  );
  render(<PokemonExplorer />);
  expect(await screen.findByText("No Pokémon on this page.")).toBeVisible();
  expect(
    screen.queryByRole("button", { name: /Read about/ }),
  ).not.toBeInTheDocument();
});
it("keeps hostile API content out of the rendered UI and allows retry", async () => {
  server.use(
    http.get(listUrl, () =>
      HttpResponse.json({
        count: 1,
        results: [{ name: '<img src=x onerror="alert(1)">' }],
      }),
    ),
  );
  const user = userEvent.setup();
  render(<PokemonExplorer />);
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "unexpected response",
  );
  expect(document.querySelector("img")).toBeNull();
  server.use(
    http.get(listUrl, () =>
      HttpResponse.json({
        count: 1,
        results: [{ name: "pikachu", url: listUrl + "/25/" }],
      }),
    ),
  );
  await user.click(screen.getByRole("button", { name: "Try again" }));
  expect(
    await screen.findByRole("button", { name: "Read about pikachu" }),
  ).toBeVisible();
});
it("filters the collection using the search bar and clears the filter", async () => {
  server.use(
    http.get(listUrl, () =>
      HttpResponse.json({
        count: 2,
        results: [
          { name: "bulbasaur", url: listUrl + "/1/" },
          { name: "charmander", url: listUrl + "/4/" },
        ],
      }),
    ),
  );
  const user = userEvent.setup();
  render(<PokemonExplorer />);
  expect(
    await screen.findByRole("button", { name: "Read about bulbasaur" }),
  ).toBeVisible();
  expect(
    screen.getByRole("button", { name: "Read about charmander" }),
  ).toBeVisible();

  const searchInput = screen.getByRole("searchbox", {
    name: "Search Pokémon across the collection",
  });
  await user.type(searchInput, "char");

  expect(
    await screen.findByRole("button", { name: "Read about charmander" }),
  ).toBeVisible();
  expect(
    screen.queryByRole("button", { name: "Read about bulbasaur" }),
  ).not.toBeInTheDocument();

  await user.type(searchInput, "xyz");
  expect(await screen.findByText(/No Pokémon match/)).toBeVisible();

  const clearButton = screen.getByRole("button", { name: "Clear search" });
  await user.click(clearButton);
  expect(
    await screen.findByRole("button", { name: "Read about bulbasaur" }),
  ).toBeVisible();
  expect(
    screen.getByRole("button", { name: "Read about charmander" }),
  ).toBeVisible();
});

it("renders Pokédex device in Spanish without dual bilingual repetition when Spanish locale is active", async () => {
  server.use(
    http.get(listUrl, () =>
      HttpResponse.json({
        count: 1,
        results: [{ name: "bulbasaur", url: listUrl + "/1/" }],
      }),
    ),
    http.get(listUrl + "/bulbasaur", () =>
      HttpResponse.json({
        id: 1,
        name: "bulbasaur",
        height: 7,
        weight: 69,
        species: { name: "bulbasaur" },
        types: [{ type: { name: "grass" } }],
        sprites: { front_default: null },
      }),
    ),
    http.get(speciesUrl + "/bulbasaur", () =>
      HttpResponse.json({
        id: 1,
        name: "bulbasaur",
        flavor_text_entries: [
          {
            flavor_text: "A strange seed was planted on its back.",
            language: { name: "en" },
          },
          {
            flavor_text: "Una extraña semilla fue plantada en su lomo.",
            language: { name: "es" },
          },
        ],
        genera: [
          { genus: "Seed Pokémon", language: { name: "en" } },
          { genus: "Pokémon Semilla", language: { name: "es" } },
        ],
        habitat: { name: "grassland" },
        capture_rate: 45,
      }),
    ),
  );
  localStorage.setItem("silph_locale", "es");
  const user = userEvent.setup();
  render(
    <LocaleProvider>
      <PokemonExplorer />
    </LocaleProvider>,
  );

  const trigger = await screen.findByRole("button", {
    name: "Read about bulbasaur",
  });
  await user.click(trigger);
  const dialog = await screen.findByRole("dialog", {
    name: "bulbasaur",
  });

  // Only Spanish genus is shown
  expect(await within(dialog).findByText("Pokémon Semilla")).toBeVisible();
  expect(within(dialog).queryByText("Seed Pokémon")).not.toBeInTheDocument();

  // Switch to Lore tab
  const loreTab = within(dialog).getByRole("tab", {
    name: /Historia de Campo/i,
  });
  await user.click(loreTab);

  // Only Spanish flavor text is shown, no alternative translation box
  expect(
    await within(dialog).findByText(
      /Una extraña semilla fue plantada en su lomo/,
    ),
  ).toBeVisible();
  expect(
    within(dialog).queryByText(/A strange seed was planted on its back/),
  ).not.toBeInTheDocument();
  expect(
    within(dialog).queryByText(/Traducción Alternativa/i),
  ).not.toBeInTheDocument();
  expect(within(dialog).getByText("ES-LA")).toBeVisible();
  expect(within(dialog).queryByText("EN-US")).not.toBeInTheDocument();

  localStorage.removeItem("silph_locale");
});
