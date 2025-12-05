/**
 * Impact Visualization Component - Enterprise++ Standard P9
 * 
 * Impact-Visualisierung für Root-Cause-Analysis
 */

"use client";

import type { ImpactAnalysis, Event } from "@/lib/ki-orchestrator/level2/uoc/types";

interface ImpactVisualizationProps {
  impact: ImpactAnalysis;
  rootCause: Event;
}

export function ImpactVisualization({ impact, rootCause }: ImpactVisualizationProps) {
  const overallImpact = (impact.userImpact + impact.businessImpact) / 2;

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Gesamt-Impact</p>
        <p
          className={`text-3xl font-bold ${
            overallImpact >= 70
              ? "text-red-600 dark:text-red-400"
              : overallImpact >= 40
              ? "text-yellow-600 dark:text-yellow-400"
              : "text-green-600 dark:text-green-400"
          }`}
        >
          {overallImpact.toFixed(0)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">User-Impact</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className={`h-4 rounded-full ${
                impact.userImpact >= 70
                  ? "bg-red-500"
                  : impact.userImpact >= 40
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${impact.userImpact}%` }}
            />
          </div>
          <p className="text-sm text-gray-900 dark:text-white mt-1">{impact.userImpact}%</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Business-Impact</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className={`h-4 rounded-full ${
                impact.businessImpact >= 70
                  ? "bg-red-500"
                  : impact.businessImpact >= 40
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${impact.businessImpact}%` }}
            />
          </div>
          <p className="text-sm text-gray-900 dark:text-white mt-1">{impact.businessImpact}%</p>
        </div>
      </div>

      {impact.affectedServices.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Betroffene Services:
          </p>
          <div className="flex flex-wrap gap-2">
            {impact.affectedServices.map((service, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      )}

      {impact.estimatedDowntime > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Geschätzte Downtime: <span className="font-medium">{impact.estimatedDowntime} Minuten</span>
          </p>
        </div>
      )}
    </div>
  );
}




