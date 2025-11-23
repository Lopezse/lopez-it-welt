const fs = require("fs");
const path = require("path");

class I18nValidator {
  constructor() {
    this.localesPath = path.join(__dirname, "..", "src", "i18n", "locales");
    this.languages = ["de", "en", "es"];
    this.translations = {};
    this.violations = [];
  }

  loadTranslations() {
    this.languages.forEach((lang) => {
      const filePath = path.join(this.localesPath, `${lang}.json`);
      if (fs.existsSync(filePath)) {
        this.translations[lang] = JSON.parse(fs.readFileSync(filePath, "utf8"));
      }
    });
  }

  validateCriticalKeys() {
    console.log("🔍 Prüfe kritische Schlüssel...");

    // Prüfe obligatorische Schlüssel
    const criticalKeys = ["datenschutz.titel", "impressum.titel"];

    criticalKeys.forEach((key) => {
      const keys = key.split(".");
      let value = this.translations["de"];

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          this.violations.push({
            type: "CRITICAL",
            message: `Fehlender obligatorischer Schlüssel: ${key}`,
            language: "de",
          });
          return;
        }
      }

      if (typeof value === "string" && value.trim() !== "") {
        console.log(`✅ ${key}: "${value}"`);
      } else {
        this.violations.push({
          type: "CRITICAL",
          message: `Leerer obligatorischer Schlüssel: ${key}`,
          language: "de",
        });
      }
    });
  }

  validateConsistency() {
    console.log("🔍 Prüfe Konsistenz zwischen Sprachen...");

    const deKeys = this.getAllKeys(this.translations["de"]);
    const enKeys = this.getAllKeys(this.translations["en"]);
    const esKeys = this.getAllKeys(this.translations["es"]);

    // Prüfe zusätzliche Schlüssel in EN/ES
    enKeys.forEach((key) => {
      if (!deKeys.includes(key)) {
        this.violations.push({
          type: "MEDIUM",
          message: `Zusätzliche Übersetzung in en: ${key}`,
          language: "en",
        });
      }
    });

    esKeys.forEach((key) => {
      if (!deKeys.includes(key)) {
        this.violations.push({
          type: "MEDIUM",
          message: `Zusätzliche Übersetzung in es: ${key}`,
          language: "es",
        });
      }
    });
  }

  getAllKeys(obj, prefix = "") {
    const keys = [];
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null) {
        keys.push(...this.getAllKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    return keys;
  }

  run() {
    console.log("🚨 I18N-VALIDATOR gestartet");
    console.log("🔒 Übersetzungs-Integrität wird geprüft");
    console.log(`📁 Pfad: ${this.localesPath}`);
    console.log("-".repeat(50));

    try {
      this.loadTranslations();
      this.validateCriticalKeys();
      this.validateConsistency();

      console.log("\n📊 VALIDIERUNGSERGEBNIS");
      console.log("=".repeat(50));

      if (this.violations.length === 0) {
        console.log("✅ I18n-Integrität bestätigt!");
        console.log("🎉 Keine Verstöße gefunden");
      } else {
        console.log("❌ I18n-Integrität verletzt!");
        console.log("🚨 VERSTÖSSE ERKANNT:");

        this.violations.forEach((violation) => {
          const icon = violation.type === "CRITICAL" ? "❌" : "⚠️";
          console.log(`  ${icon} ${violation.message} (${violation.type})`);
        });
      }

      console.log("\n📈 Statistiken:");
      console.log(
        `- Kritische Verstöße: ${this.violations.filter((v) => v.type === "CRITICAL").length}`,
      );
      console.log(
        `- Mittlere Verstöße: ${this.violations.filter((v) => v.type === "MEDIUM").length}`,
      );
      console.log(`- Gesamt: ${this.violations.length}`);
    } catch (error) {
      console.error("❌ Fehler bei der I18n-Validierung:", error.message);
    }
  }
}

// Validator ausführen
if (require.main === module) {
  const validator = new I18nValidator();
  validator.run();
}

module.exports = I18nValidator;
