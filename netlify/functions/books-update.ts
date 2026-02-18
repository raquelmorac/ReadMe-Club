import { createSheetsClient, type SheetsClient } from "./_lib/sheetsClient";
import { json, parseJsonBody } from "./_lib/http";

export interface UpdateBookPayload {
  id: string;
  title: string;
  author: string;
}

export async function updateBook(payload: UpdateBookPayload, client: SheetsClient = createSheetsClient()) {
  const rows = await client.readRows("Books");
  const nextRows = rows.map((row) => {
    if (row.book_id !== payload.id) {
      return row;
    }
    return {
      ...row,
      title: payload.title,
      author: payload.author
    };
  });
  await client.updateRows("Books", nextRows);
  return payload;
}

export default async (event: { body?: unknown; text?: () => Promise<string>; json?: () => Promise<unknown> }) => {
  const body = await parseJsonBody<UpdateBookPayload>(event);
  const updated = await updateBook(body);
  return json(updated);
};
