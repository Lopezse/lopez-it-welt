/**
 * GET /api/appointments/[id]
 * PUT /api/appointments/[id]
 * DELETE /api/appointments/[id]
 * Einzeltermin verwalten
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const appointmentId = params.id;
    const connection = await createConnection();

    const [rows] = await connection.execute(
      `SELECT a.*,
              p.project_name, p.project_code,
              o.title as order_title, o.order_no,
              t.title as task_title
       FROM lopez_appointments a
       LEFT JOIN lopez_projects p ON a.project_id = p.id
       LEFT JOIN lopez_orders o ON a.order_id = o.id
       LEFT JOIN lopez_tasks t ON a.task_id = t.id
       WHERE a.id = ?`,
      [appointmentId],
    );

    const appointment = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    if (!appointment) {
      return NextResponse.json({ success: false, error: "Termin nicht gefunden" }, { status: 404 });
    }

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: appointment,
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ Appointment API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden des Termins" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const appointmentId = params.id;
    const body = await request.json();
    const {
      title,
      date_start,
      date_end,
      location,
      notes,
      is_all_day,
      project_id,
      order_id,
      task_id,
      employee_id,
      is_billable,
      status,
      time_session_id,
    } = body;

    const connection = await createConnection();

    // Enterprise++ ALLOWED_FIELDS Whitelist
    // @sql-safe: Nur Felder aus ALLOWED_FIELDS werden akzeptiert
    const ALLOWED_FIELDS = [
      "title", "date_start", "date_end", "location", "notes",
      "is_all_day", "project_id", "order_id", "task_id", 
      "employee_id", "is_billable", "status", "time_session_id"
    ] as const;
    
    // Felder die als Boolean/Null behandelt werden
    const BOOLEAN_FIELDS = ["is_all_day", "is_billable"] as const;
    const NULLABLE_FIELDS = ["project_id", "order_id", "task_id", "employee_id", "time_session_id"] as const;

    const updates: string[] = [];
    const values: any[] = [];

    // Nur erlaubte Felder verarbeiten
    for (const field of ALLOWED_FIELDS) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        
        if ((BOOLEAN_FIELDS as readonly string[]).includes(field)) {
          values.push(body[field] ? 1 : 0);
        } else if ((NULLABLE_FIELDS as readonly string[]).includes(field)) {
          values.push(body[field] || null);
        } else {
          values.push(body[field]);
        }
      }
    }

    if (updates.length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, error: "Keine Felder zum Aktualisieren angegeben" },
        { status: 400 },
      );
    }

    values.push(appointmentId);

    // @sql-safe: SET-Klausel aus ALLOWED_FIELDS Whitelist
    const [result] = await connection.execute(
      `UPDATE lopez_appointments 
       SET ${updates.join(", ")}
       WHERE id = ?`,
      values,
    );

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('APPOINTMENT_UPDATE', 'lopez_appointments', ?, ?)`,
      [appointmentId, `Termin aktualisiert: ${title || appointmentId}`],
    );

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: { message: "Termin erfolgreich aktualisiert" },
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ Appointment API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Aktualisieren des Termins" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  // PATCH ist Alias für PUT (partielle Updates)
  return PUT(request, { params });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const appointmentId = params.id;
    const connection = await createConnection();

    // Audit-Log vor Löschung
    const [appointmentRows] = await connection.execute(
      "SELECT title FROM lopez_appointments WHERE id = ?",
      [appointmentId],
    );
    const appointment = Array.isArray(appointmentRows) && (appointmentRows[0] as any);

    await connection.execute("DELETE FROM lopez_appointments WHERE id = ?", [appointmentId]);

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('APPOINTMENT_DELETE', 'lopez_appointments', ?, ?)`,
      [appointmentId, `Termin gelöscht: ${appointment?.title || appointmentId}`],
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      data: { message: "Termin erfolgreich gelöscht" },
    });
  } catch (error) {
    console.error("❌ Appointment API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Löschen des Termins" },
      { status: 500 },
    );
  }
}
