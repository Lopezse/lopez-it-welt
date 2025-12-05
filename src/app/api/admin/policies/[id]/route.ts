/**
 * Policy Management API - Enterprise++ Standard E.2.4
 * 
 * GET /api/admin/policies/[id] - Policy-Detail
 * PUT /api/admin/policies/[id] - Policy bearbeiten
 * DELETE /api/admin/policies/[id] - Policy löschen
 * 
 * RBAC: policy.view, policy.manage
 */

import { NextRequest, NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const policyId = params.id;

    // RBAC-Prüfung (vereinfacht - in Produktion: echte Session-Prüfung)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const connection = await createConnection();

    // Policy laden
    const [rows] = await connection.execute(
      `SELECT id, name, description, category, type, status, content, version, 
              effective_date, expiry_date, created_at, updated_at
       FROM enterprise_policies
       WHERE id = ?`,
      [policyId]
    );

    const policy = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    if (!policy) {
      await connection.end();
      return NextResponse.json(
        { success: false, error: "Policy nicht gefunden" },
        { status: 404 }
      );
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      data: policy,
    });
  } catch (error) {
    logger.error("Fehler beim Abrufen der Policy", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Abrufen der Policy" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const policyId = params.id;
    const body = await request.json();
    const { name, description, category, type, status, content, version, effective_date, expiry_date } = body;

    // RBAC-Prüfung (vereinfacht - in Produktion: echte Session-Prüfung)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const connection = await createConnection();

    // Policy aktualisieren
    await connection.execute(
      `UPDATE enterprise_policies 
       SET name = ?, description = ?, category = ?, type = ?, status = ?, 
           content = ?, version = ?, effective_date = ?, expiry_date = ?, updated_at = NOW()
       WHERE id = ?`,
      [name, description, category, type, status, content, version, effective_date || null, expiry_date || null, policyId]
    );

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('POLICY_UPDATE', 'enterprise_policies', ?, ?)`,
      [policyId, `Policy aktualisiert: ${name}`]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      data: {
        id: policyId,
        name,
        description,
        category,
        type,
        status,
        version,
      },
    });
  } catch (error) {
    logger.error("Fehler beim Aktualisieren der Policy", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Aktualisieren der Policy" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const policyId = params.id;

    // RBAC-Prüfung (vereinfacht - in Produktion: echte Session-Prüfung)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const connection = await createConnection();

    // Policy löschen (Soft Delete: Status auf 'archived' setzen)
    await connection.execute(
      `UPDATE enterprise_policies 
       SET status = 'archived', updated_at = NOW()
       WHERE id = ?`,
      [policyId]
    );

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('POLICY_DELETE', 'enterprise_policies', ?, ?)`,
      [policyId, `Policy archiviert: ${policyId}`]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Policy erfolgreich archiviert",
    });
  } catch (error) {
    logger.error("Fehler beim Löschen der Policy", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Löschen der Policy" },
      { status: 500 }
    );
  }
}



