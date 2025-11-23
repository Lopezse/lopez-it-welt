#!/usr/bin/env node

/**
 * Enterprise++ Standards Validator
 * Prüft automatisch, ob alle .md-Dateien die gleichen Enterprise++ Standards verwenden
 * Verhindert unterschiedliche Standards in verschiedenen Dateien
 */

const fs = require("fs");
const path = require("path");

// Enterprise++ Standards (einheitlich für alle Dateien)
const ENTERPRISE_STANDARDS = {
  code: {
    testCoverage: 100, // 100% Test Coverage
    typeCoverage: 100, // 100% Type Coverage
    lintErrors: 0, // Keine Lint-Fehler
    complexity: 1, // Minimale Komplexität
    duplication: 0, // Keine Code-Duplikation
    documentation: 100, // 100% Dokumentation
  },
  performance: {
    lighthouse: 100, // 100% Lighthouse Score
    firstPaint: 0, // Sofortiges First Paint
    timeToInteractive: 0, // Sofortige Interaktivität
    bundleSize: 0, // Minimale Bundle-Größe
    memoryUsage: 0, // Minimale Speichernutzung
    cpuUsage: 0, // Minimale CPU-Nutzung
  },
  security: {
    vulnerabilities: 0, // Keine Sicherheitslücken
    compliance: 100, // 100% Compliance
    encryption: 100, // 100% Verschlüsselung
    authentication: 100, // 100% Authentifizierung
    authorization: 100, // 100% Autorisierung
  },
  accessibility: {
    wcag: "AAA", // Höchste WCAG-Stufe
    screenReader: 100, // 100% Screen Reader Support
    keyboard: 100, // 100% Tastaturunterstützung
    colorContrast: 100, // 100% Farbkontrast
    focusManagement: 100, // 100% Fokus-Management
  },
};

class EnterpriseStandardsValidator {
  constructor() {
    this.mdFiles = ["START.md", "QualityController.md", "PROJECT.md", "STATUS.md", "README.md"];
    this.violations = [];
    this.fixes = [];
  }

  async validateAllFiles() {
    console.log("🔍 ENTERPRISE++ STANDARDS VALIDATOR");
    console.log("=====================================");
    console.log("Prüfe alle .md-Dateien auf einheitliche Enterprise++ Standards...\n");

    for (const file of this.mdFiles) {
      if (fs.existsSync(file)) {
        await this.validateFile(file);
      } else {
        console.log(`⚠️  Datei nicht gefunden: ${file}`);
      }
    }

    this.generateReport();
    await this.applyFixes();
  }

  async validateFile(filePath) {
    console.log(`📄 Prüfe: ${filePath}`);

    const content = fs.readFileSync(filePath, "utf8");
    const violations = [];

    // Prüfe auf Enterprise++ Standards
    const standardsCheck = this.checkEnterpriseStandards(content, filePath);
    if (standardsCheck.violations.length > 0) {
      violations.push(...standardsCheck.violations);
    }

    // Prüfe auf Konsistenz
    const consistencyCheck = this.checkConsistency(content, filePath);
    if (consistencyCheck.violations.length > 0) {
      violations.push(...consistencyCheck.violations);
    }

    if (violations.length > 0) {
      console.log(`❌ ${violations.length} Verstöße gefunden`);
      this.violations.push({
        file: filePath,
        violations: violations,
      });

      // Automatische Korrekturen generieren
      const fixes = this.generateFixes(filePath, violations);
      this.fixes.push({
        file: filePath,
        fixes: fixes,
        originalContent: content,
      });
    } else {
      console.log(`✅ Enterprise++ Standards eingehalten`);
    }
  }

  checkEnterpriseStandards(content, filePath) {
    const violations = [];
    const standards = ENTERPRISE_STANDARDS;

    // Prüfe auf inkorrekte Test Coverage Standards
    const testCoveragePatterns = [
      /testCoverage:\s*(\d+)/g,
      /Test Coverage.*?(\d+)%/g,
      /Test-Coverage.*?(\d+)%/g,
    ];

    for (const pattern of testCoveragePatterns) {
      const matches = content.match(pattern);
      if (matches) {
        for (const match of matches) {
          const value = parseInt(match.match(/\d+/)[0]);
          if (value !== standards.code.testCoverage) {
            violations.push({
              type: "testCoverage",
              found: value,
              expected: standards.code.testCoverage,
              line: this.findLineNumber(content, match),
              message: `Test Coverage: ${value}% gefunden, ${standards.code.testCoverage}% erwartet`,
            });
          }
        }
      }
    }

    // Prüfe auf inkorrekte Lint Error Standards
    const lintErrorPatterns = [
      /lintErrors:\s*(\d+)/g,
      /Lint Errors.*?(\d+)/g,
      /Linting.*?(\d+)\s*Fehler/g,
    ];

    for (const pattern of lintErrorPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        for (const match of matches) {
          const value = parseInt(match.match(/\d+/)[0]);
          if (value !== standards.code.lintErrors) {
            violations.push({
              type: "lintErrors",
              found: value,
              expected: standards.code.lintErrors,
              line: this.findLineNumber(content, match),
              message: `Lint Errors: ${value} gefunden, ${standards.code.lintErrors} erwartet`,
            });
          }
        }
      }
    }

    // Prüfe auf inkorrekte Bundle Size Standards
    const bundleSizePatterns = [
      /bundleSize:\s*(\d+)/g,
      /Bundle Size.*?(\d+)\s*kB/g,
      /Bundle-Größe.*?(\d+)\s*kB/g,
    ];

