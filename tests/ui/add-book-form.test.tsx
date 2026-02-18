import { act, fireEvent, render, screen } from "@testing-library/react";
import { AddBookForm } from "../../src/features/books/AddBookForm";

it("submits title and proposer", async () => {
  let submitted = false;
  render(
    <AddBookForm
      proposedByMemberId="m1"
      onSubmit={async (payload) => {
        submitted = payload.proposedByMemberId === "m1";
      }}
    />
  );

  await act(async () => {
    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Dune" } });
    fireEvent.change(screen.getByLabelText("Author"), { target: { value: "Frank Herbert" } });
    fireEvent.submit(screen.getByRole("button", { name: "Add" }));
  });

  expect(submitted).toBe(true);
});
