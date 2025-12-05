/**
 * Root Cause Analyzer - Enterprise++ Standard P9
 * 
 * Identifiziert Root-Causes von Incidents
 */

import type {
  RootCauseAnalysisView,
  Timeline,
  ImpactAnalysis,
  Solution,
  CausalRelationship,
  Event,
  TimelineEvent,
} from "./types";
import { incidentClient } from "./clients/IncidentClient";
import { dataAggregator } from "./DataAggregator";
import { correlationEngine } from "./CorrelationEngine";
import { logger } from "@/lib/logger";

export class RootCauseAnalyzer {
  /**
   * Identifiziere Root-Cause eines Incidents
   */
  async identifyRootCause(incidentId: string): Promise<RootCauseAnalysisView> {
    try {
      // Hole Incident
      const incident = await incidentClient.getIncident(incidentId);

      // Hole Timeline (alle Events im Zeitraum)
      const timeRange = {
        start: new Date(new Date(incident.opened_at).getTime() - 3600000), // 1 Stunde vor Incident
        end: new Date(incident.opened_at),
      };

      const aggregatedData = await dataAggregator.aggregateAllSources(timeRange);
      const normalizedData = dataAggregator.normalizeData(
        aggregatedData.alerts,
        aggregatedData.metrics,
        aggregatedData.logs
      );

      // Erstelle Timeline
      const timeline = await this.createTimeline(normalizedData.events);

      // Identifiziere Root-Cause (frühestes kritisches Event)
      const rootCause = this.findRootCause(timeline.events);

      // Analysiere Impact
      const impact = await this.analyzeImpact(rootCause, timeline.events);

      // Identifiziere kausale Zusammenhänge
      const causalRelationships = this.identifyCausalRelationships(timeline.events);

      // Generiere Lösung-Vorschläge
      const solutions = await this.suggestSolutions(rootCause, impact);

      return {
        incident,
        rootCause,
        timeline,
        impact,
        solutions,
        causalRelationships,
      };
    } catch (error) {
      logger.error("RootCauseAnalyzer.identifyRootCause failed", { error, incidentId });
      throw error;
    }
  }

  /**
   * Analysiere Impact
   */
  async analyzeImpact(
    rootCause: Event,
    events: Event[]
  ): Promise<ImpactAnalysis> {
    try {
      // Betroffene Resources identifizieren
      const affectedResources = new Set<string>();
      const affectedServices = new Set<string>();

      for (const event of events) {
        if (event.resourceId) {
          affectedResources.add(event.resourceId);
        }
        if (event.resourceType) {
          affectedServices.add(event.resourceType);
        }
      }

      // User-Impact schätzen (basierend auf Severity und Anzahl Events)
      const criticalEvents = events.filter((e) => e.severity === "critical").length;
      const warningEvents = events.filter((e) => e.severity === "warning").length;
      const userImpact = Math.min(
        100,
        criticalEvents * 20 + warningEvents * 10
      );

      // Business-Impact schätzen (basierend auf betroffenen Services)
      const businessImpact = Math.min(100, affectedServices.size * 15);

      // Geschätzte Downtime (basierend auf Zeitraum)
      const timeSpan =
        events.length > 0
          ? (events[events.length - 1].timestamp.getTime() -
              events[0].timestamp.getTime()) /
            1000 /
            60
          : 0;

      return {
        affectedResources: Array.from(affectedResources),
        affectedServices: Array.from(affectedServices),
        userImpact,
        businessImpact,
        estimatedDowntime: Math.round(timeSpan),
      };
    } catch (error) {
      logger.error("RootCauseAnalyzer.analyzeImpact failed", { error, rootCause });
      throw error;
    }
  }

