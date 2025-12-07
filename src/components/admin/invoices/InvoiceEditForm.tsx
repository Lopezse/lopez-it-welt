/**
 * Invoice Edit Form Component - Enterprise++ Standard
 * 
 * Formular zum Bearbeiten einer Rechnung
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import type { AdminInvoice, InvoiceItem } from "@/lib/finance/types";

// Re-export für Abwärtskompatibilität
type Invoice = AdminInvoice;

interface InvoiceEditFormProps {
  invoice: Invoice;
  onSave: (invoice: Invoice) => Promise<void>;
  onCancel: () => void;
}

export function InvoiceEditForm({ invoice, onSave, onCancel }: InvoiceEditFormProps) {
  const [formData, setFormData] = useState<Invoice>(invoice);
  const [items, setItems] = useState<InvoiceItem[]>(invoice.items || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(invoice);
    setItems(invoice.items || []);
  }, [invoice]);

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Net-Line neu berechnen
    if (field === "qty" || field === "unit_price") {
      const qty = field === "qty" ? parseFloat(value) || 0 : newItems[index].qty;
      const unitPrice = field === "unit_price" ? parseFloat(value) || 0 : newItems[index].unit_price;
      newItems[index].net_line = qty * unitPrice;
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        pos: items.length + 1,
        item_text: "",
        qty: 1,
        unit: "Stk",
        unit_price: 0,
        net_line: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    // Positionen neu nummerieren
    newItems.forEach((item, i) => {
      item.pos = i + 1;
    });
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validierung
    if (!formData.issue_date) {
      setError("Rechnungsdatum ist erforderlich.");
      return;
    }

    if (items.length === 0) {
      setError("Mindestens eine Position ist erforderlich.");
      return;
    }

    for (const item of items) {
      if (!item.item_text || item.qty <= 0 || item.unit_price <= 0) {
        setError("Alle Positionen müssen vollständig ausgefüllt sein.");
        return;
      }
    }

    try {
      setLoading(true);
      await onSave({
        ...formData,
        items,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Speichern der Rechnung.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Rechnungsdaten */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Rechnungsdaten</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Rechnungsdatum *
            </label>
            <input
              type="date"
              value={formData.issue_date ? formData.issue_date.split("T")[0] : ""}
              onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
              required
              className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Leistungsdatum
            </label>
            <input
              type="date"
              value={formData.service_date ? formData.service_date.split("T")[0] : ""}
              onChange={(e) => setFormData({ ...formData, service_date: e.target.value || undefined })}
              className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Zahlungsbedingungen
            </label>
            <input
              type="text"
              value={formData.payment_terms || ""}
              onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value || undefined })}
              placeholder="z.B. Zahlbar innerhalb 14 Tage ohne Abzug"
              className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Währung
            </label>
            <input
              type="text"
              value={formData.currency || "EUR"}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value || "EUR" })}
              className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              MwSt.-Satz (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.tax_rate || 19}
              onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) || 19 })}
              className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Positionen */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Positionen</h3>
          <button
            type="button"
            onClick={addItem}
            className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            + Position hinzufügen
          </button>
        </div>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4"
            >
              <div className="col-span-12 sm:col-span-5">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Beschreibung *
                </label>
                <input
                  type="text"
                  value={item.item_text}
                  onChange={(e) => handleItemChange(index, "item_text", e.target.value)}
                  required
                  className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-sm text-gray-900 dark:text-white"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Menge *
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={item.qty}
                  onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                  required
                  min="0"
                  className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-sm text-gray-900 dark:text-white"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Einheit
                </label>
                <input
                  type="text"
                  value={item.unit}
                  onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-sm text-gray-900 dark:text-white"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Einzelpreis *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={item.unit_price}
                  onChange={(e) => handleItemChange(index, "unit_price", e.target.value)}
                  required
                  min="0"
                  className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-sm text-gray-900 dark:text-white"
                />
              </div>
              <div className="col-span-12 sm:col-span-1 flex items-end">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="w-full rounded border border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 text-sm font-medium text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Abbrechen
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Wird gespeichert..." : "Speichern"}
        </Button>
      </div>
    </form>
  );
}




