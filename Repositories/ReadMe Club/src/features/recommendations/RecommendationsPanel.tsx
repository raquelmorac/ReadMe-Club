interface RecommendationRow {
  bookId: string;
  score: number;
}

interface RecommendationsPanelProps {
  rows: RecommendationRow[];
}

export function RecommendationsPanel({ rows }: RecommendationsPanelProps) {
  return (
    <section className="card">
      <h2>Recommendations</h2>
      {rows.length === 0 ? <p className="muted">No recommendations yet.</p> : null}
      <ol>
        {rows.map((row) => (
          <li key={row.bookId}>{row.bookId} ({row.score})</li>
        ))}
      </ol>
    </section>
  );
}
