const fs = require("fs");
const path = require("path");

class I18nIntegrityValidator {
  constructor() {
    this.projectRoot = process.cwd();
    this.i18nDir = path.join(this.projectRoot, "src/i18n/locales");
    this.errors = [];
    this.warnings = [];
    this.info = [];
  }

  // Hauptfunktion für i18n-Integritätsprüfung
  async validateIntegrity() {
    console.log("🌍 Starte i18n-Integritätsprüfung...");

    this.errors = [];
    this.warnings = [];
    this.info = [];

    // Grundlegende Struktur prüfen
    this.validateStructure();

    // Sprachdateien prüfen
    await this.validateLanguageFiles();

    // Schlüssel-Konsistenz prüfen
    await this.validateKeyConsistency();

    // Übersetzungsqualität prüfen
    await this.validateTranslationQuality();

    // Ergebnisse ausgeben
    this.printResults();

    return this.errors.length === 0;
  }

  // Grundlegende Struktur prüfen
  validateStructure() {
    console.log("📁 Überprüfe i18n-Struktur...");

    if (!fs.existsSync(this.i18nDir)) {
      this.errors.push("i18n-Verzeichnis fehlt: src/i18n/locales");
      return;
    }

    const configFile = path.join(this.projectRoot, "src/i18n/config.ts");
    if (!fs.existsSync(configFile)) {
      this.warnings.push("i18n-Konfigurationsdatei fehlt: src/i18n/config.ts");
    } else {
      this.info.push("i18n-Konfigurationsdatei vorhanden");
    }
  }

  // Sprachdateien prüfen
  async validateLanguageFiles() {
    console.log("📄 Überprüfe Sprachdateien...");

    const requiredLanguages = ["de", "en", "es"];
    const languageFiles = {};

    for (const lang of requiredLanguages) {
      const langFile = path.join(this.i18nDir, `${lang}.json`);

      if (!fs.existsSync(langFile)) {
        this.errors.push(`Sprachdatei fehlt: ${lang}.json`);
        continue;
      }

      try {
        const content = fs.readFileSync(langFile, "utf8");
        const parsed = JSON.parse(content);

        languageFiles[lang] = parsed;
        this.info.push(`Sprachdatei ${lang}.json geladen (${this.countKeys(parsed)} Schlüssel)`);

        // JSON-Syntax prüfen
        this.validateJsonSyntax(lang, content);
      } catch (error) {
        this.errors.push(`Fehler beim Parsen von ${lang}.json: ${error.message}`);
      }
    }

    this.languageFiles = languageFiles;
  }

  // JSON-Syntax prüfen
  validateJsonSyntax(language, content) {
    try {
      JSON.parse(content);
    } catch (error) {
      this.errors.push(`JSON-Syntax-Fehler in ${language}.json: ${error.message}`);
    }
  }

  // Schlüssel-Konsistenz prüfen
  async validateKeyConsistency() {
    console.log("🔑 Überprüfe Schlüssel-Konsistenz...");

    if (!this.languageFiles || Object.keys(this.languageFiles).length === 0) {
      return;
    }

    const languages = Object.keys(this.languageFiles);
    const baseLanguage = "de";

    if (!this.languageFiles[baseLanguage]) {
      this.errors.push("Basis-Sprache (de) fehlt für Konsistenzprüfung");
      return;
    }

    const baseKeys = this.extractKeys(this.languageFiles[baseLanguage]);
    this.info.push(`Basis-Sprache (${baseLanguage}): ${baseKeys.length} Schlüssel`);

    // Schlüssel in anderen Sprachen prüfen
    for (const lang of languages) {
      if (lang === baseLanguage) continue;

      const langKeys = this.extractKeys(this.languageFiles[lang]);
      const missingKeys = baseKeys.filter((key) => !langKeys.includes(key));
      const extraKeys = langKeys.filter((key) => !baseKeys.includes(key));

      if (missingKeys.length > 0) {
        this.warnings.push(`${lang}: ${missingKeys.length} fehlende Schlüssel`);
        if (missingKeys.length <= 5) {
          this.info.push(`  Fehlende Schlüssel in ${lang}: ${missingKeys.join(", ")}`);
        }
      }

      if (extraKeys.length > 0) {
        this.info.push(`${lang}: ${extraKeys.length} zusätzliche Schlüssel`);
      }
    }
  }

  // Übersetzungsqualität prüfen
  async validateTranslationQuality() {
    console.log("✨ Überprüfe Übersetzungsqualität...");

    if (!this.languageFiles) return;

    const languages = Object.keys(this.languageFiles);

    for (const lang of languages) {
      const translations = this.languageFiles[lang];
      const qualityIssues = this.analyzeTranslationQuality(lang, translations);

      if (qualityIssues.length > 0) {
        this.warnings.push(`${lang}: ${qualityIssues.length} Qualitätsprobleme`);
        qualityIssues.slice(0, 3).forEach((issue) => {
          this.info.push(`  ${lang}: ${issue}`);
        });
      }
    }
  }

