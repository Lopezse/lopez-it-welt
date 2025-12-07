/**
 * UOC Events SSE Stream - Enterprise++ Standard P9
 * 
 * GET /api/orchestrator/uoc/stream/events - Live-Events streamen (alle Event-Typen)
 * 
 * RBAC: monitoring.view ODER logs.view ODER security.view
 */

import { NextRequest } from "next/server";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { RBACService } from "@/lib/rbac-system";
import { logger } from "@/lib/logger";
import { liveStreamingManager } from "@/lib/ki-orchestrator/level2/uoc/LiveStreamingManager";
import { alertClient, logClient, metricClient } from "@/lib/ki-orchestrator/level2/uoc/clients";
import type { StreamFilters } from "@/lib/ki-orchestrator/level2/uoc/types";

/**
 * GET /api/orchestrator/uoc/stream/events
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

    // RBAC-Prüfung (mindestens eine Berechtigung erforderlich)
    const hasMonitoring = await RBACService.checkPermission({
      user_id: session.userId,
      resource: "monitoring",
      action: "view",
    });
    const hasLogs = await RBACService.checkPermission({
      user_id: session.userId,
      resource: "logs",
      action: "view",
    });
    const hasSecurity = await RBACService.checkPermission({
      user_id: session.userId,
      resource: "security",
      action: "view",
    });

    if (!hasMonitoring && !hasLogs && !hasSecurity) {
      return new Response("Forbidden", { status: 403 });
    }

    // Query-Parameter auslesen
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source");
    const severity = searchParams.get("severity");

    // Filter erstellen
    const filters: StreamFilters = {
      eventTypes: source
        ? ([source] as ("alert" | "metric" | "log" | "health" | "incident")[])
        : ["alert", "metric", "log", "health", "incident"],
      severities: severity ? [severity] : undefined,
    };

    // SSE-Verbindung erstellen
    const clientId = `events-${session.userId}-${Date.now()}`;
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
            logger.error("UOC Events SSE: Failed to send event", { error, eventType });
          }
        };

        // Initiale Events senden
        try {
          if (!source || source === "alert") {
            const alerts = await alertClient.getAlerts({
              severity: severity as any,
              limit: 10,
            });
            for (const alert of alerts) {
              sendEvent("alert", {
                id: alert.id,
                type: "alert",
                severity: alert.severity,
                category: alert.category,
                title: alert.title,
                timestamp: alert.triggered_at,
              });
            }
          }

          if (!source || source === "metric") {
            const metrics = await metricClient.getLiveMetrics({
              limit: 20,
            });
            for (const metric of metrics) {
              sendEvent("metric", {
                id: metric.id,
                type: "metric",
                metric_id: metric.metric_id,
                value: metric.value,
                timestamp: metric.metric_timestamp.toISOString(),
              });
            }
          }

          if (!source || source === "log") {
            const logs = await logClient.getLogs({
              severity: severity as any,
              limit: 20,
            });
            for (const log of logs) {
              sendEvent("log", {
                id: log.id,
                type: "log",
                log_level: log.log_level,
                category: log.category,
                message: log.message,
                timestamp: log.timestamp.toISOString(),
              });
            }
          }
        } catch (error) {
          logger.error("UOC Events SSE: Failed to fetch initial events", { error });
        }

        // Heartbeat alle 30 Sekunden
        const heartbeatInterval = setInterval(() => {
          try {
            liveStreamingManager.sendHeartbeat(connection.id);
            sendEvent("heartbeat", { timestamp: new Date().toISOString() });
          } catch (error) {
            logger.error("UOC Events SSE: Heartbeat failed", { error });
          }
        }, 30000);

        // Cleanup bei Verbindungsabbruch
        request.signal.addEventListener("abort", () => {
          try {
            clearInterval(heartbeatInterval);
            liveStreamingManager.closeConnection(connection.id);
            controller.close();
          } catch (error) {
            logger.error("UOC Events SSE: Cleanup failed", { error });
          }
        });

        // Polling für neue Events (alle 5 Sekunden)
        const pollingInterval = setInterval(async () => {
          try {
            if (!source || source === "alert") {
              const alerts = await alertClient.getAlerts({
                severity: severity as any,
                limit: 10,
              });
              for (const alert of alerts) {
                sendEvent("alert", {
                  id: alert.id,
                  type: "alert",
                  severity: alert.severity,
                  category: alert.category,
                  title: alert.title,
                  timestamp: alert.triggered_at,
                });
              }
            }

            if (!source || source === "metric") {
              const metrics = await metricClient.getLiveMetrics({
                limit: 20,
              });
              for (const metric of metrics) {
                sendEvent("metric", {
                  id: metric.id,
                  type: "metric",
                  metric_id: metric.metric_id,
                  value: metric.value,
                  timestamp: metric.metric_timestamp.toISOString(),
                });
              }
            }

            if (!source || source === "log") {
              const logs = await logClient.getLogs({
                severity: severity as any,
                limit: 20,
              });
              for (const log of logs) {
                sendEvent("log", {
                  id: log.id,
                  type: "log",
                  log_level: log.log_level,
                  category: log.category,
                  message: log.message,
                  timestamp: log.timestamp.toISOString(),
                });
              }
            }
          } catch (error) {
            logger.error("UOC Events SSE: Polling failed", { error });
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
    logger.error("UOC Events SSE API failed", { error });
    return new Response("Internal Server Error", { status: 500 });
  }
}




