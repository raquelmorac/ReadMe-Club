import { beforeEach, expect, it } from "vitest";
import { saveRating } from "../../netlify/functions/ratings-upsert";
import { resetStore } from "../../netlify/functions/_lib/store";

beforeEach(() => {
  resetStore();
});

it("rejects rating when book is not read", async () => {
  const fakeClient = {
    readRows: async (tab: string) => {
      if (tab === "Books") {
        return [{ book_id: "b1", status: "want_to_read" }];
      }
      return [];
    },
    appendRow: async () => {},
    updateRows: async () => {}
  };

  await expect(saveRating({ bookId: "b1", memberId: "m1", score: 4 }, fakeClient)).rejects.toThrow(
    "Ratings are allowed only for Read books."
  );
});
