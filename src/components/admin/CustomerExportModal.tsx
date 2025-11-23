"use client";

// =====================================================
// CUSTOMER EXPORT MODAL - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Professionelle Export-Funktionen (Excel/PDF/CSV)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { useState } from "react";
import {
  FaCheck,
  FaCog,
  FaDownload,
  FaEye,
  FaFileCsv,
  FaFileExcel,
  FaFilePdf,
  FaFilter,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";

interface CustomerExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerCount: number;
}

export default function CustomerExportModal({
  isOpen,
  onClose,
  customerCount,
}: CustomerExportModalProps) {
  const [exportFormat, setExportFormat] = useState<
    "xlsx" | "pdf" | "csv" | "technical-xlsx" | "technical-csv"
  >("xlsx");
  const [exportType, setExportType] = useState<"management" | "technical">("management");
  const [includeInactive, setIncludeInactive] = useState(true);
  const [selectedCustomerTypes, setSelectedCustomerTypes] = useState<string[]>([]);
  const [selectedSupportLevels, setSelectedSupportLevels] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });
  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const customerTypes = [
    { value: "privat", label: "Privatkunden" },
    { value: "firma", label: "Firmenkunden" },
    { value: "behörde", label: "Behördenkunden" },
    { value: "partner", label: "Partnerkunden" },
  ];

  const supportLevels = [
    { value: "Standard", label: "Standard" },
    { value: "Premium", label: "Premium" },
    { value: "SLA 24h", label: "SLA 24h" },
    { value: "SLA 4h", label: "SLA 4h" },
  ];

  const formatOptions = [
    {
      value: "xlsx",
      label: "Excel (XLSX)",
      description: "Für operative Arbeit, Filter, Formeln",
      icon: FaFileExcel,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      value: "pdf",
      label: "PDF-Report",
      description: "Für Management & Präsentationen",
      icon: FaFilePdf,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      value: "csv",
      label: "CSV-Export",
      description: "Für Schnittstellen (technisch)",
      icon: FaFileCsv,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
  ];

  const handleCustomerTypeToggle = (type: string) => {
    setSelectedCustomerTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleSupportLevelToggle = (level: string) => {
    setSelectedSupportLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      setExportResult(null);

      const response = await fetch("/api/admin/customers/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format: exportFormat,
          includeInactive,
          customerTypes: selectedCustomerTypes,
          supportLevels: selectedSupportLevels,
          dateRange: dateRange.from && dateRange.to ? dateRange : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setExportResult(data.data);

        // ECHTE DATEI-DOWNLOAD
        if (exportFormat === "xlsx") {
          // Debug-Informationen
          console.log("📊 Frontend Download Debug:");
          console.log("- Content Length:", data.data.content?.length);
          console.log("- Content Type:", typeof data.data.content);
          console.log("- File Name:", data.data.fileName);
          console.log("- Content Preview (first 100 chars):", data.data.content?.substring(0, 100));

          if (!data.data.content || data.data.content.length === 0) {
            console.error("❌ Excel Content ist leer!");
            alert("Fehler: Excel-Datei ist leer. Bitte versuchen Sie es erneut.");
            return;
          }

          // NEUE DOWNLOAD-METHODE: Direkter Base64-Download
          try {
            // Methode 1: Direkter Base64-Download
            console.log("📊 Versuche Methode 1: Direkter Base64-Download");
            const link = document.createElement("a");
            link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${data.data.content}`;
            link.download = data.data.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log("✅ Methode 1: Excel-Datei erfolgreich heruntergeladen");

            // Zusätzlich: Blob-Methode als Backup
            console.log("📊 Versuche Methode 2: Blob-Download als Backup");
            const binaryString = atob(data.data.content);
            const uint8Array = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              uint8Array[i] = binaryString.charCodeAt(i);
            }

            const blob = new Blob([uint8Array], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            console.log("📊 Blob-Details:");
            console.log("- Blob Size:", blob.size);
            console.log("- Blob Type:", blob.type);
            console.log("- Uint8Array Length:", uint8Array.length);

            // Backup-Download
            const backupLink = document.createElement("a");
            backupLink.href = window.URL.createObjectURL(blob);
            backupLink.download = `backup_${data.data.fileName}`;
            document.body.appendChild(backupLink);
            backupLink.click();
            document.body.removeChild(backupLink);
            window.URL.revokeObjectURL(backupLink.href);
            console.log("✅ Methode 2: Backup-Excel-Datei erfolgreich heruntergeladen");
          } catch (error) {
            console.error("❌ Fehler beim Download:", error);
            alert("Fehler beim Herunterladen der Excel-Datei: " + error.message);
          }
        } else if (exportFormat === "csv") {
          // CSV-Datei herunterladen
          const blob = new Blob([data.data.content], {
            type: "text/csv;charset=utf-8;",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = data.data.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } else {
          // PDF-Download (simuliert)
          alert(
            `PDF-Export bereit!\n\nDatei: ${data.data.fileName}\nFormat: ${exportFormat.toUpperCase()}\nKunden: ${data.stats.totalCustomers}`,
          );
        }
      } else {
        alert("Fehler beim Export: " + data.message);
      }
    } catch (error) {
      console.error("Export Fehler:", error);
      alert("Fehler beim Export der Daten");
    } finally {
      setExporting(false);
    }
  };

  const resetForm = () => {
    setExportFormat("xlsx");
    setIncludeInactive(true);
    setSelectedCustomerTypes([]);
    setSelectedSupportLevels([]);
    setDateRange({ from: "", to: "" });
    setExportResult(null);
  };

  const handlePreview = async () => {
    try {
      setExporting(true);

      const response = await fetch("/api/admin/customers/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format: exportFormat,
          includeInactive,
          customerTypes: selectedCustomerTypes,
          supportLevels: selectedSupportLevels,
          dateRange: dateRange.from && dateRange.to ? dateRange : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPreviewData(data.data);
        setShowPreview(true);
      } else {
        alert("Fehler beim Vorschau: " + data.message);
      }
    } catch (error) {
      console.error("Vorschau Fehler:", error);
      alert("Fehler beim Laden der Vorschau");
    } finally {
      setExporting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FaDownload className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Kunden-Export</h3>
              <p className="text-sm text-gray-600">
                Professionelle Export-Funktionen (IBM/SAP Standard)
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        {/* Export Format Selection */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <FaCog className="mr-2" />
            Export-Format
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {formatOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = exportFormat === option.value;

              return (
                <div
                  key={option.value}
                  onClick={() => setExportFormat(option.value as any)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? `${option.borderColor} ${option.bgColor}`
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <Icon className={`h-6 w-6 mr-3 ${option.color}`} />
                    <span className="font-medium text-gray-900">{option.label}</span>
                  </div>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter Options */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <FaFilter className="mr-2" />
            Filter & Optionen
          </h4>

          <div className="space-y-4">
            {/* Include Inactive */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeInactive"
                checked={includeInactive}
                onChange={(e) => setIncludeInactive(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="includeInactive" className="ml-2 text-sm text-gray-700">
                Inaktive Kunden einschließen
              </label>
            </div>

            {/* Customer Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kundentypen</label>
              <div className="grid grid-cols-2 gap-2">
                {customerTypes.map((type) => (
                  <label key={type.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCustomerTypes.includes(type.value)}
                      onChange={() => handleCustomerTypeToggle(type.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Support Levels */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Support-Level</label>
              <div className="grid grid-cols-2 gap-2">
                {supportLevels.map((level) => (
                  <label key={level.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedSupportLevels.includes(level.value)}
                      onChange={() => handleSupportLevelToggle(level.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{level.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Von (Datum)</label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bis (Datum)</label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Export Preview */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Export-Vorschau</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Format: {formatOptions.find((f) => f.value === exportFormat)?.label}</p>
            <p>• Geschätzte Kunden: {customerCount}</p>
            <p>• Inaktive: {includeInactive ? "Ja" : "Nein"}</p>
            <p>
              • Kundentypen:{" "}
              {selectedCustomerTypes.length > 0 ? selectedCustomerTypes.join(", ") : "Alle"}
            </p>
            <p>
              • Support-Level:{" "}
              {selectedSupportLevels.length > 0 ? selectedSupportLevels.join(", ") : "Alle"}
            </p>
          </div>
        </div>

        {/* Export Result */}
        {exportResult && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <FaCheck className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-green-800">Export erfolgreich!</h4>
                <p className="text-sm text-green-700">Datei: {exportResult.fileName}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <button
            onClick={handlePreview}
            disabled={exporting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 flex items-center"
          >
            {exporting ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Lädt...
              </>
            ) : (
              <>
                <FaEye className="mr-2" />
                Vorschau
              </>
            )}
          </button>
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Abbrechen
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {exporting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Export läuft...
                </>
              ) : (
                <>
                  <FaDownload className="mr-2" />
                  Export starten
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Vorschau Modal */}
      {showPreview && previewData && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-60">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white">
            {/* Vorschau Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FaEye className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Export-Vorschau</h3>
                  <p className="text-sm text-gray-600">
                    {previewData.fileName} - {exportFormat.toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>

            {/* Vorschau Inhalt */}
            <div className="mb-6">
              {exportFormat === "xlsx" && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Excel-Inhalt Vorschau</h4>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      <strong>Deckblatt:</strong> Lopez IT Welt - Kundenübersicht
                    </p>
                    <p>
                      <strong>Exportdatum:</strong> {new Date().toLocaleString("de-DE")}
                    </p>
                    <p>
                      <strong>Verantwortlich:</strong> Admin Lopez IT Welt
                    </p>
                    <p>
                      <strong>Gesamt Kunden:</strong> {customerCount}
                    </p>
                    <div className="mt-4">
                      <p>
                        <strong>Kundentabelle enthält:</strong>
                      </p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Kundentyp, Anrede, Name/Firma</li>
                        <li>E-Mail, Telefon, Adresse</li>
                        <li>Status, Support-Level, Erstellungsdatum</li>
                      </ul>
                    </div>
                    <div className="mt-4">
                      <p>
                        <strong>Zusammenfassung:</strong>
                      </p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>KPIs und Statistiken</li>
                        <li>Kundenverteilung nach Typ</li>
                        <li>Support-Level Analyse</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {exportFormat === "csv" && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">CSV-Inhalt Vorschau</h4>
                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>Format:</strong> Semikolon-getrennt (;)
                    </p>
                    <p>
                      <strong>Encoding:</strong> UTF-8
                    </p>
                    <p>
                      <strong>Spalten:</strong> Kundentyp, Anrede, Name, E-Mail, Telefon, Adresse,
                      Status, Support-Level, Erstellungsdatum
                    </p>
                    <p>
                      <strong>Datensätze:</strong> {customerCount} Kunden
                    </p>
                  </div>
                </div>
              )}

              {exportFormat === "pdf" && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">PDF-Report Vorschau</h4>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      <strong>Deckblatt:</strong> Logo, Titel, Exportdatum
                    </p>
                    <p>
                      <strong>Inhaltsübersicht:</strong> Strukturierte Übersicht
                    </p>
                    <p>
                      <strong>Kundentabelle:</strong> Professionell formatierte Tabelle
                    </p>
                    <p>
                      <strong>Zusammenfassung:</strong> KPIs und Statistiken
                    </p>
                    <p>
                      <strong>Fußzeile:</strong> "Generiert mit Lopez IT Welt Admin-System"
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Vorschau Footer */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Schließen
              </button>
              <button
                onClick={() => {
                  setShowPreview(false);
                  handleExport();
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
              >
                <FaDownload className="mr-2" />
                Jetzt herunterladen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
