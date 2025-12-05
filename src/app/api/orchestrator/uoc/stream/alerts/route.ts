/**
 * UOC Alerts SSE Stream - Enterprise++ Standard P9
 * 
 * GET /api/orchestrator/uoc/stream/alerts - Live-Alerts streamen (Server-Sent Events)
 * 
 * RBAC: security.view
 */

import { NextRequest } from "next/server";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { RBACService } from "@/lib/rbac-system";
import { logger } from "@/lib/logger";
import { liveStreamingManager } from "@/lib/ki-orchestrator/level2/uoc/LiveStreamingManager";
import { alertClient } from "@/lib/ki-orchestrator/level2/uoc/clients";
import type { StreamFilters } from "@/lib/ki-orchestrator/level2/uoc/types";

/**
 * GET /api/orchestrator/uoc/stream/alerts
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
      resource: "security",
      action: "view",
    });

    if (!hasPermission) {
      return new Response("Forbidden", { status: 403 });
    }

    // Query-Parameter auslesen
    const { searchParams } = new URL(request.url);
    const severity = searchParams.get("severity");
    const category = searchParams.get("category");

    // Filter erstellen
    const filters: StreamFilters = {
      eventTypes: ["alert"],
      severities: severity ? [severity] : undefined,
      categories: category ? [category] : undefined,
    };

    // SSE-Verbindung erstellen
    const clientId = `alerts-${session.userId}-${Date.now()}`;
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
            logger.error("UOC Alerts SSE: Failed to send event", { error, eventType });
          }
        };

        // Initiale Alerts senden
        try {
          const alerts = await alertClient.getAlerts({
            severity: severity as any,
            category: category as any,
            limit: 10,
          });

          for (const alert of alerts) {
            sendEvent("alert", {
              id: alert.id,
              severity: alert.severity,
              category: alert.category,
              title: alert.title,
              description: alert.description,
              timestamp: alert.triggered_at,
            });
          }
        } catch (error) {
          logger.error("UOC Alerts SSE: Failed to fetch initial alerts", { error });
        }

        // Heartbeat alle 30 Sekunden
        const heartbeatInterval = setInterval(() => {
          try {
            liveStreamingManager.sendHeartbeat(connection.id);
            sendEvent("heartbeat", { timestamp: new Date().toISOString() });
          } catch (error) {
            logger.error("UOC Alerts SSE: Heartbeat failed", { error });
          }
        }, 30000);

        // Cleanup bei Verbindungsabbruch
        request.signal.addEventListener("abort", () => {
          try {
            clearInterval(heartbeatInterval);
            liveStreamingManager.closeConnection(connection.id);
            controller.close();
          } catch (error) {
            logger.error("UOC Alerts SSE: Cleanup failed", { error });
          }
        });

        // Polling für neue Alerts (alle 5 Sekunden)
        const pollingInterval = setInterval(async () => {
          try {
            const alerts = await alertClient.getAlerts({
              severity: severity as any,
              category: category as any,
              limit: 10,
            });

            // Sende nur neue Alerts (vereinfacht: sende alle)
            for (const alert of alerts) {
              sendEvent("alert", {
                id: alert.id,
                severity: alert.severity,
                category: alert.category,
                title: alert.title,
                description: alert.description,
                timestamp: alert.triggered_at,
              });
            }
          } catch (error) {
            logger.error("UOC Alerts SSE: Polling failed", { error });
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
    logger.error("UOC Alerts SSE API failed", { error });
    return new Response("Internal Server Error", { status: 500 });
  }
}




