#!/usr/bin/env node

/**
 * freigabe-check.js
 *
 * Prüft, ob für geänderte Dateien eine Freigabe in freigaben.json vorliegt.
 * Beendet mit Exit Code 1, wenn eine Datei ohne Freigabe geändert werden soll.
 *
 * Integration: Husky Pre-Commit Hook, Anti-Regelbruch-System
 *
 * Autor: Lopez IT Welt
 * Stand: 2025-07-07
 */

const fs = require("fs");
const path = require("path");

// 1. Pfad zur Freigabe-Datei
const FREIGABEN_PATH = path.resolve(__dirname, "../freigaben.json");

// 2. Geänderte Dateien ermitteln (per Git)
function getChangedFiles() {
  try {
    // Nur staged Dateien (bereit zum Commit)
    const stdout = require("child_process").execSync("git diff --cached --name-only", {
      encoding: "utf8",
    });
    return stdout.split("\n").filter(Boolean);
  } catch (err) {
    console.error("❌ Fehler beim Ermitteln der geänderten Dateien:", err.message);
    process.exit(1);
  }
}

// 3. Freigaben laden
function loadFreigaben() {
  if (!fs.existsSync(FREIGABEN_PATH)) {
    console.error("❌ freigaben.json nicht gefunden:", FREIGABEN_PATH);
    process.exit(1);
  }
  try {
    return JSON.parse(fs.readFileSync(FREIGABEN_PATH, "utf8"));
  } catch (err) {
    console.error("❌ Fehler beim Lesen von freigaben.json:", err.message);
    process.exit(1);
  }
}

// 4. Filtere Build-Artefakte und andere irrelevante Dateien
function filterRelevantFiles(changedFiles) {
  return changedFiles.filter((file) => {
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
}

// 5. Prüfung durchführen
function checkFreigaben(changedFiles, freigaben) {
  // Baseline-Modus: einmalige Freigabe für alle Dateien
  if (freigaben.mode === "baseline" && freigaben.allow && freigaben.allow.includes("**/*")) {
    console.log("✅ Baseline-Modus aktiv: Alle Dateien freigegeben (einmalig).");
    console.log(`📋 Attestation: ${freigaben.attestation?.id || "N/A"}`);
    console.log(`👤 Approver: ${freigaben.approver?.name || "N/A"}`);
    if (freigaben.expires === "once") {
      console.log("⚠️ WARNUNG: Baseline-Modus läuft nach diesem Commit ab.");
    }
    return process.exit(0);
  }

  // Filtere Build-Artefakte
  const relevantFiles = filterRelevantFiles(changedFiles);

  // Strict-Modus: Datei-spezifische Prüfung über allow-Array
  if (freigaben.mode === "strict" && Array.isArray(freigaben.allow)) {
    let blockiert = false;
    let geprüfteDateien = 0;

    relevantFiles.forEach((file) => {
      if (!file || file.trim() === "") return;

      geprüfteDateien++;
      if (!freigaben.allow.includes(file)) {
        console.error(`🚨 Änderung BLOCKIERT: Für ${file} liegt KEINE Freigabe vor!`);
        blockiert = true;
      } else {
        console.log(`✅ Freigabe für ${file} vorhanden.`);
      }
    });

    if (blockiert) {
      process.exit(1);
    } else if (geprüfteDateien === 0) {
      console.log("⚠️ Keine relevanten Dateien geändert - prüfe ob Strict-Modus aktiv.");
      process.exit(0);
    } else {
      console.log(`✅ Alle ${geprüfteDateien} relevanten Dateien haben Freigabe.`);
      process.exit(0);
    }
    return;
  }

  // Legacy-Modus: Datei-spezifische Prüfung (alte Struktur: Dateiname als Key)
  let blockiert = false;
  let geprüfteDateien = 0;

  relevantFiles.forEach((file) => {
    if (!file || file.trim() === "") return;

    // Wenn Datei in freigaben.json vorhanden ist, prüfe den Wert
    if (freigaben.hasOwnProperty(file)) {
      geprüfteDateien++;
      if (!freigaben[file]) {
        console.error(`🚨 Änderung BLOCKIERT: Für ${file} liegt KEINE Freigabe vor!`);
        blockiert = true;
      } else {
        console.log(`✅ Freigabe für ${file} vorhanden.`);
      }
    }
  });

  if (blockiert) {
    process.exit(1);
  } else {
    if (geprüfteDateien === 0) {
      console.log(
        "⚠️ Keine relevanten Dateien in freigaben.json gefunden - prüfe ob Baseline-Modus aktiv.",
      );
    }
    process.exit(0);
  }
}

// 6. Hauptlogik
function main() {
  const changedFiles = getChangedFiles();
  const freigaben = loadFreigaben();
  checkFreigaben(changedFiles, freigaben);
}

main();
