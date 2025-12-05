/**
 * API Monitoring Middleware - Enterprise++ Standard
 * 
 * Automatisches Tracking von API-Requests:
 * - Performance-Tracking
 * - Error-Tracking
 * - Request-Logging
 */

import { NextRequest, NextResponse } from "next/server";
import { performanceTracker } from "./performance-tracker";
import { errorTracker } from "./error-tracker";
import { logger } from "@/lib/logger";

/**
 * Wrapper für API-Route-Handler mit automatischem Monitoring
 */
export function withMonitoring<T extends (...args: any[]) => Promise<NextResponse>>(
    handler: T
): T {
    return (async (...args: Parameters<T>) => {
        const request = args[0] as NextRequest;
        const startTime = Date.now();
        const method = request.method;
        const path = request.nextUrl.pathname;

        try {
            // Handler ausführen
            const response = await handler(...args);

            // Performance-Tracking
            const duration = Date.now() - startTime;
            const statusCode = response.status;
            performanceTracker.trackApiRequest(method, path, duration, statusCode);

            // Request-Logging
            logger.request(method, path, statusCode, duration, {
                userAgent: request.headers.get("user-agent") || undefined,
                ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
            });

            // Error-Tracking bei Fehlern
            if (statusCode >= 400) {
                const error = new Error(`API Request failed: ${method} ${path} - ${statusCode}`);
                errorTracker.trackApiError(method, path, statusCode, error, {
                    duration,
                });
            }

            return response;
        } catch (error) {
            // Error-Tracking
            const duration = Date.now() - startTime;
            errorTracker.trackApiError(method, path, 500, error, {
                duration,
            });

            // Re-throw für Standard-Error-Handling
            throw error;
        }
    }) as T;
}





