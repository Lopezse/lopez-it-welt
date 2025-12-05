/**
 * Timeline Chart Component - Enterprise++ Standard P9
 * 
 * Timeline-Grafik für Root-Cause-Analysis
 */

"use client";

import type { Event, TimelineEvent } from "@/lib/ki-orchestrator/level2/uoc/types";

interface TimelineChartProps {
  events: TimelineEvent[];
  rootCause?: Event;
  onEventClick?: (event: Event) => void;
  zoom?: "hour" | "day" | "week" | "month";
}

export function TimelineChart({
  events,
  rootCause,
  onEventClick,
  zoom = "day",
}: TimelineChartProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Keine Events verfügbar</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <div className="relative">
        {/* Timeline-Linie */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700" />

        {/* Events */}
        <div className="space-y-4">
          {events.map((event, index) => {
            const isRootCause = rootCause && event.id === rootCause.id;
            const eventColor =
              event.type === "alert"
                ? "bg-red-500"
                : event.type === "log"
                ? "bg-blue-500"
                : event.type === "metric"
                ? "bg-green-500"
                : "bg-gray-500";

            return (
              <div key={event.id} className="flex items-start gap-4 relative">
                {/* Event-Marker */}
                <div
                  className={`relative z-10 w-4 h-4 rounded-full ${eventColor} ${isRootCause ? "ring-4 ring-red-300 dark:ring-red-700" : ""}`}
                />
                {/* Event-Content */}
                <div
                  className={`flex-1 rounded-lg border p-4 ${isRootCause ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"} cursor-pointer hover:shadow-md transition-shadow`}
                  onClick={() => onEventClick?.(event as any)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {event.timestamp.toLocaleString("de-DE")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.message}</p>
                  {isRootCause && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded">
                      ROOT-CAUSE
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}




