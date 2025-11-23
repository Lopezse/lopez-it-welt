import fs from "node:fs";
import path from "node:path";

const exists = (p) => fs.existsSync(p);
const has = (p, s) => exists(p) && fs.readFileSync(p, "utf8").includes(s);

const report = { files: {}, api: {}, schema: {}, ui: {}, verdict: [] };

function checkFile(label, p) {
  report.files[label] = exists(p) ? "FOUND" : "MISSING";
}

checkFile("TIME_LOG.md", "TIME_LOG.md");
checkFile("data_mapping.md", "docs/07-OFFICE-MANAGEMENT/data_mapping.md");
checkFile("office_management_core.md", "docs/07-OFFICE-MANAGEMENT/office_management_core.md");
checkFile("work_sessions_schema.sql", "database/work_sessions_schema.sql");

const apiPaths = [
  "src/app/api/admin/time-tracking/sessions/route.ts",
  "src/app/api/admin/time-tracking/sessions/[id]/pause/route.ts",
  "src/app/api/admin/time-tracking/sessions/[id]/resume/route.ts",
  "src/app/api/admin/time-tracking/sessions/[id]/stop/route.ts",
  "src/app/api/admin/time-tracking/sessions/close-all/route.ts",
  "src/app/api/admin/time-tracking/stats/route.ts",
  "src/app/api/admin/time-tracking/analytics/route.ts",
  "src/app/api/admin/time-tracking/sessions/[id]/heartbeat/route.ts",
  "src/app/api/admin/time-tracking/sessions/[id]/activity/route.ts",
  "src/app/api/time/entries/route.ts",
];

for (const p of apiPaths) checkFile(p, p);

const uiPaths = [
  "src/app/admin/time-tracking/page.tsx",
  "src/lib/time-tracking-types.ts",
];

for (const p of uiPaths) checkFile(p, p);

report.api.heartbeat = exists("src/app/api/admin/time-tracking/sessions/[id]/heartbeat/route.ts");
report.api.activity = exists("src/app/api/admin/time-tracking/sessions/[id]/activity/route.ts");
report.api.entries = exists("src/app/api/time/entries/route.ts");

const schemaPath = "database/work_sessions_schema.sql";
if (exists(schemaPath)) {
  const s = fs.readFileSync(schemaPath, "utf8");
  report.schema.flags = {
    approved: /approved/i.test(s),
    invoiced: /invoiced/i.test(s),
  };
}

const uiPath = "src/app/admin/time-tracking/page.tsx";
if (exists(uiPath)) {
  const u = fs.readFileSync(uiPath, "utf8");
  report.ui.hasProject = /project_id/.test(u);
  report.ui.hasOrder = /order_id/.test(u);
  report.ui.hasTask = /task_id/.test(u);
  report.ui.hasCategory = /category/.test(u);
  report.ui.hasProblem = /problem/.test(u);
  report.ui.heartbeat = /heartbeat/i.test(u);
}

fs.mkdirSync("docs/07-OFFICE-MANAGEMENT/validation", { recursive: true });
const out = "docs/07-OFFICE-MANAGEMENT/validation/time_tracking_audit.json";
fs.writeFileSync(out, JSON.stringify(report, null, 2));
console.log("[TT-AUDIT] Wrote", out);

const missing = [];
if (!report.api.heartbeat) missing.push("API heartbeat missing");
if (!report.api.activity) missing.push("API activity missing");
if (!report.api.entries) missing.push("API time entries feed missing");
if (!report.schema.flags?.approved) missing.push("Schema flag 'approved' missing");
if (!report.schema.flags?.invoiced) missing.push("Schema flag 'invoiced' missing");
if (!report.ui.hasProject) missing.push("UI missing project selector");
if (!report.ui.hasTask) missing.push("UI missing task selector");
if (!report.ui.hasCategory) missing.push("UI missing category selector");
if (!report.ui.hasProblem) missing.push("UI missing problem flag");

const status = missing.length ? "FAIL" : "PASS";
console.log(`[TT-AUDIT] ${status}${missing.length ? ": " + missing.join("; ") : ""}`);


