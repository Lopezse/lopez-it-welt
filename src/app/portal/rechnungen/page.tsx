// =====================================================
// PORTAL - RECHNUNGEN
// =====================================================

"use client";

import React, { useState, useEffect } from "react";
import { 
  FaFileInvoice, FaSpinner, FaDownload, FaCheck, FaClock, 
  FaExclamationTriangle, FaTimes, FaEye, FaFilePdf
} from "react-icons/fa";

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Invoice {
  id: number;
  invoice_number: string;
  net_amount: number;
  tax_rate: number;
  tax_amount: number;
  gross_amount: number;
  invoice_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paid_at?: string;
  pdf_path?: string;
  project_name?: string;
  line_items: LineItem[];
}

const statusConfig = {
  draft: { label: "Entwurf", color: "text-slate-400", bg: "bg-slate-500/20", icon: FaClock },
  sent: { label: "Offen", color: "text-amber-400", bg: "bg-amber-500/20", icon: FaClock },
  paid: { label: "Bezahlt", color: "text-green-400", bg: "bg-green-500/20", icon: FaCheck },
  overdue: { label: "Überfällig", color: "text-red-400", bg: "bg-red-500/20", icon: FaExclamationTriangle },
  cancelled: { label: "Storniert", color: "text-slate-400", bg: "bg-slate-500/20", icon: FaTimes }
};

export default function RechnungenPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [downloading, setDownloading] = useState<number | null>(null);

  useEffect(() => { loadInvoices(); }, []);

  // PDF-Download Funktion
  const downloadPdf = async (invoiceId: number, invoiceNumber: string) => {
    try {
      setDownloading(invoiceId);
      const response = await fetch(`/api/portal/rechnungen/${invoiceId}/download`);
      
      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Download fehlgeschlagen");
        return;
      }

      // PDF als Blob herunterladen
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Download Error:", error);
      alert("Download fehlgeschlagen");
    } finally {
      setDownloading(null);
    }
  };

  const loadInvoices = async () => {
    try {
      const res = await fetch("/api/portal/rechnungen");
      const data = await res.json();
      if (data.success) setInvoices(data.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);

  const formatDate = (date: string) => 
    new Date(date).toLocaleDateString('de-DE');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="text-3xl text-blue-400 animate-spin" />
      </div>
    );
  }

  // Stats berechnen
  const totalOpen = invoices.filter(i => ['sent', 'overdue'].includes(i.status))
    .reduce((sum, i) => sum + i.gross_amount, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.gross_amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Rechnungen</h1>
        <p className="text-slate-400">Übersicht Ihrer Rechnungen und Zahlungen</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <p className="text-slate-400 text-sm">Gesamt</p>
          <p className="text-2xl font-bold text-white">{invoices.length}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <p className="text-slate-400 text-sm">Offen</p>
          <p className="text-2xl font-bold text-amber-400">{formatCurrency(totalOpen)}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <p className="text-slate-400 text-sm">Bezahlt</p>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(totalPaid)}</p>
        </div>
      </div>

      {/* Rechnungsliste */}
      {invoices.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
          <FaFileInvoice className="text-5xl text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Keine Rechnungen</h3>
          <p className="text-slate-400">Sie haben noch keine Rechnungen erhalten</p>
        </div>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left px-4 py-3 text-sm text-slate-300">Rechnung</th>
                <th className="text-left px-4 py-3 text-sm text-slate-300 hidden md:table-cell">Projekt</th>
                <th className="text-left px-4 py-3 text-sm text-slate-300 hidden lg:table-cell">Datum</th>
                <th className="text-right px-4 py-3 text-sm text-slate-300">Betrag</th>
                <th className="text-center px-4 py-3 text-sm text-slate-300">Status</th>
                <th className="text-center px-4 py-3 text-sm text-slate-300">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {invoices.map((invoice) => {
                const status = statusConfig[invoice.status];
                const StatusIcon = status.icon;
                return (
                  <tr key={invoice.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-white font-medium">{invoice.invoice_number}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 hidden md:table-cell">
                      {invoice.project_name || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-400 hidden lg:table-cell">
                      {formatDate(invoice.invoice_date)}
                    </td>
                    <td className="px-4 py-3 text-right text-white font-medium">
                      {formatCurrency(invoice.gross_amount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${status.bg} ${status.color}`}>
                        <StatusIcon className="text-xs" /> {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelected(invoice)}
                          className="p-2 text-slate-400 hover:text-white transition-colors"
                          title="Details"
                        >
                          <FaEye />
                        </button>
                        {invoice.pdf_path && (
                          <button
                            onClick={() => downloadPdf(invoice.id, invoice.invoice_number)}
                            disabled={downloading === invoice.id}
                            className="p-2 text-slate-400 hover:text-red-400 disabled:opacity-50 transition-colors"
                            title="PDF herunterladen"
                          >
                            {downloading === invoice.id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaFilePdf />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">{selected.invoice_number}</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white">
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400">Rechnungsdatum</p>
                  <p className="text-white">{formatDate(selected.invoice_date)}</p>
                </div>
                <div>
                  <p className="text-slate-400">Fällig am</p>
                  <p className="text-white">{formatDate(selected.due_date)}</p>
                </div>
              </div>
              
              <div className="border-t border-slate-700 pt-4">
                <p className="text-slate-400 mb-2">Positionen</p>
                {selected.line_items?.map((item, i) => (
                  <div key={i} className="flex justify-between py-1">
                    <span className="text-white">{item.description}</span>
                    <span className="text-slate-300">{formatCurrency(item.total)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-slate-700 pt-4 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Netto</span>
                  <span className="text-white">{formatCurrency(selected.net_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">MwSt. ({selected.tax_rate}%)</span>
                  <span className="text-white">{formatCurrency(selected.tax_amount)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Gesamt</span>
                  <span className="text-blue-400">{formatCurrency(selected.gross_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

