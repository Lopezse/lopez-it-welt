/**
 * Incident Timeline Component - Enterprise++ Standard P8-C
 * 
 * Zeigt die Timeline eines Incidents (Events)
 */

"use client";

import type { IncidentEvent } from "@/lib/ki-orchestrator/level2/types";

interface IncidentTimelineProps {
  events: IncidentEvent[];
  className?: string;
}

export function IncidentTimeline({ events, className = "" }: IncidentTimelineProps) {
  const getEventLabel = (eventType: string): string => {
    const labels: Record<string, string> = {
      INCIDENT_OPENED: "Incident eröffnet",
      INCIDENT_ACKNOWLEDGED: "Bestätigt",
      INCIDENT_ESCALATED: "Eskaliert",
      INCIDENT_INVESTIGATING: "Untersuchung gestartet",
      INCIDENT_RESOLVED: "Aufgelöst",
      INCIDENT_CLOSED: "Geschlossen",
      INCIDENT_COMMENT: "Kommentar",
      INCIDENT_ASSIGNED: "Zugewiesen",
    };
    return labels[eventType] || eventType;
  };

  const getEventIcon = (eventType: string) => {
    if (eventType.includes("OPENED")) {
      return (
        <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
      );
    }
    if (eventType.includes("RESOLVED") || eventType.includes("CLOSED")) {
      return (
        <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    if (eventType.includes("ESCALATED")) {
      return (
        <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      );
    }
    return (
      <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  if (events.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 dark:text-gray-400 ${className}`}>
        <p>Keine Events vorhanden</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              {getEventIcon(event.event_type)}
            </div>
            {index < events.length - 1 && (
              <div className="mt-2 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />
            )}
          </div>
          <div className="flex-1 pb-8">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                {getEventLabel(event.event_type)}
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(event.performed_at).toLocaleString("de-DE", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Durchgeführt von: {event.performed_by === "system" ? "System" : "[REDACTED]"}
            </p>
            {event.event_data && Object.keys(event.event_data).length > 0 && (
              <div className="mt-2 rounded-lg bg-gray-50 dark:bg-gray-800 p-2">
                <pre className="text-xs text-gray-700 dark:text-gray-300">
                  {JSON.stringify(event.event_data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

