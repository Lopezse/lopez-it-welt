// =====================================================
// LOPEZ IT WELT DOKUMENTATIONS-API
// =====================================================
// Enterprise++ Dokumentations-System
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

interface Document {
  id: number;
  title: string;
  content: string;
  category: "system" | "howto" | "changelog" | "internal";
  created_at: string;
  updated_at: string;
}

// GET /api/admin/docs - Liste aller Dokumente mit Filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "lopez_erp",
    });

    // Basis-Query
    let whereConditions: string[] = [];
    let queryParams: any[] = [];

    // Kategorie-Filter
    if (category !== "all") {
      whereConditions.push("category = ?");
      queryParams.push(category);
    }

    // Such-Filter
    if (search) {
      whereConditions.push("(title LIKE ? OR content LIKE ?)");
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    // Gesamtanzahl für Pagination
    const countQuery = `
            SELECT COUNT(*) as total 
            FROM lopez_business_docs 
            ${whereClause}
        `;
    const [countResult] = await connection.execute(countQuery, queryParams);
    const total = (countResult as any)[0].total;

    // Dokumente abrufen
    const docsQuery = `
            SELECT id, title, content, category, created_at, updated_at
            FROM lopez_business_docs 
            ${whereClause}
            ORDER BY updated_at DESC
            LIMIT ? OFFSET ?
        `;
    const [docsResult] = await connection.execute(docsQuery, [...queryParams, limit, offset]);

    await connection.end();

    return NextResponse.json({
      success: true,
      data: docsResult,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    // Fehler beim Laden der Dokumente: ${error}
    return NextResponse.json({ error: "Fehler beim Laden der Dokumente" }, { status: 500 });
  }
}

// POST /api/admin/docs - Neues Dokument erstellen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category } = body;

    // Validierung
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Titel, Inhalt und Kategorie sind erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "lopez_erp",
    });

    const insertQuery = `
            INSERT INTO lopez_business_docs (title, content, category)
            VALUES (?, ?, ?)
        `;

    const [result] = await connection.execute(insertQuery, [title, content, category]);
    const documentId = (result as any).insertId;

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Dokument erfolgreich erstellt",
      data: { id: documentId },
    });
  } catch (error) {
    // Fehler beim Erstellen des Dokuments: ${error}
    return NextResponse.json({ error: "Fehler beim Erstellen des Dokuments" }, { status: 500 });
  }
}
