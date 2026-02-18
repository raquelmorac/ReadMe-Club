import { render, screen } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import { App } from "../../src/App";

afterEach(() => {
  vi.unstubAllGlobals();
});

it("loads members and books from function endpoints", async () => {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);

    if (url.endsWith("/.netlify/functions/members-list")) {
      return new Response(JSON.stringify([{ id: "m9", name: "Laura", active: true }]), { status: 200 });
    }

    if (url.endsWith("/.netlify/functions/books-list")) {
      return new Response(
        JSON.stringify([
          {
            id: "b9",
            title: "The Hobbit",
            author: "J.R.R. Tolkien",
            status: "current",
            proposedByMemberId: "m9",
            proposedAt: "2026-02-18"
          }
        ]),
        { status: 200 }
      );
    }

    if (url.includes("/.netlify/functions/sessions-list-by-book")) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    throw new Error(`Unexpected URL: ${url}`);
  });

  vi.stubGlobal("fetch", fetchMock);

  render(<App />);

  expect(await screen.findByText("The Hobbit")).toBeInTheDocument();
  expect(await screen.findByRole("option", { name: "Laura" })).toBeInTheDocument();
});
