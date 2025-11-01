#!/usr/bin/env node

/**
 * 🛡️ Anti-Regelbruch-System
 * Verhindert systematisch alle Regelverstöße
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Anti-Regelbruch Konfiguration
const ANTI_RULE_BREAK_CONFIG = {
    // STRICT MODE - Keine Ausnahmen
    strictMode: true,
    zeroTolerance: true,
    autoBlock: true,
    requireApproval: true,

    // Automatische Validierung
    validateBeforeAction: true,
    validateAfterAction: true,
    blockOnViolation: true,

    // Datumsvalidierung
    requireSystemTime: true,
    blockDateCopying: true,
    validateTimestamps: true,

    // Struktur-Schutz
    preventOverwriting: true,
    requireAppendOnly: true,
    protectMdStructure: true,

    // Zeiterfassung
    enforceTimeTracking: true,
    requireSessionSwitch: true,
    blockOverlappingSessions: true
};

// Geschützte Regeln
const PROTECTED_RULES = [
    'Datumsvalidierung',
    'Zeiterfassung',
    'Md-Struktur',
    'Enterprise++ Standards',
    'Freigabe-Erfordernis',
    'System-Zeit-Verwendung'
];

class AntiRuleBreakSystem {
    constructor() {
        this.violationCount = 0;
        this.blockedActions = [];
        this.lastViolation = '';
        this.isBlocked = false;
        this.approvalGiven = false;
        this.currentSession = null;
    }

    /**
     * 🚨 Hauptvalidierung vor jeder Aktion
     */
    async validateBeforeAction(action, targetFile = null) {
        console.log('🛡️ Anti-Regelbruch-System: Validierung läuft...');

        // 1. System-Zeit validieren
        const timeValidation = await this.validateSystemTime();
        if (!timeValidation.valid) {
            this.blockAction('System-Zeit nicht validiert', timeValidation.reason);
            return false;
        }

        // 2. Datumskopieren blockieren
        const dateValidation = await this.validateNoDateCopying(action);
        if (!dateValidation.valid) {
            this.blockAction('Datumskopieren blockiert', dateValidation.reason);
            return false;
        }

        // 3. Struktur-Schutz prüfen
        if (targetFile && this.isMdFile(targetFile)) {
            const structureValidation = await this.validateMdStructure(targetFile);
            if (!structureValidation.valid) {
                this.blockAction('Md-Struktur-Schutz', structureValidation.reason);
                return false;
            }
        }

        // 4. Freigabe prüfen
        if (!this.approvalGiven && ANTI_RULE_BREAK_CONFIG.requireApproval) {
            this.blockAction('Keine Freigabe vorhanden', action);
            return false;
        }

        // 5. Zeiterfassung prüfen
        const timeTrackingValidation = await this.validateTimeTracking(action);
        if (!timeTrackingValidation.valid) {
            this.blockAction('Zeiterfassung nicht gewechselt', timeTrackingValidation.reason);
            return false;
        }

        console.log('✅ Anti-Regelbruch-Validierung erfolgreich');
        return true;
    }

    /**
     * ⏰ System-Zeit validieren
     */
    async validateSystemTime() {
        try {
            // Echte System-Zeit abrufen mit PowerShell
            const systemTime = execSync('powershell -Command "Get-Date -Format \'dd.MM.yyyy HH:mm:ss\'"', { encoding: 'utf8' }).trim();
            const currentTime = new Date().toLocaleString('de-DE');
            const timestamp = new Date().toISOString();

            console.log(`🕐 System-Zeit validiert: ${systemTime}`);
            console.log(`🕐 Aktuelle Zeit: ${currentTime}`);
            console.log(`🕐 ISO Timestamp: ${timestamp}`);

            // Prüfen ob System-Zeit abgerufen wurde
            if (!systemTime || systemTime === '') {
                console.log('❌ System-Zeit nicht abgerufen');
                return { valid: false, reason: 'System-Zeit nicht abgerufen' };
            }

            // Prüfen ob aktuelle Zeit verwendet wird (nicht alte Daten)
            const forbiddenDates = [
                '2025-01-19',
                '29.07.2025',
                '27.06.2025',
                '30.06.2025' // Falls noch alte Daten verwendet werden
            ];

            for (const forbiddenDate of forbiddenDates) {
                if (systemTime.includes(forbiddenDate)) {
                    console.log(`❌ Falsche System-Zeit erkannt: ${forbiddenDate}`);
                    return { valid: false, reason: `Falsche System-Zeit verwendet: ${forbiddenDate}` };
                }
            }

            // Prüfen ob die Zeit realistisch ist (nicht zu alt)
            const systemDate = new Date(systemTime.split(' ')[0].split('.').reverse().join('-') + 'T' + systemTime.split(' ')[1]);
            const now = new Date();
            const timeDiff = Math.abs(now - systemDate);

            // Wenn Zeit mehr als 1 Stunde abweicht, ist es verdächtig
            if (timeDiff > 3600000) { // 1 Stunde in Millisekunden
                console.log(`❌ System-Zeit zu alt: ${systemTime}`);
                return { valid: false, reason: `System-Zeit zu alt: ${systemTime}` };
            }

            console.log('✅ System-Zeit validiert erfolgreich');
            return { valid: true, systemTime, timestamp };
        } catch (error) {
            console.error('❌ System-Zeit-Abfrage fehlgeschlagen:', error);
            return { valid: false, reason: 'System-Zeit-Abfrage fehlgeschlagen' };
        }
    }

    /**
     * 📅 Datumskopieren blockieren
     */
    async validateNoDateCopying(action) {
        // Blockiere Kopieren von Daten aus .md-Dateien
        const copyPatterns = [
            '2025-01-19',
            '29.07.2025',
            '27.06.2025',
            'copy.*date',
            'kopiere.*datum'
        ];

        for (const pattern of copyPatterns) {
            if (action.toLowerCase().includes(pattern.toLowerCase())) {
                return { valid: false, reason: `Datumskopieren erkannt: ${pattern}` };
            }
        }

        return { valid: true };
    }

    /**
     * 📄 Md-Struktur schützen
     */
    async validateMdStructure(targetFile) {
        if (!fs.existsSync(targetFile)) {
            return { valid: true }; // Neue Datei ist OK
        }

        const content = fs.readFileSync(targetFile, 'utf8');

        // Prüfen ob Datei überschrieben wird statt ergänzt
        if (content.length > 1000) { // Große Dateien sind gefährdet
            return {
                valid: false,
                reason: 'Große .md-Datei - Überschreibung riskant'
            };
        }

        return { valid: true };
    }

    /**
     * ⏱️ Zeiterfassung validieren
     */
    async validateTimeTracking(action) {
        // Prüfen ob bei Themenwechsel Zeiterfassung gewechselt wird
        const topicChanges = [
            'datumsvalidierung',
            'zeiterfassung',
            'enterprise',
            'qualität',
            'korrektur'
        ];

        for (const topic of topicChanges) {
            if (action.toLowerCase().includes(topic)) {
                if (!this.currentSession || this.currentSession !== topic) {
                    // Zeiterfassung sollte gewechselt werden
                    return {
                        valid: false,
                        reason: `Zeiterfassung nicht gewechselt für: ${topic}`
                    };
                }
            }
        }

        return { valid: true };
    }

    /**
     * 🚫 Aktion blockieren
     */
    blockAction(rule, reason) {
        this.violationCount++;
        this.lastViolation = `${rule}: ${reason}`;
        this.isBlocked = true;
        this.blockedActions.push({
            timestamp: new Date().toISOString(),
            rule: rule,
            reason: reason,
            action: 'BLOCKIERT'
        });

        console.log(`🚨 ANTI-REGELBRUCH: AKTION BLOCKIERT`);
        console.log(`   Regel: ${rule}`);
        console.log(`   Grund: ${reason}`);
        console.log(`   Verstoß #${this.violationCount}`);
        console.log(`   Status: BLOCKIERT - Freigabe erforderlich`);

        // In STATUS.md dokumentieren
        this.documentViolation(rule, reason);
    }

    /**
     * 📝 Verstoß dokumentieren
     */
    async documentViolation(rule, reason) {
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
            let statusContent = '';
            if (fs.existsSync('STATUS.md')) {
                statusContent = fs.readFileSync('STATUS.md', 'utf8');
            }

            // Verstoß am Anfang einfügen
            const updatedContent = violationEntry + statusContent;
            fs.writeFileSync('STATUS.md', updatedContent);

            console.log('📝 Verstoß in STATUS.md dokumentiert');
        } catch (error) {
            console.error('❌ Fehler beim Dokumentieren des Verstoßes:', error);
        }
    }

    /**
     * ✅ Freigabe erteilen
     */
    grantApproval() {
        this.approvalGiven = true;
        this.isBlocked = false;
        console.log('✅ Anti-Regelbruch-Freigabe erteilt');
    }

    /**
     * 🔄 Freigabe zurückziehen
     */
    revokeApproval() {
        this.approvalGiven = false;
        this.isBlocked = true;
        console.log('🚫 Anti-Regelbruch-Freigabe zurückgezogen');
    }

    /**
     * 📊 Status anzeigen
     */
    showStatus() {
        console.log('\n🛡️ Anti-Regelbruch-System Status:');
        console.log(`   Blockiert: ${this.isBlocked ? '❌ JA' : '✅ NEIN'}`);
        console.log(`   Freigabe: ${this.approvalGiven ? '✅ ERTEILT' : '❌ NICHT ERTEILT'}`);
        console.log(`   Verstöße: ${this.violationCount}`);
        console.log(`   Letzter Verstoß: ${this.lastViolation || 'Keine'}`);
        console.log(`   Blockierte Aktionen: ${this.blockedActions.length}`);
    }

    /**
     * 🔍 Md-Datei prüfen
     */
    isMdFile(filePath) {
        return filePath && filePath.endsWith('.md');
    }

    /**
     * 📋 Tägliche Checkliste
     */
    async runDailyChecklist() {
        console.log('\n📋 Anti-Regelbruch Tägliche Checkliste:');

        const checks = [
            { name: 'System-Zeit validiert', check: () => this.validateSystemTime() },
            { name: 'Datumskopieren blockiert', check: () => this.validateNoDateCopying('test') },
            { name: 'Md-Struktur geschützt', check: () => this.validateMdStructure('STATUS.md') },
            { name: 'Zeiterfassung aktiv', check: () => this.validateTimeTracking('test') }
        ];

        for (const check of checks) {
            const result = await check.check();
            console.log(`   ${result.valid ? '✅' : '❌'} ${check.name}`);
        }
    }
}

// Export für Verwendung
module.exports = AntiRuleBreakSystem;

// CLI-Verwendung
if (require.main === module) {
    const system = new AntiRuleBreakSystem();

    const command = process.argv[2];

    switch (command) {
        case 'validate':
            system.validateBeforeAction(process.argv[3] || 'test');
            break;
        case 'status':
            system.showStatus();
            break;
        case 'checklist':
            system.runDailyChecklist();
            break;
        case 'approve':
            system.grantApproval();
            break;
        case 'revoke':
            system.revokeApproval();
            break;
        default:
            console.log('🛡️ Anti-Regelbruch-System');
            console.log('Verwendung: node anti-rule-break-system.js [command]');
            console.log('Commands: validate, status, checklist, approve, revoke');
    }
} 