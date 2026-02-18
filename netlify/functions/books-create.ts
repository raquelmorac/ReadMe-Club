import { enrichBook } from "./_lib/openLibrary";
import { createSheetsClient, type SheetsClient } from "./_lib/sheetsClient";

export interface CreateBookPayload {
  title: string;
  author: string;
  proposedByMemberId: string;
}

export async function createBook(payload: CreateBookPayload, client: SheetsClient = createSheetsClient()) {
  const nowIso = new Date().toISOString();
  const today = nowIso.slice(0, 10);
  const enriched = await enrichBook(payload.title, payload.author);
  const book = {
    id: `b${Date.now()}`,
    title: enriched.title,
    author: enriched.author,
    totalPages: enriched.totalPages,
    subjects: enriched.subjects,
    status: "want_to_read" as const,
    proposedByMemberId: payload.proposedByMemberId,
    proposedAt: today
  };

  await client.appendRow("Books", {
    book_id: book.id,
    title: book.title,
    author: book.author,
    status: book.status,
    total_pages: book.totalPages ? String(book.totalPages) : "",
    subjects: (book.subjects ?? []).join(","),
    cover_url: "",
    open_library_id: "",
    proposed_by_member_id: book.proposedByMemberId,
    proposed_at: book.proposedAt,
    created_at: nowIso,
    updated_at: nowIso
  });
  return book;
}

export default async (event: { body?: string }) => {
  const body = JSON.parse(event.body ?? "{}");
  const created = await createBook(body as CreateBookPayload);
  return { statusCode: 201, body: JSON.stringify(created) };
};
