#!/usr/bin/env node

/**
 * =====================================================
 * MD-zu-DB Migration System
 * =====================================================
 * Erstellt: 2025-07-02
 * Zweck: Migration aller .md-Regeln in die Master-DB
 * =====================================================
 */

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

// =====================================================
// KONFIGURATION
// =====================================================

const CONFIG = {
  database: {
    host: "localhost",
    user: "root",
    password: "", // XAMPP Standard
    database: "lopez_it_welt_compliance",
  },
  paths: {
    docs: "./docs",
    scripts: "./scripts",
    src: "./src",
  },
  categories: {
    policies: ["DATENSCHUTZ", "QUALITÄT", "SICHERHEIT", "ENTWICKLUNG", "BUSINESS", "ADMIN"],
    laws: ["DSGVO", "TMG", "UWG", "GDPR", "COMPLIANCE"],
    ci_rules: ["CODE_QUALITY", "SECURITY", "PERFORMANCE", "ACCESSIBILITY", "SEO", "TESTING"],
  },
};

// =====================================================
// HILFSFUNKTIONEN
// =====================================================

class MDMigrationSystem {
  constructor() {
    this.connection = null;
    this.migrationStats = {
      totalFiles: 0,
      processedFiles: 0,
      policies: 0,
      laws: 0,
      ci_rules: 0,
      errors: 0,
    };
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection(CONFIG.database);
      console.log("✅ Datenbankverbindung hergestellt");
    } catch (error) {
      console.error("❌ Datenbankverbindung fehlgeschlagen:", error.message);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      console.log("✅ Datenbankverbindung geschlossen");
    }
  }

  // Alle .md-Dateien finden
  findMarkdownFiles() {
    const mdFiles = [];

    function scanDirectory(dir) {
      if (!fs.existsSync(dir)) return;

      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (item.endsWith(".md")) {
          mdFiles.push(fullPath);
        }
      }
    }

    // Alle relevanten Verzeichnisse scannen
    Object.values(CONFIG.paths).forEach((dir) => {
      scanDirectory(dir);
    });

    return mdFiles;
  }

  // Kategorie aus Dateipfad und Inhalt bestimmen
  determineCategory(filePath, content) {
    const fileName = path.basename(filePath).toLowerCase();
    const contentLower = content.toLowerCase();

    // Policy-Kategorien
    if (fileName.includes("datenschutz") || contentLower.includes("datenschutz")) {
      return { type: "POLICY", category: "DATENSCHUTZ" };
    }
    if (fileName.includes("qualität") || contentLower.includes("qualität")) {
      return { type: "POLICY", category: "QUALITÄT" };
    }
    if (fileName.includes("sicherheit") || contentLower.includes("sicherheit")) {
      return { type: "POLICY", category: "SICHERHEIT" };
    }
    if (fileName.includes("entwicklung") || contentLower.includes("entwicklung")) {
      return { type: "POLICY", category: "ENTWICKLUNG" };
    }
    if (fileName.includes("business") || contentLower.includes("business")) {
      return { type: "POLICY", category: "BUSINESS" };
    }
    if (fileName.includes("admin") || contentLower.includes("admin")) {
      return { type: "POLICY", category: "ADMIN" };
    }

    // Law-Kategorien
    if (fileName.includes("dsgvo") || contentLower.includes("dsgvo")) {
      return { type: "LAW", category: "DSGVO" };
    }
    if (fileName.includes("tmg") || contentLower.includes("tmg")) {
      return { type: "LAW", category: "TMG" };
    }
    if (fileName.includes("uwg") || contentLower.includes("uwg")) {
      return { type: "LAW", category: "UWG" };
    }
    if (fileName.includes("gdpr") || contentLower.includes("gdpr")) {
      return { type: "LAW", category: "GDPR" };
    }
    if (fileName.includes("compliance") || contentLower.includes("compliance")) {
      return { type: "LAW", category: "COMPLIANCE" };
    }

    // CI-Rule-Kategorien
    if (fileName.includes("code") || contentLower.includes("code")) {
      return { type: "CI_RULE", category: "CODE_QUALITY" };
    }
    if (fileName.includes("security") || contentLower.includes("security")) {
      return { type: "CI_RULE", category: "SECURITY" };
    }
    if (fileName.includes("performance") || contentLower.includes("performance")) {
      return { type: "CI_RULE", category: "PERFORMANCE" };
    }
    if (fileName.includes("accessibility") || contentLower.includes("accessibility")) {
      return { type: "CI_RULE", category: "ACCESSIBILITY" };
    }
    if (fileName.includes("seo") || contentLower.includes("seo")) {
      return { type: "CI_RULE", category: "SEO" };
    }
    if (fileName.includes("test") || contentLower.includes("test")) {
      return { type: "CI_RULE", category: "TESTING" };
    }

    // Standard: Policy
    return { type: "POLICY", category: "GENERAL" };
  }

  // Priorität bestimmen
  determinePriority(content) {
    const contentLower = content.toLowerCase();

    if (contentLower.includes("kritisch") || contentLower.includes("critical")) {
      return "CRITICAL";
    }
    if (contentLower.includes("hoch") || contentLower.includes("high")) {
      return "HIGH";
    }
    if (contentLower.includes("niedrig") || contentLower.includes("low")) {
      return "LOW";
    }

    return "MEDIUM";
  }

  // Titel aus Dateiname extrahieren
  extractTitle(filePath) {
    const fileName = path.basename(filePath, ".md");
    return fileName.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  }

  // Inhalt in die Datenbank einfügen
  async insertRule(ruleData) {
    const { type, category, key_title, content, source_file, priority } = ruleData;

    try {
      let tableName, query;

      switch (type) {
        case "POLICY":
          tableName = "policies";
          query = `
                        INSERT INTO policies (key_title, category, content, source_file, priority)
                        VALUES (?, ?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE
                        content = VALUES(content),
                        category = VALUES(category),
                        priority = VALUES(priority),
                        updated_at = CURRENT_TIMESTAMP
                    `;
          break;

        case "LAW":
          tableName = "laws";
          query = `
                        INSERT INTO laws (key_title, category, content, source_file, priority)
                        VALUES (?, ?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE
                        content = VALUES(content),
                        category = VALUES(category),
                        priority = VALUES(priority),
                        updated_at = CURRENT_TIMESTAMP
                    `;
          break;

        case "CI_RULE":
          tableName = "ci_rules";
          query = `
                        INSERT INTO ci_rules (key_title, category, content, source_file, priority)
                        VALUES (?, ?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE
                        content = VALUES(content),
                        category = VALUES(category),
                        priority = VALUES(priority),
                        updated_at = CURRENT_TIMESTAMP
                    `;
          break;

        default:
          throw new Error(`Unbekannter Regeltyp: ${type}`);
      }

      await this.connection.execute(query, [key_title, category, content, source_file, priority]);

      // Statistik aktualisieren
      switch (type) {
        case "POLICY":
          this.migrationStats.policies++;
          break;
        case "LAW":
          this.migrationStats.laws++;
          break;
        case "CI_RULE":
          this.migrationStats.ci_rules++;
          break;
      }

      console.log(`✅ ${type}: ${key_title} importiert`);
    } catch (error) {
      console.error(`❌ Fehler beim Import von ${key_title}:`, error.message);
      this.migrationStats.errors++;
    }
  }

  // Einzelne .md-Datei verarbeiten
  async processMarkdownFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      if (!content.trim()) {
        console.log(`⚠️ Leere Datei übersprungen: ${filePath}`);
        return;
      }

      const { type, category } = this.determineCategory(filePath, content);
      const key_title = this.extractTitle(filePath);
      const priority = this.determinePriority(content);
      const source_file = path.relative(process.cwd(), filePath);

      await this.insertRule({
        type,
        category,
        key_title,
        content,
        source_file,
        priority,
      });

      this.migrationStats.processedFiles++;
    } catch (error) {
      console.error(`❌ Fehler beim Verarbeiten von ${filePath}:`, error.message);
      this.migrationStats.errors++;
    }
  }

  // Migration ausführen
  async runMigration() {
    console.log("🚀 Starte MD-zu-DB Migration...\n");

    try {
      await this.connect();

      const mdFiles = this.findMarkdownFiles();
      this.migrationStats.totalFiles = mdFiles.length;

      console.log(`📁 Gefundene .md-Dateien: ${mdFiles.length}\n`);

      for (const filePath of mdFiles) {
        await this.processMarkdownFile(filePath);
      }

      await this.printMigrationReport();
    } catch (error) {
      console.error("❌ Migration fehlgeschlagen:", error.message);
    } finally {
      await this.disconnect();
    }
  }

  // Migrationsbericht ausgeben
  async printMigrationReport() {
    console.log("\n" + "=".repeat(60));
    console.log("📊 MIGRATIONSBERICHT");
    console.log("=".repeat(60));
    console.log(`📁 Gesamte Dateien: ${this.migrationStats.totalFiles}`);
    console.log(`✅ Verarbeitete Dateien: ${this.migrationStats.processedFiles}`);
    console.log(`📋 Policies: ${this.migrationStats.policies}`);
    console.log(`⚖️ Laws: ${this.migrationStats.laws}`);
    console.log(`🔧 CI-Rules: ${this.migrationStats.ci_rules}`);
    console.log(`❌ Fehler: ${this.migrationStats.errors}`);
    console.log("=".repeat(60));

    // Datenbankstatus abfragen
    try {
      const [rows] = await this.connection.execute("SELECT * FROM compliance_status");
      console.log("\n📊 DATENBANKSTATUS:");
      rows.forEach((row) => {
        console.log(`${row.rule_type}: ${row.active_rules}/${row.total_rules} aktiv`);
      });
    } catch (error) {
      console.error("❌ Fehler beim Abrufen des Datenbankstatus:", error.message);
    }
  }
}

// =====================================================
// HAUPTFUNKTION
// =====================================================

async function main() {
  const migrationSystem = new MDMigrationSystem();
  await migrationSystem.runMigration();
}

// =====================================================
// AUSFÜHRUNG
// =====================================================

if (require.main === module) {
  main().catch(console.error);
}

module.exports = MDMigrationSystem;
