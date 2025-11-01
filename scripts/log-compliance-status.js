#!/usr/bin/env node

/**
 * Post-Commit Compliance Logger
 * GoBD / DSGVO / ISO27001 – maschinenlesbar (JSON) + menschenlesbar (MD)
 * Non-blocking: Dieses Script darf NIEMALS den Commit verhindern.
 */

const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");
const crypto = require("node:crypto");

function sh(cmd) {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "pipe"] })
      .toString()
      .trim();
  } catch (e) {
    return "";
  }
}

function safeRead(file, def = "") {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return def;
  }
}

function sha256File(file) {
  try {
    const buf = fs.readFileSync(file);
    return crypto.createHash("sha256").update(buf).digest("hex");
  } catch {
    return null;
  }
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function nowIsoLocal() {
  const d = new Date();
  // Europe/Berlin (Server-lokal, reine ISO-Darstellung)
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Berlin";
  return d.toISOString().replace("Z", `+${tz}`);
}

(function main() {
  const commit = sh("git rev-parse HEAD") || "UNKNOWN";
  const short = sh("git rev-parse --short HEAD") || "unknown";
  const branch = sh("git rev-parse --abbrev-ref HEAD") || "unknown";
  const tagList = sh("git tag --points-at HEAD") || "";
  const tags = tagList.split("\n").filter(Boolean);

  const status = sh("git status --porcelain=v1") || "";
  // Versuche letzte Verify/Lint-Ergebnisse aus NPM-Logs (optional)
  const verifyLog = safeRead("logs/verify/last_verify.log", "");
  const lintLog = safeRead("logs/lint/last_lint.log", "");
  const testLog = safeRead("logs/test/last_test.log", "");

  // Freigabe-Konfiguration
  const freigabenPath = "freigaben.json";
  const freigabenRaw = safeRead(freigabenPath, "{}");
  let freigaben = {};
  try {
    freigaben = JSON.parse(freigabenRaw);
  } catch {
    freigaben = {};
  }
  const mode = freigaben.mode || "unknown";
  const allow = Array.isArray(freigaben.allow) ? freigaben.allow : [];

  // Liste der Dateien im Repo (HEAD)
  const filesList = sh("git ls-files") || "";
  const files = filesList.split("\n").filter(Boolean);

  // SHA256 je Datei berechnen (nur für Text/Code-Dateien sinnvoll; hier alle)
  const shaMap = {};
  for (const f of files) {
    const hash = sha256File(f);
    if (hash) shaMap[f] = hash;
  }

  const outDir = path.join("logs", "commit");
  ensureDir(outDir);

  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-"); // YYYY-MM-DD-HH-MM-SS
  const jsonPath = path.join(outDir, `${stamp}_commit-${short}.json`);
  const mdPath = path.join(outDir, `${stamp}_commit-${short}.md`);

  const payload = {
    type: "compliance-commit-log",
    created_at: nowIsoLocal(),
    commit,
    short,
    branch,
    tags,
    freigaben: {
      mode,
      allow,
    },
    git_status: status,
    verify_summary: verifyLog ? "present" : "missing",
    lint_summary: lintLog ? "present" : "missing",
    test_summary: testLog ? "present" : "missing",
    sha256: shaMap,
  };

  // JSON schreiben
  fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2) + "\n", "utf8");

  // Markdown schreiben (Kurzbericht)
  const md = [
    `# Compliance Commit Log`,
    ``,
    `**Zeitpunkt:** ${payload.created_at}`,
    `**Commit:** ${commit} (${short})`,
    `**Branch:** ${branch}`,
    `**Tags:** ${tags.join(", ") || "-"}`,
    `**Freigabe-Modus:** ${mode}`,
    `**Freigegebene Pfade (allow):** ${allow.length ? allow.join(", ") : "-"}`,
    ``,
    `## Git-Status`,
    "```",
    status || "(clean)",
    "```",
    ``,
    `## Hashes (SHA-256, Auszug bis 50 Einträge)`,
    ...Object.entries(shaMap)
      .slice(0, 50)
      .map(([f, h]) => `- ${h}  ${f}`),
    shaMap && Object.keys(shaMap).length > 50
      ? `… (${Object.keys(shaMap).length - 50} weitere)`
      : "",
    ``,
    `## Prüfläufe`,
    `- verify: ${payload.verify_summary}`,
    `- lint: ${payload.lint_summary}`,
    `- test: ${payload.test_summary}`,
    ``,
    `_Hinweis: Dieser Log ist informativ und blockiert den Commit nicht. Er dient als GoBD/DSGVO/ISO27001-Nachweis._`,
  ].join("\n");

  fs.writeFileSync(mdPath, md + "\n", "utf8");

  // Abschlussmeldung
  process.stdout.write(`[compliance-log] wrote:\n  - ${jsonPath}\n  - ${mdPath}\n`);
  process.exit(0);
})();
