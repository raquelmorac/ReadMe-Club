import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, it, vi } from "vitest";
import { App } from "../../src/App";

afterEach(() => {
  vi.unstubAllGlobals();
});

it("shows add book form and posts to books-create", async () => {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);

    if (url.endsWith("/members-list")) {
      return new Response(JSON.stringify([{ id: "m1", name: "Ana", active: true }]), { status: 200 });
    }

    if (url.endsWith("/books-list")) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    if (url.endsWith("/books-create") && init?.method === "POST") {
      return new Response(JSON.stringify({ id: "b9", title: "Dune", author: "Frank Herbert", status: "want_to_read", proposedByMemberId: "m1", proposedAt: "2026-02-18" }), { status: 201 });
    }

    if (url.includes("/sessions-list-by-book")) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    throw new Error(`Unexpected URL: ${url}`);
  });

  vi.stubGlobal("fetch", fetchMock);

  render(<App />);
  fireEvent.click(await screen.findByRole("button", { name: "Want to Read" }));

  expect(await screen.findByText("Add book")).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Dune" } });
  fireEvent.change(screen.getByLabelText("Author"), { target: { value: "Frank Herbert" } });
  fireEvent.click(screen.getByRole("button", { name: "Add" }));

  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringContaining("/books-create"),
    expect.objectContaining({ method: "POST" })
  );
});
