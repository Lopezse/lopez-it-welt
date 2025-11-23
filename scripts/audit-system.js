const fs = require("fs");
const path = require("path");

class AuditSystem {
  constructor() {
    this.projectRoot = process.cwd();
    this.auditLog = [];
    this.auditFile = path.join(this.projectRoot, "audit-trail.json");
    this.loadAuditLog();
  }

  // Audit-Log laden
  loadAuditLog() {
    try {
      if (fs.existsSync(this.auditFile)) {
        const content = fs.readFileSync(this.auditFile, "utf8");
        this.auditLog = JSON.parse(content);
      }
    } catch (error) {
      console.warn("Fehler beim Laden des Audit-Logs:", error.message);
      this.auditLog = [];
    }
  }

  // Audit-Log speichern
  saveAuditLog() {
    try {
      fs.writeFileSync(this.auditFile, JSON.stringify(this.auditLog, null, 2));
    } catch (error) {
      console.error("Fehler beim Speichern des Audit-Logs:", error.message);
    }
  }

  // Neuen Audit-Eintrag hinzufügen
  logEvent(event) {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      event: event.type,
      details: event.details,
      user: event.user || "system",
      severity: event.severity || "info",
      file: event.file || null,
      changes: event.changes || null,
    };

    this.auditLog.push(auditEntry);
    this.saveAuditLog();

