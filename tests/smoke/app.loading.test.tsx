import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import { App } from "../../src/App";

afterEach(() => {
  vi.unstubAllGlobals();
});

it("shows a loader while live data is being fetched", async () => {
  let resolveMembers: ((value: Response) => void) | null = null;

  const fetchMock = vi.fn((input: RequestInfo | URL) => {
    const url = String(input);

    if (url.endsWith("/members-list")) {
      return new Promise<Response>((resolve) => {
        resolveMembers = resolve;
      });
    }

    if (url.endsWith("/books-list")) {
      return Promise.resolve(new Response(JSON.stringify([]), { status: 200 }));
    }

    if (url.includes("/sessions-list-by-book")) {
      return Promise.resolve(new Response(JSON.stringify([]), { status: 200 }));
    }

    return Promise.resolve(new Response(JSON.stringify([]), { status: 200 }));
  });

  vi.stubGlobal("fetch", fetchMock);

  render(<App />);

  expect(screen.getByText("Loading club data...")).toBeInTheDocument();
  expect(screen.getByRole("status", { name: "Loading club data" })).toBeInTheDocument();

  resolveMembers?.(new Response(JSON.stringify([{ id: "m1", name: "Ana", active: true }]), { status: 200 }));

  await waitForElementToBeRemoved(() => screen.queryByText("Loading club data..."));
});
