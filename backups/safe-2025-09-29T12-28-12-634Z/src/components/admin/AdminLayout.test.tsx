import { render, screen } from "@testing-library/react";
import AdminLayout from "./AdminLayout";

// Mock der AdminSidebar und AdminTopbar Komponenten
jest.mock("./AdminSidebar", () => {
  return function MockAdminSidebar() {
    return <div data-testid="admin-sidebar">Admin Sidebar</div>;
  };
});

jest.mock("./AdminTopbar", () => {
  return function MockAdminTopbar() {
    return <div data-testid="admin-topbar">Admin Topbar</div>;
  };
});

describe("AdminLayout", () => {
  it("rendert die AdminLayout-Komponente korrekt", () => {
    render(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>,
    );

    expect(screen.getByTestId("admin-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("admin-topbar")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("rendert die Sidebar und Topbar mit korrekten Props", () => {
    render(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>,
    );

    // Überprüfe, dass die Komponenten gerendert werden
    expect(screen.getByTestId("admin-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("admin-topbar")).toBeInTheDocument();
  });

  it("hat die korrekte CSS-Klassen für das Layout", () => {
    const { container } = render(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>,
    );

    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass("min-h-screen", "bg-gray-50", "flex");
  });
});
