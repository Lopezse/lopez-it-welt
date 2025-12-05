/**
 * Orchestrator Queue Status API - Enterprise++ Standard
 * 
 * GET /api/orchestrator/queue/status
 * Gibt Queue-Status zurück
 */

import { NextRequest, NextResponse } from "next/server";
import { getQueueStatus } from "@/lib/ki-orchestrator/QueueManager";
import { logger } from "@/lib/logger";

/**
 * GET /api/orchestrator/queue/status
 * Gibt Queue-Status zurück
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

        const status = await getQueueStatus();

        return NextResponse.json({
            success: true,
            data: status
        });
    } catch (error) {
        logger.error("Fehler beim Abrufen des Queue-Status", error);
        return NextResponse.json(
            { success: false, message: "Fehler beim Abrufen des Queue-Status" },
            { status: 500 }
        );
    }
}



