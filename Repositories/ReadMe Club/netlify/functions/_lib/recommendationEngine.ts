import type { Book } from "../../../src/types/domain";

export interface RecommendationRow {
  bookId: string;
  score: number;
}

export function recommendBooks(readBooks: Book[], candidates: Book[]): RecommendationRow[] {
  const subjectScore = new Map<string, number>();
  const authorScore = new Map<string, number>();

  for (const read of readBooks) {
    authorScore.set(read.author, (authorScore.get(read.author) ?? 0) + 2);
    for (const subject of read.subjects ?? []) {
      subjectScore.set(subject, (subjectScore.get(subject) ?? 0) + 1);
    }
  }

  return candidates
    .map((candidate) => {
      let score = authorScore.get(candidate.author) ?? 0;
      for (const subject of candidate.subjects ?? []) {
        score += subjectScore.get(subject) ?? 0;
      }
      return { bookId: candidate.id, score };
    })
    .sort((a, b) => b.score - a.score);
}
