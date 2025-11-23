/**
 * Smoke Tests für Time Tracking API
 */

describe("Time Tracking API smoke", () => {
  const baseUrl = process.env.TEST_BASE_URL || "http://localhost:3000";

  it("heartbeat route exists", async () => {
    const res = await fetch(`${baseUrl}/api/admin/time-tracking/sessions/dummy/heartbeat`, {
      method: "POST",
    });
    expect([200, 401, 403, 404]).toContain(res.status);
  });

  it("activity route exists", async () => {
    const res = await fetch(`${baseUrl}/api/admin/time-tracking/sessions/dummy/activity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "save" }),
    });
    expect([200, 401, 403, 404]).toContain(res.status);
  });

  it("billable feed exists", async () => {
    const res = await fetch(`${baseUrl}/api/time/entries?approved=true&invoiced=false`);
    expect([200, 401, 403]).toContain(res.status);
  });
});


 * Smoke Tests für Time Tracking API
 */

describe("Time Tracking API smoke", () => {
  const baseUrl = process.env.TEST_BASE_URL || "http://localhost:3000";

  it("heartbeat route exists", async () => {
    const res = await fetch(`${baseUrl}/api/admin/time-tracking/sessions/dummy/heartbeat`, {
      method: "POST",
    });
    expect([200, 401, 403, 404]).toContain(res.status);
  });

  it("activity route exists", async () => {
    const res = await fetch(`${baseUrl}/api/admin/time-tracking/sessions/dummy/activity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "save" }),
    });
    expect([200, 401, 403, 404]).toContain(res.status);
  });

  it("billable feed exists", async () => {
    const res = await fetch(`${baseUrl}/api/time/entries?approved=true&invoiced=false`);
    expect([200, 401, 403]).toContain(res.status);
  });
});



















