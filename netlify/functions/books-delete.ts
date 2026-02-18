import { createSheetsClient, type SheetsClient } from "./_lib/sheetsClient";
import { json, parseJsonBody } from "./_lib/http";

export interface DeleteBookPayload {
  id: string;
}

export async function deleteBook(payload: DeleteBookPayload, client: SheetsClient = createSheetsClient()) {
  const rows = await client.readRows("Books");
  const nextRows = rows.filter((row) => row.book_id !== payload.id);
  await client.updateRows("Books", nextRows);
  return payload;
}

export default async (event: { body?: unknown; text?: () => Promise<string>; json?: () => Promise<unknown> }) => {
  const body = await parseJsonBody<DeleteBookPayload>(event);
  const deleted = await deleteBook(body);
  return json(deleted);
};
