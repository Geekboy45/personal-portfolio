import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { MotionPreference } from "./motion-preference.client";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("keeps the shared motion preference usable when browser storage rejects writes", async () => {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("Storage unavailable");
  });
  render(<MotionPreference locale="es" />);
  const control = screen.getByRole("checkbox", { name: "Reducir movimiento" });
  const user = userEvent.setup();
  await user.click(control);
  expect(control).toBeChecked();
  await user.click(control);
  expect(control).not.toBeChecked();
});
