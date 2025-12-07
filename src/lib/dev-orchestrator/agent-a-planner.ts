// =====================================================
// AGENT-A PLANNER – Enterprise++ Dev-Orchestrator
// =====================================================
// Erstellt: 2025-12-04
// Zweck: Agent-A analysiert Tasks und erstellt Plan-Schritte
// Status: ✅ PHASE 1 – Nur Planung, kein Code
// =====================================================
// 
// AGENT-A REGELN:
// - Analysiert Aufgabenbeschreibungen
// - Zerlegt komplexe Aufgaben in Schritte
// - Erstellt KEINE Code-Änderungen
// - Schätzt Aufwand ein
// - Identifiziert Risiken und Abhängigkeiten
// =====================================================

import { DevTask, DevTasksService } from "../dev-tasks-service";
import { getProvider } from "../ai/core/ai-provider-factory";

// =====================================================
// TYPEN
// =====================================================

export interface PlanStep {
  step_number: number;
  title: string;
  details: string;
  estimated_effort: string;
}

export interface AgentAPlanResult {
  success: boolean;
  task_id: number;
  steps: PlanStep[];
  summary: string;
  risk_assessment: string;
  error?: string;
}

// =====================================================
// AGENT-A PROMPTS
// =====================================================

const AGENT_A_SYSTEM_PROMPT = `Du bist Agent-A, ein Enterprise++ Planungs-Agent.

DEINE ROLLE:
- Du analysierst Entwicklungsaufgaben und zerlegst sie in konkrete Schritte
- Du erstellst KEINEN Code, nur Pläne
- Du schätzt den Aufwand für jeden Schritt
- Du identifizierst Risiken und Abhängigkeiten

AUSGABEFORMAT (JSON):
{
  "steps": [
    {
      "step_number": 1,
      "title": "Kurzer Titel des Schritts",
      "details": "Detaillierte Beschreibung was zu tun ist",
      "estimated_effort": "30min" | "1h" | "2h" | "4h" | "1d"
    }
  ],
  "summary": "Zusammenfassung des Plans in 1-2 Sätzen",
  "risk_assessment": "Potenzielle Risiken und Hinweise"
}

REGELN:
- Maximal 10 Schritte pro Task
- Jeder Schritt muss konkret und umsetzbar sein
- Aufwand realistisch einschätzen
- Bei Bugs: Erst analysieren, dann fixen
- Bei Features: Erst Design, dann Implementierung
- Bei Refactoring: Tests nicht vergessen

Antworte NUR mit validem JSON, keine Erklärungen davor oder danach.`;

// =====================================================
// AGENT-A KLASSE
// =====================================================

export class AgentAPlanner {
  
  /**
   * Analysiert einen Task und erstellt Plan-Schritte
   */
  static async planTask(task: DevTask): Promise<AgentAPlanResult> {
    console.log(`[Agent-A] Starte Planung für Task #${task.id}: ${task.title}`);
    
    try {
      // Task-Status auf "planning" setzen
      await DevTasksService.updateTaskStatus(task.id, "planning");
      
      // AI Provider holen
      const aiProvider = getProvider();
      
      // User Prompt erstellen
      const userPrompt = this.createUserPrompt(task);
      
      // AI aufrufen
      console.log(`[Agent-A] Rufe AI Provider auf...`);
      const fullPrompt = `${AGENT_A_SYSTEM_PROMPT}\n\n${userPrompt}`;
      const aiResponseContent = await aiProvider.requestText(fullPrompt, {
        maxTokens: 2000,
        temperature: 0.3 // Niedrig für konsistente Planung
      });
      
      // Response parsen
      const planData = this.parseAIResponse(aiResponseContent);
      
      if (!planData.steps || planData.steps.length === 0) {
        throw new Error("AI hat keine Plan-Schritte generiert");
      }
      
      console.log(`[Agent-A] ${planData.steps.length} Schritte generiert`);
      
      // Schritte in DB speichern
      await DevTasksService.saveStepsForTask(task.id, planData.steps.map(step => ({
        step_number: step.step_number,
        title: step.title,
        details: step.details,
        estimated_effort: step.estimated_effort,
        agent_notes: `Agent-A Plan | ${new Date().toISOString()}`
      })));
      
      // Task-Status auf "planned" setzen
      await DevTasksService.updateTaskStatus(task.id, "planned");
      
      console.log(`[Agent-A] Planung abgeschlossen für Task #${task.id}`);
      
      return {
        success: true,
        task_id: task.id,
        steps: planData.steps,
        summary: planData.summary || "Plan erstellt",
        risk_assessment: planData.risk_assessment || "Keine besonderen Risiken identifiziert"
      };
      
    } catch (error) {
      console.error(`[Agent-A] Fehler bei Planung:`, error);
      
      // Bei Fehler: Status zurück auf "open"
      await DevTasksService.updateTaskStatus(task.id, "open");
      
      return {
        success: false,
        task_id: task.id,
        steps: [],
        summary: "",
        risk_assessment: "",
        error: error instanceof Error ? error.message : "Unbekannter Fehler"
      };
    }
  }
  
