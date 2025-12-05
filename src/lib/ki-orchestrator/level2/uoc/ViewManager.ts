/**
 * View Manager - Enterprise++ Standard P9
 * 
 * Verwaltet verschiedene Views (Correlation, Root-Cause-Analysis, Timeline)
 */

import type {
  CorrelationView,
  RootCauseAnalysisView,
  TimelineView,
  AggregatedData,
  UOCFilters,
  CorrelationFilters,
  TimelineFilters,
  SortOptions,
  PaginationOptions,
} from "./types";
import { dataAggregator } from "./DataAggregator";
import { correlationEngine } from "./CorrelationEngine";
import { rootCauseAnalyzer } from "./RootCauseAnalyzer";
import { logger } from "@/lib/logger";

export class ViewManager {
  /**
   * Erstelle Correlation View
   */
  async createCorrelationView(
    filters: CorrelationFilters
  ): Promise<CorrelationView> {
    try {
      // Hole Daten
      const timeRange = filters.timeRange || {
        start: new Date(Date.now() - 3600000), // Letzte Stunde
        end: new Date(),
      };

      const aggregatedData = await dataAggregator.aggregateAllSources(
        timeRange,
        filters
      );

      // Normalisiere Daten
      const normalizedData = dataAggregator.normalizeData(
        aggregatedData.alerts,
        aggregatedData.metrics,
        aggregatedData.logs
      );

      // Korreliere Events
      const logIds = normalizedData.events
        .filter((e) => e.type === "log")
        .map((e) => e.id);
      const metricIds = normalizedData.events
        .filter((e) => e.type === "metric")
        .map((e) => e.id);
      const alertIds = normalizedData.events
        .filter((e) => e.type === "alert")
        .map((e) => e.id);

      const multiSourceCorrelation = await correlationEngine.correlateMultiSource(
        logIds,
        metricIds,
        alertIds,
        normalizedData.events
      );

      // Filtere nach Correlation-ID oder Resource-ID (falls angegeben)
      let correlations = multiSourceCorrelation.correlations;
      if (filters.correlationId) {
        correlations = correlations.filter(
          (c) =>
            c.source1.correlationId === filters.correlationId ||
            c.source2.correlationId === filters.correlationId
        );
      }
      if (filters.resourceId) {
        correlations = correlations.filter(
          (c) =>
            (c.source1.resourceId === filters.resourceId &&
              c.source1.resourceType === filters.resourceType) ||
            (c.source2.resourceId === filters.resourceId &&
              c.source2.resourceType === filters.resourceType)
        );
      }

      // Sortiere nach Score (höchster zuerst)
      correlations.sort((a, b) => b.score - a.score);

      return {
        correlations,
        events: normalizedData.events,
        summary: {
          totalCorrelations: correlations.length,
          highScoreCorrelations: correlations.filter((c) => c.score >= 0.7).length,
          avgScore:
            correlations.length > 0
              ? correlations.reduce((sum, c) => sum + c.score, 0) / correlations.length
              : 0,
        },
      };
    } catch (error) {
      logger.error("ViewManager.createCorrelationView failed", { error, filters });
      throw error;
    }
  }

  /**
   * Erstelle Root-Cause-Analysis View
   */
  async createRootCauseAnalysisView(
    incidentId: string
  ): Promise<RootCauseAnalysisView> {
    try {
      return await rootCauseAnalyzer.identifyRootCause(incidentId);
    } catch (error) {
      logger.error("ViewManager.createRootCauseAnalysisView failed", {
        error,
        incidentId,
      });
      throw error;
    }
  }

  /**
   * Erstelle Timeline View
   */
  async createTimelineView(filters: TimelineFilters): Promise<TimelineView> {
    try {
      // Hole Daten
      const timeRange = filters.timeRange || {
        start: new Date(Date.now() - 3600000), // Letzte Stunde
        end: new Date(),
      };

      const aggregatedData = await dataAggregator.aggregateAllSources(
        timeRange,
        filters
      );

      // Normalisiere Daten
      const normalizedData = dataAggregator.normalizeData(
        aggregatedData.alerts,
        aggregatedData.metrics,
        aggregatedData.logs
      );

      // Filtere nach Event-Typen (falls angegeben)
      let timelineEvents = normalizedData.timeline;
      if (filters.eventTypes && filters.eventTypes.length > 0) {
        timelineEvents = timelineEvents.filter((e) =>
          filters.eventTypes!.includes(e.type)
        );
      }

      // Filtere nach minScore (falls angegeben)
      if (filters.minScore !== undefined) {
        // Berechne Korrelations-Scores für alle Event-Paare
        const correlations = await correlationEngine.correlateMultiSource(
          timelineEvents.filter((e) => e.type === "log").map((e) => e.id),
          timelineEvents.filter((e) => e.type === "metric").map((e) => e.id),
          timelineEvents.filter((e) => e.type === "alert").map((e) => e.id),
          normalizedData.events
        );

        // Filtere Events mit hohem Korrelations-Score
        const highScoreEventIds = new Set(
          correlations.correlations
            .filter((c) => c.score >= filters.minScore!)
            .flatMap((c) => [c.source1.id, c.source2.id])
        );

        timelineEvents = timelineEvents.filter((e) => highScoreEventIds.has(e.id));
      }

      // Berechne Time-Span
      const timeSpan =
        timelineEvents.length > 0
          ? (timelineEvents[timelineEvents.length - 1].timestamp.getTime() -
              timelineEvents[0].timestamp.getTime()) /
            1000
          : 0;

      // Korreliere Events
      const logIds = timelineEvents.filter((e) => e.type === "log").map((e) => e.id);
      const metricIds = timelineEvents
        .filter((e) => e.type === "metric")
        .map((e) => e.id);
      const alertIds = timelineEvents.filter((e) => e.type === "alert").map((e) => e.id);

      const multiSourceCorrelation = await correlationEngine.correlateMultiSource(
        logIds,
        metricIds,
        alertIds,
        normalizedData.events.filter((e) =>
          timelineEvents.some((te) => te.id === e.id)
        )
      );

      return {
        events: timelineEvents,
        correlations: multiSourceCorrelation.correlations,
        summary: {
          totalEvents: timelineEvents.length,
          timeSpan,
        },
      };
    } catch (error) {
      logger.error("ViewManager.createTimelineView failed", { error, filters });
      throw error;
    }
  }

