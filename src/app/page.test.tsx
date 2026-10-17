import { expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "./page";

it("renders home page with static public image asset and navigation link", () => {
  render(<HomePage />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    /Biological Telemetry/i,
  );

  const heroImage = screen.getByRole("img", {
    name: /Silph canonical specimen asset/i,
  });
  expect(heroImage).toBeInTheDocument();
  expect(heroImage).toHaveAttribute(
    "src",
    expect.stringContaining("hero-specimen.png"),
  );

  const registryLink = screen.getByRole("link", { name: /Access Registry/i });
  expect(registryLink).toHaveAttribute("href", "/explore");
});
