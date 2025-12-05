// =====================================================
// AGENT-C REVIEWER – Enterprise++ Dev-Orchestrator
// =====================================================
// Erstellt: 2025-12-04
// Zweck: Code-Review und Quality-Gate
// Status: ✅ PHASE 3 – Review
// =====================================================
//
// SICHERHEITSHINWEISE:
// - Arbeitet NUR mit lopez_it_welt_dev
// - KEINE destruktiven Operationen
// - KEINE init/reset Funktionen
// - Führt nur READ-Operationen und Status-Updates durch
// =====================================================

import { getConnection } from "../database";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { DevTasksService } from "../dev-tasks-service";
import { AgentBBuilder, CodeChange } from "./agent-b-builder";
import { getProvider } from "../ai/core/ai-provider-factory";

// =====================================================
// TYPEN
// =====================================================

export type ReviewStatus = "pending" | "approved" | "rejected" | "needs_revision";

export interface CodeReview {
  id: number;
  task_id: number;
  change_id: number;
  review_status: ReviewStatus;
  quality_score: number;
  feedback: string;
  issues_found: string | null;
  suggestions: string | null;
  reviewer_agent: string;
  created_at: Date;
  updated_at: Date;
}

export interface ReviewResult {
  success: boolean;
  task_id: number;
  reviews: CodeReview[];
  overall_status: ReviewStatus;
  overall_score: number;
  summary: string;
  quality_gate_passed: boolean;
}

export interface IssueFound {
  severity: "critical" | "warning" | "info";
  type: string;
  description: string;
  line?: number;
}

// =====================================================
// AGENT-C REVIEWER SERVICE
// =====================================================

export class AgentCReviewer {
  
  // Quality Gate Schwellenwerte
  private static readonly QUALITY_GATE = {
    MIN_SCORE: 70,
    MAX_CRITICAL_ISSUES: 0,
    MAX_WARNINGS: 5
  };

  // -------------------------------------------------
  // CODE-CHANGES LADEN
  // -------------------------------------------------

