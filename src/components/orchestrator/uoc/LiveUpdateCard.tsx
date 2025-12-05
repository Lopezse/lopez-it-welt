/**
 * Live Update Card Component - Enterprise++ Standard P9
 * 
 * Toast-ähnliche Karte für Live-Updates
 */

"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface LiveUpdateCardProps {
  eventType: "alert" | "metric" | "log" | "health" | "incident";
  data: unknown;
  timestamp: Date;
  onDismiss?: () => void;
}

export function LiveUpdateCard({
  eventType,
  data,
  timestamp,
  onDismiss,
}: LiveUpdateCardProps) {
  // Auto-Dismiss nach 5 Sekunden
  useEffect(() => {
    if (onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [onDismiss]);

  const getEventTitle = () => {
    const event = data as any;
    switch (eventType) {
      case "alert":
        return event.title || "Alert";
      case "metric":
        return `${event.metric_name || event.metric_id}: ${event.value} ${event.unit || ""}`;
      case "log":
        return event.message?.substring(0, 50) || "Log";
      case "health":
        return `Health: ${event.status}`;
      case "incident":
        return event.title || "Incident";
      default:
        return "Event";
    }
  };

  const getTimeAgo = () => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    if (seconds < 60) {
      return `vor ${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `vor ${minutes}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      return `vor ${hours}h`;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 mb-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={eventType.toUpperCase()} variant="info" size="sm" />
            <span className="text-xs text-gray-500 dark:text-gray-400">{getTimeAgo()}</span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{getEventTitle()}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}




