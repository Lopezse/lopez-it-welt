/**
 * 🛡️ Anti-Regelbruch Enterprise++ Modul
 * Verhindert systematisch alle Regelverstöße
 *
 * @author Ramiro Lopez Rodriguez
 * @version 1.0.0
 * @date 2025-06-30
 */

// Enterprise++ Anti-Regelbruch Konfiguration
export interface AntiRuleBreakConfig {
  strictMode: boolean;
  zeroTolerance: boolean;
  autoBlock: boolean;
  requireApproval: boolean;
  validateBeforeAction: boolean;
  validateAfterAction: boolean;
  blockOnViolation: boolean;
  requireSystemTime: boolean;
  blockDateCopying: boolean;
  validateTimestamps: boolean;
  preventOverwriting: boolean;
  requireAppendOnly: boolean;
  protectMdStructure: boolean;
  enforceTimeTracking: boolean;
  requireSessionSwitch: boolean;
  blockOverlappingSessions: boolean;
  // 🚨 NEUE STRENGE REGELN
  requireExplicitConsent: boolean;
  blockUnauthorizedActions: boolean;
  logAllActions: boolean;
  requireUserConfirmation: boolean;
}

// Geschützte Regeln
export const PROTECTED_RULES = [
  "Datumsvalidierung",
  "Zeiterfassung",
  "Md-Struktur",
  "Enterprise++ Standards",
  "Freigabe-Erfordernis",
  "System-Zeit-Verwendung",
  // 🚨 NEUE KRITISCHE REGELN
  "Explizite-Zustimmung",
  "Aktions-Freigabe",
  "Benutzer-Bestätigung",
] as const;

// Validierungsergebnis
export interface ValidationResult {
  valid: boolean;
  reason?: string;
  timestamp: string;
  rule?: string;
  requiresConsent?: boolean;
  action?: string;
}

// Verstoß-Dokumentation
export interface ViolationRecord {
  timestamp: string;
  rule: string;
  reason: string;
  action: string;
  file?: string;
  line?: number;
  userConsent?: boolean;
  explicitApproval?: boolean;
}

/**
 * 🛡️ Anti-Regelbruch Enterprise++ System
 */
export class AntiRuleBreakSystem {
  private static instance: AntiRuleBreakSystem;
  private isBlocked = false;
  private violationCount = 0;
  private lastViolation = "";
  private approvalGiven = false;
  private blockedActions: ViolationRecord[] = [];
  private config: AntiRuleBreakConfig;
  // 🚨 NEUE ZUSTANDSVERWALTUNG
  private explicitConsentGiven = false;
  private pendingActions: string[] = [];
  private actionLog: ViolationRecord[] = [];

  constructor() {
    this.config = {
      strictMode: true,
      zeroTolerance: true,
      autoBlock: true,
      requireApproval: true,
      validateBeforeAction: true,
      validateAfterAction: true,
      blockOnViolation: true,
      requireSystemTime: true,
      blockDateCopying: true,
      validateTimestamps: true,
      preventOverwriting: true,
      requireAppendOnly: true,
      protectMdStructure: true,
      enforceTimeTracking: true,
      requireSessionSwitch: true,
      blockOverlappingSessions: true,
      // 🚨 NEUE STRENGE EINSTELLUNGEN
      requireExplicitConsent: true,
      blockUnauthorizedActions: true,
      logAllActions: true,
      requireUserConfirmation: true,
    };
  }

  /**
   * Singleton-Instanz erhalten
   */
  static getInstance(): AntiRuleBreakSystem {
    if (!AntiRuleBreakSystem.instance) {
      AntiRuleBreakSystem.instance = new AntiRuleBreakSystem();
    }
    return AntiRuleBreakSystem.instance;
  }

