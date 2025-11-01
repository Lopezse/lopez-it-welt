#!/usr/bin/env node

/**
 * =====================================================
 * DB-Compliance System für Agenten
 * =====================================================
 * Erstellt: 2025-07-02
 * Zweck: Agenten-Compliance-System mit DB-Integration
 * =====================================================
 */

const mysql = require('mysql2/promise');

// =====================================================
// KONFIGURATION
// =====================================================

const CONFIG = {
    database: {
        host: 'localhost',
        user: 'root',
        password: '', // XAMPP Standard
        database: 'lopez_it_welt_compliance'
    },
    complianceChecks: {
        language: ['deutsch', 'german', 'de'],
        naming: ['camelCase', 'PascalCase', 'snake_case', 'kebab-case'],
        structure: ['class', 'function', 'interface', 'type'],
        quality: ['test', 'documentation', 'error handling'],
        security: ['encryption', 'authentication', 'authorization', 'validation'],
        performance: ['optimization', 'caching', 'lazy loading'],
        accessibility: ['aria', 'semantic', 'contrast', 'keyboard']
    }
};

// =====================================================
// COMPLIANCE SYSTEM
// =====================================================

class DBComplianceSystem {
    constructor() {
        this.connection = null;
        this.activeRules = {
            policies: [],
            laws: [],
            ci_rules: []
        };
        this.complianceStatus = {
            totalChecks: 0,
            passed: 0,
            failed: 0,
            warnings: 0
        };
    }

    async connect() {
        try {
            this.connection = await mysql.createConnection(CONFIG.database);
            console.log('✅ DB-Compliance-System verbunden');
        } catch (error) {
            console.error('❌ DB-Verbindung fehlgeschlagen:', error.message);
            throw error;
        }
    }

    async disconnect() {
        if (this.connection) {
            await this.connection.end();
            console.log('✅ DB-Verbindung geschlossen');
        }
    }

    // Alle aktiven Regeln aus der DB laden
    async loadActiveRules() {
        try {
            // Policies laden
            const [policies] = await this.connection.execute(
                'SELECT * FROM policies WHERE enforced = TRUE ORDER BY priority DESC'
            );
            this.activeRules.policies = policies;

            // Laws laden
            const [laws] = await this.connection.execute(
                'SELECT * FROM laws WHERE enforced = TRUE ORDER BY priority DESC'
            );
            this.activeRules.laws = laws;

            // CI-Rules laden
            const [ci_rules] = await this.connection.execute(
                'SELECT * FROM ci_rules WHERE enforced = TRUE ORDER BY priority DESC'
            );
            this.activeRules.ci_rules = ci_rules;

            console.log(`📋 Aktive Regeln geladen: ${policies.length} Policies, ${laws.length} Laws, ${ci_rules.length} CI-Rules`);

        } catch (error) {
            console.error('❌ Fehler beim Laden der Regeln:', error.message);
            throw error;
        }
    }

    // Compliance-Check protokollieren
    async logComplianceCheck(ruleId, ruleType, checkType, status, message, details = null) {
        try {
            await this.connection.execute(
                'CALL LogComplianceCheck(?, ?, ?, ?, ?, ?)',
                [ruleId, ruleType, checkType, status, message, JSON.stringify(details)]
            );
        } catch (error) {
            console.error('❌ Fehler beim Protokollieren:', error.message);
        }
    }

    // Agent-Aktivität protokollieren
    async logAgentActivity(agentName, activityType, description, status, executionTime, details = null) {
        try {
            await this.connection.execute(
                'CALL LogAgentActivity(?, ?, ?, ?, ?, ?)',
                [agentName, activityType, description, status, executionTime, JSON.stringify(details)]
            );
        } catch (error) {
            console.error('❌ Fehler beim Protokollieren der Agent-Aktivität:', error.message);
        }
    }

    // Sprach-Compliance prüfen
    async checkLanguageCompliance(content, context = '') {
        const startTime = Date.now();
        const checks = [];

        for (const policy of this.activeRules.policies) {
            if (policy.category === 'QUALITÄT' || policy.content.toLowerCase().includes('sprache')) {
                const isGerman = /[äöüßÄÖÜ]/.test(content) ||
                    content.toLowerCase().includes('deutsch') ||
                    content.toLowerCase().includes('german');

                const status = isGerman ? 'PASS' : 'FAIL';
                const message = isGerman ? 'Deutsche Sprache erkannt' : 'Deutsche Sprache erforderlich';

                checks.push({
                    ruleId: policy.id,
                    ruleType: 'POLICY',
                    checkType: 'LANGUAGE_COMPLIANCE',
                    status,
                    message,
                    details: { content: content.substring(0, 100), isGerman }
                });

                await this.logComplianceCheck(policy.id, 'POLICY', 'LANGUAGE_COMPLIANCE', status, message, { isGerman });
            }
        }

        const executionTime = Date.now() - startTime;
        await this.logAgentActivity('ComplianceAgent', 'LANGUAGE_CHECK', 'Sprach-Compliance-Prüfung', 'SUCCESS', executionTime, { checks });

        return checks;
    }

