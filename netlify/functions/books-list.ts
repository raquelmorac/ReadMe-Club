import { store } from "./_lib/store";
import { createSheetsClient } from "./_lib/sheetsClient";
import { json } from "./_lib/http";

export default async () => {
  const client = createSheetsClient();
  try {
    const rows = await client.readRows("Books");
    const books = rows.map((row) => ({
      id: row.book_id,
      title: row.title,
      author: row.author,
      status: row.status,
      totalPages: row.total_pages ? Number(row.total_pages) : undefined,
      subjects: row.subjects ? row.subjects.split(",").map((subject) => subject.trim()).filter(Boolean) : [],
      coverUrl: row.cover_url || undefined,
      openLibraryId: row.open_library_id || undefined,
      proposedByMemberId: row.proposed_by_member_id,
      proposedAt: row.proposed_at
    }));
    return json(books);
  } catch {
    return json(store.books);
  }
};
