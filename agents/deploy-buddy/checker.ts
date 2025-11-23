import ContextLoader from "../shared/context-loader";
import Logger, { LogLevel } from "../shared/logger";

// Beispiel-Policy: 4-Augen-Prinzip
const REQUIRED_APPROVERS = 2;

async function main() {
  const logger = new Logger("Deploy-Buddy", LogLevel.INFO, "deploy-buddy.log");
  logger.info("Starte Deploy-Buddy-Agenten...");

  // Lade Kontext (z.B. aktuelle Deployments, Policies)
  const contextLoader = new ContextLoader();
  const ciConfig = await contextLoader.loadCIConfig();

  // Simuliere Benutzerabfrage (Platzhalter)
  const approvers = [
    { name: "Alice", approved: true },
    { name: "Bob", approved: false },
    { name: "Charlie", approved: true },
  ];
  const approvedCount = approvers.filter((a) => a.approved).length;

  logger.info(`Genehmiger gefunden: ${approvedCount}/${REQUIRED_APPROVERS}`);

  if (approvedCount >= REQUIRED_APPROVERS) {
    logger.info("Deployment-Freigabe erteilt.");
    process.exit(0);
  } else {
    logger.warn("Deployment-Freigabe verweigert: Nicht genügend Genehmiger.");
    process.exit(1);
  }
}

main().catch((err) => {
  // Fehlerbehandlung
  // @ts-ignore
  const logger = new Logger("Deploy-Buddy", LogLevel.ERROR, "deploy-buddy.log");
  logger.error("Fehler im Deploy-Buddy-Agenten", err);
  process.exit(2);
});
