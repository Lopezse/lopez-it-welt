/**
 * Tests für Versions-Freigaben (E.5.3)
 * 
 * Enterprise++ Standard - Vollständige Test-Coverage
 */

/**
 * Tests für Versions-Freigaben (E.5.3)
 * 
 * Enterprise++ Standard - Vollständige Test-Coverage
 */

describe("E.5.3: Versions-Freigaben", () => {
  describe("API: /api/admin/release/approval", () => {
    it("sollte alle Versions-Freigaben abrufen können", async () => {
      const response = await fetch("http://localhost:3000/api/admin/release/approval");
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it("sollte eine neue Freigabe-Anfrage erstellen können", async () => {
      const newApproval = {
        version: "1.0.0",
        checklist_id: null,
        notes: "Test Freigabe-Anfrage",
      };

      const response = await fetch("http://localhost:3000/api/admin/release/approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newApproval),
      });

      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty("id");
    });

    it("sollte eine Freigabe genehmigen können", async () => {
      // Zuerst eine Freigabe-Anfrage erstellen
      const createResponse = await fetch("http://localhost:3000/api/admin/release/approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: "1.0.0",
          notes: "Test Genehmigung",
        }),
      });

      const createResult = await createResponse.json();
      const approvalId = createResult.data.id;

      // Dann genehmigen
      const approveResponse = await fetch("http://localhost:3000/api/admin/release/approval", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: approvalId,
          approval_status: "approved",
        }),
      });

      const approveResult = await approveResponse.json();

      expect(approveResponse.status).toBe(200);
      expect(approveResult.success).toBe(true);
    });

    it("sollte eine Freigabe ablehnen können", async () => {
      // Zuerst eine Freigabe-Anfrage erstellen
      const createResponse = await fetch("http://localhost:3000/api/admin/release/approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: "1.0.0",
          notes: "Test Ablehnung",
        }),
      });

      const createResult = await createResponse.json();
      const approvalId = createResult.data.id;

      // Dann ablehnen
      const rejectResponse = await fetch("http://localhost:3000/api/admin/release/approval", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: approvalId,
          approval_status: "rejected",
          rejection_reason: "Test Ablehnungsgrund",
        }),
      });

      const rejectResult = await rejectResponse.json();

      expect(rejectResponse.status).toBe(200);
      expect(rejectResult.success).toBe(true);
    });

    it("sollte Freigaben nach Status filtern können", async () => {
      const response = await fetch(
        "http://localhost:3000/api/admin/release/approval?approval_status=pending",
      );
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });
  });
});

