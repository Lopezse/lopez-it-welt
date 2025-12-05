/**
 * Invoice Detail View Component - Enterprise++ Standard
 * 
 * Detailansicht einer Rechnung
 */

"use client";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface Invoice {
  id: string | number;
  invoice_number: string;
  customer_id?: string;
  company_name?: string;
  vorname?: string;
  nachname?: string;
  customer_email?: string;
  project_id?: number;
  project_name?: string;
  project_code?: string;
  order_id?: number;
  issue_date: string;
  service_date?: string;
  payment_terms?: string;
  currency?: string;
  net_amount: number;
  tax_rate: number;
  tax_amount: number;
  gross_amount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  hash_sha256?: string;
  pdf_path?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  items?: InvoiceItem[];
}

interface InvoiceItem {
  id: number;
  invoice_id: number;
  pos: number;
  item_text: string;
  qty: number;
  unit: string;
  unit_price: number;
  net_line: number;
}

interface InvoiceDetailViewProps {
  invoice: Invoice;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (status: string) => void;
  onExportCSV?: () => void;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
  canManage?: boolean;
}

export function InvoiceDetailView({
  invoice,
  onEdit,
  onDelete,
  onStatusChange,
  onExportCSV,
  onExportPDF,
  onExportExcel,
  canManage = false,
}: InvoiceDetailViewProps) {
  const getStatusVariant = (status: string): "success" | "warning" | "error" | "info" | "default" => {
    switch (status) {
      case "paid":
        return "success";
      case "sent":
        return "info";
      case "overdue":
        return "error";
      case "cancelled":
        return "error";
      case "draft":
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Rechnung {invoice.invoice_number}
          </h2>
          <div className="mt-2 flex items-center gap-3">
            <StatusBadge status={invoice.status} variant={getStatusVariant(invoice.status)} />
            {invoice.hash_sha256 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Hash: {invoice.hash_sha256.substring(0, 16)}...
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {onExportCSV && (
            <button
              onClick={onExportCSV}
              className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              CSV
            </button>
          )}
          {onExportPDF && (
            <button
              onClick={onExportPDF}
              className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              PDF
            </button>
          )}
          {onExportExcel && (
            <button
              onClick={onExportExcel}
              className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Excel
            </button>
          )}
          {canManage && onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Bearbeiten
            </button>
          )}
          {canManage && onDelete && (
            <button
              onClick={onDelete}
              className="px-3 py-1.5 rounded border border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-sm font-medium text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              Löschen
            </button>
          )}
        </div>
      </div>

      {/* Rechnungsdaten */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Rechnungsdaten</h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Rechnungsnummer</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{invoice.invoice_number}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
            <dd className="mt-1">
              {canManage && onStatusChange ? (
                <select
                  value={invoice.status}
                  onChange={(e) => onStatusChange(e.target.value)}
                  className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-sm text-gray-900 dark:text-white"
                >
                  <option value="draft">Entwurf</option>
                  <option value="sent">Versendet</option>
                  <option value="paid">Bezahlt</option>
                  <option value="overdue">Überfällig</option>
                  <option value="cancelled">Storniert</option>
                </select>
              ) : (
                <StatusBadge status={invoice.status} variant={getStatusVariant(invoice.status)} />
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Rechnungsdatum</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {invoice.issue_date
                ? format(new Date(invoice.issue_date), "dd.MM.yyyy", { locale: de })
                : "—"}
            </dd>
          </div>
          {invoice.service_date && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Leistungsdatum</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {format(new Date(invoice.service_date), "dd.MM.yyyy", { locale: de })}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Kunde</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {invoice.company_name ||
                (invoice.vorname && invoice.nachname
                  ? `${invoice.vorname} ${invoice.nachname}`
                  : invoice.customer_email) ||
                "—"}
            </dd>
          </div>
          {invoice.project_name && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Projekt</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {invoice.project_name} {invoice.project_code && `(${invoice.project_code})`}
              </dd>
            </div>
          )}
          {invoice.payment_terms && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Zahlungsbedingungen</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{invoice.payment_terms}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Positionen */}
      {invoice.items && invoice.items.length > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Positionen</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                    Pos
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                    Beschreibung
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                    Menge
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                    Einzelpreis
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                    Gesamt
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-2 text-sm text-gray-900 dark:text-white">{item.pos}</td>
                    <td className="px-3 py-2 text-sm text-gray-900 dark:text-white">{item.item_text}</td>
                    <td className="px-3 py-2 text-right text-sm text-gray-900 dark:text-white">
                      {item.qty} {item.unit}
                    </td>
                    <td className="px-3 py-2 text-right text-sm text-gray-900 dark:text-white">
                      {item.unit_price.toFixed(2)} {invoice.currency || "EUR"}
                    </td>
                    <td className="px-3 py-2 text-right text-sm font-medium text-gray-900 dark:text-white">
                      {item.net_line.toFixed(2)} {invoice.currency || "EUR"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summen */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Summen</h3>
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Netto</dt>
            <dd className="text-sm text-gray-900 dark:text-white">
              {invoice.net_amount.toFixed(2)} {invoice.currency || "EUR"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              MwSt. ({invoice.tax_rate}%)
            </dt>
            <dd className="text-sm text-gray-900 dark:text-white">
              {invoice.tax_amount.toFixed(2)} {invoice.currency || "EUR"}
            </dd>
          </div>
          <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
            <dt className="text-base font-semibold text-gray-900 dark:text-white">Brutto</dt>
            <dd className="text-base font-semibold text-gray-900 dark:text-white">
              {invoice.gross_amount.toFixed(2)} {invoice.currency || "EUR"}
            </dd>
          </div>
        </dl>
      </div>

      {/* Metadaten */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Metadaten</h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Erstellt am</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {invoice.created_at
                ? format(new Date(invoice.created_at), "dd.MM.yyyy HH:mm", { locale: de })
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Aktualisiert am</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {invoice.updated_at
                ? format(new Date(invoice.updated_at), "dd.MM.yyyy HH:mm", { locale: de })
                : "—"}
            </dd>
          </div>
          {invoice.pdf_path && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">PDF-Pfad</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{invoice.pdf_path}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}




