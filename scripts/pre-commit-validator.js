const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class PreCommitValidator {
  constructor() {
    this.projectRoot = process.cwd();
    this.errors = [];
    this.warnings = [];
  }

  // Hauptfunktion für Pre-Commit-Validierung
  async validate() {
    console.log("🔍 Starte Pre-Commit-Validierung...");

    this.errors = [];
    this.warnings = [];

    // Alle Validierungen durchführen
    await this.validateCodeStyle();
    await this.validateTests();
    await this.validateBuild();
    await this.validateI18n();
    await this.validateSecurity();

    // Ergebnisse ausgeben
    this.printResults();

    // Bei Fehlern abbrechen
    if (this.errors.length > 0) {
      console.log("\n❌ Pre-Commit-Validierung fehlgeschlagen!");
      process.exit(1);
    }

    console.log("\n✅ Pre-Commit-Validierung erfolgreich!");
  }

  // Code-Style-Validierung
  async validateCodeStyle() {
    console.log("📝 Überprüfe Code-Style...");

    try {
      // ESLint ausführen
      execSync("npm run lint", {
        cwd: this.projectRoot,
        stdio: "pipe",
      });
      console.log("  ✅ ESLint-Prüfung bestanden");
    } catch (error) {
      this.errors.push("ESLint-Prüfung fehlgeschlagen");
      console.log("  ❌ ESLint-Prüfung fehlgeschlagen");
    }

    try {
      // Prettier ausführen
      execSync("npm run format:check", {
        cwd: this.projectRoot,
        stdio: "pipe",
      });
      console.log("  ✅ Prettier-Prüfung bestanden");
    } catch (error) {
      this.warnings.push("Code-Formatierung nicht korrekt");
      console.log("  ⚠️ Prettier-Prüfung fehlgeschlagen");
    }
  }

  // Test-Validierung
  async validateTests() {
    console.log("🧪 Überprüfe Tests...");

    try {
      // Unit-Tests ausführen
      execSync("npm test", {
        cwd: this.projectRoot,
        stdio: "pipe",
      });
      console.log("  ✅ Unit-Tests bestanden");
    } catch (error) {
      this.errors.push("Unit-Tests fehlgeschlagen");
      console.log("  ❌ Unit-Tests fehlgeschlagen");
    }

    try {
      // TypeScript-Kompilierung prüfen
      execSync("npx tsc --noEmit", {
        cwd: this.projectRoot,
        stdio: "pipe",
      });
      console.log("  ✅ TypeScript-Kompilierung erfolgreich");
    } catch (error) {
      this.errors.push("TypeScript-Kompilierung fehlgeschlagen");
      console.log("  ❌ TypeScript-Kompilierung fehlgeschlagen");
    }
  }

  // Build-Validierung
  async validateBuild() {
    console.log("🔨 Überprüfe Build...");

    try {
      // Build-Prozess testen
      execSync("npm run build", {
        cwd: this.projectRoot,
        stdio: "pipe",
      });
      console.log("  ✅ Build erfolgreich");
    } catch (error) {
      this.errors.push("Build-Prozess fehlgeschlagen");
      console.log("  ❌ Build-Prozess fehlgeschlagen");
    }
  }

  // i18n-Validierung
  async validateI18n() {
    console.log("🌍 Überprüfe i18n...");

    const i18nDir = path.join(this.projectRoot, "src/i18n/locales");

    if (!fs.existsSync(i18nDir)) {
      this.errors.push("i18n-Verzeichnis fehlt");
      console.log("  ❌ i18n-Verzeichnis fehlt");
      return;
    }

    const requiredLanguages = ["de", "en", "es"];
    const missingLanguages = [];

    for (const lang of requiredLanguages) {
      const langFile = path.join(i18nDir, `${lang}.json`);
      if (!fs.existsSync(langFile)) {
        missingLanguages.push(lang);
      }
    }

    if (missingLanguages.length > 0) {
      this.errors.push(`Fehlende Sprachdateien: ${missingLanguages.join(", ")}`);
      console.log(`  ❌ Fehlende Sprachdateien: ${missingLanguages.join(", ")}`);
    } else {
      console.log("  ✅ Alle Sprachdateien vorhanden");
    }

    // Übersetzungsschlüssel-Konsistenz prüfen
    await this.validateTranslationConsistency();
  }

  // Übersetzungsschlüssel-Konsistenz prüfen
  async validateTranslationConsistency() {
    const i18nDir = path.join(this.projectRoot, "src/i18n/locales");
    const languages = ["de", "en", "es"];
    const translationKeys = {};

    // Alle Übersetzungsschlüssel sammeln
    for (const lang of languages) {
      const langFile = path.join(i18nDir, `${lang}.json`);
      if (fs.existsSync(langFile)) {
        try {
          const content = JSON.parse(fs.readFileSync(langFile, "utf8"));
          translationKeys[lang] = this.extractKeys(content);
        } catch (error) {
          this.errors.push(`Fehler beim Parsen von ${lang}.json: ${error.message}`);
        }
      }
    }

    // Schlüssel-Konsistenz prüfen
    const baseKeys = translationKeys["de"] || [];
    const inconsistencies = [];

    for (const lang of languages) {
      if (lang === "de") continue;

      const langKeys = translationKeys[lang] || [];

      // Fehlende Schlüssel in anderen Sprachen
      const missingKeys = baseKeys.filter((key) => !langKeys.includes(key));
      if (missingKeys.length > 0) {
        inconsistencies.push(`${lang}: ${missingKeys.length} fehlende Schlüssel`);
      }
    }

    if (inconsistencies.length > 0) {
      this.warnings.push(`Übersetzungskonsistenz-Probleme: ${inconsistencies.join(", ")}`);
      console.log(`  ⚠️ Übersetzungskonsistenz-Probleme gefunden`);
    } else {
      console.log("  ✅ Übersetzungskonsistenz OK");
    }
  }

  // Schlüssel aus JSON-Objekt extrahieren
  extractKeys(obj, prefix = "") {
    const keys = [];

    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === "object" && obj[key] !== null) {
        keys.push(...this.extractKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }

    return keys;
  }

  // Sicherheits-Validierung
  async validateSecurity() {
    console.log("🔒 Überprüfe Sicherheit...");

    try {
      // npm audit ausführen
      execSync("npm audit --audit-level=moderate", {
        cwd: this.projectRoot,
        stdio: "pipe",
      });
      console.log("  ✅ Sicherheitsprüfung bestanden");
    } catch (error) {
      this.warnings.push("Sicherheitsprobleme gefunden");
      console.log("  ⚠️ Sicherheitsprobleme gefunden");
    }

    // Sensible Daten in Code prüfen
    await this.checkForSensitiveData();
  }

  // Sensible Daten im Code prüfen
  async checkForSensitiveData() {
    const sourceFiles = this.getSourceFiles();
    const sensitivePatterns = [
      /api_key\s*[:=]\s*['"][^'"]+['"]/i,
      /password\s*[:=]\s*['"][^'"]+['"]/i,
      /secret\s*[:=]\s*['"][^'"]+['"]/i,
      /token\s*[:=]\s*['"][^'"]+['"]/i,
    ];

    let foundSensitiveData = false;

    for (const file of sourceFiles) {
      try {
        const content = fs.readFileSync(file, "utf8");

        for (const pattern of sensitivePatterns) {
          if (pattern.test(content)) {
            foundSensitiveData = true;
            this.warnings.push(`Mögliche sensible Daten in ${file}`);
            break;
          }
        }
      } catch (error) {
        // Datei kann nicht gelesen werden, überspringen
      }
    }

    if (foundSensitiveData) {
      console.log("  ⚠️ Mögliche sensible Daten gefunden");
    } else {
      console.log("  ✅ Keine sensiblen Daten gefunden");
    }
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

  // Ergebnisse ausgeben
  printResults() {
    console.log("\n📊 Pre-Commit-Validierung Ergebnisse:");

    if (this.errors.length > 0) {
      console.log("\n❌ Fehler:");
      this.errors.forEach((error) => {
        console.log(`  - ${error}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log("\n⚠️ Warnungen:");
      this.warnings.forEach((warning) => {
        console.log(`  - ${warning}`);
      });
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log("\n✅ Keine Probleme gefunden");
    }
  }

  // Automatische Korrekturen versuchen
  async autoFix() {
    console.log("🔧 Versuche automatische Korrekturen...");

    try {
      // Prettier-Formatierung anwenden
      execSync("npm run format", {
        cwd: this.projectRoot,
        stdio: "pipe",
      });
      console.log("  ✅ Code-Formatierung angewendet");
    } catch (error) {
      console.log("  ❌ Code-Formatierung fehlgeschlagen");
    }

    try {
      // ESLint-Auto-Fix
      execSync("npm run lint:fix", {
        cwd: this.projectRoot,
        stdio: "pipe",
      });
      console.log("  ✅ ESLint-Auto-Fix angewendet");
    } catch (error) {
      console.log("  ❌ ESLint-Auto-Fix fehlgeschlagen");
    }
  }
}

// CLI-Schnittstelle
if (require.main === module) {
  const validator = new PreCommitValidator();

  const command = process.argv[2];

  switch (command) {
    case "validate":
      validator.validate();
      break;
    case "fix":
      validator.autoFix();
      break;
    default:
      validator.validate();
  }
}

module.exports = PreCommitValidator;
