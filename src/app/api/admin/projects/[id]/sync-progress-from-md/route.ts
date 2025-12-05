// =====================================================
// ENTERPRISE++ PROJECT PROGRESS SYNC FROM MD API
// =====================================================
// POST /api/admin/projects/[id]/sync-progress-from-md
// Synchronisiert Fortschritt aus STATUS.md in die Datenbank
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { getProjectProgressFromMd } from "@/lib/projectProgressFromMd";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Projekt-ID" },
        { status: 400 }
      );
    }
    
    const pool = await getConnection();
    
    // Projekt laden
    const [projectRows] = await pool.execute(
      "SELECT id, project_name, project_code FROM lopez_projects WHERE id = ?",
      [projectId]
    );
    
    const projects = projectRows as any[];
    
    if (projects.length === 0) {
      return NextResponse.json(
        { success: false, error: "Projekt nicht gefunden" },
        { status: 404 }
      );
    }
    
    const project = projects[0];
    
    // Fortschritt aus STATUS.md lesen
    const progress = await getProjectProgressFromMd(project.project_name);
    
    // Prüfe ob Spalten existieren, falls nicht -> erstellen (idempotent)
    await ensureProgressColumns(pool);
    
    // Fortschritt in DB speichern
    await pool.execute(
      `UPDATE lopez_projects 
       SET progress_percent = ?,
           progress_status_text = ?,
           last_progress_update = NOW()
       WHERE id = ?`,
      [progress.progressPercent, progress.statusText, projectId]
    );
    
    // Audit-Log
    await pool.execute(
      `INSERT INTO lopez_audit_logs (user_id, action, entity_type, entity_id, details, severity)
       VALUES (?, 'PROJECT_PROGRESS_SYNC', 'project', ?, ?, 'info')`,
      [
        1, // TODO: Aus Session
        projectId,
        JSON.stringify({
          source: progress.source,
          progressPercent: progress.progressPercent,
          totalItems: progress.totalItems,
          doneItems: progress.doneItems,
          partialItems: progress.partialItems,
          lastModified: progress.lastModified,
        }),
      ]
    );
    
    return NextResponse.json({
      success: true,
      message: "Projektstatus aus STATUS.md synchronisiert",
      data: {
        projectId,
        projectName: project.project_name,
        progressPercent: progress.progressPercent,
        statusText: progress.statusText,
        totalItems: progress.totalItems,
        doneItems: progress.doneItems,
        partialItems: progress.partialItems,
        source: progress.source,
        lastModified: progress.lastModified,
      },
    });
    
  } catch (error) {
    console.error("Project Progress Sync Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Synchronisieren des Fortschritts" },
      { status: 500 }
    );
  }
}

/**
 * Stellt sicher, dass die Progress-Spalten in lopez_projects existieren
 * (idempotente Operation)
 */
async function ensureProgressColumns(pool: any): Promise<void> {
  try {
    // Prüfe ob Spalte existiert
    const [columns] = await pool.execute(
      `SELECT COLUMN_NAME 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() 
       AND TABLE_NAME = 'lopez_projects' 
       AND COLUMN_NAME = 'progress_percent'`
    );
    
    if ((columns as any[]).length === 0) {
      // Spalten hinzufügen
      await pool.execute(`
        ALTER TABLE lopez_projects
        ADD COLUMN progress_percent TINYINT UNSIGNED DEFAULT 0 AFTER status,
        ADD COLUMN progress_status_text TEXT NULL AFTER progress_percent,
        ADD COLUMN last_progress_update DATETIME NULL AFTER progress_status_text
      `);
      console.log("✅ Progress-Spalten zu lopez_projects hinzugefügt");
    }
  } catch (error) {
    // Fehler ignorieren falls Spalten schon existieren
    console.log("Progress-Spalten existieren bereits oder Fehler:", error);
  }
}

// GET - Aktuellen Fortschritt abrufen (ohne Sync)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Projekt-ID" },
        { status: 400 }
      );
    }
    
    const pool = await getConnection();
    
    // Projekt mit Progress laden
    const [projectRows] = await pool.execute(
      `SELECT id, project_name, project_code, 
              progress_percent, progress_status_text, last_progress_update
       FROM lopez_projects WHERE id = ?`,
      [projectId]
    );
    
    const projects = projectRows as any[];
    
    if (projects.length === 0) {
      return NextResponse.json(
        { success: false, error: "Projekt nicht gefunden" },
        { status: 404 }
      );
    }
    
    const project = projects[0];
    
    return NextResponse.json({
      success: true,
      data: {
        projectId: project.id,
        projectName: project.project_name,
        progressPercent: project.progress_percent || 0,
        statusText: project.progress_status_text || "Noch nicht synchronisiert",
        lastUpdate: project.last_progress_update,
      },
    });
    
  } catch (error) {
    console.error("Project Progress GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden des Fortschritts" },
      { status: 500 }
    );
  }
}









