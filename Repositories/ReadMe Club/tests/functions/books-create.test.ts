import { beforeEach, it, expect } from "vitest";
import { createBook } from "../../netlify/functions/books-create";
import { resetStore } from "../../netlify/functions/_lib/store";

beforeEach(() => {
  resetStore();
});

it("stores proposer when creating want_to_read book", async () => {
  const fakeClient = {
    readRows: async () => [],
    appendRow: async () => {},
    updateRows: async () => {}
  };
  const result = await createBook({ title: "Dune", author: "Frank Herbert", proposedByMemberId: "m1" }, fakeClient);
  expect(result.status).toBe("want_to_read");
  expect(result.proposedByMemberId).toBe("m1");
});
