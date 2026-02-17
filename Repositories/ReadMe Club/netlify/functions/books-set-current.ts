import { assertCanSetCurrent } from "./_lib/repository";
import { store } from "./_lib/store";

export function setCurrentBook(bookId: string) {
  const existing = store.books.find((book) => book.status === "current") ?? null;
  assertCanSetCurrent(existing?.id ?? null, bookId);

  const target = store.books.find((book) => book.id === bookId);
  if (!target) {
    throw new Error("Book not found.");
  }
  target.status = "current";
  return target;
}

export default async (event: { body?: string }) => {
  const body = JSON.parse(event.body ?? "{}");
  try {
    const updated = setCurrentBook(body.bookId);
    return { statusCode: 200, body: JSON.stringify(updated) };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error instanceof Error ? error.message : "Unexpected error" })
    };
  }
};
