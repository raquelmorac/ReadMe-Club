# Reader Club v1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a low-cost Netlify-hosted Reader Club web app with Google Sheets persistence, one-current-book enforcement, sessions, ratings, recommendations, and ranked voting.

**Architecture:** Use a React + TypeScript SPA for UI and Netlify Functions for business logic and Google Sheets access. Keep all write rules server-side to enforce constraints consistently, including single-current-book and voting validations. Structure code by domain (`books`, `sessions`, `ratings`, `polls`, `recommendations`) with shared validation and typed contracts.

**Tech Stack:** Vite, React, TypeScript, Netlify Functions, Google Sheets API, Vitest, React Testing Library, Playwright

---

### Task 1: Project Scaffold and Tooling

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `netlify.toml`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `netlify/functions/health.ts`
- Create: `tests/smoke/app.smoke.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { App } from "../../src/App";

it("renders Reader Club title", () => {
  render(<App />);
  expect(screen.getByText("Reader Club")).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/smoke/app.smoke.test.tsx -t "renders Reader Club title"`
Expected: FAIL because app/testing setup does not exist yet.

**Step 3: Write minimal implementation**

```tsx
export function App() {
  return <h1>Reader Club</h1>;
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/smoke/app.smoke.test.tsx -t "renders Reader Club title"`
Expected: PASS

**Step 5: Commit**

```bash
git add package.json tsconfig.json vite.config.ts netlify.toml src tests netlify/functions/health.ts
git commit -m "chore: scaffold reader club app with test tooling"
```

### Task 2: Sheets Adapter and Domain Types

**Files:**
- Create: `src/types/domain.ts`
- Create: `netlify/functions/_lib/sheetsClient.ts`
- Create: `netlify/functions/_lib/repository.ts`
- Test: `tests/functions/repository.test.ts`

**Step 1: Write the failing test**

```ts
import { mapBookRow } from "../../../netlify/functions/_lib/repository";

it("maps a sheet row to a typed book", () => {
  const book = mapBookRow({
    book_id: "b1",
    title: "Dune",
    status: "want_to_read",
  });
  expect(book.id).toBe("b1");
  expect(book.status).toBe("want_to_read");
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/functions/repository.test.ts -t "maps a sheet row"`
Expected: FAIL with module/function missing.

**Step 3: Write minimal implementation**

```ts
export function mapBookRow(row: any) {
  return { id: row.book_id, title: row.title, status: row.status };
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/functions/repository.test.ts -t "maps a sheet row"`
Expected: PASS

**Step 5: Commit**

```bash
git add src/types/domain.ts netlify/functions/_lib/sheetsClient.ts netlify/functions/_lib/repository.ts tests/functions/repository.test.ts
git commit -m "feat: add sheets repository foundation and domain types"
```

### Task 3: Member Selector and Read-Only Data Fetch

**Files:**
- Create: `src/api/client.ts`
- Create: `src/features/members/MemberSelector.tsx`
- Create: `src/features/books/WantsToReadList.tsx`
- Modify: `src/App.tsx`
- Create: `netlify/functions/members-list.ts`
- Create: `netlify/functions/books-list.ts`
- Test: `tests/ui/member-selector.test.tsx`

**Step 1: Write the failing test**

```tsx
it("loads members and allows selecting active member", async () => {
  render(<MemberSelector members={[{ id: "m1", name: "Ana" }]} value={null} onChange={() => {}} />);
  expect(screen.getByText("Ana")).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/ui/member-selector.test.tsx -t "loads members"`
Expected: FAIL due missing component.

**Step 3: Write minimal implementation**

```tsx
export function MemberSelector({ members, value, onChange }: any) {
  return <select value={value ?? ""} onChange={(e) => onChange(e.target.value)}>{members.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>;
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/ui/member-selector.test.tsx -t "loads members"`
Expected: PASS

**Step 5: Commit**

```bash
git add src/api/client.ts src/features/members/MemberSelector.tsx src/features/books/WantsToReadList.tsx src/App.tsx netlify/functions/members-list.ts netlify/functions/books-list.ts tests/ui/member-selector.test.tsx
git commit -m "feat: add member selector and read-only list endpoints"
```

### Task 4: Add Book with Open Library Enrichment and Proposer

**Files:**
- Create: `src/features/books/AddBookForm.tsx`
- Create: `netlify/functions/_lib/openLibrary.ts`
- Create: `netlify/functions/books-create.ts`
- Test: `tests/functions/books-create.test.ts`
- Test: `tests/ui/add-book-form.test.tsx`

