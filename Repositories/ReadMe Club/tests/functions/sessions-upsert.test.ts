import { beforeEach, expect, it } from "vitest";
import { upsertSession } from "../../netlify/functions/sessions-upsert";
import { resetStore } from "../../netlify/functions/_lib/store";

beforeEach(() => {
  resetStore();
});

it("creates a new session when id does not exist", async () => {
  const fakeClient = {
    readRows: async () => [],
    appendRow: async () => {},
    updateRows: async () => {}
  };

  const session = await upsertSession({
    bookId: "b1",
    sessionDateTime: "2026-02-20T13:00:00.000Z",
    pageStart: 1,
    pageEnd: 30
  }, fakeClient);

  expect(session.id).toMatch(/^s/);
  expect(session.pageEnd).toBe(30);
});