  // Übersetzungsqualität analysieren
  analyzeTranslationQuality(language, translations) {
    const issues = [];
    const keys = this.extractKeys(translations);

    for (const key of keys) {
      const value = this.getNestedValue(translations, key);

      if (typeof value === "string") {
        // Leere Übersetzungen
        if (value.trim() === "") {
          issues.push(`Leere Übersetzung für "${key}"`);
        }

        // Platzhalter-Konsistenz prüfen
        const placeholders = this.extractPlaceholders(value);
        if (placeholders.length > 0) {
          issues.push(`Platzhalter in "${key}": ${placeholders.join(", ")}`);
        }

        // Sehr kurze Übersetzungen
        if (value.length < 2) {
          issues.push(`Sehr kurze Übersetzung für "${key}": "${value}"`);
        }
      }
    }

    return issues;
  }

  // Platzhalter aus String extrahieren
  extractPlaceholders(text) {
    const placeholderPatterns = [
      /\{\w+\}/g, // {variable}
      /\$\{\w+\}/g, // ${variable}
      /%s/g, // %s
      /%d/g, // %d
      /%f/g, // %f
    ];

    const placeholders = [];

    for (const pattern of placeholderPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        placeholders.push(...matches);
      }
    }

    return [...new Set(placeholders)];
  }

  // Nested-Wert aus Objekt extrahieren
  getNestedValue(obj, key) {
    const keys = key.split(".");
    let value = obj;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return undefined;
      }
    }

    return value;
  }

  // Schlüssel aus Objekt extrahieren
  extractKeys(obj, prefix = "") {
    const keys = [];

    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        keys.push(...this.extractKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }

    return keys;
  }

  // Schlüssel zählen
  countKeys(obj) {
    return this.extractKeys(obj).length;
  }

  // Ergebnisse ausgeben
  printResults() {
    console.log("\n📊 i18n-Integritätsprüfung Ergebnisse:");

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

    if (this.info.length > 0) {
      console.log("\nℹ️ Informationen:");
      this.info.forEach((info) => {
        console.log(`  - ${info}`);
      });
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log("\n✅ i18n-Integrität ist in Ordnung!");
    }
  }

  // Automatische Korrekturen
  async autoFix() {
    console.log("🔧 Versuche automatische i18n-Korrekturen...");

    if (!this.languageFiles) {
      console.log("Keine Sprachdateien zum Korrigieren gefunden");
      return;
    }

    const languages = Object.keys(this.languageFiles);
    const baseLanguage = "de";

    if (!this.languageFiles[baseLanguage]) {
      console.log("Basis-Sprache fehlt für Auto-Fix");
      return;
    }

    const baseKeys = this.extractKeys(this.languageFiles[baseLanguage]);

    for (const lang of languages) {
      if (lang === baseLanguage) continue;

      const langFile = path.join(this.i18nDir, `${lang}.json`);
      const currentTranslations = this.languageFiles[lang];
      let modified = false;

      // Fehlende Schlüssel hinzufügen
      for (const key of baseKeys) {
        if (!this.hasKey(currentTranslations, key)) {
          this.setNestedValue(currentTranslations, key, `[${key}]`);
          modified = true;
          console.log(`  ${lang}: Schlüssel "${key}" hinzugefügt`);
        }
      }

      // Geänderte Datei speichern
      if (modified) {
        try {
          fs.writeFileSync(langFile, JSON.stringify(currentTranslations, null, 2));
          console.log(`  ${lang}.json aktualisiert`);
        } catch (error) {
          console.error(`  Fehler beim Speichern von ${lang}.json:`, error.message);
        }
      }
    }
  }

  // Prüfen ob Schlüssel existiert
  hasKey(obj, key) {
    return this.getNestedValue(obj, key) !== undefined;
  }

  // Nested-Wert setzen
  setNestedValue(obj, key, value) {
    const keys = key.split(".");
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current) || typeof current[k] !== "object") {
        current[k] = {};
      }
      current = current[k];
    }

    current[keys[keys.length - 1]] = value;
  }

  // Statistiken generieren
  generateStats() {
    if (!this.languageFiles) {
      return null;
    }

    const stats = {
      languages: Object.keys(this.languageFiles).length,
      totalKeys: 0,
      byLanguage: {},
    };

    for (const [lang, translations] of Object.entries(this.languageFiles)) {
      const keyCount = this.countKeys(translations);
      stats.byLanguage[lang] = keyCount;
      stats.totalKeys = Math.max(stats.totalKeys, keyCount);
    }

    return stats;
  }
}

// CLI-Schnittstelle
if (require.main === module) {
  const validator = new I18nIntegrityValidator();

  const command = process.argv[2];

  switch (command) {
    case "validate":
      validator.validateIntegrity();
      break;
    case "fix":
      validator.autoFix();
      break;
    case "stats":
      const stats = validator.generateStats();
      console.log(JSON.stringify(stats, null, 2));
      break;
    default:
      validator.validateIntegrity();
  }
}

module.exports = I18nIntegrityValidator;
