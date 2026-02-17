import { enrichBook } from "./_lib/openLibrary";
import { store } from "./_lib/store";

export interface CreateBookPayload {
  title: string;
  author: string;
  proposedByMemberId: string;
}

export async function createBook(payload: CreateBookPayload) {
  const enriched = await enrichBook(payload.title, payload.author);
  const book = {
    id: `b${Date.now()}`,
    title: enriched.title,
    author: enriched.author,
    totalPages: enriched.totalPages,
    subjects: enriched.subjects,
    status: "want_to_read" as const,
    proposedByMemberId: payload.proposedByMemberId,
    proposedAt: new Date().toISOString().slice(0, 10)
  };

  store.books.push(book);
  return book;
}

export default async (event: { body?: string }) => {
  const body = JSON.parse(event.body ?? "{}");
  const created = await createBook(body as CreateBookPayload);
  return { statusCode: 201, body: JSON.stringify(created) };
};