**Step 1: Write the failing test**

```ts
it("stores proposer when creating want_to_read book", async () => {
  const payload = { title: "Dune", author: "Frank Herbert", proposedByMemberId: "m1" };
  const result = await createBook(payload);
  expect(result.status).toBe("want_to_read");
  expect(result.proposedByMemberId).toBe("m1");
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/functions/books-create.test.ts -t "stores proposer"`
Expected: FAIL because create flow not implemented.

**Step 3: Write minimal implementation**

```ts
// In books-create.ts
const book = { ...payload, status: "want_to_read", proposedByMemberId: payload.proposedByMemberId };
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/functions/books-create.test.ts -t "stores proposer"`
Expected: PASS

**Step 5: Commit**

```bash
git add src/features/books/AddBookForm.tsx netlify/functions/_lib/openLibrary.ts netlify/functions/books-create.ts tests/functions/books-create.test.ts tests/ui/add-book-form.test.tsx
git commit -m "feat: add book creation with proposer and open library enrichment"
```

### Task 5: Enforce Single Current Book with Explicit Error Message

**Files:**
- Create: `netlify/functions/books-set-current.ts`
- Modify: `netlify/functions/_lib/repository.ts`
- Create: `src/features/books/SetCurrentAction.tsx`
- Test: `tests/functions/books-set-current.test.ts`
- Test: `tests/ui/current-guard-message.test.tsx`

**Step 1: Write the failing test**

```ts
it("rejects setting current when another current exists", async () => {
  await expect(setCurrent("book-2")).rejects.toThrow(
    "Cannot move this book to Current because another Current book already exists. Move the current book out first."
  );
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/functions/books-set-current.test.ts -t "rejects setting current"`
Expected: FAIL because guard is missing.

**Step 3: Write minimal implementation**

```ts
if (existingCurrent && existingCurrent.id !== targetBookId) {
  throw new Error("Cannot move this book to Current because another Current book already exists. Move the current book out first.");
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/functions/books-set-current.test.ts -t "rejects setting current"`
Expected: PASS

**Step 5: Commit**

```bash
git add netlify/functions/books-set-current.ts netlify/functions/_lib/repository.ts src/features/books/SetCurrentAction.tsx tests/functions/books-set-current.test.ts tests/ui/current-guard-message.test.tsx
git commit -m "feat: enforce single current book rule with explicit error message"
```

### Task 6: Current View with Past and Next Sessions

**Files:**
- Create: `src/features/current/CurrentBookView.tsx`
- Create: `src/features/sessions/SessionTimeline.tsx`
- Create: `netlify/functions/sessions-list-by-book.ts`
- Create: `netlify/functions/sessions-upsert.ts`
- Test: `tests/ui/current-book-view.test.tsx`
- Test: `tests/functions/sessions-upsert.test.ts`

**Step 1: Write the failing test**

```tsx
it("shows next session and past sessions for current book", () => {
  render(<CurrentBookView book={{ id: "b1", title: "Dune" }} pastSessions={[{ id: "s1" }]} nextSession={{ id: "s2" }} />);
  expect(screen.getByText("Next session")).toBeInTheDocument();
  expect(screen.getByText("Past sessions")).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/ui/current-book-view.test.tsx -t "shows next session"`
Expected: FAIL due missing component.

**Step 3: Write minimal implementation**

```tsx
export function CurrentBookView() {
  return (
    <>
      <h2>Next session</h2>
      <h3>Past sessions</h3>
    </>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/ui/current-book-view.test.tsx -t "shows next session"`
Expected: PASS

**Step 5: Commit**

```bash
git add src/features/current/CurrentBookView.tsx src/features/sessions/SessionTimeline.tsx netlify/functions/sessions-list-by-book.ts netlify/functions/sessions-upsert.ts tests/ui/current-book-view.test.tsx tests/functions/sessions-upsert.test.ts
git commit -m "feat: add current book detail with session timeline"
```

### Task 7: Read Ratings and Comments Rules

**Files:**
- Create: `src/features/ratings/RatingForm.tsx`
- Create: `netlify/functions/ratings-upsert.ts`
- Create: `netlify/functions/ratings-delete.ts`
- Test: `tests/functions/ratings-upsert.test.ts`
- Test: `tests/ui/rating-form.test.tsx`

**Step 1: Write the failing test**

