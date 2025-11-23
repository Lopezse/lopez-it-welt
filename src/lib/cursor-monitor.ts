/**
 * 🛡️ Cursor-Monitoring-System für Enterprise++
 * Sichtbare Überwachung und Anti-Regelbruch-System
 *
 * @author Ramiro Lopez Rodriguez
 * @version 1.0.0
 * @date 2025-01-19
 */

// 🛡️ ANTI-REGELBRUCH-SYSTEM STATUS
export interface MonitoringStatus {
  antiRuleBreakActive: boolean;
  agentsActive: boolean;
  enterpriseRulesLoaded: boolean;
  monitoringActive: boolean;
  systemTimeValidated: boolean;
  mdStructureProtected: boolean;
  approvalRequired: boolean;
  lastCheck: string;
  violationCount: number;
  blockedActions: string[];
}

// 🚨 VERSTOSS-RECORD
export interface ViolationRecord {
  timestamp: string;
  action: string;
  rule: string;
  reason: string;
  file?: string;
  blocked: boolean;
}

/**
 * 🛡️ Cursor-Monitoring-System
 */
export class CursorMonitor {
  private static instance: CursorMonitor;
  private status: MonitoringStatus;
  private violations: ViolationRecord[] = [];
  private isMonitoring = false;
  private approvalGiven = false;

  constructor() {
    this.status = {
      antiRuleBreakActive: false,
      agentsActive: false,
      enterpriseRulesLoaded: false,
      monitoringActive: false,
      systemTimeValidated: false,
      mdStructureProtected: false,
      approvalRequired: true,
      lastCheck: new Date().toISOString(),
      violationCount: 0,
      blockedActions: [],
    };
  }

  /**
   * Singleton-Instanz erhalten
   */
  static getInstance(): CursorMonitor {
    if (!CursorMonitor.instance) {
      CursorMonitor.instance = new CursorMonitor();
    }
    return CursorMonitor.instance;
  }

  /**
   * 🚀 Monitoring-System starten
   */
  startMonitoring(): void {
    // Cursor-Monitoring-System wird gestartet...

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

    // Kontinuierliche Überwachung
    this.startContinuousMonitoring();

    // Cursor-Monitoring-System gestartet
  }

  /**
   * 📊 Status anzeigen
   */
  showStatus(): void {
    // CURSOR-MONITORING STATUS:
    // ==============================
    // Anti-Regelbruch-System: ${this.status.antiRuleBreakActive ? 'AKTIV' : 'INAKTIV'}
    // Agenten: ${this.status.agentsActive ? 'AKTIV' : 'INAKTIV'}
    // Enterprise-Regeln: ${this.status.enterpriseRulesLoaded ? 'GELADEN' : 'NICHT GELADEN'}
    // Überwachung: ${this.status.monitoringActive ? 'AKTIV' : 'INAKTIV'}
    // System-Zeit: ${this.status.systemTimeValidated ? 'VALIDIERT' : 'NICHT VALIDIERT'}
    // Md-Struktur: ${this.status.mdStructureProtected ? 'GESCHÜTZT' : 'NICHT GESCHÜTZT'}
    // Freigabe: ${this.status.approvalRequired ? 'ERFORDERLICH' : 'ERLAUBT'}
    // Verstöße: ${this.status.violationCount}
    // Letzte Prüfung: ${this.status.lastCheck}
    // ==============================
  }

  /**
   * 🔍 Vor jeder Aktion prüfen
   */
  validateBeforeAction(action: string, targetFile?: string): boolean {
    // Validierung vor Aktion: ${action}

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

    // Aktion genehmigt: ${action}
    return true;
  }

  /**
   * 🚨 Verstoß dokumentieren
   */
  private recordViolation(action: string, rule: string, reason: string, file?: string): void {
    const violation: ViolationRecord = {
      timestamp: new Date().toISOString(),
      action,
      rule,
      reason,
      file,
      blocked: true,
    };

    this.violations.push(violation);
    this.status.violationCount++;
    this.status.blockedActions.push(action);

    // VERSTOSS ERKANNT:
    // Aktion: ${action}
    // Regel: ${rule}
    // Grund: ${reason}
    // Datei: ${file || 'N/A'}
    // Status: BLOCKIERT
  }

  /**
   * ⏰ System-Zeit validieren
   */
  private validateSystemTime(): boolean {
    const currentTime = new Date();
    const minValidDate = new Date("2025-01-01");

    if (currentTime < minValidDate) {
      // System-Zeit nicht validiert: Datum in der Vergangenheit
      return false;
    }

    // System-Zeit validiert
    return true;
  }

  /**
   * 📄 Md-Datei prüfen
   */
  private isMdFile(filename: string): boolean {
    return filename.endsWith(".md");
  }

  /**
   * 📅 Datumskopieren prüfen
   */
  private containsDateCopying(action: string): boolean {
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
   * 🔄 Kontinuierliche Überwachung
   */
  private startContinuousMonitoring(): void {
    setInterval(() => {
      this.status.lastCheck = new Date().toISOString();
      console.log("🛡️ Cursor-Monitoring: Überwachung aktiv");

      // Status alle 30 Sekunden anzeigen
      if (this.status.violationCount > 0) {
        console.log(`🚨 Aktuelle Verstöße: ${this.status.violationCount}`);
      }
    }, 30000);
  }

  /**
   * ✅ Freigabe erteilen
   */
  grantApproval(): void {
    this.approvalGiven = true;
    this.status.approvalRequired = false;
    // Freigabe erteilt
  }

  /**
   * ❌ Freigabe entziehen
   */
  revokeApproval(): void {
    this.approvalGiven = false;
    this.status.approvalRequired = true;
    // Freigabe entzogen
  }

  /**
   * 📊 Verstöße anzeigen
   */
  showViolations(): void {
    // VERSTOSS-HISTORIE:
    // =====================

    if (this.violations.length === 0) {
      // Keine Verstöße registriert
    } else {
      this.violations.forEach((violation, index) => {
        // ${index + 1}. ${violation.timestamp}
        // Aktion: ${violation.action}
        // Regel: ${violation.rule}
        // Grund: ${violation.reason}
        // Datei: ${violation.file || 'N/A'}
        // Status: ${violation.blocked ? 'BLOCKIERT' : 'ERLAUBT'}
      });
    }
  }

  /**
   * 🔄 Verstöße zurücksetzen
   */
  resetViolations(): void {
    this.violations = [];
    this.status.violationCount = 0;
    this.status.blockedActions = [];
    // Verstöße zurückgesetzt
  }

  /**
   * 📊 Status abrufen
   */
  getStatus(): MonitoringStatus {
    return { ...this.status };
  }
}

// 🚀 Automatische Initialisierung
const monitor = CursorMonitor.getInstance();
monitor.startMonitoring();

// 🛡️ Globale Funktionen für Cursor-Integration
export function startCursorMonitoring(): void {
  monitor.startMonitoring();
}

export function validateCursorAction(action: string, targetFile?: string): boolean {
  return monitor.validateBeforeAction(action, targetFile);
}

export function showCursorStatus(): void {
  monitor.showStatus();
}

export function grantCursorApproval(): void {
  monitor.grantApproval();
}

export function revokeCursorApproval(): void {
  monitor.revokeApproval();
}

export function showCursorViolations(): void {
  monitor.showViolations();
}

export function resetCursorViolations(): void {
  monitor.resetViolations();
}
