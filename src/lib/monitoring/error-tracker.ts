/**
 * Error Tracker - Enterprise++ Standard
 * 
 * Zentrale Fehlerverfolgung für Production-Monitoring
 * Vorbereitet für Sentry-Integration
 */

import { logger } from "@/lib/logger";

interface ErrorContext {
    userId?: number | string;
    requestId?: string;
    path?: string;
    method?: string;
    userAgent?: string;
    ip?: string;
    [key: string]: any;
}

class ErrorTracker {
    private sentryEnabled: boolean = false;
    private sentryDsn: string | null = null;

    constructor() {
        // Sentry-Konfiguration aus ENV laden
        this.sentryDsn = process.env.SENTRY_DSN || null;
        this.sentryEnabled = !!this.sentryDsn && process.env.NODE_ENV === "production";

        if (this.sentryEnabled) {
            // TODO: Sentry initialisieren, wenn DSN vorhanden
            // import * as Sentry from "@sentry/nextjs";
            // Sentry.init({ dsn: this.sentryDsn });
            logger.info("Error Tracker: Sentry-Integration vorbereitet", { 
                sentryEnabled: this.sentryEnabled 
            });
        }
    }

    /**
     * Trackt einen Fehler
     */
    trackError(error: Error | unknown, context?: ErrorContext): void {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;

        // Logging
        logger.error("Error tracked", error, context);

        // Sentry-Integration (wenn aktiviert)
        if (this.sentryEnabled) {
            // TODO: Sentry.captureException(error, { extra: context });
        }
    }

    /**
     * Trackt einen kritischen Fehler
     */
    trackCritical(error: Error | unknown, context?: ErrorContext): void {
        const errorMessage = error instanceof Error ? error.message : String(error);

        // Logging
        logger.critical("Critical error tracked", error, context);

        // Sentry-Integration (wenn aktiviert)
        if (this.sentryEnabled) {
            // TODO: Sentry.captureException(error, { level: "fatal", extra: context });
        }

        // Zusätzlich: Alert-System benachrichtigen
        // TODO: Alert-System integrieren (PagerDuty, Slack, etc.)
    }

    /**
     * Trackt einen API-Fehler
     */
    trackApiError(
        method: string,
        path: string,
        statusCode: number,
        error: Error | unknown,
        context?: ErrorContext
    ): void {
        const apiContext: ErrorContext = {
            ...context,
            method,
            path,
            statusCode,
        };

        if (statusCode >= 500) {
            this.trackCritical(error, apiContext);
        } else {
            this.trackError(error, apiContext);
        }
    }

    /**
     * Trackt einen Security-Event
     */
    trackSecurityEvent(event: string, context?: ErrorContext): void {
        const securityContext: ErrorContext = {
            ...context,
            eventType: "security",
        };

        logger.security(`Security event: ${event}`, securityContext);

        // Sentry-Integration (wenn aktiviert)
        if (this.sentryEnabled) {
            // TODO: Sentry.captureMessage(`Security: ${event}`, { level: "warning", extra: securityContext });
        }
    }
}

// Singleton-Instanz
export const errorTracker = new ErrorTracker();

export default errorTracker;





