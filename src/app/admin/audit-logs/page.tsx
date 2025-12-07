"use client";

// =====================================================
// ENTERPRISE++ AUDIT-LOGS ADMIN INTERFACE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: IBM/SAP-Level Audit-Log Management UI
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT (E.2.3 erweitert)
// =====================================================

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuditLogFilters } from "@/components/admin/audit-logs/AuditLogFilters";
import { AuditLogExport } from "@/components/admin/audit-logs/AuditLogExport";
import { ISO27001Reports } from "@/components/admin/audit-logs/ISO27001Reports";
import { AuditLogAnalytics } from "@/components/admin/audit-logs/AuditLogAnalytics";
import {
  FaCheckCircle,
  FaDownload,
  FaExclamationTriangle,
  FaEye,
  FaFilter,
  FaInfoCircle,
  FaSearch,
  FaShieldAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";

interface AuditLog {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  session_id: string;
  tenant_id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  old_value: string | null;
  new_value: string | null;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  compliance_category: "DSGVO" | "ISO27001" | "SOC2" | "HIPAA" | "SOX" | "SECURITY" | "ACCESS";
  risk_score: number;
  ip_address: string;
  user_agent: string;
  request_method: string;
  request_url: string;
  response_status: number;
  execution_time_ms: number;
  geolocation: string | null;
  device_fingerprint: string | null;
  correlation_id: string | null;
  created_at: string;
}

interface FilterState {
  user_id: string;
  action: string;
  severity: string;
  compliance_category: string;
  start_date: string;
  end_date: string;
  search: string;
  resource_type: string;
}

export default function AuditLogsPage() {
  const router = useRouter();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<"logs" | "analytics" | "export" | "iso27001">("logs");
  const [hasAccess, setHasAccess] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });

  const [filters, setFilters] = useState<FilterState>({
    user_id: "",
    action: "",
    severity: "",
    compliance_category: "",
    start_date: "",
    end_date: "",
    search: "",
    resource_type: "",
  });

  // =====================================================
  // AUTHENTIFIZIERUNG
  // =====================================================

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await fetch("/api/auth/admin/me", {
          credentials: "include",
        });

        if (!response.ok) {
          router.push(`/admin/login?redirect=${encodeURIComponent("/admin/audit-logs")}`);
          return;
        }

        const data = await response.json();
        if (data.success && data.data?.roles) {
          const roles = data.data.roles;
          if (roles.includes("Owner") || roles.includes("Admin") || roles.includes("admin") || roles.includes("Super Admin")) {
            setHasAccess(true);
          } else {
            router.push("/admin");
            return;
          }
        } else {
          router.push(`/admin/login?redirect=${encodeURIComponent("/admin/audit-logs")}`);
          return;
        }
      } catch (error) {
        console.error("Fehler bei Zugriffsprüfung:", error);
        router.push(`/admin/login?redirect=${encodeURIComponent("/admin/audit-logs")}`);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  // =====================================================
  // LIFECYCLE & DATA LOADING
  // =====================================================

  useEffect(() => {
    if (hasAccess) {
      loadAuditLogs();
    }
  }, [filters, pagination.page, hasAccess]);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      queryParams.append("page", pagination.page.toString());
      queryParams.append("limit", pagination.limit.toString());

      const response = await fetch(`/api/admin/audit-logs?${queryParams}`, {
        credentials: "include", // Wichtig: Cookies mit senden
      });
      const data = await response.json();

      if (data.success) {
        setAuditLogs(data.data.logs);
        setPagination(data.data.pagination);
      } else {
        setError(data.message || "Fehler beim Laden der Audit-Logs");
      }
    } catch (err) {
      // Fehler wird geloggt (in Produktion würde logger.error() verwendet)
      setError("Fehler beim Laden der Audit-Logs");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FILTER & SEARCH FUNCTIONS
  // =====================================================

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const clearFilters = () => {
    setFilters({
      user_id: "",
      action: "",
      severity: "",
      compliance_category: "",
      start_date: "",
      end_date: "",
      search: "",
      resource_type: "",
    });
  };

  // =====================================================
  // EXPORT FUNCTIONS
  // =====================================================

  const handleExport = async (format: "CSV" | "JSON" | "XML" | "PDF") => {
    try {
      const response = await fetch("/api/admin/audit-logs/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          export_type: format,
          filter_criteria: filters,
          export_name: `audit_logs_${new Date().toISOString().split("T")[0]}`,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `audit_logs_${new Date().toISOString().split("T")[0]}.${format.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError("Fehler beim Exportieren der Audit-Logs");
      }
    } catch (err) {
      // Fehler wird geloggt (in Produktion würde logger.error() verwendet)
      setError("Fehler beim Exportieren der Audit-Logs");
    }
  };

  // =====================================================
  // UI HELPER FUNCTIONS
  // =====================================================

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return <FaExclamationTriangle className="text-red-500" />;
      case "HIGH":
        return <FaExclamationTriangle className="text-orange-500" />;
      case "MEDIUM":
        return <FaInfoCircle className="text-yellow-500" />;
      case "LOW":
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-100 text-red-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getComplianceColor = (category: string) => {
    switch (category) {
      case "DSGVO":
        return "bg-blue-100 text-blue-800";
      case "ISO27001":
        return "bg-purple-100 text-purple-800";
      case "SOC2":
        return "bg-indigo-100 text-indigo-800";
      case "SECURITY":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: "#050509" }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#c99700" }}></div>
          <p className="mt-4 text-sm" style={{ color: "#b3b3b3" }}>Lade Audit-Logs...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null; // Redirect handled by useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <FaShieldAlt className="mr-3 text-blue-600 dark:text-blue-400" />
                Audit-Logs
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Enterprise++ Audit-System für Compliance & Sicherheit
              </p>
            </div>
            {activeTab === "logs" && (
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <FaFilter className="mr-2" />
                  Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Tab-Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("logs")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "logs"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Logs
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "analytics"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("export")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "export"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Export
            </button>
            <button
              onClick={() => setActiveTab("iso27001")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "iso27001"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              ISO 27001
            </button>
          </nav>
        </div>

        {/* Tab-Content */}
        {activeTab === "logs" && (
          <>
            {/* Erweiterte Filter-Komponente */}
            {showFilters && (
              <div className="mb-6">
                <AuditLogFilters
                  filters={filters}
                  onFiltersChange={(newFilters) => {
                    setFilters(newFilters);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  onReset={clearFilters}
                />
              </div>
            )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
            <div className="flex">
              <FaExclamationTriangle className="h-5 w-5 text-red-400 dark:text-red-300" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Fehler</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && activeTab === "logs" && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        )}

        {/* Audit Logs Table */}
        {!loading && activeTab === "logs" && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Zeit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Benutzer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Aktion
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Schweregrad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Compliance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      IP-Adresse
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(log.created_at).toLocaleString("de-DE")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                              <FaUser className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {log.first_name} {log.last_name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{log.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{log.action}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{log.resource_type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}
                        >
                          {getSeverityIcon(log.severity)}
                          <span className="ml-1">{log.severity}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplianceColor(log.compliance_category)}`}
                        >
                          {log.compliance_category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {log.ip_address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedLog(log);
                            setShowDetails(true);
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                        >
                          <FaEye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: Math.max(1, prev.page - 1),
                      }))
                    }
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    Vorherige
                  </button>
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: Math.min(prev.pages, prev.page + 1),
                      }))
                    }
                    disabled={pagination.page === pagination.pages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    Nächste
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Zeige{" "}
                      <span className="font-medium">
                        {(pagination.page - 1) * pagination.limit + 1}
                      </span>{" "}
                      bis{" "}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span>{" "}
                      von <span className="font-medium">{pagination.total}</span> Ergebnissen
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            page: Math.max(1, prev.page - 1),
                          }))
                        }
                        disabled={pagination.page === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                      >
                        Vorherige
                      </button>
                      <button
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            page: Math.min(prev.pages, prev.page + 1),
                          }))
                        }
                        disabled={pagination.page === pagination.pages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                      >
                        Nächste
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

          </>
        )}

        {activeTab === "analytics" && <AuditLogAnalytics />}

        {activeTab === "export" && (
          <AuditLogExport
            filters={filters as unknown as Record<string, string>}
            onExportComplete={() => {
              // Optional: Nach Export Aktion
            }}
          />
        )}

        {activeTab === "iso27001" && <ISO27001Reports />}

        {/* Details Modal */}
        {showDetails && selectedLog && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-75 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border border-gray-300 dark:border-gray-700 w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Audit-Log Details</h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <FaTimes className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ID</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedLog.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Zeit</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {new Date(selectedLog.created_at).toLocaleString("de-DE")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Benutzer</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {selectedLog.first_name} {selectedLog.last_name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedLog.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Session ID</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                        {selectedLog.session_id}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aktion</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedLog.action}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedLog.resource_type}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Schweregrad</label>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(selectedLog.severity)}`}
                      >
                        {getSeverityIcon(selectedLog.severity)}
                        <span className="ml-1">{selectedLog.severity}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">IP-Adresse</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                        {selectedLog.ip_address}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Risiko-Score
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedLog.risk_score}/100</p>
                    </div>
                  </div>

                  {selectedLog.old_value && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Vorheriger Wert
                      </label>
                      <pre className="mt-1 text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-3 rounded-md overflow-x-auto">
                        {JSON.stringify(JSON.parse(selectedLog.old_value), null, 2)}
                      </pre>
                    </div>
                  )}

                  {selectedLog.new_value && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Neuer Wert</label>
                      <pre className="mt-1 text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-3 rounded-md overflow-x-auto">
                        {JSON.stringify(JSON.parse(selectedLog.new_value), null, 2)}
                      </pre>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">User Agent</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white break-all">{selectedLog.user_agent}</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                  >
                    Schließen
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
