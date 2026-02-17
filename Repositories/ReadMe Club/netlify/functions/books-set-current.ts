import { assertCanSetCurrent } from "./_lib/repository";
import { createSheetsClient, type SheetsClient } from "./_lib/sheetsClient";

export async function setCurrentBook(bookId: string, client: SheetsClient = createSheetsClient()) {
  const rows = await client.readRows("Books");
  const existing = rows.find((row) => row.status === "current") ?? null;
  assertCanSetCurrent(existing?.book_id ?? null, bookId);

  const target = rows.find((row) => row.book_id === bookId);
  if (!target) {
    throw new Error("Book not found.");
  }

  const nextRows = rows.map((row) => {
    if (row.book_id === bookId) {
      return { ...row, status: "current", updated_at: new Date().toISOString() };
    }
    return row;
  });

  await client.updateRows("Books", nextRows);

  return {
    id: target.book_id,
    title: target.title,
    author: target.author,
    status: "current",
    totalPages: target.total_pages ? Number(target.total_pages) : undefined,
    subjects: target.subjects ? target.subjects.split(",").map((subject) => subject.trim()).filter(Boolean) : [],
    coverUrl: target.cover_url || undefined,
    openLibraryId: target.open_library_id || undefined,
    proposedByMemberId: target.proposed_by_member_id,
    proposedAt: target.proposed_at
  };
}

export default async (event: { body?: string }) => {
  const body = JSON.parse(event.body ?? "{}");
  try {
    const updated = await setCurrentBook(body.bookId);
    return { statusCode: 200, body: JSON.stringify(updated) };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error instanceof Error ? error.message : "Unexpected error" })
    };
  }
};
