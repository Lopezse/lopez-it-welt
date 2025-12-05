/**
 * Policy Management API - Enterprise++ Standard E.2.4
 * 
 * GET /api/admin/policies - Policy-Liste
 * POST /api/admin/policies - Policy erstellen
 * 
 * RBAC: policy.view, policy.manage
 */

import { NextRequest, NextResponse } from "next/server";
import { createConnection } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    // RBAC-Prüfung (vereinfacht - in Produktion: echte Session-Prüfung)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const connection = await createConnection();

    // Policies laden
    const [rows] = await connection.execute(
      `SELECT id, name, description, category, type, status, version, 
              effective_date, expiry_date, created_at, updated_at
       FROM enterprise_policies
       ORDER BY updated_at DESC`
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      data: Array.isArray(rows) ? rows : [],
    });
  } catch (error) {
    logger.error("Fehler beim Abrufen der Policies", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Abrufen der Policies" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, category, type, status, content, version, effective_date, expiry_date } = body;

    if (!name || !description || !category || !type || !content) {
      return NextResponse.json(
        { success: false, error: "Name, Beschreibung, Kategorie, Typ und Inhalt sind erforderlich" },
        { status: 400 }
      );
    }

    // RBAC-Prüfung (vereinfacht - in Produktion: echte Session-Prüfung)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const connection = await createConnection();

    // Policy erstellen
    const [result] = await connection.execute(
      `INSERT INTO enterprise_policies 
       (name, description, category, type, status, content, version, effective_date, expiry_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, description, category, type, status || "draft", content, version || 1, effective_date || null, expiry_date || null]
    );

    const insertResult = result as any;
    const policyId = insertResult.insertId;

    // Audit-Log
    await connection.execute(
      `INSERT INTO lopez_audit_logs (action, ref_table, ref_id, notes)
       VALUES ('POLICY_CREATE', 'enterprise_policies', ?, ?)`,
      [policyId, `Policy erstellt: ${name}`]
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
        status: status || "draft",
        version: version || 1,
      },
    });
  } catch (error) {
    logger.error("Fehler beim Erstellen der Policy", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Erstellen der Policy" },
      { status: 500 }
    );
  }
}