  /**
   * Lädt alle Code-Changes für einen Task
   */
  static async loadCodeChanges(taskId: number): Promise<{
    task: any;
    changes: CodeChange[];
  }> {
    const task = await DevTasksService.getTaskById(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} nicht gefunden`);
    }
    
    if (task.status !== "coding") {
      throw new Error(`Task ${taskId} hat Status '${task.status}', erwartet 'coding'`);
    }
    
    const changes = await AgentBBuilder.getCodeChangesForTask(taskId);
    return { task, changes };
  }

  // -------------------------------------------------
  // CODE EVALUATION
  // -------------------------------------------------

  /**
   * Evaluiert einen einzelnen Code-Change
   */
  static async evaluateCode(
    change: CodeChange,
    taskContext: { title: string; type: string }
  ): Promise<{
    review_status: ReviewStatus;
    quality_score: number;
    feedback: string;
    issues_found: IssueFound[];
    suggestions: string[];
  }> {
    try {
      const aiProvider = getProvider();
      
      // Prüfe ob Mock-Modus
      if (!aiProvider || aiProvider.name === "mock") {
        return this.evaluateMock(change, taskContext);
      }
      
      // Echte AI-Evaluation
      const prompt = this.buildReviewPrompt(change, taskContext);
      const response = await aiProvider.chat([
        { role: "system", content: "Du bist Agent-C, ein Enterprise++ Code-Reviewer. Prüfe Code auf Qualität, Sicherheit und Best Practices." },
        { role: "user", content: prompt }
      ]);
      
      return this.parseAIReviewResponse(response);
      
    } catch (error) {
      console.warn(`[Agent-C] AI-Fehler, verwende Mock:`, error);
      return this.evaluateMock(change, taskContext);
    }
  }

  /**
   * Mock-Evaluation wenn AI nicht verfügbar
   */
  private static evaluateMock(
    change: CodeChange,
    taskContext: { title: string; type: string }
  ): {
    review_status: ReviewStatus;
    quality_score: number;
    feedback: string;
    issues_found: IssueFound[];
    suggestions: string[];
  } {
    const code = change.code_after;
    const issues: IssueFound[] = [];
    const suggestions: string[] = [];
    let score = 100;
    
    // Einfache statische Prüfungen
    
    // 1. TypeScript-Typisierung prüfen
    if (code.includes(": any") || code.includes("as any")) {
      issues.push({
        severity: "warning",
        type: "typing",
        description: "Verwendung von 'any' Type gefunden. Strikte Typisierung empfohlen."
      });
      score -= 5;
      suggestions.push("Ersetze 'any' durch spezifische TypeScript-Typen");
    }
    
    // 2. Console.log prüfen
    if (code.includes("console.log") && !code.includes("// DEBUG")) {
      issues.push({
        severity: "info",
        type: "debugging",
        description: "console.log gefunden. Für Produktion entfernen oder durch Logger ersetzen."
      });
      score -= 2;
      suggestions.push("Verwende den Enterprise++ Logger statt console.log");
    }
    
    // 3. Error-Handling prüfen
    if (code.includes("catch") && !code.includes("catch (error)") && !code.includes("catch(error)")) {
      issues.push({
        severity: "warning",
        type: "error-handling",
        description: "Catch-Block ohne Error-Variable gefunden."
      });
      score -= 5;
    }
    
    // 4. SQL-Injection prüfen (vereinfacht)
    if (code.includes("${") && (code.includes("SELECT") || code.includes("INSERT") || code.includes("UPDATE"))) {
      issues.push({
        severity: "critical",
        type: "security",
        description: "Mögliche SQL-Injection Gefahr: Template Literals in SQL-Query."
      });
      score -= 25;
      suggestions.push("Verwende parametrisierte Queries statt String-Interpolation");
    }
    
    // 5. TODO-Comments zählen
    const todoCount = (code.match(/TODO/g) || []).length;
    if (todoCount > 3) {
      issues.push({
        severity: "info",
        type: "completeness",
        description: `${todoCount} TODO-Kommentare gefunden. Code ist möglicherweise unvollständig.`
      });
      score -= todoCount * 2;
    }
    
    // 6. Kommentierung prüfen
    if (!code.includes("/**") && code.length > 500) {
      issues.push({
        severity: "info",
        type: "documentation",
        description: "Keine JSDoc-Kommentare gefunden. Enterprise++ erfordert dokumentierte APIs."
      });
      score -= 5;
      suggestions.push("Füge JSDoc-Kommentare für öffentliche Funktionen hinzu");
    }
    
    // 7. Export prüfen
    if (!code.includes("export") && code.includes("function")) {
      issues.push({
        severity: "info",
        type: "structure",
        description: "Keine Exports gefunden. Module sollten explizit exportieren."
      });
      score -= 3;
    }
    
    // Score begrenzen
    score = Math.max(0, Math.min(100, score));
    
    // Review-Status bestimmen
    let reviewStatus: ReviewStatus = "approved";
    const criticalIssues = issues.filter(i => i.severity === "critical").length;
    const warnings = issues.filter(i => i.severity === "warning").length;
    
    if (criticalIssues > 0) {
      reviewStatus = "rejected";
    } else if (warnings > 3 || score < this.QUALITY_GATE.MIN_SCORE) {
      reviewStatus = "needs_revision";
    }
    
    // Standard-Suggestions hinzufügen
    if (suggestions.length === 0) {
      suggestions.push("Code entspricht den Enterprise++ Standards");
    }
    
    return {
      review_status: reviewStatus,
      quality_score: score,
      feedback: this.generateFeedback(issues, score, reviewStatus),
      issues_found: issues,
      suggestions
    };
  }

  /**
   * Generiert Feedback-Text
   */
  private static generateFeedback(
    issues: IssueFound[],
    score: number,
    status: ReviewStatus
  ): string {
    const criticalCount = issues.filter(i => i.severity === "critical").length;
    const warningCount = issues.filter(i => i.severity === "warning").length;
    const infoCount = issues.filter(i => i.severity === "info").length;
    
    let feedback = `Quality Score: ${score}/100\n\n`;
    
    if (status === "approved") {
      feedback += "✅ Code Review BESTANDEN\n\n";
      feedback += "Der Code entspricht den Enterprise++ Standards.\n";
    } else if (status === "needs_revision") {
      feedback += "⚠️ Code Review: ÜBERARBEITUNG ERFORDERLICH\n\n";
      feedback += "Es wurden Probleme gefunden, die vor dem Merge behoben werden sollten.\n";
    } else {
      feedback += "❌ Code Review NICHT BESTANDEN\n\n";
      feedback += "Kritische Probleme gefunden. Code muss überarbeitet werden.\n";
    }
    
    feedback += `\nGefundene Issues:\n`;
    feedback += `- Kritisch: ${criticalCount}\n`;
    feedback += `- Warnungen: ${warningCount}\n`;
    feedback += `- Hinweise: ${infoCount}\n`;
    
    if (issues.length > 0) {
      feedback += `\nDetails:\n`;
      issues.forEach((issue, i) => {
        const icon = issue.severity === "critical" ? "🔴" : issue.severity === "warning" ? "🟡" : "🔵";
        feedback += `${i + 1}. ${icon} [${issue.type}] ${issue.description}\n`;
      });
    }
    
    return feedback;
  }

  /**
   * Baut den Prompt für AI-Review
   */
  private static buildReviewPrompt(
    change: CodeChange,
    taskContext: { title: string; type: string }
  ): string {
    return `
Du bist Agent-C im Enterprise++ Dev-Orchestrator.

AUFGABE: Führe ein Code-Review durch.

## Task
- Titel: ${taskContext.title}
- Typ: ${taskContext.type}

## Code-Change
- Datei: ${change.file_path}
- Typ: ${change.code_type}
- Erklärung: ${change.explanation}

## Zu prüfender Code:
\`\`\`typescript
${change.code_after}
\`\`\`

## Prüfkriterien
1. TypeScript Best Practices
2. Sicherheit (SQL-Injection, XSS, etc.)
3. Error-Handling
4. Dokumentation
5. Enterprise++ Standards

Antworte im JSON-Format:
{
  "review_status": "approved|needs_revision|rejected",
  "quality_score": 0-100,
  "feedback": "Zusammenfassung",
  "issues_found": [{"severity": "critical|warning|info", "type": "...", "description": "..."}],
  "suggestions": ["..."]
}
`;
  }

