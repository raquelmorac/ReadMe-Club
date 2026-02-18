import type { Book } from "../../types/domain";

interface PollBuilderProps {
  books: Book[];
  onCreate: (bookIds: string[]) => Promise<void>;
}

export function PollBuilder({ books, onCreate }: PollBuilderProps) {
  return (
    <section className="card">
      <h2>Create poll</h2>
      <button onClick={() => onCreate(books.map((book) => book.id))}>Create from all Want to Read</button>
    </section>
  );
}
