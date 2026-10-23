import { expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SiteHeader } from "./site-header.client";

it("closes the section disclosure on Escape with focus restoration and after navigation", async () => {
  const user = userEvent.setup();
  render(<SiteHeader />);
  const summary = screen.getByText("Menu");
  const disclosure = summary.closest("details")!;

  await user.click(summary);
  expect(disclosure).toHaveAttribute("open");
  await user.keyboard("{Escape}");
  expect(disclosure).not.toHaveAttribute("open");
  expect(summary).toHaveFocus();

  await user.click(summary);
  const projectLink = within(disclosure).getByRole("link", {
    name: "Selected Work",
  });
  expect(projectLink).toHaveAttribute("href", "/#projects");
  await user.click(projectLink);
  expect(disclosure).not.toHaveAttribute("open");
});