    // Console-Ausgabe für wichtige Events
    if (auditEntry.severity === "error" || auditEntry.severity === "warning") {
      const icon = auditEntry.severity === "error" ? "❌" : "⚠️";
      console.log(`${icon} [AUDIT] ${auditEntry.event}: ${auditEntry.details}`);
    }
  }

  // Dateiänderungen überwachen
  watchFileChanges() {
    console.log("👁️ Starte Dateiüberwachung...");

    const watchDirs = ["src", "components", "app", "scripts"];

    watchDirs.forEach((dir) => {
      const dirPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        fs.watch(dirPath, { recursive: true }, (eventType, filename) => {
          if (filename) {
            this.logEvent({
              type: "file_change",
              details: `${eventType}: ${filename}`,
              file: path.join(dir, filename),
              severity: "info",
            });
          }
        });
      }
    });
  }

  // Code-Qualitäts-Audit
  async auditCodeQuality() {
    console.log("🔍 Starte Code-Qualitäts-Audit...");

    const sourceFiles = this.getSourceFiles();
    const qualityIssues = [];

    for (const file of sourceFiles) {
      try {
        const content = fs.readFileSync(file, "utf8");
        const issues = this.analyzeFileQuality(file, content);
        qualityIssues.push(...issues);
      } catch (error) {
        qualityIssues.push({
          file: file,
          issue: "Fehler beim Lesen der Datei",
          severity: "error",
          details: error.message,
        });
      }
    }

    // Audit-Eintrag für Code-Qualität
    this.logEvent({
      type: "code_quality_audit",
      details: `${qualityIssues.length} Qualitätsprobleme gefunden`,
      severity: qualityIssues.length > 0 ? "warning" : "info",
      changes: qualityIssues,
    });

    return qualityIssues;
  }

  // Einzelne Datei analysieren
  analyzeFileQuality(filePath, content) {
    const issues = [];
    const lines = content.split("\n");

    // Dateigröße prüfen
    if (content.length > 10000) {
      issues.push({
        file: filePath,
        issue: "Datei zu groß",
        severity: "warning",
        details: `${content.length} Zeichen`,
      });
    }

    // Zeilenlänge prüfen
    lines.forEach((line, index) => {
      if (line.length > 120) {
        issues.push({
          file: filePath,
          issue: "Zeile zu lang",
          severity: "info",
          details: `Zeile ${index + 1}: ${line.length} Zeichen`,
        });
      }
    });

    // Verbotene Patterns prüfen
    const forbiddenPatterns = [
      { pattern: /console\.log\(/, message: "Console.log gefunden" },
      { pattern: /debugger;/, message: "Debugger-Statement gefunden" },
      { pattern: /TODO:/, message: "TODO-Kommentar gefunden" },
      { pattern: /FIXME:/, message: "FIXME-Kommentar gefunden" },
    ];

    forbiddenPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(content)) {
        issues.push({
          file: filePath,
          issue: message,
          severity: "warning",
          details: "Sollte vor Produktion entfernt werden",
        });
      }
    });

    return issues;
  }

  // i18n-Audit
  async auditI18n() {
    console.log("🌍 Starte i18n-Audit...");

    const i18nDir = path.join(this.projectRoot, "src/i18n/locales");
    const issues = [];

    if (!fs.existsSync(i18nDir)) {
      issues.push({
        file: "src/i18n/locales",
        issue: "i18n-Verzeichnis fehlt",
        severity: "error",
        details: "Erforderliches Verzeichnis für Übersetzungen",
      });
    } else {
      const requiredLanguages = ["de", "en", "es"];

      for (const lang of requiredLanguages) {
        const langFile = path.join(i18nDir, `${lang}.json`);

        if (!fs.existsSync(langFile)) {
          issues.push({
            file: langFile,
            issue: `Sprachdatei fehlt: ${lang}`,
            severity: "error",
            details: "Erforderliche Sprachdatei",
          });
        } else {
          try {
            const content = JSON.parse(fs.readFileSync(langFile, "utf8"));
            const keyCount = this.countKeys(content);

            issues.push({
              file: langFile,
              issue: `Sprachdatei ${lang} analysiert`,
              severity: "info",
              details: `${keyCount} Übersetzungsschlüssel gefunden`,
            });
          } catch (error) {
            issues.push({
              file: langFile,
              issue: `Fehler beim Parsen der Sprachdatei ${lang}`,
              severity: "error",
              details: error.message,
            });
          }
        }
      }
    }

    // Audit-Eintrag für i18n
    this.logEvent({
      type: "i18n_audit",
      details: `${issues.length} i18n-Probleme gefunden`,
      severity: issues.some((i) => i.severity === "error") ? "error" : "info",
      changes: issues,
    });

    return issues;
  }

  // Schlüssel in JSON-Objekt zählen
  countKeys(obj, prefix = "") {
    let count = 0;

    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === "object" && obj[key] !== null) {
        count += this.countKeys(obj[key], fullKey);
      } else {
        count++;
      }
    }

    return count;
  }

  // Quellcode-Dateien finden
  getSourceFiles() {
    const sourceDirs = ["src", "components", "app"];
    const extensions = [".ts", ".tsx", ".js", ".jsx"];
    const files = [];

    for (const dir of sourceDirs) {
      const dirPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        this.scanDirectory(dirPath, extensions, files);
      }
    }

    return files;
  }

  // Verzeichnis rekursiv scannen
  scanDirectory(dir, extensions, files) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        this.scanDirectory(itemPath, extensions, files);
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (extensions.includes(ext)) {
          files.push(itemPath);
        }
      }
    }
  }

  // Vollständiges Audit durchführen
  async runFullAudit() {
    console.log("🚀 Starte vollständiges Audit...");

    const startTime = Date.now();

    // Code-Qualitäts-Audit
    const codeQualityIssues = await this.auditCodeQuality();

    // i18n-Audit
    const i18nIssues = await this.auditI18n();

    // Dateistruktur-Audit
    const structureIssues = this.auditFileStructure();

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Zusammenfassung erstellen
    const summary = {
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      codeQuality: {
        total: codeQualityIssues.length,
        errors: codeQualityIssues.filter((i) => i.severity === "error").length,
        warnings: codeQualityIssues.filter((i) => i.severity === "warning").length,
      },
      i18n: {
        total: i18nIssues.length,
        errors: i18nIssues.filter((i) => i.severity === "error").length,
        warnings: i18nIssues.filter((i) => i.severity === "warning").length,
      },
      structure: {
        total: structureIssues.length,
        errors: structureIssues.filter((i) => i.severity === "error").length,
        warnings: structureIssues.filter((i) => i.severity === "warning").length,
      },
    };

    // Audit-Eintrag für vollständiges Audit
    this.logEvent({
      type: "full_audit_completed",
      details: `Audit in ${duration}ms abgeschlossen`,
      severity: "info",
      changes: summary,
    });

    // Bericht speichern
    fs.writeFileSync(
      path.join(this.projectRoot, "audit-report.json"),
      JSON.stringify(summary, null, 2),
    );

    console.log("✅ Vollständiges Audit abgeschlossen");
    console.log(`📊 Bericht gespeichert: audit-report.json`);

    return summary;
  }

  // Dateistruktur-Audit
  auditFileStructure() {
    console.log("📁 Überprüfe Dateistruktur...");

    const issues = [];
    const requiredFiles = [
      "src/app/layout.tsx",
      "src/app/page.tsx",
      "src/components/Core/Header.tsx",
      "src/components/Core/Footer.tsx",
      "package.json",
      "tsconfig.json",
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (!fs.existsSync(filePath)) {
        issues.push({
          file: file,
          issue: "Erforderliche Datei fehlt",
          severity: "error",
          details: "Kritische Projektdatei",
        });
      }
    }

    return issues;
  }

  // Audit-Log abrufen
  getAuditLog(limit = 50) {
    return this.auditLog.slice(-limit);
  }

  // Audit-Log filtern
  filterAuditLog(filters = {}) {
    let filtered = this.auditLog;

    if (filters.type) {
      filtered = filtered.filter((entry) => entry.event === filters.type);
    }

    if (filters.severity) {
      filtered = filtered.filter((entry) => entry.severity === filters.severity);
    }

    if (filters.file) {
      filtered = filtered.filter((entry) => entry.file && entry.file.includes(filters.file));
    }

    return filtered;
  }
}

// CLI-Schnittstelle
if (require.main === module) {
  const auditSystem = new AuditSystem();

  const command = process.argv[2];

  switch (command) {
    case "full":
      auditSystem.runFullAudit();
      break;
    case "watch":
      auditSystem.watchFileChanges();
      break;
    case "code":
      auditSystem.auditCodeQuality();
      break;
    case "i18n":
      auditSystem.auditI18n();
      break;
    case "log":
      const limit = process.argv[3] || 10;
      console.log(JSON.stringify(auditSystem.getAuditLog(limit), null, 2));
      break;
    default:
      console.log("Verwendung: node audit-system.js [full|watch|code|i18n|log]");
  }
}

module.exports = AuditSystem;
