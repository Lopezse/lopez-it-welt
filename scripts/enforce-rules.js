#!/usr/bin/env node

/**
 * Enterprise++ Rule Enforcement System
 * Verhindert automatisch Regelverstoesse gegen QualityController.md
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Enterprise++ Konfiguration
const ENTERPRISE_CONFIG = {
  strict: true,
  autoFix: false,
  requireApproval: true,
  documentChanges: true,
  noNewMdFiles: true,
  statusTracking: true,
  enterpriseMode: true,
  zeroTolerance: true,
};

// Geschuetzte Pfade (duerfen nicht ohne Freigabe modifiziert werden)
const PROTECTED_PATHS = [
  "src/components/layout/",
  "src/app/layout.tsx",
  "tailwind.config.ts",
  "next.config.js",
  "package.json",
  "docs/pflichtenheft/",
  "STATUS.md",
  "QualityController.md",
  "START.md",
  "PROJECT.md",
];

// Pflichtdateien (muessen vor jeder Aktion geladen werden)
const REQUIRED_FILES = [
  "START.md",
  "PROJECT.md",
  "QualityController.md",
  "STATUS.md",
  "CursorGuide.md",
];

// Anpassung: Akzeptiere README.md und PROJECT.md auch in docs/ und backups/LopezITWelt_2025-07-01_14-49/
const pflichtDateien = [
  "README.md",
  "PROJECT.md",
  "docs/README.md",
  "docs/PROJECT.md",
  "backups/LopezITWelt_2025-07-01_14-49/PROJECT.md",
  "backups/LopezITWelt_2025-07-01_14-49/README.md",
];

class EnterpriseRuleEnforcement {
  constructor() {
    this.violations = [];
    this.corrections = [];
    this.projectRoot = process.cwd();
    this.currentDate = new Date();
    this.currentDateString = this.currentDate.toISOString().split("T")[0];
    this.currentDateGerman = this.currentDate.toLocaleDateString("de-DE");
  }

  async enforceAllRules() {
    console.log("🛡️  ENTERPRISE++ REGEL-DURCHSETZUNG STARTET...\n");

    try {
      // 1. Pflichtdateien prüfen
      await this.checkRequiredFiles();

      // 2. Datumsvalidierung
      await this.validateDates();

      // 3. Struktur-Integrität prüfen
      await this.checkStructureIntegrity();

      // 4. Zeiterfassung prüfen
      await this.checkTimeTracking();

      // 5. Bericht generieren
      this.generateReport();

      // 6. Bei Verstößen: Aktion blockieren
      if (this.violations.length > 0) {
        console.error("\n❌ REGELVERSTÖSSE GEFUNDEN - AKTION BLOCKIERT!");
        console.error("Bitte beheben Sie alle Verstöße vor der Fortsetzung.");
        process.exit(1);
      }
    } catch (error) {
      console.error("❌ Regel-Durchsetzung fehlgeschlagen:", error.message);
      process.exit(1);
    }
  }

  async checkRequiredFiles() {
    console.log("📋 Prüfe Pflichtdateien...");

    let fehlende = [];
    pflichtDateien.forEach((datei) => {
      if (!fs.existsSync(path.resolve(process.cwd(), datei))) {
        fehlende.push(datei);
      }
    });
    if (fehlende.length === pflichtDateien.length) {
      console.error(
        "❌ Keine Pflichtdatei gefunden (README.md oder PROJECT.md in erlaubten Pfaden)",
      );
      return false;
    }
    return true;
  }

  async validateDates() {
    console.log("📅 Prüfe Datumsvalidierung...");

    const mdFiles = [
      "README.md",
      "PROJECT.md",
      "STATUS.md",
      "planungs.md",
      "AUFTRAG_FUER_MORGEN.md",
    ];

    for (const file of mdFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        await this.validateFileDates(file, filePath);
      }
    }
  }

  async validateFileDates(filename, filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const issues = [];

      // Prüfe auf falsche Datumsformate
      const wrongDatePatterns = [/27\.06\.2025/g, /2025-06-27/g, /2025\/06\/27/g];

      wrongDatePatterns.forEach((pattern) => {
        const matches = content.match(pattern);
        if (matches) {
          issues.push(`Falsches Datum: ${matches[0]}`);
        }
      });

      // Prüfe auf veraltete Datumsangaben
      const dateMatches = content.match(/(\d{2}\.\d{2}\.\d{4})/g);
      if (dateMatches) {
        dateMatches.forEach((dateStr) => {
          const dateParts = dateStr.split(".");
          const fileDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
          const daysDiff = Math.floor((this.currentDate - fileDate) / (1000 * 60 * 60 * 24));

          if (daysDiff > 1) {
            issues.push(`Veraltetes Datum: ${dateStr} (${daysDiff} Tage alt)`);
          }
        });
      }

      if (issues.length > 0) {
        console.log(`  ❌ ${filename}: ${issues.length} Datumsprobleme`);
        issues.forEach((issue) => {
          console.log(`    - ${issue}`);
          this.violations.push(`${filename}: ${issue}`);
        });
      } else {
        console.log(`  ✅ ${filename}: Datum korrekt`);
      }
    } catch (error) {
      console.log(`  ⚠️  ${filename}: Konnte nicht geprüft werden`);
    }
  }

  async checkStructureIntegrity() {
    console.log("🏗️  Prüfe Struktur-Integrität...");

    // Prüfe auf neue .md-Dateien (nicht erlaubt)
    const allowedMdFiles = [
      "README.md",
      "PROJECT.md",
      "STATUS.md",
      "planungs.md",
      "AUFTRAG_FUER_MORGEN.md",
      "QualityController.md",
    ];

    const allMdFiles = fs.readdirSync(this.projectRoot).filter((file) => file.endsWith(".md"));

    const unauthorizedFiles = allMdFiles.filter((file) => !allowedMdFiles.includes(file));

    if (unauthorizedFiles.length > 0) {
      unauthorizedFiles.forEach((file) => {
        this.violations.push(`Nicht autorisierte .md-Datei: ${file}`);
        console.log(`  ❌ ${file}: Nicht autorisiert`);
      });
    } else {
      console.log("  ✅ Alle .md-Dateien autorisiert");
    }

    // Prüfe auf leere .md-Dateien
    for (const file of allowedMdFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf8");
        if (content.trim().length === 0) {
          this.violations.push(`Leere .md-Datei: ${file}`);
          console.log(`  ❌ ${file}: Leer`);
        }
      }
    }
  }

  async checkTimeTracking() {
    console.log("⏱️  Prüfe Zeiterfassung...");

    // Prüfe auf überlappende Sessions
    const sessionsFile = path.join(this.projectRoot, "data", "time-sessions.json");
    if (fs.existsSync(sessionsFile)) {
      try {
        const content = fs.readFileSync(sessionsFile, "utf8");
        const sessions = JSON.parse(content);

        const activeSessions = sessions.filter(
          (session) => session.status === "active" && !session.end_time,
        );

        if (activeSessions.length > 1) {
          this.violations.push(`Überlappende Sessions: ${activeSessions.length} aktive Sessions`);
          console.log(`  ❌ ${activeSessions.length} überlappende Sessions`);
        } else if (activeSessions.length === 1) {
          console.log("  ✅ 1 aktive Session");
        } else {
          console.log("  ✅ Keine aktiven Sessions");
        }
      } catch (error) {
        console.log("  ⚠️  Sessions-Datei: Konnte nicht geprüft werden");
      }
    }
  }

  generateReport() {
    console.log("\n📊 REGEL-DURCHSETZUNG BERICHT:");
    console.log("================================");

    if (this.violations.length === 0) {
      console.log("✅ Alle Regeln eingehalten!");
      console.log("🚀 Aktion kann fortgesetzt werden.");
    } else {
      console.log(`❌ ${this.violations.length} Regelverstöße gefunden:`);
      this.violations.forEach((violation, index) => {
        console.log(`  ${index + 1}. ${violation}`);
      });
      console.log("\n🔧 KORREKTUR ERFORDERLICH:");
      console.log("   - Bitte beheben Sie alle Regelverstöße");
      console.log("   - Führen Sie die Prüfung erneut aus");
    }

    console.log("\n📋 PRÜFUNGS-DETAILS:");
    console.log(`   - Geprüfte Dateien: ${this.getCheckedFilesCount()}`);
    console.log(`   - Aktuelles Datum: ${this.currentDateGerman}`);
    console.log(`   - Zeitstempel: ${this.currentDate.toISOString()}`);
  }

  getCheckedFilesCount() {
    const mdFiles = [
      "README.md",
      "PROJECT.md",
      "STATUS.md",
      "planungs.md",
      "AUFTRAG_FUER_MORGEN.md",
      "QualityController.md",
    ];
    let count = 0;
    mdFiles.forEach((file) => {
      if (fs.existsSync(path.join(this.projectRoot, file))) count++;
    });
    return count;
  }
}

// Hauptfunktion
async function main() {
  const enforcer = new EnterpriseRuleEnforcement();
  await enforcer.enforceAllRules();
}

// Ausführung
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Kritischer Fehler:", error.message);
    process.exit(1);
  });
}

module.exports = { EnterpriseRuleEnforcement };
