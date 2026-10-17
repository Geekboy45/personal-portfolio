import { z } from "zod";
import {
  pokemonNameSchema,
  type PokemonObservationForm,
} from "./pokemon.schema";

const draftSchema = z.object({
  observerName: z.string().max(30),
  observationNotes: z.string().max(250),
  priorityLevel: z.enum(["standard", "priority", "critical"]),
  isFavorite: z.boolean(),
});
const storedSchema = z.object({
  version: z.literal(1),
  expiresAt: z.number().finite(),
  value: draftSchema,
});
const retentionMs = 7 * 24 * 60 * 60_000;
const key = (name: string) =>
  `pokemon:observation:v1:${pokemonNameSchema.parse(name)}`;
export const emptyObservation: PokemonObservationForm = {
  observerName: "",
  observationNotes: "",
  priorityLevel: "standard",
  isFavorite: false,
};

// Read-only initialization: corrupt, legacy, expired, or unavailable storage becomes an empty draft.
export function readObservation(name: string): PokemonObservationForm {
  try {
    const raw = localStorage.getItem(key(name));
    const parsed = storedSchema.safeParse(raw ? JSON.parse(raw) : null);
    return parsed.success && parsed.data.expiresAt > Date.now()
      ? parsed.data.value
      : { ...emptyObservation };
  } catch {
    return { ...emptyObservation };
  }
}

export function writeObservation(name: string, value: PokemonObservationForm) {
  localStorage.setItem(
    key(name),
    JSON.stringify({
      version: 1,
      expiresAt: Date.now() + retentionMs,
      value: draftSchema.parse(value),
    }),
  );
}

export function removeObservation(name: string) {
  localStorage.removeItem(key(name));
  localStorage.removeItem(`silph_specimen_${pokemonNameSchema.parse(name)}`);
}
