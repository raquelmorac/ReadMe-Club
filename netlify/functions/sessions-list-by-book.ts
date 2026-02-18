import { createSheetsClient } from "./_lib/sheetsClient";
import { json } from "./_lib/http";

export default async (event: { queryStringParameters?: { bookId?: string } }) => {
  const bookId = event.queryStringParameters?.bookId ?? "";
  const client = createSheetsClient();
  const rows = await client.readRows("Sessions");
  const sessions = rows
    .filter((row) => row.book_id === bookId)
    .map((row) => ({
      id: row.session_id,
      bookId: row.book_id,
      sessionDateTime: row.session_datetime,
      pageStart: Number(row.page_start),
      pageEnd: Number(row.page_end)
    }));
  return json(sessions);
};
