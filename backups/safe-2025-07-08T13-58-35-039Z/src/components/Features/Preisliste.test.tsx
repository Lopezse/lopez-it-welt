import { render, screen } from "@testing-library/react";
import Preisliste from "./Preisliste";

describe("Preisliste", () => {
  it("should render correctly", () => {
    render(<Preisliste />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("should handle user interactions", () => {
    render(<Preisliste />);
    // Add interaction tests here
  });
});
