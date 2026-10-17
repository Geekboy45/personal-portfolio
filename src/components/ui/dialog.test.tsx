import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { Dialog } from "./dialog.client";

it.each(["Loading…", "Request failed"])(
  "retains visible dismissal and restores focus while showing %s",
  async (message) => {
    function Example() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog
          open={open}
          onOpenChange={setOpen}
          size="wide"
          title="Resource"
          description="Details"
          trigger={<button>Inspect</button>}
        >
          <p>{message}</p>
        </Dialog>
      );
    }
    render(<Example />);
    const user = userEvent.setup();
    const trigger = screen.getByRole("button", { name: "Inspect" });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Resource" });
    expect(within(dialog).getByText(message)).toBeVisible();
    await user.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  },
);

it("renders bare variant without default visible close button or card styling", async () => {
  function BareExample() {
    const [open, setOpen] = useState(false);
    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
        variant="bare"
        title="Custom Device"
        description="Immersive device"
        trigger={<button>Open Device</button>}
      >
        <div>
          <p>Inner device</p>
          <button onClick={() => setOpen(false)}>Device Close</button>
        </div>
      </Dialog>
    );
  }
  render(<BareExample />);
  const user = userEvent.setup();
  const trigger = screen.getByRole("button", { name: "Open Device" });
  await user.click(trigger);
  const dialog = screen.getByRole("dialog", { name: "Custom Device" });
  expect(within(dialog).getByText("Inner device")).toBeVisible();
  expect(
    within(dialog).queryByRole("button", { name: /^Close$/ }),
  ).not.toBeInTheDocument();
  expect(within(dialog).getByText("Custom Device")).toHaveClass("sr-only");
  await user.click(
    within(dialog).getByRole("button", { name: "Device Close" }),
  );
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
