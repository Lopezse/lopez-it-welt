"use client";

import { useEffect, useState } from "react";
import { Dialog, useDialog } from "@/components/ui/Dialog";

type Invoice = {
  id: string;
  number: string;
  debtor?: string;
  total_gross?: number;
  status?: string; // draft/sent/paid/storno
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
        // Mapping: invoice_number -> number, issue_date -> issued_at
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
      console.error("Fehler beim Laden der Rechnungen:", e);
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
      console.error("Fehler beim Erstellen:", e);
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
      console.error("Fehler beim Erstellen der Demo-Rechnung:", e);
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
        // Wenn nicht OK, versuche trotzdem PDF zu laden (Fallback)
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

      // PDF als Blob herunterladen
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
      console.error("PDF-Fehler:", e);
      alert(e?.message || "PDF-Generierung fehlgeschlagen.");
    }
  };

  return (
    <main className="p-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Rechnungen</h1>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded border" onClick={() => onGeneratePdf()}>
            PDF (Sammel/Beispiel)
          </button>
          <button
            className="px-3 py-1 rounded border bg-black text-white"
            onClick={() => setOpen(true)}
          >
            Neue Rechnung
          </button>
        </div>
      </header>

      {loading && <p>Lade Rechnungen…</p>}
      {error && <p className="text-red-600">Fehler: {error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left">Re-Nr.</th>
                <th className="px-3 py-2 text-left">Kunde</th>
                <th className="px-3 py-2 text-left">Datum</th>
                <th className="px-3 py-2 text-right">Brutto</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td className="px-3 py-4" colSpan={6}>
                    <div className="flex items-center justify-between">
                      <span>Keine Rechnungen gefunden.</span>
                      <button className="px-3 py-1 rounded border" onClick={createDemo}>
                        Demo-Rechnung anlegen
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {items.map((inv) => (
                <tr key={inv.id} className="border-t">
                  <td className="px-3 py-2">{inv.number || inv.id}</td>
                  <td className="px-3 py-2">{inv.debtor || "-"}</td>
                  <td className="px-3 py-2">
                    {inv.issued_at ? new Date(inv.issued_at).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {typeof inv.total_gross === "number" ? inv.total_gross.toFixed(2) + " €" : "-"}
                  </td>
                  <td className="px-3 py-2">{inv.status || "draft"}</td>
                  <td className="px-3 py-2">
                    <button
                      className="px-2 py-1 rounded border"
                      onClick={() => onGeneratePdf(inv.id)}
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <h2 className="text-lg font-semibold mb-3">Neue Rechnung</h2>
        <div className="space-y-3">
          <label className="block">
            <span className="text-sm">Kunde (optional)</span>
            <input
              className="mt-1 w-full border rounded px-2 py-1"
              value={form.debtor}
              onChange={(e) => setForm({ ...form, debtor: e.target.value })}
              placeholder="z.B. Demo GmbH"
            />
          </label>
          <label className="block">
            <span className="text-sm">Rechnungsdatum</span>
            <input
              type="date"
              className="mt-1 w-full border rounded px-2 py-1"
              value={form.issued_at}
              onChange={(e) => setForm({ ...form, issued_at: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="text-sm">Brutto € (optional)</span>
            <input
              type="number"
              step="0.01"
              className="mt-1 w-full border rounded px-2 py-1"
              value={form.total_gross}
              onChange={(e) => setForm({ ...form, total_gross: e.target.value })}
              placeholder="z.B. 119.00"
            />
          </label>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-1 rounded border" onClick={() => setOpen(false)}>
            Abbrechen
          </button>
          <button className="px-3 py-1 rounded border bg-black text-white" onClick={onCreate}>
            Anlegen
          </button>
        </div>
      </Dialog>
    </main>
  );
}
