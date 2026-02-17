import { render, screen } from "@testing-library/react";
import { App } from "../../src/App";

it("renders Reader Club title", () => {
  render(<App />);
  expect(screen.getByText("Reader Club")).toBeInTheDocument();
});
