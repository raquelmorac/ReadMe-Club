import { useEffect, useMemo, useState } from "react";
import type { Book, Member, PollResult, Session } from "./types/domain";
import { MemberSelector } from "./features/members/MemberSelector";
import { WantToReadPage } from "./features/books/WantToReadPage";
import { CurrentBookView } from "./features/current/CurrentBookView";
import { ReadList } from "./features/books/ReadList";
import { PollResults } from "./features/polls/PollResults";
import { getJson } from "./api/client";

const emptyPollResult: PollResult = { pollId: "none", rows: [] };
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "/.netlify/functions").replace(/\/$/, "");
type PageView = "dashboard" | "want_to_read";

export function App() {
  const [members, setMembers] = useState<Member[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageView, setPageView] = useState<PageView>("dashboard");

  async function readErrorMessage(response: Response) {
    const fallback = `Request failed: ${response.status}`;
    try {
      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const body = await response.json();
        if (typeof body?.error === "string" && body.error.trim()) {
          return body.error;
        }
      } else {
        const text = await response.text();
        if (text.trim()) {
          return text.trim();
        }
      }
    } catch {
      return fallback;
    }
    return fallback;
  }

  async function loadBooksAndSessions() {
    const booksData = await getJson<Book[]>(`${apiBaseUrl}/books-list`);
    setBooks(booksData);

    const selectedCurrentBook = booksData.find((book) => book.status === "current");
    if (!selectedCurrentBook) {
      setSessions([]);
      return;
    }

    const sessionData = await getJson<Session[]>(
      `${apiBaseUrl}/sessions-list-by-book?bookId=${encodeURIComponent(selectedCurrentBook.id)}`
    );
    setSessions(sessionData);
  }

  async function handleAddBook(payload: { title: string; author: string; proposedByMemberId: string }) {
    const response = await fetch(`${apiBaseUrl}/books-create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }
    await loadBooksAndSessions();
  }

  async function handleUpdateBook(payload: { id: string; title: string; author: string }) {
    const response = await fetch(`${apiBaseUrl}/books-update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    await loadBooksAndSessions();
  }

  async function handleDeleteBook(id: string) {
    const response = await fetch(`${apiBaseUrl}/books-delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    await loadBooksAndSessions();
  }

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const membersData = await getJson<Member[]>(`${apiBaseUrl}/members-list`);
        if (cancelled) {
          return;
        }
        setMembers(membersData);
        setActiveMemberId((current) => current ?? membersData[0]?.id ?? null);
        setLoadError(null);

        await loadBooksAndSessions();
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
      <nav className="page-nav">
        <button type="button" onClick={() => setPageView("dashboard")}>Dashboard</button>
        <button type="button" onClick={() => setPageView("want_to_read")}>Want to Read</button>
      </nav>

      <section className="card">
        <h2>Active member</h2>
        <MemberSelector members={members} value={activeMemberId} onChange={setActiveMemberId} />
      </section>

      {pageView === "want_to_read" ? (
        <WantToReadPage
          books={wantsToRead}
          members={members}
          activeMemberId={activeMemberId}
          onCreate={handleAddBook}
          onUpdate={handleUpdateBook}
          onDelete={handleDeleteBook}
        />
      ) : (
        <>
          <section className="grid">
            <ReadList books={readBooks} />
          </section>

          <CurrentBookView book={currentBook} sessions={sessions} />
          <PollResults result={emptyPollResult} books={books} />
        </>
      )}
    </main>
  );
}
