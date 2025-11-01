// =====================================================
// Memory Integration Agent - Agenten verbinden
// =====================================================
// Erstellt: 2025-07-05 14:30:00
// Autor: Ramiro Lopez Rodriguez
// Zweck: Memory-Integration für alle KI-Agenten
// =====================================================

import { KIAgent, KITask, KITaskResult } from '../ki-agent';
import MySQLMemorySystem from '../memory-system-mysql';

export class MemoryIntegrationAgent extends KIAgent {
    private memorySystem: MySQLMemorySystem;

    constructor() {
        super('Memory Integration Agent', 'memory-integration');
        this.memorySystem = new MySQLMemorySystem();
    }

    async executeTask(task: KITask): Promise<KITaskResult> {
        try {
            // Memory-System verbinden
            await this.memorySystem.connect();
            await this.memorySystem.initializeSchema();

            switch (task.type) {
                case 'load_rules':
                    return await this.loadRules(task);
                case 'validate_compliance':
                    return await this.validateCompliance(task);
                case 'store_session':
                    return await this.storeSession(task);
                case 'get_statistics':
                    return await this.getStatistics(task);
                case 'test_integration':
                    return await this.testIntegration(task);
                default:
                    return this.createFailedResult('Unbekannter Task-Typ: ' + task.type);
            }
        } catch (error) {
            return this.createFailedResult(`Memory Integration Fehler: ${error}`);
        } finally {
            await this.memorySystem.disconnect();
        }
    }

    private async loadRules(task: KITask): Promise<KITaskResult> {
        try {
            await this.memorySystem.loadDefaultRules();

            return {
                success: true,
                result: {
                    message: 'DSGVO + Enterprise++ Regeln erfolgreich geladen',
                    rules_loaded: true
                }
            };
        } catch (error) {
            return this.createFailedResult(`Regeln laden fehlgeschlagen: ${error}`);
        }
    }

    private async validateCompliance(task: KITask): Promise<KITaskResult> {
        try {
            const { action, context, agent_type } = task.data;

            const complianceResult = await this.memorySystem.validateAgentAction(
                agent_type || 'general',
                action,
                context
            );

            return {
                success: true,
                result: {
                    is_compliant: complianceResult.is_compliant,
                    score: complianceResult.score,
                    violations: complianceResult.violations,
                    applied_rules: complianceResult.applied_rules.length
                }
            };
        } catch (error) {
            return this.createFailedResult(`Compliance-Prüfung fehlgeschlagen: ${error}`);
        }
    }

    private async storeSession(task: KITask): Promise<KITaskResult> {
        try {
            const { session_id, context, rules_used, compliance_status, compliance_notes } = task.data;

            const sessionId = await this.memorySystem.storeMemorySession({
                session_id,
                context,
                rules_used,
                compliance_status,
                compliance_notes
            });

            return {
                success: true,
                result: {
                    session_id: sessionId,
                    message: 'Memory-Session erfolgreich gespeichert'
                }
            };
        } catch (error) {
            return this.createFailedResult(`Session speichern fehlgeschlagen: ${error}`);
        }
    }

    private async getStatistics(task: KITask): Promise<KITaskResult> {
        try {
            const stats = await this.memorySystem.getStatistics();

            return {
                success: true,
                result: {
                    statistics: stats,
                    message: 'Memory-System Statistiken abgerufen'
                }
            };
        } catch (error) {
            return this.createFailedResult(`Statistiken abrufen fehlgeschlagen: ${error}`);
        }
    }

    private async testIntegration(task: KITask): Promise<KITaskResult> {
        try {
            const results = [];

            // Test 1: Compliance-Regeln laden
            const complianceRules = await this.memorySystem.getRulesForAgent('compliance');
            results.push({
                test: 'Compliance-Regeln laden',
                success: complianceRules.length > 0,
                count: complianceRules.length
            });

            // Test 2: Enterprise-Regeln laden
            const enterpriseRules = await this.memorySystem.getRulesForAgent('enterprise');
            results.push({
                test: 'Enterprise-Regeln laden',
                success: enterpriseRules.length > 0,
                count: enterpriseRules.length
            });

            // Test 3: Compliance-Prüfung
            const complianceTest = await this.memorySystem.validateAgentAction(
                'compliance',
                'Kontaktformular erstellen',
                'Formular ohne Consent-Checkbox'
            );
            results.push({
                test: 'Compliance-Prüfung',
                success: !complianceTest.is_compliant, // Sollte Verstoß erkennen
                violations: complianceTest.violations.length
            });

            // Test 4: Enterprise-Prüfung
            const enterpriseTest = await this.memorySystem.validateAgentAction(
                'enterprise',
                'Test schreiben',
                'Test ohne Coverage'
            );
            results.push({
                test: 'Enterprise-Prüfung',
                success: !enterpriseTest.is_compliant, // Sollte Verstoß erkennen
                violations: enterpriseTest.violations.length
            });

            return {
                success: true,
                result: {
                    integration_tests: results,
                    message: 'Memory-Integration Tests abgeschlossen'
                }
            };
        } catch (error) {
            return this.createFailedResult(`Integration-Test fehlgeschlagen: ${error}`);
        }
    }

    // =====================================================
    // Agent-spezifische Methoden
    // =====================================================

    async connectToMemory(): Promise<void> {
        await this.memorySystem.connect();
        await this.memorySystem.initializeSchema();
    }

    async getRulesForAgent(agentType: string): Promise<any[]> {
        return await this.memorySystem.getRulesForAgent(agentType);
    }

    async validateAction(agentType: string, action: string, context: string): Promise<any> {
        return await this.memorySystem.validateAgentAction(agentType, action, context);
    }

    async storeAgentSession(sessionData: any): Promise<number> {
        return await this.memorySystem.storeMemorySession(sessionData);
    }

    async getAgentStatistics(): Promise<any> {
        return await this.memorySystem.getStatistics();
    }
}

export default MemoryIntegrationAgent; 