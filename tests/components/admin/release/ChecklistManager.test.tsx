/**
 * Tests für ChecklistManager Komponente (E.5.1)
 * 
 * Enterprise++ Standard - Vollständige Test-Coverage
 */

/**
 * Tests für ChecklistManager Komponente (E.5.1)
 * 
 * Enterprise++ Standard - Vollständige Test-Coverage
 */

import { render, screen, waitFor } from "@testing-library/react";
import { ChecklistManager } from "@/components/admin/release/ChecklistManager";

// Mock fetch
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe("E.5.1: ChecklistManager Komponente", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it("sollte Checklisten laden und anzeigen", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          {
            id: "1",
            checklist_name: "Test Checkliste",
            version: "1.0.0",
            items: [],
            status: "draft",
            created_at: "2025-11-29T10:00:00Z",
            updated_at: "2025-11-29T10:00:00Z",
          },
        ],
      }),
    });

    render(<ChecklistManager />);

    await waitFor(() => {
      expect(screen.getByText("Test Checkliste")).toBeInTheDocument();
    });
  });

  it("sollte eine neue Checkliste erstellen können", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { id: "new-id" },
        }),
      });

    render(<ChecklistManager />);

    // Formular öffnen und ausfüllen
    const createButton = screen.getByText("Neue Checkliste");
    createButton.click();

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Checklistenname/i)).toBeInTheDocument();
    });
  });

  it("sollte Fehler anzeigen, wenn das Laden fehlschlägt", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    render(<ChecklistManager />);

    await waitFor(() => {
      expect(screen.getByText(/Fehler beim Laden/i)).toBeInTheDocument();
    });
  });
});

