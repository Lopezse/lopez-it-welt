#!/usr/bin/env node

/**
 * 🛡️ Anti-Regelbruch Enterprise++ Modul - Node.js Hook
 * Verhindert systematisch alle Regelverstöße in Node.js-Projekten
 *
 * @author Ramiro Lopez Rodriguez
 * @version 1.0.0
 * @date 2025-06-30
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Enterprise++ Anti-Regelbruch Konfiguration
const ANTI_RULE_BREAK_CONFIG = {
  strictMode: true,
  zeroTolerance: true,
  autoBlock: true,
  requireApproval: true,
  validateBeforeAction: true,
  validateAfterAction: true,
  blockOnViolation: true,
  requireSystemTime: true,
  blockDateCopying: true,
  validateTimestamps: true,
  preventOverwriting: true,
  requireAppendOnly: true,
  protectMdStructure: true,
  enforceTimeTracking: true,
  requireSessionSwitch: true,
  blockOverlappingSessions: true,
};

// Geschützte Regeln
const PROTECTED_RULES = [
  "Datumsvalidierung",
  "Zeiterfassung",
  "Md-Struktur",
  "Enterprise++ Standards",
  "Freigabe-Erfordernis",
  "System-Zeit-Verwendung",
];

// Globale Variablen
let isBlocked = false;
let violationCount = 0;
let lastViolation = "";
let approvalGiven = false;
let blockedActions = [];

/**
 * 🛡️ Anti-Regelbruch Enterprise++ System Klasse
 */
class AntiRuleBreakHook {
  constructor() {
    this.config = ANTI_RULE_BREAK_CONFIG;
    this.isBlocked = false;
    this.violationCount = 0;
    this.lastViolation = "";
    this.approvalGiven = false;
    this.blockedActions = [];
  }

  /**
   * 🚨 Hauptvalidierung vor jeder Aktion
   */
  async validateBeforeAction(action, targetFile = null) {
    console.log("🛡️ Anti-Regelbruch-System: Validierung läuft...");

    const timestamp = new Date().toISOString();

    // 1. System-Zeit validieren
    const timeValidation = await this.validateSystemTime();
    if (!timeValidation.valid) {
      this.blockAction("System-Zeit nicht validiert", timeValidation.reason);
      return {
        valid: false,
        reason: timeValidation.reason,
        timestamp,
        rule: "System-Zeit",
      };
    }

    // 2. Datumskopieren blockieren
    const dateValidation = await this.validateNoDateCopying(action);
    if (!dateValidation.valid) {
      this.blockAction("Datumskopieren blockiert", dateValidation.reason);
      return {
        valid: false,
        reason: dateValidation.reason,
        timestamp,
        rule: "Datumsvalidierung",
      };
    }

    // 3. Struktur-Schutz prüfen
    if (targetFile && this.isMdFile(targetFile)) {
      const structureValidation = await this.validateMdStructure(targetFile);
      if (!structureValidation.valid) {
        this.blockAction("Md-Struktur-Schutz", structureValidation.reason);
        return {
          valid: false,
          reason: structureValidation.reason,
          timestamp,
          rule: "Md-Struktur",
        };
      }
    }

    // 4. Freigabe prüfen
    if (!this.approvalGiven && this.config.requireApproval) {
      this.blockAction("Keine Freigabe vorhanden", action);
      return {
        valid: false,
        reason: "Keine Freigabe vorhanden",
        timestamp,
        rule: "Freigabe-Erfordernis",
      };
    }

    // 5. Zeiterfassung prüfen
    const timeTrackingValidation = await this.validateTimeTracking(action);
    if (!timeTrackingValidation.valid) {
      this.blockAction("Zeiterfassung nicht gewechselt", timeTrackingValidation.reason);
      return {
        valid: false,
        reason: timeTrackingValidation.reason,
        timestamp,
        rule: "Zeiterfassung",
      };
    }

    console.log("✅ Anti-Regelbruch-Validierung erfolgreich");
    return { valid: true, timestamp };
  }