  /**
   * Wende Filter an
   */
  applyFilters(data: AggregatedData, filters: UOCFilters): AggregatedData {
    try {
      let filteredData = { ...data };

      // Filtere nach Kategorien
      if (filters.categories && filters.categories.length > 0) {
        filteredData.alerts = filteredData.alerts.filter((a) =>
          filters.categories!.includes(a.category)
        );
        filteredData.logs = filteredData.logs.filter((l) =>
          filters.categories!.includes(l.category)
        );
        filteredData.metrics = filteredData.metrics.filter((m) =>
          filters.categories!.includes(m.category)
        );
      }

      // Filtere nach Severities
      if (filters.severities && filters.severities.length > 0) {
        filteredData.alerts = filteredData.alerts.filter((a) =>
          filters.severities!.includes(a.severity)
        );
        filteredData.logs = filteredData.logs.filter((l) =>
          filters.severities!.includes(l.severity)
        );
        filteredData.metrics = filteredData.metrics.filter((m) =>
          filters.severities!.includes(m.severity)
        );
      }

      // Filtere nach Sources
      if (filters.sources && filters.sources.length > 0) {
        filteredData.metrics = filteredData.metrics.filter((m) =>
          filters.sources!.includes(m.source)
        );
      }

      // Filtere nach Search-String
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData.alerts = filteredData.alerts.filter(
          (a) =>
            a.title.toLowerCase().includes(searchLower) ||
            a.description?.toLowerCase().includes(searchLower)
        );
        filteredData.logs = filteredData.logs.filter((l) =>
          l.message.toLowerCase().includes(searchLower)
        );
      }

      return filteredData;
    } catch (error) {
      logger.error("ViewManager.applyFilters failed", { error, filters });
      return data; // Bei Fehler: Original-Daten zurückgeben
    }
  }

  /**
   * Wende Sortierung an
   */
  applySorting(data: AggregatedData, sort: SortOptions): AggregatedData {
    try {
      const sortedData = { ...data };

      // Sortiere Alerts
      sortedData.alerts.sort((a, b) => {
        const aValue = (a as any)[sort.field];
        const bValue = (b as any)[sort.field];
        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return sort.direction === "asc" ? comparison : -comparison;
      });

      // Sortiere Logs
      sortedData.logs.sort((a, b) => {
        const aValue = (a as any)[sort.field];
        const bValue = (b as any)[sort.field];
        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return sort.direction === "asc" ? comparison : -comparison;
      });

      // Sortiere Metrics
      sortedData.metrics.sort((a, b) => {
        const aValue = (a as any)[sort.field];
        const bValue = (b as any)[sort.field];
        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return sort.direction === "asc" ? comparison : -comparison;
      });

      return sortedData;
    } catch (error) {
      logger.error("ViewManager.applySorting failed", { error, sort });
      return data; // Bei Fehler: Original-Daten zurückgeben
    }
  }

  /**
   * Wende Pagination an
   */
  applyPagination(
    data: AggregatedData,
    pagination: PaginationOptions
  ): AggregatedData {
    try {
      return {
        ...data,
        alerts: data.alerts.slice(
          pagination.offset,
          pagination.offset + pagination.limit
        ),
        logs: data.logs.slice(
          pagination.offset,
          pagination.offset + pagination.limit
        ),
        metrics: data.metrics.slice(
          pagination.offset,
          pagination.offset + pagination.limit
        ),
      };
    } catch (error) {
      logger.error("ViewManager.applyPagination failed", { error, pagination });
      return data; // Bei Fehler: Original-Daten zurückgeben
    }
  }
}

export const viewManager = new ViewManager();




