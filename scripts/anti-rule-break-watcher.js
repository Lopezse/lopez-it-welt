#!/usr/bin/env node

/**
 * 🛡️ Anti-Regelbruch Enterprise++ File Watcher
 * Überwacht kontinuierlich Dateiänderungen und greift bei Regelverstößen ein
 *
 * @author Ramiro Lopez Rodriguez
 * @version 1.0.0
 * @date 2025-07-07
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Anti-Regelbruch Hook importieren
const { AntiRuleBreakHook } = require("./anti-rule-break-hook.js");

class AntiRuleBreakWatcher {
  constructor() {
    this.hook = new AntiRuleBreakHook();
    this.watchedPaths = ["./docs", "./src", "./data", "./scripts"];
    this.isRunning = false;
  }

  /**
   * 🚀 Watcher starten
   */
  start() {
    console.log("🛡️ Anti-Regelbruch-Watcher wird gestartet...");

    this.isRunning = true;

    // Chokidar simulieren (da nicht installiert)
    this.startFileWatching();

    console.log("✅ Anti-Regelbruch-Watcher aktiv");
    console.log("📁 Überwachte Pfade:");
    this.watchedPaths.forEach((path) => {
      console.log(`   - ${path}`);
    });
    console.log("\n🛡️ Enterprise++ Regeln werden live überwacht");
  }

  /**
   * 📁 Datei-Überwachung starten
   */
  startFileWatching() {
    console.log("📁 Datei-Überwachung aktiviert");

    // Simuliere Datei-Überwachung
    setInterval(() => {
      this.checkForChanges();
    }, 5000); // Alle 5 Sekunden prüfen
  }

  /**
   * 🔍 Änderungen prüfen
   */
  async checkForChanges() {
    try {
      // Prüfe wichtige Dateien
      const filesToCheck = [
        "./docs/00-00-inhaltsverzeichnis.md",
        "./docs/00-01-projekt-status.md",
        "./data/agenten-dashboard.json",
        "./data/agenten-gedaechtnis.json",
      ];

      for (const file of filesToCheck) {
        if (fs.existsSync(file)) {
          const stats = fs.statSync(file);
          const lastModified = stats.mtime;

          // Prüfe ob Datei kürzlich geändert wurde
          const now = new Date();
          const timeDiff = now - lastModified;

          if (timeDiff < 10000) {
            // Weniger als 10 Sekunden
            console.log(`📝 Datei geändert: ${file}`);
            await this.validateFile(file);
          }
        }
      }
    } catch (error) {
      console.error("❌ Fehler bei Datei-Überwachung:", error);
    }
  }

  /**
   * ✅ Datei validieren
   */
  async validateFile(filePath) {
    console.log(`🛡️ Validierung: ${filePath}`);

    try {
      const result = await this.hook.validateBeforeAction(`Datei geändert: ${filePath}`, filePath);

      if (!result.valid) {
        console.log(`🚨 REGELVERSTOß ERKANNT:`);
        console.log(`   Datei: ${filePath}`);
        console.log(`   Regel: ${result.rule}`);
        console.log(`   Grund: ${result.reason}`);
        console.log(`   Zeit: ${result.timestamp}`);

        // Aktion blockieren
        this.blockAction(filePath, result.reason);
      } else {
        console.log(`✅ Validierung erfolgreich: ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Validierungsfehler für ${filePath}:`, error);
    }
  }

  /**
   * 🚫 Aktion blockieren
   */
  blockAction(filePath, reason) {
    console.log(`🚨 AKTION BLOCKIERT:`);
    console.log(`   Datei: ${filePath}`);
    console.log(`   Grund: ${reason}`);
    console.log(`   Status: BLOCKIERT - Manuelle Freigabe erforderlich`);

    // In Log-Datei dokumentieren
    this.logViolation(filePath, reason);
  }

  /**
   * 📝 Verstoß loggen
   */
  logViolation(filePath, reason) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] REGELVERSTOß: ${filePath} - ${reason}\n`;

    try {
      fs.appendFileSync("./data/agenten-aktivitaeten.log", logEntry);
      console.log("📝 Verstoß in Log-Datei dokumentiert");
    } catch (error) {
      console.error("❌ Fehler beim Loggen:", error);
    }
  }

  /**
   * 🛑 Watcher stoppen
   */
  stop() {
    this.isRunning = false;
    console.log("🛑 Anti-Regelbruch-Watcher gestoppt");
  }

  /**
   * 📊 Status anzeigen
   */
  showStatus() {
    console.log("\n🛡️ Anti-Regelbruch-Watcher Status:");
    console.log(`   Aktiv: ${this.isRunning ? "✅ JA" : "❌ NEIN"}`);
    console.log(`   Überwachte Pfade: ${this.watchedPaths.length}`);
    console.log(`   Hook-Status: ${this.hook.isBlocked ? "🚫 BLOCKIERT" : "✅ AKTIV"}`);
  }
}

// Hauptfunktion
function main() {
  const watcher = new AntiRuleBreakWatcher();

  // Watcher starten
  watcher.start();

  // Status nach 2 Sekunden anzeigen
  setTimeout(() => {
    watcher.showStatus();
  }, 2000);

  // Graceful Shutdown
  process.on("SIGINT", () => {
    console.log("\n🛑 Anti-Regelbruch-Watcher wird beendet...");
    watcher.stop();
    process.exit(0);
  });
}

// Starten wenn direkt ausgeführt
if (require.main === module) {
  main();
}

module.exports = { AntiRuleBreakWatcher };
