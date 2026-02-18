import { useState } from "react";

interface AddBookFormProps {
  onSubmit: (payload: { title: string; author: string; proposedByMemberId: string }) => Promise<void>;
  proposedByMemberId: string;
}

export function AddBookForm({ onSubmit, proposedByMemberId }: AddBookFormProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  return (
    <form
      className="card"
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitError(null);
        if (!title.trim() || !author.trim()) {
          setSubmitError("Title and author are required.");
          return;
        }

        try {
          setIsSubmitting(true);
          await onSubmit({ title: title.trim(), author: author.trim(), proposedByMemberId });
          setTitle("");
          setAuthor("");
        } catch (error) {
          const message = error instanceof Error ? error.message : "Could not add book.";
          setSubmitError(message);
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <h2>Add book</h2>
      <input aria-label="Title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" />
      <input aria-label="Author" value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="Author" />
      <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add"}</button>
      {submitError ? <p className="error" role="alert">{submitError}</p> : null}
    </form>
  );
}