  /**
   * Erstellt den User Prompt für die AI
   */
  private static createUserPrompt(task: DevTask): string {
    return `Analysiere folgende Entwicklungsaufgabe und erstelle einen detaillierten Plan:

TASK-TYP: ${task.type.toUpperCase()}
PRIORITÄT: ${task.priority.toUpperCase()}
PROJEKT: ${task.project_code}

TITEL:
${task.title}

BESCHREIBUNG:
${task.description}

---

Erstelle einen Plan mit konkreten Schritten. Beachte den Task-Typ:
- BUG: Erst Fehler reproduzieren und analysieren, dann fixen
- FEATURE: Erst Design/Konzept, dann schrittweise implementieren
- REFACTOR: Erst Tests sicherstellen, dann refactoren
- DOCUMENTATION: Struktur planen, dann dokumentieren
- SECURITY: Erst Analyse, dann Härtung

Antworte mit JSON.`;
  }
  
  /**
   * Parst die AI-Antwort
   */
  private static parseAIResponse(content: string): {
    steps: PlanStep[];
    summary: string;
    risk_assessment: string;
  } {
    try {
      // Versuche JSON direkt zu parsen
      let jsonContent = content.trim();
      
      // Falls die Antwort in Markdown Code-Block ist
      if (jsonContent.startsWith("```json")) {
        jsonContent = jsonContent.replace(/^```json\n?/, "").replace(/\n?```$/, "");
      } else if (jsonContent.startsWith("```")) {
        jsonContent = jsonContent.replace(/^```\n?/, "").replace(/\n?```$/, "");
      }
      
      const parsed = JSON.parse(jsonContent);
      
      return {
        steps: parsed.steps || [],
        summary: parsed.summary || "",
        risk_assessment: parsed.risk_assessment || ""
      };
      
    } catch (error) {
      console.error("[Agent-A] JSON Parse Fehler:", error);
      console.error("[Agent-A] Content war:", content);
      
      // Fallback: Versuche mit Regex Steps zu extrahieren
      return this.fallbackParse(content);
    }
  }
  
  /**
   * Fallback-Parser wenn JSON fehlschlägt
   */
  private static fallbackParse(content: string): {
    steps: PlanStep[];
    summary: string;
    risk_assessment: string;
  } {
    console.log("[Agent-A] Verwende Fallback-Parser");
    
    // Einfacher Fallback: Erstelle einen generischen Plan
    return {
      steps: [
        {
          step_number: 1,
          title: "Analyse der Anforderungen",
          details: "Die Aufgabe wurde analysiert, aber die AI-Antwort konnte nicht vollständig geparst werden. Manuelle Überprüfung empfohlen.",
          estimated_effort: "1h"
        },
        {
          step_number: 2,
          title: "Implementierung",
          details: "Nach manueller Analyse kann die Implementierung beginnen.",
          estimated_effort: "2h"
        },
        {
          step_number: 3,
          title: "Testing und Review",
          details: "Änderungen testen und zur Review einreichen.",
          estimated_effort: "1h"
        }
      ],
      summary: "Automatische Planung teilweise fehlgeschlagen - generischer Plan erstellt",
      risk_assessment: "AI-Antwort konnte nicht vollständig geparst werden. Manuelle Überprüfung empfohlen."
    };
  }
  
