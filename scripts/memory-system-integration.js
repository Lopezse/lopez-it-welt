// =====================================================
// Memory-System Integration Script
// =====================================================
// Erstellt: 2025-07-05 14:30:00
// Autor: Ramiro Lopez Rodriguez
// Zweck: MySQL-Memory aktivieren - Schema importieren - Regeln laden - Agenten verbinden
// =====================================================

const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const path = require("path");

// =====================================================
// Konfiguration
// =====================================================

const config = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lopez_it_welt",
  charset: "utf8mb4",
  timezone: "+01:00",
};

// =====================================================
// Farben für Output
// =====================================================

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// =====================================================
// MySQL Memory System Klasse
// =====================================================

class MemorySystemIntegration {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  // =====================================================
  // Verbindung
  // =====================================================

  async connect() {
    try {
      this.connection = await mysql.createConnection(config);
      this.isConnected = true;
      log("✅ MySQL Memory System verbunden", "green");
    } catch (error) {
      log(`❌ MySQL Memory System Verbindung fehlgeschlagen: ${error.message}`, "red");
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
      this.isConnected = false;
      log("🔌 MySQL Memory System getrennt", "blue");
    }
  }

  // =====================================================
  // Schema-Initialisierung
  // =====================================================

  async initializeSchema() {
    log("🏗️ Initialisiere Memory-System Schema...", "cyan");

    try {
      // KI-Regeln Tabelle
      await this.connection.execute(`
        CREATE TABLE IF NOT EXISTS ki_rules (
          id INT AUTO_INCREMENT PRIMARY KEY,
          rule_text TEXT NOT NULL COMMENT 'Regel-Text (DSGVO, Enterprise++, etc.)',
          category VARCHAR(50) NOT NULL COMMENT 'Kategorie: compliance, enterprise, quality, security',
          tags JSON COMMENT 'Tags für bessere Kategorisierung',
          priority ENUM('niedrig', 'mittel', 'hoch', 'kritisch') DEFAULT 'mittel',
          user_id INT NULL COMMENT 'Benutzer der Regel erstellt hat',
          is_active BOOLEAN DEFAULT TRUE COMMENT 'Regel aktiv/inaktiv',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_category (category),
          INDEX idx_active (is_active),
          INDEX idx_priority (priority),
          FULLTEXT(rule_text)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // KI-Memory-Sessions Tabelle
      await this.connection.execute(`
        CREATE TABLE IF NOT EXISTS ki_memory_sessions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          session_id VARCHAR(100) NOT NULL COMMENT 'Verbindung zu work_sessions',
          context TEXT NOT NULL COMMENT 'Was wurde gemacht',
          rules_used JSON COMMENT 'Welche Regeln wurden angewendet',
          compliance_status BOOLEAN DEFAULT TRUE COMMENT 'Compliance-Status',
          compliance_notes TEXT COMMENT 'Compliance-Notizen',
          lessons_learned TEXT COMMENT 'Was wurde gelernt',
          next_actions JSON COMMENT 'Nächste Aktionen',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_session (session_id),
          INDEX idx_compliance (compliance_status),
          INDEX idx_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // KI-Audit-Log Tabelle
      await this.connection.execute(`
        CREATE TABLE IF NOT EXISTS ki_audit_log (
          id INT AUTO_INCREMENT PRIMARY KEY,
          action VARCHAR(50) NOT NULL COMMENT 'Aktion: create, read, update, delete',
          table_name VARCHAR(50) NOT NULL COMMENT 'Betroffene Tabelle',
          record_id INT NULL COMMENT 'Betroffener Datensatz',
          user_id INT NULL COMMENT 'Benutzer der Aktion',
          old_values JSON COMMENT 'Alte Werte (bei Update/Delete)',
          new_values JSON COMMENT 'Neue Werte (bei Create/Update)',
          ip_address VARCHAR(45) COMMENT 'IP-Adresse',
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_action (action),
          INDEX idx_table (table_name),
          INDEX idx_user (user_id),
          INDEX idx_timestamp (timestamp)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      log("✅ Memory-System Schema initialisiert", "green");
    } catch (error) {
      log(`❌ Schema-Initialisierung fehlgeschlagen: ${error.message}`, "red");
      throw error;
    }
  }

  // =====================================================
  // DSGVO + Enterprise++ Regeln laden
  // =====================================================

  async loadDefaultRules() {
    log("📚 Lade DSGVO + Enterprise++ Regeln...", "cyan");

    try {
      // DSGVO-Regeln
      const dsgvoRules = [
        {
          rule_text:
            "Alle Kontaktformulare müssen DSGVO-konform sein mit Consent-Checkbox und Datenschutzerklärung",
          category: "compliance",
          tags: ["dsgvo", "formular", "consent"],
          priority: "kritisch",
        },
        {
          rule_text:
            "Personenbezogene Daten dürfen nur mit expliziter Einwilligung verarbeitet werden",
          category: "compliance",
          tags: ["dsgvo", "datenschutz", "einwilligung"],
          priority: "kritisch",
        },
        {
          rule_text: "Datenschutzerklärung muss auf jeder Seite verfügbar sein",
          category: "compliance",
          tags: ["dsgvo", "datenschutz", "erklärung"],
          priority: "hoch",
        },
        {
          rule_text: "Cookie-Consent ist für alle nicht-essentiellen Cookies erforderlich",
          category: "compliance",
          tags: ["dsgvo", "cookie", "consent"],
          priority: "hoch",
        },
        {
          rule_text: "Opt-Out-Mechanismus für Marketing-Cookies muss vorhanden sein",
          category: "compliance",
          tags: ["dsgvo", "cookie", "opt-out"],
          priority: "hoch",
        },
        {
          rule_text: "Tracking-Codes müssen dokumentiert und transparent sein",
          category: "compliance",
          tags: ["dsgvo", "tracking", "transparenz"],
          priority: "hoch",
        },
      ];

      // Enterprise++ Regeln
      const enterpriseRules = [
        {
          rule_text: "Enterprise++ Standards: 100% Test-Coverage, 0 Lint-Fehler, 0 Bundle-Size",
          category: "enterprise",
          tags: ["quality", "testing", "standards"],
          priority: "kritisch",
        },
        {
          rule_text: "Anti-Regelbruch-System: Keine Aktionen ohne explizite Freigabe",
          category: "enterprise",
          tags: ["safety", "approval", "rules"],
          priority: "kritisch",
        },
        {
          rule_text: "Alle Änderungen müssen in STATUS.md dokumentiert werden",
          category: "enterprise",
          tags: ["dokumentation", "tracking"],
          priority: "hoch",
        },
        {
          rule_text: "Strikte Datumsvalidierung: System-Zeit verwenden, niemals kopieren",
          category: "enterprise",
          tags: ["zeit", "validierung"],
          priority: "hoch",
        },
        {
          rule_text: "Zero Tolerance Policy: Keine Regelverstöße werden toleriert",
          category: "enterprise",
          tags: ["policy", "zero-tolerance"],
          priority: "kritisch",
        },
        {
          rule_text: "Strict Mode Enforcement: Alle Systeme im strengsten Modus",
          category: "enterprise",
          tags: ["strict", "enforcement"],
          priority: "kritisch",
        },
      ];

      // Qualitätsregeln
      const qualityRules = [
        {
          rule_text: "WCAG 2.1 AA Konformität für alle Komponenten",
          category: "quality",
          tags: ["accessibility", "wcag", "barrierefreiheit"],
          priority: "hoch",
        },
        {
          rule_text: "TypeScript Strict Mode für alle Dateien",
          category: "quality",
          tags: ["typescript", "strict", "typing"],
          priority: "hoch",
        },
        {
          rule_text: "Prettier-Formatierung für konsistenten Code",
          category: "quality",
          tags: ["formatting", "prettier"],
          priority: "mittel",
        },
        {
          rule_text: "Keine any-Typen verwenden - Strikte Typisierung",
          category: "quality",
          tags: ["typescript", "typing", "strict"],
          priority: "hoch",
        },
        {
          rule_text: "100% Test-Coverage für alle Komponenten",
          category: "quality",
          tags: ["testing", "coverage", "quality"],
          priority: "kritisch",
        },
      ];

      // Sicherheitsregeln
      const securityRules = [
        {
          rule_text: "Keine Passwörter oder API-Keys im Code speichern",
          category: "security",
          tags: ["sicherheit", "passwort", "api-key"],
          priority: "kritisch",
        },
        {
          rule_text: "Alle externen APIs über HTTPS aufrufen",
          category: "security",
          tags: ["sicherheit", "https", "ssl"],
          priority: "hoch",
        },
        {
          rule_text: "Input-Validierung für alle Benutzereingaben",
          category: "security",
          tags: ["sicherheit", "validierung", "input"],
          priority: "hoch",
        },
        {
          rule_text: "Environment Variables für sensitive Daten verwenden",
          category: "security",
          tags: ["sicherheit", "environment", "variables"],
          priority: "hoch",
        },
        {
          rule_text: "Defense in Depth: Mehrere Sicherheitsebenen implementieren",
          category: "security",
          tags: ["sicherheit", "defense", "depth"],
          priority: "kritisch",
        },
      ];

      // Alle Regeln speichern
      const allRules = [...dsgvoRules, ...enterpriseRules, ...qualityRules, ...securityRules];

      for (const rule of allRules) {
        await this.connection.execute(
          `INSERT INTO ki_rules (rule_text, category, tags, priority, is_active) 
           VALUES (?, ?, ?, ?, TRUE)`,
          [rule.rule_text, rule.category, JSON.stringify(rule.tags), rule.priority],
        );
      }

      log(`✅ ${allRules.length} Standard-Regeln geladen`, "green");

      // Statistiken anzeigen
      const [stats] = await this.connection.execute("SELECT COUNT(*) as total FROM ki_rules");
      log(`📊 Gesamt-Regeln in Datenbank: ${stats[0].total}`, "blue");
    } catch (error) {
      log(`❌ Laden der Standard-Regeln fehlgeschlagen: ${error.message}`, "red");
      throw error;
    }
  }

  // =====================================================
  // Agenten-Integration testen
  // =====================================================

  async testAgentIntegration() {
    log("🤖 Teste Agenten-Integration...", "cyan");

    try {
      // Compliance-Agent testen
      const complianceRules = await this.connection.execute(
        'SELECT * FROM ki_rules WHERE category = "compliance" AND is_active = TRUE',
      );
      log(`✅ Compliance-Agent: ${complianceRules[0].length} Regeln verfügbar`, "green");

      // Enterprise-Agent testen
      const enterpriseRules = await this.connection.execute(
        'SELECT * FROM ki_rules WHERE category = "enterprise" AND is_active = TRUE',
      );
      log(`✅ Enterprise-Agent: ${enterpriseRules[0].length} Regeln verfügbar`, "green");

      // Quality-Agent testen
      const qualityRules = await this.connection.execute(
        'SELECT * FROM ki_rules WHERE category = "quality" AND is_active = TRUE',
      );
      log(`✅ Quality-Agent: ${qualityRules[0].length} Regeln verfügbar`, "green");

      // Security-Agent testen
      const securityRules = await this.connection.execute(
        'SELECT * FROM ki_rules WHERE category = "security" AND is_active = TRUE',
      );
      log(`✅ Security-Agent: ${securityRules[0].length} Regeln verfügbar`, "green");
    } catch (error) {
      log(`❌ Agenten-Integration-Test fehlgeschlagen: ${error.message}`, "red");
      throw error;
    }
  }

  // =====================================================
  // Compliance-Prüfung testen
  // =====================================================

  async testComplianceCheck() {
    log("🔍 Teste Compliance-Prüfung...", "cyan");

    try {
      // Test-Aktionen
      const testActions = [
        {
          action: "Kontaktformular erstellen",
          context: "Formular für Kundenkontakt",
          expected: false, // Sollte DSGVO-Verstoß erkennen
        },
        {
          action: "Kontaktformular mit Consent-Checkbox erstellen",
          context: "DSGVO-konformes Formular",
          expected: true, // Sollte DSGVO-konform sein
        },
        {
          action: "Test ohne Coverage schreiben",
          context: "Unit-Test ohne Coverage",
          expected: false, // Sollte Enterprise++-Verstoß erkennen
        },
        {
          action: "Test mit 100% Coverage schreiben",
          context: "Vollständiger Test mit Coverage",
          expected: true, // Sollte Enterprise++-konform sein
        },
      ];

      for (const test of testActions) {
        const [relevantRules] = await this.connection.execute(
          `SELECT * FROM ki_rules 
           WHERE is_active = TRUE 
           AND MATCH(rule_text) AGAINST(? IN NATURAL LANGUAGE MODE)
           ORDER BY priority DESC
           LIMIT 5`,
          [test.action + " " + test.context],
        );

        const hasViolations = relevantRules.some((rule) => {
          const actionLower = test.action.toLowerCase();
          const ruleLower = rule.rule_text.toLowerCase();

          if (rule.category === "compliance" && ruleLower.includes("dsgvo")) {
            return actionLower.includes("formular") && !actionLower.includes("consent");
          }

          if (rule.category === "enterprise" && ruleLower.includes("test")) {
            return actionLower.includes("test") && !actionLower.includes("coverage");
          }

          return false;
        });

        const status = hasViolations ? "❌" : "✅";
        const result = hasViolations === test.expected ? "KORREKT" : "FEHLER";
        log(
          `${status} ${test.action}: ${result}`,
          hasViolations === test.expected ? "green" : "red",
        );
      }
    } catch (error) {
      log(`❌ Compliance-Prüfung-Test fehlgeschlagen: ${error.message}`, "red");
      throw error;
    }
  }

  // =====================================================
  // Statistiken anzeigen
  // =====================================================

  async showStatistics() {
    log("📊 Memory-System Statistiken:", "cyan");

    try {
      // Gesamt-Regeln
      const [totalRules] = await this.connection.execute("SELECT COUNT(*) as total FROM ki_rules");
      log(`📚 Gesamt-Regeln: ${totalRules[0].total}`, "blue");

      // Aktive Regeln
      const [activeRules] = await this.connection.execute(
        "SELECT COUNT(*) as active FROM ki_rules WHERE is_active = TRUE",
      );
      log(`✅ Aktive Regeln: ${activeRules[0].active}`, "green");

      // Regeln nach Kategorie
      const [categoryStats] = await this.connection.execute(`
        SELECT category, COUNT(*) as count 
        FROM ki_rules 
        WHERE is_active = TRUE 
        GROUP BY category 
        ORDER BY count DESC
      `);

      log("📋 Regeln nach Kategorie:", "blue");
      for (const stat of categoryStats) {
        log(`  ${stat.category}: ${stat.count} Regeln`, "yellow");
      }

      // Prioritäten-Verteilung
      const [priorityStats] = await this.connection.execute(`
        SELECT priority, COUNT(*) as count 
        FROM ki_rules 
        WHERE is_active = TRUE 
        GROUP BY priority 
        ORDER BY FIELD(priority, 'kritisch', 'hoch', 'mittel', 'niedrig')
      `);

      log("🎯 Regeln nach Priorität:", "blue");
      for (const stat of priorityStats) {
        log(`  ${stat.priority}: ${stat.count} Regeln`, "yellow");
      }
    } catch (error) {
      log(`❌ Statistiken konnten nicht abgerufen werden: ${error.message}`, "red");
    }
  }

  // =====================================================
  // Hauptfunktion
  // =====================================================

  async run() {
    try {
      log("🚀 Starte Memory-System Integration...", "magenta");

      // 1. Verbindung herstellen
      await this.connect();

      // 2. Schema initialisieren
      await this.initializeSchema();

      // 3. Standard-Regeln laden
      await this.loadDefaultRules();

      // 4. Agenten-Integration testen
      await this.testAgentIntegration();

      // 5. Compliance-Prüfung testen
      await this.testComplianceCheck();

      // 6. Statistiken anzeigen
      await this.showStatistics();

      log("🎉 Memory-System Integration erfolgreich abgeschlossen!", "green");
    } catch (error) {
      log(`💥 Memory-System Integration fehlgeschlagen: ${error.message}`, "red");
      process.exit(1);
    } finally {
      await this.disconnect();
    }
  }
}

// =====================================================
// Script ausführen
// =====================================================

if (require.main === module) {
  const integration = new MemorySystemIntegration();
  integration.run();
}

module.exports = MemorySystemIntegration;
