"use client";

import { useState, useEffect } from "react";
import { FaDatabase, FaClock, FaServer, FaCodeBranch, FaTrash, FaDownload, FaUpload, FaCheckCircle } from "react-icons/fa";

interface Backup {
  id: number;
  name: string;
  size: string;
  created_at: string;
  type: string;
}

interface Cronjob {
  id: number;
  name: string;
  schedule: string;
  command: string;
  is_active: boolean;
  last_run?: string;
  next_run: string;
}

interface SystemStatus {
  database: { status: string; version: string };
  api: { status: string; uptime: string };
  queue: { status: string; jobs: number };
  disk_space: { used: string; total: string; percent: number };
}

interface SystemInfo {
  version: string;
  node_version: string;
  platform: string;
  uptime: string;
}

export default function System() {
  const [loading, setLoading] = useState(true);
  const [backups, setBackups] = useState<Backup[]>([]);
  const [cronjobs, setCronjobs] = useState<Cronjob[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [cacheClearing, setCacheClearing] = useState(false);
  const [newBackupName, setNewBackupName] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([loadBackups(), loadCronjobs(), loadSystemStatus(), loadSystemInfo()]);
    setLoading(false);
  };

  const loadBackups = async () => {
    try {
      const response = await fetch("/api/admin/settings/system/backups");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setBackups(result.data || []);
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden der Backups:", error);
    }
  };

  const loadCronjobs = async () => {
    try {
      const response = await fetch("/api/admin/settings/system/cronjobs");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setCronjobs(result.data || []);
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden der Cronjobs:", error);
    }
  };

  const loadSystemStatus = async () => {
    try {
      const response = await fetch("/api/admin/settings/system/status");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSystemStatus(result.data);
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden des Systemstatus:", error);
    }
  };

  const loadSystemInfo = async () => {
    try {
      const response = await fetch("/api/admin/settings/system");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSystemInfo(result.data);
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden der Systeminformationen:", error);
    }
  };

  const handleCreateBackup = async () => {
    if (!newBackupName || newBackupName.length < 3) {
      alert("Backup-Name muss mindestens 3 Zeichen lang sein.");
      return;
    }

    setCreatingBackup(true);
    try {
      const response = await fetch("/api/admin/settings/system/backups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newBackupName }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert("Backup erfolgreich erstellt.");
          setNewBackupName("");
          loadBackups();
        } else {
          alert(result.error || "Fehler beim Erstellen des Backups.");
        }
      } else {
        alert("Fehler beim Erstellen des Backups.");
      }
    } catch (error) {
      console.error("Fehler beim Erstellen des Backups:", error);
      alert("Fehler beim Erstellen des Backups.");
    } finally {
      setCreatingBackup(false);
    }
  };

  const handleRestoreBackup = async (id: number) => {
    if (!confirm("Möchten Sie dieses Backup wirklich wiederherstellen? Alle aktuellen Daten werden überschrieben!")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/settings/system/backups/${id}/restore`, {
        method: "POST",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert("Backup erfolgreich wiederhergestellt.");
        } else {
          alert(result.error || "Fehler beim Wiederherstellen des Backups.");
        }
      } else {
        alert("Fehler beim Wiederherstellen des Backups.");
      }
    } catch (error) {
      console.error("Fehler beim Wiederherstellen des Backups:", error);
      alert("Fehler beim Wiederherstellen des Backups.");
    }
  };

  const handleDeleteBackup = async (id: number) => {
    if (!confirm("Möchten Sie dieses Backup wirklich löschen?")) return;

    try {
      const response = await fetch(`/api/admin/settings/system/backups/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadBackups();
      } else {
        alert("Fehler beim Löschen des Backups.");
      }
    } catch (error) {
      console.error("Fehler beim Löschen des Backups:", error);
      alert("Fehler beim Löschen des Backups.");
    }
  };

  const handleClearCache = async () => {
    if (!confirm("Möchten Sie den Cache wirklich leeren?")) return;

    setCacheClearing(true);
    try {
      const response = await fetch("/api/admin/settings/system/cache/clear", {
        method: "POST",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert("Cache erfolgreich geleert.");
        } else {
          alert("Fehler beim Leeren des Caches.");
        }
      } else {
        alert("Fehler beim Leeren des Caches.");
      }
    } catch (error) {
      console.error("Fehler beim Leeren des Caches:", error);
      alert("Fehler beim Leeren des Caches.");
    } finally {
      setCacheClearing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p style={{ color: "#b3b3b3" }}>Lade Systeminformationen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Systemstatus */}
      {systemStatus && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: "#f4f4f4" }}>
            <FaServer className="mr-2" style={{ width: "18px", height: "18px" }} />
            Systemstatus
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-lg p-4 border" style={{ backgroundColor: "#1a1d24", borderColor: "#272a33" }}>
              <p className="text-xs mb-1" style={{ color: "#8a8a8a" }}>
                Datenbank
              </p>
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: systemStatus.database.status === "online" ? "#24a148" : "#da1e28",
                  }}
                />
                <p className="text-sm font-medium" style={{ color: "#f4f4f4" }}>
                  {systemStatus.database.status === "online" ? "Online" : "Offline"}
                </p>
              </div>
              <p className="text-xs mt-1" style={{ color: "#8a8a8a" }}>
                {systemStatus.database.version}
              </p>
            </div>
            <div className="rounded-lg p-4 border" style={{ backgroundColor: "#1a1d24", borderColor: "#272a33" }}>
              <p className="text-xs mb-1" style={{ color: "#8a8a8a" }}>
                API
              </p>
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: systemStatus.api.status === "online" ? "#24a148" : "#da1e28",
                  }}
                />
                <p className="text-sm font-medium" style={{ color: "#f4f4f4" }}>
                  {systemStatus.api.status === "online" ? "Online" : "Offline"}
                </p>
              </div>
              <p className="text-xs mt-1" style={{ color: "#8a8a8a" }}>
                Uptime: {systemStatus.api.uptime}
              </p>
            </div>
            <div className="rounded-lg p-4 border" style={{ backgroundColor: "#1a1d24", borderColor: "#272a33" }}>
              <p className="text-xs mb-1" style={{ color: "#8a8a8a" }}>
                Queue
              </p>
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: systemStatus.queue.status === "running" ? "#24a148" : "#da1e28",
                  }}
                />
                <p className="text-sm font-medium" style={{ color: "#f4f4f4" }}>
                  {systemStatus.queue.status === "running" ? "Läuft" : "Gestoppt"}
                </p>
              </div>
              <p className="text-xs mt-1" style={{ color: "#8a8a8a" }}>
                {systemStatus.queue.jobs} Jobs
              </p>
            </div>
            <div className="rounded-lg p-4 border" style={{ backgroundColor: "#1a1d24", borderColor: "#272a33" }}>
              <p className="text-xs mb-1" style={{ color: "#8a8a8a" }}>
                Disk Space
              </p>
              <p className="text-sm font-medium" style={{ color: "#f4f4f4" }}>
                {systemStatus.disk_space.used} / {systemStatus.disk_space.total}
              </p>
              <div className="mt-2 h-2 rounded-full" style={{ backgroundColor: "#272a33" }}>
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: systemStatus.disk_space.percent > 80 ? "#da1e28" : systemStatus.disk_space.percent > 60 ? "#f1c21b" : "#24a148",
                    width: `${systemStatus.disk_space.percent}%`,
                  }}
                />
              </div>
              <p className="text-xs mt-1" style={{ color: "#8a8a8a" }}>
                {systemStatus.disk_space.percent}% verwendet
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Version */}
      {systemInfo && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: "#f4f4f4" }}>
            <FaCodeBranch className="mr-2" style={{ width: "18px", height: "18px" }} />
            Version & Informationen
          </h3>
          <div className="rounded-lg p-6 border" style={{ backgroundColor: "#1a1d24", borderColor: "#272a33" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs mb-1" style={{ color: "#8a8a8a" }}>
                  Version
                </p>
                <p className="text-sm font-medium" style={{ color: "#f4f4f4" }}>
                  {systemInfo.version}
                </p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: "#8a8a8a" }}>
                  Node.js Version
                </p>
                <p className="text-sm font-medium" style={{ color: "#f4f4f4" }}>
                  {systemInfo.node_version}
                </p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: "#8a8a8a" }}>
                  Plattform
                </p>
                <p className="text-sm font-medium" style={{ color: "#f4f4f4" }}>
                  {systemInfo.platform}
                </p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: "#8a8a8a" }}>
                  Uptime
                </p>
                <p className="text-sm font-medium" style={{ color: "#f4f4f4" }}>
                  {systemInfo.uptime}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backups */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center" style={{ color: "#f4f4f4" }}>
            <FaDatabase className="mr-2" style={{ width: "18px", height: "18px" }} />
            Backups
          </h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newBackupName}
              onChange={(e) => setNewBackupName(e.target.value)}
              placeholder="Backup-Name"
              className="px-4 py-2 rounded-md text-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007bff]"
              style={{
                backgroundColor: "#1a1d24",
                borderColor: "#272a33",
                color: "#f4f4f4",
                width: "200px",
              }}
            />
            <button
              onClick={handleCreateBackup}
              disabled={creatingBackup || !newBackupName}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#007bff] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "transparent",
                borderColor: "#272a33",
                color: "#b3b3b3",
              }}
              onMouseEnter={(e) => {
                if (!creatingBackup && newBackupName) {
                  e.currentTarget.style.backgroundColor = "#1f2329";
                  e.currentTarget.style.borderColor = "#3a3d47";
                  e.currentTarget.style.color = "#f4f4f4";
                }
              }}
              onMouseLeave={(e) => {
                if (!creatingBackup && newBackupName) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "#272a33";
                  e.currentTarget.style.color = "#b3b3b3";
                }
              }}
            >
              <FaUpload className="mr-2" style={{ width: "14px", height: "14px" }} />
              {creatingBackup ? "Erstelle..." : "Backup erstellen"}
            </button>
          </div>
        </div>
        {backups.length > 0 ? (
          <div className="space-y-2">
            {backups.map((backup) => (
              <div
                key={backup.id}
                className="flex items-center justify-between p-4 rounded-lg border"
                style={{ backgroundColor: "#1a1d24", borderColor: "#272a33" }}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: "#f4f4f4" }}>
                    {backup.name}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#8a8a8a" }}>
                    {backup.size} • {new Date(backup.created_at).toLocaleString("de-DE")} • {backup.type}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleRestoreBackup(backup.id)}
                    className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#007bff]"
                    style={{
                      backgroundColor: "transparent",
                      borderColor: "#272a33",
                      color: "#007bff",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#1f2329";
                      e.currentTarget.style.borderColor = "#3a3d47";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "#272a33";
                    }}
                  >
                    <FaDownload className="mr-2" style={{ width: "14px", height: "14px" }} />
                    Wiederherstellen
                  </button>
                  <button
                    onClick={() => handleDeleteBackup(backup.id)}
                    className="p-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#da1e28]"
                    style={{ color: "#da1e28" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#1f2329";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <FaTrash style={{ width: "14px", height: "14px" }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: "#8a8a8a" }}>
            Keine Backups vorhanden.
          </p>
        )}
      </div>

      {/* Cronjobs */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: "#f4f4f4" }}>
          <FaClock className="mr-2" style={{ width: "18px", height: "18px" }} />
          Cronjobs
        </h3>
        {cronjobs.length > 0 ? (
          <div className="space-y-2">
            {cronjobs.map((cronjob) => (
              <div
                key={cronjob.id}
                className="p-4 rounded-lg border"
                style={{ backgroundColor: "#1a1d24", borderColor: "#272a33" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium" style={{ color: "#f4f4f4" }}>
                      {cronjob.name}
                    </p>
                    <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: cronjob.is_active ? "#24a148" : "#272a33",
                        color: "#ffffff",
                      }}
                    >
                      {cronjob.is_active ? "Aktiv" : "Inaktiv"}
                    </span>
                  </div>
                </div>
                <p className="text-xs mb-2" style={{ color: "#8a8a8a" }}>
                  Schedule: {cronjob.schedule}
                </p>
                <p className="text-xs mb-2 font-mono" style={{ color: "#b3b3b3" }}>
                  {cronjob.command}
                </p>
                <div className="flex items-center space-x-4 text-xs" style={{ color: "#8a8a8a" }}>
                  {cronjob.last_run && (
                    <span>Letzte Ausführung: {new Date(cronjob.last_run).toLocaleString("de-DE")}</span>
                  )}
                  <span>Nächste Ausführung: {new Date(cronjob.next_run).toLocaleString("de-DE")}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: "#8a8a8a" }}>
            Keine Cronjobs vorhanden.
          </p>
        )}
      </div>

      {/* Cache */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: "#f4f4f4" }}>
          Cache
        </h3>
        <div className="rounded-lg p-6 border" style={{ backgroundColor: "#1a1d24", borderColor: "#272a33" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: "#f4f4f4" }}>
                Cache leeren
              </p>
              <p className="text-xs" style={{ color: "#8a8a8a" }}>
                Entfernt alle zwischengespeicherten Daten
              </p>
            </div>
            <button
              onClick={handleClearCache}
              disabled={cacheClearing}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#007bff] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "transparent",
                borderColor: "#272a33",
                color: "#b3b3b3",
              }}
              onMouseEnter={(e) => {
                if (!cacheClearing) {
                  e.currentTarget.style.backgroundColor = "#1f2329";
                  e.currentTarget.style.borderColor = "#3a3d47";
                  e.currentTarget.style.color = "#f4f4f4";
                }
              }}
              onMouseLeave={(e) => {
                if (!cacheClearing) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "#272a33";
                  e.currentTarget.style.color = "#b3b3b3";
                }
              }}
            >
              {cacheClearing ? "Leere..." : "Cache leeren"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

