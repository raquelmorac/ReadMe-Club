import { render, screen } from "@testing-library/react";
import { afterEach, it, vi } from "vitest";
import { App } from "../../src/App";

afterEach(() => {
  vi.unstubAllGlobals();
});

it("renders Reader Club title", async () => {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.endsWith("/members-list")) {
      return new Response(JSON.stringify([{ id: "m1", name: "Ana", active: true }]), { status: 200 });
    }
    if (url.endsWith("/books-list")) {
      return new Response(JSON.stringify([]), { status: 200 });
    }
    if (url.includes("/sessions-list-by-book")) {
      return new Response(JSON.stringify([]), { status: 200 });
    }
    return new Response(JSON.stringify([]), { status: 200 });
  });
  vi.stubGlobal("fetch", fetchMock);

  render(<App />);
  expect(await screen.findByText("Reader Club")).toBeInTheDocument();
});
