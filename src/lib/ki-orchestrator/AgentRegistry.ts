/**
 * Agent Registry - Enterprise++ Standard
 * 
 * Verwaltet alle registrierten KI-Agenten
 * Zentrale Registry für Agent-Definitionen
 */

import type { AgentDefinition, AgentType } from "./types";
import { logger } from "@/lib/logger";

class AgentRegistry {
    private agents: Map<string, AgentDefinition> = new Map();

    /**
     * Agent zur Registry hinzufügen
     */
    addAgent(agentDef: AgentDefinition): void {
        if (this.agents.has(agentDef.name)) {
            logger.warn(`Agent ${agentDef.name} bereits registriert. Überschreibe Definition.`);
        }

        this.agents.set(agentDef.name, {
            ...agentDef,
            enabled: agentDef.enabled !== false // Default: enabled
        });

        logger.info(`Agent registriert: ${agentDef.name} (Typ: ${agentDef.type})`);
    }

    /**
     * Agent aus Registry entfernen
     */
    removeAgent(agentName: string): boolean {
        if (!this.agents.has(agentName)) {
            logger.warn(`Agent ${agentName} nicht in Registry gefunden.`);
            return false;
        }

        this.agents.delete(agentName);
        logger.info(`Agent entfernt: ${agentName}`);
        return true;
    }

    /**
     * Agent aus Registry abrufen
     */
    getAgent(agentName: string): AgentDefinition | null {
        return this.agents.get(agentName) || null;
    }

    /**
     * Liste aller registrierten Agenten
     */
    listAgents(): AgentDefinition[] {
        return Array.from(this.agents.values());
    }

    /**
     * Liste aller Agenten nach Typ
     */
    listAgentsByType(type: AgentType): AgentDefinition[] {
        return this.listAgents().filter(agent => agent.type === type);
    }

    /**
     * Prüft, ob Agent existiert
     */
    hasAgent(agentName: string): boolean {
        return this.agents.has(agentName);
    }

    /**
     * Prüft, ob Agent aktiviert ist
     */
    isAgentEnabled(agentName: string): boolean {
        const agent = this.getAgent(agentName);
        return agent !== null && (agent.enabled !== false);
    }

    /**
     * Agent aktivieren/deaktivieren
     */
    setAgentEnabled(agentName: string, enabled: boolean): boolean {
        const agent = this.getAgent(agentName);
        if (!agent) {
            return false;
        }

        agent.enabled = enabled;
        this.agents.set(agentName, agent);
        logger.info(`Agent ${agentName} ${enabled ? "aktiviert" : "deaktiviert"}`);
        return true;
    }

    /**
     * Anzahl registrierter Agenten
     */
    getAgentCount(): number {
        return this.agents.size;
    }
}

export const agentRegistry = new AgentRegistry();



