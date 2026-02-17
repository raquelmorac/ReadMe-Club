import type { Book } from "../../types/domain";

interface ReadListProps {
  books: Book[];
}

export function ReadList({ books }: ReadListProps) {
  return (
    <section className="card">
      <h2>Read</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </section>
  );
}
