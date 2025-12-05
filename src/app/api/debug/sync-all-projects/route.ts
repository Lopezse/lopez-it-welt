// =====================================================
// DEBUG: SYNC ALL PROJECTS FROM STATUS.MD
// =====================================================
// GET /api/debug/sync-all-projects
// Synchronisiert ALLE Projekte aus STATUS.md
// =====================================================

import { NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { getProjectProgressFromMd } from "@/lib/projectProgressFromMd";

export async function GET() {
  try {
    const pool = await getConnection();
    const results: any[] = [];
    
    // 1. Prüfe/Erstelle Progress-Spalten
    let columnsCreated = false;
    try {
      const [columns] = await pool.execute(
        `SELECT COLUMN_NAME 
         FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = DATABASE() 
         AND TABLE_NAME = 'lopez_projects' 
         AND COLUMN_NAME = 'progress_percent'`
      );
      
      if ((columns as any[]).length === 0) {
        await pool.execute(`
          ALTER TABLE lopez_projects
          ADD COLUMN progress_percent TINYINT UNSIGNED DEFAULT 0 AFTER status,
          ADD COLUMN progress_status_text TEXT NULL AFTER progress_percent,
          ADD COLUMN last_progress_update DATETIME NULL AFTER progress_status_text
        `);
        columnsCreated = true;
      }
    } catch (err: any) {
      // Spalten existieren wahrscheinlich schon
      console.log("Spalten-Check:", err.message);
    }
    
    // 2. Lade alle Projekte
    const [projectRows] = await pool.execute(
      "SELECT id, project_name, project_code, progress_percent, progress_status_text FROM lopez_projects"
    );
    
    const projects = projectRows as any[];
    
    if (projects.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Keine Projekte gefunden",
        columnsCreated,
        projects: [],
      });
    }
    
    // 3. Sync jedes Projekt
    for (const project of projects) {
      try {
        const progress = await getProjectProgressFromMd(project.project_name);
        
        await pool.execute(
          `UPDATE lopez_projects 
           SET progress_percent = ?,
               progress_status_text = ?,
               last_progress_update = NOW()
           WHERE id = ?`,
          [progress.progressPercent, progress.statusText, project.id]
        );
        
        results.push({
          id: project.id,
          name: project.project_name,
          oldProgress: project.progress_percent || 0,
          newProgress: progress.progressPercent,
          statusText: progress.statusText,
          totalItems: progress.totalItems,
          doneItems: progress.doneItems,
          synced: true,
        });
      } catch (err: any) {
        results.push({
          id: project.id,
          name: project.project_name,
          error: err.message,
          synced: false,
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `${results.filter(r => r.synced).length} von ${projects.length} Projekten synchronisiert`,
      columnsCreated,
      results,
    });
    
  } catch (error: any) {
    console.error("Debug Sync Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}









