import { render, screen } from "@testing-library/react";
import { CurrentBookView } from "../../src/features/current/CurrentBookView";

it("shows next session and past sessions for current book", () => {
  render(
    <CurrentBookView
      book={{ id: "b1", title: "Dune", author: "Frank Herbert", status: "current", proposedByMemberId: "m1", proposedAt: "2026-01-01" }}
      sessions={[
        { id: "s1", bookId: "b1", sessionDateTime: "2025-01-10T13:00:00.000Z", pageStart: 1, pageEnd: 20 },
        { id: "s2", bookId: "b1", sessionDateTime: "2027-01-10T13:00:00.000Z", pageStart: 21, pageEnd: 40 }
      ]}
    />
  );

  expect(screen.getByText("Next session")).toBeInTheDocument();
  expect(screen.getByText("Past sessions")).toBeInTheDocument();
});
