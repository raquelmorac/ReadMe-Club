import type { Book, Member, Session } from "../../../src/types/domain";
import type { RankedVote } from "./repository";

export interface Rating {
  id: string;
  bookId: string;
  memberId: string;
  score: number;
  comment?: string;
}

export interface Poll {
  id: string;
  title: string;
  status: "open" | "closed";
  bookIds: string[];
}

export const store: {
  members: Member[];
  books: Book[];
  sessions: Session[];
  ratings: Rating[];
  polls: Poll[];
  votes: RankedVote[];
} = {
  members: [
    { id: "m1", name: "Ana", active: true },
    { id: "m2", name: "Raquel", active: true }
  ],
  books: [],
  sessions: [],
  ratings: [],
  polls: [],
  votes: []
};

export function resetStore() {
  store.books = [];
  store.sessions = [];
  store.ratings = [];
  store.polls = [];
  store.votes = [];
}
