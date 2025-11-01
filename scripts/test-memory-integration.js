// =====================================================
// Test Memory-System Integration
// =====================================================
// Erstellt: 2025-07-05 14:30:00
// Autor: Ramiro Lopez Rodriguez
// Zweck: Test der Memory-System-Integration für Woche 3
// =====================================================

const mysql = require('mysql2/promise');

// =====================================================
// Konfiguration
// =====================================================

const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lopez_it_welt',
    charset: 'utf8mb4',
    timezone: '+01:00',
};

// =====================================================
// Farben für Output
// =====================================================

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// =====================================================
// Test-Klasse
// =====================================================

class MemoryIntegrationTest {
    constructor() {
        this.connection = null;
        this.testResults = [];
    }

    async connect() {
        try {
            this.connection = await mysql.createConnection(config);
            log('✅ MySQL-Verbindung hergestellt', 'green');
        } catch (error) {
            log(`❌ MySQL-Verbindung fehlgeschlagen: ${error.message}`, 'red');
            throw error;
        }
    }

    async disconnect() {
        if (this.connection) {
            await this.connection.end();
            log('🔌 MySQL-Verbindung getrennt', 'blue');
        }
    }

    // =====================================================
    // Test 1: MySQL-Memory aktivieren
    // =====================================================

    async testMySQLMemoryActivation() {
        log('\n🧪 Test 1: MySQL-Memory aktivieren', 'cyan');

        try {
            // Prüfe ob Tabellen existieren
            const [tables] = await this.connection.execute(`
        SELECT TABLE_NAME 
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME IN ('ki_rules', 'ki_memory_sessions', 'ki_audit_log')
      `, [config.database]);

            const tableNames = tables.map(t => t.TABLE_NAME);
            const expectedTables = ['ki_rules', 'ki_memory_sessions', 'ki_audit_log'];
            const missingTables = expectedTables.filter(t => !tableNames.includes(t));

            if (missingTables.length === 0) {
                log('✅ Alle Memory-Tabellen existieren', 'green');
                this.testResults.push({ test: 'MySQL-Memory aktivieren', success: true });
            } else {
                log(`❌ Fehlende Tabellen: ${missingTables.join(', ')}`, 'red');
                this.testResults.push({ test: 'MySQL-Memory aktivieren', success: false, error: `Fehlende Tabellen: ${missingTables.join(', ')}` });
            }

        } catch (error) {
            log(`❌ MySQL-Memory Test fehlgeschlagen: ${error.message}`, 'red');
            this.testResults.push({ test: 'MySQL-Memory aktivieren', success: false, error: error.message });
        }
    }

    // =====================================================
    // Test 2: Schema importieren
    // =====================================================

    async testSchemaImport() {
        log('\n🧪 Test 2: Schema importieren', 'cyan');

        try {
            // Prüfe Schema-Struktur
            const [columns] = await this.connection.execute(`
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'ki_rules'
        ORDER BY ORDINAL_POSITION
      `, [config.database]);

            const requiredColumns = [
                'id', 'rule_text', 'category', 'tags', 'priority',
                'user_id', 'is_active', 'created_at', 'updated_at'
            ];

            const existingColumns = columns.map(c => c.COLUMN_NAME);
            const missingColumns = requiredColumns.filter(c => !existingColumns.includes(c));

            if (missingColumns.length === 0) {
                log('✅ Schema-Struktur korrekt', 'green');
                log(`📊 ${columns.length} Spalten in ki_rules Tabelle`, 'blue');
                this.testResults.push({ test: 'Schema importieren', success: true });
            } else {
                log(`❌ Fehlende Spalten: ${missingColumns.join(', ')}`, 'red');
                this.testResults.push({ test: 'Schema importieren', success: false, error: `Fehlende Spalten: ${missingColumns.join(', ')}` });
            }

        } catch (error) {
            log(`❌ Schema-Import Test fehlgeschlagen: ${error.message}`, 'red');
            this.testResults.push({ test: 'Schema importieren', success: false, error: error.message });
        }
    }

