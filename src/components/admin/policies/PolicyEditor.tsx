/**
 * Policy Editor Component - Enterprise++ Standard E.2.4
 * 
 * Policy erstellen, bearbeiten und validieren
 */

"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface Policy {
  id?: string;
  name: string;
  description: string;
  category: string;
  type: "security" | "compliance" | "data" | "access" | "audit";
  status: "draft" | "active" | "archived";
  content: string;
  version: number;
  effective_date?: string;
  expiry_date?: string;
}

interface PolicyEditorProps {
  policy?: Policy;
  onSave: (policy: Policy) => void;
  onCancel: () => void;
}

export function PolicyEditor({ policy, onSave, onCancel }: PolicyEditorProps) {
  const [formData, setFormData] = useState<Policy>(policy || {
    name: "",
    description: "",
    category: "",
    type: "security",
    status: "draft",
    content: "",
    version: 1,
  });
  const [validating, setValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validatePolicy = async () => {
    try {
      setValidating(true);
      setValidationErrors([]);
      setError(null);

      const response = await fetch("/api/admin/policies/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler bei der Validierung");
      }

      if (result.data.errors && result.data.errors.length > 0) {
        setValidationErrors(result.data.errors);
      } else {
        setValidationErrors([]);
      }
    } catch (err) {
      logger.error("Fehler bei der Policy-Validierung", err);
      setError(err instanceof Error ? err.message : "Fehler bei der Validierung");
    } finally {
      setValidating(false);
    }
  };

  const handleSave = () => {
    if (validationErrors.length === 0) {
      onSave(formData);
    } else {
      setError("Bitte beheben Sie die Validierungsfehler vor dem Speichern");
    }
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {policy ? "Policy bearbeiten" : "Neue Policy erstellen"}
        </h3>
        {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
        {validationErrors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
            <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">Validierungsfehler:</h4>
            <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300">
              {validationErrors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Beschreibung *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategorie *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="z.B. DSGVO, ISO 27001, GoBD"
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Typ *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                required
              >
                <option value="security">Security</option>
                <option value="compliance">Compliance</option>
                <option value="data">Data</option>
                <option value="access">Access</option>
                <option value="audit">Audit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                required
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Version
              </label>
              <input
                type="number"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: parseInt(e.target.value) || 1 })}
                min={1}
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gültig ab
              </label>
              <input
                type="date"
                value={formData.effective_date || ""}
                onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gültig bis
              </label>
              <input
                type="date"
                value={formData.expiry_date || ""}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Policy-Inhalt (JSON) *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={10}
              className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white font-mono"
              placeholder='{"rules": [], "conditions": []}'
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={validatePolicy}
              disabled={validating}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              {validating ? "Validiere..." : "Validieren"}
            </button>
            <button
              onClick={handleSave}
              disabled={validationErrors.length > 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              Speichern
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

