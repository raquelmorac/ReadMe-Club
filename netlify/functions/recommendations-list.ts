import { recommendBooks } from "./_lib/recommendationEngine";
import { createSheetsClient, type SheetsClient } from "./_lib/sheetsClient";

export async function getRecommendations(client: SheetsClient = createSheetsClient()) {
  const rows = await client.readRows("Books");
  const books = rows.map((row) => ({
    id: row.book_id,
    title: row.title,
    author: row.author,
    status: row.status as "want_to_read" | "current" | "read",
    subjects: row.subjects ? row.subjects.split(",").map((subject) => subject.trim()).filter(Boolean) : [],
    proposedByMemberId: row.proposed_by_member_id,
    proposedAt: row.proposed_at
  }));
  const readBooks = books.filter((book) => book.status === "read");
  const candidates = books.filter((book) => book.status === "want_to_read");
  return recommendBooks(readBooks, candidates);
}

export default async () => {
  const rows = await getRecommendations();
  return { statusCode: 200, body: JSON.stringify(rows) };
};
