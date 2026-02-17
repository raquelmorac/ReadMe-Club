import { beforeEach, expect, it } from "vitest";
import { saveRating } from "../../netlify/functions/ratings-upsert";
import { resetStore, store } from "../../netlify/functions/_lib/store";

beforeEach(() => {
  resetStore();
  store.books.push({ id: "b1", title: "Dune", author: "Frank Herbert", status: "want_to_read", proposedByMemberId: "m1", proposedAt: "2026-01-01" });
});

it("rejects rating when book is not read", async () => {
  expect(() => saveRating({ bookId: "b1", memberId: "m1", score: 4 })).toThrow("Ratings are allowed only for Read books.");
});
