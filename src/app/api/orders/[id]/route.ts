/**
 * GET /api/orders/[id]
 * PUT /api/orders/[id]
 * DELETE /api/orders/[id]
 * Einzelauftrag verwalten
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id;
    const connection = await createConnection();

    const [rows] = await connection.execute(
      `SELECT o.*, 
              c.company_name, c.vorname, c.nachname, c.email as customer_email,
              p.project_name, p.project_code
       FROM lopez_orders o
       LEFT JOIN lopez_customers c ON o.customer_id = c.id
       LEFT JOIN lopez_projects p ON o.project_id = p.id
       WHERE o.id = ?`,
      [orderId],
    );

    const order = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Auftrag nicht gefunden" },
        { status: 404 },
      );
    }

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ Order API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden des Auftrags" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id;
    const body = await request.json();
    const { title, description, status, sla_priority, assigned_to } = body;

    const connection = await createConnection();

    const [result] = await connection.execute(
      `UPDATE lopez_orders 
       SET title = ?, description = ?, status = ?, sla_priority = ?, assigned_to = ?, updated_at = NOW()
       WHERE id = ?`,
      [title, description, status, sla_priority, assigned_to, orderId],
    );

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('ORDER_UPDATE', 'lopez_orders', ?, ?)`,
      [orderId, `Auftrag aktualisiert: ${title}`],
    );

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: { message: "Auftrag erfolgreich aktualisiert" },
      },
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("❌ Order API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Aktualisieren des Auftrags" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id;
    const connection = await createConnection();

    // Audit-Log vor Löschung
    const [orderRows] = await connection.execute("SELECT title FROM lopez_orders WHERE id = ?", [
      orderId,
    ]);
    const order = Array.isArray(orderRows) && (orderRows[0] as any);

    await connection.execute("DELETE FROM lopez_orders WHERE id = ?", [orderId]);

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('ORDER_DELETE', 'lopez_orders', ?, ?)`,
      [orderId, `Auftrag gelöscht: ${order?.title || orderId}`],
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      data: { message: "Auftrag erfolgreich gelöscht" },
    });
  } catch (error) {
    console.error("❌ Order API Fehler:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Löschen des Auftrags" },
      { status: 500 },
    );
  }
}