    // =====================================================
    // Test 3: Regeln laden - DSGVO + Enterprise++
    // =====================================================

    async testRulesLoading() {
        log('\n🧪 Test 3: Regeln laden - DSGVO + Enterprise++', 'cyan');

        try {
            // Prüfe DSGVO-Regeln
            const [dsgvoRules] = await this.connection.execute(`
        SELECT COUNT(*) as count 
        FROM ki_rules 
        WHERE category = 'compliance' AND is_active = TRUE
      `);

            // Prüfe Enterprise++ Regeln
            const [enterpriseRules] = await this.connection.execute(`
        SELECT COUNT(*) as count 
        FROM ki_rules 
        WHERE category = 'enterprise' AND is_active = TRUE
      `);

            // Prüfe Quality-Regeln
            const [qualityRules] = await this.connection.execute(`
        SELECT COUNT(*) as count 
        FROM ki_rules 
        WHERE category = 'quality' AND is_active = TRUE
      `);

            // Prüfe Security-Regeln
            const [securityRules] = await this.connection.execute(`
        SELECT COUNT(*) as count 
        FROM ki_rules 
        WHERE category = 'security' AND is_active = TRUE
      `);

            log(`📚 DSGVO-Regeln: ${dsgvoRules[0].count}`, 'blue');
            log(`🏢 Enterprise++ Regeln: ${enterpriseRules[0].count}`, 'blue');
            log(`🎯 Quality-Regeln: ${qualityRules[0].count}`, 'blue');
            log(`🔒 Security-Regeln: ${securityRules[0].count}`, 'blue');

            const totalRules = dsgvoRules[0].count + enterpriseRules[0].count + qualityRules[0].count + securityRules[0].count;

            if (totalRules > 0) {
                log(`✅ ${totalRules} Regeln erfolgreich geladen`, 'green');
                this.testResults.push({
                    test: 'Regeln laden - DSGVO + Enterprise++',
                    success: true,
                    details: {
                        dsgvo: dsgvoRules[0].count,
                        enterprise: enterpriseRules[0].count,
                        quality: qualityRules[0].count,
                        security: securityRules[0].count,
                        total: totalRules
                    }
                });
            } else {
                log('❌ Keine Regeln gefunden', 'red');
                this.testResults.push({ test: 'Regeln laden - DSGVO + Enterprise++', success: false, error: 'Keine Regeln gefunden' });
            }

        } catch (error) {
            log(`❌ Regeln laden Test fehlgeschlagen: ${error.message}`, 'red');
            this.testResults.push({ test: 'Regeln laden - DSGVO + Enterprise++', success: false, error: error.message });
        }
    }

    // =====================================================
    // Test 4: Agenten verbinden - Memory-Integration
    // =====================================================

