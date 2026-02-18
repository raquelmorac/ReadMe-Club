import { expect, it, vi } from "vitest";
import { deleteBook } from "../../netlify/functions/books-delete";

it("removes a book row by id", async () => {
  const updateRows = vi.fn(async () => {});

  const fakeClient = {
    readRows: async () => [
      { book_id: "b1", title: "Old", author: "A", status: "want_to_read" },
      { book_id: "b2", title: "Other", author: "B", status: "read" }
    ],
    appendRow: async () => {},
    updateRows
  };

  await deleteBook({ id: "b1" }, fakeClient);

  expect(updateRows).toHaveBeenCalledWith(
    "Books",
    [expect.objectContaining({ book_id: "b2" })]
  );
});
