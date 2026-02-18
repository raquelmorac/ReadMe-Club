import { useState } from "react";
import type { Book, Member } from "../../types/domain";
import { AddBookForm } from "./AddBookForm";

interface WantToReadPageProps {
  books: Book[];
  members: Member[];
  activeMemberId: string | null;
  onCreate: (payload: { title: string; author: string; proposedByMemberId: string }) => Promise<void>;
  onUpdate: (payload: { id: string; title: string; author: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function WantToReadPage({ books, members, activeMemberId, onCreate, onUpdate, onDelete }: WantToReadPageProps) {
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");

  const memberById = new Map(members.map((m) => [m.id, m.name]));

  return (
    <section className="card">
      <h2>Manage Want to Read</h2>
      {activeMemberId ? <AddBookForm onSubmit={onCreate} proposedByMemberId={activeMemberId} /> : null}

      {books.length === 0 ? <p className="muted">No candidates yet.</p> : null}
      <ul>
        {books.map((book) => {
          const isEditing = editingBookId === book.id;
          return (
            <li key={book.id}>
              {isEditing ? (
                <div>
                  <input aria-label="Edit title" value={editTitle} onChange={(event) => setEditTitle(event.target.value)} />
                  <input aria-label="Edit author" value={editAuthor} onChange={(event) => setEditAuthor(event.target.value)} />
                  <button
                    type="button"
                    onClick={async () => {
                      await onUpdate({ id: book.id, title: editTitle, author: editAuthor });
                      setEditingBookId(null);
                    }}
                  >
                    Save
                  </button>
                  <button type="button" onClick={() => setEditingBookId(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <strong>{book.title}</strong> by {book.author}
                  <div className="muted">Proposed by {memberById.get(book.proposedByMemberId) ?? "Unknown"} on {book.proposedAt}</div>
                  <button
                    type="button"
                    aria-label={`Edit ${book.title}`}
                    onClick={() => {
                      setEditingBookId(book.id);
                      setEditTitle(book.title);
                      setEditAuthor(book.author);
                    }}
                  >
                    Edit
                  </button>
                  <button type="button" aria-label={`Delete ${book.title}`} onClick={() => onDelete(book.id)}>
                    Delete
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
