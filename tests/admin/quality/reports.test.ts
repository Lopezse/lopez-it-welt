/**
 * Tests für Qualitäts-Berichte (E.5.2)
 * 
 * Enterprise++ Standard - Vollständige Test-Coverage
 */

/**
 * Tests für Qualitäts-Berichte (E.5.2)
 * 
 * Enterprise++ Standard - Vollständige Test-Coverage
 */

describe("E.5.2: Qualitäts-Berichte", () => {
  describe("API: /api/admin/quality/reports", () => {
    it("sollte alle Qualitäts-Berichte abrufen können", async () => {
      const response = await fetch("http://localhost:3000/api/admin/quality/reports");
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it("sollte Berichte nach Typ filtern können", async () => {
      const response = await fetch(
        "http://localhost:3000/api/admin/quality/reports?report_type=daily",
      );
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it("sollte einen neuen Bericht erstellen können", async () => {
      const newReport = {
        report_name: "Test Bericht",
        report_type: "custom",
        version: "1.0.0",
        metrics_summary: {
          test_coverage: 85.5,
          lint_errors: 0,
        },
      };

      const response = await fetch("http://localhost:3000/api/admin/quality/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReport),
      });

      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty("id");
    });

    it("sollte Berichte nach Version filtern können", async () => {
      const response = await fetch(
        "http://localhost:3000/api/admin/quality/reports?version=1.0.0",
      );
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });
  });
});

