import { z } from "zod";

export const pokemonNameSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/)
  .max(100);
const pokemonResourceUrlSchema = z
  .string()
  .regex(/^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/[1-9]\d*\/$/);
const artworkUrlSchema = z.url().refine((value) => {
  const url = new URL(value);
  return (
    url.protocol === "https:" &&
    url.hostname === "raw.githubusercontent.com" &&
    !url.username &&
    !url.password &&
    !url.port &&
    !url.search &&
    !url.hash &&
    /^\/PokeAPI\/sprites\/master\/sprites\/pokemon\/(?:other\/official-artwork\/)?[1-9]\d*\.png$/.test(
      url.pathname,
    )
  );
}, "Unexpected artwork destination");
export const pokemonListSchema = z.object({
  count: z.number().int().nonnegative(),
  results: z.array(
    z.object({ name: pokemonNameSchema, url: pokemonResourceUrlSchema }),
  ),
});
export const pokemonDetailSchema = z.object({
  id: z.number().int().positive(),
  name: pokemonNameSchema,
  species: z.object({ name: pokemonNameSchema }),
  height: z.number().nonnegative(),
  weight: z.number().nonnegative(),
  base_experience: z.number().nullable().optional(),
  types: z.array(z.object({ type: z.object({ name: pokemonNameSchema }) })),
  stats: z
    .array(
      z.object({
        base_stat: z.number(),
        stat: z.object({ name: z.string() }),
      }),
    )
    .optional(),
  abilities: z
    .array(
      z.object({
        is_hidden: z.boolean(),
        ability: z.object({ name: z.string() }),
      }),
    )
    .optional(),
  sprites: z.object({
    front_default: artworkUrlSchema.nullable().optional(),
    other: z
      .object({
        "official-artwork": z
          .object({
            front_default: artworkUrlSchema.nullable().optional(),
          })
          .optional(),
      })
      .optional(),
  }),
  cries: z
    .object({
      latest: z.string().nullable().optional(),
      legacy: z.string().nullable().optional(),
    })
    .optional(),
});
export type PokemonDetail = z.infer<typeof pokemonDetailSchema>;

export const pokemonSpeciesSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  flavor_text_entries: z.array(
    z.object({
      flavor_text: z.string(),
      language: z.object({ name: z.string() }),
      version: z.object({ name: z.string() }).optional(),
    }),
  ),
  genera: z.array(
    z.object({
      genus: z.string(),
      language: z.object({ name: z.string() }),
    }),
  ),
  habitat: z.object({ name: z.string() }).nullable().optional(),
  capture_rate: z.number().optional(),
  base_happiness: z.number().optional(),
  is_legendary: z.boolean().optional(),
  is_mythical: z.boolean().optional(),
});
export type PokemonSpecies = z.infer<typeof pokemonSpeciesSchema>;

export const pokemonObservationFormSchema = z.object({
  observerName: z
    .string()
    .trim()
    .min(2, "Observer callsign must be at least 2 characters.")
    .max(30, "Observer callsign cannot exceed 30 characters."),
  observationNotes: z
    .string()
    .trim()
    .min(5, "Observation note must contain at least 5 characters.")
    .max(250, "Observation note cannot exceed 250 characters."),
  priorityLevel: z.enum(["standard", "priority", "critical"]),
  isFavorite: z.boolean(),
});
export type PokemonObservationForm = z.infer<
  typeof pokemonObservationFormSchema
>;
