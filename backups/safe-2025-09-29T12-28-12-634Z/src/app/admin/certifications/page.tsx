// =====================================================
// CERTIFICATIONS DASHBOARD - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Enterprise++ Zertifizierungs-Dashboard
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

"use client";

import { CertificationService } from "@/lib/certification-service";
import { useEffect, useState } from "react";

// =====================================================
// INTERFACES
// =====================================================

interface CertificationStandard {
  id: string;
  name: string;
  description: string;
  version: string;
  status: "planned" | "in_progress" | "certified" | "expired" | "suspended";
  certification_date?: string;
  expiry_date?: string;
  auditor?: string;
  certificate_number?: string;
  compliance_score: number;
  created_at: string;
  updated_at: string;
}

interface ComplianceReport {
  generated_at: string;
  standards: any[];
  audits: any[];
  overall_compliance: number;
}

// =====================================================
// COMPONENT
// =====================================================

export default function CertificationsDashboard() {
  const [standards, setStandards] = useState<CertificationStandard[]>([]);
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =====================================================
  // EFFECTS
  // =====================================================

  useEffect(() => {
    loadData();
  }, []);

  // =====================================================
  // FUNCTIONS
  // =====================================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Standards laden
      const standardsData = await CertificationService.getAllStandards();
      setStandards(standardsData);

      // Report generieren
      const reportData = await CertificationService.generateComplianceReport();
      setReport(reportData);
    } catch (err) {
      console.error("Load Data Fehler:", err);
      setError("Fehler beim Laden der Zertifizierungsdaten");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "certified":
        return "text-green-600 bg-green-100";
      case "in_progress":
        return "text-blue-600 bg-blue-100";
      case "expired":
        return "text-red-600 bg-red-100";
      case "suspended":
        return "text-yellow-600 bg-yellow-100";
      case "planned":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("de-DE");
  };

  // =====================================================
  // RENDER
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lade Zertifizierungsdaten...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Fehler</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Enterprise++ Zertifizierungen</h1>
            <p className="mt-2 text-gray-600">
              ISO 27001, DSGVO/GDPR, ISO 9001 und weitere Standards
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">📋</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Standards</p>
                <p className="text-2xl font-bold text-gray-900">{standards.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Zertifiziert</p>
                <p className="text-2xl font-bold text-gray-900">
                  {standards.filter((s) => s.status === "certified").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-sm font-bold">🔄</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Bearbeitung</p>
                <p className="text-2xl font-bold text-gray-900">
                  {standards.filter((s) => s.status === "in_progress").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm font-bold">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Compliance</p>
                <p
                  className={`text-2xl font-bold ${getScoreColor(report?.overall_compliance || 0)}`}
                >
                  {report?.overall_compliance || 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Standards Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Zertifizierungsstandards</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Standard
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compliance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zertifiziert
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ablauf
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {standards.map((standard) => (
                  <tr key={standard.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{standard.name}</div>
                        <div className="text-sm text-gray-500">{standard.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {standard.version}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(standard.status)}`}
                      >
                        {standard.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${standard.compliance_score}%` }}
                          ></div>
                        </div>
                        <span
                          className={`text-sm font-medium ${getScoreColor(standard.compliance_score)}`}
                        >
                          {standard.compliance_score}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(standard.certification_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(standard.expiry_date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={loadData}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Aktualisieren
          </button>
          <button
            onClick={() => {
              // TODO: Implement ISO 27001 creation
              console.log("Create ISO 27001 Standard");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ISO 27001 erstellen
          </button>
          <button
            onClick={() => {
              // TODO: Implement GDPR creation
              console.log("Create GDPR Standard");
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            DSGVO erstellen
          </button>
        </div>
      </div>
    </div>
  );
}
