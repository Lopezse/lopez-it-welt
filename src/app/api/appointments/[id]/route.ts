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

    // Dynamisches UPDATE basierend auf übergebenen Feldern
    const updates: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      updates.push("title = ?");
      values.push(title);
    }
    if (date_start !== undefined) {
      updates.push("date_start = ?");
      values.push(date_start);
    }
    if (date_end !== undefined) {
      updates.push("date_end = ?");
      values.push(date_end);
    }
    if (location !== undefined) {
      updates.push("location = ?");
      values.push(location);
    }
    if (notes !== undefined) {
      updates.push("notes = ?");
      values.push(notes);
    }
    if (is_all_day !== undefined) {
      updates.push("is_all_day = ?");
      values.push(is_all_day ? 1 : 0);
    }
    if (project_id !== undefined) {
      updates.push("project_id = ?");
      values.push(project_id || null);
    }
    if (order_id !== undefined) {
      updates.push("order_id = ?");
      values.push(order_id || null);
    }
    if (task_id !== undefined) {
      updates.push("task_id = ?");
      values.push(task_id || null);
    }
    if (employee_id !== undefined) {
      updates.push("employee_id = ?");
      values.push(employee_id || null);
    }
    if (is_billable !== undefined) {
      updates.push("is_billable = ?");
      values.push(is_billable ? 1 : 0);
    }
    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }
    if (time_session_id !== undefined) {
      updates.push("time_session_id = ?");
      values.push(time_session_id || null);
    }

    if (updates.length === 0) {
      await connection.end();
      return NextResponse.json(
        { success: false, error: "Keine Felder zum Aktualisieren angegeben" },
        { status: 400 },
      );
    }

    values.push(appointmentId);

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


    values.push(appointmentId);

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
