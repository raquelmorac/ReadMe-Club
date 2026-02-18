# Reader Club App v1 - Design

Date: 2026-02-17
Status: Approved

## 1. Goals and Scope

v1 goal: let one reading club run its full weekly reading cycle without external tools.

In scope:
- Member selection (no authentication).
- Book management with separate areas for `Want to Read`, `Current`, and `Read`.
- One and only one `Current` book at a time.
- Weekly sessions (Friday at 1:00 PM default cadence) with past/next session visibility.
- Ratings (1-5) and optional comments for `Read` books only.
- Rule-based recommendations from read history and ratings.
- Track who proposed each `Want to Read` book.
- Ranked voting polls to help decide next book.
- Open Library enrichment when adding books, with manual fallback.

Out of scope for v1:
- AI-generated session planning.
- Notifications.
- CSV import/export.
- Automatic movement of books based on voting results.

## 2. Architecture

- Frontend: responsive web app deployed on Netlify.
- Backend: Netlify Functions for all write/business operations.
- Persistence: Google Sheets used as datastore.
- External enrichment: Open Library API.

Rationale:
- Aligns with low hosting cost, simplicity, and clean UX priorities.
- Keeps credentials and validation in server-side functions, avoiding direct browser writes to Sheets.

## 3. Data Model (Google Sheets Tabs)

- `Members`
  - `member_id`, `name`, `active`

- `Books`
  - `book_id`, `title`, `author`, `status` (`want_to_read|current|read`)
  - `total_pages`, `subjects`, `cover_url`, `open_library_id`
  - `proposed_by_member_id`, `proposed_at`
  - `created_at`, `updated_at`

- `Sessions`
  - `session_id`, `book_id`, `session_datetime`
  - `page_start`, `page_end`, `notes`, `created_at`

- `Ratings`
  - `rating_id`, `book_id`, `member_id`, `score` (1-5), `comment`
  - `created_at`, `updated_at`

- `Polls`
  - `poll_id`, `title`, `status` (`open|closed`), `created_at`, `closed_at`

- `PollBooks`
  - `poll_book_id`, `poll_id`, `book_id`

- `Votes`
  - `vote_id`, `poll_id`, `member_id`, `book_id`, `rank_position`
  - one row per ranked choice

Optional:
- `RecommendationsCache`
  - cached recommendation outputs for faster UI load.

## 4. UX and Components

- Global `Member Selector`
  - User selects current member identity.

- `Want to Read` View
  - List of candidate books.
  - Shows proposer (`proposed_by`) and proposal date.
  - Supports creating/participating in polls.

- `Current` View (single-book detail)
  - Displays exactly one active book.
  - Shows book details, progress context, past sessions, and next session.
  - If no active book, render empty state with guidance.

- `Read` View
  - List of completed books.
  - Access to ratings and comments.

- Polling UI (ranked voting)
  - Create poll from selected `Want to Read` books.
  - Each member submits ranked choices.
  - Results show ranking and weighted totals.
  - Poll results do not move books automatically.

## 5. Business Rules

- Single current book rule:
  - If a current book exists, block attempts to set another book as current.
  - No prompt/override flow in this action.
  - Show explicit message:
    - `Cannot move this book to Current because another Current book already exists. Move the current book out first.`

- Status transitions:
  - `want_to_read -> current` allowed only when no current book exists.
  - `current -> read` and `current -> want_to_read` are manual actions.
  - Poll outcomes never trigger automatic status changes.

- Ratings/comments:
  - Allowed only for books in `read`.
  - Each member may edit/delete their own comment.

- Voting:
  - Ranked voting (user selected option).
  - Weighted points default: rank1=3, rank2=2, rank3=1.
  - No duplicate rank position in one ballot.
  - One member ballot per poll (editable until poll closes).
  - Tie handling is manual.

- Session planning:
  - Suggest pages per session from `total_pages` and configured number of sessions.
  - Suggestions are editable by users.

- Book enrichment:
  - Attempt Open Library lookup on add.
  - If lookup fails or partial, allow manual completion and save.

## 6. Data Flow

- Add book
  - Input title/author (+ proposer) -> Open Library enrichment -> user confirms/edits -> save as `want_to_read`.

- Start/continue reading
  - User manually sets a `want_to_read` book to `current` (only if none exists).
  - Weekly sessions are created/updated against current book.

- Finish reading
  - User manually moves current book to `read`.
  - Ratings/comments become available.

- Vote for next read
  - Create poll -> members rank choices -> close poll -> review results.
  - Separate manual action decides which book becomes current.

- Recommend books
  - Rule-based suggestions generated from read history + ratings + metadata similarity.

## 7. Error Handling

- Validation errors return clear actionable messages.
- Empty states for:
  - no current book,
  - no sessions,
  - no ratings,
  - no recommendations,
  - no open polls.
- External API failure (Open Library) degrades gracefully to manual entry.
- Google Sheets read/write failures return retry-safe errors.

## 8. Testing Strategy

- Unit tests:
  - status transition guards (especially single-current rule),
  - vote scoring and ballot validation,
  - pages-per-session suggestion calculation,
  - recommendation rule scoring.

- Integration tests (functions + sheets adapter):
  - CRUD for books/sessions/ratings,
  - poll lifecycle and vote submission,
  - add-book enrichment fallback path.

- UI tests:
  - proposer visible in `Want to Read`,
  - blocked move to current with required explanatory message,
  - current view shows past and next session details,
  - ratings only for `Read`.

## 9. Success Criteria

Within first 4-8 weeks, success means the club can complete full reading operations end-to-end in this app:
- maintain members and book lists,
- run weekly sessions around one current book,
- record ratings/comments for finished books,
- use poll results to inform manual current-book selection.
