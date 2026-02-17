import { beforeEach, expect, it } from "vitest";
import { setCurrentBook } from "../../netlify/functions/books-set-current";
import { resetStore, store } from "../../netlify/functions/_lib/store";

beforeEach(() => {
  resetStore();
  store.books.push(
    { id: "book-1", title: "Current", author: "A", status: "current", proposedByMemberId: "m1", proposedAt: "2026-01-01" },
    { id: "book-2", title: "New", author: "B", status: "want_to_read", proposedByMemberId: "m1", proposedAt: "2026-01-01" }
  );
});

it("rejects setting current when another current exists", async () => {
  expect(() => setCurrentBook("book-2")).toThrow(
    "Cannot move this book to Current because another Current book already exists. Move the current book out first."
  );
});
