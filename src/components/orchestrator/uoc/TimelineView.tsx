/**
 * Timeline View Component - Enterprise++ Standard P9
 * 
 * Timeline-View für UOC
 */

"use client";

import { useEffect, useState } from "react";
import { TimelineChart } from "./TimelineChart";
import { UOCFilterBar } from "./UOCFilterBar";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import type { TimelineFilters, TimelineEvent } from "@/lib/ki-orchestrator/level2/uoc/types";

interface TimelineViewProps {
  events?: TimelineEvent[];
  filters?: TimelineFilters;
  onFilterChange?: (filters: TimelineFilters) => void;
  onEventClick?: (event: unknown) => void;
  zoom?: "hour" | "day" | "week" | "month";
}

export function TimelineView({
  events: initialEvents,
  filters,
  onFilterChange,
  onEventClick,
  zoom = "day",
}: TimelineViewProps) {
  const [events, setEvents] = useState<TimelineEvent[]>(initialEvents || []);
  const [loading, setLoading] = useState(!initialEvents);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialEvents) return;

    const fetchTimeline = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filters?.timeRange) {
          params.append("startTime", filters.timeRange.start.toISOString());
          params.append("endTime", filters.timeRange.end.toISOString());
        }
        if (zoom) {
          params.append("zoom", zoom);
        }

        const response = await fetch(`/api/orchestrator/uoc/timeline?${params.toString()}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch timeline");
        }

        const result = await response.json();
        setEvents(result.data?.events || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [filters, zoom, initialEvents]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Timeline</h1>
      </div>

      {filters && onFilterChange && (
        <UOCFilterBar
          filters={filters}
          onFilterChange={onFilterChange as any}
          availableCategories={["Security", "API", "Queue", "System"]}
          availableSeverities={["info", "warning", "critical"]}
          availableSources={["alerts", "incidents", "logs", "metrics"]}
        />
      )}

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Laden...</p>
        </div>
      ) : (
        <TimelineChart events={events} onEventClick={onEventClick} zoom={zoom} />
      )}
    </div>
  );
}




