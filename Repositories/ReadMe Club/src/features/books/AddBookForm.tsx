import { useState } from "react";

interface AddBookFormProps {
  onSubmit: (payload: { title: string; author: string; proposedByMemberId: string }) => Promise<void>;
  proposedByMemberId: string;
}

export function AddBookForm({ onSubmit, proposedByMemberId }: AddBookFormProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  return (
    <form
      className="card"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit({ title, author, proposedByMemberId });
        setTitle("");
        setAuthor("");
      }}
    >
      <h2>Add book</h2>
      <input aria-label="Title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" />
      <input aria-label="Author" value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="Author" />
      <button type="submit">Add</button>
    </form>
  );
}
