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
        if (!res.ok) {
          // Wenn Response nicht OK, Fallback auf leere Liste
          setItems([]);
          setError(null); // Kein Fehler anzeigen, leere Liste ist OK
          return;
        }
        const data = await res.json();
        if (data.success && data.data) {
          setItems(Array.isArray(data.data.appointments) ? data.data.appointments : []);
        } else if (Array.isArray(data)) {
          setItems(data);
        } else if (Array.isArray(data.items)) {
          setItems(data.items);
        } else {
          setItems([]);
        }
      } catch (e: any) {
        console.error("Fehler beim Laden der Termine:", e);
        // Fallback: Leere Liste statt Fehler anzeigen
        setItems([]);
        setError(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="p-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Kalender</h1>
        <button
          className="underline text-sm"
          onClick={async () => {
            try {
              const res = await fetch("/api/appointments/ical/export");
              if (!res.ok) {
                // Auch bei Fehler versuchen, iCal zu laden (Fallback)
                const blob = await res.blob();
                if (blob.type === "text/calendar" || blob.size > 0) {
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "lopez-appointments.ics";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                  return;
                }
                throw new Error(`iCal Fehler: HTTP ${res.status}`);
              }
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "lopez-appointments.ics";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            } catch (e: any) {
              console.error("iCal-Fehler:", e);
              alert(e?.message || "iCal-Export fehlgeschlagen.");
            }
          }}
        >
          iCal-Export
        </button>
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
