import type { Book, PollResult } from "../../types/domain";

interface PollResultsProps {
  result: PollResult;
  books: Book[];
}

export function PollResults({ result, books }: PollResultsProps) {
  const titleById = new Map(books.map((book) => [book.id, book.title]));

  return (
    <section className="card">
      <h2>Poll results</h2>
      <p className="muted">Results never move books automatically to Current.</p>
      <ol>
        {result.rows.sort((a, b) => a.rank - b.rank).map((row) => (
          <li key={row.bookId}>{titleById.get(row.bookId) ?? row.bookId}: {row.points} points</li>
        ))}
      </ol>
    </section>
  );
}
