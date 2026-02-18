import { expect, it } from "vitest";
import { recommendBooks } from "../../netlify/functions/_lib/recommendationEngine";

it("ranks candidate books by subject and author affinity from high ratings", () => {
  const result = recommendBooks(
    [{ id: "r1", title: "A", author: "Author X", status: "read", subjects: ["space"], proposedByMemberId: "m1", proposedAt: "2026-01-01" }],
    [
      { id: "c1", title: "B", author: "Author X", status: "want_to_read", subjects: ["space"], proposedByMemberId: "m1", proposedAt: "2026-01-01" },
      { id: "c2", title: "C", author: "Author Y", status: "want_to_read", subjects: ["history"], proposedByMemberId: "m1", proposedAt: "2026-01-01" }
    ]
  );

  expect(result[0].score).toBeGreaterThan(result[1].score);
});
