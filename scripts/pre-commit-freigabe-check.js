const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const FREIGABEN_PATH = path.resolve(__dirname, "../freigaben.json");
const changedFiles = execSync("git diff --cached --name-only", {
  encoding: "utf8",
})
  .split("\n")
  .filter(Boolean);

const now = new Date();
console.log(`🛡️ Enterprise++ Regeln werden live überwacht – ${now.toLocaleString()}`);

if (!fs.existsSync(FREIGABEN_PATH)) {
  console.error("❌ Freigaben-Datei fehlt!");
  process.exit(1);
}
const freigaben = JSON.parse(fs.readFileSync(FREIGABEN_PATH, "utf8"));

// Baseline-Modus: einmalige Freigabe für alle Dateien
if (freigaben.mode === "baseline" && freigaben.allow && freigaben.allow.includes("**/*")) {
  console.log("✅ Baseline-Modus aktiv: Alle Dateien freigegeben (einmalig).");
  console.log(`📋 Attestation: ${freigaben.attestation?.id || "N/A"}`);
  if (freigaben.expires === "once") {
    console.log("⚠️ WARNUNG: Baseline-Modus läuft nach diesem Commit ab.");
  }
  process.exit(0);
}

// Filtere Build-Artefakte und andere irrelevante Dateien
const relevantFiles = changedFiles.filter((file) => {
  if (!file || file.trim() === "") return false;
  // Ignoriere .next/, backups/, coverage/, node_modules/, etc.
  if (
    file.startsWith(".next/") ||
    file.startsWith("backups/") ||
    file.startsWith("coverage/") ||
    file.startsWith("node_modules/") ||
    file.includes(".pack.gz") ||
    file.includes(".hot-update.") ||
    file.endsWith(".log") ||
    file.endsWith(".lock") ||
    file.endsWith(".tsbuildinfo") ||
    (file.endsWith(".json") && file.includes("/.next/"))
  ) {
    return false;
  }
  return true;
});

// Normaler Modus: Datei-spezifische Prüfung
// Unterstütze sowohl neue Struktur (allow Array) als auch alte Struktur (Dateiname als Key)
let blockiert = false;
relevantFiles.forEach((file) => {
  let isApproved = false;
  if (freigaben.mode === "strict" && Array.isArray(freigaben.allow)) {
    // Neue Struktur: allow Array
    isApproved = freigaben.allow.includes(file);
  } else {
    // Legacy-Struktur: Dateiname als Key
    isApproved = freigaben[file] === true;
  }

  if (!isApproved) {
    console.error(`❌ Commit blockiert: Keine Freigabe für ${file}`);
    blockiert = true;
  }
});

if (blockiert) process.exit(1);
if (relevantFiles.length > 0) {
  console.log(`✅ Alle ${relevantFiles.length} relevanten Dateien haben Freigabe.`);
}
process.exit(0);

    file.endsWith(".lock") ||
    file.endsWith(".tsbuildinfo") ||
    (file.endsWith(".json") && file.includes("/.next/"))
  ) {
    return false;
  }
  return true;
});

// Normaler Modus: Datei-spezifische Prüfung
// Unterstütze sowohl neue Struktur (allow Array) als auch alte Struktur (Dateiname als Key)
let blockiert = false;
relevantFiles.forEach((file) => {
  let isApproved = false;
  if (freigaben.mode === "strict" && Array.isArray(freigaben.allow)) {
    // Neue Struktur: allow Array
    isApproved = freigaben.allow.includes(file);
  } else {
    // Legacy-Struktur: Dateiname als Key
    isApproved = freigaben[file] === true;
  }

  if (!isApproved) {
    console.error(`❌ Commit blockiert: Keine Freigabe für ${file}`);
    blockiert = true;
  }
});

if (blockiert) process.exit(1);
if (relevantFiles.length > 0) {
  console.log(`✅ Alle ${relevantFiles.length} relevanten Dateien haben Freigabe.`);
}
process.exit(0);
