const fs = require("fs");
const path = require("path");

class I18nMonitor {
  constructor() {
    this.projectRoot = process.cwd();
    this.i18nDir = path.join(this.projectRoot, "src/i18n/locales");
    this.monitorFile = path.join(this.projectRoot, "i18n-blocked.json");
    this.isMonitoring = false;
    this.watchers = [];
    this.lastState = {};
  }

  // Monitoring starten
  startMonitoring() {
    if (this.isMonitoring) {
      console.log("⚠️ Monitoring läuft bereits");
      return;
    }

    console.log("👁️ Starte i18n-Monitoring...");
    this.isMonitoring = true;

    // Initialen Zustand erfassen
    this.captureCurrentState();

    // Dateiüberwachung starten
    this.startFileWatching();

    // Periodische Überprüfung
    this.startPeriodicCheck();

    console.log("✅ i18n-Monitoring gestartet");
    console.log("Drücke Ctrl+C zum Beenden");
  }

  // Monitoring stoppen
  stopMonitoring() {
    if (!this.isMonitoring) {
      return;
    }

    console.log("\n🛑 Stoppe i18n-Monitoring...");
    this.isMonitoring = false;

    // Watcher stoppen
    this.watchers.forEach((watcher) => {
      try {
        watcher.close();
      } catch (error) {
        // Watcher bereits geschlossen
      }
    });
    this.watchers = [];

    console.log("✅ i18n-Monitoring gestoppt");
  }

  // Aktuellen Zustand erfassen
  captureCurrentState() {
    this.lastState = {};

    if (!fs.existsSync(this.i18nDir)) {
      return;
    }

    const languageFiles = fs.readdirSync(this.i18nDir).filter((file) => file.endsWith(".json"));

    for (const file of languageFiles) {
      const filePath = path.join(this.i18nDir, file);
      try {
        const content = fs.readFileSync(filePath, "utf8");
        const parsed = JSON.parse(content);
        this.lastState[file] = {
          content: content,
          keys: this.extractKeys(parsed),
          lastModified: fs.statSync(filePath).mtime,
        };
      } catch (error) {
        console.warn(`Fehler beim Lesen von ${file}:`, error.message);
      }
    }
  }

  // Dateiüberwachung starten
  startFileWatching() {
    if (!fs.existsSync(this.i18nDir)) {
      console.warn("i18n-Verzeichnis nicht gefunden");
      return;
    }

    // Überwachung des i18n-Verzeichnisses
    const watcher = fs.watch(this.i18nDir, { recursive: true }, (eventType, filename) => {
      if (filename && filename.endsWith(".json")) {
        this.handleFileChange(eventType, filename);
      }
    });

    this.watchers.push(watcher);
  }

  // Dateiänderung behandeln
  handleFileChange(eventType, filename) {
    const filePath = path.join(this.i18nDir, filename);

    console.log(`📝 Dateiänderung erkannt: ${eventType} - ${filename}`);

    try {
      const content = fs.readFileSync(filePath, "utf8");
      const parsed = JSON.parse(content);
      const currentKeys = this.extractKeys(parsed);
      const lastState = this.lastState[filename];

      if (lastState) {
        const changes = this.analyzeChanges(lastState, {
          content: content,
          keys: currentKeys,
          lastModified: fs.statSync(filePath).mtime,
        });

        if (changes.added.length > 0 || changes.removed.length > 0) {
          this.reportChanges(filename, changes);
          this.checkConsistency();
        }
      }

      // Zustand aktualisieren
      this.lastState[filename] = {
        content: content,
        keys: currentKeys,
        lastModified: fs.statSync(filePath).mtime,
      };
    } catch (error) {
      console.error(`Fehler bei der Verarbeitung von ${filename}:`, error.message);
    }
  }

  // Änderungen analysieren
  analyzeChanges(oldState, newState) {
    const added = newState.keys.filter((key) => !oldState.keys.includes(key));
    const removed = oldState.keys.filter((key) => !newState.keys.includes(key));

    return { added, removed };
  }

  // Änderungen melden
  reportChanges(filename, changes) {
    console.log(`\n📊 Änderungen in ${filename}:`);

    if (changes.added.length > 0) {
      console.log(`  ➕ Hinzugefügt: ${changes.added.length} Schlüssel`);
      changes.added.slice(0, 5).forEach((key) => {
        console.log(`    - ${key}`);
      });
      if (changes.added.length > 5) {
        console.log(`    ... und ${changes.added.length - 5} weitere`);
      }
    }

    if (changes.removed.length > 0) {
      console.log(`  ➖ Entfernt: ${changes.removed.length} Schlüssel`);
      changes.removed.slice(0, 5).forEach((key) => {
        console.log(`    - ${key}`);
      });
      if (changes.removed.length > 5) {
        console.log(`    ... und ${changes.removed.length - 5} weitere`);
      }
    }
  }

