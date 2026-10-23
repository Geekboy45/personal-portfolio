import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import ErrorPage from "./(english)/error";

it("offers recovery without inventing a diagnostic reference or successful logging", async () => {
  const reset = vi.fn();
  const view = render(
    <ErrorPage error={new Error("private internals")} reset={reset} />,
  );
  expect(
    screen.queryByText("Support Diagnostic Digest:"),
  ).not.toBeInTheDocument();
  expect(view.container).not.toHaveTextContent(
    /STATUS 500|logged this occurrence|ERR_LAB_CLIENT_FAULT|private internals/,
  );
  await userEvent.setup().click(screen.getByRole("button", { name: /Retry/ }));
  expect(reset).toHaveBeenCalledOnce();
  view.rerender(
    <ErrorPage
      error={Object.assign(new Error("private"), { digest: "real-digest" })}
      reset={reset}
    />,
  );
  expect(screen.getByRole("alert")).toHaveTextContent("real-digest");
});
