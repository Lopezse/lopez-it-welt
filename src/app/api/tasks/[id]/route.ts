/**
 * GET /api/tasks/[id]
 * PUT /api/tasks/[id]
 * DELETE /api/tasks/[id]
 * Einzelaufgabe verwalten
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const taskId = params.id;
    const connection = await createConnection();

    const [rows] = await connection.execute(
      `SELECT t.*,
              o.title as order_title, o.order_no,
              p.project_name, p.project_code
       FROM lopez_tasks t
       LEFT JOIN lopez_orders o ON t.order_id = o.id
       LEFT JOIN lopez_projects p ON t.project_id = p.id
       WHERE t.id = ?`,
      [taskId],
    );

    const task = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    if (!task) {
      return NextResponse.json(
        { success: false, error: "Aufgabe nicht gefunden" },
        { status: 404 },
      );
    }

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: task,
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ Task API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden der Aufgabe" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const taskId = params.id;
    const body = await request.json();
    const { title, description, due_date, priority, status, assigned_to } = body;

    const connection = await createConnection();

    const [result] = await connection.execute(
      `UPDATE lopez_tasks 
       SET title = ?, description = ?, due_date = ?, priority = ?, status = ?, assigned_to = ?, updated_at = NOW()
       WHERE id = ?`,
      [title, description, due_date || null, priority, status, assigned_to || null, taskId],
    );

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('TASK_UPDATE', 'lopez_tasks', ?, ?)`,
      [taskId, `Aufgabe aktualisiert: ${title}`],
    );

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: { message: "Aufgabe erfolgreich aktualisiert" },
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ Task API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Aktualisieren der Aufgabe" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const taskId = params.id;
    const connection = await createConnection();

    // Audit-Log vor Löschung
    const [taskRows] = await connection.execute("SELECT title FROM lopez_tasks WHERE id = ?", [
      taskId,
    ]);
    const task = Array.isArray(taskRows) && (taskRows[0] as any);

    await connection.execute("DELETE FROM lopez_tasks WHERE id = ?", [taskId]);

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('TASK_DELETE', 'lopez_tasks', ?, ?)`,
      [taskId, `Aufgabe gelöscht: ${task?.title || taskId}`],
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      data: { message: "Aufgabe erfolgreich gelöscht" },
    });
  } catch (error) {
    console.error("❌ Task API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Löschen der Aufgabe" },
      { status: 500 },
    );
  }
}
