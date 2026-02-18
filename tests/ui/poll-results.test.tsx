import { render, screen } from "@testing-library/react";
import { PollResults } from "../../src/features/polls/PollResults";

it("shows poll output and manual transition policy", () => {
  render(
    <PollResults
      result={{ pollId: "p1", rows: [{ bookId: "b1", points: 10, rank: 1 }] }}
      books={[{ id: "b1", title: "Dune", author: "Frank", status: "want_to_read", proposedByMemberId: "m1", proposedAt: "2026-01-01" }]}
    />
  );

  expect(screen.getByText(/never move books automatically/)).toBeInTheDocument();
});
