"use client";
// =====================================================
// ENTERPRISE++ AI REPORTS PAGE
// =====================================================

import { useState, useEffect } from "react";
import { 
  FaFileAlt, 
  FaSpinner, 
  FaCalendarWeek, 
  FaCalendarAlt,
  FaChartPie,
  FaShieldAlt,
  FaCoins,
  FaPlus,
  FaDownload,
  FaEye,
  FaClock
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";

interface AIReport {
  id: number;
  report_type: string;
  title: string;
  content: string;
  summary: string;
  period_start: string;
  period_end: string;
  provider: string;
  tokens_used: number;
  cost_estimate: number;
  generated_at: string;
}

export default function AIReportsPage() {
  const [reports, setReports] = useState<AIReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<AIReport | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await fetch("/api/admin/ai/reports");
      const data = await response.json();
      
      if (data.success) {
        setReports(data.data);
      }
    } catch (err) {
      console.error("Fehler beim Laden der Reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type: string) => {
    try {
      setGenerating(type);
      
      const response = await fetch("/api/admin/ai/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await loadReports();
        alert(`${type} Report erfolgreich generiert!`);
      } else {
        alert(`Fehler: ${data.error}`);
      }
    } catch (err) {
      alert("Fehler bei der Report-Generierung");
    } finally {
      setGenerating(null);
    }
  };

  const reportTypes = [
    { 
      type: "weekly", 
      name: "Wochenbericht", 
      icon: FaCalendarWeek, 
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      description: "Zusammenfassung der letzten 7 Tage"
    },
    { 
      type: "monthly", 
      name: "Monatsbericht", 
      icon: FaCalendarAlt, 
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      description: "Zusammenfassung des letzten Monats"
    },
    { 
      type: "quarterly", 
      name: "Quartalsbericht", 
      icon: FaChartPie, 
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      description: "Zusammenfassung der letzten 3 Monate"
    },
    { 
      type: "security", 
      name: "Security Report", 
      icon: FaShieldAlt, 
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      description: "Sicherheitsstatus und Events"
    },
    { 
      type: "financial", 
      name: "Finanzbericht", 
      icon: FaCoins, 
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      description: "Umsatz und Rechnungsstatus"
    },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getReportTypeInfo = (type: string) => {
    return reportTypes.find(rt => rt.type === type) || reportTypes[0];
  };

  return (
    <div className="min-h-screen bg-[#050509] text-[#f4f4f4]">
      {/* Header */}
      <div className="border-b border-[#272a33] bg-[#111217] px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-[#ffd700] to-[#ff8c00] rounded-xl">
            <FaFileAlt className="h-8 w-8 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#f4f4f4]">
              AI Executive Reports
            </h1>
            <p className="text-[#b3b3b3]">
              Automatische Business-Reports und Executive Summaries
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Generate Report Buttons */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#f4f4f4] mb-4">
            Neuen Report generieren
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {reportTypes.map((rt) => (
              <button
                key={rt.type}
                onClick={() => generateReport(rt.type)}
                disabled={generating !== null}
                className={`p-4 ${rt.bgColor} border border-[#272a33] rounded-xl hover:border-[#ffd700]/50 transition-all text-left disabled:opacity-50`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <rt.icon className={`h-5 w-5 ${rt.color}`} />
                  <span className="font-medium text-[#f4f4f4]">{rt.name}</span>
                </div>
                <p className="text-xs text-[#b3b3b3]">{rt.description}</p>
                {generating === rt.type && (
                  <div className="mt-2 flex items-center gap-2 text-[#ffd700]">
                    <FaSpinner className="animate-spin h-4 w-4" />
                    <span className="text-xs">Generiere...</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Reports List and Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports List */}
          <div className="lg:col-span-1">
            <div className="bg-[#111217] border border-[#272a33] rounded-xl">
              <div className="p-4 border-b border-[#272a33]">
                <h3 className="font-semibold text-[#f4f4f4]">
                  Generierte Reports
                </h3>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <FaSpinner className="h-6 w-6 text-[#ffd700] animate-spin" />
                </div>
              ) : reports.length === 0 ? (
                <div className="p-8 text-center">
                  <FaFileAlt className="h-12 w-12 text-[#272a33] mx-auto mb-3" />
                  <p className="text-[#b3b3b3]">Noch keine Reports generiert</p>
                  <p className="text-sm text-[#666] mt-1">
                    Klicke oben auf einen Report-Typ
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#272a33] max-h-[600px] overflow-y-auto">
                  {reports.map((report) => {
                    const typeInfo = getReportTypeInfo(report.report_type);
                    return (
                      <button
                        key={report.id}
                        onClick={() => setSelectedReport(report)}
                        className={`w-full p-4 text-left hover:bg-[#1a1d24] transition-colors ${
                          selectedReport?.id === report.id ? "bg-[#1a1d24]" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 ${typeInfo.bgColor} rounded-lg`}>
                            <typeInfo.icon className={`h-4 w-4 ${typeInfo.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-[#f4f4f4] truncate">
                              {report.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-xs text-[#b3b3b3]">
                              <FaClock className="h-3 w-3" />
                              {formatDate(report.generated_at)}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Report Detail */}
          <div className="lg:col-span-2">
            <div className="bg-[#111217] border border-[#272a33] rounded-xl">
              {selectedReport ? (
                <>
                  <div className="p-4 border-b border-[#272a33] flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[#f4f4f4]">
                        {selectedReport.title}
                      </h3>
                      <p className="text-sm text-[#b3b3b3]">
                        Generiert: {formatDate(selectedReport.generated_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#b3b3b3] bg-[#272a33] px-2 py-1 rounded">
                        {selectedReport.tokens_used} Tokens
                      </span>
                      <button className="p-2 hover:bg-[#272a33] rounded-lg transition-colors">
                        <FaDownload className="h-4 w-4 text-[#b3b3b3]" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 max-h-[600px] overflow-y-auto">
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{selectedReport.content}</ReactMarkdown>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <FaEye className="h-12 w-12 text-[#272a33] mb-4" />
                  <p className="text-[#b3b3b3]">
                    Wähle einen Report aus der Liste
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}









