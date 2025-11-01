"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/invoices", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setItems(Array.isArray(data) ? data : data.items || []);
      } catch (e: any) {
        setError(e?.message || "Fehler beim Laden der Rechnungen.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
        <button className="px-3 py-1 rounded border" onClick={() => onGeneratePdf()}>
          PDF (Sammel/Beispiel)
        </button>
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
                    Keine Rechnungen gefunden.
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
    </main>
  );
}
