"use client";

import { useEffect, useState } from "react";

interface BackupData {
  status: {
    lastBackup: string;
    nextBackup: string;
    status: "success" | "error" | "running";
    progress: number;
    estimatedTime: string;
  };
  history: Array<{
    id: number;
    timestamp: string;
    type: "full" | "incremental" | "differential";
    size: string;
    status: "success" | "error" | "running";
    duration: string;
    files: number;
  }>;
  restorePoints: Array<{
    id: number;
    timestamp: string;
    type: "full" | "incremental" | "differential";
    size: string;
    description: string;
    status: "available" | "corrupted" | "deleted";
  }>;
  settings: {
    autoBackup: boolean;
    backupInterval: string;
    retentionDays: number;
    backupLocation: string;
    compression: boolean;
    encryption: boolean;
  };
}

export default function BackupsPage() {
  const [backupData, setBackupData] = useState<BackupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("status");

  useEffect(() => {
    // Mock-Daten für Backups
    const mockData: BackupData = {
      status: {
        lastBackup: "2025-06-27 02:00:00",
        nextBackup: "2025-06-28 02:00:00",
        status: "success",
        progress: 0,
        estimatedTime: "00:00:00",
      },
      history: [
        {
          id: 1,
          timestamp: "2025-06-27 02:00:00",
          type: "full",
          size: "2.4 GB",
          status: "success",
          duration: "00:15:30",
          files: 15420,
        },
        {
          id: 2,
          timestamp: "2025-06-26 02:00:00",
          type: "incremental",
          size: "156 MB",
          status: "success",
          duration: "00:02:15",
          files: 2340,
        },
        {
          id: 3,
          timestamp: "2025-06-25 02:00:00",
          type: "incremental",
          size: "189 MB",
          status: "success",
          duration: "00:02:45",
          files: 2890,
        },
        {
          id: 4,
          timestamp: "2025-06-24 02:00:00",
          type: "full",
          size: "2.3 GB",
          status: "success",
          duration: "00:14:20",
          files: 15200,
        },
      ],
      restorePoints: [
        {
          id: 1,
          timestamp: "2025-06-27 02:00:00",
          type: "full",
          size: "2.4 GB",
          description: "Vollständiges System-Backup",
          status: "available",
        },
        {
          id: 2,
          timestamp: "2025-06-26 02:00:00",
          type: "incremental",
          size: "156 MB",
          description: "Inkrementelles Backup",
          status: "available",
        },
        {
          id: 3,
          timestamp: "2025-06-25 02:00:00",
          type: "incremental",
          size: "189 MB",
          description: "Inkrementelles Backup",
          status: "available",
        },
        {
          id: 4,
          timestamp: "2025-06-20 02:00:00",
          type: "full",
          size: "2.2 GB",
          description: "Vollständiges System-Backup",
          status: "available",
        },
      ],
      settings: {
        autoBackup: true,
        backupInterval: "Täglich um 02:00",
        retentionDays: 30,
        backupLocation: "/backups/system",
        compression: true,
        encryption: true,
      },
    };

    setBackupData(mockData);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center p-8">Lade Backup-Daten...</div>;
  }

  if (!backupData) {
    return <div className="text-center p-8 text-red-600">Fehler beim Laden der Backup-Daten</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-100";
      case "error":
        return "text-red-600 bg-red-100";
      case "running":
        return "text-blue-600 bg-blue-100";
      case "available":
        return "text-green-600 bg-green-100";
      case "corrupted":
        return "text-red-600 bg-red-100";
      case "deleted":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full":
        return "bg-blue-100 text-blue-800";
      case "incremental":
        return "bg-green-100 text-green-800";
      case "differential":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Backup-Verwaltung</h1>
            <p className="text-gray-600 mt-1">Sicherung und Wiederherstellung des Systems</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Manuelles Backup starten
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Wiederherstellung
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              {
                id: "status",
                name: "Backup-Status",
                icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                id: "history",
                name: "Backup-Historie",
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                id: "restore",
                name: "Wiederherstellung",
                icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
              },
              {
                id: "settings",
                name: "Backup-Einstellungen",
                icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Backup-Status Tab */}
          {activeTab === "status" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Letztes Backup</h4>
                  <p className="text-2xl font-bold text-gray-900">{backupData.status.lastBackup}</p>
                  <p className="text-sm text-gray-500 mt-1">Erfolgreich abgeschlossen</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Nächstes Backup</h4>
                  <p className="text-2xl font-bold text-blue-600">{backupData.status.nextBackup}</p>
                  <p className="text-sm text-gray-500 mt-1">Automatisch geplant</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Backup-Status</h4>
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(backupData.status.status)}`}
                  >
                    {backupData.status.status === "success"
                      ? "Erfolgreich"
                      : backupData.status.status === "error"
                        ? "Fehler"
                        : "Läuft..."}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">System bereit</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Gespeicherte Backups</h4>
                  <p className="text-2xl font-bold text-green-600">{backupData.history.length}</p>
                  <p className="text-sm text-gray-500 mt-1">Verfügbar</p>
                </div>
              </div>

              {backupData.status.status === "running" && (
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-blue-900">Backup läuft...</h3>
                    <span className="text-sm text-blue-600">
                      {backupData.status.estimatedTime} verbleibend
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${backupData.status.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-blue-600 mt-2">
                    Fortschritt: {backupData.status.progress}%
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Backup-Historie Tab */}
          {activeTab === "history" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Backup-Historie</h3>
                <div className="flex space-x-2">
                  <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                    <option>Alle Typen</option>
                    <option>Vollbackup</option>
                    <option>Inkrementell</option>
                    <option>Differenziell</option>
                  </select>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                    Export
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Datum/Zeit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Typ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Größe
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dauer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dateien
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {backupData.history.map((backup) => (
                      <tr key={backup.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {backup.timestamp}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(backup.type)}`}
                          >
                            {backup.type === "full"
                              ? "Vollbackup"
                              : backup.type === "incremental"
                                ? "Inkrementell"
                                : "Differenziell"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {backup.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(backup.status)}`}
                          >
                            {backup.status === "success"
                              ? "Erfolgreich"
                              : backup.status === "error"
                                ? "Fehler"
                                : "Läuft..."}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {backup.duration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {backup.files.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Wiederherstellung Tab */}
          {activeTab === "restore" && (
            <div className="space-y-6">
              <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-yellow-600 mt-0.5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-900">Wichtiger Hinweis</h3>
                    <p className="text-yellow-800 mt-1">
                      Die Wiederherstellung überschreibt alle aktuellen Daten. Stellen Sie sicher,
                      dass Sie ein aktuelles Backup haben, bevor Sie fortfahren.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Verfügbare Wiederherstellungspunkte
                  </h3>
                  <div className="space-y-3">
                    {backupData.restorePoints.map((point) => (
                      <div
                        key={point.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(point.type)}`}
                            >
                              {point.type === "full"
                                ? "Vollbackup"
                                : point.type === "incremental"
                                  ? "Inkrementell"
                                  : "Differenziell"}
                            </span>
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(point.status)}`}
                            >
                              {point.status === "available"
                                ? "Verfügbar"
                                : point.status === "corrupted"
                                  ? "Beschädigt"
                                  : "Gelöscht"}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">{point.size}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">{point.timestamp}</p>
                        <p className="text-sm text-gray-600 mb-3">{point.description}</p>
                        {point.status === "available" && (
                          <button className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors">
                            Wiederherstellen
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Wiederherstellungsoptionen
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-4">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">
                          Vollständige Systemwiederherstellung
                        </span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Stellt das gesamte System wieder her
                      </p>
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">
                          Nur Datenbank wiederherstellen
                        </span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Stellt nur die Datenbank wieder her
                      </p>
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">
                          Nur Dateien wiederherstellen
                        </span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Stellt nur die Dateien wieder her
                      </p>
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">
                          Vor Wiederherstellung Backup erstellen
                        </span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Erstellt ein Backup vor der Wiederherstellung
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Backup-Einstellungen Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Allgemeine Einstellungen
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-900">
                            Automatisches Backup
                          </label>
                          <p className="text-xs text-gray-500">Backups automatisch erstellen</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={backupData.settings.autoBackup}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Backup-Intervall
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                          <option>Täglich</option>
                          <option>Wöchentlich</option>
                          <option>Monatlich</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Aufbewahrungszeit (Tage)
                        </label>
                        <input
                          type="number"
                          value={backupData.settings.retentionDays}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Erweiterte Einstellungen
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Backup-Speicherort
                        </label>
                        <input
                          type="text"
                          value={backupData.settings.backupLocation}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-900">Komprimierung</label>
                          <p className="text-xs text-gray-500">Backups komprimieren</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={backupData.settings.compression}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-900">
                            Verschlüsselung
                          </label>
                          <p className="text-xs text-gray-500">Backups verschlüsseln</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={backupData.settings.encryption}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Abbrechen
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Einstellungen speichern
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
