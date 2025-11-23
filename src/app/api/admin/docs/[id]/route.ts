// =====================================================
// LOPEZ IT WELT DOKUMENTATIONS-API (EINZELNE DOKUMENTE)
// =====================================================
// Enterprise++ Dokumentations-System
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/docs/[id] - Einzelnes Dokument abrufen
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const documentId = parseInt(id);

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "lopez_erp",
    });

    const query = `
            SELECT id, title, content, category, created_at, updated_at
            FROM lopez_business_docs 
            WHERE id = ?
        `;

    const [result] = await connection.execute(query, [documentId]);
    await connection.end();

    if ((result as any[]).length === 0) {
      return NextResponse.json({ error: "Dokument nicht gefunden" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: (result as any[])[0],
    });
  } catch (error) {
    // Fehler beim Laden des Dokuments: ${error}
    return NextResponse.json({ error: "Fehler beim Laden des Dokuments" }, { status: 500 });
  }
}

// PATCH /api/admin/docs/[id] - Dokument aktualisieren
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const documentId = parseInt(id);
    const body = await request.json();
    const { title, content, category } = body;

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "lopez_erp",
    });

    // Prüfen ob Dokument existiert
    const checkQuery = `SELECT id FROM lopez_business_docs WHERE id = ?`;
    const [checkResult] = await connection.execute(checkQuery, [documentId]);

    if ((checkResult as any[]).length === 0) {
      await connection.end();
      return NextResponse.json({ error: "Dokument nicht gefunden" }, { status: 404 });
    }

    // Update-Query
    const updateQuery = `
            UPDATE lopez_business_docs 
            SET title = ?, content = ?, category = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

    await connection.execute(updateQuery, [title, content, category, documentId]);
    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Dokument erfolgreich aktualisiert",
    });
  } catch (error) {
    // Fehler beim Aktualisieren des Dokuments: ${error}
    return NextResponse.json({ error: "Fehler beim Aktualisieren des Dokuments" }, { status: 500 });
  }
}

// DELETE /api/admin/docs/[id] - Dokument löschen
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const documentId = parseInt(id);

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "lopez_erp",
    });

    // Prüfen ob Dokument existiert
    const checkQuery = `SELECT id FROM lopez_business_docs WHERE id = ?`;
    const [checkResult] = await connection.execute(checkQuery, [documentId]);

    if ((checkResult as any[]).length === 0) {
      await connection.end();
      return NextResponse.json({ error: "Dokument nicht gefunden" }, { status: 404 });
    }

    // Dokument löschen
    const deleteQuery = `DELETE FROM lopez_business_docs WHERE id = ?`;
    await connection.execute(deleteQuery, [documentId]);
    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Dokument erfolgreich gelöscht",
    });
  } catch (error) {
    // Fehler beim Löschen des Dokuments: ${error}
    return NextResponse.json({ error: "Fehler beim Löschen des Dokuments" }, { status: 500 });
  }
}
