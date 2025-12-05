/**
 * Log Level Badge Component - Enterprise++ Standard P8-E
 * 
 * Badge für Log-Level-Anzeige (TRACE, DEBUG, INFO, WARN, ERROR, FATAL)
 */

"use client";

import type { LogLevel } from "@/lib/ki-orchestrator/level2/logs/types";

interface LogLevelBadgeProps {
  level: LogLevel;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LogLevelBadge({ level, size = "md", className = "" }: LogLevelBadgeProps) {
  const levelConfig = {
    TRACE: {
      label: "TRACE",
      classes: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200",
    },
    DEBUG: {
      label: "DEBUG",
      classes: "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200",
    },
    INFO: {
      label: "INFO",
      classes: "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200",
    },
    WARN: {
      label: "WARN",
      classes: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200",
    },
    ERROR: {
      label: "ERROR",
      classes: "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200",
    },
    FATAL: {
      label: "FATAL",
      classes: "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200",
    },
  };

  const config = levelConfig[level];
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.classes} ${sizeClasses[size]} ${className}`}
    >
      {config.label}
    </span>
  );
}





