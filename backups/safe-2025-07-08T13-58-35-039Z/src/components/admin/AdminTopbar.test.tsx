import { fireEvent, render, screen } from "@testing-library/react";
import AdminTopbar from "./AdminTopbar";

describe("AdminTopbar", () => {
  const mockProps = {
    sidebarCollapsed: false,
    onToggleSidebar: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rendert die AdminTopbar-Komponente korrekt", () => {
    render(<AdminTopbar {...mockProps} />);

    expect(screen.getByPlaceholderText("Suchen...")).toBeInTheDocument();
    expect(screen.getByText("🇩🇪 DE")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("ruft onToggleSidebar auf, wenn der Menü-Button geklickt wird", () => {
    render(<AdminTopbar {...mockProps} />);

    const menuButton = screen.getByTitle("Menü umschalten");
    fireEvent.click(menuButton);

    expect(mockProps.onToggleSidebar).toHaveBeenCalledTimes(1);
  });

  it("aktualisiert den Suchwert korrekt", () => {
    render(<AdminTopbar {...mockProps} />);

    const searchInput = screen.getByPlaceholderText("Suchen...");
    fireEvent.change(searchInput, { target: { value: "test search" } });

    expect(searchInput).toHaveValue("test search");
  });

  it("zeigt die Benachrichtigungsanzahl korrekt an", () => {
    render(<AdminTopbar {...mockProps} />);

    // Überprüfe, dass die Benachrichtigungsanzahl angezeigt wird
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("hat die korrekte CSS-Klassen für das Layout", () => {
    const { container } = render(<AdminTopbar {...mockProps} />);

    const header = container.querySelector("header");
    expect(header).toHaveClass("bg-white", "border-b", "border-gray-200");
  });
});
