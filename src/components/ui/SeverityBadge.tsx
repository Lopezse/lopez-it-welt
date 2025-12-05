/**
 * Severity Badge Component - Enterprise++ Standard P8-C
 * 
 * Badge für Severity-Anzeige (info, warning, critical)
 */

"use client";

import type { AlertSeverity, IncidentSeverity } from "@/lib/ki-orchestrator/level2/types";

interface SeverityBadgeProps {
  severity: AlertSeverity | IncidentSeverity;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SeverityBadge({ severity, size = "md", className = "" }: SeverityBadgeProps) {
  const severityConfig = {
    info: {
      label: "Info",
      classes: "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200",
      icon: (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    warning: {
      label: "Warnung",
      classes: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200",
      icon: (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    critical: {
      label: "Kritisch",
      classes: "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200",
      icon: (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  };

  const config = severityConfig[severity];
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.classes} ${sizeClasses[size]} ${className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}