```ts
it("rejects rating when book is not read", async () => {
  await expect(saveRating({ bookId: "b1", score: 4 })).rejects.toThrow("Ratings are allowed only for Read books.");
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/functions/ratings-upsert.test.ts -t "rejects rating"`
Expected: FAIL because validation is missing.

**Step 3: Write minimal implementation**

```ts
if (book.status !== "read") throw new Error("Ratings are allowed only for Read books.");
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/functions/ratings-upsert.test.ts -t "rejects rating"`
Expected: PASS

**Step 5: Commit**

```bash
git add src/features/ratings/RatingForm.tsx netlify/functions/ratings-upsert.ts netlify/functions/ratings-delete.ts tests/functions/ratings-upsert.test.ts tests/ui/rating-form.test.tsx
git commit -m "feat: add ratings and comments with read-only eligibility rule"
```

### Task 8: Ranked Voting Polls and Manual Current Selection

**Files:**
- Create: `src/features/polls/PollBuilder.tsx`
- Create: `src/features/polls/BallotForm.tsx`
- Create: `src/features/polls/PollResults.tsx`
- Create: `netlify/functions/polls-create.ts`
- Create: `netlify/functions/polls-vote.ts`
- Create: `netlify/functions/polls-close.ts`
- Test: `tests/functions/polls-vote.test.ts`
- Test: `tests/functions/polls-close.test.ts`
- Test: `tests/ui/poll-results.test.tsx`

**Step 1: Write the failing test**

```ts
it("calculates ranked points and does not change book status on poll close", async () => {
  const result = await closePoll("p1");
  expect(result.ranking[0].points).toBeGreaterThan(0);
  expect(result.statusChanges).toEqual([]);
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/functions/polls-close.test.ts -t "does not change book status"`
Expected: FAIL because poll close behavior is not implemented.

**Step 3: Write minimal implementation**

```ts
return { ranking: computeRanking(votes), statusChanges: [] };
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/functions/polls-close.test.ts -t "does not change book status"`
Expected: PASS

**Step 5: Commit**

```bash
git add src/features/polls netlify/functions/polls-create.ts netlify/functions/polls-vote.ts netlify/functions/polls-close.ts tests/functions/polls-vote.test.ts tests/functions/polls-close.test.ts tests/ui/poll-results.test.tsx
git commit -m "feat: add ranked voting polls with manual book transition policy"
```

### Task 9: Rule-Based Recommendations

**Files:**
- Create: `src/features/recommendations/RecommendationsPanel.tsx`
- Create: `netlify/functions/recommendations-list.ts`
- Create: `netlify/functions/_lib/recommendationEngine.ts`
- Test: `tests/functions/recommendation-engine.test.ts`
- Test: `tests/ui/recommendations-panel.test.tsx`

**Step 1: Write the failing test**

```ts
it("ranks candidate books by subject and author affinity from high ratings", () => {
  const result = recommendBooks(mockHistory, mockCandidates);
  expect(result[0].score).toBeGreaterThan(result[1].score);
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/functions/recommendation-engine.test.ts -t "ranks candidate books"`
Expected: FAIL because engine is missing.

**Step 3: Write minimal implementation**

```ts
export function recommendBooks(history: any[], candidates: any[]) {
  return candidates.map((c) => ({ ...c, score: 0 })).sort((a, b) => b.score - a.score);
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/functions/recommendation-engine.test.ts -t "ranks candidate books"`
Expected: PASS

**Step 5: Commit**

```bash
git add src/features/recommendations/RecommendationsPanel.tsx netlify/functions/recommendations-list.ts netlify/functions/_lib/recommendationEngine.ts tests/functions/recommendation-engine.test.ts tests/ui/recommendations-panel.test.tsx
git commit -m "feat: add rule-based recommendation engine and UI"
```

### Task 10: End-to-End Flow and Deployment Validation

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/club-flow.spec.ts`
- Create: `.env.example`
- Modify: `README.md`

**Step 1: Write the failing test**

```ts
test("full club flow works without external tools", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Reader Club")).toBeVisible();
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test:e2e -- tests/e2e/club-flow.spec.ts`
Expected: FAIL before Playwright setup is complete.

**Step 3: Write minimal implementation**

```md
# README
Include local setup, Netlify env vars, Google Sheets tab schema, and deployment steps.
```

**Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS

Run: `npm run test:e2e -- tests/e2e/club-flow.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add playwright.config.ts tests/e2e/club-flow.spec.ts .env.example README.md
git commit -m "test: add e2e flow and deployment documentation"
```
