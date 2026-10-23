import { StrictMode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import gsap from "gsap";
import { EducationGallery } from "./education-gallery.client";
import { MotionPreference } from "@/components/ui/motion-preference.client";

vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));
it("tracks unequal photo widths in the native scrolling fallback", () => {
  vi.stubGlobal("matchMedia", () => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  render(
    <EducationGallery locale="en" total={3}>
      <figure>Landscape</figure>
      <figure>Portrait</figure>
      <figure>Conference</figure>
    </EducationGallery>,
  );
  const viewport = screen.getByRole("region", {
    name: "Education gallery, horizontal scrolling",
  });
  const track = viewport.firstElementChild!;
  Object.defineProperty(viewport, "clientWidth", { value: 500 });
  Object.defineProperty(track, "scrollWidth", { value: 1220 });
  [0, 500, 720].forEach((offset, index) =>
    Object.defineProperty(track.children[index], "offsetLeft", {
      value: offset,
    }),
  );
  fireEvent.scroll(viewport, { target: { scrollLeft: 700 } });
  expect(screen.getByText("3 of 3")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Next photo" })).toBeDisabled();
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("restores native overflow after disabling, replacing and unmounting the pinned gallery under Strict Mode", async () => {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  vi.spyOn(gsap, "registerPlugin").mockImplementation(() => {});
  // Keep GSAP context/set real to verify style restoration; layout-driven
  // pinning/translation is checked separately in the production browser.
  vi.spyOn(gsap, "to").mockImplementation(
    () =>
      ({
        scrollTrigger: { start: 100, end: 300 },
      }) as unknown as gsap.core.Tween,
  );
  const user = userEvent.setup();
  const { unmount } = render(
    <StrictMode>
      <EducationGallery locale="en" total={3}>
        <figure>Photo one</figure>
        <figure>Photo two</figure>
        <figure>Photo three</figure>
      </EducationGallery>
      <MotionPreference locale="en" />
    </StrictMode>,
  );
  const viewport = screen.getByRole("region", {
    name: "Education gallery, horizontal scrolling",
  });
  expect(viewport.style.overflowX).toBe("hidden");
  await user.click(screen.getByRole("checkbox", { name: "Reduce motion" }));
  expect(viewport.style.overflowX).toBe("");
  expect(screen.getByText("Photo three")).toBeInTheDocument();
  await user.click(screen.getByRole("checkbox", { name: "Reduce motion" }));
  expect(viewport.style.overflowX).toBe("hidden");
  unmount();
  expect(viewport.style.overflowX).toBe("");
});
