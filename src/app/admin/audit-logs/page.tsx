"use client";

// =====================================================
// ENTERPRISE++ AUDIT-LOGS ADMIN INTERFACE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: IBM/SAP-Level Audit-Log Management UI
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { useEffect, useState } from "react";
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
}

export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);
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
  });

  // =====================================================
  // LIFECYCLE & DATA LOADING
  // =====================================================

  useEffect(() => {
    loadAuditLogs();
  }, [filters, pagination.page]);

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

      const response = await fetch(`/api/admin/audit-logs?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setAuditLogs(data.data.logs);
        setPagination(data.data.pagination);
      } else {
        setError(data.message || "Fehler beim Laden der Audit-Logs");
      }
    } catch (err) {
      console.error("Audit-Logs laden Fehler:", err);
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
      console.error("Export Fehler:", err);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FaShieldAlt className="mr-3 text-blue-600" />
                Audit-Logs
              </h1>
              <p className="text-gray-600 mt-1">
                Enterprise++ Audit-System für Compliance & Sicherheit
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FaFilter className="mr-2" />
                Filter
              </button>
              <div className="relative">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                  <FaDownload className="mr-2" />
                  Export
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                  <div className="py-1">
                    <button
                      onClick={() => handleExport("CSV")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      CSV Export
                    </button>
                    <button
                      onClick={() => handleExport("JSON")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      JSON Export
                    </button>
                    <button
                      onClick={() => handleExport("XML")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      XML Export
                    </button>
                    <button
                      onClick={() => handleExport("PDF")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      PDF Export
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Benutzer</label>
                <input
                  type="text"
                  value={filters.user_id}
                  onChange={(e) => handleFilterChange("user_id", e.target.value)}
                  placeholder="User ID oder E-Mail"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aktion</label>
                <input
                  type="text"
                  value={filters.action}
                  onChange={(e) => handleFilterChange("action", e.target.value)}
                  placeholder="z.B. USER_LOGIN"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schweregrad</label>
                <select
                  value={filters.severity}
                  onChange={(e) => handleFilterChange("severity", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Alle</option>
                  <option value="LOW">Niedrig</option>
                  <option value="MEDIUM">Mittel</option>
                  <option value="HIGH">Hoch</option>
                  <option value="CRITICAL">Kritisch</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Compliance</label>
                <select
                  value={filters.compliance_category}
                  onChange={(e) => handleFilterChange("compliance_category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Alle</option>
                  <option value="DSGVO">DSGVO</option>
                  <option value="ISO27001">ISO27001</option>
                  <option value="SOC2">SOC2</option>
                  <option value="SECURITY">Security</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Von Datum</label>
                <input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) => handleFilterChange("start_date", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bis Datum</label>
                <input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) => handleFilterChange("end_date", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Suche</label>
                <div className="relative">
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    placeholder="In allen Feldern suchen..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Filter zurücksetzen
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Filter schließen
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <FaExclamationTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Fehler</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Audit Logs Table */}
        {!loading && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Zeit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Benutzer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aktion
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schweregrad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Compliance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP-Adresse
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.created_at).toLocaleString("de-DE")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <FaUser className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {log.first_name} {log.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{log.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{log.action}</div>
                        <div className="text-sm text-gray-500">{log.resource_type}</div>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.ip_address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedLog(log);
                            setShowDetails(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-3"
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
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: Math.max(1, prev.page - 1),
                      }))
                    }
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
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
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Nächste
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
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
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
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
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
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

        {/* Details Modal */}
        {showDetails && selectedLog && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Audit-Log Details</h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ID</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedLog.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Zeit</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedLog.created_at).toLocaleString("de-DE")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Benutzer</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedLog.first_name} {selectedLog.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{selectedLog.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Session ID</label>
                      <p className="mt-1 text-sm text-gray-900 font-mono">
                        {selectedLog.session_id}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Aktion</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedLog.action}</p>
                      <p className="text-sm text-gray-500">{selectedLog.resource_type}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Schweregrad</label>
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
                      <label className="block text-sm font-medium text-gray-700">IP-Adresse</label>
                      <p className="mt-1 text-sm text-gray-900 font-mono">
                        {selectedLog.ip_address}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Risiko-Score
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{selectedLog.risk_score}/100</p>
                    </div>
                  </div>

                  {selectedLog.old_value && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Vorheriger Wert
                      </label>
                      <pre className="mt-1 text-sm text-gray-900 bg-gray-100 p-3 rounded-md overflow-x-auto">
                        {JSON.stringify(JSON.parse(selectedLog.old_value), null, 2)}
                      </pre>
                    </div>
                  )}

                  {selectedLog.new_value && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Neuer Wert</label>
                      <pre className="mt-1 text-sm text-gray-900 bg-gray-100 p-3 rounded-md overflow-x-auto">
                        {JSON.stringify(JSON.parse(selectedLog.new_value), null, 2)}
                      </pre>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">User Agent</label>
                    <p className="mt-1 text-sm text-gray-900 break-all">{selectedLog.user_agent}</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
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
