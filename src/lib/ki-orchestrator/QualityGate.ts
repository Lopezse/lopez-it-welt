/**
 * Quality Gate - Enterprise++ Standard
 * 
 * Zentrale Quality-Gate-Logik für KI-Orchestrator
 * Prüft Input- und Output-Qualität sowie Policy-Compliance
 */

import type { OrchestratorTask, OrchestratorResult, QualityGateResult } from "./types";
import { logger } from "@/lib/logger";

class QualityGate {
    /**
     * Bewertet Input-Qualität
     */
    async evaluateInputQuality(task: OrchestratorTask): Promise<QualityGateResult> {
        const issues: string[] = [];
        const warnings: string[] = [];
        let score = 100;

        // 1. Prüfe erforderliche Felder
        if (!task.agent) {
            issues.push("Agent-Name fehlt");
            score -= 30;
        }

        if (!task.purpose) {
            issues.push("Purpose fehlt");
            score -= 30;
        }

        if (!task.userId) {
            issues.push("User-ID fehlt");
            score -= 30;
        }

        // 2. Prüfe Payload
        if (!task.payload || Object.keys(task.payload).length === 0) {
            warnings.push("Payload ist leer");
            score -= 10;
        }

        // 3. Prüfe Agent-Name-Format
        if (task.agent && !task.agent.includes("-agent")) {
            warnings.push("Agent-Name sollte Format 'name-agent' haben");
            score -= 5;
        }

        // 4. Prüfe Purpose-Format
        if (task.purpose && task.purpose.length < 3) {
            issues.push("Purpose zu kurz");
            score -= 20;
        }

        const passed = issues.length === 0 && score >= 70;

        return {
            passed,
            score: Math.max(0, score),
            issues,
            warnings: warnings.length > 0 ? warnings : undefined
        };
    }

    /**
     * Bewertet Output-Qualität
     */
    async evaluateOutputQuality(result: OrchestratorResult): Promise<QualityGateResult> {
        const issues: string[] = [];
        const warnings: string[] = [];
        let score = 100;

        // 1. Prüfe Erfolg
        if (!result.success) {
            issues.push("Task fehlgeschlagen");
            score -= 50;
        }

        // 2. Prüfe Ergebnis
        if (result.success && !result.result) {
            warnings.push("Task erfolgreich, aber kein Ergebnis");
            score -= 20;
        }

        // 3. Prüfe Fehler
        if (!result.success && !result.error) {
            issues.push("Task fehlgeschlagen, aber kein Fehler angegeben");
            score -= 30;
        }

        // 4. Prüfe Quality-Score
        if (result.qualityScore !== undefined) {
            if (result.qualityScore < 70) {
                issues.push(`Quality-Score zu niedrig: ${result.qualityScore}`);
                score -= 30;
            } else if (result.qualityScore < 80) {
                warnings.push(`Quality-Score könnte besser sein: ${result.qualityScore}`);
                score -= 10;
            }
        }

        // 5. Prüfe DSGVO-Entscheidung
        if (result.dsgvoDecision && !result.dsgvoDecision.allowed) {
            issues.push(`DSGVO-Blocker: ${result.dsgvoDecision.reason}`);
            score -= 50;
        }

        const passed = issues.length === 0 && score >= 70;

        return {
            passed,
            score: Math.max(0, score),
            issues,
            warnings: warnings.length > 0 ? warnings : undefined
        };
    }

    /**
     * Prüft Policy-Compliance
     */
    async checkPolicyCompliance(
        task: OrchestratorTask,
        result: OrchestratorResult
    ): Promise<QualityGateResult> {
        const issues: string[] = [];
        const warnings: string[] = [];
        let score = 100;

        // 1. DSGVO-Compliance
        if (result.dsgvoDecision && !result.dsgvoDecision.allowed) {
            issues.push("DSGVO-Compliance verletzt");
            score -= 50;
        }

        // 2. Risk-Score prüfen
        if (result.dsgvoDecision && result.dsgvoDecision.risk >= 70) {
            issues.push(`Risiko-Score zu hoch: ${result.dsgvoDecision.risk}`);
            score -= 40;
        } else if (result.dsgvoDecision && result.dsgvoDecision.risk >= 40) {
            warnings.push(`Risiko-Score erhöht: ${result.dsgvoDecision.risk}`);
            score -= 20;
        }

        // 3. Timestamp prüfen
        if (!result.timestamp) {
            issues.push("Timestamp fehlt");
            score -= 10;
        }

        // 4. Task-ID prüfen
        if (!result.taskId) {
            issues.push("Task-ID fehlt");
            score -= 10;
        }

        const passed = issues.length === 0 && score >= 70;

        return {
            passed,
            score: Math.max(0, score),
            issues,
            warnings: warnings.length > 0 ? warnings : undefined
        };
    }

    /**
     * Kombinierte Quality-Gate-Prüfung (Input + Output + Policy)
     */
    async evaluateComplete(
        task: OrchestratorTask,
        result: OrchestratorResult
    ): Promise<QualityGateResult> {
        const [inputQuality, outputQuality, policyCompliance] = await Promise.all([
            this.evaluateInputQuality(task),
            this.evaluateOutputQuality(result),
            this.checkPolicyCompliance(task, result)
        ]);

        // Kombiniere Ergebnisse
        const allIssues = [
            ...inputQuality.issues,
            ...outputQuality.issues,
            ...policyCompliance.issues
        ];

        const allWarnings = [
            ...(inputQuality.warnings || []),
            ...(outputQuality.warnings || []),
            ...(policyCompliance.warnings || [])
        ];

        const avgScore = (
            inputQuality.score + 
            outputQuality.score + 
            policyCompliance.score
        ) / 3;

        const passed = allIssues.length === 0 && avgScore >= 70;

        return {
            passed,
            score: Math.round(avgScore),
            issues: allIssues,
            warnings: allWarnings.length > 0 ? allWarnings : undefined
        };
    }
}

export const qualityGate = new QualityGate();



