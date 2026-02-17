import { beforeEach, expect, it } from "vitest";
import { closePoll } from "../../netlify/functions/polls-close";
import { resetStore } from "../../netlify/functions/_lib/store";

beforeEach(() => {
  resetStore();
});

it("calculates ranked points and does not change book status on poll close", async () => {
  const fakeClient = {
    readRows: async (tab: string) => {
      if (tab === "Polls") {
        return [{ poll_id: "p1", title: "Next book", status: "open", created_at: "2026-01-01", closed_at: "" }];
      }
      if (tab === "Votes") {
        return [
          { poll_id: "p1", member_id: "m1", book_id: "b1", rank_position: "1" },
          { poll_id: "p1", member_id: "m2", book_id: "b2", rank_position: "1" }
        ];
      }
      return [];
    },
    appendRow: async () => {},
    updateRows: async () => {}
  };

  const result = await closePoll("p1", fakeClient);
  expect(result.ranking[0].points).toBeGreaterThan(0);
  expect(result.statusChanges).toEqual([]);
});
