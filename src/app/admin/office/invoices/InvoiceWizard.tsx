/**
 * Invoice Wizard Component
 * Verwendet den Abrechnungsfeed für Zeiteinträge
 */

"use client";

import { useEffect, useState } from "react";

interface BillableEntry {
  id: number;
  user_id: number;
  module: string;
  taetigkeit: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  category: string;
  project_id?: number;
  order_id?: number;
  task_id?: number;
  project_name?: string;
  order_number?: string;
  task_title?: string;
  user_name?: string;
}

interface InvoiceWizardProps {
  project_id?: string;
  from?: string;
  to?: string;
}

export function InvoiceWizard({ project_id, from, to }: InvoiceWizardProps) {
  const [billableEntries, setBillableEntries] = useState<BillableEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project_id) {
      fetchBillable(project_id, from, to);
    }
  }, [project_id, from, to]);

  async function fetchBillable(projectId: string, fromDate?: string, toDate?: string) {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        project_id: projectId,
        approved: "true",
        invoiced: "false",
      });

      if (fromDate) q.append("from", fromDate);
      if (toDate) q.append("to", toDate);

      const res = await fetch(`/api/time/entries?${q.toString()}`, {
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        setBillableEntries(data?.data?.items || []);
      }
    } catch (error) {
      console.error("Fehler beim Laden der abrechenbaren Zeiten:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-center py-4">Lade abrechenbare Zeiten...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Abrechenbare Zeiteinträge</h3>
      {billableEntries.length === 0 ? (
        <p className="text-gray-500">Keine abrechenbaren Zeiteinträge gefunden</p>
      ) : (
        <div className="space-y-2">
          {billableEntries.map((entry) => (
            <div key={entry.id} className="border rounded p-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">
                    {entry.project_name && entry.task_title
                      ? `Projekt: ${entry.project_name} – Aufgabe: ${entry.task_title} — ${entry.taetigkeit}`
                      : entry.taetigkeit}
                  </p>
                  <p className="text-sm text-gray-600">
                    {entry.project_name && entry.task_title && (
                      <>
                        <span className="font-medium">Rechnungsformat:</span> Projekt: {entry.project_name} – Aufgabe:{" "}
                        {entry.task_title} — {entry.taetigkeit}
                      </>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {Math.round(entry.duration_minutes / 15) * 15} Min
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(entry.start_time).toLocaleDateString("de-DE")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export async function fetchBillable(
  project_id: string,
  from: string,
  to: string,
): Promise<BillableEntry[]> {
  const q = new URLSearchParams({ project_id, from, to, approved: "true", invoiced: "false" });
  const res = await fetch(`/api/time/entries?${q.toString()}`, { cache: "no-store" });
  const data = await res.json();
  return data?.data?.items || [];
}


 * Verwendet den Abrechnungsfeed für Zeiteinträge
 */

"use client";

import { useEffect, useState } from "react";

interface BillableEntry {
  id: number;
  user_id: number;
  module: string;
  taetigkeit: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  category: string;
  project_id?: number;
  order_id?: number;
  task_id?: number;
  project_name?: string;
  order_number?: string;
  task_title?: string;
  user_name?: string;
}

interface InvoiceWizardProps {
  project_id?: string;
  from?: string;
  to?: string;
}

export function InvoiceWizard({ project_id, from, to }: InvoiceWizardProps) {
  const [billableEntries, setBillableEntries] = useState<BillableEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project_id) {
      fetchBillable(project_id, from, to);
    }
  }, [project_id, from, to]);

  async function fetchBillable(projectId: string, fromDate?: string, toDate?: string) {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        project_id: projectId,
        approved: "true",
        invoiced: "false",
      });

      if (fromDate) q.append("from", fromDate);
      if (toDate) q.append("to", toDate);

      const res = await fetch(`/api/time/entries?${q.toString()}`, {
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        setBillableEntries(data?.data?.items || []);
      }
    } catch (error) {
      console.error("Fehler beim Laden der abrechenbaren Zeiten:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-center py-4">Lade abrechenbare Zeiten...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Abrechenbare Zeiteinträge</h3>
      {billableEntries.length === 0 ? (
        <p className="text-gray-500">Keine abrechenbaren Zeiteinträge gefunden</p>
      ) : (
        <div className="space-y-2">
          {billableEntries.map((entry) => (
            <div key={entry.id} className="border rounded p-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">
                    {entry.project_name && entry.task_title
                      ? `Projekt: ${entry.project_name} – Aufgabe: ${entry.task_title} — ${entry.taetigkeit}`
                      : entry.taetigkeit}
                  </p>
                  <p className="text-sm text-gray-600">
                    {entry.project_name && entry.task_title && (
                      <>
                        <span className="font-medium">Rechnungsformat:</span> Projekt: {entry.project_name} – Aufgabe:{" "}
                        {entry.task_title} — {entry.taetigkeit}
                      </>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {Math.round(entry.duration_minutes / 15) * 15} Min
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(entry.start_time).toLocaleDateString("de-DE")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export async function fetchBillable(
  project_id: string,
  from: string,
  to: string,
): Promise<BillableEntry[]> {
  const q = new URLSearchParams({ project_id, from, to, approved: "true", invoiced: "false" });
  const res = await fetch(`/api/time/entries?${q.toString()}`, { cache: "no-store" });
  const data = await res.json();
  return data?.data?.items || [];
}

