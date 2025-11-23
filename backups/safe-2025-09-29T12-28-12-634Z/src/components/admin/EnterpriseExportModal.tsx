"use client";

// =====================================================
// ENTERPRISE EXPORT MODAL - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Zwei-Ebenen-Export-System (wie IBM/SAP/Siemens)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { useState } from "react";
import {
  FaBuilding,
  FaCheck,
  FaCogs,
  FaDownload,
  FaFileAlt,
  FaFileCsv,
  FaFileExcel,
  FaFilePdf,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";

interface EnterpriseExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerCount: number;
}

export default function EnterpriseExportModal({
  isOpen,
  onClose,
  customerCount,
}: EnterpriseExportModalProps) {
  const [exportType, setExportType] = useState<"management" | "technical">("management");
  const [exportFormat, setExportFormat] = useState<"xlsx" | "pdf" | "csv">("xlsx");
  const [includeInactive, setIncludeInactive] = useState(true);
  const [selectedCustomerTypes, setSelectedCustomerTypes] = useState<string[]>([]);
  const [selectedSupportLevels, setSelectedSupportLevels] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });
  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState<any>(null);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);

  const customerTypes = [
    { value: "privat", label: "Privatkunden" },
    { value: "firma", label: "Firmenkunden" },
    { value: "behörde", label: "Behörden" },
    { value: "partner", label: "Partner" },
  ];

  const supportLevels = [
    { value: "Basic", label: "Basic" },
    { value: "Standard", label: "Standard" },
    { value: "Premium", label: "Premium" },
    { value: "Enterprise", label: "Enterprise" },
  ];

  const handleExport = async () => {
    setExporting(true);
    setExportResult(null);

    try {
      // Format basierend auf Export-Typ bestimmen
      let format = exportFormat;
      if (exportType === "technical") {
        format = exportFormat === "xlsx" ? "technical-xlsx" : "technical-csv";
      }

      const response = await fetch("/api/admin/customers/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          format: format,
          includeInactive,
          customerTypes: selectedCustomerTypes,
          supportLevels: selectedSupportLevels,
          dateRange,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setExportResult(data);
        downloadFile(data);
      } else {
        console.error("Export failed:", data.message);
        alert("Export fehlgeschlagen: " + data.message);
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Fehler beim Export: " + error.message);
    } finally {
      setExporting(false);
    }
  };

  const downloadFile = (data: any) => {
    if (exportFormat === "xlsx") {
      // Excel-Datei herunterladen
      const binaryString = atob(data.content);
      const uint8Array = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([uint8Array], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else if (exportFormat === "csv") {
      // CSV-Datei herunterladen
      const blob = new Blob([data.content], {
        type: "text/csv;charset=utf-8;",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else if (exportFormat === "pdf") {
      // PDF-Datei herunterladen
      const binaryString = atob(data.content);
      const uint8Array = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([uint8Array], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const handleCustomerTypeChange = (value: string) => {
    setSelectedCustomerTypes((prev) =>
      prev.includes(value) ? prev.filter((type) => type !== value) : [...prev, value],
    );
  };

  const handleSupportLevelChange = (value: string) => {
    setSelectedSupportLevels((prev) =>
      prev.includes(value) ? prev.filter((level) => level !== value) : [...prev, value],
    );
  };

  const handleDownloadTemplate = async (templateType: "management" | "technical") => {
    setDownloadingTemplate(true);

    try {
      const response = await fetch(`/api/admin/templates/export?type=${templateType}`);
      const data = await response.json();

      if (data.success) {
        // Excel-Vorlage herunterladen
        const binaryString = atob(data.data.content);
        const uint8Array = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          uint8Array[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([uint8Array], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = data.data.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log("✅ Vorlage erfolgreich heruntergeladen:", data.data.fileName);
      } else {
        alert("Fehler beim Herunterladen der Vorlage: " + data.message);
      }
    } catch (error) {
      console.error("Vorlage-Download Fehler:", error);
      alert("Fehler beim Herunterladen der Vorlage: " + error.message);
    } finally {
      setDownloadingTemplate(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Enterprise Export System</h2>
            <p className="text-gray-600 mt-1">Zwei-Ebenen-Export wie bei IBM, SAP, Siemens</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Export-Typ Auswahl */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export-Typ wählen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Management-Report */}
              <div
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  exportType === "management"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setExportType("management")}
              >
                <div className="flex items-center mb-3">
                  <FaBuilding className="text-blue-600 mr-3" size={24} />
                  <h4 className="text-lg font-semibold text-gray-900">Management-Report</h4>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Professioneller Report mit Logo, CI-Farben und Formatierung
                </p>
                <div className="text-xs text-gray-500">
                  ✅ Logo & CI-Farben
                  <br />
                  ✅ Professionelle Formatierung
                  <br />
                  ✅ Management-optimiert
                  <br />✅ PDF-ready
                </div>
              </div>

              {/* Technischer Export */}
              <div
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  exportType === "technical"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setExportType("technical")}
              >
                <div className="flex items-center mb-3">
                  <FaCogs className="text-green-600 mr-3" size={24} />
                  <h4 className="text-lg font-semibold text-gray-900">Technischer Export</h4>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Rohdaten-Export für Weiterverarbeitung und Integration
                </p>
                <div className="text-xs text-gray-500">
                  ✅ Vollständige Rohdaten
                  <br />
                  ✅ Technische IDs
                  <br />
                  ✅ Weiterverarbeitung
                  <br />✅ Integration-ready
                </div>
              </div>
            </div>
          </div>

          {/* Format-Auswahl */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Format wählen</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setExportFormat("xlsx")}
                className={`flex items-center px-4 py-2 rounded-lg border transition-all ${
                  exportFormat === "xlsx"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <FaFileExcel className="mr-2" />
                Excel (XLSX)
              </button>
              <button
                onClick={() => setExportFormat("csv")}
                className={`flex items-center px-4 py-2 rounded-lg border transition-all ${
                  exportFormat === "csv"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <FaFileCsv className="mr-2" />
                CSV
              </button>
              {exportType === "management" && (
                <button
                  onClick={() => setExportFormat("pdf")}
                  className={`flex items-center px-4 py-2 rounded-lg border transition-all ${
                    exportFormat === "pdf"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <FaFilePdf className="mr-2" />
                  PDF
                </button>
              )}
            </div>
          </div>

          {/* Filter-Optionen */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter-Optionen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inaktive Kunden */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeInactive}
                    onChange={(e) => setIncludeInactive(e.target.checked)}
                    className="mr-2"
                  />
                  Inaktive Kunden einschließen
                </label>
              </div>

              {/* Kundentypen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kundentypen</label>
                <div className="space-y-2">
                  {customerTypes.map((type) => (
                    <label key={type.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCustomerTypes.includes(type.value)}
                        onChange={() => handleCustomerTypeChange(type.value)}
                        className="mr-2"
                      />
                      {type.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Support-Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Support-Level
                </label>
                <div className="space-y-2">
                  {supportLevels.map((level) => (
                    <label key={level.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSupportLevels.includes(level.value)}
                        onChange={() => handleSupportLevelChange(level.value)}
                        className="mr-2"
                      />
                      {level.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Datumsbereich */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Datumsbereich
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Von"
                  />
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Bis"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vorlagen-Download */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📋 Excel-Vorlagen herunterladen
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Laden Sie die Excel-Vorlagen herunter, um sie als Basis für Ihre eigenen Reports zu
              verwenden.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleDownloadTemplate("management")}
                disabled={downloadingTemplate}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {downloadingTemplate ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Lade herunter...
                  </>
                ) : (
                  <>
                    <FaFileAlt className="mr-2" />
                    Management-Vorlage
                  </>
                )}
              </button>
              <button
                onClick={() => handleDownloadTemplate("technical")}
                disabled={downloadingTemplate}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {downloadingTemplate ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Lade herunter...
                  </>
                ) : (
                  <>
                    <FaFileAlt className="mr-2" />
                    Technische Vorlage
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Export-Button */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="text-sm text-gray-600">{customerCount} Kunden verfügbar</div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {exporting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Exportiere...
                  </>
                ) : (
                  <>
                    <FaDownload className="mr-2" />
                    Jetzt exportieren
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Export-Ergebnis */}
          {exportResult && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <FaCheck className="text-green-600 mr-2" />
                <span className="text-green-800 font-medium">Export erfolgreich!</span>
              </div>
              <p className="text-green-700 text-sm mt-1">{exportResult.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
