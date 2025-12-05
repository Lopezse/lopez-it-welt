/**
 * UOC Filter Bar Component - Enterprise++ Standard P9
 * 
 * Filter-Bar für UOC-Views
 */

"use client";

import { useState } from "react";
import type { UOCFilters } from "@/lib/ki-orchestrator/level2/uoc/types";

interface UOCFilterBarProps {
  filters: UOCFilters;
  onFilterChange: (filters: UOCFilters) => void;
  availableCategories?: string[];
  availableSeverities?: string[];
  availableSources?: string[];
}

export function UOCFilterBar({
  filters,
  onFilterChange,
  availableCategories = [],
  availableSeverities = [],
  availableSources = [],
}: UOCFilterBarProps) {
  const [timeRange, setTimeRange] = useState<string>("24h");

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    const now = new Date();
    let start: Date;
    switch (value) {
      case "1h":
        start = new Date(now.getTime() - 3600000);
        break;
      case "6h":
        start = new Date(now.getTime() - 6 * 3600000);
        break;
      case "7d":
        start = new Date(now.getTime() - 7 * 24 * 3600000);
        break;
      case "24h":
      default:
        start = new Date(now.getTime() - 24 * 3600000);
        break;
    }
    onFilterChange({
      ...filters,
      timeRange: { start, end: now },
    });
  };

  const handleCategoryToggle = (category: string) => {
    const categories = filters.categories || [];
    const newCategories = categories.includes(category)
      ? categories.filter((c) => c !== category)
      : [...categories, category];
    onFilterChange({
      ...filters,
      categories: newCategories.length > 0 ? newCategories : undefined,
    });
  };

  const handleSeverityToggle = (severity: string) => {
    const severities = filters.severities || [];
    const newSeverities = severities.includes(severity)
      ? severities.filter((s) => s !== severity)
      : [...severities, severity];
    onFilterChange({
      ...filters,
      severities: newSeverities.length > 0 ? newSeverities : undefined,
    });
  };

  const handleSourceToggle = (source: string) => {
    const sources = filters.sources || [];
    const newSources = sources.includes(source)
      ? sources.filter((s) => s !== source)
      : [...sources, source];
    onFilterChange({
      ...filters,
      sources: newSources.length > 0 ? newSources : undefined,
    });
  };

  const handleReset = () => {
    setTimeRange("24h");
    onFilterChange({
      timeRange: {
        start: new Date(Date.now() - 24 * 3600000),
        end: new Date(),
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Zeitraum-Picker */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Zeitraum
          </label>
          <select
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1.5 text-sm"
          >
            <option value="1h">Letzte Stunde</option>
            <option value="6h">Letzte 6 Stunden</option>
            <option value="24h">Letzte 24 Stunden</option>
            <option value="7d">Letzte 7 Tage</option>
          </select>
        </div>

        {/* Kategorie-Filter */}
        {availableCategories.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kategorien
            </label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category) => (
                <label key={category} className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={filters.categories?.includes(category) || false}
                    onChange={() => handleCategoryToggle(category)}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Severity-Filter */}
        {availableSeverities.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Severity
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSeverities.map((severity) => (
                <label key={severity} className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={filters.severities?.includes(severity) || false}
                    onChange={() => handleSeverityToggle(severity)}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{severity}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Source-Filter */}
        {availableSources.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quellen
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSources.map((source) => (
                <label key={source} className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={filters.sources?.includes(source) || false}
                    onChange={() => handleSourceToggle(source)}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{source}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Reset-Button */}
        <div className="ml-auto">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600"
          >
            Zurücksetzen
          </button>
        </div>
      </div>
    </div>
  );
}