    async testAgentIntegration() {
        log('\n🧪 Test 4: Agenten verbinden - Memory-Integration', 'cyan');

        try {
            // Test Compliance-Agent
            const [complianceRules] = await this.connection.execute(`
        SELECT rule_text, priority 
        FROM ki_rules 
        WHERE category = 'compliance' AND is_active = TRUE 
        ORDER BY priority DESC 
        LIMIT 3
      `);

            // Test Enterprise-Agent
            const [enterpriseRules] = await this.connection.execute(`
        SELECT rule_text, priority 
        FROM ki_rules 
        WHERE category = 'enterprise' AND is_active = TRUE 
        ORDER BY priority DESC 
        LIMIT 3
      `);

            // Test Quality-Agent
            const [qualityRules] = await this.connection.execute(`
        SELECT rule_text, priority 
        FROM ki_rules 
        WHERE category = 'quality' AND is_active = TRUE 
        ORDER BY priority DESC 
        LIMIT 3
      `);

            // Test Security-Agent
            const [securityRules] = await this.connection.execute(`
        SELECT rule_text, priority 
        FROM ki_rules 
        WHERE category = 'security' AND is_active = TRUE 
        ORDER BY priority DESC 
        LIMIT 3
      `);

            log('🤖 Compliance-Agent:', 'blue');
            complianceRules.forEach(rule => {
                log(`  - ${rule.rule_text.substring(0, 60)}... (${rule.priority})`, 'yellow');
            });

            log('🏢 Enterprise-Agent:', 'blue');
            enterpriseRules.forEach(rule => {
                log(`  - ${rule.rule_text.substring(0, 60)}... (${rule.priority})`, 'yellow');
            });

            log('🎯 Quality-Agent:', 'blue');
            qualityRules.forEach(rule => {
                log(`  - ${rule.rule_text.substring(0, 60)}... (${rule.priority})`, 'yellow');
            });

            log('🔒 Security-Agent:', 'blue');
            securityRules.forEach(rule => {
                log(`  - ${rule.rule_text.substring(0, 60)}... (${rule.priority})`, 'yellow');
            });

            const allAgentsHaveRules = complianceRules.length > 0 &&
                enterpriseRules.length > 0 &&
                qualityRules.length > 0 &&
                securityRules.length > 0;

            if (allAgentsHaveRules) {
                log('✅ Alle Agenten erfolgreich mit Memory verbunden', 'green');
                this.testResults.push({
                    test: 'Agenten verbinden - Memory-Integration',
                    success: true,
                    details: {
                        compliance_agent: complianceRules.length,
                        enterprise_agent: enterpriseRules.length,
                        quality_agent: qualityRules.length,
                        security_agent: securityRules.length
                    }
                });
            } else {
                log('❌ Nicht alle Agenten haben Regeln', 'red');
                this.testResults.push({ test: 'Agenten verbinden - Memory-Integration', success: false, error: 'Nicht alle Agenten haben Regeln' });
            }

        } catch (error) {
            log(`❌ Agenten-Integration Test fehlgeschlagen: ${error.message}`, 'red');
            this.testResults.push({ test: 'Agenten verbinden - Memory-Integration', success: false, error: error.message });
        }
    }

    // =====================================================
    // Test 5: Compliance-Prüfung
    // =====================================================

    async testComplianceValidation() {
        log('\n🧪 Test 5: Compliance-Prüfung', 'cyan');

        try {
            // Test DSGVO-Compliance
            const [dsgvoTest] = await this.connection.execute(`
        SELECT rule_text 
        FROM ki_rules 
        WHERE category = 'compliance' 
        AND rule_text LIKE '%DSGVO%' 
        AND rule_text LIKE '%formular%'
        AND is_active = TRUE
      `);

            // Test Enterprise++ Compliance
            const [enterpriseTest] = await this.connection.execute(`
        SELECT rule_text 
        FROM ki_rules 
        WHERE category = 'enterprise' 
        AND rule_text LIKE '%Enterprise++%'
        AND is_active = TRUE
      `);

            // Test Quality-Compliance
            const [qualityTest] = await this.connection.execute(`
        SELECT rule_text 
        FROM ki_rules 
        WHERE category = 'quality' 
        AND rule_text LIKE '%WCAG%'
        AND is_active = TRUE
      `);

            // Test Security-Compliance
            const [securityTest] = await this.connection.execute(`
        SELECT rule_text 
        FROM ki_rules 
        WHERE category = 'security' 
        AND rule_text LIKE '%HTTPS%'
        AND is_active = TRUE
      `);

            log(`🔍 DSGVO-Compliance: ${dsgvoTest.length} relevante Regeln`, 'blue');
            log(`🔍 Enterprise++ Compliance: ${enterpriseTest.length} relevante Regeln`, 'blue');
            log(`🔍 Quality-Compliance: ${qualityTest.length} relevante Regeln`, 'blue');
            log(`🔍 Security-Compliance: ${securityTest.length} relevante Regeln`, 'blue');

            const totalComplianceRules = dsgvoTest.length + enterpriseTest.length + qualityTest.length + securityTest.length;

            if (totalComplianceRules > 0) {
                log('✅ Compliance-Prüfung funktioniert', 'green');
                this.testResults.push({
                    test: 'Compliance-Prüfung',
                    success: true,
                    details: {
                        dsgvo_compliance: dsgvoTest.length,
                        enterprise_compliance: enterpriseTest.length,
                        quality_compliance: qualityTest.length,
                        security_compliance: securityTest.length,
                        total_compliance_rules: totalComplianceRules
                    }
                });
            } else {
                log('❌ Keine Compliance-Regeln gefunden', 'red');
                this.testResults.push({ test: 'Compliance-Prüfung', success: false, error: 'Keine Compliance-Regeln gefunden' });
            }

        } catch (error) {
            log(`❌ Compliance-Prüfung Test fehlgeschlagen: ${error.message}`, 'red');
            this.testResults.push({ test: 'Compliance-Prüfung', success: false, error: error.message });
        }
    }

