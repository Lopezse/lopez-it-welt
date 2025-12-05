/**
 * UOC Metrics SSE Stream - Enterprise++ Standard P9
 * 
 * GET /api/orchestrator/uoc/stream/metrics - Live-Metrics streamen (Server-Sent Events)
 * 
 * RBAC: monitoring.view
 */

import { NextRequest } from "next/server";
import { AdminAuthService } from "@/lib/admin-auth-service";
import { RBACService } from "@/lib/rbac-system";
import { logger } from "@/lib/logger";
import { liveStreamingManager } from "@/lib/ki-orchestrator/level2/uoc/LiveStreamingManager";
import { metricClient } from "@/lib/ki-orchestrator/level2/uoc/clients";
import type { StreamFilters } from "@/lib/ki-orchestrator/level2/uoc/types";

/**
 * GET /api/orchestrator/uoc/stream/metrics
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

    // Query-Parameter auslesen
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const metricId = searchParams.get("metric_id");

    // Filter erstellen
    const filters: StreamFilters = {
      eventTypes: ["metric"],
      categories: category ? [category] : undefined,
      sources: undefined,
    };

    // SSE-Verbindung erstellen
    const clientId = `metrics-${session.userId}-${Date.now()}`;
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
            logger.error("UOC Metrics SSE: Failed to send event", { error, eventType });
          }
        };

        // Initiale Metrics senden
        try {
          const metrics = await metricClient.getLiveMetrics({
            categories: category ? [category as any] : undefined,
            metric_ids: metricId ? [metricId] : undefined,
            limit: 50,
          });

          for (const metric of metrics) {
            sendEvent("metric", {
              metric_id: metric.metric_id,
              metric_name: metric.metric_name,
              category: metric.category,
              value: metric.value,
              unit: metric.unit,
              severity: metric.severity,
              timestamp: metric.metric_timestamp.toISOString(),
            });
          }
        } catch (error) {
          logger.error("UOC Metrics SSE: Failed to fetch initial metrics", { error });
        }

        // Heartbeat alle 30 Sekunden
        const heartbeatInterval = setInterval(() => {
          try {
            liveStreamingManager.sendHeartbeat(connection.id);
            sendEvent("heartbeat", { timestamp: new Date().toISOString() });
          } catch (error) {
            logger.error("UOC Metrics SSE: Heartbeat failed", { error });
          }
        }, 30000);

        // Cleanup bei Verbindungsabbruch
        request.signal.addEventListener("abort", () => {
          try {
            clearInterval(heartbeatInterval);
            liveStreamingManager.closeConnection(connection.id);
            controller.close();
          } catch (error) {
            logger.error("UOC Metrics SSE: Cleanup failed", { error });
          }
        });

        // Polling für neue Metrics (alle 5 Sekunden)
        const pollingInterval = setInterval(async () => {
          try {
            const metrics = await metricClient.getLiveMetrics({
              categories: category ? [category as any] : undefined,
              metric_ids: metricId ? [metricId] : undefined,
              limit: 50,
            });

            // Sende nur neue Metrics (vereinfacht: sende alle)
            for (const metric of metrics) {
              sendEvent("metric", {
                metric_id: metric.metric_id,
                metric_name: metric.metric_name,
                category: metric.category,
                value: metric.value,
                unit: metric.unit,
                severity: metric.severity,
                timestamp: metric.metric_timestamp.toISOString(),
              });
            }
          } catch (error) {
            logger.error("UOC Metrics SSE: Polling failed", { error });
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
    logger.error("UOC Metrics SSE API failed", { error });
    return new Response("Internal Server Error", { status: 500 });
  }
}




