/**
 * Tests für Pre-Release Checklisten (E.5.1)
 * 
 * Enterprise++ Standard - Vollständige Test-Coverage
 */

/**
 * Tests für Pre-Release Checklisten (E.5.1)
 * 
 * Enterprise++ Standard - Vollständige Test-Coverage
 */

describe("E.5.1: Pre-Release Checklisten", () => {
  describe("API: /api/admin/release/checklist", () => {
    it("sollte alle Checklisten abrufen können", async () => {
      const response = await fetch("http://localhost:3000/api/admin/release/checklist");
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it("sollte eine neue Checkliste erstellen können", async () => {
      const newChecklist = {
        checklist_name: "Test Checkliste",
        version: "1.0.0",
        items: [
          {
            id: "item-1",
            title: "Test Item",
            description: "Test Beschreibung",
            checked: false,
            required: true,
          },
        ],
      };

      const response = await fetch("http://localhost:3000/api/admin/release/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newChecklist),
      });

      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty("id");
    });

    it("sollte eine Checkliste aktualisieren können", async () => {
      // Zuerst eine Checkliste erstellen
      const createResponse = await fetch("http://localhost:3000/api/admin/release/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checklist_name: "Test Checkliste Update",
          version: "1.0.0",
          items: [],
        }),
      });

      const createResult = await createResponse.json();
      const checklistId = createResult.data.id;

      // Dann aktualisieren
      const updateResponse = await fetch("http://localhost:3000/api/admin/release/checklist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: checklistId,
          status: "completed",
        }),
      });

      const updateResult = await updateResponse.json();

      expect(updateResponse.status).toBe(200);
      expect(updateResult.success).toBe(true);
    });

    it("sollte eine Checkliste löschen können", async () => {
      // Zuerst eine Checkliste erstellen
      const createResponse = await fetch("http://localhost:3000/api/admin/release/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checklist_name: "Test Checkliste Delete",
          version: "1.0.0",
          items: [],
        }),
      });

      const createResult = await createResponse.json();
      const checklistId = createResult.data.id;

      // Dann löschen
      const deleteResponse = await fetch(
        `http://localhost:3000/api/admin/release/checklist/${checklistId}`,
        {
          method: "DELETE",
        },
      );

      const deleteResult = await deleteResponse.json();

      expect(deleteResponse.status).toBe(200);
      expect(deleteResult.success).toBe(true);
    });

    it("sollte eine spezifische Checkliste abrufen können", async () => {
      // Zuerst eine Checkliste erstellen
      const createResponse = await fetch("http://localhost:3000/api/admin/release/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checklist_name: "Test Checkliste Get",
          version: "1.0.0",
          items: [],
        }),
      });

      const createResult = await createResponse.json();
      const checklistId = createResult.data.id;

      // Dann abrufen
      const getResponse = await fetch(
        `http://localhost:3000/api/admin/release/checklist/${checklistId}`,
      );

      const getResult = await getResponse.json();

      expect(getResponse.status).toBe(200);
      expect(getResult.success).toBe(true);
      expect(getResult.data).toHaveProperty("id", checklistId);
    });
  });
});

