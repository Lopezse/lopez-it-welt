#!/usr/bin/env node

/**
 * 🛡️ Anti-Regelbruch-System Status Checker
 * Zeigt den aktuellen Status des Systems an
 *
 * @author Ramiro Lopez Rodriguez
 * @version 1.0.0
 * @date 2025-01-19
 */

const fs = require("fs");
const path = require("path");

/**
 * 📊 Status anzeigen
 */
function showStatus() {
  console.log("🛡️ ANTI-REGELBRUCH-SYSTEM STATUS CHECK");
  console.log("=======================================");

  // Daemon-Status prüfen
  const daemonStatusFile = path.join(__dirname, "../data/anti-rule-break-daemon-status.json");
  const normalStatusFile = path.join(__dirname, "../data/anti-rule-break-status.json");

  let status = null;
  let statusType = "";

  if (fs.existsSync(daemonStatusFile)) {
    status = JSON.parse(fs.readFileSync(daemonStatusFile, "utf8"));
    statusType = "DAEMON";
  } else if (fs.existsSync(normalStatusFile)) {
    status = JSON.parse(fs.readFileSync(normalStatusFile, "utf8"));
    statusType = "NORMAL";
  }

  if (status) {
    console.log(`📋 Status-Typ: ${statusType}`);
    console.log(`✅ Anti-Regelbruch-System: ${status.antiRuleBreakActive ? "AKTIV" : "INAKTIV"}`);
    console.log(`✅ Agenten: ${status.agentsActive ? "AKTIV" : "INAKTIV"}`);
    console.log(
      `✅ Enterprise-Regeln: ${status.enterpriseRulesLoaded ? "GELADEN" : "NICHT GELADEN"}`,
    );
    console.log(`✅ Monitoring: ${status.monitoringActive ? "AKTIV" : "INAKTIV"}`);
    console.log(`✅ Cursor-Integration: ${status.cursorIntegrationActive ? "AKTIV" : "INAKTIV"}`);

    if (status.daemonRunning !== undefined) {
      console.log(`✅ Daemon-Modus: ${status.daemonRunning ? "AKTIV" : "INAKTIV"}`);
    }

    console.log(`✅ Startup: ${status.startupComplete ? "ABGESCHLOSSEN" : "LAUFEND"}`);
    console.log(`⏰ Startup-Zeit: ${status.startupTime}`);
    console.log(`❌ Fehler: ${status.errorCount}`);
    console.log(`🚨 Regelverstöße: ${status.violationCount}`);
    console.log(`⏰ Letzte Prüfung: ${status.lastSaved}`);

    if (status.violations && status.violations.length > 0) {
      console.log("\n🚨 LETZTE REGELVERSTÖSSE:");
      status.violations.slice(-5).forEach((violation, index) => {
        console.log(
          `   ${index + 1}. ${violation.filename} - ${violation.reason} (${violation.timestamp})`,
        );
      });
    }
  } else {
    console.log("❌ Kein Status gefunden");
    console.log("💡 Tipp: Starten Sie das System mit: node scripts/anti-rule-break-daemon.js");
  }

  console.log("=======================================");

  // Prozess-Status prüfen
  console.log("\n🔄 PROZESS-STATUS:");
  console.log("==================");

  const { exec } = require("child_process");
  exec('tasklist /FI "IMAGENAME eq node.exe" /FO CSV', (error, stdout, stderr) => {
    if (error) {
      console.log("❌ Fehler beim Prüfen der Prozesse");
      return;
    }

    const lines = stdout.split("\n");
    const nodeProcesses = lines.filter((line) => line.includes("node.exe")).length;

    console.log(`✅ Node.js Prozesse: ${nodeProcesses} aktiv`);

    if (nodeProcesses > 0) {
      console.log("✅ Anti-Regelbruch-System läuft wahrscheinlich im Hintergrund");
    } else {
      console.log("❌ Keine Node.js Prozesse gefunden");
      console.log("💡 Tipp: Starten Sie das System mit: node scripts/anti-rule-break-daemon.js");
    }
  });
}

// 🚀 Status anzeigen
if (require.main === module) {
  showStatus();
}

module.exports = {
  showStatus,
};
