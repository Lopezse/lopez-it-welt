/**
 * Kosten-Tracker für KI-Analysen - Enterprise++ Standard
 * 
 * Tracking und Kontrolle von KI-API-Kosten
 * 
 * @created 2025-01-27
 * @purpose Phase 3.1: Kostenkontrolle
 */

import { executeQueryPool } from "@/lib/db";
import type { CostEstimate } from "./providers/types";

/**
 * Kosten-Limit-Konfiguration
 */
export interface CostLimit {
    dailyLimitUsd: number; // Tägliches Limit in USD
    monthlyLimitUsd: number; // Monatliches Limit in USD
    warningThreshold: number; // Warnung bei X% des Limits (0-1, z.B. 0.8 = 80%)
}

/**
 * Standard-Limits (können über Environment-Variablen überschrieben werden)
 */
const DEFAULT_LIMITS: CostLimit = {
    dailyLimitUsd: parseFloat(process.env.MEDIA_AI_DAILY_LIMIT_USD || "10.00"),
    monthlyLimitUsd: parseFloat(process.env.MEDIA_AI_MONTHLY_LIMIT_USD || "200.00"),
    warningThreshold: parseFloat(process.env.MEDIA_AI_WARNING_THRESHOLD || "0.8"),
};

/**
 * Kosten-Status
 */
export interface CostStatus {
    allowed: boolean; // Ist die Operation erlaubt?
    reason?: string; // Grund falls nicht erlaubt
    dailyCost: number; // Tägliche Kosten heute
    monthlyCost: number; // Monatliche Kosten diesen Monat
    dailyLimit: number; // Tägliches Limit
    monthlyLimit: number; // Monatliches Limit
    dailyPercentage: number; // Prozentsatz des täglichen Limits (0-1)
    monthlyPercentage: number; // Prozentsatz des monatlichen Limits (0-1)
    warning: boolean; // Warnung aktiv?
}

/**
 * Kosten-Tracker-Service
 */
export class CostTracker {
    private limits: CostLimit;

    constructor(limits: CostLimit = DEFAULT_LIMITS) {
        this.limits = limits;
    }

    /**
     * Zeichnet eine Kosten-Operation auf
     * 
     * @param cost Kosten-Informationen
     */
    async recordCost(cost: CostEstimate & { mediaId?: string }): Promise<void> {
        try {
            const id = this.generateId();
            const sql = `
                INSERT INTO lopez_media_ai_costs 
                (id, provider, operation_type, cost_usd, media_id, tokens_used, images_processed, model_version, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `;

            await executeQueryPool(sql, [
                id,
                cost.provider,
                cost.operation,
                cost.costUsd,
                cost.mediaId || null,
                cost.tokensUsed || null,
                cost.imagesProcessed || 1,
                null, // model_version kann später ergänzt werden
            ]);
        } catch (error) {
            console.error("❌ Fehler beim Speichern der Kosten:", error);
            // Nicht werfen - Kosten-Tracking sollte nicht die Hauptfunktion blockieren
        }
    }

    /**
     * Prüft, ob eine Operation erlaubt ist (basierend auf Limits)
     * 
     * @param estimatedCost Geschätzte Kosten der Operation
     * @returns Status mit Erlaubnis und aktuellen Kosten
     */
    async checkLimit(estimatedCost: number): Promise<CostStatus> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        // Tägliche Kosten abrufen
        const dailyCost = await this.getDailyCost(today);
        const monthlyCost = await this.getMonthlyCost(monthStart);

        // Prüfe Limits
        const wouldExceedDaily = dailyCost + estimatedCost > this.limits.dailyLimitUsd;
        const wouldExceedMonthly = monthlyCost + estimatedCost > this.limits.monthlyLimitUsd;

        const allowed = !wouldExceedDaily && !wouldExceedMonthly;
        const reason = wouldExceedDaily
            ? `Tägliches Limit überschritten (${this.limits.dailyLimitUsd.toFixed(2)} USD)`
            : wouldExceedMonthly
            ? `Monatliches Limit überschritten (${this.limits.monthlyLimitUsd.toFixed(2)} USD)`
            : undefined;

