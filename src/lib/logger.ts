/**
 * Enterprise++ Logger - SAP/IBM/Siemens Standard
 * 
 * Professionelles Logging-System mit verschiedenen Log-Levels
 * - Keine Secrets in Logs
 * - Strukturierte Logs für Monitoring
 * - Production-Safe (keine Debug-Logs in Production)
 */

type LogLevel = "debug" | "info" | "warn" | "error" | "critical";

interface LogContext {
    [key: string]: any;
}

class EnterpriseLogger {
    private isDevelopment: boolean;
    private isProduction: boolean;

    constructor() {
        this.isDevelopment = process.env.NODE_ENV === "development";
        this.isProduction = process.env.NODE_ENV === "production";
    }

    /**
     * Maskiert Secrets in Log-Kontexten
     */
    private maskSecrets(context: LogContext): LogContext {
        const masked = { ...context };
        const secretKeys = ["password", "token", "secret", "key", "api_key", "apiKey", "authorization"];

        for (const key of Object.keys(masked)) {
            const lowerKey = key.toLowerCase();
            if (secretKeys.some((secret) => lowerKey.includes(secret))) {
                masked[key] = "***MASKED***";
            }
        }

        return masked;
    }

    /**
     * Formatiert Log-Eintrag
     */
    private formatLog(level: LogLevel, message: string, context?: LogContext): string {
        const timestamp = new Date().toISOString();
        const maskedContext = context ? this.maskSecrets(context) : undefined;
        const contextStr = maskedContext ? ` ${JSON.stringify(maskedContext)}` : "";

        return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
    }

    /**
     * Debug-Log (nur in Development)
     */
    debug(message: string, context?: LogContext): void {
        if (this.isDevelopment) {
            console.debug(this.formatLog("debug", message, context));
        }
    }

    /**
     * Info-Log
     */
    info(message: string, context?: LogContext): void {
        console.log(this.formatLog("info", message, context));
    }

    /**
     * Warn-Log
     */
    warn(message: string, context?: LogContext): void {
        console.warn(this.formatLog("warn", message, context));
    }

    /**
     * Error-Log
     */
    error(message: string, error?: Error | unknown, context?: LogContext): void {
        const errorContext: LogContext = {
            ...context,
            error: error instanceof Error ? {
                message: error.message,
                stack: this.isDevelopment ? error.stack : undefined,
                name: error.name,
            } : String(error),
        };

        console.error(this.formatLog("error", message, errorContext));
    }

    /**
     * Critical-Log (für kritische Fehler)
     */
    critical(message: string, error?: Error | unknown, context?: LogContext): void {
        const errorContext: LogContext = {
            ...context,
            error: error instanceof Error ? {
                message: error.message,
                stack: this.isDevelopment ? error.stack : undefined,
                name: error.name,
            } : String(error),
        };

        console.error(this.formatLog("critical", message, errorContext));

        // In Production: Hier könnte zusätzlich ein Alert-System benachrichtigt werden
        // z.B. Sentry, PagerDuty, etc.
        if (this.isProduction) {
            // TODO: Alert-System integrieren (Sentry, etc.)
        }
    }

    /**
     * API-Request-Log
     */
    request(method: string, path: string, statusCode: number, duration?: number, context?: LogContext): void {
        const logContext: LogContext = {
            method,
            path,
            statusCode,
            ...(duration !== undefined && { duration: `${duration}ms` }),
            ...context,
        };

        if (statusCode >= 500) {
            this.error(`API Request failed: ${method} ${path}`, undefined, logContext);
        } else if (statusCode >= 400) {
            this.warn(`API Request warning: ${method} ${path}`, logContext);
        } else {
            this.info(`API Request: ${method} ${path}`, logContext);
        }
    }

    /**
     * Database-Operation-Log
     */
    database(operation: string, table?: string, context?: LogContext): void {
        const logContext: LogContext = {
            operation,
            ...(table && { table }),
            ...context,
        };

        this.info(`Database operation: ${operation}`, logContext);
    }

    /**
     * Security-Event-Log
     */
    security(event: string, context?: LogContext): void {
        const logContext: LogContext = {
            event,
            ...context,
        };

        this.warn(`Security event: ${event}`, logContext);
    }
}

// Singleton-Instanz
export const logger = new EnterpriseLogger();

// Export für direkten Zugriff
export default logger;





