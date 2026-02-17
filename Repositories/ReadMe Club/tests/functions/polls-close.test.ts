import { beforeEach, expect, it } from "vitest";
import { closePoll } from "../../netlify/functions/polls-close";
import { resetStore, store } from "../../netlify/functions/_lib/store";

beforeEach(() => {
  resetStore();
  store.polls.push({ id: "p1", title: "Next book", status: "open", bookIds: ["b1", "b2"] });
  store.votes.push(
    { pollId: "p1", memberId: "m1", bookId: "b1", rankPosition: 1 } as any,
    { pollId: "p1", memberId: "m2", bookId: "b2", rankPosition: 1 } as any
  );
});

it("calculates ranked points and does not change book status on poll close", async () => {
  const result = closePoll("p1");
  expect(result.ranking[0].points).toBeGreaterThan(0);
  expect(result.statusChanges).toEqual([]);
});
