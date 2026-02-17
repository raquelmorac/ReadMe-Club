import type { Book, Member } from "../../types/domain";

interface WantsToReadListProps {
  books: Book[];
  members: Member[];
}

export function WantsToReadList({ books, members }: WantsToReadListProps) {
  const memberById = new Map(members.map((m) => [m.id, m.name]));

  return (
    <section className="card">
      <h2>Want to Read</h2>
      {books.length === 0 ? <p className="muted">No candidates yet.</p> : null}
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.author}
            <div className="muted">Proposed by {memberById.get(book.proposedByMemberId) ?? "Unknown"} on {book.proposedAt}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
