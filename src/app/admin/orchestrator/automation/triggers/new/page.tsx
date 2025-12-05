/**
 * Trigger erstellen - Enterprise++ Standard
 * 
 * Formular zum Erstellen eines neuen Triggers
 * Implementiert gemäß P8-UI-PHASE-2
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { JSONEditor } from "@/components/ui/JSONEditor";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { useAdminPermissions } from "@/lib/hooks/useAdminPermissions";
import Link from "next/link";

export default function NewTriggerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | undefined>(undefined);
  
  const { canManage } = useAdminPermissions();
  
  // Redirect wenn keine Berechtigung
  if (!canManage()) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            Sie haben keine Berechtigung, Trigger zu erstellen.
          </p>
          <Link href="/admin/orchestrator/automation/triggers">
            <Button variant="outline">Zurück zur Liste</Button>
          </Link>
        </div>
      </div>
    );
  }
  const [formData, setFormData] = useState({
    name: "",
    type: "event-based",
    event_type: "",
    use_case: "",
    approval_required: false,
    conditions: "{}",
    actions: "[]",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validierung
    if (!formData.name || !formData.use_case) {
      setError("Name und Use-Case sind Pflichtfelder");
      return;
    }

    // Validierung: "unknown" Use-Case nicht zulässig
    if (formData.use_case.toLowerCase().trim() === "unknown") {
      setError("Use-Case 'unknown' ist nicht zulässig. Bitte geben Sie einen gültigen Use-Case an.");
      return;
    }

    // JSON-Validierung
    let parsedConditions: Record<string, unknown> = {};
    let parsedActions: unknown[] = [];

    try {
      parsedConditions = JSON.parse(formData.conditions || "{}");
    } catch (err) {
      setError("Bedingungen: Ungültiges JSON-Format");
      return;
    }

    try {
      parsedActions = JSON.parse(formData.actions || "[]");
      if (!Array.isArray(parsedActions)) {
        setError("Aktionen: Muss ein JSON-Array sein");
        return;
      }
    } catch (err) {
      setError("Aktionen: Ungültiges JSON-Format");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/orchestrator/triggers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          event_type: formData.event_type || undefined,
          conditions: parsedConditions,
          actions: parsedActions,
          approval_required: formData.approval_required,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        router.push(`/admin/orchestrator/automation/triggers/${data.data.id}`);
      } else {
        setError(data.message || "Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
        setErrorCode(data.error_code);
      }
    } catch (err) {
      console.error("Fehler beim Erstellen des Triggers:", err);
      setError("Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
      setErrorCode(undefined);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/orchestrator/automation/triggers">
            <Button variant="outline" className="mb-4">← Zurück zur Liste</Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Neuen Trigger erstellen
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Erstellen Sie einen neuen Event-basierten oder Zeit-basierten Trigger
          </p>
        </div>

        {/* Hinweis */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Hinweis:</strong> Die tatsächliche Ausführung dieses Triggers hängt von der P7-Approval-Freigabe für den angegebenen Use-Case ab. 
            Bitte stellen Sie sicher, dass der Use-Case über P7 freigegeben ist.
          </p>
        </div>

        {/* Formular */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {error && (
            <div className="mb-4">
              <ErrorBanner 
                message={error} 
                errorCode={errorCode}
                onDismiss={() => {
                  setError(null);
                  setErrorCode(undefined);
                }}
              />
            </div>
          )}

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="z.B. Media-Upload-Automation"
              />
            </div>

            {/* Typ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Typ <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="event-based">Event-basiert</option>
                <option value="time-based">Zeit-basiert</option>
              </select>
            </div>

            {/* Event-Typ (nur bei event-based) */}
            {formData.type === "event-based" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event-Typ
                </label>
                <input
                  type="text"
                  value={formData.event_type}
                  onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="z.B. TASK_COMPLETED"
                />
              </div>
            )}

            {/* Use-Case (Pflichtfeld) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Use-Case <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.use_case}
                onChange={(e) => setFormData({ ...formData, use_case: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="z.B. media-ki, content-agent, compliance-agent"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Der Use-Case muss über P7 freigegeben sein, damit der Trigger ausgeführt werden kann.
              </p>
            </div>

            {/* Approval erforderlich */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="approval_required"
                checked={formData.approval_required}
                onChange={(e) => setFormData({ ...formData, approval_required: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="approval_required" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Approval erforderlich
              </label>
            </div>

            {/* Bedingungen */}
            <div>
              <JSONEditor
                value={formData.conditions}
                onChange={(value) => setFormData({ ...formData, conditions: value })}
                placeholder='{"agent": "media-ai-agent", "status": "completed"}'
                className="mb-4"
              />
            </div>

            {/* Aktionen */}
            <div>
              <JSONEditor
                value={formData.actions}
                onChange={(value) => setFormData({ ...formData, actions: value })}
                placeholder='[{"type": "create_task", "agent": "compliance-agent"}]'
                className="mb-4"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Wird erstellt..." : "Trigger erstellen"}
              </Button>
              <Link href="/admin/orchestrator/automation/triggers">
                <Button type="button" variant="outline">Abbrechen</Button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

