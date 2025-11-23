"use client";

import {
  FaDownload,
  FaFileCode,
  FaHistory,
  FaListAlt,
  FaStickyNote,
  FaTimes,
} from "react-icons/fa";

interface Document {
  id: number;
  title: string;
  content: string;
  category: "system" | "howto" | "changelog" | "internal";
  created_at: string;
  updated_at: string;
}

interface DocumentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  userRole?: "admin" | "editor" | "viewer";
}

const categoryIcons = {
  system: FaFileCode,
  howto: FaListAlt,
  changelog: FaHistory,
  internal: FaStickyNote,
};

const categoryLabels = {
  system: "System-Dokumentation",
  howto: "How-To Anleitungen",
  changelog: "Change-Log",
  internal: "Interne Hinweise",
};

const categoryColors = {
  system: "bg-blue-100 text-blue-800",
  howto: "bg-green-100 text-green-800",
  changelog: "bg-purple-100 text-purple-800",
  internal: "bg-yellow-100 text-yellow-800",
};

export default function DocumentViewModal({
  isOpen,
  onClose,
  document,
  userRole = "admin",
}: DocumentViewModalProps) {
  if (!isOpen || !document) return null;

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportToPDF = () => {
    const element = document.createElement("div");
    element.innerHTML = `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #1f2937; font-size: 28px; margin: 0 0 10px 0;">${document.title}</h1>
                    <div style="display: inline-block; background: ${document.category === "system" ? "#dbeafe" : document.category === "howto" ? "#dcfce7" : document.category === "changelog" ? "#f3e8ff" : "#fef3c7"}; color: ${document.category === "system" ? "#1e40af" : document.category === "howto" ? "#166534" : document.category === "changelog" ? "#7c3aed" : "#92400e"}; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">
                        ${categoryLabels[document.category]}
                    </div>
                </div>
                <div style="white-space: pre-wrap; line-height: 1.6; color: #374151; font-size: 14px;">
                    ${document.content}
                </div>
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
                    <div>Erstellt: ${formatDate(document.created_at)}</div>
                    <div>Geändert: ${formatDate(document.updated_at)}</div>
                    <div style="margin-top: 10px; text-align: center;">
                        Generiert von Lopez IT Welt Enterprise++ System
                    </div>
                </div>
            </div>
        `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${document.title}</title>
                    <style>
                        @media print {
                            body { margin: 0; }
                            @page { margin: 1cm; }
                        }
                    </style>
                </head>
                <body>
                    ${element.innerHTML}
                </body>
                </html>
            `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">{document.title}</h2>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${categoryColors[document.category]}`}
            >
              {getCategoryIcon(document.category)}
              {categoryLabels[document.category]}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {document.content}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="text-sm text-gray-500">
            <div>Erstellt: {formatDate(document.created_at)}</div>
            <div>Geändert: {formatDate(document.updated_at)}</div>
          </div>
          <div className="flex items-center gap-3">
            {(userRole === "admin" || userRole === "editor" || userRole === "viewer") && (
              <button
                onClick={exportToPDF}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaDownload className="h-4 w-4 mr-2" />
                PDF Export
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
