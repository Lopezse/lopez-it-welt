/**
 * Category Badge Component - Enterprise++ Standard P8-E
 * 
 * Badge für Log-Kategorie-Anzeige (Security, API, Queue, Workflow, System, DSGVO)
 */

"use client";

import type { LogCategory } from "@/lib/ki-orchestrator/level2/logs/types";

interface CategoryBadgeProps {
  category: LogCategory;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CategoryBadge({ category, size = "md", className = "" }: CategoryBadgeProps) {
  const categoryConfig: Record<LogCategory, { label: string; classes: string }> = {
    Security: {
      label: "Security",
      classes: "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200",
    },
    API: {
      label: "API",
      classes: "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200",
    },
    Queue: {
      label: "Queue",
      classes: "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200",
    },
    Workflow: {
      label: "Workflow",
      classes: "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-200",
    },
    System: {
      label: "System",
      classes: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200",
    },
    DSGVO: {
      label: "DSGVO",
      classes: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200",
    },
    Orchestrator: {
      label: "Orchestrator",
      classes: "bg-cyan-100 dark:bg-cyan-900/20 text-cyan-800 dark:text-cyan-200",
    },
    Audit: {
      label: "Audit",
      classes: "bg-teal-100 dark:bg-teal-900/20 text-teal-800 dark:text-teal-200",
    },
    "Media-KI": {
      label: "Media-KI",
      classes: "bg-pink-100 dark:bg-pink-900/20 text-pink-800 dark:text-pink-200",
    },
    Database: {
      label: "Database",
      classes: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200",
    },
    Cache: {
      label: "Cache",
      classes: "bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200",
    },
  };

  const config = categoryConfig[category] || categoryConfig.System;
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





