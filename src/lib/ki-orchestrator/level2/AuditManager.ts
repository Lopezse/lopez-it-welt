/**
 * Audit Manager - Orchestrator Level 2
 * Enterprise++ Standard
 * 
 * Erweiterte Audit-Funktionen für Level 2
 */

import { createHash } from "crypto";
import { getConnection } from "@/lib/database";
import { logger } from "@/lib/logger";
import type { OrchestratorEvent, AuditLog, AuditFilters } from "./types";

class AuditManager {
    /**
     * Loggt ein Orchestrator-Event
     */
    async logEvent(event: OrchestratorEvent): Promise<void> {
        try {
            const connection = await getConnection();
            const eventId = event.id || this.generateId();
            const timestamp = event.timestamp || new Date().toISOString();
            
            // Hash generieren
            const auditHash = this.generateHash({
                event_type: event.event_type,
                resource_type: event.resource_type,
                resource_id: event.resource_id,
                details: event.details,
                timestamp
            });

            await connection.execute(
                `INSERT INTO orchestrator_events 
                 (id, event_type, resource_type, resource_id, details, audit_hash, timestamp)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    eventId,
                    event.event_type,
                    event.resource_type || null,
                    event.resource_id || null,
                    JSON.stringify(event.details || {}),
                    auditHash,
                    timestamp
                ]
            );

            logger.info(`Orchestrator Event geloggt: ${event.event_type} (ID: ${eventId})`);
        } catch (error) {
            logger.error("Fehler beim Schreiben des Orchestrator-Event-Logs", error);
            // Nicht werfen, da Audit-Log-Fehler nicht kritisch sind
        }
    }

    /**
     * Generiert SHA-256 Hash für Audit-Zwecke
     */
    generateHash(data: Record<string, unknown>): string {
        const dataString = JSON.stringify(data, Object.keys(data).sort());
        return createHash("sha256").update(dataString).digest("hex");
    }

    /**
     * Ruft Audit-Log ab
     */
    async getAuditLog(filters: AuditFilters = {}): Promise<AuditLog[]> {
        try {
            const connection = await getConnection();
            
            let query = `SELECT id, event_type, resource_type, resource_id, details, audit_hash, timestamp
                         FROM orchestrator_events
                         WHERE 1=1`;
            const params: unknown[] = [];

            if (filters.event_type) {
                query += ` AND event_type = ?`;
                params.push(filters.event_type);
            }

            if (filters.resource_type) {
                query += ` AND resource_type = ?`;
                params.push(filters.resource_type);
            }

            if (filters.resource_id) {
                query += ` AND resource_id = ?`;
                params.push(filters.resource_id);
            }

            if (filters.start_date) {
                query += ` AND timestamp >= ?`;
                params.push(filters.start_date);
            }

            if (filters.end_date) {
                query += ` AND timestamp <= ?`;
                params.push(filters.end_date);
            }

            query += ` ORDER BY timestamp DESC`;

            if (filters.limit) {
                query += ` LIMIT ?`;
                params.push(filters.limit);
                
                if (filters.offset) {
                    query += ` OFFSET ?`;
                    params.push(filters.offset);
                }
            } else {
                query += ` LIMIT 100`; // Default limit
            }

            const [rows] = await connection.execute(query, params);
            const events = Array.isArray(rows) ? rows : [];

            return events.map((row: any) => ({
                id: row.id,
                event_type: row.event_type,
                resource_type: row.resource_type,
                resource_id: row.resource_id,
                details: typeof row.details === 'string' ? JSON.parse(row.details) : row.details,
                audit_hash: row.audit_hash,
                timestamp: row.timestamp
            }));
        } catch (error) {
            logger.error("Fehler beim Abrufen des Audit-Logs", error);
            throw error;
        }
    }

    /**
     * Generiert eindeutige ID
     */
    private generateId(): string {
        return `event-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
}

export const auditManager = new AuditManager();






