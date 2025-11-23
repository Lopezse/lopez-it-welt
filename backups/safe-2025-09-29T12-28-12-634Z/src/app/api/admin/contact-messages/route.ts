import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/contact-messages - Liste aller Kontakt-Nachrichten
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const priority = searchParams.get("priority") || "all";
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
    let whereConditions = ["is_spam = 0"];
    let queryParams: any[] = [];

    // Status-Filter
    if (status !== "all") {
      whereConditions.push("status = ?");
      queryParams.push(status);
    }

    // Priority-Filter
    if (priority !== "all") {
      whereConditions.push("priority = ?");
      queryParams.push(priority);
    }

    // Such-Filter
    if (search) {
      whereConditions.push("(name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)");
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    // Gesamtanzahl für Pagination
    const countQuery = `
            SELECT COUNT(*) as total 
            FROM lopez_business_contact_messages 
            ${whereClause}
        `;
    const [countResult] = await connection.execute(countQuery, queryParams);
    const total = (countResult as any)[0].total;

    // Daten-Query
    const dataQuery = `
            SELECT 
                id,
                name,
                email,
                phone,
                company,
                subject,
                LEFT(message, 200) as message_preview,
                status,
                priority,
                assigned_to,
                response_sent_at,
                created_at,
                updated_at
            FROM lopez_business_contact_messages 
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `;

    const [rows] = await connection.execute(dataQuery, [...queryParams, limit, offset]);

    // Statistiken
    const statsQuery = `
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'neu' THEN 1 END) as new_count,
                COUNT(CASE WHEN status = 'in_bearbeitung' THEN 1 END) as in_progress_count,
                COUNT(CASE WHEN status = 'erledigt' THEN 1 END) as completed_count,
                COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END) as last_24h
            FROM lopez_business_contact_messages 
            WHERE is_spam = FALSE
        `;
    const [statsResult] = await connection.execute(statsQuery);
    const stats = (statsResult as any)[0];

    await connection.end();

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats,
    });
  } catch (error) {
    // Fehler beim Laden der Kontakt-Nachrichten: ${error}
    return NextResponse.json(
      { error: "Fehler beim Laden der Kontakt-Nachrichten" },
      { status: 500 },
    );
  }
}

// POST /api/admin/contact-messages - Neue Nachricht erstellen (für Testing)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, subject, message, priority = "normal" } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Name, E-Mail, Betreff und Nachricht sind erforderlich" },
        { status: 400 },
      );
    }

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "lopez_erp",
    });

    const query = `
            INSERT INTO lopez_business_contact_messages 
            (name, email, phone, company, subject, message, priority, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const [result] = await connection.execute(query, [
      name,
      email,
      phone || null,
      company || null,
      subject,
      message,
      priority,
      "admin",
    ]);

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Kontakt-Nachricht erfolgreich erstellt",
      id: (result as any).insertId,
    });
  } catch (error) {
    // Fehler beim Erstellen der Kontakt-Nachricht: ${error}
    return NextResponse.json(
      { error: "Fehler beim Erstellen der Kontakt-Nachricht" },
      { status: 500 },
    );
  }
}
