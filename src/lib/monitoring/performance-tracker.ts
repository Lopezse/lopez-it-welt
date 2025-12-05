/**
 * Performance Tracker - Enterprise++ Standard
 * 
 * Performance-Monitoring für API-Requests und Database-Operations
 * Vorbereitet für APM-Integration (New Relic, Datadog, etc.)
 */

import { logger } from "@/lib/logger";

interface PerformanceMetric {
    operation: string;
    duration: number;
    timestamp: Date;
    metadata?: {
        [key: string]: any;
    };
}

class PerformanceTracker {
    private metrics: PerformanceMetric[] = [];
    private maxMetrics: number = 1000; // Max. gespeicherte Metriken im Memory

    /**
     * Trackt eine Performance-Metrik
     */
    track(operation: string, duration: number, metadata?: { [key: string]: any }): void {
        const metric: PerformanceMetric = {
            operation,
            duration,
            timestamp: new Date(),
            metadata,
        };

        // Metrik speichern
        this.metrics.push(metric);

        // Alte Metriken entfernen (FIFO)
        if (this.metrics.length > this.maxMetrics) {
            this.metrics.shift();
        }

        // Warnung bei langsamen Operationen
        if (duration > 1000) {
            logger.warn("Slow operation detected", {
                operation,
                duration: `${duration}ms`,
                ...metadata,
            });
        }

        // Logging
        logger.info(`Performance: ${operation}`, {
            duration: `${duration}ms`,
            ...metadata,
        });
    }

    /**
     * Trackt einen API-Request
     */
    trackApiRequest(method: string, path: string, duration: number, statusCode: number): void {
        this.track(`API ${method} ${path}`, duration, {
            method,
            path,
            statusCode,
        });
    }

    /**
     * Trackt eine Database-Operation
     */
    trackDatabaseOperation(operation: string, table: string, duration: number): void {
        this.track(`DB ${operation}`, duration, {
            table,
            operation,
        });
    }

    /**
     * Gibt Performance-Statistiken zurück
     */
    getStats(operation?: string): {
        count: number;
        avgDuration: number;
        minDuration: number;
        maxDuration: number;
        p95Duration: number;
    } {
        const relevantMetrics = operation
            ? this.metrics.filter((m) => m.operation === operation)
            : this.metrics;

        if (relevantMetrics.length === 0) {
            return {
                count: 0,
                avgDuration: 0,
                minDuration: 0,
                maxDuration: 0,
                p95Duration: 0,
            };
        }

        const durations = relevantMetrics.map((m) => m.duration).sort((a, b) => a - b);
        const sum = durations.reduce((a, b) => a + b, 0);
        const avg = sum / durations.length;
        const min = durations[0];
        const max = durations[durations.length - 1];
        const p95Index = Math.floor(durations.length * 0.95);
        const p95 = durations[p95Index] || 0;

        return {
            count: relevantMetrics.length,
            avgDuration: Math.round(avg),
            minDuration: min,
            maxDuration: max,
            p95Duration: p95,
        };
    }

    /**
     * Gibt alle Metriken zurück (für Monitoring-Endpoint)
     */
    getAllMetrics(): PerformanceMetric[] {
        return [...this.metrics];
    }

    /**
     * Löscht alle Metriken (für Testing/Reset)
     */
    clear(): void {
        this.metrics = [];
    }
}

// Singleton-Instanz
export const performanceTracker = new PerformanceTracker();

export default performanceTracker;





