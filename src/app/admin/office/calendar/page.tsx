"use client";

import { useEffect, useState } from "react";

type Appointment = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  status?: string;
};

export default function CalendarPage() {
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/appointments", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setItems(Array.isArray(data) ? data : data.items || []);
      } catch (e: any) {
        setError(e?.message || "Fehler beim Laden der Termine.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="p-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Kalender</h1>
        <a
          className="underline text-sm"
          href="/api/appointments/ical/export"
          target="_blank"
          rel="noopener noreferrer"
        >
          iCal-Export
        </a>
      </header>

      {loading && <p>Lade Termine…</p>}
      {error && <p className="text-red-600">Fehler: {error}</p>}

      {!loading && !error && (
        <ul className="divide-y rounded-lg border">
          {items.length === 0 && <li className="p-4 text-sm">Keine Termine gefunden.</li>}
          {items.map((a) => (
            <li key={a.id} className="p-4">
              <div className="font-medium">{a.title}</div>
              <div className="text-sm opacity-80">
                {new Date(a.starts_at).toLocaleString()} – {new Date(a.ends_at).toLocaleString()}
              </div>
              {a.status && <div className="text-xs mt-1 opacity-70">Status: {a.status}</div>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
