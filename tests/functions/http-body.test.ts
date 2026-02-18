import { expect, it } from "vitest";
import { parseJsonBody } from "../../netlify/functions/_lib/http";

it("parses JSON from classic event body string", async () => {
  const body = await parseJsonBody<{ title: string }>({ body: "{\"title\":\"Dune\"}" });
  expect(body.title).toBe("Dune");
});

it("parses JSON from Request-like text()", async () => {
  const body = await parseJsonBody<{ title: string }>({
    text: async () => "{\"title\":\"Dune\"}"
  });
  expect(body.title).toBe("Dune");
});

it("parses JSON from Request-like json()", async () => {
  const body = await parseJsonBody<{ title: string }>({
    json: async () => ({ title: "Dune" })
  });
  expect(body.title).toBe("Dune");
});
