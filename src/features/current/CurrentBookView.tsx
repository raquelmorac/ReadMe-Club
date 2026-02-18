import type { Book, Session } from "../../types/domain";

interface CurrentBookViewProps {
  book: Book | null;
  sessions: Session[];
}

export function CurrentBookView({ book, sessions }: CurrentBookViewProps) {
  if (!book) {
    return (
      <section className="card">
        <h2>Current Book</h2>
        <p className="muted">No current book. Move one from Want to Read.</p>
      </section>
    );
  }

  const sorted = [...sessions].sort((a, b) => a.sessionDateTime.localeCompare(b.sessionDateTime));
  const now = new Date();
  const past = sorted.filter((s) => new Date(s.sessionDateTime) < now);
  const next = sorted.find((s) => new Date(s.sessionDateTime) >= now) ?? null;

  return (
    <section className="card">
      <h2>Current</h2>
      <p><strong>{book.title}</strong> by {book.author}</p>
      <p className="muted">{book.totalPages ?? "?"} pages</p>
      <h3>Next session</h3>
      {next ? <p>{next.sessionDateTime} ({next.pageStart}-{next.pageEnd})</p> : <p className="muted">No next session scheduled.</p>}
      <h3>Past sessions</h3>
      <ul>
        {past.map((session) => (
          <li key={session.id}>{session.sessionDateTime} ({session.pageStart}-{session.pageEnd})</li>
        ))}
      </ul>
    </section>
  );
}
