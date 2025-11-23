import ContextLoader from "../shared/context-loader";
import Logger, { LogLevel } from "../shared/logger";

// Schwellenwerte für Alerts
const THRESHOLDS = {
  CPU_USAGE: 80, // Prozent
  MEMORY_USAGE: 85, // Prozent
  DISK_USAGE: 90, // Prozent
};

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  timestamp: string;
}

async function getSystemMetrics(): Promise<SystemMetrics> {
  // Simuliere System-Metriken (in echtem Einsatz: os.cpus(), os.freemem(), etc.)
  const cpu = Math.random() * 100;
  const memory = Math.random() * 100;
  const disk = Math.random() * 100;

  return {
    cpu: Math.round(cpu * 100) / 100,
    memory: Math.round(memory * 100) / 100,
    disk: Math.round(disk * 100) / 100,
    timestamp: new Date().toISOString(),
  };
}

async function checkAlerts(metrics: SystemMetrics): Promise<string[]> {
  const alerts: string[] = [];

  if (metrics.cpu > THRESHOLDS.CPU_USAGE) {
    alerts.push(`⚠️ CPU-Auslastung kritisch: ${metrics.cpu}%`);
  }
  if (metrics.memory > THRESHOLDS.MEMORY_USAGE) {
    alerts.push(`⚠️ Speicherauslastung kritisch: ${metrics.memory}%`);
  }
  if (metrics.disk > THRESHOLDS.DISK_USAGE) {
    alerts.push(`⚠️ Festplattenauslastung kritisch: ${metrics.disk}%`);
  }

  return alerts;
}

async function main() {
  const logger = new Logger("Monitoring-Wächter", LogLevel.INFO, "monitoring.log");
  logger.info("Starte Monitoring-Wächter...");

  // Lade Kontext
  const contextLoader = new ContextLoader();
  const status = await contextLoader.loadStatus();

  // Hole System-Metriken
  const metrics = await getSystemMetrics();
  logger.info(
    `System-Metriken: CPU=${metrics.cpu}%, Memory=${metrics.memory}%, Disk=${metrics.disk}%`,
  );

  // Prüfe auf Alerts
  const alerts = await checkAlerts(metrics);

  if (alerts.length > 0) {
    logger.warn(`${alerts.length} Alert(s) gefunden:`);
    alerts.forEach((alert) => logger.warn(alert));

    // In echtem Einsatz: Slack-Webhook, Email, etc.
    logger.info("Alerts würden jetzt gesendet werden (Slack, Email, etc.)");

    process.exit(1); // Alert-Exit-Code
  } else {
    logger.info("✅ Alle System-Metriken im grünen Bereich");
    process.exit(0);
  }
}

main().catch((err) => {
  const logger = new Logger("Monitoring-Wächter", LogLevel.ERROR, "monitoring.log");
  logger.error("Fehler im Monitoring-Wächter", err);
  process.exit(2);
});
