import { enrichBook } from "./_lib/openLibrary";
import { createSheetsClient, type SheetsClient } from "./_lib/sheetsClient";
import { json, parseJsonBody } from "./_lib/http";

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

export default async (event: { body?: unknown; text?: () => Promise<string>; json?: () => Promise<unknown> }) => {
  try {
    const body = await parseJsonBody<Partial<CreateBookPayload>>(event);
    if (!body.title?.trim() || !body.author?.trim() || !body.proposedByMemberId?.trim()) {
      return json({ error: "Title, author, and proposer are required." }, 400);
    }

    const created = await createBook({
      title: body.title.trim(),
      author: body.author.trim(),
      proposedByMemberId: body.proposedByMemberId.trim()
    });
    return json(created, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create book.";
    return json({ error: message }, 500);
  }
};
