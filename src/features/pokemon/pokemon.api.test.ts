import { it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import {
  getPokemonPage,
  getPokemon,
  getAllPokemon,
  getPokemonSpecies,
  parsePage,
} from "./pokemon.api";

it("rejects truncated catalogs and untrusted resource references", async () => {
  const endpoint = "https://pokeapi.co/api/v2/pokemon";
  server.use(
    http.get(endpoint, () => HttpResponse.json({ count: 2001, results: [] })),
  );
  await expect(getAllPokemon()).rejects.toMatchObject({
    failure: { kind: "invalid-response" },
  });
  server.use(
    http.get(endpoint, () =>
      HttpResponse.json({
        count: 1,
        results: [{ name: "bulbasaur", url: "https://example.test/1/" }],
      }),
    ),
  );
  await expect(getPokemonPage(1)).rejects.toMatchObject({
    failure: { kind: "invalid-response" },
  });
  await expect(getPokemonSpecies("../private")).rejects.toThrow();
});

it("adapts PokeAPI pagination into the template success envelope", async () => {
  server.use(
    http.get("https://pokeapi.co/api/v2/pokemon", ({ request }) => {
      expect(new URL(request.url).searchParams.get("offset")).toBe("12");
      return HttpResponse.json({
        count: 25,
        results: [
          {
            name: "bulbasaur",
            url: "https://pokeapi.co/api/v2/pokemon/10001/",
          },
        ],
      });
    }),
  );
  expect(await getPokemonPage(2)).toEqual({
    success: true,
    value: [{ name: "bulbasaur", number: 10001 }],
    meta: {
      pagination: { page: 2, pageSize: 12, totalItems: 25, totalPages: 3 },
    },
  });
});
it("keeps empty collections and rejects hostile resource names before fetching", async () => {
  server.use(
    http.get("https://pokeapi.co/api/v2/pokemon", () =>
      HttpResponse.json({ count: 0, results: [] }),
    ),
  );
  expect((await getPokemonPage(1)).value).toEqual([]);
  await expect(getPokemon("../private")).rejects.toThrow();
});
it("normalizes malformed page parameters without accepting partial numbers", () => {
  expect([null, "0", "-1", "2abc", "1e3", "999999"].map(parsePage)).toEqual([
    1, 1, 1, 1, 1, 1,
  ]);
  expect(parsePage("2")).toBe(2);
});
