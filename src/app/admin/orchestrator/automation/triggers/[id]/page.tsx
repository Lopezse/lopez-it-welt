/**
 * Trigger-Detail - Enterprise++ Standard
 * 
 * Detail-Ansicht eines Triggers
 * Implementiert gemäß P8-UI-PHASE-2
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { JSONViewer } from "@/components/ui/JSONViewer";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { WarningBanner } from "@/components/ui/WarningBanner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAdminPermissions } from "@/lib/hooks/useAdminPermissions";
import { useApprovalStatus } from "@/lib/hooks/useApprovalStatus";
import Link from "next/link";

interface Trigger {
  id: string;
  name: string;
  type: string;
  event_type?: string;
  conditions: Record<string, unknown> | unknown[];
  actions: Record<string, unknown> | unknown[];
  enabled: boolean;
  approval_required: boolean;
  approval_status?: string;
  created_at: string;
  updated_at: string;
}

interface Event {
  id: number;
  event_type: string;
  resource_id: string;
  timestamp: string;
  result: string;
  details?: Record<string, unknown>;
}

export default function TriggerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const triggerId = params.id as string;
  
  const [trigger, setTrigger] = useState<Trigger | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | undefined>(undefined);
  const [firing, setFiring] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFireConfirm, setShowFireConfirm] = useState(false);
  
  const { canManage } = useAdminPermissions();
  
  // Use-Case extrahieren
  const extractUseCase = (): string => {
    if (!trigger) return "unknown";
    if (Array.isArray(trigger.actions) && trigger.actions.length > 0) {
      const firstAction = trigger.actions[0] as any;
      if (firstAction.use_case && firstAction.use_case !== "unknown") return firstAction.use_case;
      if (firstAction.agent) {
        const agent = firstAction.agent.toLowerCase();
        if (agent.includes("media")) return "media-ki";
        if (agent.includes("content")) return "content-agent";
        if (agent.includes("compliance")) return "compliance-agent";
      }
    }
    const name = trigger.name.toLowerCase();
    if (name.includes("media")) return "media-ki";
    if (name.includes("content")) return "content-agent";
    if (name.includes("compliance")) return "compliance-agent";
    return "unknown";
  };

  const useCase = trigger ? extractUseCase() : null;
  const { status: approvalStatus } = useApprovalStatus(useCase);

  useEffect(() => {
    loadTrigger();
    loadEvents();
  }, [triggerId]);

  const loadTrigger = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/orchestrator/triggers/${triggerId}`);
      if (!response.ok) {
        throw new Error("Fehler beim Laden des Triggers");
      }

      const data = await response.json();
      if (data.success) {
        setTrigger(data.data);
        setError(null);
        setErrorCode(undefined);
      } else {
        setError(data.message || "Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
        setErrorCode(data.error_code);
      }
    } catch (err: any) {
      setError("Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
      setErrorCode(undefined);
      console.error("Fehler beim Laden des Triggers:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await fetch(
        `/api/orchestrator/events?resource_type=trigger&resource_id=${triggerId}&limit=20`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setEvents(data.data || []);
        }
      }
    } catch (err) {
      console.error("Fehler beim Laden der Events:", err);
    }
  };

  const handleFire = async () => {
    setShowFireConfirm(false);
    
    try {
      setFiring(true);
      setError(null);
      setErrorCode(undefined);
      
      const response = await fetch(`/api/orchestrator/triggers/${triggerId}/fire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        await loadEvents();
        // Erfolg: Keine Fehlermeldung, Event-Historie wird aktualisiert
      } else {
        setError(data.message || "Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
        setErrorCode(data.error_code);
      }
    } catch (err) {
      console.error("Fehler beim Auslösen des Triggers:", err);
      setError("Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
      setErrorCode(undefined);
    } finally {
      setFiring(false);
    }
  };

  const handleToggle = async () => {
    if (!trigger) return;

    try {
      const response = await fetch(`/api/orchestrator/triggers/${triggerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !trigger.enabled }),
      });

      const data = await response.json();
      if (response.ok) {
        await loadTrigger();
        setError(null);
        setErrorCode(undefined);
      } else {
        setError(data.message || "Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
        setErrorCode(data.error_code);
      }
    } catch (err) {
      console.error("Fehler beim Toggle:", err);
      setError("Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
      setErrorCode(undefined);
    }
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    
    try {
      setError(null);
      setErrorCode(undefined);
      
      const response = await fetch(`/api/orchestrator/triggers/${triggerId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (response.ok) {
        router.push("/admin/orchestrator/automation/triggers");
      } else {
        setError(data.message || "Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
        setErrorCode(data.error_code);
      }
    } catch (err) {
      console.error("Fehler beim Löschen:", err);
      setError("Die Aktion konnte nicht ausgeführt werden. Bitte prüfen Sie P7-Freigabe und Konfiguration oder versuchen Sie es später erneut.");
      setErrorCode(undefined);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Lade Trigger...</p>
        </div>
      </div>
    );
  }

  if (error || !trigger) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || "Trigger nicht gefunden"}</p>
          <Link href="/admin/orchestrator/automation/triggers">
            <Button variant="outline">Zurück zur Liste</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Prüfe ob Aktionen erlaubt sind
  const canExecute = approvalStatus?.can_execute ?? false;
  const approvalStatusValue = approvalStatus?.approval_status || "none";
  const showWarning = approvalStatusValue !== "approved" && approvalStatusValue !== "not_required";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/orchestrator/automation/triggers">
            <Button variant="outline" className="mb-4">← Zurück zur Liste</Button>
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {trigger.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Trigger-Detail-Ansicht
              </p>
            </div>
            {canManage() && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleToggle}
                  disabled={!canExecute && showWarning}
                  title={!canExecute && showWarning ? "Aktion nur bei gültiger P7-Freigabe möglich." : undefined}
                >
                  {trigger.enabled ? "Deaktivieren" : "Aktivieren"}
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => setShowFireConfirm(true)} 
                  disabled={firing || !trigger.enabled || (!canExecute && showWarning)}
                  title={!canExecute && showWarning ? "Aktion nur bei gültiger P7-Freigabe möglich." : undefined}
                >
                  {firing ? "Wird ausgelöst..." : "Manuell auslösen"}
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={!canExecute && showWarning}
                  title={!canExecute && showWarning ? "Aktion nur bei gültiger P7-Freigabe möglich." : undefined}
                >
                  Löschen
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6">
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

        {/* Warning Banner bei fehlender/abgelaufener P7-Freigabe */}
        {showWarning && useCase && useCase !== "unknown" && (
          <div className="mb-6">
            <WarningBanner approvalStatus={approvalStatusValue as any} useCase={useCase} />
          </div>
        )}

        {/* "unknown" Use-Case Warnung */}
        {useCase === "unknown" && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              ⚠️ Konfiguration fehlerhaft – Use-Case nicht gesetzt. DSFA-konforme Ausführung ist nicht möglich.
            </p>
          </div>
        )}

        {/* Bestätigungs-Dialoge */}
        <ConfirmDialog
          open={showDeleteConfirm}
          title="Trigger löschen"
          message="Möchten Sie diesen Trigger wirklich löschen? Diese Aktion wird protokolliert und kann nicht rückgängig gemacht werden."
          confirmText="Löschen"
          cancelText="Abbrechen"
          variant="destructive"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
        <ConfirmDialog
          open={showFireConfirm}
          title="Trigger manuell auslösen"
          message="Möchten Sie diesen Trigger manuell auslösen? Diese Aktion wird protokolliert."
          confirmText="Auslösen"
          cancelText="Abbrechen"
          onConfirm={handleFire}
          onCancel={() => setShowFireConfirm(false)}
        />

        {/* Trigger-Informationen */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Trigger-Informationen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">ID</label>
              <p className="text-sm text-gray-900 dark:text-white">{trigger.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
              <p className="text-sm text-gray-900 dark:text-white">{trigger.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Typ</label>
              <p className="text-sm text-gray-900 dark:text-white">{trigger.type}</p>
            </div>
            {trigger.event_type && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Event-Typ</label>
                <p className="text-sm text-gray-900 dark:text-white">{trigger.event_type}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
              <div className="mt-1">
                <StatusBadge
                  status={trigger.enabled ? "Aktiv" : "Inaktiv"}
                  variant={trigger.enabled ? "success" : "default"}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Use-Case</label>
              {useCase === "unknown" ? (
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  ⚠️ Konfiguration fehlerhaft – Use-Case nicht gesetzt
                </p>
              ) : (
                <p className="text-sm text-gray-900 dark:text-white">{useCase}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">P7-Approval-Status</label>
              <div className="mt-1">
                {approvalStatus && (
                  <StatusBadge
                    status={
                      approvalStatusValue === "approved"
                        ? "Freigegeben"
                        : approvalStatusValue === "pending"
                        ? "Ausstehend"
                        : approvalStatusValue === "expired"
                        ? "Abgelaufen"
                        : approvalStatusValue === "rejected"
                        ? "Abgelehnt"
                        : "Keine Freigabe"
                    }
                    variant={
                      approvalStatusValue === "approved"
                        ? "success"
                        : approvalStatusValue === "pending"
                        ? "warning"
                        : approvalStatusValue === "expired" || approvalStatusValue === "rejected"
                        ? "error"
                        : "default"
                    }
                  />
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Approval erforderlich</label>
              <div className="mt-1">
                {trigger.approval_required ? (
                  <StatusBadge
                    status={trigger.approval_status || "pending"}
                    variant={
                      trigger.approval_status === "approved"
                        ? "success"
                        : trigger.approval_status === "rejected"
                        ? "error"
                        : "warning"
                    }
                  />
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">Nicht erforderlich</span>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Erstellt am</label>
              <p className="text-sm text-gray-900 dark:text-white">
                {new Date(trigger.created_at).toLocaleString("de-DE")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Aktualisiert am</label>
              <p className="text-sm text-gray-900 dark:text-white">
                {new Date(trigger.updated_at).toLocaleString("de-DE")}
              </p>
            </div>
          </div>
        </div>

        {/* Bedingungen */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Bedingungen
          </h2>
          <JSONViewer data={trigger.conditions} title="Bedingungen (JSON)" />
        </div>

        {/* Aktionen */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Aktionen
          </h2>
          <JSONViewer data={trigger.actions} title="Aktionen (JSON)" />
        </div>

        {/* Event-Historie */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Event-Historie (letzte 20)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Event-Typ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Zeitpunkt
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {events.length > 0 ? (
                  events.map((event) => (
                    <tr key={event.id}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {event.event_type}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <StatusBadge
                          status={event.result}
                          variant={
                            event.result === "success"
                              ? "success"
                              : event.result === "failure"
                              ? "error"
                              : "warning"
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(event.timestamp).toLocaleString("de-DE")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                      Keine Events gefunden
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

