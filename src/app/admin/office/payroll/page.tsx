"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface PayrollPeriod {
  id: number;
  period_start: string;
  period_end: string;
  period_type: string;
  status: string;
  total_hours: number;
  total_amount: number;
}

interface PayrollEntry {
  id: number;
  period_id: number;
  user_id: number;
  session_id?: number;
  work_date: string;
  hours_worked: number;
  hourly_rate: number;
  amount: number;
  category: string;
  description?: string;
  approved: number;
  invoiced: number;
  user_name?: string;
  project_name?: string;
  task_title?: string;
}

export default function PayrollPage() {
  const [periods, setPeriods] = useState<PayrollPeriod[]>([]);
  const [entries, setEntries] = useState<PayrollEntry[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreatePeriod, setShowCreatePeriod] = useState(false);
  const [newPeriod, setNewPeriod] = useState({
    period_start: "",
    period_end: "",
    period_type: "monthly",
  });

  useEffect(() => {
    loadPeriods();
    if (selectedPeriod) {
      loadEntries(selectedPeriod);
    }
  }, [selectedPeriod]);

  const loadPeriods = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/payroll/periods");
      const data = await response.json();

      if (data.success) {
        setPeriods(data.data.periods);
        if (data.data.periods.length > 0 && !selectedPeriod) {
          setSelectedPeriod(data.data.periods[0].id);
        }
      } else {
        setError("Fehler beim Laden der Abrechnungsperioden");
      }
    } catch (err) {
      setError("Fehler beim Laden der Abrechnungsperioden");
      console.error("Fehler:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadEntries = async (periodId: number) => {
    try {
      const response = await fetch(`/api/payroll/entries?period_id=${periodId}`);
      const data = await response.json();

      if (data.success) {
        setEntries(data.data.entries);
      } else {
        setError("Fehler beim Laden der Abrechnungseinträge");
      }
    } catch (err) {
      setError("Fehler beim Laden der Abrechnungseinträge");
      console.error("Fehler:", err);
    }
  };

  const handleCreatePeriod = async () => {
    try {
      const response = await fetch("/api/payroll/periods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPeriod,
          created_by: "system",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowCreatePeriod(false);
        setNewPeriod({ period_start: "", period_end: "", period_type: "monthly" });
        loadPeriods();
      } else {
        setError(data.error || "Fehler beim Erstellen der Periode");
      }
    } catch (err) {
      setError("Fehler beim Erstellen der Periode");
      console.error("Fehler:", err);
    }
  };

  const handleImportSessions = async (periodId: number) => {
    try {
      const response = await fetch("/api/payroll/import-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          period_id: periodId,
          user_id: 1, // TODO: Aktueller Benutzer
          hourly_rate: 50.0, // TODO: Aus Benutzerdaten
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`${data.data.imported} Sessions erfolgreich importiert`);
        loadEntries(periodId);
      } else {
        setError(data.error || "Fehler beim Importieren der Sessions");
      }
    } catch (err) {
      setError("Fehler beim Importieren der Sessions");
      console.error("Fehler:", err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lade Lohnabrechnungsdaten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">💰 Lohnabrechnung</h1>
        <p className="text-gray-600">Interne Abrechnung von Stunden- und Gehaltsdaten</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Perioden */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Abrechnungsperioden</h2>
          <button
            onClick={() => setShowCreatePeriod(!showCreatePeriod)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showCreatePeriod ? "Abbrechen" : "+ Neue Periode"}
          </button>
        </div>

        {showCreatePeriod && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Startdatum
                </label>
                <input
                  type="date"
                  value={newPeriod.period_start}
                  onChange={(e) =>
                    setNewPeriod({ ...newPeriod, period_start: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enddatum
                </label>
                <input
                  type="date"
                  value={newPeriod.period_end}
                  onChange={(e) =>
                    setNewPeriod({ ...newPeriod, period_end: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Typ
                </label>
                <select
                  value={newPeriod.period_type}
                  onChange={(e) =>
                    setNewPeriod({ ...newPeriod, period_type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="monthly">Monatlich</option>
                  <option value="weekly">Wöchentlich</option>
                  <option value="biweekly">Zweiwöchentlich</option>
                  <option value="custom">Benutzerdefiniert</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCreatePeriod}
                disabled={!newPeriod.period_start || !newPeriod.period_end}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Periode erstellen
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {periods.map((period) => (
            <div
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedPeriod === period.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">
                  {new Date(period.period_start).toLocaleDateString("de-DE")} -{" "}
                  {new Date(period.period_end).toLocaleDateString("de-DE")}
                </h3>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    period.status === "finalized"
                      ? "bg-green-100 text-green-800"
                      : period.status === "in_progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {period.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{period.period_type}</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {parseFloat(period.total_hours || 0).toFixed(2)}h
                </span>
                <span className="font-semibold text-gray-900">
                  {parseFloat(period.total_amount || 0).toFixed(2)} EUR
                </span>
              </div>
              <div className="mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImportSessions(period.id);
                  }}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  Sessions importieren
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Einträge */}
      {selectedPeriod && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Abrechnungseinträge (Periode {selectedPeriod})
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Datum
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Benutzer
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Projekt
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Stunden
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Stundensatz
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Betrag
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      Keine Einträge gefunden
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {new Date(entry.work_date).toLocaleDateString("de-DE")}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {entry.user_name || `User ${entry.user_id}`}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {entry.project_name || "-"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {parseFloat(entry.hours_worked).toFixed(2)}h
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {parseFloat(entry.hourly_rate).toFixed(2)} EUR
                      </td>
                      <td className="px-4 py-2 text-sm font-semibold text-gray-900">
                        {parseFloat(entry.amount).toFixed(2)} EUR
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {entry.approved === 1 && entry.invoiced === 0 ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                            Freigegeben
                          </span>
                        ) : entry.invoiced === 1 ? (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            Abgerechnet
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                            Entwurf
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}



import { useEffect, useState } from "react";
import Link from "next/link";

interface PayrollPeriod {
  id: number;
  period_start: string;
  period_end: string;
  period_type: string;
  status: string;
  total_hours: number;
  total_amount: number;
}

interface PayrollEntry {
  id: number;
  period_id: number;
  user_id: number;
  session_id?: number;
  work_date: string;
  hours_worked: number;
  hourly_rate: number;
  amount: number;
  category: string;
  description?: string;
  approved: number;
  invoiced: number;
  user_name?: string;
  project_name?: string;
  task_title?: string;
}

export default function PayrollPage() {
  const [periods, setPeriods] = useState<PayrollPeriod[]>([]);
  const [entries, setEntries] = useState<PayrollEntry[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreatePeriod, setShowCreatePeriod] = useState(false);
  const [newPeriod, setNewPeriod] = useState({
    period_start: "",
    period_end: "",
    period_type: "monthly",
  });

  useEffect(() => {
    loadPeriods();
    if (selectedPeriod) {
      loadEntries(selectedPeriod);
    }
  }, [selectedPeriod]);

  const loadPeriods = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/payroll/periods");
      const data = await response.json();

      if (data.success) {
        setPeriods(data.data.periods);
        if (data.data.periods.length > 0 && !selectedPeriod) {
          setSelectedPeriod(data.data.periods[0].id);
        }
      } else {
        setError("Fehler beim Laden der Abrechnungsperioden");
      }
    } catch (err) {
      setError("Fehler beim Laden der Abrechnungsperioden");
      console.error("Fehler:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadEntries = async (periodId: number) => {
    try {
      const response = await fetch(`/api/payroll/entries?period_id=${periodId}`);
      const data = await response.json();

      if (data.success) {
        setEntries(data.data.entries);
      } else {
        setError("Fehler beim Laden der Abrechnungseinträge");
      }
    } catch (err) {
      setError("Fehler beim Laden der Abrechnungseinträge");
      console.error("Fehler:", err);
    }
  };

  const handleCreatePeriod = async () => {
    try {
      const response = await fetch("/api/payroll/periods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPeriod,
          created_by: "system",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowCreatePeriod(false);
        setNewPeriod({ period_start: "", period_end: "", period_type: "monthly" });
        loadPeriods();
      } else {
        setError(data.error || "Fehler beim Erstellen der Periode");
      }
    } catch (err) {
      setError("Fehler beim Erstellen der Periode");
      console.error("Fehler:", err);
    }
  };

  const handleImportSessions = async (periodId: number) => {
    try {
      const response = await fetch("/api/payroll/import-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          period_id: periodId,
          user_id: 1, // TODO: Aktueller Benutzer
          hourly_rate: 50.0, // TODO: Aus Benutzerdaten
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`${data.data.imported} Sessions erfolgreich importiert`);
        loadEntries(periodId);
      } else {
        setError(data.error || "Fehler beim Importieren der Sessions");
      }
    } catch (err) {
      setError("Fehler beim Importieren der Sessions");
      console.error("Fehler:", err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lade Lohnabrechnungsdaten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">💰 Lohnabrechnung</h1>
        <p className="text-gray-600">Interne Abrechnung von Stunden- und Gehaltsdaten</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Perioden */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Abrechnungsperioden</h2>
          <button
            onClick={() => setShowCreatePeriod(!showCreatePeriod)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showCreatePeriod ? "Abbrechen" : "+ Neue Periode"}
          </button>
        </div>

        {showCreatePeriod && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Startdatum
                </label>
                <input
                  type="date"
                  value={newPeriod.period_start}
                  onChange={(e) =>
                    setNewPeriod({ ...newPeriod, period_start: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enddatum
                </label>
                <input
                  type="date"
                  value={newPeriod.period_end}
                  onChange={(e) =>
                    setNewPeriod({ ...newPeriod, period_end: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Typ
                </label>
                <select
                  value={newPeriod.period_type}
                  onChange={(e) =>
                    setNewPeriod({ ...newPeriod, period_type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="monthly">Monatlich</option>
                  <option value="weekly">Wöchentlich</option>
                  <option value="biweekly">Zweiwöchentlich</option>
                  <option value="custom">Benutzerdefiniert</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCreatePeriod}
                disabled={!newPeriod.period_start || !newPeriod.period_end}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Periode erstellen
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {periods.map((period) => (
            <div
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedPeriod === period.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">
                  {new Date(period.period_start).toLocaleDateString("de-DE")} -{" "}
                  {new Date(period.period_end).toLocaleDateString("de-DE")}
                </h3>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    period.status === "finalized"
                      ? "bg-green-100 text-green-800"
                      : period.status === "in_progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {period.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{period.period_type}</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {parseFloat(period.total_hours || 0).toFixed(2)}h
                </span>
                <span className="font-semibold text-gray-900">
                  {parseFloat(period.total_amount || 0).toFixed(2)} EUR
                </span>
              </div>
              <div className="mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImportSessions(period.id);
                  }}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  Sessions importieren
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Einträge */}
      {selectedPeriod && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Abrechnungseinträge (Periode {selectedPeriod})
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Datum
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Benutzer
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Projekt
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Stunden
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Stundensatz
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Betrag
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      Keine Einträge gefunden
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {new Date(entry.work_date).toLocaleDateString("de-DE")}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {entry.user_name || `User ${entry.user_id}`}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {entry.project_name || "-"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {parseFloat(entry.hours_worked).toFixed(2)}h
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {parseFloat(entry.hourly_rate).toFixed(2)} EUR
                      </td>
                      <td className="px-4 py-2 text-sm font-semibold text-gray-900">
                        {parseFloat(entry.amount).toFixed(2)} EUR
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {entry.approved === 1 && entry.invoiced === 0 ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                            Freigegeben
                          </span>
                        ) : entry.invoiced === 1 ? (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            Abgerechnet
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                            Entwurf
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}



















