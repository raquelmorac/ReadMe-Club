import { useMemo, useState } from "react";
import type { Book, Member, PollResult, Session } from "./types/domain";
import { MemberSelector } from "./features/members/MemberSelector";
import { WantsToReadList } from "./features/books/WantsToReadList";
import { CurrentBookView } from "./features/current/CurrentBookView";
import { ReadList } from "./features/books/ReadList";
import { PollResults } from "./features/polls/PollResults";

const membersSeed: Member[] = [
  { id: "m1", name: "Ana", active: true },
  { id: "m2", name: "Raquel", active: true }
];

const booksSeed: Book[] = [
  { id: "b1", title: "Dune", author: "Frank Herbert", status: "want_to_read", proposedByMemberId: "m1", proposedAt: "2026-02-10" },
  { id: "b2", title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", status: "read", proposedByMemberId: "m2", proposedAt: "2026-02-01" },
  { id: "b3", title: "Hyperion", author: "Dan Simmons", status: "current", proposedByMemberId: "m1", proposedAt: "2026-02-12", totalPages: 480 }
];

const sessionSeed: Session[] = [
  { id: "s1", bookId: "b3", sessionDateTime: "2026-02-13T13:00:00.000Z", pageStart: 1, pageEnd: 55 },
  { id: "s2", bookId: "b3", sessionDateTime: "2026-02-20T13:00:00.000Z", pageStart: 56, pageEnd: 110 }
];

const pollResultSeed: PollResult = {
  pollId: "p1",
  rows: [
    { bookId: "b1", points: 10, rank: 1 },
    { bookId: "b3", points: 7, rank: 2 }
  ]
};

export function App() {
  const [activeMemberId, setActiveMemberId] = useState<string | null>(membersSeed[0]?.id ?? null);

  const wantsToRead = useMemo(() => booksSeed.filter((b) => b.status === "want_to_read"), []);
  const currentBook = useMemo(() => booksSeed.find((b) => b.status === "current") ?? null, []);
  const readBooks = useMemo(() => booksSeed.filter((b) => b.status === "read"), []);
  const currentSessions = useMemo(() => sessionSeed.filter((s) => s.bookId === currentBook?.id), [currentBook]);

  return (
    <main className="app-shell">
      <h1>Reader Club</h1>
      <p className="muted">One-club dashboard for books, sessions, voting, and ratings.</p>

      <section className="card">
        <h2>Active member</h2>
        <MemberSelector members={membersSeed} value={activeMemberId} onChange={setActiveMemberId} />
      </section>

      <section className="grid">
        <WantsToReadList books={wantsToRead} members={membersSeed} />
        <ReadList books={readBooks} />
      </section>

      <CurrentBookView book={currentBook} sessions={currentSessions} />
      <PollResults result={pollResultSeed} books={booksSeed} />
    </main>
  );
}