  /**
   * Erstellt einen Mock-Plan (für Demo/Testing ohne AI)
   */
  static async createMockPlan(task: DevTask): Promise<AgentAPlanResult> {
    console.log(`[Agent-A] Erstelle Mock-Plan für Task #${task.id}`);
    
    await DevTasksService.updateTaskStatus(task.id, "planning");
    
    const mockSteps: PlanStep[] = [];
    
    // Typ-spezifische Mock-Schritte
    switch (task.type) {
      case "bug":
        mockSteps.push(
          { step_number: 1, title: "Bug reproduzieren", details: "Den gemeldeten Fehler in der Entwicklungsumgebung reproduzieren.", estimated_effort: "30min" },
          { step_number: 2, title: "Ursache analysieren", details: "Root Cause Analysis durchführen, Logs und Stack Traces prüfen.", estimated_effort: "1h" },
          { step_number: 3, title: "Fix implementieren", details: "Den Fehler beheben ohne Seiteneffekte.", estimated_effort: "2h" },
          { step_number: 4, title: "Regression-Test", details: "Sicherstellen dass der Fix funktioniert und nichts anderes kaputt macht.", estimated_effort: "30min" }
        );
        break;
        
      case "feature":
        mockSteps.push(
          { step_number: 1, title: "Anforderungen klären", details: "Genaue Anforderungen und Akzeptanzkriterien definieren.", estimated_effort: "1h" },
          { step_number: 2, title: "Technisches Design", details: "Architektur und Datenmodell planen.", estimated_effort: "1h" },
          { step_number: 3, title: "Backend implementieren", details: "API und Datenbanklogik umsetzen.", estimated_effort: "4h" },
          { step_number: 4, title: "Frontend implementieren", details: "UI-Komponenten und Integration.", estimated_effort: "4h" },
          { step_number: 5, title: "Tests schreiben", details: "Unit- und Integrationstests.", estimated_effort: "2h" }
        );
        break;
        
      case "refactor":
        mockSteps.push(
          { step_number: 1, title: "Code analysieren", details: "Aktuellen Code verstehen und Probleme identifizieren.", estimated_effort: "1h" },
          { step_number: 2, title: "Tests sicherstellen", details: "Bestehende Tests prüfen, ggf. ergänzen.", estimated_effort: "1h" },
          { step_number: 3, title: "Refactoring durchführen", details: "Code schrittweise verbessern.", estimated_effort: "2h" },
          { step_number: 4, title: "Tests ausführen", details: "Alle Tests müssen weiterhin bestehen.", estimated_effort: "30min" }
        );
        break;
        
      default:
        mockSteps.push(
          { step_number: 1, title: "Analyse", details: "Aufgabe analysieren.", estimated_effort: "1h" },
          { step_number: 2, title: "Umsetzung", details: "Aufgabe umsetzen.", estimated_effort: "2h" },
          { step_number: 3, title: "Abschluss", details: "Dokumentation und Review.", estimated_effort: "1h" }
        );
    }
    
    // Schritte speichern
    await DevTasksService.saveStepsForTask(task.id, mockSteps.map(step => ({
      step_number: step.step_number,
      title: step.title,
      details: step.details,
      estimated_effort: step.estimated_effort,
      agent_notes: `Agent-A Mock-Plan | ${new Date().toISOString()}`
    })));
    
    await DevTasksService.updateTaskStatus(task.id, "planned");
    
    return {
      success: true,
      task_id: task.id,
      steps: mockSteps,
      summary: `Mock-Plan für ${task.type} erstellt mit ${mockSteps.length} Schritten`,
      risk_assessment: "Dies ist ein Demo-Plan. Für produktive Nutzung AI-Provider konfigurieren."
    };
  }
}

export default AgentAPlanner;

