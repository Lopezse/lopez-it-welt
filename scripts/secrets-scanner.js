#!/usr/bin/env node

/**
 * 🔐 Secrets Scanner - Lopez IT Welt
 *
 * Automatische Erkennung von Secrets im Code:
 * - API Keys
 * - Passwörter
 * - Tokens
 * - Private Keys
 * - Database Credentials
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class SecretsScanner {
  constructor() {
    this.patterns = [
      // API Keys
      { name: "API Key", pattern: /api_key\s*=\s*['"][^'"]+['"]/gi },
      { name: "API Token", pattern: /api_token\s*=\s*['"][^'"]+['"]/gi },
      { name: "API Secret", pattern: /api_secret\s*=\s*['"][^'"]+['"]/gi },

      // Passwörter
      { name: "Password", pattern: /password\s*=\s*['"][^'"]+['"]/gi },
      { name: "Passwort", pattern: /passwort\s*=\s*['"][^'"]+['"]/gi },
      { name: "PWD", pattern: /pwd\s*=\s*['"][^'"]+['"]/gi },

      // Tokens
      { name: "Token", pattern: /token\s*=\s*['"][^'"]+['"]/gi },
      { name: "Access Token", pattern: /access_token\s*=\s*['"][^'"]+['"]/gi },
      { name: "Bearer Token", pattern: /bearer\s*['"][^'"]+['"]/gi },

      // Private Keys
      { name: "Private Key", pattern: /private_key\s*=\s*['"][^'"]+['"]/gi },
      { name: "Secret Key", pattern: /secret_key\s*=\s*['"][^'"]+['"]/gi },
      {
        name: "Private Key File",
        pattern: /private_key_file\s*=\s*['"][^'"]+['"]/gi,
      },

      // Database Credentials
      {
        name: "Database Password",
        pattern: /db_password\s*=\s*['"][^'"]+['"]/gi,
      },
      { name: "Database User", pattern: /db_user\s*=\s*['"][^'"]+['"]/gi },
      { name: "Database URL", pattern: /database_url\s*=\s*['"][^'"]+['"]/gi },

      // OAuth
      { name: "OAuth Secret", pattern: /oauth_secret\s*=\s*['"][^'"]+['"]/gi },
      { name: "OAuth Token", pattern: /oauth_token\s*=\s*['"][^'"]+['"]/gi },

      // AWS
      {
        name: "AWS Access Key",
        pattern: /aws_access_key\s*=\s*['"][^'"]+['"]/gi,
      },
      {
        name: "AWS Secret Key",
        pattern: /aws_secret_key\s*=\s*['"][^'"]+['"]/gi,
      },

      // Generic Secrets
      { name: "Secret", pattern: /secret\s*=\s*['"][^'"]+['"]/gi },
      { name: "Key", pattern: /key\s*=\s*['"][^'"]+['"]/gi },
      { name: "Credential", pattern: /credential\s*=\s*['"][^'"]+['"]/gi },
    ];

    this.excludedDirs = ["node_modules", ".git", ".next", "coverage", "dist", "build", "backups"];

    this.excludedFiles = ["package-lock.json", "yarn.lock", "*.log", "*.min.js", "*.min.css"];
  }

  /**
   * Hauptmethode: Führe Secrets-Scan aus
   */
  async scanSecrets() {
    console.log("🔐 Secrets Scanner startet...");
    console.log("================================");

    try {
      const results = {
        timestamp: new Date().toISOString(),
        files: [],
        secrets: [],
        summary: {
          totalFiles: 0,
          filesWithSecrets: 0,
          totalSecrets: 0,
          criticalSecrets: 0,
        },
      };

      // Alle Code-Dateien scannen
      const codeFiles = this.getAllCodeFiles();
      results.summary.totalFiles = codeFiles.length;

      console.log(`📁 ${codeFiles.length} Dateien gefunden`);

      for (const file of codeFiles) {
        const fileResults = await this.scanFile(file);
        if (fileResults.secrets.length > 0) {
          results.files.push(fileResults);
          results.summary.filesWithSecrets++;
          results.secrets.push(...fileResults.secrets);
        }
      }

      results.summary.totalSecrets = results.secrets.length;
      results.summary.criticalSecrets = results.secrets.filter(
        (s) => s.severity === "critical",
      ).length;

      // Ergebnisse ausgeben
      this.printResults(results);

      // Ergebnisse speichern
      this.saveResults(results);

      return results;
    } catch (error) {
      console.error("❌ Secrets-Scan Fehler:", error.message);
      throw error;
    }
  }

  /**
   * Einzelne Datei scannen
   */
  async scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const secrets = [];

      // Alle Patterns prüfen
      this.patterns.forEach((pattern) => {
        const matches = content.match(pattern.pattern);
        if (matches) {
          matches.forEach((match) => {
            const lineNumber = this.findLineNumber(content, match);
            secrets.push({
              type: pattern.name,
              pattern: pattern.pattern.source,
              line: lineNumber,
              match: this.sanitizeMatch(match),
              severity: this.determineSeverity(pattern.name),
              file: filePath,
            });
          });
        }
      });

      return {
        file: filePath,
        secrets,
        total: secrets.length,
      };
    } catch (error) {
      return {
        file: filePath,
        secrets: [],
        total: 0,
        error: error.message,
      };
    }
  }

  /**
   * Alle Code-Dateien finden
   */
  getAllCodeFiles() {
    const extensions = [
      ".js",
      ".ts",
      ".jsx",
      ".tsx",
      ".json",
      ".env",
      ".yml",
      ".yaml",
      ".xml",
      ".html",
      ".md",
    ];
    const files = [];

    const scanDirectory = (dir) => {
      try {
        const items = fs.readdirSync(dir);
        items.forEach((item) => {
          const fullPath = path.join(dir, item);

          // Verzeichnisse ausschließen
          if (this.excludedDirs.includes(item)) {
            return;
          }

          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            scanDirectory(fullPath);
          } else if (stat.isFile()) {
            const ext = path.extname(item);
            if (extensions.includes(ext) || item.startsWith(".env")) {
              files.push(fullPath);
            }
          }
        });
      } catch (error) {
        // Verzeichnis kann nicht gelesen werden
      }
    };

    scanDirectory(process.cwd());
    return files;
  }

  /**
   * Zeilennummer für Match finden
   */
  findLineNumber(content, match) {
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(match)) {
        return i + 1;
      }
    }
    return 0;
  }

  /**
   * Match für Ausgabe sanitieren
   */
  sanitizeMatch(match) {
    // Sensible Daten maskieren
    return match.replace(/['"][^'"]+['"]/, '["***MASKED***"]');
  }

  /**
   * Severity für Secret bestimmen
   */
  determineSeverity(secretType) {
    const criticalTypes = [
      "Private Key",
      "AWS Secret Key",
      "Database Password",
      "OAuth Secret",
      "API Secret",
    ];

    const highTypes = ["Password", "Passwort", "Token", "Access Token", "API Key"];

    if (criticalTypes.some((type) => secretType.includes(type))) {
      return "critical";
    } else if (highTypes.some((type) => secretType.includes(type))) {
      return "high";
    } else {
      return "medium";
    }
  }

  /**
   * Ergebnisse ausgeben
   */
  printResults(results) {
    console.log("\n📊 SECRETS SCAN ERGEBNISSE");
    console.log("============================");

    if (results.summary.totalSecrets === 0) {
      console.log("✅ Keine Secrets gefunden!");
      return;
    }

    console.log(
      `🚨 ${results.summary.totalSecrets} Secrets in ${results.summary.filesWithSecrets} Dateien gefunden`,
    );
    console.log(`⚠️  ${results.summary.criticalSecrets} kritische Secrets`);

    // Nach Dateien gruppiert ausgeben
    results.files.forEach((fileResult) => {
      console.log(`\n📄 ${fileResult.file}`);
      fileResult.secrets.forEach((secret) => {
        console.log(`  ${secret.severity.toUpperCase()}: ${secret.type} (Zeile ${secret.line})`);
      });
    });

    // Empfehlungen
    console.log("\n💡 EMPFEHLUNGEN:");
    if (results.summary.criticalSecrets > 0) {
      console.log("  - Kritische Secrets sofort entfernen oder sichern");
    }
    console.log("  - Secrets in Environment-Variablen auslagern");
    console.log("  - .env-Dateien zu .gitignore hinzufügen");
    console.log("  - Secrets-Management-System implementieren");
  }

  /**
   * Ergebnisse speichern
   */
  saveResults(results) {
    try {
      const reportsDir = path.join(__dirname, "../reports");
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const filename = `secrets-scan-${new Date().toISOString().split("T")[0]}.json`;
      const filepath = path.join(reportsDir, filename);

      fs.writeFileSync(filepath, JSON.stringify(results, null, 2));
      console.log(`📄 Ergebnisse gespeichert: ${filepath}`);
    } catch (error) {
      console.error("❌ Ergebnisse speichern Fehler:", error.message);
    }
  }

  /**
   * Pre-commit Hook
   */
  async runPreCommitHook() {
    console.log("🔐 Pre-commit Secrets-Check...");

    try {
      const results = await this.scanSecrets();

      if (results.summary.criticalSecrets > 0) {
        console.error("❌ Kritische Secrets gefunden! Commit blockiert.");
        process.exit(1);
      }

      if (results.summary.totalSecrets > 0) {
        console.warn("⚠️  Secrets gefunden. Bitte überprüfen.");
      }

      console.log("✅ Pre-commit Secrets-Check bestanden");
    } catch (error) {
      console.error("❌ Pre-commit Secrets-Check fehlgeschlagen:", error.message);
      process.exit(1);
    }
  }

  /**
   * Git-Hook für Secrets
   */
  async runGitHook() {
    try {
      // Staged Files prüfen
      const stagedFiles = execSync("git diff --cached --name-only", {
        encoding: "utf8",
      })
        .split("\n")
        .filter((file) => file.trim());

      console.log(`🔐 Git-Hook: ${stagedFiles.length} Dateien prüfen...`);

      let foundSecrets = false;

      for (const file of stagedFiles) {
        if (fs.existsSync(file)) {
          const fileResults = await this.scanFile(file);
          if (fileResults.secrets.length > 0) {
            console.error(`❌ Secrets in ${file} gefunden:`);
            fileResults.secrets.forEach((secret) => {
              console.error(`  - ${secret.type} (Zeile ${secret.line})`);
            });
            foundSecrets = true;
          }
        }
      }

      if (foundSecrets) {
        console.error("❌ Commit blockiert: Secrets gefunden!");
        process.exit(1);
      }

      console.log("✅ Git-Hook bestanden");
    } catch (error) {
      console.error("❌ Git-Hook Fehler:", error.message);
      process.exit(1);
    }
  }
}

// Hauptausführung
if (require.main === module) {
  const scanner = new SecretsScanner();

  const args = process.argv.slice(2);

  if (args.includes("--pre-commit")) {
    scanner.runPreCommitHook();
  } else if (args.includes("--git-hook")) {
    scanner.runGitHook();
  } else {
    scanner.scanSecrets().catch(console.error);
  }
}

module.exports = SecretsScanner;
