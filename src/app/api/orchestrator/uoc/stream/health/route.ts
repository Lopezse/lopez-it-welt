/**
 * UOC Health SSE Stream - Enterprise++ Standard P9
 * 
 * GET /api/orchestrator/uoc/stream/health - Live-Health-Status streamen (Server-Sent Events)
 * 
 * RBAC: monitoring.view
 */

import { NextRequest } from "next/server";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { RBACService } from "@/lib/rbac-system";
import { logger } from "@/lib/logger";
import { liveStreamingManager } from "@/lib/ki-orchestrator/level2/uoc/LiveStreamingManager";
import { healthClient } from "@/lib/ki-orchestrator/level2/uoc/clients";
import type { StreamFilters } from "@/lib/ki-orchestrator/level2/uoc/types";

/**
 * GET /api/orchestrator/uoc/stream/health
 */
export async function GET(request: NextRequest) {
  try {
    // Authentifizierung
    const sessionToken =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      request.cookies.get("adm_session")?.value;

    if (!sessionToken) {
      return new Response("Unauthorized", { status: 401 });
    }

    const session = await AdminAuthService.validateSession(sessionToken);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // RBAC-Prüfung
    const hasPermission = await RBACService.checkPermission({
      user_id: session.userId.toString(),
      resource: "monitoring",
      action: "view",
    });

    if (!hasPermission) {
      return new Response("Forbidden", { status: 403 });
    }

    // Filter erstellen
    const filters: StreamFilters = {
      eventTypes: ["health"],
    };

    // SSE-Verbindung erstellen
    const clientId = `health-${session.userId}-${Date.now()}`;
    const connection = liveStreamingManager.createSSEConnection(clientId, filters);

    // SSE-Stream erstellen
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        // SSE-Format: "event: <event-type>\ndata: <json-data>\n\n"
        const sendEvent = (eventType: string, data: unknown) => {
          try {
            const message = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
            controller.enqueue(encoder.encode(message));
          } catch (error) {
            logger.error("UOC Health SSE: Failed to send event", { error, eventType });
          }
        };

        // Initiale Health-Status senden
        try {
          const health = await healthClient.getHealthStatus();
          sendEvent("health", {
            status: health.status,
            score: health.score,
            issues: health.issues,
            metrics_summary: health.metrics_summary,
            timestamp: health.updated_at.toISOString(),
          });
        } catch (error) {
          logger.error("UOC Health SSE: Failed to fetch initial health", { error });
        }

        // Heartbeat alle 30 Sekunden
        const heartbeatInterval = setInterval(() => {
          try {
            liveStreamingManager.sendHeartbeat(connection.id);
            sendEvent("heartbeat", { timestamp: new Date().toISOString() });
          } catch (error) {
            logger.error("UOC Health SSE: Heartbeat failed", { error });
          }
        }, 30000);

        // Cleanup bei Verbindungsabbruch
        request.signal.addEventListener("abort", () => {
          try {
            clearInterval(heartbeatInterval);
            liveStreamingManager.closeConnection(connection.id);
            controller.close();
          } catch (error) {
            logger.error("UOC Health SSE: Cleanup failed", { error });
          }
        });

        // Polling für Health-Status (alle 10 Sekunden)
        const pollingInterval = setInterval(async () => {
          try {
            const health = await healthClient.getHealthStatus();
            sendEvent("health", {
              status: health.status,
              score: health.score,
              issues: health.issues,
              metrics_summary: health.metrics_summary,
              timestamp: health.updated_at.toISOString(),
            });
          } catch (error) {
            logger.error("UOC Health SSE: Polling failed", { error });
          }
        }, 10000);

        // Cleanup bei Verbindungsabbruch
        request.signal.addEventListener("abort", () => {
          clearInterval(pollingInterval);
        });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    logger.error("UOC Health SSE API failed", { error });
    return new Response("Internal Server Error", { status: 500 });
  }
}




