import { useState } from "react";

interface RatingFormProps {
  onSubmit: (score: number, comment: string) => Promise<void>;
}

export function RatingForm({ onSubmit }: RatingFormProps) {
  const [score, setScore] = useState(3);
  const [comment, setComment] = useState("");

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(score, comment);
      }}
    >
      <label>
        Score
        <input type="number" min={1} max={5} value={score} onChange={(event) => setScore(Number(event.target.value))} />
      </label>
      <label>
        Comment
        <input value={comment} onChange={(event) => setComment(event.target.value)} />
      </label>
      <button type="submit">Save rating</button>
    </form>
  );
}
