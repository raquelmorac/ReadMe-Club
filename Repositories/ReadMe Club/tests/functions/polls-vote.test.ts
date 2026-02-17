import { beforeEach, expect, it } from "vitest";
import { submitBallot } from "../../netlify/functions/polls-vote";
import { resetStore } from "../../netlify/functions/_lib/store";

beforeEach(() => {
  resetStore();
});

it("rejects duplicate ranking positions in a ballot", () => {
  expect(() => submitBallot("p1", "m1", ["b1", "b1", "b2"]))
    .toThrow("Duplicate ranks are not allowed in one ballot.");
});
