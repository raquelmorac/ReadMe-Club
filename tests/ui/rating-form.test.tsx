import { fireEvent, render, screen } from "@testing-library/react";
import { RatingForm } from "../../src/features/ratings/RatingForm";

it("submits selected rating", async () => {
  let score = 0;
  render(<RatingForm onSubmit={async (value) => { score = value; }} />);

  fireEvent.change(screen.getByLabelText("Score"), { target: { value: "5" } });
  fireEvent.submit(screen.getByRole("button", { name: "Save rating" }));

  expect(score).toBe(5);
});
