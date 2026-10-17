import { expect, it, vi } from "vitest";
import { StrictMode } from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider, useToast, StandaloneToast } from "./toast.client";

it("keeps the original deadline when another toast appears and cleans up on unmount", () => {
  vi.useFakeTimers();
  try {
    const view = render(
      <StrictMode>
        <ToastProvider>
          <TestConsumer />
        </ToastProvider>
      </StrictMode>,
    );
    act(() => screen.getByRole("button", { name: "Trigger Toast" }).click());
    act(() => vi.advanceTimersByTime(3000));
    act(() => screen.getByRole("button", { name: "Trigger Toast" }).click());
    expect(screen.getAllByRole("status")).toHaveLength(2);
    act(() => vi.advanceTimersByTime(1500));
    expect(screen.getAllByRole("status")).toHaveLength(1);
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
  } finally {
    vi.useRealTimers();
  }
});

it("uses the latest standalone callback without extending its deadline", () => {
  vi.useFakeTimers();
  try {
    const oldClose = vi.fn();
    const newClose = vi.fn();
    const view = render(
      <StandaloneToast
        open
        onClose={oldClose}
        title="Notice"
        durationMs={2000}
      />,
    );
    act(() => vi.advanceTimersByTime(1500));
    view.rerender(
      <StandaloneToast
        open
        onClose={newClose}
        title="Notice"
        durationMs={2000}
      />,
    );
    act(() => vi.advanceTimersByTime(500));
    expect(oldClose).not.toHaveBeenCalled();
    expect(newClose).toHaveBeenCalledOnce();
    view.unmount();
  } finally {
    vi.useRealTimers();
  }
});

function TestConsumer() {
  const { showToast } = useToast();
  return (
    <button
      type="button"
      onClick={() =>
        showToast({
          title: "Specimen Saved",
          description: "Data synced to telemetry store.",
          variant: "success",
        })
      }
    >
      Trigger Toast
    </button>
  );
}

it("renders toast notifications with accessible role and dismisses on close button", async () => {
  const user = userEvent.setup();
  render(
    <ToastProvider>
      <TestConsumer />
    </ToastProvider>,
  );

  await user.click(screen.getByRole("button", { name: "Trigger Toast" }));

  const status = await screen.findByRole("status");
  expect(status).toHaveTextContent("Specimen Saved");
  expect(status).toHaveTextContent("Data synced to telemetry store.");

  const dismissBtn = screen.getByRole("button", {
    name: "Dismiss notification",
  });
  await user.click(dismissBtn);

  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

it("renders standalone toast directly when open", () => {
  const { rerender } = render(
    <StandaloneToast
      open={true}
      onClose={() => {}}
      title="Direct Notification"
      description="Field note updated"
    />,
  );

  expect(screen.getByRole("status")).toHaveTextContent("Direct Notification");

  rerender(
    <StandaloneToast
      open={false}
      onClose={() => {}}
      title="Direct Notification"
      description="Field note updated"
    />,
  );

  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});
