/**
 * Priority Engine - Orchestrator Level 2
 * Enterprise++ Standard
 * 
 * Intelligente Task-Priorisierung
 */

import type { OrchestratorTask } from "../types";
import type { PriorityLevel, PriorityCalculation } from "./types";
import { logger } from "@/lib/logger";

class PriorityEngine {
    /**
     * Berechnet Priorität für einen Task
     * Formel: Priority = BasePriority + ContextBonus + RiskPenalty + TimeBonus
     */
    async calculatePriority(task: OrchestratorTask): Promise<number> {
        // Base Priority
        const basePriority = this.getBasePriority(task.priority || 'medium');

        // Context Bonus
        const contextBonus = this.calculateContextBonus(task);

        // Risk Penalty (wird später aus DSFA-Daten berechnet)
        const riskPenalty = 0; // TODO: Integration mit DSFA

        // Time Bonus (wenn Deadline vorhanden)
        const timeBonus = this.calculateTimeBonus(task);

        const finalPriority = Math.max(0, Math.min(100, 
            basePriority + contextBonus - riskPenalty + timeBonus
        ));

        logger.debug(`Priorität berechnet für Task ${task.id}: ${finalPriority} (Base: ${basePriority}, Context: ${contextBonus}, Risk: -${riskPenalty}, Time: ${timeBonus})`);

        return finalPriority;
    }

    /**
     * Bestimmt Queue-Reihenfolge
     */
    async getQueueOrder(tasks: OrchestratorTask[]): Promise<OrchestratorTask[]> {
        // Prioritäten berechnen
        const tasksWithPriority = await Promise.all(
            tasks.map(async (task) => ({
                task,
                priority: await this.calculatePriority(task)
            }))
        );

        // Nach Priorität sortieren (höchste zuerst)
        tasksWithPriority.sort((a, b) => b.priority - a.priority);

        return tasksWithPriority.map(item => item.task);
    }

    /**
     * Bestimmt Prioritäts-Level
     */
    async getPriorityLevel(priority: number): Promise<PriorityLevel> {
        if (priority >= 90) return 'critical';
        if (priority >= 70) return 'high';
        if (priority >= 40) return 'medium';
        if (priority >= 10) return 'low';
        return 'background';
    }

    /**
     * Gibt Base Priority zurück
     */
    private getBasePriority(priority: string): number {
        switch (priority) {
            case 'critical': return 100;
            case 'high': return 75;
            case 'medium': return 50;
            case 'low': return 25;
            default: return 50;
        }
    }

    /**
     * Berechnet Context Bonus
     */
    private calculateContextBonus(task: OrchestratorTask): number {
        let bonus = 0;

        // User-Request = +10
        if (task.userId && task.userId !== 'system') {
            bonus += 10;
        }

        // Incident Response = +20
        if (task.purpose?.includes('incident') || task.purpose?.includes('emergency')) {
            bonus += 20;
        }

        // Approval Required = +15
        if (task.context?.approval_required === true) {
            bonus += 15;
        }

        return Math.min(20, bonus); // Max +20
    }

    /**
     * Berechnet Time Bonus
     */
    private calculateTimeBonus(task: OrchestratorTask): number {
        // TODO: Deadline-Integration
        return 0;
    }
}

export const priorityEngine = new PriorityEngine();






