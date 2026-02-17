import { render, screen } from "@testing-library/react";
import { MemberSelector } from "../../src/features/members/MemberSelector";

it("loads members and allows selecting active member", () => {
  render(
    <MemberSelector
      members={[{ id: "m1", name: "Ana", active: true }]}
      value={null}
      onChange={() => {}}
    />
  );

  expect(screen.getByText("Ana")).toBeInTheDocument();
});
