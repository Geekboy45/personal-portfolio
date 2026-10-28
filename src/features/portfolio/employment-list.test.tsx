import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { useReducedMotion } from "@/lib/reduced-motion.client";
import { EmploymentList } from "./employment-list.client";

vi.mock("@/lib/reduced-motion.client", () => ({ useReducedMotion: vi.fn() }));

it("disables decorative motion on preference changes without hiding employment", () => {
  vi.mocked(useReducedMotion).mockReturnValue(false);
  const { rerender } = render(
    <EmploymentList>
      <li>Tech Lead</li>
    </EmploymentList>,
  );
  expect(screen.getByRole("list")).toHaveAttribute("data-motion", "true");
  vi.mocked(useReducedMotion).mockReturnValue(true);
  rerender(
    <EmploymentList>
      <li>Tech Lead</li>
    </EmploymentList>,
  );
  expect(screen.getByRole("list")).toHaveAttribute("data-motion", "false");
  expect(screen.getByText("Tech Lead")).toBeVisible();
});
