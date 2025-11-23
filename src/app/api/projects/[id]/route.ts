/**
 * GET /api/projects/[id]
 * PUT /api/projects/[id]
 * DELETE /api/projects/[id]
 * Einzelprojekt verwalten
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id;
    const connection = await createConnection();

    const [rows] = await connection.execute(
      `SELECT p.*, c.company_name, c.vorname, c.nachname, c.email
       FROM lopez_projects p
       LEFT JOIN lopez_customers c ON p.customer_id = c.id
       WHERE p.id = ?`,
      [projectId],
    );

    const project = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Projekt nicht gefunden" },
        { status: 404 },
      );
    }

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: project,
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ Project API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden des Projekts" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id;
    const body = await request.json();
    const { project_name, description, start_date, end_date, status, updated_by } = body;

    const connection = await createConnection();

    const [result] = await connection.execute(
      `UPDATE lopez_projects 
       SET project_name = ?, description = ?, start_date = ?, end_date = ?, status = ?, updated_by = ?, updated_at = NOW()
       WHERE id = ?`,
      [project_name, description, start_date, end_date, status, updated_by, projectId],
    );

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (user_id, action, ref_table, ref_id, notes)
       VALUES (?, 'PROJECT_UPDATE', 'lopez_projects', ?, ?)`,
      [updated_by, projectId, `Projekt aktualisiert: ${project_name}`],
    );

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: { message: "Projekt erfolgreich aktualisiert" },
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ Project API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Aktualisieren des Projekts" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id;
    const connection = await createConnection();

    // Audit-Log vor Löschung
    const [projectRows] = await connection.execute(
      "SELECT project_name FROM lopez_projects WHERE id = ?",
      [projectId],
    );
    const project = Array.isArray(projectRows) && (projectRows[0] as any);

    await connection.execute("DELETE FROM lopez_projects WHERE id = ?", [projectId]);

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('PROJECT_DELETE', 'lopez_projects', ?, ?)`,
      [projectId, `Projekt gelöscht: ${project?.project_name || projectId}`],
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      data: { message: "Projekt erfolgreich gelöscht" },
    });
  } catch (error) {
    console.error("❌ Project API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Löschen des Projekts" },
      { status: 500 },
    );
  }
}
