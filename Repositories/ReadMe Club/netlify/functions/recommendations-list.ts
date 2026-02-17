import { recommendBooks } from "./_lib/recommendationEngine";
import { store } from "./_lib/store";

export function getRecommendations() {
  const readBooks = store.books.filter((book) => book.status === "read");
  const candidates = store.books.filter((book) => book.status === "want_to_read");
  return recommendBooks(readBooks, candidates);
}

export default async () => {
  const rows = getRecommendations();
  return { statusCode: 200, body: JSON.stringify(rows) };
};