    // Namenskonventionen prüfen
    async checkNamingCompliance(code, context = '') {
        const startTime = Date.now();
        const checks = [];

        for (const rule of this.activeRules.ci_rules) {
            if (rule.category === 'CODE_QUALITY' || rule.content.toLowerCase().includes('naming')) {
                const namingPatterns = {
                    camelCase: /^[a-z][a-zA-Z0-9]*$/,
                    PascalCase: /^[A-Z][a-zA-Z0-9]*$/,
                    snake_case: /^[a-z][a-z0-9_]*$/,
                    kebab_case: /^[a-z][a-z0-9-]*$/
                };

                const variables = code.match(/\b(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g) || [];
                const functions = code.match(/\bfunction\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g) || [];
                const classes = code.match(/\bclass\s+([A-Z][a-zA-Z0-9_$]*)/g) || [];

                let namingCompliance = true;
                const violations = [];

                // Variablen prüfen (camelCase)
                variables.forEach(variable => {
                    const varName = variable.split(/\s+/)[1];
                    if (!namingPatterns.camelCase.test(varName)) {
                        namingCompliance = false;
                        violations.push(`Variable: ${varName}`);
                    }
                });

                // Klassen prüfen (PascalCase)
                classes.forEach(classDef => {
                    const className = classDef.split(/\s+/)[1];
                    if (!namingPatterns.PascalCase.test(className)) {
                        namingCompliance = false;
                        violations.push(`Klasse: ${className}`);
                    }
                });

                const status = namingCompliance ? 'PASS' : 'FAIL';
                const message = namingCompliance ? 'Namenskonventionen eingehalten' : 'Namenskonventionen verletzt';

                checks.push({
                    ruleId: rule.id,
                    ruleType: 'CI_RULE',
                    checkType: 'NAMING_COMPLIANCE',
                    status,
                    message,
                    details: { violations, namingCompliance }
                });

                await this.logComplianceCheck(rule.id, 'CI_RULE', 'NAMING_COMPLIANCE', status, message, { violations });
            }
        }

        const executionTime = Date.now() - startTime;
        await this.logAgentActivity('ComplianceAgent', 'NAMING_CHECK', 'Namenskonventionen-Prüfung', 'SUCCESS', executionTime, { checks });

        return checks;
    }

    // Sicherheits-Compliance prüfen
    async checkSecurityCompliance(code, context = '') {
        const startTime = Date.now();
        const checks = [];

        for (const rule of this.activeRules.ci_rules) {
            if (rule.category === 'SECURITY' || rule.content.toLowerCase().includes('sicherheit')) {
                const securityIssues = [];

                // SQL Injection prüfen
                if (code.includes('SELECT') && code.includes('${') && !code.includes('prepared')) {
                    securityIssues.push('SQL Injection Risiko');
                }

                // XSS prüfen
                if (code.includes('innerHTML') || code.includes('outerHTML')) {
                    securityIssues.push('XSS Risiko');
                }

                // Passwort-Hashing prüfen
                if (code.includes('password') && !code.includes('hash') && !code.includes('bcrypt')) {
                    securityIssues.push('Passwort-Hashing fehlt');
                }

                const status = securityIssues.length === 0 ? 'PASS' : 'FAIL';
                const message = securityIssues.length === 0 ? 'Sicherheitsstandards eingehalten' : 'Sicherheitsprobleme gefunden';

                checks.push({
                    ruleId: rule.id,
                    ruleType: 'CI_RULE',
                    checkType: 'SECURITY_COMPLIANCE',
                    status,
                    message,
                    details: { securityIssues }
                });

                await this.logComplianceCheck(rule.id, 'CI_RULE', 'SECURITY_COMPLIANCE', status, message, { securityIssues });
            }
        }

        const executionTime = Date.now() - startTime;
        await this.logAgentActivity('ComplianceAgent', 'SECURITY_CHECK', 'Sicherheits-Compliance-Prüfung', 'SUCCESS', executionTime, { checks });

        return checks;
    }

    // Qualitäts-Compliance prüfen
    async checkQualityCompliance(code, context = '') {
        const startTime = Date.now();
        const checks = [];

        for (const rule of this.activeRules.ci_rules) {
            if (rule.category === 'CODE_QUALITY' || rule.content.toLowerCase().includes('qualität')) {
                const qualityIssues = [];

                // Kommentare prüfen
                const commentRatio = (code.match(/\/\*[\s\S]*?\*\/|\/\/.*$/gm) || []).length;
                const lineCount = code.split('\n').length;
                if (commentRatio / lineCount < 0.1) {
                    qualityIssues.push('Unzureichende Dokumentation');
                }

                // Error Handling prüfen
                if (code.includes('try') && !code.includes('catch')) {
                    qualityIssues.push('Unvollständiges Error Handling');
                }

                // Test-Coverage prüfen
                if (!code.includes('test') && !code.includes('spec')) {
                    qualityIssues.push('Tests fehlen');
                }

                const status = qualityIssues.length === 0 ? 'PASS' : 'WARNING';
                const message = qualityIssues.length === 0 ? 'Qualitätsstandards eingehalten' : 'Qualitätsprobleme gefunden';

                checks.push({
                    ruleId: rule.id,
                    ruleType: 'CI_RULE',
                    checkType: 'QUALITY_COMPLIANCE',
                    status,
                    message,
                    details: { qualityIssues }
                });

                await this.logComplianceCheck(rule.id, 'CI_RULE', 'QUALITY_COMPLIANCE', status, message, { qualityIssues });
            }
        }

        const executionTime = Date.now() - startTime;
        await this.logAgentActivity('ComplianceAgent', 'QUALITY_CHECK', 'Qualitäts-Compliance-Prüfung', 'SUCCESS', executionTime, { checks });

        return checks;
    }

    // Vollständige Compliance-Prüfung
    async runFullComplianceCheck(content, code = '', context = '') {
        console.log('🔍 Starte vollständige Compliance-Prüfung...\n');

        try {
            await this.connect();
            await this.loadActiveRules();

            const allChecks = [];

            // Alle Compliance-Checks ausführen
            const languageChecks = await this.checkLanguageCompliance(content, context);
            const namingChecks = await this.checkNamingCompliance(code, context);
            const securityChecks = await this.checkSecurityCompliance(code, context);
            const qualityChecks = await this.checkQualityCompliance(code, context);

            allChecks.push(...languageChecks, ...namingChecks, ...securityChecks, ...qualityChecks);

            // Statistik berechnen
            this.complianceStatus.totalChecks = allChecks.length;
            this.complianceStatus.passed = allChecks.filter(c => c.status === 'PASS').length;
            this.complianceStatus.failed = allChecks.filter(c => c.status === 'FAIL').length;
            this.complianceStatus.warnings = allChecks.filter(c => c.status === 'WARNING').length;

            await this.printComplianceReport(allChecks);

        } catch (error) {
            console.error('❌ Compliance-Prüfung fehlgeschlagen:', error.message);
        } finally {
            await this.disconnect();
        }
    }

    // Compliance-Report ausgeben
    async printComplianceReport(checks) {
        console.log('\n' + '='.repeat(60));
        console.log('📊 COMPLIANCE-REPORT');
        console.log('='.repeat(60));
        console.log(`✅ Bestanden: ${this.complianceStatus.passed}`);
        console.log(`❌ Fehler: ${this.complianceStatus.failed}`);
        console.log(`⚠️ Warnungen: ${this.complianceStatus.warnings}`);
        console.log(`📋 Gesamt: ${this.complianceStatus.totalChecks}`);
        console.log('='.repeat(60));

        // Detaillierte Ergebnisse
        if (checks.length > 0) {
            console.log('\n📋 DETAILLIERTE ERGEBNISSE:');
            checks.forEach(check => {
                const icon = check.status === 'PASS' ? '✅' : check.status === 'FAIL' ? '❌' : '⚠️';
                console.log(`${icon} ${check.checkType}: ${check.message}`);
            });
        }

        // Datenbankstatus abfragen
        try {
            const [rows] = await this.connection.execute('SELECT * FROM compliance_status');
            console.log('\n📊 DATENBANKSTATUS:');
            rows.forEach(row => {
                console.log(`${row.rule_type}: ${row.active_rules}/${row.total_rules} aktiv`);
            });
        } catch (error) {
            console.error('❌ Fehler beim Abrufen des Datenbankstatus:', error.message);
        }
    }

    // Regeln nach Kategorie abrufen
    async getRulesByCategory(category) {
        try {
            const [rows] = await this.connection.execute(
                'CALL GetRulesByCategory(?)',
                [category]
            );
            return rows[0];
        } catch (error) {
            console.error('❌ Fehler beim Abrufen der Regeln:', error.message);
            return [];
        }
    }
}

// =====================================================
// HAUPTFUNKTION
// =====================================================

async function main() {
    const complianceSystem = new DBComplianceSystem();

    // Beispiel-Compliance-Check
    const testContent = 'Dies ist ein deutscher Text für die Sprachprüfung.';
    const testCode = `
        const userName = 'test';
        function getUserData() {
            return userName;
        }
        class UserManager {
            constructor() {
                this.users = [];
            }
        }
    `;

    await complianceSystem.runFullComplianceCheck(testContent, testCode, 'Test-Kontext');
}

// =====================================================
// AUSFÜHRUNG
// =====================================================

if (require.main === module) {
    main().catch(console.error);
}

module.exports = DBComplianceSystem; 