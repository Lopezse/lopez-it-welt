/**
 * Orchestrator Task API - Enterprise++ Standard
 * 
 * POST /api/orchestrator/task
 * Nimmt generische Orchestrierungs-Anfragen an
 */

import { NextRequest, NextResponse } from "next/server";
import { orchestratorCore } from "@/lib/ki-orchestrator/OrchestratorCore";
import { agentRegistry } from "@/lib/ki-orchestrator/AgentRegistry";
import { contextManager } from "@/lib/ki-orchestrator/ContextManager";
import { qualityGate } from "@/lib/ki-orchestrator/QualityGate";
import { dsgvoDecisionEngine } from "@/lib/dsgvo/decision-engine";
import type { OrchestratorTask } from "@/lib/ki-orchestrator/types";
import { logger } from "@/lib/logger";

/**
 * POST /api/orchestrator/task
 * Dispatcht einen Task an einen Agenten
 */
export async function POST(request: NextRequest) {
    try {
        // RBAC-Prüfung (vereinfacht - in Produktion: echte Session-Prüfung)
        const authHeader = request.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json(
                { success: false, message: "Nicht authentifiziert" },
                { status: 401 }
            );
        }

        // Request-Body parsen
        const body = await request.json();
        const { agent, purpose, userId, payload, priority, async } = body;

        // Validierung
        if (!agent || !purpose || !userId) {
            return NextResponse.json(
                { success: false, message: "agent, purpose und userId sind erforderlich" },
                { status: 400 }
            );
        }

        // 1. AgentRegistry prüfen (existiert Agent?)
        if (!agentRegistry.hasAgent(agent)) {
            return NextResponse.json(
                { success: false, message: `Agent ${agent} nicht gefunden` },
                { status: 404 }
            );
        }

        // 2. DSGVO Decision Engine prüfen (P4)
        const dsgvoDecision = await dsgvoDecisionEngine.getAIProcessingPermission({
            userId,
            purpose: mapPurposeToDSGVOPurpose(purpose),
            mediaId: payload?.mediaId as string | undefined,
            context: payload || {}
        });

        if (!dsgvoDecision.allowed) {
            return NextResponse.json(
                {
                    success: false,
                    message: "DSGVO-Blocker",
                    reason: dsgvoDecision.reason,
                    risk: dsgvoDecision.risk
                },
                { status: 403 }
            );
        }

        // 3. Task erstellen
        const task: OrchestratorTask = {
            agent,
            purpose,
            userId,
            payload: payload || {},
            priority: priority || "medium"
        };

        // 4. ContextManager → Kontext bauen
        const context = await contextManager.buildContextForTask(task);

        // 5. QualityGate → Input prüfen
        const inputQuality = await qualityGate.evaluateInputQuality(task);
        if (!inputQuality.passed) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Input Quality Gate fehlgeschlagen",
                    issues: inputQuality.issues,
                    warnings: inputQuality.warnings
                },
                { status: 400 }
            );
        }

        // 6. OrchestratorCore.dispatchTask() aufrufen (synchron oder asynchron)
        if (async) {
            // Asynchron: In Queue einreihen
            const taskId = await orchestratorCore.dispatchTaskAsync(task, { priority: priority === "high" ? 10 : priority === "medium" ? 5 : 0 });
            if (taskId) {
                return NextResponse.json({
                    success: true,
                    data: { taskId, status: "queued", message: "Task wurde in Queue eingereiht" }
                });
            } else {
                // Fallback: Synchron verarbeiten, wenn Queue nicht verfügbar
                logger.warn("Queue nicht verfügbar, verarbeite Task synchron");
                const result = await orchestratorCore.dispatchTask(task);
                return NextResponse.json({
                    success: result.success,
                    data: result
                });
            }
        } else {
            // Synchron: Direkt verarbeiten
            const result = await orchestratorCore.dispatchTask(task);
            return NextResponse.json({
                success: result.success,
                data: result
            });
        }
    } catch (error) {
        logger.error("Fehler beim Verarbeiten des Orchestrator-Tasks", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Fehler beim Verarbeiten des Tasks"
            },
            { status: 500 }
        );
    }
}

/**
 * Mappt Purpose zu DSGVO-Purpose
 */
function mapPurposeToDSGVOPurpose(purpose: string): 
    "media_ki" | "orchestrator_ki" | "person_detection" | "profile_building" | "analytics" {
    
    if (purpose.includes("media") || purpose.includes("image") || purpose.includes("tagging")) {
        return "media_ki";
    }
    if (purpose.includes("person") || purpose.includes("detection")) {
        return "person_detection";
    }
    if (purpose.includes("profile") || purpose.includes("building")) {
        return "profile_building";
    }
    if (purpose.includes("analytics") || purpose.includes("analysis")) {
        return "analytics";
    }

    return "orchestrator_ki";
}

