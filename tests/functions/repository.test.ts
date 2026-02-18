import { assertCanSetCurrent, computeRankedPoints, mapBookRow } from "../../netlify/functions/_lib/repository";

it("maps a sheet row to a typed book", () => {
  const book = mapBookRow({
    book_id: "b1",
    title: "Dune",
    status: "want_to_read"
  });

  expect(book.id).toBe("b1");
  expect(book.status).toBe("want_to_read");
});

it("rejects setting current when another current exists", () => {
  expect(() => assertCanSetCurrent("book-1", "book-2")).toThrow(
    "Cannot move this book to Current because another Current book already exists. Move the current book out first."
  );
});

it("calculates ranked vote points", () => {
  const ranking = computeRankedPoints([
    { memberId: "m1", bookId: "b1", rankPosition: 1 },
    { memberId: "m1", bookId: "b2", rankPosition: 2 },
    { memberId: "m2", bookId: "b1", rankPosition: 2 }
  ]);

  expect(ranking[0].bookId).toBe("b1");
  expect(ranking[0].points).toBe(5);
});
