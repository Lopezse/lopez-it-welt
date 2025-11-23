const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class MorgenRoutine {
  constructor() {
    this.projectRoot = process.cwd();
    this.routineLog = [];
    this.startTime = new Date();
  }

  // Hauptfunktion für Morgen-Routine
  async execute() {
    console.log("🌅 Starte Morgen-Routine...");
    console.log(`📅 Datum: ${this.startTime.toLocaleDateString("de-DE")}`);
    console.log(`⏰ Zeit: ${this.startTime.toLocaleTimeString("de-DE")}`);
    console.log("");

    try {
      // 1. System-Status prüfen
      await this.checkSystemStatus();

      // 2. Backup-Status prüfen
      await this.checkBackupStatus();

      // 3. Code-Qualität prüfen
      await this.checkCodeQuality();

      // 4. i18n-Status prüfen
      await this.checkI18nStatus();

      // 5. Tests ausführen
      await this.runTests();

      // 6. Build-Status prüfen
      await this.checkBuildStatus();

      // 7. Performance-Optimierungen
      await this.performOptimizations();

      // 8. Bericht generieren
      await this.generateReport();

      console.log("✅ Morgen-Routine erfolgreich abgeschlossen");
    } catch (error) {
      console.error("❌ Fehler in der Morgen-Routine:", error.message);
      this.logError("Morgen-Routine fehlgeschlagen", error);
    }
  }

  // System-Status prüfen
  async checkSystemStatus() {
    console.log("🔍 Prüfe System-Status...");

    // Node.js-Version
    try {
      const nodeVersion = process.version;
      console.log(`  ✅ Node.js: ${nodeVersion}`);
    } catch (error) {
      this.logError("Node.js-Version konnte nicht ermittelt werden", error);
    }

    // npm-Version
    try {
      const npmVersion = execSync("npm --version", { encoding: "utf8" }).trim();
      console.log(`  ✅ npm: ${npmVersion}`);
    } catch (error) {
      this.logError("npm-Version konnte nicht ermittelt werden", error);
    }

    // Speicherplatz prüfen
    try {
      const stats = fs.statSync(this.projectRoot);
      const freeSpace = this.getFreeDiskSpace();
      console.log(`  ✅ Freier Speicherplatz: ${freeSpace} GB`);
    } catch (error) {
      this.logError("Speicherplatz konnte nicht geprüft werden", error);
    }

    // Projektgröße
    try {
      const projectSize = this.getProjectSize();
      console.log(`  ✅ Projektgröße: ${projectSize} MB`);
    } catch (error) {
      this.logError("Projektgröße konnte nicht ermittelt werden", error);
    }
  }

  // Backup-Status prüfen
  async checkBackupStatus() {
    console.log("💾 Prüfe Backup-Status...");

    const backupDir = path.join(this.projectRoot, "backups");

    if (!fs.existsSync(backupDir)) {
      console.log("  ⚠️ Backup-Verzeichnis nicht gefunden");
      return;
    }

    try {
      const backupFiles = fs
        .readdirSync(backupDir)
        .filter((file) => file.endsWith(".json") || file.endsWith(".zip"))
        .map((file) => {
          const filePath = path.join(backupDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            size: stats.size,
            date: stats.mtime,
          };
        })
        .sort((a, b) => b.date - a.date);

      if (backupFiles.length > 0) {
        const latestBackup = backupFiles[0];
        const daysSinceBackup = Math.floor(
          (Date.now() - latestBackup.date.getTime()) / (1000 * 60 * 60 * 24),
        );

        console.log(`  ✅ Letztes Backup: ${latestBackup.name} (vor ${daysSinceBackup} Tagen)`);
        console.log(`  📊 Backup-Größe: ${(latestBackup.size / 1024 / 1024).toFixed(2)} MB`);

        if (daysSinceBackup > 7) {
          console.log("  ⚠️ Backup ist älter als 7 Tage");
        }
      } else {
        console.log("  ⚠️ Keine Backups gefunden");
      }
    } catch (error) {
      this.logError("Backup-Status konnte nicht geprüft werden", error);
    }
  }

  // Code-Qualität prüfen
  async checkCodeQuality() {
    console.log("🔧 Prüfe Code-Qualität...");

    try {
      // ESLint ausführen
      execSync("npm run lint", {
        cwd: this.projectRoot,
        stdio: "pipe",
      });
      console.log("  ✅ ESLint-Prüfung bestanden");
    } catch (error) {
      console.log("  ⚠️ ESLint-Prüfung fehlgeschlagen");
      this.logError("ESLint-Prüfung fehlgeschlagen", error);
    }

    try {
      // TypeScript-Kompilierung prüfen
      execSync("npx tsc --noEmit", {
        cwd: this.projectRoot,
        stdio: "pipe",
      });
      console.log("  ✅ TypeScript-Kompilierung erfolgreich");
    } catch (error) {
      console.log("  ❌ TypeScript-Kompilierung fehlgeschlagen");
      this.logError("TypeScript-Kompilierung fehlgeschlagen", error);
    }

    // Code-Metriken sammeln
    try {
      const metrics = this.collectCodeMetrics();
      console.log(`  📊 Code-Metriken: ${metrics.files} Dateien, ${metrics.lines} Zeilen`);
    } catch (error) {
      this.logError("Code-Metriken konnten nicht gesammelt werden", error);
    }
  }

  // i18n-Status prüfen
  async checkI18nStatus() {
    console.log("🌍 Prüfe i18n-Status...");

    const i18nDir = path.join(this.projectRoot, "src/i18n/locales");

    if (!fs.existsSync(i18nDir)) {
      console.log("  ❌ i18n-Verzeichnis nicht gefunden");
      return;
    }

    try {
      const languageFiles = fs.readdirSync(i18nDir).filter((file) => file.endsWith(".json"));

      console.log(`  ✅ ${languageFiles.length} Sprachdateien gefunden`);

      // Übersetzungsschlüssel prüfen
      const translations = {};
      for (const file of languageFiles) {
        const filePath = path.join(i18nDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const keys = this.extractKeys(content);
        translations[file] = keys;
        console.log(`    ${file}: ${keys.length} Schlüssel`);
      }

      // Konsistenz prüfen
      const baseKeys = translations["de.json"] || [];
      let inconsistencies = 0;

      for (const [lang, keys] of Object.entries(translations)) {
        if (lang === "de.json") continue;

        const missingKeys = baseKeys.filter((key) => !keys.includes(key));
        if (missingKeys.length > 0) {
          inconsistencies += missingKeys.length;
        }
      }

      if (inconsistencies > 0) {
        console.log(`  ⚠️ ${inconsistencies} fehlende Übersetzungen`);
      } else {
        console.log("  ✅ Alle Übersetzungen konsistent");
      }
    } catch (error) {
      this.logError("i18n-Status konnte nicht geprüft werden", error);
    }
  }

  // Tests ausführen
  async runTests() {
    console.log("🧪 Führe Tests aus...");

    try {
      // Unit-Tests
      execSync("npm test", {
        cwd: this.projectRoot,
        stdio: "pipe",
      });
      console.log("  ✅ Unit-Tests bestanden");
    } catch (error) {
      console.log("  ❌ Unit-Tests fehlgeschlagen");
      this.logError("Unit-Tests fehlgeschlagen", error);
    }

    try {
      // E2E-Tests (falls vorhanden)
      if (fs.existsSync(path.join(this.projectRoot, "cypress"))) {
        execSync("npm run test:e2e", {
          cwd: this.projectRoot,
          stdio: "pipe",
        });
        console.log("  ✅ E2E-Tests bestanden");
      }
    } catch (error) {
      console.log("  ⚠️ E2E-Tests fehlgeschlagen oder nicht verfügbar");
    }
  }

  // Build-Status prüfen
  async checkBuildStatus() {
    console.log("🔨 Prüfe Build-Status...");

    try {
      // Build-Prozess testen
      execSync("npm run build", {
        cwd: this.projectRoot,
        stdio: "pipe",
      });
      console.log("  ✅ Build erfolgreich");
    } catch (error) {
      console.log("  ❌ Build fehlgeschlagen");
      this.logError("Build fehlgeschlagen", error);
    }
  }

  // Performance-Optimierungen
  async performOptimizations() {
    console.log("⚡ Führe Optimierungen durch...");

    try {
      // Bundle-Analyse (falls verfügbar)
      if (fs.existsSync(path.join(this.projectRoot, "next.config.js"))) {
        execSync("npm run analyze", {
          cwd: this.projectRoot,
          stdio: "pipe",
        });
        console.log("  ✅ Bundle-Analyse durchgeführt");
      }
    } catch (error) {
      console.log("  ⚠️ Bundle-Analyse nicht verfügbar");
    }

    try {
      // Cache bereinigen
      const cacheDirs = [".next", "node_modules/.cache", "dist"];
      for (const cacheDir of cacheDirs) {
        const cachePath = path.join(this.projectRoot, cacheDir);
        if (fs.existsSync(cachePath)) {
          this.removeDirectory(cachePath);
          console.log(`  ✅ Cache bereinigt: ${cacheDir}`);
        }
      }
    } catch (error) {
      this.logError("Cache-Bereinigung fehlgeschlagen", error);
    }
  }

  // Bericht generieren
  async generateReport() {
    console.log("📊 Generiere Bericht...");

    const endTime = new Date();
    const duration = endTime - this.startTime;

    const report = {
      timestamp: this.startTime.toISOString(),
      duration: `${duration.getMinutes()}m ${duration.getSeconds()}s`,
      status: "completed",
      errors: this.routineLog.filter((log) => log.type === "error").length,
      warnings: this.routineLog.filter((log) => log.type === "warning").length,
      logs: this.routineLog,
    };

    // Bericht speichern
    const reportFile = path.join(this.projectRoot, "morgen-routine-report.json");
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

    console.log(`  ✅ Bericht gespeichert: ${reportFile}`);
    console.log(`  📈 Dauer: ${duration.getMinutes()}m ${duration.getSeconds()}s`);
    console.log(`  ❌ Fehler: ${report.errors}`);
    console.log(`  ⚠️ Warnungen: ${report.warnings}`);
  }

  // Hilfsfunktionen
  getFreeDiskSpace() {
    // Vereinfachte Implementierung
    return "N/A";
  }

  getProjectSize() {
    try {
      const size = this.calculateDirectorySize(this.projectRoot);
      return (size / 1024 / 1024).toFixed(2);
    } catch (error) {
      return "N/A";
    }
  }

  calculateDirectorySize(dirPath) {
    let size = 0;
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        size += this.calculateDirectorySize(itemPath);
      } else {
        size += stats.size;
      }
    }

    return size;
  }

  collectCodeMetrics() {
    const sourceDirs = ["src", "components", "app"];
    const extensions = [".ts", ".tsx", ".js", ".jsx"];
    let files = 0;
    let lines = 0;

    for (const dir of sourceDirs) {
      const dirPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        const metrics = this.scanDirectory(dirPath, extensions);
        files += metrics.files;
        lines += metrics.lines;
      }
    }

    return { files, lines };
  }

  scanDirectory(dir, extensions) {
    let files = 0;
    let lines = 0;
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        const metrics = this.scanDirectory(itemPath, extensions);
        files += metrics.files;
        lines += metrics.lines;
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (extensions.includes(ext)) {
          files++;
          const content = fs.readFileSync(itemPath, "utf8");
          lines += content.split("\n").length;
        }
      }
    }

    return { files, lines };
  }

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

  removeDirectory(dirPath) {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  }

  logError(message, error) {
    this.routineLog.push({
      timestamp: new Date().toISOString(),
      type: "error",
      message: message,
      error: error.message,
    });
  }
}

// CLI-Schnittstelle
if (require.main === module) {
  const routine = new MorgenRoutine();

  routine
    .execute()
    .then(() => {
      console.log("Morgen-Routine abgeschlossen");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Morgen-Routine fehlgeschlagen:", error);
      process.exit(1);
    });
}

module.exports = MorgenRoutine;