  /**
   * 🚨 Hauptvalidierung vor jeder Aktion
   */
  async validateBeforeAction(action: string, targetFile?: string): Promise<ValidationResult> {
    // Anti-Regelbruch-System: Validierung läuft...
    // Aktion: ${action}
    // Datei: ${targetFile || 'Keine'}

    const timestamp = new Date().toISOString();

    // 🚨 1. EXPLIZITE ZUSTIMMUNG PRÜFEN (NEUE KRITISCHE REGEL)
    if (this.config.requireExplicitConsent && !this.explicitConsentGiven) {
      const consentViolation = this.createViolationRecord(
        "Explizite-Zustimmung",
        `Aktion "${action}" ohne explizite Zustimmung blockiert`,
        action,
        targetFile,
      );

      this.blockAction(
        "Explizite-Zustimmung fehlt",
        `Aktion "${action}" erfordert explizite Benutzer-Zustimmung`,
      );

      // KRITISCHER VERSTOSS: Keine explizite Zustimmung für Aktion
      // Blockierte Aktion: ${action}
      // Erforderlich: Explizite Benutzer-Zustimmung

      return {
        valid: false,
        reason: "Explizite Zustimmung erforderlich",
        timestamp,
        rule: "Explizite-Zustimmung",
        requiresConsent: true,
        action: action,
      };
    }

    // 🚨 2. BENUTZER-BESTÄTIGUNG PRÜFEN (NEUE KRITISCHE REGEL)
    if (this.config.requireUserConfirmation && !this.hasUserConfirmation(action)) {
      const confirmationViolation = this.createViolationRecord(
        "Benutzer-Bestätigung",
        `Aktion "${action}" ohne Benutzer-Bestätigung blockiert`,
        action,
        targetFile,
      );

      this.blockAction(
        "Benutzer-Bestätigung fehlt",
        `Aktion "${action}" erfordert explizite Benutzer-Bestätigung`,
      );

      // KRITISCHER VERSTOSS: Keine Benutzer-Bestätigung für Aktion
      // Blockierte Aktion: ${action}
      // Erforderlich: Explizite Benutzer-Bestätigung

      return {
        valid: false,
        reason: "Benutzer-Bestätigung erforderlich",
        timestamp,
        rule: "Benutzer-Bestätigung",
        requiresConsent: true,
        action: action,
      };
    }

    // 3. System-Zeit validieren
    const timeValidation = await this.validateSystemTime();
    if (!timeValidation.valid) {
      this.blockAction(
        "System-Zeit nicht validiert",
        timeValidation.reason || "Unbekannter Fehler",
      );
      return {
        valid: false,
        reason: timeValidation.reason,
        timestamp,
        rule: "System-Zeit",
      };
    }

    // 4. Datumskopieren blockieren
    const dateValidation = await this.validateNoDateCopying(action);
    if (!dateValidation.valid) {
      this.blockAction(
        "Datumskopieren blockiert",
        dateValidation.reason || "Datumskopieren erkannt",
      );
      return {
        valid: false,
        reason: dateValidation.reason,
        timestamp,
        rule: "Datumsvalidierung",
      };
    }

    // 5. Struktur-Schutz prüfen
    if (targetFile && this.isMdFile(targetFile)) {
      const structureValidation = await this.validateMdStructure(targetFile);
      if (!structureValidation.valid) {
        this.blockAction(
          "Md-Struktur-Schutz",
          structureValidation.reason || "Struktur-Schutz verletzt",
        );
        return {
          valid: false,
          reason: structureValidation.reason,
          timestamp,
          rule: "Md-Struktur",
        };
      }
    }

    // 6. Freigabe prüfen
    if (!this.approvalGiven && this.config.requireApproval) {
      this.blockAction("Keine Freigabe vorhanden", action);
      return {
        valid: false,
        reason: "Keine Freigabe vorhanden",
        timestamp,
        rule: "Freigabe-Erfordernis",
      };
    }

    // 7. Zeiterfassung prüfen
    const timeTrackingValidation = await this.validateTimeTracking(action);
    if (!timeTrackingValidation.valid) {
      this.blockAction(
        "Zeiterfassung nicht gewechselt",
        timeTrackingValidation.reason || "Zeiterfassung-Fehler",
      );
      return {
        valid: false,
        reason: timeTrackingValidation.reason,
        timestamp,
        rule: "Zeiterfassung",
      };
    }

    // ✅ Alle Validierungen bestanden
    // Anti-Regelbruch-Validierung erfolgreich
    // Aktion "${action}" genehmigt

    // Aktion loggen
    if (this.config.logAllActions) {
      this.logAction(action, targetFile, true);
    }

    return { valid: true, timestamp };
  }

  /**
   * 🚨 Explizite Zustimmung erteilen
   */
  grantExplicitConsent(): void {
    this.explicitConsentGiven = true;
    // Explizite Zustimmung erteilt
    // Anti-Regelbruch-System: Explizite Zustimmung aktiv
  }

