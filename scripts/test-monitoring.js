/**
 * 🧪 Test-Skript für Cursor-Monitoring-System
 * Testet die Überwachung und Anti-Regelbruch-Funktionen
 *
 * @author Ramiro Lopez Rodriguez
 * @version 1.0.0
 * @date 2025-01-19
 */

// 🛡️ ANTI-REGELBRUCH-SYSTEM STATUS
class MonitoringStatus {
  constructor() {
    this.antiRuleBreakActive = false;
    this.agentsActive = false;
    this.enterpriseRulesLoaded = false;
    this.monitoringActive = false;
    this.systemTimeValidated = false;
    this.mdStructureProtected = false;
    this.approvalRequired = true;
    this.lastCheck = new Date().toISOString();
    this.violationCount = 0;
    this.blockedActions = [];
  }
}

// 🚨 VERSTOSS-RECORD
class ViolationRecord {
  constructor(action, rule, reason, file) {
    this.timestamp = new Date().toISOString();
    this.action = action;
    this.rule = rule;
    this.reason = reason;
    this.file = file;
    this.blocked = true;
  }
}

/**
 * 🛡️ Cursor-Monitoring-System
 */
class CursorMonitor {
  constructor() {
    this.status = new MonitoringStatus();
    this.violations = [];
    this.isMonitoring = false;
    this.approvalGiven = false;
  }

  /**
   * 🚀 Monitoring-System starten
   */
  startMonitoring() {
    console.log("🚀 Cursor-Monitoring-System wird gestartet...");

    this.isMonitoring = true;
    this.status.monitoringActive = true;
    this.status.antiRuleBreakActive = true;
    this.status.agentsActive = true;
    this.status.enterpriseRulesLoaded = true;
    this.status.systemTimeValidated = this.validateSystemTime();
    this.status.mdStructureProtected = true;
    this.status.lastCheck = new Date().toISOString();

    // Sichtbare Status-Anzeige
    this.showStatus();

    console.log("✅ Cursor-Monitoring-System gestartet");
  }

  /**
   * 📊 Status anzeigen
   */
  showStatus() {
    console.log("\n🛡️ CURSOR-MONITORING STATUS:");
    console.log("==============================");
    console.log(
      `✅ Anti-Regelbruch-System: ${this.status.antiRuleBreakActive ? "AKTIV" : "INAKTIV"}`,
    );
    console.log(`✅ Agenten: ${this.status.agentsActive ? "AKTIV" : "INAKTIV"}`);
    console.log(
      `✅ Enterprise-Regeln: ${this.status.enterpriseRulesLoaded ? "GELADEN" : "NICHT GELADEN"}`,
    );
    console.log(`✅ Überwachung: ${this.status.monitoringActive ? "AKTIV" : "INAKTIV"}`);
    console.log(
      `⏰ System-Zeit: ${this.status.systemTimeValidated ? "VALIDIERT" : "NICHT VALIDIERT"}`,
    );
    console.log(
      `📄 Md-Struktur: ${this.status.mdStructureProtected ? "GESCHÜTZT" : "NICHT GESCHÜTZT"}`,
    );
    console.log(`🔒 Freigabe: ${this.status.approvalRequired ? "ERFORDERLICH" : "ERLAUBT"}`);
    console.log(`🚨 Verstöße: ${this.status.violationCount}`);
    console.log(`📅 Letzte Prüfung: ${this.status.lastCheck}`);
    console.log("==============================\n");
  }

  /**
   * 🔍 Vor jeder Aktion prüfen
   */
  validateBeforeAction(action, targetFile) {
    console.log(`🛡️ Validierung vor Aktion: ${action}`);

    // 1. System-Zeit prüfen
    if (!this.status.systemTimeValidated) {
      this.recordViolation(action, "System-Zeit", "System-Zeit nicht validiert", targetFile);
      return false;
    }

    // 2. Freigabe prüfen
    if (this.status.approvalRequired && !this.approvalGiven) {
      this.recordViolation(action, "Freigabe", "Keine Freigabe vorhanden", targetFile);
      return false;
    }

    // 3. Md-Struktur prüfen
    if (targetFile && this.isMdFile(targetFile)) {
      if (!this.status.mdStructureProtected) {
        this.recordViolation(action, "Md-Struktur", "Md-Struktur nicht geschützt", targetFile);
        return false;
      }
    }

    // 4. Datumskopieren prüfen
    if (this.containsDateCopying(action)) {
      this.recordViolation(action, "Datumsvalidierung", "Datumskopieren erkannt", targetFile);
      return false;
    }

    console.log(`✅ Aktion genehmigt: ${action}`);
    return true;
  }

