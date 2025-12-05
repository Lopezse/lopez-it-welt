/**
 * Tests für Qualitäts-Metriken (E.5.2)
 * 
 * Enterprise++ Standard - Vollständige Test-Coverage
 */

/**
 * Tests für Qualitäts-Metriken (E.5.2)
 * 
 * Enterprise++ Standard - Vollständige Test-Coverage
 */

describe("E.5.2: Qualitäts-Metriken", () => {
  describe("API: /api/admin/quality/metrics", () => {
    it("sollte alle Qualitäts-Metriken abrufen können", async () => {
      const response = await fetch("http://localhost:3000/api/admin/quality/metrics");
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it("sollte Metriken nach Kategorie filtern können", async () => {
      const response = await fetch(
        "http://localhost:3000/api/admin/quality/metrics?category=code",
      );
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it("sollte eine neue Metrik erstellen können", async () => {
      const newMetric = {
        metric_name: "test_coverage",
        metric_value: 85.5,
        metric_unit: "%",
        target_value: 80.0,
        category: "test",
        version: "1.0.0",
      };

      const response = await fetch("http://localhost:3000/api/admin/quality/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMetric),
      });

      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
    });

    it("sollte Metriken nach Version filtern können", async () => {
      const response = await fetch(
        "http://localhost:3000/api/admin/quality/metrics?version=1.0.0",
      );
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });
  });
});