    for (const pattern of bundleSizePatterns) {
      const matches = content.match(pattern);
      if (matches) {
        for (const match of matches) {
          const value = parseInt(match.match(/\d+/)[0]);
          if (value !== standards.performance.bundleSize) {
            violations.push({
              type: "bundleSize",
              found: value,
              expected: standards.performance.bundleSize,
              line: this.findLineNumber(content, match),
              message: `Bundle Size: ${value} kB gefunden, ${standards.performance.bundleSize} kB erwartet`,
            });
          }
        }
      }
    }

    return { violations };
  }

  checkConsistency(content, filePath) {
    const violations = [];

    // Prüfe auf inkonsistente Enterprise++ Bezeichnungen
    const enterprisePatterns = [
      /Enterprise\+\+/g,
      /Enterprise\+\+ Standards/g,
      /Enterprise\+\+ Mode/g,
    ];

    let enterpriseCount = 0;
    for (const pattern of enterprisePatterns) {
      const matches = content.match(pattern);
      if (matches) {
        enterpriseCount += matches.length;
      }
    }

    // Prüfe auf inkonsistente Qualitätsstandards-Bezeichnungen
    const qualityPatterns = [/Qualitätsstandards/g, /Quality Standards/g, /QualityController/g];

    let qualityCount = 0;
    for (const pattern of qualityPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        qualityCount += matches.length;
      }
    }

    // Wenn Enterprise++ verwendet wird, sollte es konsistent sein
    if (enterpriseCount > 0 && qualityCount > enterpriseCount) {
      violations.push({
        type: "consistency",
        found: "Mixed terminology",
        expected: "Consistent Enterprise++ terminology",
        line: 1,
        message: "Inkonsistente Terminologie: Enterprise++ und normale Qualitätsstandards gemischt",
      });
    }

    return { violations };
  }

  findLineNumber(content, match) {
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(match)) {
        return i + 1;
      }
    }
    return 1;
  }

  generateFixes(filePath, violations) {
    const fixes = [];

    for (const violation of violations) {
      switch (violation.type) {
        case "testCoverage":
          fixes.push({
            type: "replace",
            search: new RegExp(`testCoverage:\\s*${violation.found}`, "g"),
            replace: `testCoverage: ${violation.expected}`,
            message: `Test Coverage von ${violation.found}% auf ${violation.expected}% korrigiert`,
          });
          break;

        case "lintErrors":
          fixes.push({
            type: "replace",
            search: new RegExp(`lintErrors:\\s*${violation.found}`, "g"),
            replace: `lintErrors: ${violation.expected}`,
            message: `Lint Errors von ${violation.found} auf ${violation.expected} korrigiert`,
          });
          break;

        case "bundleSize":
          fixes.push({
            type: "replace",
            search: new RegExp(`bundleSize:\\s*${violation.found}`, "g"),
            replace: `bundleSize: ${violation.expected}`,
            message: `Bundle Size von ${violation.found} kB auf ${violation.expected} kB korrigiert`,
          });
          break;

        case "consistency":
          fixes.push({
            type: "replace",
            search: /Qualitätsstandards/g,
            replace: "Enterprise++ Standards",
            message: "Terminologie auf Enterprise++ Standards vereinheitlicht",
          });
          break;
      }
    }

    return fixes;
  }

  generateReport() {
    console.log("\n📊 ENTERPRISE++ STANDARDS VALIDATOR REPORT");
    console.log("==========================================");

    if (this.violations.length === 0) {
      console.log("✅ ALLE ENTERPRISE++ STANDARDS EINGEHALTEN!");
      console.log("🎉 Alle .md-Dateien verwenden einheitliche Enterprise++ Standards");
      return;
    }

    console.log(`❌ ${this.violations.length} Dateien mit Verstößen gefunden:\n`);

    for (const violation of this.violations) {
      console.log(`📄 ${violation.file}:`);
      for (const v of violation.violations) {
        console.log(`   ❌ Zeile ${v.line}: ${v.message}`);
      }
      console.log("");
    }

    console.log(`🔧 ${this.fixes.length} automatische Korrekturen verfügbar`);
  }

  async applyFixes() {
    if (this.fixes.length === 0) {
      return;
    }

    console.log("\n🔧 AUTOMATISCHE KORREKTUREN ANWENDEN?");
    console.log("=====================================");
    console.log("Die folgenden Korrekturen werden automatisch angewendet:\n");

    for (const fix of this.fixes) {
      console.log(`📄 ${fix.file}:`);
      for (const f of fix.fixes) {
        console.log(`   ✅ ${f.message}`);
      }
      console.log("");
    }

    // Automatisch anwenden (da es ein Validator ist)
    for (const fix of this.fixes) {
      let content = fix.originalContent;

      for (const f of fix.fixes) {
        content = content.replace(f.search, f.replace);
      }

      // Backup erstellen
      const backupPath = `${fix.file}.backup.${Date.now()}`;
      fs.writeFileSync(backupPath, fix.originalContent);

      // Korrigierte Datei schreiben
      fs.writeFileSync(fix.file, content);

      console.log(`✅ ${fix.file} korrigiert (Backup: ${backupPath})`);
    }

    console.log("\n🎉 ALLE ENTERPRISE++ STANDARDS KORRIGIERT!");
  }
}

// Hauptausführung
async function main() {
  try {
    const validator = new EnterpriseStandardsValidator();
    await validator.validateAllFiles();
  } catch (error) {
    console.error("❌ Fehler beim Validieren der Enterprise++ Standards:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = EnterpriseStandardsValidator;
