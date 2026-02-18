import { createSheetsClient, type SheetsClient } from "./_lib/sheetsClient";

export interface UpsertRatingPayload {
  bookId: string;
  memberId: string;
  score: number;
  comment?: string;
}

export async function saveRating(payload: UpsertRatingPayload, client: SheetsClient = createSheetsClient()) {
  const books = await client.readRows("Books");
  const book = books.find((entry) => entry.book_id === payload.bookId);
  if (!book || book.status !== "read") {
    throw new Error("Ratings are allowed only for Read books.");
  }

  const ratings = await client.readRows("Ratings");
  const existing = ratings.find((rating) => rating.book_id === payload.bookId && rating.member_id === payload.memberId);
  if (existing) {
    const updatedRows = ratings.map((rating) => {
      if (rating.rating_id !== existing.rating_id) {
        return rating;
      }
      return {
        ...rating,
        score: String(payload.score),
        comment: payload.comment ?? "",
        updated_at: new Date().toISOString()
      };
    });
    await client.updateRows("Ratings", updatedRows);
    return {
      id: existing.rating_id,
      bookId: payload.bookId,
      memberId: payload.memberId,
      score: payload.score,
      comment: payload.comment
    };
  }

  const ratingId = `r${Date.now()}`;
  const nowIso = new Date().toISOString();
  await client.appendRow("Ratings", {
    rating_id: ratingId,
    book_id: payload.bookId,
    member_id: payload.memberId,
    score: String(payload.score),
    comment: payload.comment ?? "",
    created_at: nowIso,
    updated_at: nowIso
  });
  const rating = { id: ratingId, ...payload };
  return rating;
}

export default async (event: { body?: string }) => {
  const body = JSON.parse(event.body ?? "{}");
  try {
    const rating = await saveRating(body as UpsertRatingPayload);
    return { statusCode: 200, body: JSON.stringify(rating) };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error instanceof Error ? error.message : "Unexpected error" })
    };
  }
};
