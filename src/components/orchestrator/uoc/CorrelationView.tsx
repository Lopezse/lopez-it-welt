/**
 * Correlation View Component - Enterprise++ Standard P9
 * 
 * Correlation-View für UOC
 */

"use client";

import { useEffect, useState } from "react";
import { CorrelationTable } from "./CorrelationTable";
import { UOCFilterBar } from "./UOCFilterBar";
import type { CorrelationFilters, CorrelationResult } from "@/lib/ki-orchestrator/level2/uoc/types";

interface CorrelationViewProps {
  correlations?: CorrelationResult[];
  filters?: CorrelationFilters;
  onFilterChange?: (filters: CorrelationFilters) => void;
  onCorrelationClick?: (correlation: CorrelationResult) => void;
}

export function CorrelationView({
  correlations: initialCorrelations,
  filters,
  onFilterChange,
  onCorrelationClick,
}: CorrelationViewProps) {
  const [correlations, setCorrelations] = useState<CorrelationResult[]>(initialCorrelations || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!filters) return;

    const fetchCorrelations = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.timeRange) {
          params.append("timeRange", "24h");
        }
        if (filters.minScore !== undefined) {
          params.append("minScore", filters.minScore.toString());
        }

        const response = await fetch(`/api/orchestrator/uoc/correlations?${params.toString()}`, {
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();
          setCorrelations(result.data?.correlations || []);
        }
      } catch (error) {
        console.error("Failed to fetch correlations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCorrelations();
  }, [filters]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Korrelationen</h1>
      </div>

      {filters && onFilterChange && (
        <UOCFilterBar
          filters={filters}
          onFilterChange={onFilterChange as any}
          availableCategories={["Security", "API", "Queue", "System"]}
          availableSeverities={["info", "warning", "critical"]}
          availableSources={["alerts", "logs", "metrics"]}
        />
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Laden...</p>
        </div>
      ) : (
        <CorrelationTable
          correlations={correlations}
          onCorrelationClick={onCorrelationClick}
          sortable
        />
      )}
    </div>
  );
}




