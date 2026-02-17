import { store } from "./_lib/store";

export interface UpsertRatingPayload {
  bookId: string;
  memberId: string;
  score: number;
  comment?: string;
}

export function saveRating(payload: UpsertRatingPayload) {
  const book = store.books.find((entry) => entry.id === payload.bookId);
  if (!book || book.status !== "read") {
    throw new Error("Ratings are allowed only for Read books.");
  }

  const existing = store.ratings.find((rating) => rating.bookId === payload.bookId && rating.memberId === payload.memberId);
  if (existing) {
    existing.score = payload.score;
    existing.comment = payload.comment;
    return existing;
  }

  const rating = { id: `r${Date.now()}`, ...payload };
  store.ratings.push(rating);
  return rating;
}

export default async (event: { body?: string }) => {
  const body = JSON.parse(event.body ?? "{}");
  try {
    const rating = saveRating(body as UpsertRatingPayload);
    return { statusCode: 200, body: JSON.stringify(rating) };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error instanceof Error ? error.message : "Unexpected error" })
    };
  }
};
