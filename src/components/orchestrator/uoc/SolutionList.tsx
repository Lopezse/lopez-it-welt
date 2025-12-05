/**
 * Solution List Component - Enterprise++ Standard P9
 * 
 * Lösung-Vorschläge für Root-Cause-Analysis
 */

"use client";

import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Solution } from "@/lib/ki-orchestrator/level2/uoc/types";

interface SolutionListProps {
  solutions: Solution[];
  onSolutionClick?: (solution: Solution) => void;
}

export function SolutionList({ solutions, onSolutionClick }: SolutionListProps) {
  if (solutions.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Keine Lösung-Vorschläge verfügbar</p>
      </div>
    );
  }

  const priorityColors = {
    high: "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200",
    medium: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200",
    low: "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200",
  };

  return (
    <div className="space-y-4">
      {solutions.map((solution) => (
        <div
          key={solution.id}
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onSolutionClick?.(solution)}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {solution.title}
            </h3>
            <StatusBadge
              status={solution.priority}
              variant={solution.priority === "high" ? "error" : solution.priority === "medium" ? "warning" : "info"}
              size="sm"
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{solution.description}</p>
          {solution.steps && solution.steps.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Schritte:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {solution.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Geschätzte Zeit: {solution.estimatedTime} Minuten
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}