    // =====================================================
    // Test 6: Memory-Sessions
    // =====================================================

    async testMemorySessions() {
        log('\n🧪 Test 6: Memory-Sessions', 'cyan');

        try {
            // Test Session speichern
            const testSession = {
                session_id: 'test-session-' + Date.now(),
                context: 'Memory-System Integration Test',
                rules_used: ['DSGVO-Compliance', 'Enterprise++ Standards'],
                compliance_status: true,
                compliance_notes: 'Test erfolgreich',
                lessons_learned: 'Memory-System funktioniert',
                next_actions: ['Weitere Tests durchführen']
            };

            const [insertResult] = await this.connection.execute(`
        INSERT INTO ki_memory_sessions 
        (session_id, context, rules_used, compliance_status, compliance_notes, lessons_learned, next_actions) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
                testSession.session_id,
                testSession.context,
                JSON.stringify(testSession.rules_used),
                testSession.compliance_status,
                testSession.compliance_notes,
                testSession.lessons_learned,
                JSON.stringify(testSession.next_actions)
            ]);

            // Test Session abrufen
            const [sessions] = await this.connection.execute(`
        SELECT * FROM ki_memory_sessions 
        WHERE session_id = ? 
        ORDER BY created_at DESC 
        LIMIT 1
      `, [testSession.session_id]);

            if (sessions.length > 0) {
                log('✅ Memory-Session erfolgreich gespeichert und abgerufen', 'green');
                log(`📝 Session-ID: ${sessions[0].session_id}`, 'blue');
                log(`📝 Kontext: ${sessions[0].context}`, 'blue');
                log(`📝 Compliance-Status: ${sessions[0].compliance_status ? '✅' : '❌'}`, 'blue');

                this.testResults.push({
                    test: 'Memory-Sessions',
                    success: true,
                    details: {
                        session_id: sessions[0].session_id,
                        compliance_status: sessions[0].compliance_status,
                        created_at: sessions[0].created_at
                    }
                });
            } else {
                log('❌ Memory-Session konnte nicht abgerufen werden', 'red');
                this.testResults.push({ test: 'Memory-Sessions', success: false, error: 'Session konnte nicht abgerufen werden' });
            }

        } catch (error) {
            log(`❌ Memory-Sessions Test fehlgeschlagen: ${error.message}`, 'red');
            this.testResults.push({ test: 'Memory-Sessions', success: false, error: error.message });
        }
    }

    // =====================================================
    // Test 7: Audit-Log
    // =====================================================

    async testAuditLog() {
        log('\n🧪 Test 7: Audit-Log', 'cyan');

        try {
            // Test Audit-Eintrag erstellen
            const testAudit = {
                action: 'TEST',
                table_name: 'ki_rules',
                record_id: 1,
                user_id: null,
                old_values: null,
                new_values: JSON.stringify({ test: 'Memory-System Integration' })
            };

            const [auditResult] = await this.connection.execute(`
        INSERT INTO ki_audit_log 
        (action, table_name, record_id, user_id, old_values, new_values) 
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
                testAudit.action,
                testAudit.table_name,
                testAudit.record_id,
                testAudit.user_id,
                testAudit.old_values,
                testAudit.new_values
            ]);

            // Test Audit-Log abrufen
            const [auditLogs] = await this.connection.execute(`
        SELECT * FROM ki_audit_log 
        WHERE action = 'TEST' 
        ORDER BY timestamp DESC 
        LIMIT 5
      `);

            if (auditLogs.length > 0) {
                log('✅ Audit-Log erfolgreich erstellt und abgerufen', 'green');
                log(`📊 Audit-Einträge: ${auditLogs.length}`, 'blue');

                this.testResults.push({
                    test: 'Audit-Log',
                    success: true,
                    details: {
                        audit_entries: auditLogs.length,
                        latest_action: auditLogs[0].action,
                        latest_table: auditLogs[0].table_name
                    }
                });
            } else {
                log('❌ Audit-Log konnte nicht abgerufen werden', 'red');
                this.testResults.push({ test: 'Audit-Log', success: false, error: 'Audit-Log konnte nicht abgerufen werden' });
            }

        } catch (error) {
            log(`❌ Audit-Log Test fehlgeschlagen: ${error.message}`, 'red');
            this.testResults.push({ test: 'Audit-Log', success: false, error: error.message });
        }
    }

    // =====================================================
    // Test-Ergebnisse anzeigen
    // =====================================================

    showTestResults() {
        log('\n📊 Test-Ergebnisse:', 'magenta');
        log('==================', 'magenta');

        let passedTests = 0;
        let failedTests = 0;

        this.testResults.forEach((result, index) => {
            const status = result.success ? '✅' : '❌';
            const color = result.success ? 'green' : 'red';
            log(`${status} Test ${index + 1}: ${result.test}`, color);

            if (result.success) {
                passedTests++;
                if (result.details) {
                    Object.entries(result.details).forEach(([key, value]) => {
                        log(`   📝 ${key}: ${value}`, 'blue');
                    });
                }
            } else {
                failedTests++;
                if (result.error) {
                    log(`   💥 Fehler: ${result.error}`, 'red');
                }
            }
        });

        log('\n📈 Zusammenfassung:', 'magenta');
        log(`✅ Bestandene Tests: ${passedTests}`, 'green');
        log(`❌ Fehlgeschlagene Tests: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
        log(`📊 Gesamt: ${this.testResults.length} Tests`, 'blue');

        const successRate = (passedTests / this.testResults.length) * 100;
        log(`🎯 Erfolgsrate: ${successRate.toFixed(1)}%`, successRate >= 80 ? 'green' : 'yellow');

        if (failedTests === 0) {
            log('\n🎉 Alle Tests erfolgreich! Memory-System Integration funktioniert.', 'green');
        } else {
            log('\n⚠️ Einige Tests fehlgeschlagen. Bitte überprüfen.', 'yellow');
        }
    }

    // =====================================================
    // Hauptfunktion
    // =====================================================

    async run() {
        try {
            log('🚀 Starte Memory-System Integration Tests...', 'magenta');

            await this.connect();

            // Alle Tests ausführen
            await this.testMySQLMemoryActivation();
            await this.testSchemaImport();
            await this.testRulesLoading();
            await this.testAgentIntegration();
            await this.testComplianceValidation();
            await this.testMemorySessions();
            await this.testAuditLog();

            // Ergebnisse anzeigen
            this.showTestResults();

        } catch (error) {
            log(`💥 Test-Ausführung fehlgeschlagen: ${error.message}`, 'red');
        } finally {
            await this.disconnect();
        }
    }
}

// =====================================================
// Script ausführen
// =====================================================

if (require.main === module) {
    const test = new MemoryIntegrationTest();
    test.run();
}

module.exports = MemoryIntegrationTest; 