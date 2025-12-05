"use client";

import { Dialog, useDialog } from "@/components/ui/Dialog";
import { useEffect, useState } from "react";
import { logger } from "@/lib/logger";
import { FaFileInvoiceDollar, FaPlus, FaFilePdf, FaEye } from "react-icons/fa";

type Invoice = {
  id: string;
  number: string;
  debtor?: string;
  total_gross?: number;
  status?: string;
  issued_at?: string;
};

export default function InvoicesPage() {
  const [items, setItems] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { open, setOpen } = useDialog();
  const [form, setForm] = useState({
    debtor: "",
    issued_at: new Date().toISOString().slice(0, 10),
    total_gross: "",
  });

  const reload = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/invoices", { cache: "no-store" });
      if (!res.ok) {
        setItems([]);
        setError(null);
        return;
      }
      const data = await res.json();
      if (data.success && data.data) {
        const mappedInvoices = (Array.isArray(data.data.invoices) ? data.data.invoices : []).map(
          (inv: any) => ({
            ...inv,
            number: inv.invoice_number || inv.number || inv.id,
            issued_at: inv.issue_date || inv.issued_at,
            debtor: inv.company_name || inv.debtor || inv.customer_email || null,
            total_gross: inv.gross_amount || inv.total_gross || null,
            status: inv.status || "draft",
          }),
        );
        setItems(mappedInvoices);
      } else {
        setItems([]);
      }
    } catch (e: any) {
      logger.error("Fehler beim Laden der Rechnungen", e);
      setItems([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const onCreate = async () => {
    try {
      const payload: any = {
        issued_at: form.issued_at || new Date().toISOString().slice(0, 10),
        total_gross: form.total_gross ? Number(form.total_gross) : null,
        items: [],
      };

      if (form.debtor) {
        payload.debtor = form.debtor;
      }

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setOpen(false);
        setForm({ debtor: "", issued_at: new Date().toISOString().slice(0, 10), total_gross: "" });
        await reload();
      } else {
        throw new Error(data.error || "Erstellen fehlgeschlagen");
      }
    } catch (e: any) {
      logger.error("Fehler beim Erstellen der Rechnung", e);
      alert(e?.message || "Erstellen fehlgeschlagen.");
    }
  };

  const createDemo = async () => {
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          debtor: "Demo GmbH",
          issued_at: new Date().toISOString().slice(0, 10),
          total_gross: 119.0,
          items: [{ name: "Demo-Position", qty: 1, price: 100, vat: 19 }],
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        await reload();
      } else {
        throw new Error(data.error || "Demo-Rechnung fehlgeschlagen");
      }
    } catch (e: any) {
      logger.error("Fehler beim Erstellen der Demo-Rechnung", e);
      alert(e?.message || "Demo-Rechnung fehlgeschlagen.");
    }
  };

  const onGeneratePdf = async (id?: string) => {
    try {
      const res = await fetch("/api/invoices/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const blob = await res.blob();
        if (blob.type === "application/pdf" || blob.size > 0) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `invoice-${id || "example"}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          return;
        }
        throw new Error(`PDF Fehler: HTTP ${res.status}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${id || "example"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      logger.error("PDF-Generierung fehlgeschlagen", e, { invoiceId: id });
      alert(e?.message || "PDF-Generierung fehlgeschlagen.");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: "bg-[#272a33] text-[#b3b3b3]",
      sent: "bg-blue-500/20 text-blue-400",
      paid: "bg-green-500/20 text-green-400",
      overdue: "bg-red-500/20 text-red-400",
      cancelled: "bg-gray-500/20 text-gray-400",
      storno: "bg-orange-500/20 text-orange-400",
    };
    const labels: Record<string, string> = {
      draft: "Entwurf",
      sent: "Versendet",
      paid: "Bezahlt",
      overdue: "Überfällig",
      cancelled: "Storniert",
      storno: "Storno",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status] || styles.draft}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaFileInvoiceDollar className="h-6 w-6" style={{ color: "#ffd700" }} />
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: "#f4f4f4" }}>Rechnungen</h1>
            <p className="text-sm" style={{ color: "#b3b3b3" }}>Rechnungsverwaltung</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            style={{ backgroundColor: "#272a33", color: "#f4f4f4", border: "1px solid #3d4150" }}
            onClick={() => onGeneratePdf()}
          >
            <FaFilePdf />
            PDF Export
          </button>
          <button
            className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            style={{ backgroundColor: "#ffd700", color: "#050509" }}
            onClick={() => setOpen(true)}
          >
            <FaPlus />
            Neue Rechnung
          </button>
        </div>
      </header>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <FaFileInvoiceDollar className="animate-pulse h-8 w-8 mx-auto mb-2" style={{ color: "#ffd700" }} />
            <p style={{ color: "#b3b3b3" }}>Lade Rechnungen...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-lg" style={{ backgroundColor: "#da1e28", color: "#fff" }}>
          Fehler: {error}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
          <table className="min-w-full">
            <thead>
              <tr style={{ backgroundColor: "#1f2329", borderColor: "#272a33" }} className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: "#b3b3b3" }}>Re-Nr.</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: "#b3b3b3" }}>Kunde</th>
                <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: "#b3b3b3" }}>Datum</th>
                <th className="px-4 py-3 text-right text-sm font-medium" style={{ color: "#b3b3b3" }}>Brutto</th>
                <th className="px-4 py-3 text-center text-sm font-medium" style={{ color: "#b3b3b3" }}>Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium" style={{ color: "#b3b3b3" }}>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center" colSpan={6}>
                    <div className="flex flex-col items-center gap-4">
                      <FaFileInvoiceDollar className="h-12 w-12" style={{ color: "#272a33" }} />
                      <p style={{ color: "#b3b3b3" }}>Keine Rechnungen gefunden.</p>
                      <button 
                        className="px-4 py-2 rounded-lg transition-colors"
                        style={{ backgroundColor: "#272a33", color: "#f4f4f4", border: "1px solid #3d4150" }}
                        onClick={createDemo}
                      >
                        Demo-Rechnung anlegen
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {items.map((inv) => (
                <tr 
                  key={inv.id} 
                  className="border-t transition-colors hover:bg-[#1f2329]"
                  style={{ borderColor: "#272a33" }}
                >
                  <td className="px-4 py-3">
                    <a
                      href={`/admin/office/invoices/${inv.id}`}
                      className="font-medium hover:underline"
                      style={{ color: "#ffd700" }}
                    >
                      {inv.number || inv.id}
                    </a>
                  </td>
                  <td className="px-4 py-3" style={{ color: "#f4f4f4" }}>
                    {inv.debtor || "-"}
                  </td>
                  <td className="px-4 py-3" style={{ color: "#b3b3b3" }}>
                    {inv.issued_at ? new Date(inv.issued_at).toLocaleDateString("de-DE") : "-"}
                  </td>
                  <td className="px-4 py-3 text-right font-medium" style={{ color: "#24a148" }}>
                    {typeof inv.total_gross === "number" ? inv.total_gross.toFixed(2) + " €" : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getStatusBadge(inv.status || "draft")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <a
                        href={`/admin/office/invoices/${inv.id}`}
                        className="p-2 rounded transition-colors hover:bg-[#272a33]"
                        style={{ color: "#b3b3b3" }}
                        title="Details"
                      >
                        <FaEye />
                      </a>
                      <button
                        className="p-2 rounded transition-colors hover:bg-[#272a33]"
                        style={{ color: "#b3b3b3" }}
                        onClick={() => onGeneratePdf(inv.id)}
                        title="PDF"
                      >
                        <FaFilePdf />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className="p-6 rounded-lg" style={{ backgroundColor: "#111217", border: "1px solid #272a33" }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>Neue Rechnung</h2>
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm" style={{ color: "#b3b3b3" }}>Kunde (optional)</span>
              <input
                className="mt-1 w-full rounded-lg px-3 py-2"
                style={{ 
                  backgroundColor: "#1f2329", 
                  border: "1px solid #272a33", 
                  color: "#f4f4f4" 
                }}
                value={form.debtor}
                onChange={(e) => setForm({ ...form, debtor: e.target.value })}
                placeholder="z.B. Demo GmbH"
              />
            </label>
            <label className="block">
              <span className="text-sm" style={{ color: "#b3b3b3" }}>Rechnungsdatum</span>
              <input
                type="date"
                className="mt-1 w-full rounded-lg px-3 py-2"
                style={{ 
                  backgroundColor: "#1f2329", 
                  border: "1px solid #272a33", 
                  color: "#f4f4f4" 
                }}
                value={form.issued_at}
                onChange={(e) => setForm({ ...form, issued_at: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-sm" style={{ color: "#b3b3b3" }}>Brutto € (optional)</span>
              <input
                type="number"
                step="0.01"
                className="mt-1 w-full rounded-lg px-3 py-2"
                style={{ 
                  backgroundColor: "#1f2329", 
                  border: "1px solid #272a33", 
                  color: "#f4f4f4" 
                }}
                value={form.total_gross}
                onChange={(e) => setForm({ ...form, total_gross: e.target.value })}
                placeholder="z.B. 119.00"
              />
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button 
              className="px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: "#272a33", color: "#f4f4f4", border: "1px solid #3d4150" }}
              onClick={() => setOpen(false)}
            >
              Abbrechen
            </button>
            <button 
              className="px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: "#ffd700", color: "#050509" }}
              onClick={onCreate}
            >
              Anlegen
            </button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}