  /**
   * 🚨 Verstoß dokumentieren
   */
  recordViolation(action, rule, reason, file) {
    const violation = new ViolationRecord(action, rule, reason, file);

    this.violations.push(violation);
    this.status.violationCount++;
    this.status.blockedActions.push(action);

    console.log(`🚨 VERSTOSS ERKANNT:`);
    console.log(`   Aktion: ${action}`);
    console.log(`   Regel: ${rule}`);
    console.log(`   Grund: ${reason}`);
    console.log(`   Datei: ${file || "N/A"}`);
    console.log(`   Status: BLOCKIERT`);
  }

  /**
   * ⏰ System-Zeit validieren
   */
  validateSystemTime() {
    const currentTime = new Date();
    const minValidDate = new Date("2025-01-01");

    if (currentTime < minValidDate) {
      console.log("❌ System-Zeit nicht validiert: Datum in der Vergangenheit");
      return false;
    }

    console.log("✅ System-Zeit validiert");
    return true;
  }

  /**
   * 📄 Md-Datei prüfen
   */
  isMdFile(filename) {
    return filename.endsWith(".md");
  }

  /**
   * 📅 Datumskopieren prüfen
   */
  containsDateCopying(action) {
    const datePatterns = [
      /\d{4}-\d{2}-\d{2}/,
      /\d{2}\.\d{2}\.\d{4}/,
      /\d{1,2}\/\d{1,2}\/\d{4}/,
      /heute|gestern|morgen/i,
      /januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember/i,
    ];

    return datePatterns.some((pattern) => pattern.test(action));
  }

  /**
   * ✅ Freigabe erteilen
   */
  grantApproval() {
    this.approvalGiven = true;
    this.status.approvalRequired = false;
    console.log("✅ Freigabe erteilt");
  }

  /**
   * 📊 Verstöße anzeigen
   */
  showViolations() {
    console.log("\n🚨 VERSTOSS-HISTORIE:");
    console.log("=====================");

    if (this.violations.length === 0) {
      console.log("✅ Keine Verstöße registriert");
    } else {
      this.violations.forEach((violation, index) => {
        console.log(`${index + 1}. ${violation.timestamp}`);
        console.log(`   Aktion: ${violation.action}`);
        console.log(`   Regel: ${violation.rule}`);
        console.log(`   Grund: ${violation.reason}`);
        console.log(`   Datei: ${violation.file || "N/A"}`);
        console.log(`   Status: ${violation.blocked ? "BLOCKIERT" : "ERLAUBT"}`);
        console.log("");
      });
    }
  }
}

// 🧪 TEST-AUSFÜHRUNG
console.log("🧪 CURSOR-MONITORING TEST STARTET...");
console.log("=====================================");

const monitor = new CursorMonitor();

// 1. Monitoring starten
console.log("\n1️⃣ Monitoring-System starten...");
monitor.startMonitoring();

// 2. Status anzeigen
console.log("\n2️⃣ Status anzeigen...");
monitor.showStatus();

// 3. Test ohne Freigabe (sollte blockiert werden)
console.log("\n3️⃣ Test ohne Freigabe...");
const test1 = monitor.validateBeforeAction("Datei bearbeiten", "test.md");
console.log(`Ergebnis: ${test1 ? "ERLAUBT" : "BLOCKIERT"}`);

// 4. Freigabe erteilen
console.log("\n4️⃣ Freigabe erteilen...");
monitor.grantApproval();

// 5. Test mit Freigabe (sollte erlaubt werden)
console.log("\n5️⃣ Test mit Freigabe...");
const test2 = monitor.validateBeforeAction("Datei bearbeiten", "test.md");
console.log(`Ergebnis: ${test2 ? "ERLAUBT" : "BLOCKIERT"}`);

// 6. Datumskopieren testen (sollte blockiert werden)
console.log("\n6️⃣ Datumskopieren testen...");
const test3 = monitor.validateBeforeAction("Datum 2025-01-19 kopieren", "test.md");
console.log(`Ergebnis: ${test3 ? "ERLAUBT" : "BLOCKIERT"}`);

// 7. Verstöße anzeigen
console.log("\n7️⃣ Verstöße anzeigen...");
monitor.showViolations();

// 8. Finaler Status
console.log("\n8️⃣ Finaler Status...");
monitor.showStatus();

console.log("\n✅ CURSOR-MONITORING TEST ABGESCHLOSSEN");
console.log("=====================================");
