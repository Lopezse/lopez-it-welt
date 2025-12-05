// =====================================================
// Memory Integration Agent - Agenten verbinden
// =====================================================
// Erstellt: 2025-07-05 14:30:00
// Autor: Ramiro Lopez Rodriguez
// Zweck: Memory-Integration für alle KI-Agenten
// =====================================================

import { KIAgent, KITask, KITaskResult } from "../ki-agent";
import MySQLMemorySystem from "../memory-system-mysql";

export class MemoryIntegrationAgent extends KIAgent {
  private memorySystem: MySQLMemorySystem;

  constructor() {
    super("Memory Integration Agent", "memory-integration");
    this.memorySystem = new MySQLMemorySystem();
  }

  async executeTask(task: KITask | string): Promise<KITaskResult> {
    try {
      // Memory-System verbinden
      await this.memorySystem.connect();
      await this.memorySystem.initializeSchema();

      const taskObj = typeof task === "string" ? { id: task, description: task, category: "general" as const, priority: "mittel" as const } : task;
      const taskType = taskObj.type || taskObj.category;

      switch (taskType) {
        case "load_rules":
          return await this.loadRules(taskObj);
        case "validate_compliance":
          return await this.validateCompliance(taskObj);
        case "store_session":
          return await this.storeSession(taskObj);
        case "get_statistics":
          return await this.getStatistics(taskObj);
        case "test_integration":
          return await this.testIntegration(taskObj);
        default:
          return this.createFailedResult(taskObj, "Unbekannter Task-Typ: " + taskType);
      }
    } catch (error) {
      const taskObj = typeof task === "string" ? { id: task, description: task, category: "general" as const, priority: "mittel" as const } : task;
      return this.createFailedResult(taskObj, `Memory Integration Fehler: ${error}`);
    } finally {
      await this.memorySystem.disconnect();
    }
  }

  private async loadRules(task: KITask): Promise<KITaskResult> {
    try {
      await this.memorySystem.loadDefaultRules();

      return {
        success: true,
        task_id: task.id,
        rules_applied: [],
        compliance_result: {
          is_compliant: true,
          applied_rules: [],
          violations: [],
          score: 100,
        },
        execution_time: 0,
        result: {
          message: "DSGVO + Enterprise++ Regeln erfolgreich geladen",
          rules_applied: 0,
          agent: this.agentName,
          rules_loaded: true,
        },
      };
    } catch (error) {
      return this.createFailedResult(task, `Regeln laden fehlgeschlagen: ${error}`);
    }
  }

  private async validateCompliance(task: KITask): Promise<KITaskResult> {
    try {
      const taskData = task.data as { action?: string; context?: string; agent_type?: string } | undefined;
      const action = taskData?.action || "";
      const context = taskData?.context || "";
      const agent_type = taskData?.agent_type || "general";

      const complianceResult = await this.memorySystem.validateAgentAction(
        agent_type,
        action,
        context,
      );

      return {
        success: true,
        task_id: task.id,
        rules_applied: [],
        compliance_result: complianceResult,
        execution_time: 0,
        result: {
          message: "Compliance-Prüfung abgeschlossen",
          rules_applied: complianceResult.applied_rules?.length || 0,
          agent: this.agentName,
          is_compliant: complianceResult.is_compliant,
          score: complianceResult.score,
          violations: complianceResult.violations || [],
        },
      };
    } catch (error) {
      return this.createFailedResult(task, `Compliance-Prüfung fehlgeschlagen: ${error}`);
    }
  }

  private async storeSession(task: KITask): Promise<KITaskResult> {
    try {
      const taskData = task.data as {
        session_id?: string;
        context?: string;
        rules_used?: unknown;
        compliance_status?: string;
        compliance_notes?: string;
      } | undefined;

      const sessionId = await this.memorySystem.storeMemorySession({
        session_id: (taskData?.session_id as string) || "",
        context: (taskData?.context as string) || "",
        rules_used: (taskData?.rules_used as string[] | undefined) || undefined,
        compliance_status: taskData?.compliance_status ? Boolean(taskData.compliance_status) : undefined,
        compliance_notes: (taskData?.compliance_notes as string) || undefined,
      });

      return {
        success: true,
        task_id: task.id,
        rules_applied: [],
        compliance_result: {
          is_compliant: true,
          applied_rules: [],
          violations: [],
          score: 100,
        },
        execution_time: 0,
        session_id: String(sessionId),
        result: {
          message: "Memory-Session erfolgreich gespeichert",
          rules_applied: 0,
          agent: this.agentName,
        },
      };
    } catch (error) {
      return this.createFailedResult(task, `Session speichern fehlgeschlagen: ${error}`);
    }
  }

  private async getStatistics(task: KITask): Promise<KITaskResult> {
    try {
      const stats = await this.memorySystem.getStatistics();

      return {
        success: true,
        task_id: task.id,
        rules_applied: [],
        compliance_result: {
          is_compliant: true,
          applied_rules: [],
          violations: [],
          score: 100,
        },
        execution_time: 0,
        result: {
          message: "Memory-System Statistiken abgerufen",
          rules_applied: 0,
          agent: this.agentName,
          statistics: stats,
        },
      };
    } catch (error) {
      return this.createFailedResult(task, `Statistiken abrufen fehlgeschlagen: ${error}`);
    }
  }

  private async testIntegration(task: KITask): Promise<KITaskResult> {
    try {
      const results = [];

      // Test 1: Compliance-Regeln laden
      const complianceRules = await this.memorySystem.getRulesForAgent("compliance");
      results.push({
        test: "Compliance-Regeln laden",
        success: complianceRules.length > 0,
        count: complianceRules.length,
      });

      // Test 2: Enterprise-Regeln laden
      const enterpriseRules = await this.memorySystem.getRulesForAgent("enterprise");
      results.push({
        test: "Enterprise-Regeln laden",
        success: enterpriseRules.length > 0,
        count: enterpriseRules.length,
      });

      // Test 3: Compliance-Prüfung
      const complianceTest = await this.memorySystem.validateAgentAction(
        "compliance",
        "Kontaktformular erstellen",
        "Formular ohne Consent-Checkbox",
      );
      results.push({
        test: "Compliance-Prüfung",
        success: !complianceTest.is_compliant, // Sollte Verstoß erkennen
        violations: complianceTest.violations.length,
      });

      // Test 4: Enterprise-Prüfung
      const enterpriseTest = await this.memorySystem.validateAgentAction(
        "enterprise",
        "Test schreiben",
        "Test ohne Coverage",
      );
      results.push({
        test: "Enterprise-Prüfung",
        success: !enterpriseTest.is_compliant, // Sollte Verstoß erkennen
        violations: enterpriseTest.violations.length,
      });

      return {
        success: true,
        task_id: task.id,
        rules_applied: [],
        compliance_result: {
          is_compliant: true,
          applied_rules: [],
          violations: [],
          score: 100,
        },
        execution_time: 0,
        result: {
          message: "Memory-Integration Tests abgeschlossen",
          rules_applied: 0,
          agent: this.agentName,
          integration_tests: results,
        },
      };
    } catch (error) {
      return this.createFailedResult(task, `Integration-Test fehlgeschlagen: ${error}`);
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
