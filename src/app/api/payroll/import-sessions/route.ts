/**
 * POST /api/payroll/import-sessions
 * Importiert approved work_sessions in Payroll-Einträge
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let connection: any = null;

  try {
    const body = await request.json();
    const {
      period_id,
      user_id,
      hourly_rate,
      from_date,
      to_date,
    } = body;

    if (!period_id || !user_id || !hourly_rate) {
      return NextResponse.json(
        {
          success: false,
          error: "period_id, user_id und hourly_rate sind erforderlich",
        },
        { status: 400 },
      );
    }

    connection = await createConnection();

    // Abfrage: approved & !invoiced Sessions mit Projekt- und Aufgaben-Infos
    let query = `
      SELECT ws.*,
             ws.dauer_min / 60.0 as hours_worked,
             DATE(ws.start_time) as work_date,
             p.project_name,
             t.task_title
      FROM work_sessions ws
      LEFT JOIN lopez_projects p ON ws.project_id = p.id
      LEFT JOIN lopez_tasks t ON ws.task_id = t.id
      WHERE ws.user_id = ?
        AND ws.approved = 1
        AND ws.invoiced = 0
        AND ws.status = 'gut'
        AND ws.end_time IS NOT NULL
        AND ws.dauer_min IS NOT NULL
    `;
    const params: any[] = [user_id];

    if (from_date) {
      query += " AND DATE(ws.start_time) >= ?";
      params.push(from_date);
    }

    if (to_date) {
      query += " AND DATE(ws.start_time) <= ?";
      params.push(to_date);
    }

    query += " ORDER BY ws.start_time ASC";

    const [sessions] = await connection.execute(query, params);

    if (!Array.isArray(sessions) || sessions.length === 0) {
      return NextResponse.json(
        {
          success: true,
          data: {
            imported: 0,
            message: "Keine Sessions zum Importieren gefunden",
          },
        },
        { status: 200 },
      );
    }

    // Sessions in Payroll-Einträge umwandeln
    const imported = [];
    for (const session of sessions) {
      const hoursWorked = parseFloat(session.hours_worked) || 0;
      if (hoursWorked <= 0) continue; // Überspringe Sessions ohne Stunden

      const amount = hoursWorked * parseFloat(hourly_rate);

      try {
        // Prüfe ob Eintrag bereits existiert
        const [existing] = await connection.execute(
          "SELECT id FROM lopez_payroll_entries WHERE session_id = ? AND period_id = ?",
          [session.id, period_id],
        );

        if (Array.isArray(existing) && existing.length > 0) {
          continue; // Bereits importiert
        }

        // Payroll-Eintrag erstellen
        const [result] = await connection.execute(
          `INSERT INTO lopez_payroll_entries 
           (period_id, user_id, session_id, project_id, order_id, task_id, work_date, hours_worked, hourly_rate, amount, category, description, created_by)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            period_id,
            user_id,
            session.id,
            session.project_id || null,
            session.order_id || null,
            session.task_id || null,
            session.work_date || session.start_time?.slice(0, 10),
            hoursWorked,
            hourly_rate,
            amount,
            session.kategorie || session.category || "umsetzung",
            // Rechnungsformat: Projekt: {project_name} – Aufgabe: {task_name} — {taetigkeit}
            session.project_name && session.task_title && session.taetigkeit
              ? `Projekt: ${session.project_name} – Aufgabe: ${session.task_title} — ${session.taetigkeit}`
              : session.taetigkeit || session.beschreibung || null,
            "system",
          ],
        );

        const entryId = (result as any).insertId;
        imported.push({
          entry_id: entryId,
          session_id: session.id,
          hours_worked: hoursWorked,
          amount: amount,
        });

        // Session als abgerechnet markieren
        await connection.execute(
          "UPDATE work_sessions SET invoiced = 1 WHERE id = ?",
          [session.id],
        );
      } catch (insertError: any) {
        console.error(`⚠️ Fehler beim Importieren von Session ${session.id}:`, insertError);
        // Weiter mit nächster Session
      }
    }

    // Audit-Log
    try {
      await connection.execute(
        `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
         VALUES ('PAYROLL_IMPORT_SESSIONS', 'lopez_payroll_entries', ?, ?)`,
        [
          period_id,
          `${imported.length} Sessions in Payroll-Periode ${period_id} importiert`,
        ],
      );
    } catch (auditError) {
      console.error("⚠️ Audit-Log Fehler:", auditError);
      // Nicht blockierend
    }

    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          imported: imported.length,
          entries: imported,
          message: `${imported.length} Sessions erfolgreich importiert`,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("❌ Payroll Import Sessions API Fehler:", error);
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Fehler beim Importieren der Sessions",
      },
      { status: 500 },
    );
  }
}


 * Importiert approved work_sessions in Payroll-Einträge
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let connection: any = null;

  try {
    const body = await request.json();
    const {
      period_id,
      user_id,
      hourly_rate,
      from_date,
      to_date,
    } = body;

    if (!period_id || !user_id || !hourly_rate) {
      return NextResponse.json(
        {
          success: false,
          error: "period_id, user_id und hourly_rate sind erforderlich",
        },
        { status: 400 },
      );
    }

    connection = await createConnection();

    // Abfrage: approved & !invoiced Sessions mit Projekt- und Aufgaben-Infos
    let query = `
      SELECT ws.*,
             ws.dauer_min / 60.0 as hours_worked,
             DATE(ws.start_time) as work_date,
             p.project_name,
             t.task_title
      FROM work_sessions ws
      LEFT JOIN lopez_projects p ON ws.project_id = p.id
      LEFT JOIN lopez_tasks t ON ws.task_id = t.id
      WHERE ws.user_id = ?
        AND ws.approved = 1
        AND ws.invoiced = 0
        AND ws.status = 'gut'
        AND ws.end_time IS NOT NULL
        AND ws.dauer_min IS NOT NULL
    `;
    const params: any[] = [user_id];

    if (from_date) {
      query += " AND DATE(ws.start_time) >= ?";
      params.push(from_date);
    }

    if (to_date) {
      query += " AND DATE(ws.start_time) <= ?";
      params.push(to_date);
    }

    query += " ORDER BY ws.start_time ASC";

    const [sessions] = await connection.execute(query, params);

    if (!Array.isArray(sessions) || sessions.length === 0) {
      return NextResponse.json(
        {
          success: true,
          data: {
            imported: 0,
            message: "Keine Sessions zum Importieren gefunden",
          },
        },
        { status: 200 },
      );
    }

    // Sessions in Payroll-Einträge umwandeln
    const imported = [];
    for (const session of sessions) {
      const hoursWorked = parseFloat(session.hours_worked) || 0;
      if (hoursWorked <= 0) continue; // Überspringe Sessions ohne Stunden

      const amount = hoursWorked * parseFloat(hourly_rate);

      try {
        // Prüfe ob Eintrag bereits existiert
        const [existing] = await connection.execute(
          "SELECT id FROM lopez_payroll_entries WHERE session_id = ? AND period_id = ?",
          [session.id, period_id],
        );

        if (Array.isArray(existing) && existing.length > 0) {
          continue; // Bereits importiert
        }

        // Payroll-Eintrag erstellen
        const [result] = await connection.execute(
          `INSERT INTO lopez_payroll_entries 
           (period_id, user_id, session_id, project_id, order_id, task_id, work_date, hours_worked, hourly_rate, amount, category, description, created_by)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            period_id,
            user_id,
            session.id,
            session.project_id || null,
            session.order_id || null,
            session.task_id || null,
            session.work_date || session.start_time?.slice(0, 10),
            hoursWorked,
            hourly_rate,
            amount,
            session.kategorie || session.category || "umsetzung",
            // Rechnungsformat: Projekt: {project_name} – Aufgabe: {task_name} — {taetigkeit}
            session.project_name && session.task_title && session.taetigkeit
              ? `Projekt: ${session.project_name} – Aufgabe: ${session.task_title} — ${session.taetigkeit}`
              : session.taetigkeit || session.beschreibung || null,
            "system",
          ],
        );

        const entryId = (result as any).insertId;
        imported.push({
          entry_id: entryId,
          session_id: session.id,
          hours_worked: hoursWorked,
          amount: amount,
        });

        // Session als abgerechnet markieren
        await connection.execute(
          "UPDATE work_sessions SET invoiced = 1 WHERE id = ?",
          [session.id],
        );
      } catch (insertError: any) {
        console.error(`⚠️ Fehler beim Importieren von Session ${session.id}:`, insertError);
        // Weiter mit nächster Session
      }
    }

    // Audit-Log
    try {
      await connection.execute(
        `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
         VALUES ('PAYROLL_IMPORT_SESSIONS', 'lopez_payroll_entries', ?, ?)`,
        [
          period_id,
          `${imported.length} Sessions in Payroll-Periode ${period_id} importiert`,
        ],
      );
    } catch (auditError) {
      console.error("⚠️ Audit-Log Fehler:", auditError);
      // Nicht blockierend
    }

    if (connection) {
      await connection.end();
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          imported: imported.length,
          entries: imported,
          message: `${imported.length} Sessions erfolgreich importiert`,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("❌ Payroll Import Sessions API Fehler:", error);
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Fehler beim Importieren der Sessions",
      },
      { status: 500 },
    );
  }
}

