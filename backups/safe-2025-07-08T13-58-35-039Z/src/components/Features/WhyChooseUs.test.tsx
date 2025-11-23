import { render, screen } from "@testing-library/react";
import WhyChooseUs from "./WhyChooseUs";

describe("WhyChooseUs", () => {
  it("should render correctly", () => {
    render(<WhyChooseUs />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("should handle user interactions", () => {
    render(<WhyChooseUs />);
    // Add interaction tests here
  });
});
