/**
 * Audit Log Filters Component - Enterprise++ Standard E.2.3
 * 
 * Erweiterte Filter für Audit-Logs mit Filter-Speicherung
 */

"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { logger } from "@/lib/logger";

interface FilterState {
  user_id: string;
  action: string;
  resource_type: string;
  severity: string;
  compliance_category: string;
  start_date: string;
  end_date: string;
  search: string;
}

interface AuditLogFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
}

export function AuditLogFilters({ filters, onFiltersChange, onReset }: AuditLogFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedFilters, setSavedFilters] = useState<Array<{ name: string; filters: FilterState }>>([]);

  useEffect(() => {
    // Gespeicherte Filter laden
    const saved = localStorage.getItem("audit-log-filters");
    if (saved) {
      try {
        setSavedFilters(JSON.parse(saved));
      } catch (err) {
        logger.error("Fehler beim Laden der gespeicherten Filter", err);
      }
    }
  }, []);

  const saveFilter = () => {
    const name = prompt("Filter-Name eingeben:");
    if (name) {
      const newSaved = [...savedFilters, { name, filters }];
      setSavedFilters(newSaved);
      localStorage.setItem("audit-log-filters", JSON.stringify(newSaved));
    }
  };

  const loadFilter = (savedFilter: FilterState) => {
    onFiltersChange(savedFilter);
  };

  const deleteFilter = (index: number) => {
    const newSaved = savedFilters.filter((_, i) => i !== index);
    setSavedFilters(newSaved);
    localStorage.setItem("audit-log-filters", JSON.stringify(newSaved));
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter</h3>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAdvanced(!showAdvanced)}
              variant="outline"
              className="dark:text-white dark:border-gray-600"
            >
              {showAdvanced ? "Einfach" : "Erweitert"}
            </Button>
            <Button onClick={onReset} variant="outline" className="dark:text-white dark:border-gray-600">
              Zurücksetzen
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Basis-Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Suche
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                placeholder="Suche in Aktionen, Notizen..."
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Aktion
              </label>
              <input
                type="text"
                value={filters.action}
                onChange={(e) => onFiltersChange({ ...filters, action: e.target.value })}
                placeholder="z.B. CREATE, UPDATE, DELETE"
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Severity
              </label>
              <select
                value={filters.severity}
                onChange={(e) => onFiltersChange({ ...filters, severity: e.target.value })}
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              >
                <option value="">Alle</option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Compliance-Kategorie
              </label>
              <select
                value={filters.compliance_category}
                onChange={(e) => onFiltersChange({ ...filters, compliance_category: e.target.value })}
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              >
                <option value="">Alle</option>
                <option value="DSGVO">DSGVO</option>
                <option value="ISO27001">ISO 27001</option>
                <option value="SOC2">SOC2</option>
                <option value="HIPAA">HIPAA</option>
                <option value="SOX">SOX</option>
                <option value="SECURITY">SECURITY</option>
                <option value="ACCESS">ACCESS</option>
              </select>
            </div>
          </div>

          {/* Erweiterte Filter */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Benutzer-ID
                </label>
                <input
                  type="text"
                  value={filters.user_id}
                  onChange={(e) => onFiltersChange({ ...filters, user_id: e.target.value })}
                  placeholder="Benutzer-ID"
                  className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resource-Typ
                </label>
                <input
                  type="text"
                  value={filters.resource_type}
                  onChange={(e) => onFiltersChange({ ...filters, resource_type: e.target.value })}
                  placeholder="z.B. lopez_invoices, system_backups"
                  className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start-Datum
                </label>
                <input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) => onFiltersChange({ ...filters, start_date: e.target.value })}
                  className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End-Datum
                </label>
                <input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) => onFiltersChange({ ...filters, end_date: e.target.value })}
                  className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Gespeicherte Filter */}
          {savedFilters.length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Gespeicherte Filter</h4>
                <Button onClick={saveFilter} variant="outline" className="dark:text-white dark:border-gray-600 text-xs">
                  Aktuellen Filter speichern
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {savedFilters.map((saved, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded px-3 py-1">
                    <button
                      onClick={() => loadFilter(saved.filters)}
                      className="text-sm text-gray-900 dark:text-white hover:underline"
                    >
                      {saved.name}
                    </button>
                    <button
                      onClick={() => deleteFilter(index)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}



