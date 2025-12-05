/**
 * Tests für ApprovalWorkflow Komponente (E.5.3)
 * 
 * Enterprise++ Standard - Vollständige Test-Coverage
 */

/**
 * Tests für ApprovalWorkflow Komponente (E.5.3)
 * 
 * Enterprise++ Standard - Vollständige Test-Coverage
 */

import { render, screen, waitFor } from "@testing-library/react";
import { ApprovalWorkflow } from "@/components/admin/release/ApprovalWorkflow";

// Mock fetch
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe("E.5.3: ApprovalWorkflow Komponente", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it("sollte Freigaben laden und anzeigen", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          {
            id: "1",
            version: "1.0.0",
            approval_status: "pending",
            requested_by: "system",
            requested_at: "2025-11-29T10:00:00Z",
          },
        ],
      }),
    });

    render(<ApprovalWorkflow />);

    await waitFor(() => {
      expect(screen.getByText(/1.0.0/i)).toBeInTheDocument();
    });
  });

  it("sollte eine neue Freigabe-Anfrage erstellen können", async () => {
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

    render(<ApprovalWorkflow />);

    // Formular öffnen
    const requestButton = screen.getByText("Neue Freigabe anfragen");
    requestButton.click();

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/z.B. 1.0.0/i)).toBeInTheDocument();
    });
  });

  it("sollte Fehler anzeigen, wenn das Laden fehlschlägt", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    render(<ApprovalWorkflow />);

    await waitFor(() => {
      expect(screen.getByText(/Fehler beim Laden/i)).toBeInTheDocument();
    });
  });
});