import path from "node:path";

const exists = (p) => fs.existsSync(p);
const has = (p, s) => exists(p) && fs.readFileSync(p, "utf8").includes(s);

const report = { files: {}, api: {}, schema: {}, ui: {}, verdict: [] };

function checkFile(label, p) {
  report.files[label] = exists(p) ? "FOUND" : "MISSING";
}

checkFile("TIME_LOG.md", "TIME_LOG.md");
checkFile("data_mapping.md", "docs/07-OFFICE-MANAGEMENT/data_mapping.md");
checkFile("office_management_core.md", "docs/07-OFFICE-MANAGEMENT/office_management_core.md");
checkFile("work_sessions_schema.sql", "database/work_sessions_schema.sql");

const apiPaths = [
  "src/app/api/admin/time-tracking/sessions/route.ts",
  "src/app/api/admin/time-tracking/sessions/[id]/pause/route.ts",
  "src/app/api/admin/time-tracking/sessions/[id]/resume/route.ts",
  "src/app/api/admin/time-tracking/sessions/[id]/stop/route.ts",
  "src/app/api/admin/time-tracking/sessions/close-all/route.ts",
  "src/app/api/admin/time-tracking/stats/route.ts",
  "src/app/api/admin/time-tracking/analytics/route.ts",
  "src/app/api/admin/time-tracking/sessions/[id]/heartbeat/route.ts",
  "src/app/api/admin/time-tracking/sessions/[id]/activity/route.ts",
  "src/app/api/time/entries/route.ts",
];

for (const p of apiPaths) checkFile(p, p);

const uiPaths = [
  "src/app/admin/time-tracking/page.tsx",
  "src/lib/time-tracking-types.ts",
];

for (const p of uiPaths) checkFile(p, p);

report.api.heartbeat = exists("src/app/api/admin/time-tracking/sessions/[id]/heartbeat/route.ts");
report.api.activity = exists("src/app/api/admin/time-tracking/sessions/[id]/activity/route.ts");
report.api.entries = exists("src/app/api/time/entries/route.ts");

const schemaPath = "database/work_sessions_schema.sql";
if (exists(schemaPath)) {
  const s = fs.readFileSync(schemaPath, "utf8");
  report.schema.flags = {
    approved: /approved/i.test(s),
    invoiced: /invoiced/i.test(s),
  };
}

const uiPath = "src/app/admin/time-tracking/page.tsx";
if (exists(uiPath)) {
  const u = fs.readFileSync(uiPath, "utf8");
  report.ui.hasProject = /project_id/.test(u);
  report.ui.hasOrder = /order_id/.test(u);
  report.ui.hasTask = /task_id/.test(u);
  report.ui.hasCategory = /category/.test(u);
  report.ui.hasProblem = /problem/.test(u);
  report.ui.heartbeat = /heartbeat/i.test(u);
}

fs.mkdirSync("docs/07-OFFICE-MANAGEMENT/validation", { recursive: true });
const out = "docs/07-OFFICE-MANAGEMENT/validation/time_tracking_audit.json";
fs.writeFileSync(out, JSON.stringify(report, null, 2));
console.log("[TT-AUDIT] Wrote", out);

const missing = [];
if (!report.api.heartbeat) missing.push("API heartbeat missing");
if (!report.api.activity) missing.push("API activity missing");
if (!report.api.entries) missing.push("API time entries feed missing");
if (!report.schema.flags?.approved) missing.push("Schema flag 'approved' missing");
if (!report.schema.flags?.invoiced) missing.push("Schema flag 'invoiced' missing");
if (!report.ui.hasProject) missing.push("UI missing project selector");
if (!report.ui.hasTask) missing.push("UI missing task selector");
if (!report.ui.hasCategory) missing.push("UI missing category selector");
if (!report.ui.hasProblem) missing.push("UI missing problem flag");

const status = missing.length ? "FAIL" : "PASS";
console.log(`[TT-AUDIT] ${status}${missing.length ? ": " + missing.join("; ") : ""}`);



















