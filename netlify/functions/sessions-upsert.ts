import { createSheetsClient, type SheetsClient } from "./_lib/sheetsClient";

export interface UpsertSessionPayload {
  id?: string;
  bookId: string;
  sessionDateTime: string;
  pageStart: number;
  pageEnd: number;
}

export async function upsertSession(payload: UpsertSessionPayload, client: SheetsClient = createSheetsClient()) {
  const rows = await client.readRows("Sessions");
  const existingIndex = rows.findIndex((row) => row.session_id === payload.id);

  if (existingIndex >= 0) {
    const updatedRows = rows.map((row, index) => {
      if (index !== existingIndex) {
        return row;
      }
      return {
        ...row,
        book_id: payload.bookId,
        session_datetime: payload.sessionDateTime,
        page_start: String(payload.pageStart),
        page_end: String(payload.pageEnd)
      };
    });
    await client.updateRows("Sessions", updatedRows);
    return {
      id: rows[existingIndex].session_id,
      bookId: payload.bookId,
      sessionDateTime: payload.sessionDateTime,
      pageStart: payload.pageStart,
      pageEnd: payload.pageEnd
    };
  }

  const newSessionId = payload.id ?? `s${Date.now()}`;
  const createdAt = new Date().toISOString();
  await client.appendRow("Sessions", {
    session_id: newSessionId,
    book_id: payload.bookId,
    session_datetime: payload.sessionDateTime,
    page_start: String(payload.pageStart),
    page_end: String(payload.pageEnd),
    notes: "",
    created_at: createdAt
  });

  return {
    id: newSessionId,
    bookId: payload.bookId,
    sessionDateTime: payload.sessionDateTime,
    pageStart: payload.pageStart,
    pageEnd: payload.pageEnd
  };
}

export default async (event: { body?: string }) => {
  const body = JSON.parse(event.body ?? "{}");
  const session = await upsertSession(body as UpsertSessionPayload);
  return { statusCode: 200, body: JSON.stringify(session) };
};
