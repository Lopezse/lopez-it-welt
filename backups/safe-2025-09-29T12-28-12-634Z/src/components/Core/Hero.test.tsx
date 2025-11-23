import { render, screen } from "@testing-library/react";
import Hero from "./Hero";

describe("Hero", () => {
  it("should render correctly", () => {
    render(<Hero />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("should handle user interactions", () => {
    render(<Hero />);
    // Add interaction tests here
  });
});