  /**
   * Erstelle Timeline
   */
  async createTimeline(events: Event[]): Promise<Timeline> {
    try {
      // Sortiere Events nach Timestamp
      const sortedEvents = [...events].sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
      );

      // Konvertiere zu TimelineEvents
      const timelineEvents: TimelineEvent[] = sortedEvents.map((event) => ({
        id: event.id,
        type: event.type,
        timestamp: event.timestamp,
        category: event.category,
        severity: event.severity,
        message: this.getEventMessage(event),
        data: event.data,
      }));

      // Identifiziere Root-Cause
      const rootCause = this.findRootCause(sortedEvents);

      // Analysiere Impact
      const impact = await this.analyzeImpact(rootCause, sortedEvents);

      return {
        events: timelineEvents,
        rootCause,
        impact,
      };
    } catch (error) {
      logger.error("RootCauseAnalyzer.createTimeline failed", { error });
      throw error;
    }
  }

  /**
   * Generiere Lösung-Vorschläge
   */
  async suggestSolutions(
    rootCause: Event,
    impact: ImpactAnalysis
  ): Promise<Solution[]> {
    try {
      const solutions: Solution[] = [];

      // Basierend auf Root-Cause-Typ
      if (rootCause.type === "log") {
        solutions.push({
          id: "solution-1",
          title: "Log-Analyse durchführen",
          description: "Detaillierte Analyse der Logs zur Identifikation des Problems",
          priority: "high",
          estimatedTime: 30,
          steps: [
            "Logs filtern nach Kategorie und Severity",
            "Korrelierte Events identifizieren",
            "Pattern-Analyse durchführen",
          ],
        });
      }

      if (rootCause.type === "metric") {
        solutions.push({
          id: "solution-2",
          title: "Metrik-Schwellwerte prüfen",
          description: "Prüfe, ob Metrik-Schwellwerte korrekt konfiguriert sind",
          priority: "high",
          estimatedTime: 15,
          steps: [
            "Metrik-Schwellwerte in Alert-Regeln prüfen",
            "Baseline-Werte analysieren",
            "Schwellwerte anpassen (falls nötig)",
          ],
        });
      }

      if (rootCause.type === "alert") {
        solutions.push({
          id: "solution-3",
          title: "Alert-Regel überprüfen",
          description: "Prüfe, ob Alert-Regel korrekt konfiguriert ist",
          priority: "medium",
          estimatedTime: 20,
          steps: [
            "Alert-Regel-Definition prüfen",
            "Trigger-Bedingungen validieren",
            "Alert-Regel anpassen (falls nötig)",
          ],
        });
      }

      // Basierend auf Impact
      if (impact.userImpact > 50) {
        solutions.push({
          id: "solution-4",
          title: "Sofortmaßnahmen ergreifen",
          description: "Aufgrund des hohen User-Impacts sind Sofortmaßnahmen erforderlich",
          priority: "high",
          estimatedTime: 10,
          steps: [
            "Betroffene Services identifizieren",
            "Service-Neustart durchführen (falls nötig)",
            "Monitoring verstärken",
          ],
        });
      }

      return solutions;
    } catch (error) {
      logger.error("RootCauseAnalyzer.suggestSolutions failed", { error, rootCause });
      return [];
    }
  }

  /**
   * Identifiziere kausale Zusammenhänge
   */
  identifyCausalRelationships(events: Event[]): CausalRelationship[] {
    try {
      const relationships: CausalRelationship[] = [];

      // Sortiere Events nach Timestamp
      const sortedEvents = [...events].sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
      );

      // Prüfe alle Event-Paare
      for (let i = 0; i < sortedEvents.length; i++) {
        for (let j = i + 1; j < sortedEvents.length; j++) {
          const from = sortedEvents[i];
          const to = sortedEvents[j];

          // Berechne Korrelations-Score
          const score = correlationEngine.calculateCorrelationScore(from, to);

          // Wenn Score hoch genug, erstelle kausale Beziehung
          if (score >= 0.6) {
            const timeDiff = to.timestamp.getTime() - from.timestamp.getTime();
            const type =
              timeDiff < 1000 && score >= 0.8
                ? "direct"
                : score >= 0.7
                ? "indirect"
                : "correlated";

            relationships.push({
              from,
              to,
              confidence: score,
              type,
            });
          }
        }
      }

      return relationships;
    } catch (error) {
      logger.error("RootCauseAnalyzer.identifyCausalRelationships failed", { error });
      return [];
    }
  }

  /**
   * Finde Root-Cause (frühestes kritisches Event)
   */
  private findRootCause(events: Event[]): Event {
    // Sortiere nach Timestamp
    const sortedEvents = [...events].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );

    // Finde frühestes kritisches Event
    const criticalEvent = sortedEvents.find((e) => e.severity === "critical");
    if (criticalEvent) {
      return criticalEvent;
    }

    // Falls kein kritisches Event, nimm frühestes Warning-Event
    const warningEvent = sortedEvents.find((e) => e.severity === "warning");
    if (warningEvent) {
      return warningEvent;
    }

    // Falls kein Warning-Event, nimm frühestes Event
    return sortedEvents[0] || events[0];
  }

  /**
   * Hole Event-Message
   */
  private getEventMessage(event: Event): string {
    if (event.type === "alert") {
      return (event.data as any).title || "Alert";
    }
    if (event.type === "log") {
      return (event.data as any).message || "Log";
    }
    if (event.type === "metric") {
      const metric = event.data as any;
      return `${metric.metric_name}: ${metric.value} ${metric.unit}`;
    }
    return "Event";
  }
}

export const rootCauseAnalyzer = new RootCauseAnalyzer();