  // Konsistenz prüfen
  checkConsistency() {
    const languages = Object.keys(this.lastState);
    if (languages.length < 2) {
      return;
    }

    const baseLanguage = "de.json";
    if (!this.lastState[baseLanguage]) {
      return;
    }

    const baseKeys = this.lastState[baseLanguage].keys;
    const inconsistencies = [];

    for (const lang of languages) {
      if (lang === baseLanguage) continue;

      const langKeys = this.lastState[lang].keys;
      const missingKeys = baseKeys.filter((key) => !langKeys.includes(key));

      if (missingKeys.length > 0) {
        inconsistencies.push({
          language: lang,
          missing: missingKeys.length,
        });
      }
    }

    if (inconsistencies.length > 0) {
      console.log("\n⚠️ Konsistenzprobleme erkannt:");
      inconsistencies.forEach((issue) => {
        console.log(`  ${issue.language}: ${issue.missing} fehlende Schlüssel`);
      });
    }
  }

  // Periodische Überprüfung
  startPeriodicCheck() {
    const interval = setInterval(() => {
      if (!this.isMonitoring) {
        clearInterval(interval);
        return;
      }

      this.performPeriodicCheck();
    }, 30000); // Alle 30 Sekunden

    this.watchers.push({ close: () => clearInterval(interval) });
  }

  // Periodische Überprüfung durchführen
  performPeriodicCheck() {
    console.log("🔄 Periodische i18n-Überprüfung...");

    const currentState = {};
    const languageFiles = fs.readdirSync(this.i18nDir).filter((file) => file.endsWith(".json"));

    for (const file of languageFiles) {
      const filePath = path.join(this.i18nDir, file);
      try {
        const content = fs.readFileSync(filePath, "utf8");
        const parsed = JSON.parse(content);
        currentState[file] = this.extractKeys(parsed);
      } catch (error) {
        console.warn(`Fehler bei periodischer Überprüfung von ${file}:`, error.message);
      }
    }

    // Statistiken ausgeben
    this.printStats(currentState);
  }

  // Statistiken ausgeben
  printStats(currentState) {
    const languages = Object.keys(currentState);

    console.log(`📈 i18n-Statistiken (${languages.length} Sprachen):`);

    for (const [lang, keys] of Object.entries(currentState)) {
      console.log(`  ${lang}: ${keys.length} Schlüssel`);
    }

    // Konsistenz-Check
    if (languages.length > 1) {
      const baseKeys = currentState["de.json"] || [];
      const inconsistencies = [];

      for (const lang of languages) {
        if (lang === "de.json") continue;

        const langKeys = currentState[lang] || [];
        const missingKeys = baseKeys.filter((key) => !langKeys.includes(key));

        if (missingKeys.length > 0) {
          inconsistencies.push(`${lang}: ${missingKeys.length} fehlend`);
        }
      }

      if (inconsistencies.length > 0) {
        console.log("  ⚠️ Konsistenzprobleme:", inconsistencies.join(", "));
      } else {
        console.log("  ✅ Alle Sprachen konsistent");
      }
    }
  }

  // Schlüssel extrahieren
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

  // Blockierung setzen
  setBlocked(blocked = true) {
    const blockData = {
      blocked: blocked,
      timestamp: new Date().toISOString(),
      reason: blocked ? "i18n-Monitoring aktiv" : "Monitoring gestoppt",
    };

    try {
      fs.writeFileSync(this.monitorFile, JSON.stringify(blockData, null, 2));
      console.log(`🔒 i18n-Blockierung ${blocked ? "aktiviert" : "deaktiviert"}`);
    } catch (error) {
      console.error("Fehler beim Setzen der Blockierung:", error.message);
    }
  }

  // Blockierung prüfen
  isBlocked() {
    try {
      if (fs.existsSync(this.monitorFile)) {
        const content = fs.readFileSync(this.monitorFile, "utf8");
        const data = JSON.parse(content);
        return data.blocked === true;
      }
    } catch (error) {
      console.warn("Fehler beim Prüfen der Blockierung:", error.message);
    }
    return false;
  }

  // Status abrufen
  getStatus() {
    const status = {
      monitoring: this.isMonitoring,
      blocked: this.isBlocked(),
      languages: Object.keys(this.lastState),
      totalKeys: 0,
    };

    for (const [lang, state] of Object.entries(this.lastState)) {
      status.totalKeys += state.keys.length;
    }

    return status;
  }
}

// CLI-Schnittstelle
if (require.main === module) {
  const monitor = new I18nMonitor();

  const command = process.argv[2];

  switch (command) {
    case "start":
      monitor.setBlocked(true);
      monitor.startMonitoring();

      // Graceful Shutdown
      process.on("SIGINT", () => {
        monitor.stopMonitoring();
        monitor.setBlocked(false);
        process.exit(0);
      });
      break;

    case "stop":
      monitor.stopMonitoring();
      monitor.setBlocked(false);
      break;

    case "status":
      const status = monitor.getStatus();
      console.log(JSON.stringify(status, null, 2));
      break;

    case "blocked":
      console.log(monitor.isBlocked());
      break;

    default:
      console.log("Verwendung: node i18n-monitor.js [start|stop|status|blocked]");
  }
}

module.exports = I18nMonitor;
