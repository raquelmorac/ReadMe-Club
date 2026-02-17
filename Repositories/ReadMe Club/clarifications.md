# Reader Club App - Clarifications

Please answer each question inline under `Your answer:` so I can produce the design.

## 1) MVP Scope
Which scope should the first version target?

- Option A (Recommended): Members + book lists (`Want to read`, `Current`, `Read`) + weekly sessions + ratings/comments. No AI/recommendation automation yet.
- Option B: Option A + internet book info lookup + basic recommendations.
- Option C: Full vision including AI session/page planning and advanced recommendations in v1.

Your answer: A

## 2) Users and Access
Who will use this app and how should access work?

- Option A (Recommended): Private app for one club with simple shared login.
- Option B: Multiple member accounts with individual login.
- Option C: Public browsing + authenticated member actions.

Your answer: B. No authentication needed but selecting the member would be enough 

## 3) Platform
Where should this run first?

- Option A (Recommended): Responsive web app (desktop + mobile browser).
- Option B: Desktop-first web app.
- Option C: Mobile-first web app.

Your answer: A

## 4) Data Persistence
How should data be stored in the first version?

- Option A (Recommended): Local database for persistent storage.
- Option B: Flat files/JSON storage for quick prototype.
- Option C: Cloud database from day one.

Your answer: Storage using Google Sheets & Netlify for web

## 5) Book Metadata Source
When a new book is added, where should extra info come from?

- Option A (Recommended): Open Library API first, fallback manual edits.
- Option B: Google Books API.
- Option C: Manual entry only for v1.

Your answer: A

## 6) Recommendations
What recommendation depth do you want initially?

- Option A (Recommended): Rule-based suggestions (genres/authors/ratings overlap).
- Option B: API-assisted suggestions from external provider.
- Option C: Placeholder recommendations section only in v1.

Your answer: A

## 7) Session Planning Logic
For weekly sessions, how should pages-per-session be suggested?

- Option A (Recommended): Deterministic heuristic based on total pages and target completion date.
- Option B: AI-generated suggestion plus editable default.
- Option C: Manual only in v1.

Your answer: A, based on number of weeks/sessions, not completion date and editable

## 8) Ratings Rules
Should members be able to rate only books marked as `Read`?

- Option A (Recommended): Yes, only once book is in `Read`.
- Option B: Allow rating at any stage.
- Option C: Allow rating only after member marks personal completion.

Your answer: A

## 9) Comment Moderation
How should optional comments be handled?

- Option A (Recommended): No moderation; editable/deletable by author.
- Option B: Admin can edit/remove any comment.
- Option C: Comments read-only after submit.

Your answer: A

## 10) Weekly Session Constraints
What constraints matter for scheduling?

- Option A (Recommended): One weekly session per club; fixed weekday/time.
- Option B: Flexible schedule with exceptions/skip weeks.
- Option C: Multiple sessions per week.

Your answer: A. Sessions use to happen on Friday at 1pm.

## 11) Notifications
Do you want reminders in v1?

- Option A (Recommended): No notifications in v1.
- Option B: Email reminders for upcoming session.
- Option C: In-app reminders only.

Your answer: A

## 12) Import/Export
Do you need data portability in v1?

- Option A (Recommended): No import/export in v1.
- Option B: CSV export only.
- Option C: CSV import + export.

Your answer: A

## 13) Non-Functional Priorities
Pick top priorities (choose up to 3):

- Simplicity
- Fast delivery
- Clean UX
- Scalability
- Low hosting cost
- Strong privacy

Your answer: Low hosting cost, Simplicity, Clean UX

## 14) Success Criteria
How will you define v1 success after launch (first 4-8 weeks)?

- Option A (Recommended): Club can run full reading cycle without external tools.
- Option B: Active weekly usage by all members.
- Option C: Accurate recommendations and planning quality.

Your answer: A

