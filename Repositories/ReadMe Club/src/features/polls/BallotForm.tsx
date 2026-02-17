import { useState } from "react";

interface BallotFormProps {
  candidateIds: string[];
  onSubmit: (rankedBookIds: string[]) => Promise<void>;
}

export function BallotForm({ candidateIds, onSubmit }: BallotFormProps) {
  const [value, setValue] = useState(candidateIds.slice(0, 3).join(","));

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const ranked = value.split(",").map((entry) => entry.trim()).filter(Boolean);
        await onSubmit(ranked);
      }}
    >
      <label>
        Ranked book IDs (comma separated)
        <input value={value} onChange={(event) => setValue(event.target.value)} />
      </label>
      <button type="submit">Submit vote</button>
    </form>
  );
}
