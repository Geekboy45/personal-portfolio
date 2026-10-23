import { StrictMode } from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import gsap from "gsap";
import { CareerStoryMotion } from "./career-story.client";
import { MotionPreference } from "@/components/ui/motion-preference.client";

vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function setupMotion(initialReduced = false) {
  let reduced = initialReduced;
  const listeners = new Set<() => void>();
  vi.stubGlobal("matchMedia", () => ({
    get matches() {
      return reduced;
    },
    addEventListener: (_event: string, notify: () => void) =>
      listeners.add(notify),
    removeEventListener: (_event: string, notify: () => void) =>
      listeners.delete(notify),
  }));
  const mediaInstances: { revert: ReturnType<typeof vi.fn> }[] = [];
  vi.spyOn(gsap, "registerPlugin").mockImplementation(() => {});
  vi.spyOn(gsap, "timeline").mockImplementation(() => {
    const timeline = { fromTo: vi.fn() };
    timeline.fromTo.mockReturnValue(timeline);
    return timeline as unknown as gsap.core.Timeline;
  });
  vi.spyOn(gsap, "matchMedia").mockImplementation(() => {
    const media = {
      add: vi.fn((_query: string, setup: () => void) => {
        setup();
        return media;
      }),
      revert: vi.fn(),
    };
    mediaInstances.push(media);
    return media as unknown as ReturnType<typeof gsap.matchMedia>;
  });
  return {
    mediaInstances,
    listeners,
    setReduced(value: boolean) {
      act(() => {
        reduced = value;
        listeners.forEach((notify) => notify());
      });
    },
  };
}

it("releases every scoped sequence through Strict Mode, disable/re-enable and unmount", async () => {
  const user = userEvent.setup();
  const { mediaInstances, listeners } = setupMotion();
  const { unmount } = render(
    <StrictMode>
      <CareerStoryMotion locale="en">
        <p>Readable story</p>
      </CareerStoryMotion>
      <MotionPreference locale="en" />
    </StrictMode>,
  );
  expect(mediaInstances.length).toBeGreaterThanOrEqual(2);
  await user.click(screen.getByRole("checkbox", { name: "Reduce motion" }));
  expect(screen.getByText("Readable story")).toBeVisible();
  expect(
    mediaInstances.every((media) => media.revert.mock.calls.length === 1),
  ).toBe(true);
  await user.click(screen.getByRole("checkbox", { name: "Reduce motion" }));
  unmount();
  expect(
    mediaInstances.every((media) => media.revert.mock.calls.length === 1),
  ).toBe(true);
  expect(listeners.size).toBe(0);
});

it("starts static for reduced motion and releases motion on a live preference change", () => {
  const { mediaInstances, setReduced } = setupMotion(true);
  const { unmount } = render(
    <CareerStoryMotion locale="es">
      <p>Historia legible</p>
    </CareerStoryMotion>,
  );
  expect(mediaInstances).toHaveLength(0);
  expect(screen.getByText("Historia legible")).toBeVisible();
  setReduced(false);
  expect(mediaInstances).toHaveLength(1);
  setReduced(true);
  expect(mediaInstances[0]!.revert).toHaveBeenCalledOnce();
  expect(screen.getByText("Historia legible")).toBeVisible();
  unmount();
});
