import { expect, it, vi } from "vitest";
import { updateBook } from "../../netlify/functions/books-update";

it("updates title and author for a book row", async () => {
  const updateRows = vi.fn(async () => {});

  const fakeClient = {
    readRows: async () => [
      { book_id: "b1", title: "Old", author: "A", status: "want_to_read" },
      { book_id: "b2", title: "Other", author: "B", status: "read" }
    ],
    appendRow: async () => {},
    updateRows
  };

  await updateBook({ id: "b1", title: "New", author: "New Author" }, fakeClient);

  expect(updateRows).toHaveBeenCalledWith(
    "Books",
    expect.arrayContaining([
      expect.objectContaining({ book_id: "b1", title: "New", author: "New Author" })
    ])
  );
});