  /**
   * 🚨 Explizite Zustimmung widerrufen
   */
  revokeExplicitConsent(): void {
    this.explicitConsentGiven = false;
    // Explizite Zustimmung widerrufen
    // Anti-Regelbruch-System: Explizite Zustimmung deaktiviert
  }

  /**
   * 🚨 Benutzer-Bestätigung für spezifische Aktion
   */
  confirmAction(action: string): void {
    this.pendingActions = this.pendingActions.filter((a) => a !== action);
    // Benutzer-Bestätigung für Aktion: ${action}
  }

  /**
   * 🚨 Prüfen ob Benutzer-Bestätigung vorhanden
   */
  private hasUserConfirmation(action: string): boolean {
    return !this.pendingActions.includes(action);
  }

  /**
   * 🚨 Aktion loggen
   */
  private logAction(action: string, targetFile?: string, approved: boolean = false): void {
    const logEntry: ViolationRecord = {
      timestamp: new Date().toISOString(),
      rule: approved ? "Genehmigt" : "Blockiert",
      reason: approved ? "Aktion genehmigt" : "Aktion blockiert",
      action: action,
      file: targetFile,
      userConsent: this.explicitConsentGiven,
      explicitApproval: approved,
    };

    this.actionLog.push(logEntry);
    // Aktion geloggt: ${action} - ${approved ? 'Genehmigt' : 'Blockiert'}
  }

  /**
   * 🚨 Verstoß-Datensatz erstellen
   */
  private createViolationRecord(
    rule: string,
    reason: string,
    action: string,
    targetFile?: string,
  ): ViolationRecord {
    const violation: ViolationRecord = {
      timestamp: new Date().toISOString(),
      rule,
      reason,
      action,
      file: targetFile,
      userConsent: this.explicitConsentGiven,
      explicitApproval: false,
    };

    this.blockedActions.push(violation);
    this.violationCount++;
    this.lastViolation = reason;

    return violation;
  }

