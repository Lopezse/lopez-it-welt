import { render, screen } from "@testing-library/react";
import Layout from "./Layout";

describe("Layout", () => {
  it("should render correctly", () => {
    render(<Layout />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("should handle user interactions", () => {
    render(<Layout />);
    // Add interaction tests here
  });
});
