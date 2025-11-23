#!/usr/bin/env node

/**
 * 🛡️ Lopez IT Welt – Enterprise++ Backup Scheduler
 *
 * Automatische Backup-Planung:
 * - Täglich 23:00 Uhr: Vollbackup
 * - Alle 2 Stunden: Inkrementelles Backup
 * - Sonntag 02:00 Uhr: Wöchentliches System-Backup
 *
 * @author Lopez IT Welt
 * @version 1.0.0
 * @date 2024-01-15
 */

const cron = require("node-cron");
const { performBackup } = require("./backup-system");
const fs = require("fs");
const path = require("path");

// Konfiguration
const CONFIG = {
  LOG_FILE: "D:\\Backups\\scheduler.log",
  ENABLE_LOGGING: true,
  BACKUP_TYPES: {
    DAILY: "full",
    INCREMENTAL: "incremental",
    WEEKLY: "full",
  },
};

/**
 * Logging-Funktion
 */
function log(message, level = "INFO") {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;

  console.log(logMessage);

  if (CONFIG.ENABLE_LOGGING) {
    try {
      // Log-Verzeichnis erstellen falls nicht vorhanden
      const logDir = path.dirname(CONFIG.LOG_FILE);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      // Log-Datei anhängen
      fs.appendFileSync(CONFIG.LOG_FILE, logMessage + "\n");
    } catch (error) {
      console.error("Logging-Fehler:", error);
    }
  }
}

/**
 * Backup mit Fehlerbehandlung
 */
async function safeBackup(type, description) {
  try {
    log(`🛡️ ${description} gestartet...`);

    const result = await performBackup(type);

    if (result.success) {
      log(`✅ ${description} erfolgreich abgeschlossen`, "SUCCESS");
      return true;
    } else {
      log(`❌ ${description} fehlgeschlagen: ${result.error}`, "ERROR");
      return false;
    }
  } catch (error) {
    log(`❌ ${description} Fehler: ${error.message}`, "ERROR");
    return false;
  }
}

/**
 * Scheduler starten
 */
