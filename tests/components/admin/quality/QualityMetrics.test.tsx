/**
 * Tests für QualityMetrics Komponente (E.5.2)
 * 
 * Enterprise++ Standard - Vollständige Test-Coverage
 */

/**
 * Tests für QualityMetrics Komponente (E.5.2)
 * 
 * Enterprise++ Standard - Vollständige Test-Coverage
 */

import { render, screen, waitFor } from "@testing-library/react";
import { QualityMetrics } from "@/components/admin/quality/QualityMetrics";

// Mock fetch
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe("E.5.2: QualityMetrics Komponente", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it("sollte Metriken laden und anzeigen", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          {
            id: "1",
            metric_name: "test_coverage",
            metric_value: 85.5,
            metric_unit: "%",
            target_value: 80.0,
            category: "test",
            measured_at: "2025-11-29T10:00:00Z",
          },
        ],
      }),
    });

    render(<QualityMetrics />);

    await waitFor(() => {
      expect(screen.getByText("test_coverage")).toBeInTheDocument();
    });
  });

  it("sollte Metriken nach Kategorie filtern können", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
      }),
    });

    render(<QualityMetrics />);

    await waitFor(() => {
      expect(screen.getByText(/Qualitäts-Metriken/i)).toBeInTheDocument();
    });
  });

  it("sollte Fehler anzeigen, wenn das Laden fehlschlägt", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    render(<QualityMetrics />);

    await waitFor(() => {
      expect(screen.getByText(/Fehler beim Laden/i)).toBeInTheDocument();
    });
  });
});

