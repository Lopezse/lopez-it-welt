"use client";

import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaDatabase,
  FaDownload,
  FaExclamationTriangle,
  FaRedo,
  FaShieldAlt,
} from "react-icons/fa";

interface BackupStatus {
  status: string;
  directories: {
    backup: boolean;
    mysql: boolean;
    project: boolean;
  };
  lastBackups: {
    mysql: {
      timestamp: string;
      date: string;
      size: number;
      hash: string;
      valid: boolean;
    } | null;
    project: {
      timestamp: string;
      date: string;
      size: number;
      hash: string;
      valid: boolean;
    } | null;
  };
  diskSpace: Array<{
    drive: string;
    freeSpace: number;
    totalSize: number;
    usedSpace: number;
    freePercent: number;
  }>;
  timestamp: string;
}

interface BackupItem {
  file: string;
  timestamp: string | null;
  date: string | null;
  size: number;
  hash: string | null;
  mtime: string;
  error?: string;
}

export default function BackupManagement() {
  const [backupStatus, setBackupStatus] = useState<BackupStatus | null>(null);
  const [backupList, setBackupList] = useState<{
    mysql: BackupItem[];
    project: BackupItem[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadBackupStatus();
    loadBackupList();
  }, []);

  const loadBackupStatus = async () => {
    try {
      const response = await fetch("/api/admin/backup?action=status");
      const data = await response.json();
      setBackupStatus(data);
    } catch (error) {
      console.error("Backup-Status Fehler:", error);
      setMessage({
        type: "error",
        text: "Backup-Status konnte nicht geladen werden",
      });
    }
  };

  const loadBackupList = async () => {
    try {
      const response = await fetch("/api/admin/backup?action=list");
      const data = await response.json();
      setBackupList(data.backups);
    } catch (error) {
      console.error("Backup-Liste Fehler:", error);
    } finally {
      setLoading(false);
    }
  };

  const startBackup = async (type: "full" | "incremental" | "project" | "mysql") => {
    setActionLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/backup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          user: "admin",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: "success",
          text: `${type.toUpperCase()}-Backup erfolgreich gestartet!`,
        });
        // Status nach kurzer Zeit aktualisieren
        setTimeout(() => {
          loadBackupStatus();
          loadBackupList();
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: result.message || "Backup konnte nicht gestartet werden",
        });
      }
    } catch (error) {
      console.error("Backup-Start Fehler:", error);
      setMessage({
        type: "error",
        text: "Backup konnte nicht gestartet werden",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("de-DE");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🛡️ Enterprise++ Backup & Recovery
          </h1>
          <p className="text-gray-600">Sichere Verwaltung Ihrer Datenbanken und Projektdateien</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : message.type === "error"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Status Cards */}
        {backupStatus && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* MySQL Status */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">MySQL Backups</h3>
                <FaDatabase className="text-blue-600 text-xl" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-medium ${
                      backupStatus.directories.mysql ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {backupStatus.directories.mysql ? "Aktiv" : "Inaktiv"}
                  </span>
                </div>
                {backupStatus.lastBackups.mysql && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Letztes Backup:</span>
                      <span className="text-sm">
                        {formatDate(backupStatus.lastBackups.mysql.timestamp)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Größe:</span>
                      <span className="text-sm">
                        {formatFileSize(backupStatus.lastBackups.mysql.size)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Validierung:</span>
                      <span
                        className={`text-sm ${backupStatus.lastBackups.mysql.valid ? "text-green-600" : "text-red-600"}`}
                      >
                        {backupStatus.lastBackups.mysql.valid ? "OK" : "Fehler"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Project Status */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Projekt Backups</h3>
                <FaDownload className="text-green-600 text-xl" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-medium ${
                      backupStatus.directories.project ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {backupStatus.directories.project ? "Aktiv" : "Inaktiv"}
                  </span>
                </div>
                {backupStatus.lastBackups.project && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Letztes Backup:</span>
                      <span className="text-sm">
                        {formatDate(backupStatus.lastBackups.project.timestamp)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Größe:</span>
                      <span className="text-sm">
                        {formatFileSize(backupStatus.lastBackups.project.size)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Validierung:</span>
                      <span
                        className={`text-sm ${backupStatus.lastBackups.project.valid ? "text-green-600" : "text-red-600"}`}
                      >
                        {backupStatus.lastBackups.project.valid ? "OK" : "Fehler"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Disk Space */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Speicherplatz</h3>
                <FaShieldAlt className="text-yellow-600 text-xl" />
              </div>
              <div className="space-y-2">
                {backupStatus.diskSpace.map((drive, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{drive.drive}:</span>
                      <span className="font-medium">{drive.freeSpace} GB frei</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          drive.freePercent > 20
                            ? "bg-green-500"
                            : drive.freePercent > 10
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${drive.freePercent}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {drive.usedSpace} GB von {drive.totalSize} GB verwendet
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup-Aktionen</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => startBackup("full")}
              disabled={actionLoading}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaDatabase />
              <span>Vollbackup</span>
            </button>
            <button
              onClick={() => startBackup("mysql")}
              disabled={actionLoading}
              className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaDatabase />
              <span>MySQL Only</span>
            </button>
            <button
              onClick={() => startBackup("project")}
              disabled={actionLoading}
              className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaDownload />
              <span>Projekt Only</span>
            </button>
            <button
              onClick={() => {
                loadBackupStatus();
                loadBackupList();
              }}
              disabled={actionLoading}
              className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaRedo />
              <span>Aktualisieren</span>
            </button>
          </div>
        </div>

        {/* Backup List */}
        {backupList && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MySQL Backups */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">MySQL Backups</h3>
              <div className="space-y-3">
                {backupList.mysql.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Keine MySQL-Backups gefunden</p>
                ) : (
                  backupList.mysql.slice(0, 10).map((backup, index) => (
                    <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{backup.file}</span>
                        <span className="text-xs text-gray-500">{formatDate(backup.mtime)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{formatFileSize(backup.size)}</span>
                        {backup.error ? (
                          <span className="text-red-600 flex items-center">
                            <FaExclamationTriangle className="mr-1" />
                            {backup.error}
                          </span>
                        ) : (
                          <span className="text-green-600 flex items-center">
                            <FaCheckCircle className="mr-1" />
                            OK
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Project Backups */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Projekt Backups</h3>
              <div className="space-y-3">
                {backupList.project.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Keine Projekt-Backups gefunden</p>
                ) : (
                  backupList.project.slice(0, 10).map((backup, index) => (
                    <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{backup.file}</span>
                        <span className="text-xs text-gray-500">{formatDate(backup.mtime)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{formatFileSize(backup.size)}</span>
                        {backup.error ? (
                          <span className="text-red-600 flex items-center">
                            <FaExclamationTriangle className="mr-1" />
                            {backup.error}
                          </span>
                        ) : (
                          <span className="text-green-600 flex items-center">
                            <FaCheckCircle className="mr-1" />
                            OK
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <FaShieldAlt className="text-blue-600 text-xl mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Enterprise++ Backup-Strategie</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 3-2-1 Backup-Regel: 3 Kopien, 2 Medien, 1 extern</li>
                <li>• AES-256 Verschlüsselung für maximale Sicherheit</li>
                <li>• SHA256 Integritätsprüfung bei jedem Backup</li>
                <li>• Automatische Aufräumung nach 30 Tagen</li>
                <li>• Vollständige Audit-Logs für Compliance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
