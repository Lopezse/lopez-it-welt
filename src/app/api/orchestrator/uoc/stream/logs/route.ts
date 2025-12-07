/**
 * UOC Logs SSE Stream - Enterprise++ Standard P9
 * 
 * GET /api/orchestrator/uoc/stream/logs - Live-Logs streamen (Server-Sent Events)
 * 
 * RBAC: logs.view
 */

import { NextRequest } from "next/server";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { RBACService } from "@/lib/rbac-system";
import { logger } from "@/lib/logger";
import { liveStreamingManager } from "@/lib/ki-orchestrator/level2/uoc/LiveStreamingManager";
import { logClient } from "@/lib/ki-orchestrator/level2/uoc/clients";
import type { StreamFilters } from "@/lib/ki-orchestrator/level2/uoc/types";

/**
 * GET /api/orchestrator/uoc/stream/logs
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
      user_id: session.userId,
      resource: "logs",
      action: "view",
    });

    if (!hasPermission) {
      return new Response("Forbidden", { status: 403 });
    }

    // Query-Parameter auslesen
    const { searchParams } = new URL(request.url);
    const logLevel = searchParams.get("log_level");
    const category = searchParams.get("category");
    const severity = searchParams.get("severity");

    // Filter erstellen
    const filters: StreamFilters = {
      eventTypes: ["log"],
      categories: category ? [category] : undefined,
      severities: severity ? [severity] : undefined,
    };

    // SSE-Verbindung erstellen
    const clientId = `logs-${session.userId}-${Date.now()}`;
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
            logger.error("UOC Logs SSE: Failed to send event", { error, eventType });
          }
        };

        // Initiale Logs senden
        try {
          const logs = await logClient.getLogs({
            log_level: logLevel as any,
            category: category as any,
            severity: severity as any,
            limit: 20,
          });

          for (const log of logs) {
            sendEvent("log", {
              id: log.id,
              log_level: log.log_level,
              category: log.category,
              severity: log.severity,
              message: log.message,
              timestamp: log.timestamp.toISOString(),
            });
          }
        } catch (error) {
          logger.error("UOC Logs SSE: Failed to fetch initial logs", { error });
        }

        // Heartbeat alle 30 Sekunden
        const heartbeatInterval = setInterval(() => {
          try {
            liveStreamingManager.sendHeartbeat(connection.id);
            sendEvent("heartbeat", { timestamp: new Date().toISOString() });
          } catch (error) {
            logger.error("UOC Logs SSE: Heartbeat failed", { error });
          }
        }, 30000);

        // Cleanup bei Verbindungsabbruch
        request.signal.addEventListener("abort", () => {
          try {
            clearInterval(heartbeatInterval);
            liveStreamingManager.closeConnection(connection.id);
            controller.close();
          } catch (error) {
            logger.error("UOC Logs SSE: Cleanup failed", { error });
          }
        });

        // Polling für neue Logs (alle 5 Sekunden)
        const pollingInterval = setInterval(async () => {
          try {
            const logs = await logClient.getLogs({
              log_level: logLevel as any,
              category: category as any,
              severity: severity as any,
              limit: 20,
            });

            // Sende nur neue Logs (vereinfacht: sende alle)
            for (const log of logs) {
              sendEvent("log", {
                id: log.id,
                log_level: log.log_level,
                category: log.category,
                severity: log.severity,
                message: log.message,
                timestamp: log.timestamp.toISOString(),
              });
            }
          } catch (error) {
            logger.error("UOC Logs SSE: Polling failed", { error });
          }
        }, 5000);

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
    logger.error("UOC Logs SSE API failed", { error });
    return new Response("Internal Server Error", { status: 500 });
  }
}




