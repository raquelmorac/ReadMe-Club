import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, it, vi } from "vitest";
import { App } from "../../src/App";

afterEach(() => {
  vi.unstubAllGlobals();
});

it("opens want-to-read page and supports edit/delete", async () => {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);

    if (url.endsWith("/members-list")) {
      return new Response(JSON.stringify([{ id: "m1", name: "Ana", active: true }]), { status: 200 });
    }

    if (url.endsWith("/books-list")) {
      return new Response(
        JSON.stringify([
          {
            id: "b1",
            title: "Dune",
            author: "Frank Herbert",
            status: "want_to_read",
            proposedByMemberId: "m1",
            proposedAt: "2026-02-18"
          }
        ]),
        { status: 200 }
      );
    }

    if (url.includes("/sessions-list-by-book")) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    if (url.endsWith("/books-update") && init?.method === "POST") {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    if (url.endsWith("/books-delete") && init?.method === "POST") {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    if (url.endsWith("/books-create") && init?.method === "POST") {
      return new Response(JSON.stringify({ ok: true }), { status: 201 });
    }

    throw new Error(`Unexpected URL: ${url}`);
  });

  vi.stubGlobal("fetch", fetchMock);

  render(<App />);
  fireEvent.click(await screen.findByRole("button", { name: "Want to Read" }));

  expect(await screen.findByText("Manage Want to Read")).toBeInTheDocument();
  expect(screen.getByText("Dune")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Edit Dune" }));
  fireEvent.change(screen.getByLabelText("Edit title"), { target: { value: "Dune (Updated)" } });
  fireEvent.click(screen.getByRole("button", { name: "Save" }));

  await waitFor(() =>
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/books-update"),
      expect.objectContaining({ method: "POST" })
    )
  );
  await screen.findByRole("button", { name: "Edit Dune" });

  fireEvent.click(screen.getByRole("button", { name: "Edit Dune" }));
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  fireEvent.click(screen.getByRole("button", { name: "Delete Dune" }));

  await waitFor(() =>
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/books-delete"),
      expect.objectContaining({ method: "POST" })
    )
  );
});
