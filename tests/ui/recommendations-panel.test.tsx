import { render, screen } from "@testing-library/react";
import { RecommendationsPanel } from "../../src/features/recommendations/RecommendationsPanel";

it("renders recommendations", () => {
  render(<RecommendationsPanel rows={[{ bookId: "b1", score: 3 }]} />);
  expect(screen.getByText("b1 (3)")).toBeInTheDocument();
});
