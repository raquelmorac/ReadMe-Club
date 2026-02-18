import type { BookStatus } from "../../../src/types/domain";

export interface SheetBookRow {
  book_id: string;
  title: string;
  author?: string;
  status: BookStatus;
  proposed_by_member_id?: string;
  proposed_at?: string;
}

export function mapBookRow(row: SheetBookRow) {
  return {
    id: row.book_id,
    title: row.title,
    author: row.author ?? "",
    status: row.status,
    proposedByMemberId: row.proposed_by_member_id ?? "",
    proposedAt: row.proposed_at ?? ""
  };
}

export function assertCanSetCurrent(existingCurrentBookId: string | null, targetBookId: string) {
  if (existingCurrentBookId && existingCurrentBookId !== targetBookId) {
    throw new Error("Cannot move this book to Current because another Current book already exists. Move the current book out first.");
  }
}

export interface RankedVote {
  memberId: string;
  bookId: string;
  rankPosition: 1 | 2 | 3;
}

export function computeRankedPoints(votes: RankedVote[]) {
  const pointsByRank: Record<number, number> = { 1: 3, 2: 2, 3: 1 };
  const totals = new Map<string, number>();
  for (const vote of votes) {
    totals.set(vote.bookId, (totals.get(vote.bookId) ?? 0) + pointsByRank[vote.rankPosition]);
  }
  return [...totals.entries()]
    .map(([bookId, points]) => ({ bookId, points }))
    .sort((a, b) => b.points - a.points)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}
