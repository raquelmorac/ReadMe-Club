export type BookStatus = "want_to_read" | "current" | "read";

export interface Member {
  id: string;
  name: string;
  active: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  totalPages?: number;
  subjects?: string[];
  coverUrl?: string;
  openLibraryId?: string;
  proposedByMemberId: string;
  proposedAt: string;
}

export interface Session {
  id: string;
  bookId: string;
  sessionDateTime: string;
  pageStart: number;
  pageEnd: number;
}

export interface PollResultRow {
  bookId: string;
  points: number;
  rank: number;
}

export interface PollResult {
  pollId: string;
  rows: PollResultRow[];
}
