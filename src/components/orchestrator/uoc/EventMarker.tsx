/**
 * Event Marker Component - Enterprise++ Standard P9
 * 
 * Event-Marker für Timeline
 */

"use client";

import type { Event } from "@/lib/ki-orchestrator/level2/uoc/types";

interface EventMarkerProps {
  event: Event;
  isRootCause?: boolean;
  onClick?: () => void;
}

export function EventMarker({ event, isRootCause = false, onClick }: EventMarkerProps) {
  const eventColors = {
    alert: "bg-red-500",
    log: "bg-blue-500",
    metric: "bg-green-500",
    incident: "bg-orange-500",
  };

  const color = eventColors[event.type] || "bg-gray-500";

  return (
    <div
      className={`relative ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      title={`${event.type}: ${event.category} - ${event.severity}`}
    >
      <div
        className={`w-4 h-4 rounded-full ${color} ${isRootCause ? "ring-4 ring-red-300 dark:ring-red-700 scale-125" : ""} transition-transform hover:scale-125`}
      />
      {isRootCause && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full animate-pulse" />
      )}
    </div>
  );
}




