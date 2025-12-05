/**
 * Invoice Detail Page - Enterprise++ Standard E.1.1
 * 
 * Detailansicht einer Rechnung mit Bearbeiten, Löschen, Status-Änderung, Export und Audit-Logs
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { InvoiceDetailView } from "@/components/admin/invoices/InvoiceDetailView";
import { InvoiceEditForm } from "@/components/admin/invoices/InvoiceEditForm";
import { InvoiceAuditLogs } from "@/components/admin/invoices/InvoiceAuditLogs";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useOfficePermissions } from "@/lib/hooks/useOfficePermissions";

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
  id?: number;
  invoice_id?: number;
  pos: number;
  item_text: string;
  qty: number;
  unit: string;
  unit_price: number;
  net_line: number;
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "audit">("details");
  const [actionLoading, setActionLoading] = useState(false);

  const { canManage, canView, loading: permissionsLoading } = useOfficePermissions();

  useEffect(() => {
    if (!permissionsLoading && canView()) {
      loadInvoice();
    }
  }, [invoiceId, permissionsLoading]);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/invoices/${invoiceId}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Fehler beim Laden der Rechnung");
      }

      setInvoice(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Rechnung");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedInvoice: Invoice) => {
    if (!canManage()) {
      setError("Sie haben keine Berechtigung für diese Aktion.");
      return;
    }

    try {
      setActionLoading(true);
      setError(null);

      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issue_date: updatedInvoice.issue_date,
          service_date: updatedInvoice.service_date,
          payment_terms: updatedInvoice.payment_terms,
          tax_rate: updatedInvoice.tax_rate,
          items: updatedInvoice.items,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Fehler beim Speichern der Rechnung");
      }

      setEditMode(false);
      await loadInvoice();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Speichern der Rechnung");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!canManage()) {
      setError("Sie haben keine Berechtigung für diese Aktion.");
      return;
    }

    try {
      setActionLoading(true);
      setError(null);

      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Fehler beim Löschen der Rechnung");
      }

      router.push("/admin/office/invoices");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Löschen der Rechnung");
      setShowDeleteConfirm(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!canManage()) {
      setError("Sie haben keine Berechtigung für diese Aktion.");
      return;
    }

    try {
      setActionLoading(true);
      setError(null);

      const response = await fetch("/api/invoices/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice_id: invoiceId,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Fehler beim Ändern des Status");
      }

      await loadInvoice();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Ändern des Status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!invoice) return;

    const headers = [
      "Rechnungsnummer",
      "Kunde",
      "Rechnungsdatum",
      "Leistungsdatum",
      "Netto",
      "MwSt.",
      "Brutto",
      "Status",
    ];
    const row = [
      invoice.invoice_number,
      invoice.company_name || invoice.customer_email || "—",
      invoice.issue_date || "—",
      invoice.service_date || "—",
      invoice.net_amount.toFixed(2),
      invoice.tax_amount.toFixed(2),
      invoice.gross_amount.toFixed(2),
      invoice.status,
    ];

    const csvContent = [headers, row].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${invoice.invoice_number}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    if (!invoice) return;

    try {
      const response = await fetch("/api/invoices/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: invoiceId }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Generieren des PDFs");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoice.invoice_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Exportieren des PDFs");
    }
  };

  const handleExportExcel = () => {
    if (!invoice) return;

    // Einfacher Excel-Export als CSV (für echte Excel-Unterstützung würde man eine Bibliothek wie xlsx verwenden)
    handleExportCSV();
  };

  if (permissionsLoading || loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Laden...</p>
      </div>
    );
  }

  if (!canView()) {
    return (
      <div className="p-6">
        <ErrorBanner
          message="Sie haben keine Berechtigung, diese Rechnung anzuzeigen."
          errorCode="PERMISSION_DENIED"
        />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6">
        <ErrorBanner message="Rechnung nicht gefunden." />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Link
          href="/admin/office/invoices"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          ← Zurück zur Liste
        </Link>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab("details")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "details"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "audit"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Audit-Logs
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === "details" && (
        <>
          {editMode ? (
            <InvoiceEditForm
              invoice={invoice}
              onSave={handleSave}
              onCancel={() => setEditMode(false)}
            />
          ) : (
            <InvoiceDetailView
              invoice={invoice}
              onEdit={canManage() ? () => setEditMode(true) : undefined}
              onDelete={canManage() ? () => setShowDeleteConfirm(true) : undefined}
              onStatusChange={canManage() ? handleStatusChange : undefined}
              onExportCSV={handleExportCSV}
              onExportPDF={handleExportPDF}
              onExportExcel={handleExportExcel}
              canManage={canManage()}
            />
          )}
        </>
      )}

      {activeTab === "audit" && <InvoiceAuditLogs invoiceId={invoiceId} />}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Rechnung löschen"
        message="Möchten Sie diese Rechnung wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
        confirmText="Löschen"
        cancelText="Abbrechen"
        variant="destructive"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}




