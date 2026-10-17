import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { expect, it, vi } from "vitest";
import { ToastProvider } from "@/components/ui/toast.client";
import { server } from "@/test/server";
import { PokedexDevice } from "./pokedex-device";

const detail = {
  id: 10001,
  name: "deoxys-attack",
  species: { name: "deoxys" },
  height: 17,
  weight: 608,
  types: [],
  sprites: { front_default: null },
};
function mount() {
  server.use(
    http.get("https://pokeapi.co/api/v2/pokemon/deoxys-attack", () =>
      HttpResponse.json(detail),
    ),
    http.get("https://pokeapi.co/api/v2/pokemon-species/deoxys", () =>
      HttpResponse.json({
        id: 386,
        name: "deoxys",
        flavor_text_entries: [],
        genera: [{ genus: "DNA Pokémon", language: { name: "en" } }],
      }),
    ),
  );
  return render(
    <StrictMode>
      <QueryClientProvider
        client={
          new QueryClient({ defaultOptions: { queries: { retry: false } } })
        }
      >
        <ToastProvider>
          <PokedexDevice name="deoxys-attack" />
        </ToastProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
it("uses the actual species reference and persists a favorite only once under Strict Mode", async () => {
  localStorage.setItem("pokemon:observation:v1:deoxys-attack", "null");
  const write = vi.spyOn(Storage.prototype, "setItem");
  try {
    mount();
    expect(await screen.findByText("DNA Pokémon")).toBeVisible();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Mark as Favorite" }));
    expect(write).toHaveBeenCalledTimes(1);
    expect(screen.getAllByRole("status")).toHaveLength(1);
    expect(screen.getByRole("status")).toHaveTextContent("Specimen Bookmarked");
  } finally {
    write.mockRestore();
  }
});
it("does not announce a saved favorite when storage rejects the write", async () => {
  mount();
  const button = await screen.findByRole("button", {
    name: "Mark as Favorite",
  });
  const write = vi
    .spyOn(Storage.prototype, "setItem")
    .mockImplementation(() => {
      throw new Error("quota");
    });
  try {
    await userEvent.setup().click(button);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not save favorite",
    );
    expect(
      screen.getByRole("button", { name: "Mark as Favorite" }),
    ).toBeVisible();
  } finally {
    write.mockRestore();
  }
});
it("supports Home, End, arrows and a single tab stop", async () => {
  mount();
  const tabs = await screen.findByRole("tablist");
  const user = userEvent.setup();
  within(tabs).getAllByRole("tab")[0]!.focus();
  await user.keyboard("{End}");
  expect(within(tabs).getAllByRole("tab")[2]).toHaveFocus();
  await user.keyboard("{ArrowRight}");
  expect(within(tabs).getAllByRole("tab")[0]).toHaveFocus();
  await user.keyboard("{ArrowLeft}{Home}");
  expect(within(tabs).getAllByRole("tab")[0]).toHaveFocus();
  expect(
    within(tabs)
      .getAllByRole("tab")
      .filter((tab) => tab.tabIndex === 0),
  ).toHaveLength(1);
  expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
});
