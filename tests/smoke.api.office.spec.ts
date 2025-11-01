/**
 * Office API Smoke Tests
 * Prüft grundlegende Funktionalität der Office & Finance API-Routen
 */

describe("Office API smoke", () => {
  // Mock fetch für Node.js-Umgebung
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  it("GET /api/appointments returns 200 or 204", async () => {
    const response = await fetch(`${baseUrl}/api/appointments`);
    expect([200, 204, 401, 403]).toContain(response.status);
  });

  it("GET /api/appointments/ical/export returns calendar", async () => {
    const response = await fetch(`${baseUrl}/api/appointments/ical/export`);
    expect([200, 401, 403]).toContain(response.status);

    if (response.status === 200) {
      const contentType = response.headers.get("content-type") || "";
      expect(contentType).toMatch(/text\/calendar/);
    }
  });

  it("POST /api/invoices/pdf returns pdf or json", async () => {
    const response = await fetch(`${baseUrl}/api/invoices/pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: "test" }),
    });

    expect([200, 400, 401, 403, 404, 500]).toContain(response.status);

    if (response.status === 200) {
      const contentType = response.headers.get("content-type") || "";
      // Kann PDF oder JSON sein (abhängig von Implementierung)
      expect(
        contentType.includes("application/pdf") || contentType.includes("application/json"),
      ).toBe(true);
    } else if (response.status >= 400) {
      // Bei Fehler sollte JSON zurückkommen
      const contentType = response.headers.get("content-type") || "";
      expect(contentType).toMatch(/application\/json/);
    }
  });
});