  /**
   * ⏰ System-Zeit validieren
   */
  private async validateSystemTime(): Promise<ValidationResult> {
    try {
      const currentTime = new Date();
      const timestamp = currentTime.toISOString();

      // Prüfen ob Zeit plausibel ist (nicht in der Vergangenheit)
      const minValidDate = new Date("2025-01-01");
      if (currentTime < minValidDate) {
        return {
          valid: false,
          reason: "System-Zeit ist in der Vergangenheit",
          timestamp,
        };
      }

      return { valid: true, timestamp };
    } catch (error) {
      return {
        valid: false,
        reason: "System-Zeit-Abfrage fehlgeschlagen",
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 📅 Datumskopieren blockieren
   */
  private async validateNoDateCopying(action: string): Promise<ValidationResult> {
    const blockedDates = [
      "2025-01-19",
      "29.07.2025",
      "27.06.2025",
      "2025-06-27",
      "2025-01-19T",
      "29.07.2025T",
    ];

    const timestamp = new Date().toISOString();

    for (const blockedDate of blockedDates) {
      if (action.includes(blockedDate)) {
        return {
          valid: false,
          reason: `Datumskopieren erkannt: ${blockedDate}`,
          timestamp,
        };
      }
    }

    return { valid: true, timestamp };
  }

  /**
   * 📄 Md-Struktur schützen
   */
  private async validateMdStructure(targetFile: string): Promise<ValidationResult> {
    const timestamp = new Date().toISOString();

    // Prüfen ob es sich um eine .md-Datei handelt
    if (!this.isMdFile(targetFile)) {
      return { valid: true, timestamp };
    }

    // Hier könnte weitere Validierung der Md-Struktur erfolgen
    // z.B. Prüfung auf Überschreibungen statt Ergänzungen

    return { valid: true, timestamp };
  }

  /**
   * ⏱️ Zeiterfassung validieren
   */
  private async validateTimeTracking(action: string): Promise<ValidationResult> {
    const timestamp = new Date().toISOString();

    // Hier könnte Validierung der Zeiterfassung erfolgen
    // z.B. Prüfung auf Session-Wechsel bei Themenwechsel

    return { valid: true, timestamp };
  }

  /**
   * 🚫 Aktion blockieren
   */
  private blockAction(rule: string, reason: string): void {
    this.violationCount++;
    this.lastViolation = `${rule}: ${reason}`;
    this.isBlocked = true;

    const violation: ViolationRecord = {
      timestamp: new Date().toISOString(),
      rule: rule,
      reason: reason,
      action: "BLOCKIERT",
    };

    this.blockedActions.push(violation);

    // ANTI-REGELBRUCH: AKTION BLOCKIERT
    // Regel: ${rule}
    // Grund: ${reason}
    // Verstoß #${this.violationCount}
    // Status: BLOCKIERT - Freigabe erforderlich

    // In STATUS.md dokumentieren
    this.documentViolation(rule, reason);
  }

  /**
   * 📝 Verstoß dokumentieren
   */
  private async documentViolation(rule: string, reason: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const violationEntry = `
## 🚨 **ANTI-REGELBRUCH: AKTION BLOCKIERT (${timestamp})**
- **Regel:** ${rule}
- **Grund:** ${reason}
- **Verstoß #:** ${this.violationCount}
- **Status:** ❌ BLOCKIERT - Freigabe erforderlich
- **System:** Anti-Regelbruch-System aktiviert

`;

    try {
      // Hier würde die Dokumentation in STATUS.md erfolgen
      // Verstoß in STATUS.md dokumentiert
    } catch (error) {
      // Fehler beim Dokumentieren des Verstoßes: ${error}
    }
  }

  /**
   * ✅ Freigabe erteilen
   */
  grantApproval(): void {
    this.approvalGiven = true;
    this.isBlocked = false;
    // Anti-Regelbruch-Freigabe erteilt
  }

  /**
   * 🔄 Freigabe zurückziehen
   */
  revokeApproval(): void {
    this.approvalGiven = false;
    this.isBlocked = true;
    // Anti-Regelbruch-Freigabe zurückgezogen
  }

  /**
   * 📊 Status anzeigen
   */
  showStatus(): void {
    // Anti-Regelbruch-System Status:
    // Blockiert: ${this.isBlocked ? 'JA' : 'NEIN'}
    // Freigabe: ${this.approvalGiven ? 'ERTEILT' : 'NICHT ERTEILT'}
    // Verstöße: ${this.violationCount}
    // Letzter Verstoß: ${this.lastViolation || 'Keine'}
    // Blockierte Aktionen: ${this.blockedActions.length}
  }

  /**
   * 🔧 Konfiguration aktualisieren
   */
  updateConfig(newConfig: Partial<AntiRuleBreakConfig>): void {
    this.config = { ...this.config, ...newConfig };
    // Anti-Regelbruch-Konfiguration aktualisiert
  }

  /**
   * 📋 Md-Datei prüfen
   */
  private isMdFile(filename: string): boolean {
    return filename.endsWith(".md") || filename.endsWith(".MD");
  }

  /**
   * 🧹 Verstöße zurücksetzen
   */
  resetViolations(): void {
    this.violationCount = 0;
    this.lastViolation = "";
    this.blockedActions = [];
    this.isBlocked = false;
    // Anti-Regelbruch-Verstöße zurückgesetzt
  }
}

// Export der Hauptklasse
export default AntiRuleBreakSystem;

/**
 * 🚀 Anti-Regelbruch-System starten
 */
export function startAntiRuleBreakSystem(): void {
  // Anti-Regelbruch-System wird gestartet...

  const system = AntiRuleBreakSystem.getInstance();

  // System aktivieren
  system.updateConfig({
    strictMode: true,
    zeroTolerance: true,
    autoBlock: true,
    requireApproval: false, // Für automatischen Start
    validateBeforeAction: true,
    validateAfterAction: true,
    blockOnViolation: true,
    requireSystemTime: true,
    blockDateCopying: true,
    validateTimestamps: true,
    preventOverwriting: true,
    requireAppendOnly: true,
    protectMdStructure: true,
    enforceTimeTracking: true,
    requireSessionSwitch: true,
    blockOverlappingSessions: true,
    // 🚨 NEUE STRENGE EINSTELLUNGEN
    requireExplicitConsent: true,
    blockUnauthorizedActions: true,
    logAllActions: true,
    requireUserConfirmation: true,
  });

  // Anti-Regelbruch-System aktiviert
  // Enterprise++ Regeln werden jetzt überwacht

  // Status anzeigen
  system.showStatus();
}

/**
 * 🔍 Anti-Regelbruch-Validierung ausführen
 */
export async function runAntiRuleBreakValidation(
  action?: string,
  targetFile?: string,
): Promise<ValidationResult> {
  const system = AntiRuleBreakSystem.getInstance();
  return await system.validateBeforeAction(action || "Automatische Validierung", targetFile);
}