  /**
   * ⏰ System-Zeit validieren
   */
  async validateSystemTime() {
    try {
      const currentTime = new Date();
      const timestamp = currentTime.toISOString();

      // Prüfen ob Zeit plausibel ist (nicht in der Vergangenheit)
      const minValidDate = new Date("2025-01-01");
      if (currentTime < minValidDate) {
        return {
          valid: false,
          reason: "System-Zeit ist in der Vergangenheit",
          timestamp,
        };
      }

      return { valid: true, timestamp };
    } catch (error) {
      return {
        valid: false,
        reason: "System-Zeit-Abfrage fehlgeschlagen",
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 📅 Datumskopieren blockieren
   */
  async validateNoDateCopying(action) {
    const blockedDates = [
      "2025-01-19",
      "29.07.2025",
      "27.06.2025",
      "2025-06-27",
      "2025-01-19T",
      "29.07.2025T",
    ];

    const timestamp = new Date().toISOString();

    for (const blockedDate of blockedDates) {
      if (action.includes(blockedDate)) {
        return {
          valid: false,
          reason: `Datumskopieren erkannt: ${blockedDate}`,
          timestamp,
        };
      }
    }

    return { valid: true, timestamp };
  }

  /**
   * 📄 Md-Struktur schützen
   */
  async validateMdStructure(targetFile) {
    const timestamp = new Date().toISOString();

    // Prüfen ob es sich um eine .md-Datei handelt
    if (!this.isMdFile(targetFile)) {
      return { valid: true, timestamp };
    }

    // Hier könnte weitere Validierung der Md-Struktur erfolgen
    // z.B. Prüfung auf Überschreibungen statt Ergänzungen

    return { valid: true, timestamp };
  }

  /**
   * ⏱️ Zeiterfassung validieren
   */
  async validateTimeTracking(action) {
    const timestamp = new Date().toISOString();

    // Hier könnte Validierung der Zeiterfassung erfolgen
    // z.B. Prüfung auf Session-Wechsel bei Themenwechsel

    return { valid: true, timestamp };
  }

  /**
   * 🚫 Aktion blockieren
   */
  blockAction(rule, reason) {
    this.violationCount++;
    this.lastViolation = `${rule}: ${reason}`;
    this.isBlocked = true;

    const violation = {
      timestamp: new Date().toISOString(),
      rule: rule,
      reason: reason,
      action: "BLOCKIERT",
    };

    this.blockedActions.push(violation);

    console.log(`🚨 ANTI-REGELBRUCH: AKTION BLOCKIERT`);
    console.log(`   Regel: ${rule}`);
    console.log(`   Grund: ${reason}`);
    console.log(`   Verstoß #${this.violationCount}`);
    console.log(`   Status: BLOCKIERT - Freigabe erforderlich`);

    // In STATUS.md dokumentieren
    this.documentViolation(rule, reason);
  }

  /**
   * 📝 Verstoß dokumentieren
   */
  async documentViolation(rule, reason) {
    const timestamp = new Date().toISOString();
    const violationEntry = `
## 🚨 **ANTI-REGELBRUCH: AKTION BLOCKIERT (${timestamp})**
- **Regel:** ${rule}
- **Grund:** ${reason}
- **Verstoß #:** ${this.violationCount}
- **Status:** ❌ BLOCKIERT - Freigabe erforderlich
- **System:** Anti-Regelbruch-System aktiviert

`;

    try {
      let statusContent = "";
      if (fs.existsSync("STATUS.md")) {
        statusContent = fs.readFileSync("STATUS.md", "utf8");
      }

      // Verstoß am Anfang einfügen
      const updatedContent = violationEntry + statusContent;
      fs.writeFileSync("STATUS.md", updatedContent);

      console.log("📝 Verstoß in STATUS.md dokumentiert");
    } catch (error) {
      console.error("❌ Fehler beim Dokumentieren des Verstoßes:", error);
    }
  }

  /**
   * ✅ Freigabe erteilen
   */
  grantApproval() {
    this.approvalGiven = true;
    this.isBlocked = false;
    console.log("✅ Anti-Regelbruch-Freigabe erteilt");
  }

  /**
   * 🔄 Freigabe zurückziehen
   */
  revokeApproval() {
    this.approvalGiven = false;
    this.isBlocked = true;
    console.log("🚫 Anti-Regelbruch-Freigabe zurückgezogen");
  }

  /**
   * 📊 Status anzeigen
   */
  showStatus() {
    console.log("\n🛡️ Anti-Regelbruch-System Status:");
    console.log(`   Blockiert: ${this.isBlocked ? "❌ JA" : "✅ NEIN"}`);
    console.log(`   Freigabe: ${this.approvalGiven ? "✅ ERTEILT" : "❌ NICHT ERTEILT"}`);
    console.log(`   Verstöße: ${this.violationCount}`);
    console.log(`   Letzter Verstoß: ${this.lastViolation || "Keine"}`);
    console.log(`   Blockierte Aktionen: ${this.blockedActions.length}`);
  }

  /**
   * 🔧 Konfiguration aktualisieren
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log("🔧 Anti-Regelbruch-Konfiguration aktualisiert");
  }

  /**
   * 📋 Md-Datei prüfen
   */
  isMdFile(filename) {
    return filename.endsWith(".md") || filename.endsWith(".MD");
  }

  /**
   * 🧹 Verstöße zurücksetzen
   */
  resetViolations() {
    this.violationCount = 0;
    this.lastViolation = "";
    this.blockedActions = [];
    this.isBlocked = false;
    console.log("🧹 Anti-Regelbruch-Verstöße zurückgesetzt");
  }
}

// Pre-commit Hook Funktion
async function preCommitHook() {
  console.log("🛡️ Anti-Regelbruch Pre-Commit Hook läuft...");

  const hook = new AntiRuleBreakHook();

  // Prüfe alle geänderten Dateien
  try {
    // Lade freigaben.json für Approval-Check
    const FREIGABEN_PATH = path.resolve(__dirname, "../freigaben.json");
    let freigaben = {};
    if (fs.existsSync(FREIGABEN_PATH)) {
      try {
        freigaben = JSON.parse(fs.readFileSync(FREIGABEN_PATH, "utf8"));
      } catch (err) {
        console.warn("⚠️ Fehler beim Laden von freigaben.json:", err.message);
      }
    }

    // Ermittle geänderte Dateien (für beide Modi benötigt)
    const changedFiles = execSync("git diff --cached --name-only", {
      encoding: "utf8",
    })
      .split("\n")
      .filter((file) => file.trim());

    // Baseline-Modus: einmalige Freigabe für alle Dateien
    if (freigaben.mode === "baseline" && freigaben.allow && freigaben.allow.includes("**/*")) {
      console.log("✅ Baseline-Modus aktiv: Alle Dateien freigegeben (einmalig).");
      console.log(`📋 Attestation: ${freigaben.attestation?.id || "N/A"}`);
      hook.grantApproval();
      // Nach diesem Commit wird Baseline-Modus ablaufen
      if (freigaben.expires === "once") {
        console.log("⚠️ WARNUNG: Baseline-Modus läuft nach diesem Commit ab.");
      }
    } else {
      // Normaler Modus: Filtere nur relevante Dateien (Markdown, Config, etc.) - ignoriere Build-Artefakte
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
          (file.endsWith(".json") && file.includes("/.next/"))
        ) {
          return false;
        }
        return true;
      });

      // Prüfe ob alle relevanten Dateien in freigaben.json freigegeben sind
      // Unterstütze sowohl neue Struktur (allow Array) als auch alte Struktur (Dateiname als Key)
      let allApproved = false;
      if (freigaben.mode === "strict" && Array.isArray(freigaben.allow)) {
        // Neue Struktur: allow Array
        allApproved = relevantFiles.every((file) => {
          return freigaben.allow.includes(file);
        });
      } else {
        // Legacy-Struktur: Dateiname als Key
        allApproved = relevantFiles.every((file) => {
          return freigaben[file] === true;
        });
      }

      // Wenn alle relevanten Dateien freigegeben sind, setze approvalGiven Flag VOR Validierung
      if (allApproved && relevantFiles.length > 0) {
        hook.grantApproval();
        console.log("✅ Alle relevanten Dateien haben Freigabe in freigaben.json");
      } else if (relevantFiles.length > 0) {
        // Finde fehlende Freigaben nur bei relevanten Dateien
        let missingApprovals = [];
        if (freigaben.mode === "strict" && Array.isArray(freigaben.allow)) {
          // Neue Struktur: allow Array
          missingApprovals = relevantFiles.filter((file) => {
            return !freigaben.allow.includes(file);
          });
        } else {
          // Legacy-Struktur: Dateiname als Key
          missingApprovals = relevantFiles.filter((file) => {
            return freigaben[file] !== true;
          });
        }
        if (missingApprovals.length > 0) {
          console.error(`❌ Fehlende Freigaben für: ${missingApprovals.join(", ")}`);
          process.exit(1);
        }
      } else {
        // Keine relevanten Dateien geändert, aber Hook läuft weiter
        hook.grantApproval();
      }
    }

    for (const file of changedFiles) {
      if (hook.isMdFile(file)) {
        const validation = await hook.validateBeforeAction(`Änderung in ${file}`, file);
        if (!validation || !validation.valid) {
          console.error(
            `❌ Pre-Commit Hook blockiert: ${validation?.reason || "Unbekannter Fehler"}`,
          );
          process.exit(1);
        }
      }
    }

    console.log("✅ Pre-Commit Hook erfolgreich");
  } catch (error) {
    console.error("❌ Pre-Commit Hook Fehler:", error.message);
    process.exit(1);
  }
}

