import { exec } from "child_process";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * 🛡️ Lopez IT Welt – Enterprise++ Backup API
 *
 * Endpoints:
 * - GET /api/admin/backup - Backup-Status abrufen
 * - POST /api/admin/backup - Backup starten
 * - GET /api/admin/backup/restore - Wiederherstellungs-Optionen
 * - POST /api/admin/backup/restore - Wiederherstellung starten
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "status";

    switch (action) {
      case "status":
        return await getBackupStatus();
      case "list":
        return await listBackups();
      case "validate":
        return await validateBackups();
      default:
        return NextResponse.json({ error: "Unbekannte Aktion" }, { status: 400 });
    }
  } catch (error) {
    console.error("Backup API Fehler:", error);
    return NextResponse.json(
      { error: "Backup-Status konnte nicht abgerufen werden" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type = "full", user } = body;

    // Backup starten
    const result = await startBackup(type, user);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Backup Start Fehler:", error);
    return NextResponse.json({ error: "Backup konnte nicht gestartet werden" }, { status: 500 });
  }
}

/**
 * Backup-Status abrufen
 */
async function getBackupStatus() {
  try {
    const backupDir = "D:\\Backups";
    const mysqlDir = path.join(backupDir, "mysql");
    const projectDir = path.join(backupDir, "project");

    // Verzeichnisse prüfen
    const fs = require("fs");
    const dirsExist = {
      backup: fs.existsSync(backupDir),
      mysql: fs.existsSync(mysqlDir),
      project: fs.existsSync(projectDir),
    };

    // Letzte Backups finden
    let lastBackups = {
      mysql: null,
      project: null,
    };

    if (dirsExist.mysql) {
      const mysqlFiles = fs
        .readdirSync(mysqlDir)
        .filter((file) => file.endsWith(".json"))
        .map((file) => {
          const filePath = path.join(mysqlDir, file);
          const stats = fs.statSync(filePath);
          return {
            file,
            mtime: stats.mtime,
            size: stats.size,
          };
        })
        .sort((a, b) => b.mtime - a.mtime);

      if (mysqlFiles.length > 0) {
        const lastFile = mysqlFiles[0];
        const metadataPath = path.join(mysqlDir, lastFile.file);
        try {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
          lastBackups.mysql = {
            timestamp: metadata.timestamp,
            date: metadata.date,
            size: metadata.size,
            hash: metadata.hash,
            valid: true,
          };
        } catch (e) {
          console.warn("MySQL-Metadaten konnten nicht gelesen werden");
        }
      }
    }

    if (dirsExist.project) {
      const projectFiles = fs
        .readdirSync(projectDir)
        .filter((file) => file.endsWith(".json"))
        .map((file) => {
          const filePath = path.join(projectDir, file);
          const stats = fs.statSync(filePath);
          return {
            file,
            mtime: stats.mtime,
            size: stats.size,
          };
        })
        .sort((a, b) => b.mtime - a.mtime);

      if (projectFiles.length > 0) {
        const lastFile = projectFiles[0];
        const metadataPath = path.join(projectDir, lastFile.file);
        try {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
          lastBackups.project = {
            timestamp: metadata.timestamp,
            date: metadata.date,
            size: metadata.size,
            hash: metadata.hash,
            valid: true,
          };
        } catch (e) {
          console.warn("Projekt-Metadaten konnten nicht gelesen werden");
        }
      }
    }

    // Speicherplatz prüfen
    const diskSpace = await getDiskSpace();

    return NextResponse.json({
      status: "ok",
      directories: dirsExist,
      lastBackups,
      diskSpace,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Status-Abruf Fehler:", error);
    throw error;
  }
}

/**
 * Backup-Liste abrufen
 */
async function listBackups() {
  try {
    const backupDir = "D:\\Backups";
    const mysqlDir = path.join(backupDir, "mysql");
    const projectDir = path.join(backupDir, "project");

    const fs = require("fs");

    const backups = {
      mysql: [],
      project: [],
    };

    // MySQL-Backups
    if (fs.existsSync(mysqlDir)) {
      const mysqlFiles = fs
        .readdirSync(mysqlDir)
        .filter((file) => file.endsWith(".json"))
        .map((file) => {
          const filePath = path.join(mysqlDir, file);
          const stats = fs.statSync(filePath);
          try {
            const metadata = JSON.parse(fs.readFileSync(filePath, "utf8"));
            return {
              file: file.replace(".json", ""),
              timestamp: metadata.timestamp,
              date: metadata.date,
              size: metadata.size,
              hash: metadata.hash,
              mtime: stats.mtime,
            };
          } catch (e) {
            return {
              file: file.replace(".json", ""),
              timestamp: null,
              date: null,
              size: stats.size,
              hash: null,
              mtime: stats.mtime,
              error: "Metadaten-Fehler",
            };
          }
        })
        .sort((a, b) => b.mtime - a.mtime);

      backups.mysql = mysqlFiles;
    }

    // Projekt-Backups
    if (fs.existsSync(projectDir)) {
      const projectFiles = fs
        .readdirSync(projectDir)
        .filter((file) => file.endsWith(".json"))
        .map((file) => {
          const filePath = path.join(projectDir, file);
          const stats = fs.statSync(filePath);
          try {
            const metadata = JSON.parse(fs.readFileSync(filePath, "utf8"));
            return {
              file: file.replace(".json", ""),
              timestamp: metadata.timestamp,
              date: metadata.date,
              size: metadata.size,
              hash: metadata.hash,
              mtime: stats.mtime,
            };
          } catch (e) {
            return {
              file: file.replace(".json", ""),
              timestamp: null,
              date: null,
              size: stats.size,
              hash: null,
              mtime: stats.mtime,
              error: "Metadaten-Fehler",
            };
          }
        })
        .sort((a, b) => b.mtime - a.mtime);

      backups.project = projectFiles;
    }

    return NextResponse.json({
      status: "ok",
      backups,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Backup-Liste Fehler:", error);
    throw error;
  }
}

/**
 * Backups validieren
 */
async function validateBackups() {
  try {
    const backupDir = "D:\\Backups";
    const auditFile = path.join(backupDir, "audit-log.json");

    const fs = require("fs");

    if (!fs.existsSync(auditFile)) {
      return NextResponse.json({
        status: "ok",
        validation: {
          mysql: { valid: false, error: "Keine Audit-Logs gefunden" },
          project: { valid: false, error: "Keine Audit-Logs gefunden" },
        },
      });
    }

    const auditLogs = JSON.parse(fs.readFileSync(auditFile, "utf8"));
    const lastLog = auditLogs[auditLogs.length - 1];

    return NextResponse.json({
      status: "ok",
      validation: lastLog?.details || {
        mysql: { valid: false, error: "Keine Validierung verfügbar" },
        project: { valid: false, error: "Keine Validierung verfügbar" },
      },
      lastBackup: lastLog?.timestamp || null,
    });
  } catch (error) {
    console.error("Validierungs-Fehler:", error);
    throw error;
  }
}

/**
 * Backup starten
 */
async function startBackup(type: string, user: string) {
  try {
    const backupScript = path.join(process.cwd(), "scripts", "backup-system.js");

    console.log(`🛡️ Backup gestartet von ${user}: ${type}`);

    // Backup-Skript ausführen
    const { stdout, stderr } = await execAsync(`node "${backupScript}" ${type}`);

    if (stderr) {
      console.warn("Backup-Warnung:", stderr);
    }

    return {
      success: true,
      type,
      user,
      timestamp: new Date().toISOString(),
      output: stdout,
      message: "Backup erfolgreich gestartet",
    };
  } catch (error) {
    console.error("Backup-Start Fehler:", error);
    return {
      success: false,
      type,
      user,
      timestamp: new Date().toISOString(),
      error: error.message,
      message: "Backup konnte nicht gestartet werden",
    };
  }
}

/**
 * Speicherplatz abrufen
 */
async function getDiskSpace() {
  try {
    const { stdout } = await execAsync("wmic logicaldisk get size,freespace,caption");

    const lines = stdout.split("\n").filter((line) => line.trim());
    const drives = [];

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 3 && parts[0] && parts[0] !== "Caption") {
        const caption = parts[0];
        const freeSpace = parseInt(parts[1]) || 0;
        const size = parseInt(parts[2]) || 0;

        drives.push({
          drive: caption,
          freeSpace: Math.round((freeSpace / 1024 / 1024 / 1024) * 100) / 100, // GB
          totalSize: Math.round((size / 1024 / 1024 / 1024) * 100) / 100, // GB
          usedSpace: Math.round(((size - freeSpace) / 1024 / 1024 / 1024) * 100) / 100, // GB
          freePercent: Math.round((freeSpace / size) * 100),
        });
      }
    }

    return drives;
  } catch (error) {
    console.warn("Speicherplatz-Abruf Fehler:", error);
    return [];
  }
}
