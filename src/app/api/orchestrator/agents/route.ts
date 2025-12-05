/**
 * Orchestrator Agents API - Enterprise++ Standard
 * 
 * GET /api/orchestrator/agents
 * Liefert Liste aller registrierten Agenten (read-only)
 */

import { NextRequest, NextResponse } from "next/server";
import { agentRegistry } from "@/lib/ki-orchestrator/AgentRegistry";
import { logger } from "@/lib/logger";

/**
 * GET /api/orchestrator/agents
 * Gibt Liste aller registrierten Agenten zurück
 */
export async function GET(request: NextRequest) {
    try {
        // RBAC-Prüfung (vereinfacht - in Produktion: echte Session-Prüfung)
        const authHeader = request.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json(
                { success: false, message: "Nicht authentifiziert" },
                { status: 401 }
            );
        }

        // Agenten-Liste abrufen
        const agents = agentRegistry.listAgents();

        return NextResponse.json({
            success: true,
            data: {
                agents,
                count: agents.length
            }
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen der Agenten-Liste", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen der Agenten-Liste" },
            { status: 500 }
        );
    }
}



