import { z } from "zod";
import { requestJson } from "@/lib/http/http-client";
import type { ApiSuccess } from "@/lib/http/api-envelope";
import { HttpError } from "@/lib/http/http-error";
import {
  pokemonDetailSchema,
  pokemonListSchema,
  pokemonNameSchema,
  pokemonSpeciesSchema,
  type PokemonSpecies,
} from "./pokemon.schema";

export const PAGE_SIZE = 12;
const API_ORIGIN = "https://pokeapi.co/api/v2";

// Third-party contract adaptation stays here; the transport knows nothing about Pokemon.
export async function getPokemonPage(
  page: number,
  signal?: AbortSignal,
): Promise<ApiSuccess<{ name: string; number: number }[]>> {
  z.number().int().min(1).max(10_000).parse(page);
  const response = await requestJson(
    `${API_ORIGIN}/pokemon?limit=${PAGE_SIZE}&offset=${(page - 1) * PAGE_SIZE}`,
    pokemonListSchema,
    { signal, cache: "default" },
  );
  return {
    success: true,
    value: response.results.map(({ name, url }) => ({
      name,
      number: Number(url.split("/").at(-2)),
    })),
    meta: {
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        totalItems: response.count,
        totalPages: Math.ceil(response.count / PAGE_SIZE),
      },
    },
  };
}
export async function getPokemon(name: string, signal?: AbortSignal) {
  const safeName = pokemonNameSchema.parse(name);
  const value = await requestJson(
    `${API_ORIGIN}/pokemon/${safeName}`,
    pokemonDetailSchema,
    { signal, cache: "default" },
  );
  return { success: true as const, value };
}

export async function getPokemonSpecies(
  nameOrId: string | number,
  signal?: AbortSignal,
) {
  const safeTarget = pokemonNameSchema.parse(String(nameOrId).toLowerCase());
  const value = await requestJson(
    `${API_ORIGIN}/pokemon-species/${safeTarget}`,
    pokemonSpeciesSchema,
    { signal, cache: "default" },
  );
  return { success: true as const, value };
}

export function extractSpeciesLore(species: PokemonSpecies) {
  const clean = (t?: string) => (t ? t.replace(/[\f\n\r]/g, " ") : "");
  const flavorEn = clean(
    species.flavor_text_entries.find((e) => e.language.name === "en")
      ?.flavor_text,
  );
  const flavorEs = clean(
    species.flavor_text_entries.find((e) => e.language.name === "es")
      ?.flavor_text,
  );
  const genusEn =
    species.genera.find((g) => g.language.name === "en")?.genus ?? "Unknown";
  const genusEs =
    species.genera.find((g) => g.language.name === "es")?.genus ??
    "Desconocido";

  return {
    flavorEn: flavorEn || "No English field log cataloged.",
    flavorEs: flavorEs || "No hay registro de campo en español catalogado.",
    genusEn,
    genusEs,
    habitat: species.habitat?.name
      ? species.habitat.name.replace("-", " ")
      : "undetermined",
    captureRate: species.capture_rate ?? 0,
    isLegendary: Boolean(species.is_legendary || species.is_mythical),
  };
}

export async function getAllPokemon(
  signal?: AbortSignal,
): Promise<ApiSuccess<{ name: string; number: number }[]>> {
  const response = await requestJson(
    `${API_ORIGIN}/pokemon?limit=2000`,
    pokemonListSchema,
    { signal, cache: "default" },
  );
  // Bounded public lookup exception; never silently claim a truncated catalog is complete.
  if (response.count > 2000 || response.results.length !== response.count) {
    throw new HttpError({ kind: "invalid-response" });
  }
  return {
    success: true,
    value: response.results.map((pokemon) => ({
      name: pokemon.name,
      number: Number(pokemon.url.split("/").at(-2)),
    })),
    meta: {
      pagination: {
        page: 1,
        pageSize: response.count,
        totalItems: response.count,
        totalPages: 1,
      },
    },
  };
}

export function parsePage(value: string | null): number {
  if (value === null) return 1;
  const parsed = z
    .string()
    .regex(/^[1-9]\d{0,3}$/)
    .transform(Number)
    .safeParse(value);
  return parsed.success ? parsed.data : 1;
}