        const dailyPercentage = this.limits.dailyLimitUsd > 0
            ? (dailyCost + estimatedCost) / this.limits.dailyLimitUsd
            : 0;
        const monthlyPercentage = this.limits.monthlyLimitUsd > 0
            ? (monthlyCost + estimatedCost) / this.limits.monthlyLimitUsd
            : 0;

        const warning = dailyPercentage >= this.limits.warningThreshold ||
            monthlyPercentage >= this.limits.warningThreshold;

        return {
            allowed,
            reason,
            dailyCost,
            monthlyCost,
            dailyLimit: this.limits.dailyLimitUsd,
            monthlyLimit: this.limits.monthlyLimitUsd,
            dailyPercentage,
            monthlyPercentage,
            warning,
        };
    }

    /**
     * Gibt die täglichen Kosten für ein bestimmtes Datum zurück
     * 
     * @param date Datum (nur Datum, Zeit wird ignoriert)
     * @returns Kosten in USD
     */
    async getDailyCost(date: Date): Promise<number> {
        try {
            const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
            const sql = `
                SELECT COALESCE(SUM(cost_usd), 0) as total_cost
                FROM lopez_media_ai_costs
                WHERE DATE(created_at) = ?
            `;

            const result = await executeQueryPool<Array<{ total_cost: number }>>(sql, [dateStr]);
            return result[0]?.total_cost || 0;
        } catch (error) {
            console.error("❌ Fehler beim Abrufen der täglichen Kosten:", error);
            return 0;
        }
    }

    /**
     * Gibt die monatlichen Kosten für einen bestimmten Monat zurück
     * 
     * @param monthStart Start-Datum des Monats
     * @returns Kosten in USD
     */
    async getMonthlyCost(monthStart: Date): Promise<number> {
        try {
            const monthEnd = new Date(monthStart);
            monthEnd.setMonth(monthEnd.getMonth() + 1);
            monthEnd.setDate(0); // Letzter Tag des Monats

            const sql = `
                SELECT COALESCE(SUM(cost_usd), 0) as total_cost
                FROM lopez_media_ai_costs
                WHERE DATE(created_at) >= ? AND DATE(created_at) <= ?
            `;

            const startStr = monthStart.toISOString().split("T")[0];
            const endStr = monthEnd.toISOString().split("T")[0];

            const result = await executeQueryPool<Array<{ total_cost: number }>>(sql, [startStr, endStr]);
            return result[0]?.total_cost || 0;
        } catch (error) {
            console.error("❌ Fehler beim Abrufen der monatlichen Kosten:", error);
            return 0;
        }
    }

    /**
     * Gibt die Kosten-Statistik zurück
     * 
     * @returns Kosten-Statistik
     */
    async getCostStats(): Promise<{
        today: number;
        thisMonth: number;
        total: number;
        dailyLimit: number;
        monthlyLimit: number;
    }> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        const [todayCost, monthCost, totalCost] = await Promise.all([
            this.getDailyCost(today),
            this.getMonthlyCost(monthStart),
            this.getTotalCost(),
        ]);

        return {
            today: todayCost,
            thisMonth: monthCost,
            total: totalCost,
            dailyLimit: this.limits.dailyLimitUsd,
            monthlyLimit: this.limits.monthlyLimitUsd,
        };
    }

    /**
     * Gibt die Gesamtkosten zurück (alle Zeiten)
     * 
     * @returns Gesamtkosten in USD
     */
    async getTotalCost(): Promise<number> {
        try {
            const sql = `
                SELECT COALESCE(SUM(cost_usd), 0) as total_cost
                FROM lopez_media_ai_costs
            `;

            const result = await executeQueryPool<Array<{ total_cost: number }>>(sql, []);
            return result[0]?.total_cost || 0;
        } catch (error) {
            console.error("❌ Fehler beim Abrufen der Gesamtkosten:", error);
            return 0;
        }
    }

    /**
     * Generiert eine eindeutige ID
     */
    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}

/**
 * Singleton-Instanz
 */
export const costTracker = new CostTracker();





