/**
 * Policy Management Dashboard - Enterprise++ Standard E.2.4
 * 
 * Zentrale Übersicht für Policy-Management
 */

"use client";

import { useState, useEffect } from "react";
import { PolicyEditor } from "@/components/admin/policies/PolicyEditor";
import { PolicyVersioning } from "@/components/admin/policies/PolicyVersioning";
import { PolicyApprovalWorkflow } from "@/components/admin/policies/PolicyApprovalWorkflow";
import { PolicyComplianceStatus } from "@/components/admin/policies/PolicyComplianceStatus";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaShieldAlt,
} from "react-icons/fa";
import type { AdminPolicy } from "@/lib/finance/types";

// Re-export für Abwärtskompatibilität
type Policy = AdminPolicy;

export default function PolicyManagementPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "compliance" | "create">("overview");
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showVersioning, setShowVersioning] = useState(false);
  const [showApproval, setShowApproval] = useState(false);

  useEffect(() => {
    if (activeTab === "overview") {
      loadPolicies();
    }
  }, [activeTab]);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/policies");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Laden der Policies");
      }

      setPolicies(result.data || []);
    } catch (err) {
      logger.error("Fehler beim Laden der Policies", err);
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Policies");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePolicy = async (policy: any) => {
    try {
      setError(null);
      const response = await fetch(selectedPolicy ? `/api/admin/policies/${selectedPolicy.id}` : "/api/admin/policies", {
        method: selectedPolicy ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(policy),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Speichern der Policy");
      }

      setShowEditor(false);
      setSelectedPolicy(null);
      loadPolicies();
    } catch (err) {
      logger.error("Fehler beim Speichern der Policy", err);
      setError(err instanceof Error ? err.message : "Fehler beim Speichern der Policy");
    }
  };

  const handleDeletePolicy = async (policyId: string) => {
    if (!confirm("Möchten Sie diese Policy wirklich löschen?")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/admin/policies/${policyId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Löschen der Policy");
      }

      loadPolicies();
    } catch (err) {
      logger.error("Fehler beim Löschen der Policy", err);
      setError(err instanceof Error ? err.message : "Fehler beim Löschen der Policy");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <FaCheckCircle className="text-green-500" />;
      case "draft": return <FaClock className="text-yellow-500" />;
      case "archived": return <FaExclamationTriangle className="text-gray-500" />;
      default: return <FaShieldAlt className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "draft": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "archived": return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Policy-Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Enterprise++ Policy-Verwaltung für Compliance & Sicherheit
        </p>

        {/* Tab-Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "overview"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Übersicht
            </button>
            <button
              onClick={() => setActiveTab("compliance")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "compliance"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Compliance-Status
            </button>
            <button
              onClick={() => {
                setActiveTab("create");
                setSelectedPolicy(null);
                setShowEditor(true);
              }}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "create"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Neue Policy
            </button>
          </nav>
        </div>

        {/* Tab-Content */}
        {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

        {activeTab === "overview" && (
          <>
            {showEditor && (
              <div className="mb-6">
                <PolicyEditor
                  policy={selectedPolicy || undefined}
                  onSave={handleSavePolicy}
                  onCancel={() => {
                    setShowEditor(false);
                    setSelectedPolicy(null);
                    setActiveTab("overview");
                  }}
                />
              </div>
            )}

            {!showEditor && (
              <>
                {loading ? (
                  <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 flex h-64 items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">Lade Policies...</p>
                    </div>
                  </Card>
                ) : (
                  <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Policies</h3>
                        <button
                          onClick={() => {
                            setSelectedPolicy(null);
                            setShowEditor(true);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 flex items-center"
                        >
                          <FaPlus className="mr-2" />
                          Neue Policy
                        </button>
                      </div>

                      {policies.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">Keine Policies vorhanden</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Name</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Kategorie</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Typ</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Status</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Version</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Aktualisiert</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Aktionen</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                              {policies.map((policy) => (
                                <tr key={policy.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{policy.name}</td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{policy.category}</td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{policy.type}</td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                                      {getStatusIcon(policy.status)}
                                      <span className="ml-1">{policy.status}</span>
                                    </span>
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{policy.version}</td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {format(new Date(policy.updated_at), "dd.MM.yyyy", { locale: de })}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => {
                                          setSelectedPolicy(policy);
                                          setShowVersioning(true);
                                        }}
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                                        title="Versionen"
                                      >
                                        <FaEye />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelectedPolicy(policy);
                                          setShowApproval(true);
                                        }}
                                        className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                                        title="Freigabe"
                                      >
                                        <FaCheckCircle />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelectedPolicy(policy);
                                          setShowEditor(true);
                                        }}
                                        className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300"
                                        title="Bearbeiten"
                                      >
                                        <FaEdit />
                                      </button>
                                      <button
                                        onClick={() => handleDeletePolicy(policy.id)}
                                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                        title="Löschen"
                                      >
                                        <FaTrash />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </>
            )}

            {/* Versioning Modal */}
            {showVersioning && selectedPolicy && (
              <div className="mt-6">
                <PolicyVersioning
                  policyId={selectedPolicy.id}
                  onVersionRestore={() => {
                    setShowVersioning(false);
                    loadPolicies();
                  }}
                />
                <div className="mt-4">
                  <button
                    onClick={() => setShowVersioning(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Schließen
                  </button>
                </div>
              </div>
            )}

            {/* Approval Modal */}
            {showApproval && selectedPolicy && (
              <div className="mt-6">
                <PolicyApprovalWorkflow
                  policyId={selectedPolicy.id}
                  onApprovalChange={() => {
                    loadPolicies();
                  }}
                />
                <div className="mt-4">
                  <button
                    onClick={() => setShowApproval(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Schließen
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "compliance" && <PolicyComplianceStatus />}
      </div>
    </div>
  );
}

