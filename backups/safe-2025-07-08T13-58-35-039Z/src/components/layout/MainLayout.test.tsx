import { render, screen } from "@testing-library/react";
import MainLayout from "./MainLayout";

describe("MainLayout", () => {
  it("should render correctly", () => {
    render(<MainLayout />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("should handle user interactions", () => {
    render(<MainLayout />);
    // Add interaction tests here
  });
});