function startScheduler() {
  log("🚀 Enterprise++ Backup Scheduler gestartet");

  // Täglich um 23:00 Uhr - Vollbackup
  cron.schedule(
    "0 23 * * *",
    async () => {
      await safeBackup(CONFIG.BACKUP_TYPES.DAILY, "Tägliches Vollbackup");
    },
    {
      scheduled: true,
      timezone: "Europe/Berlin",
    },
  );

  // Alle 2 Stunden - Inkrementelles Backup (außer 23:00 Uhr)
  cron.schedule(
    "0 */2 * * *",
    async () => {
      const now = new Date();
      const hour = now.getHours();

      // Nicht um 23:00 Uhr (da läuft das Vollbackup)
      if (hour !== 23) {
        await safeBackup(CONFIG.BACKUP_TYPES.INCREMENTAL, "Inkrementelles Backup");
      }
    },
    {
      scheduled: true,
      timezone: "Europe/Berlin",
    },
  );

  // Sonntag um 02:00 Uhr - Wöchentliches System-Backup
  cron.schedule(
    "0 2 * * 0",
    async () => {
      await safeBackup(CONFIG.BACKUP_TYPES.WEEKLY, "Wöchentliches System-Backup");
    },
    {
      scheduled: true,
      timezone: "Europe/Berlin",
    },
  );

  // Jeden Tag um 06:00 Uhr - Backup-Validierung
  cron.schedule(
    "0 6 * * *",
    async () => {
      log("🔍 Tägliche Backup-Validierung gestartet...");

      try {
        // Backup-Status prüfen
        const backupDir = "D:\\Backups";
        const mysqlDir = path.join(backupDir, "mysql");
        const projectDir = path.join(backupDir, "project");

        const fs = require("fs");

        // MySQL-Backups prüfen
        if (fs.existsSync(mysqlDir)) {
          const mysqlFiles = fs
            .readdirSync(mysqlDir)
            .filter((file) => file.endsWith(".json"))
            .sort((a, b) => {
              const aPath = path.join(mysqlDir, a);
              const bPath = path.join(mysqlDir, b);
              return fs.statSync(bPath).mtime - fs.statSync(aPath).mtime;
            });

          if (mysqlFiles.length > 0) {
            const lastBackup = mysqlFiles[0];
            const lastBackupTime = fs.statSync(path.join(mysqlDir, lastBackup)).mtime;
            const hoursSinceBackup = (Date.now() - lastBackupTime.getTime()) / (1000 * 60 * 60);

            if (hoursSinceBackup > 25) {
              log(
                `⚠️ Letztes MySQL-Backup ist ${Math.round(hoursSinceBackup)} Stunden alt`,
                "WARNING",
              );
            } else {
              log(`✅ MySQL-Backup aktuell (${Math.round(hoursSinceBackup)}h alt)`);
            }
          } else {
            log("⚠️ Keine MySQL-Backups gefunden", "WARNING");
          }
        }

        // Projekt-Backups prüfen
        if (fs.existsSync(projectDir)) {
          const projectFiles = fs
            .readdirSync(projectDir)
            .filter((file) => file.endsWith(".json"))
            .sort((a, b) => {
              const aPath = path.join(projectDir, a);
              const bPath = path.join(projectDir, b);
              return fs.statSync(bPath).mtime - fs.statSync(aPath).mtime;
            });

          if (projectFiles.length > 0) {
            const lastBackup = projectFiles[0];
            const lastBackupTime = fs.statSync(path.join(projectDir, lastBackup)).mtime;
            const hoursSinceBackup = (Date.now() - lastBackupTime.getTime()) / (1000 * 60 * 60);

            if (hoursSinceBackup > 25) {
              log(
                `⚠️ Letztes Projekt-Backup ist ${Math.round(hoursSinceBackup)} Stunden alt`,
                "WARNING",
              );
            } else {
              log(`✅ Projekt-Backup aktuell (${Math.round(hoursSinceBackup)}h alt)`);
            }
          } else {
            log("⚠️ Keine Projekt-Backups gefunden", "WARNING");
          }
        }

        log("✅ Backup-Validierung abgeschlossen");
      } catch (error) {
        log(`❌ Backup-Validierung Fehler: ${error.message}`, "ERROR");
      }
    },
    {
      scheduled: true,
      timezone: "Europe/Berlin",
    },
  );

  log("📅 Alle Backup-Zeitpläne aktiviert");
  log("⏰ Zeitpläne:");
  log("  - Täglich 23:00 Uhr: Vollbackup");
  log("  - Alle 2 Stunden: Inkrementelles Backup");
  log("  - Sonntag 02:00 Uhr: Wöchentliches System-Backup");
  log("  - Täglich 06:00 Uhr: Backup-Validierung");
}

/**
 * Scheduler stoppen
 */
function stopScheduler() {
  log("🛑 Backup Scheduler gestoppt");
  cron.getTasks().forEach((task) => {
    task.stop();
  });
}

/**
 * CLI-Interface
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0] || "start";

  switch (command) {
    case "start":
      startScheduler();
      // Scheduler läuft weiter
      process.on("SIGINT", () => {
        log("🛑 Scheduler wird beendet...");
        stopScheduler();
        process.exit(0);
      });
      break;

    case "stop":
      stopScheduler();
      process.exit(0);
      break;

    case "status":
      const tasks = cron.getTasks();
      log(`📊 Aktive Tasks: ${tasks.size}`);
      tasks.forEach((task, name) => {
        log(`  - ${name}: ${task.running ? "Läuft" : "Gestoppt"}`);
      });
      process.exit(0);
      break;

    default:
      console.log("Verwendung: node backup-scheduler.js [start|stop|status]");
      process.exit(1);
  }
}

module.exports = {
  startScheduler,
  stopScheduler,
};
