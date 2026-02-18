import { useEffect, useMemo, useState } from "react";
import type { Book, Member, PollResult, Session } from "./types/domain";
import { MemberSelector } from "./features/members/MemberSelector";
import { WantsToReadList } from "./features/books/WantsToReadList";
import { CurrentBookView } from "./features/current/CurrentBookView";
import { ReadList } from "./features/books/ReadList";
import { PollResults } from "./features/polls/PollResults";
import { getJson } from "./api/client";

const emptyPollResult: PollResult = { pollId: "none", rows: [] };
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "/.netlify/functions").replace(/\/$/, "");

export function App() {
  const [members, setMembers] = useState<Member[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [membersData, booksData] = await Promise.all([
          getJson<Member[]>(`${apiBaseUrl}/members-list`),
          getJson<Book[]>(`${apiBaseUrl}/books-list`)
        ]);

        if (cancelled) {
          return;
        }

        setMembers(membersData);
        setBooks(booksData);
        setActiveMemberId((current) => current ?? membersData[0]?.id ?? null);
        setLoadError(null);

        const currentBook = booksData.find((book) => book.status === "current");
        if (!currentBook) {
          setSessions([]);
          return;
        }

        const sessionData = await getJson<Session[]>(
          `${apiBaseUrl}/sessions-list-by-book?bookId=${encodeURIComponent(currentBook.id)}`
        );
        if (!cancelled) {
          setSessions(sessionData);
        }
      } catch {
        if (!cancelled) {
          setMembers([]);
          setBooks([]);
          setSessions([]);
          setLoadError("Could not load live data.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  const wantsToRead = useMemo(() => books.filter((b) => b.status === "want_to_read"), [books]);
  const currentBook = useMemo(() => books.find((b) => b.status === "current") ?? null, [books]);
  const readBooks = useMemo(() => books.filter((b) => b.status === "read"), [books]);

  return (
    <main className="app-shell">
      {isLoading ? (
        <div className="loading-overlay" role="status" aria-live="polite" aria-label="Loading club data">
          <div className="loading-overlay-content">
            <span className="spinner" aria-hidden="true" />
            <span>Loading club data...</span>
          </div>
        </div>
      ) : null}
      <h1>Reader Club</h1>
      <p className="muted">One-club dashboard for books, sessions, voting, and ratings.</p>
      {loadError ? <p className="muted">{loadError}</p> : null}

      <section className="card">
        <h2>Active member</h2>
        <MemberSelector members={members} value={activeMemberId} onChange={setActiveMemberId} />
      </section>

      <section className="grid">
        <WantsToReadList books={wantsToRead} members={members} />
        <ReadList books={readBooks} />
      </section>

      <CurrentBookView book={currentBook} sessions={sessions} />
      <PollResults result={emptyPollResult} books={books} />
    </main>
  );
}
