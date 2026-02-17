import { beforeEach, expect, it } from "vitest";
import { setCurrentBook } from "../../netlify/functions/books-set-current";
import { resetStore } from "../../netlify/functions/_lib/store";

beforeEach(() => {
  resetStore();
});

it("rejects setting current when another current exists", async () => {
  const fakeClient = {
    readRows: async () => ([
      { book_id: "book-1", title: "Current", author: "A", status: "current", proposed_by_member_id: "m1", proposed_at: "2026-01-01" },
      { book_id: "book-2", title: "New", author: "B", status: "want_to_read", proposed_by_member_id: "m1", proposed_at: "2026-01-01" }
    ]),
    appendRow: async () => {},
    updateRows: async () => {}
  };

  await expect(setCurrentBook("book-2", fakeClient)).rejects.toThrow(
    "Cannot move this book to Current because another Current book already exists. Move the current book out first."
  );
});
