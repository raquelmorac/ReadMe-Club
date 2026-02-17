import { expect, it } from "vitest";
import { parseCsv } from "../../netlify/functions/_lib/sheetsClient";

it("parses csv rows with headers", () => {
  const rows = parseCsv("member_id,name,active\nm1,Ana,true\n");
  expect(rows[0]).toEqual(["member_id", "name", "active"]);
  expect(rows[1]).toEqual(["m1", "Ana", "true"]);
});

it("parses quoted values with commas", () => {
  const rows = parseCsv("book_id,title,subjects\nb1,Dune,\"science fiction,space opera\"\n");
  expect(rows[1][2]).toBe("science fiction,space opera");
});
