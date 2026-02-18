import { render, screen } from "@testing-library/react";
import { SetCurrentAction } from "../../src/features/books/SetCurrentAction";

it("renders explicit current-book guard message", () => {
  render(
    <SetCurrentAction
      bookId="b2"
      disabled={false}
      onSetCurrent={async () => {}}
      errorMessage="Cannot move this book to Current because another Current book already exists. Move the current book out first."
    />
  );

  expect(screen.getByText(/Cannot move this book to Current/)).toBeInTheDocument();
});
