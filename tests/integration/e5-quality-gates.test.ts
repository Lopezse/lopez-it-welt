/**
 * Integration-Tests für E.5: Testing & Quality Gates
 * 
 * Enterprise++ Standard - Vollständige Integration-Tests
 */

describe("E.5: Integration Tests - Quality Gates", () => {
  describe("Pre-Release Checkliste Workflow", () => {
    it("sollte einen vollständigen Checkliste-Workflow durchführen können", async () => {
      // 1. Checkliste erstellen
      const createResponse = await fetch("http://localhost:3000/api/admin/release/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checklist_name: "Integration Test Checkliste",
          version: "1.0.0",
          items: [
            {
              id: "item-1",
              title: "Test Item 1",
              description: "Test Beschreibung",
              checked: false,
              required: true,
            },
          ],
        }),
      });

      expect(createResponse.status).toBe(200);
      const createResult = await createResponse.json();
      expect(createResult.success).toBe(true);
      const checklistId = createResult.data.id;

      // 2. Checkliste abrufen
      const getResponse = await fetch(
        `http://localhost:3000/api/admin/release/checklist/${checklistId}`,
      );
      expect(getResponse.status).toBe(200);
      const getResult = await getResponse.json();
      expect(getResult.success).toBe(true);
      expect(getResult.data.id).toBe(checklistId);

      // 3. Checkliste aktualisieren (Status auf completed)
      const updateResponse = await fetch("http://localhost:3000/api/admin/release/checklist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: checklistId,
          status: "completed",
        }),
      });

      expect(updateResponse.status).toBe(200);
      const updateResult = await updateResponse.json();
      expect(updateResult.success).toBe(true);

      // 4. Cleanup: Checkliste löschen
      const deleteResponse = await fetch(
        `http://localhost:3000/api/admin/release/checklist/${checklistId}`,
        {
          method: "DELETE",
        },
      );

      expect(deleteResponse.status).toBe(200);
    });
  });

  describe("Versions-Freigabe Workflow", () => {
    it("sollte einen vollständigen Freigabe-Workflow durchführen können", async () => {
      // 1. Freigabe-Anfrage erstellen
      const createResponse = await fetch("http://localhost:3000/api/admin/release/approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: "1.0.0",
          notes: "Integration Test Freigabe",
        }),
      });

      expect(createResponse.status).toBe(200);
      const createResult = await createResponse.json();
      expect(createResult.success).toBe(true);
      expect(createResult.data).toHaveProperty("id");

      // 2. Freigabe abrufen
      const getResponse = await fetch("http://localhost:3000/api/admin/release/approval");
      expect(getResponse.status).toBe(200);
      const getResult = await getResponse.json();
      expect(getResult.success).toBe(true);
      expect(Array.isArray(getResult.data)).toBe(true);
    });
  });

  describe("Qualitäts-Metriken Workflow", () => {
    it("sollte Metriken erstellen und abrufen können", async () => {
      // 1. Metrik erstellen
      const createResponse = await fetch("http://localhost:3000/api/admin/quality/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metric_name: "integration_test_coverage",
          metric_value: 85.5,
          metric_unit: "%",
          target_value: 80.0,
          category: "test",
          version: "1.0.0",
        }),
      });

      expect(createResponse.status).toBe(200);
      const createResult = await createResponse.json();
      expect(createResult.success).toBe(true);

      // 2. Metriken abrufen
      const getResponse = await fetch("http://localhost:3000/api/admin/quality/metrics");
      expect(getResponse.status).toBe(200);
      const getResult = await getResponse.json();
      expect(getResult.success).toBe(true);
      expect(Array.isArray(getResult.data)).toBe(true);
    });
  });

  describe("Qualitäts-Berichte Workflow", () => {
    it("sollte Berichte erstellen und abrufen können", async () => {
      // 1. Bericht erstellen
      const createResponse = await fetch("http://localhost:3000/api/admin/quality/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_name: "Integration Test Bericht",
          report_type: "custom",
          version: "1.0.0",
          metrics_summary: {
            test_coverage: 85.5,
            lint_errors: 0,
          },
        }),
      });

      expect(createResponse.status).toBe(200);
      const createResult = await createResponse.json();
      expect(createResult.success).toBe(true);
      expect(createResult.data).toHaveProperty("id");

      // 2. Berichte abrufen
      const getResponse = await fetch("http://localhost:3000/api/admin/quality/reports");
      expect(getResponse.status).toBe(200);
      const getResult = await getResponse.json();
      expect(getResult.success).toBe(true);
      expect(Array.isArray(getResult.data)).toBe(true);
    });
  });
});


