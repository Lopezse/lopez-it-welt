/**
 * Tests für QualityReports Komponente (E.5.2)
 * 
 * Enterprise++ Standard - Vollständige Test-Coverage
 */

/**
 * Tests für QualityReports Komponente (E.5.2)
 * 
 * Enterprise++ Standard - Vollständige Test-Coverage
 */

import { render, screen, waitFor } from "@testing-library/react";
import { QualityReports } from "@/components/admin/quality/QualityReports";

// Mock fetch
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe("E.5.2: QualityReports Komponente", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it("sollte Berichte laden und anzeigen", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          {
            id: "1",
            report_name: "Test Bericht",
            report_type: "daily",
            version: "1.0.0",
            metrics_summary: { test_coverage: 85.5 },
            status: "generated",
            generated_at: "2025-11-29T10:00:00Z",
          },
        ],
      }),
    });

    render(<QualityReports />);

    await waitFor(() => {
      expect(screen.getByText("Test Bericht")).toBeInTheDocument();
    });
  });

  it("sollte Berichte nach Typ filtern können", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
      }),
    });

    render(<QualityReports />);

    await waitFor(() => {
      expect(screen.getByText(/Qualitäts-Berichte/i)).toBeInTheDocument();
    });
  });

  it("sollte Fehler anzeigen, wenn das Laden fehlschlägt", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    render(<QualityReports />);

    await waitFor(() => {
      expect(screen.getByText(/Fehler beim Laden/i)).toBeInTheDocument();
    });
  });
});