// Post-commit Hook Funktion
function postCommitHook() {
  console.log("🛡️ Anti-Regelbruch Post-Commit Hook läuft...");

  const hook = new AntiRuleBreakHook();

  // Dokumentiere Commit in STATUS.md
  try {
    const commitHash = execSync("git rev-parse HEAD", {
      encoding: "utf8",
    }).trim();
    const commitMessage = execSync("git log -1 --pretty=%B", {
      encoding: "utf8",
    }).trim();

    const commitEntry = `
## ✅ **COMMIT DOKUMENTIERT (${new Date().toISOString()})**
- **Commit Hash:** ${commitHash}
- **Message:** ${commitMessage}
- **Status:** ✅ Erfolgreich
- **Anti-Regelbruch:** ✅ Validierung bestanden

`;

    if (fs.existsSync("STATUS.md")) {
      const statusContent = fs.readFileSync("STATUS.md", "utf8");
      const updatedContent = commitEntry + statusContent;
      fs.writeFileSync("STATUS.md", updatedContent);
    }

    console.log("✅ Post-Commit Hook erfolgreich");
  } catch (error) {
    console.error("❌ Post-Commit Hook Fehler:", error.message);
  }
}

// Export für Verwendung in anderen Modulen
module.exports = {
  AntiRuleBreakHook,
  preCommitHook,
  postCommitHook,
  ANTI_RULE_BREAK_CONFIG,
  PROTECTED_RULES,
};

// Hauptfunktion für Kommandozeilen-Aufruf
if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case "pre-commit":
      preCommitHook().catch((error) => {
        console.error("❌ Pre-Commit Hook Fehler:", error);
        process.exit(1);
      });
      break;
    case "post-commit":
      postCommitHook();
      break;
    case "validate":
      const action = process.argv[3] || "test";
      const targetFile = process.argv[4];
      const hook = new AntiRuleBreakHook();
      hook.validateBeforeAction(action, targetFile);
      break;
    default:
      console.log("🛡️ Anti-Regelbruch Enterprise++ Modul - Node.js Hook");
      console.log("Verwendung:");
      console.log("  node anti-rule-break-hook.js pre-commit    - Pre-Commit Hook");
      console.log("  node anti-rule-break-hook.js post-commit   - Post-Commit Hook");
      console.log("  node anti-rule-break-hook.js validate <action> [file] - Validierung");
  }
}
