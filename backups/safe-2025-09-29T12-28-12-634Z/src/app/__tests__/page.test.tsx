import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // Matcher wie toBeInTheDocument
import Home from "../page";

describe("Home Page", () => {
  it("renders the main heading", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders the service sections", () => {
    render(<Home />);
    // Tests an deutsche Übersetzungen anpassen
    expect(screen.getByText(/IT-Support/i)).toBeInTheDocument();
    expect(screen.getByText(/PC-Bau & Einrichtung/i)).toBeInTheDocument();
    expect(screen.getByText(/Webdesign & Automatisierung/i)).toBeInTheDocument();
  });
});
