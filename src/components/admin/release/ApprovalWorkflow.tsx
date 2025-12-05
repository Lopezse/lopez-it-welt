"use client";

import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaClock, FaHistory } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface Approval {
  id: string;
  version: string;
  checklist_id?: string;
  approval_status: "pending" | "approved" | "rejected" | "cancelled";
  requested_by: string;
  requested_at: string;
  approved_by?: string;
  approved_at?: string;
  rejected_by?: string;
  rejected_at?: string;
  rejection_reason?: string;
  notes?: string;
}

export function ApprovalWorkflow() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    version: "",
    checklist_id: "",
    notes: "",
  });

  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/release/approval");
      const result = await response.json();

      if (result.success) {
        setApprovals(result.data || []);
      } else {
        setError(result.message || "Fehler beim Laden der Freigaben");
      }
    } catch (err) {
      logger.error("Fehler beim Laden der Freigaben", err);
      setError("Fehler beim Laden der Freigaben");
    } finally {
      setLoading(false);
    }
  };

  const requestApproval = async () => {
    try {
      setError(null);
      const response = await fetch("/api/admin/release/approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: newRequest.version,
          checklist_id: newRequest.checklist_id || null,
          notes: newRequest.notes || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setNewRequest({ version: "", checklist_id: "", notes: "" });
        setShowRequestForm(false);
        loadApprovals();
      } else {
        setError(result.message || "Fehler beim Erstellen der Freigabe-Anfrage");
      }
    } catch (err) {
      logger.error("Fehler beim Erstellen der Freigabe-Anfrage", err);
      setError("Fehler beim Erstellen der Freigabe-Anfrage");
    }
  };

  const updateApproval = async (id: string, status: "approved" | "rejected", reason?: string) => {
    try {
      setError(null);
      const response = await fetch("/api/admin/release/approval", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          approval_status: status,
          rejection_reason: reason || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        loadApprovals();
      } else {
        setError(result.message || "Fehler beim Aktualisieren der Freigabe");
      }
    } catch (err) {
      logger.error("Fehler beim Aktualisieren der Freigabe", err);
      setError("Fehler beim Aktualisieren der Freigabe");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <FaHistory className="mr-2" />
            Versions-Freigaben
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Versions-Freigaben verwalten
          </p>
        </div>
        <button
          onClick={() => setShowRequestForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <FaCheckCircle className="h-4 w-4" />
          <span>Neue Freigabe anfragen</span>
        </button>
      </div>

      {error && <ErrorBanner message={error} />}

      {showRequestForm && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Freigabe anfragen
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Version
              </label>
              <input
                type="text"
                value={newRequest.version}
                onChange={(e) => setNewRequest({ ...newRequest, version: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="z.B. 1.0.0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Checkliste-ID (optional)
              </label>
              <input
                type="text"
                value={newRequest.checklist_id}
                onChange={(e) => setNewRequest({ ...newRequest, checklist_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Checkliste-ID (optional)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notizen (optional)
              </label>
              <textarea
                value={newRequest.notes}
                onChange={(e) => setNewRequest({ ...newRequest, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                placeholder="Zusätzliche Informationen..."
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={requestApproval}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Freigabe anfragen
              </button>
              <button
                onClick={() => {
                  setShowRequestForm(false);
                  setNewRequest({ version: "", checklist_id: "", notes: "" });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {!showRequestForm && (
        <div className="space-y-3">
          {approvals.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Keine Freigaben vorhanden. Erstellen Sie eine neue Freigabe-Anfrage.
              </p>
            </div>
          ) : (
            approvals.map((approval) => (
              <div
                key={approval.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Version: {approval.version}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Angefragt: {new Date(approval.requested_at).toLocaleString("de-DE")}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded flex items-center space-x-1 ${
                      approval.approval_status === "approved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : approval.approval_status === "rejected"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          : approval.approval_status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {approval.approval_status === "pending" && <FaClock className="h-3 w-3" />}
                    {approval.approval_status === "approved" && (
                      <FaCheckCircle className="h-3 w-3" />
                    )}
                    {approval.approval_status === "rejected" && (
                      <FaTimesCircle className="h-3 w-3" />
                    )}
                    <span>{approval.approval_status}</span>
                  </span>
                </div>
                {approval.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {approval.notes}
                  </p>
                )}
                {approval.rejection_reason && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-2 mb-2">
                    <p className="text-sm text-red-800 dark:text-red-400">
                      <strong>Ablehnungsgrund:</strong> {approval.rejection_reason}
                    </p>
                  </div>
                )}
                {approval.approval_status === "pending" && (
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => updateApproval(approval.id, "approved")}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center space-x-1"
                    >
                      <FaCheckCircle className="h-3 w-3" />
                      <span>Genehmigen</span>
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt("Ablehnungsgrund:");
                        if (reason) {
                          updateApproval(approval.id, "rejected", reason);
                        }
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm flex items-center space-x-1"
                    >
                      <FaTimesCircle className="h-3 w-3" />
                      <span>Ablehnen</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
