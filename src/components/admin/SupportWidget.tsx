"use client";
import { Card } from "@/components/ui/Card";
import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaCalendar,
  FaCheck,
  FaClock,
  FaEnvelope,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";

interface SupportStats {
  new_messages: number;
  in_progress: number;
  completed: number;
  urgent: number;
  last_24h: number;
  total_active: number;
}

export default function SupportWidget() {
  const [stats, setStats] = useState<SupportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Statistiken laden
  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/contact-messages/stats");
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      } else {
        setError("Fehler beim Laden der Statistiken");
      }
    } catch (err) {
      setError("Verbindungsfehler");
      console.error("Fehler beim Laden der Support-Statistiken:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();

    // Alle 30 Sekunden aktualisieren
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <FaSpinner className="w-6 h-6 text-blue-600 animate-spin mr-3" />
          <span className="text-gray-600">Lade Support-Status...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <FaExclamationTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 font-medium">Fehler beim Laden</p>
          <p className="text-sm text-gray-500">{error}</p>
          <button
            onClick={loadStats}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
          >
            Erneut versuchen
          </button>
        </div>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <FaEnvelope className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Support Status</h3>
            <p className="text-sm text-gray-500">Kontakt-Nachrichten Übersicht</p>
          </div>
        </div>
        <a
          href="/admin/support/contact-messages"
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
        >
          Alle anzeigen
          <FaArrowRight className="w-3 h-3 ml-1" />
        </a>
      </div>

      {/* Status-Karten */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Neue Nachrichten */}
        <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800">Neue Nachrichten</p>
              <p className="text-2xl font-bold text-red-900">{stats.new_messages}</p>
            </div>
            <FaExclamationTriangle className="w-8 h-8 text-red-500" />
          </div>
          {stats.new_messages > 0 && (
            <p className="text-xs text-red-600 mt-1">
              {stats.new_messages === 1 ? "Benötigt Aufmerksamkeit" : "Benötigen Aufmerksamkeit"}
            </p>
          )}
        </div>

        {/* In Bearbeitung */}
        <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">In Bearbeitung</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.in_progress}</p>
            </div>
            <FaClock className="w-8 h-8 text-yellow-500" />
          </div>
          {stats.in_progress > 0 && (
            <p className="text-xs text-yellow-600 mt-1">
              {stats.in_progress === 1 ? "Wird bearbeitet" : "Werden bearbeitet"}
            </p>
          )}
        </div>

        {/* Erledigt */}
        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Erledigt</p>
              <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
            </div>
            <FaCheck className="w-8 h-8 text-green-500" />
          </div>
          {stats.completed > 0 && (
            <p className="text-xs text-green-600 mt-1">
              {stats.completed === 1 ? "Abgeschlossen" : "Abgeschlossen"}
            </p>
          )}
        </div>

        {/* Dringend */}
        <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-800">Dringend</p>
              <p className="text-2xl font-bold text-orange-900">{stats.urgent}</p>
            </div>
            <FaExclamationTriangle className="w-8 h-8 text-orange-500" />
          </div>
          {stats.urgent > 0 && (
            <p className="text-xs text-orange-600 mt-1">
              {stats.urgent === 1 ? "Sofortige Bearbeitung" : "Sofortige Bearbeitung"}
            </p>
          )}
        </div>
      </div>

      {/* Zusätzliche Infos */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-600">
          <FaCalendar className="w-4 h-4 mr-2 text-gray-400" />
          <span>
            Letzte 24h: <span className="font-semibold text-gray-900">{stats.last_24h}</span>
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FaEnvelope className="w-4 h-4 mr-2 text-gray-400" />
          <span>
            Aktiv: <span className="font-semibold text-gray-900">{stats.total_active}</span>
          </span>
        </div>
      </div>

      {/* Aktions-Buttons */}
      <div className="mt-4 flex space-x-2">
        <a
          href="/admin/support/contact-messages?status=neu"
          className="flex-1 bg-red-600 text-white text-center py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
        >
          Neue anzeigen ({stats.new_messages})
        </a>
        <a
          href="/admin/support/contact-messages?status=in_bearbeitung"
          className="flex-1 bg-yellow-600 text-white text-center py-2 px-3 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
        >
          In Bearbeitung ({stats.in_progress})
        </a>
      </div>

      {/* Warnung bei vielen neuen Nachrichten */}
      {stats.new_messages > 5 && (
        <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <FaExclamationTriangle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700 font-medium">
              Achtung: {stats.new_messages} neue Nachrichten warten auf Bearbeitung!
            </p>
          </div>
        </div>
      )}

      {/* Erfolg bei guter Bearbeitung */}
      {stats.new_messages === 0 && stats.in_progress <= 2 && (
        <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <FaCheck className="w-5 h-5 text-green-500 mr-2" />
            <p className="text-sm text-green-700 font-medium">
              Ausgezeichnet! Alle Nachrichten sind bearbeitet.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
