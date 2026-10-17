import { expect, it, vi } from "vitest";
import {
  emptyObservation,
  readObservation,
  removeObservation,
  writeObservation,
} from "./pokemon-observation.storage";

it.each([
  "null",
  "{}",
  "broken json",
  '{"version":1,"expiresAt":9999999999999,"value":{"isFavorite":"yes"}}',
])("recovers safely from stored input %s", (raw) => {
  localStorage.setItem("pokemon:observation:v1:bulbasaur", raw);
  expect(readObservation("bulbasaur")).toEqual(emptyObservation);
});
it("roundtrips an incomplete draft, expires it, and supports explicit deletion including legacy records", () => {
  const clock = vi.spyOn(Date, "now").mockReturnValue(1000);
  try {
    writeObservation("bulbasaur", { ...emptyObservation, isFavorite: true });
    expect(readObservation("bulbasaur").isFavorite).toBe(true);
    clock.mockReturnValue(1000 + 8 * 24 * 60 * 60_000);
    expect(readObservation("bulbasaur")).toEqual(emptyObservation);
    localStorage.setItem("silph_specimen_bulbasaur", "legacy");
    removeObservation("bulbasaur");
    expect(localStorage.length).toBe(0);
  } finally {
    clock.mockRestore();
  }
});
it("returns defaults on denied reads but propagates failed writes so the UI cannot announce success", () => {
  const read = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("denied");
  });
  expect(readObservation("bulbasaur")).toEqual(emptyObservation);
  read.mockRestore();
  const write = vi
    .spyOn(Storage.prototype, "setItem")
    .mockImplementation(() => {
      throw new Error("full");
    });
  try {
    expect(() => writeObservation("bulbasaur", emptyObservation)).toThrow(
      "full",
    );
  } finally {
    write.mockRestore();
  }
});