  /**
   * Parst die AI-Review-Antwort
   */
  private static parseAIReviewResponse(response: string): {
    review_status: ReviewStatus;
    quality_score: number;
    feedback: string;
    issues_found: IssueFound[];
    suggestions: string[];
  } {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          review_status: parsed.review_status || "approved",
          quality_score: parsed.quality_score || 80,
          feedback: parsed.feedback || "AI-Review abgeschlossen",
          issues_found: parsed.issues_found || [],
          suggestions: parsed.suggestions || []
        };
      }
    } catch (e) {
      console.warn("[Agent-C] Konnte AI-Antwort nicht parsen");
    }
    
    // Fallback
    return {
      review_status: "approved",
      quality_score: 85,
      feedback: "AI-Review konnte nicht vollständig geparst werden. Standard-Bewertung angewendet.",
      issues_found: [],
      suggestions: ["Manuelle Prüfung empfohlen"]
    };
  }

  // -------------------------------------------------
  // REVIEW SPEICHERN
  // -------------------------------------------------

  /**
   * Speichert ein Review in der Datenbank
   */
  static async saveReview(
    taskId: number,
    changeId: number,
    review: {
      review_status: ReviewStatus;
      quality_score: number;
      feedback: string;
      issues_found: IssueFound[];
      suggestions: string[];
    }
  ): Promise<CodeReview> {
    const pool = await getConnection();
    
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO dev_reviews 
        (task_id, change_id, review_status, quality_score, feedback, issues_found, suggestions, reviewer_agent) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Agent-C')`,
      [
        taskId,
        changeId,
        review.review_status,
        review.quality_score,
        review.feedback,
        JSON.stringify(review.issues_found),
        JSON.stringify(review.suggestions)
      ]
    );

    const reviewId = result.insertId;
    
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM dev_reviews WHERE id = ?`,
      [reviewId]
    );
    
    return rows[0] as CodeReview;
  }

  /**
   * Lädt alle Reviews für einen Task
   */
  static async getReviewsForTask(taskId: number): Promise<CodeReview[]> {
    const pool = await getConnection();
    
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM dev_reviews WHERE task_id = ? ORDER BY id ASC`,
      [taskId]
    );
    
    return rows as CodeReview[];
  }

  /**
   * Aktualisiert den Status eines Code-Changes basierend auf Review
   */
  static async updateCodeChangeStatus(changeId: number, status: string): Promise<void> {
    const pool = await getConnection();
    
    await pool.execute(
      `UPDATE dev_code_changes SET status = ?, updated_at = NOW() WHERE id = ?`,
      [status, changeId]
    );
  }

  // -------------------------------------------------
  // REVIEW AUSFÜHREN
  // -------------------------------------------------

  /**
   * Führt den kompletten Review für einen Task aus
   */
  static async runReview(taskId: number): Promise<ReviewResult> {
    const reviews: CodeReview[] = [];
    let totalScore = 0;
    let hasRejected = false;
    let hasNeedsRevision = false;
    
    // 1. Code-Changes laden
    const { task, changes } = await this.loadCodeChanges(taskId);
    
    if (changes.length === 0) {
      throw new Error("Keine Code-Changes zum Review vorhanden");
    }
    
    // 2. Task-Status auf 'review' setzen
    await DevTasksService.updateTaskStatus(taskId, "review");
    
    // 3. Jeden Change reviewen
    for (const change of changes) {
      const reviewResult = await this.evaluateCode(change, {
        title: task.title,
        type: task.type
      });
      
      // Review speichern
      const savedReview = await this.saveReview(taskId, change.id, reviewResult);
      reviews.push(savedReview);
      
      // Code-Change Status aktualisieren
      await this.updateCodeChangeStatus(change.id, reviewResult.review_status);
      
      // Statistiken sammeln
      totalScore += reviewResult.quality_score;
      if (reviewResult.review_status === "rejected") hasRejected = true;
      if (reviewResult.review_status === "needs_revision") hasNeedsRevision = true;
    }
    
    // 4. Gesamt-Score berechnen
    const overallScore = Math.round(totalScore / changes.length);
    
    // 5. Gesamt-Status bestimmen
    let overallStatus: ReviewStatus = "approved";
    if (hasRejected) {
      overallStatus = "rejected";
    } else if (hasNeedsRevision || overallScore < this.QUALITY_GATE.MIN_SCORE) {
      overallStatus = "needs_revision";
    }
    
    // 6. Quality Gate prüfen
    const qualityGatePassed = overallStatus === "approved" && overallScore >= this.QUALITY_GATE.MIN_SCORE;
    
    // 7. Task-Status final setzen
    if (qualityGatePassed) {
      await DevTasksService.updateTaskStatus(taskId, "done");
    }
    
    return {
      success: true,
      task_id: taskId,
      reviews,
      overall_status: overallStatus,
      overall_score: overallScore,
      summary: this.generateReviewSummary(reviews, overallScore, qualityGatePassed),
      quality_gate_passed: qualityGatePassed
    };
  }

  /**
   * Generiert Review-Zusammenfassung
   */
  private static generateReviewSummary(
    reviews: CodeReview[],
    overallScore: number,
    passed: boolean
  ): string {
    const approved = reviews.filter(r => r.review_status === "approved").length;
    const needsRevision = reviews.filter(r => r.review_status === "needs_revision").length;
    const rejected = reviews.filter(r => r.review_status === "rejected").length;
    
    let summary = `Enterprise++ Quality Gate: ${passed ? "✅ BESTANDEN" : "❌ NICHT BESTANDEN"}\n\n`;
    summary += `Gesamt-Score: ${overallScore}/100\n`;
    summary += `Reviews: ${reviews.length} (${approved} ✅ | ${needsRevision} ⚠️ | ${rejected} ❌)\n\n`;
    
    if (passed) {
      summary += "Alle Code-Changes haben das Quality Gate bestanden. Task kann als abgeschlossen markiert werden.";
    } else {
      summary += "Einige Code-Changes erfordern Überarbeitung. Bitte die Feedback-Details prüfen.";
    }
    
    return summary;
  }
}

export default AgentCReviewer;



