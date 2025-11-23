import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/contact-messages/export - Export der Kontakt-Nachrichten
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv";
    const status = searchParams.get("status") || "all";
    const priority = searchParams.get("priority") || "all";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "lopez_erp",
    });

    // Basis-Query
    let whereConditions = ["is_spam = FALSE"];
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

    // Datum-Filter
    if (dateFrom) {
      whereConditions.push("created_at >= ?");
      queryParams.push(dateFrom);
    }

    if (dateTo) {
      whereConditions.push("created_at <= ?");
      queryParams.push(dateTo);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    // Daten laden
    const query = `
            SELECT 
                id,
                name,
                email,
                phone,
                company,
                subject,
                message,
                status,
                priority,
                assigned_to,
                response_message,
                response_sent_at,
                notes,
                created_at,
                updated_at
            FROM lopez_business_contact_messages 
            ${whereClause}
            ORDER BY created_at DESC
        `;

    const [rows] = await connection.execute(query, queryParams);
    const messages = rows as any[];

    await connection.end();

    if (format === "csv") {
      return exportToCSV(messages);
    } else if (format === "json") {
      return exportToJSON(messages);
    } else {
      return NextResponse.json({ error: "Unsupported format. Use csv or json" }, { status: 400 });
    }
  } catch (error) {
    // Fehler beim Export: ${error}
    return NextResponse.json({ error: "Fehler beim Export" }, { status: 500 });
  }
}

function exportToCSV(messages: any[]) {
  // CSV Header
  const headers = [
    "ID",
    "Name",
    "E-Mail",
    "Telefon",
    "Unternehmen",
    "Betreff",
    "Nachricht",
    "Status",
    "Priorität",
    "Zugewiesen an",
    "Antwort",
    "Antwort gesendet am",
    "Notizen",
    "Erstellt am",
    "Aktualisiert am",
  ];

  // CSV Rows
  const csvRows = messages.map((message) => [
    message.id,
    `"${message.name || ""}"`,
    `"${message.email || ""}"`,
    `"${message.phone || ""}"`,
    `"${message.company || ""}"`,
    `"${message.subject || ""}"`,
    `"${(message.message || "").replace(/"/g, '""')}"`, // Escape quotes
    message.status,
    message.priority,
    `"${message.assigned_to || ""}"`,
    `"${(message.response_message || "").replace(/"/g, '""')}"`,
    message.response_sent_at || "",
    `"${(message.notes || "").replace(/"/g, '""')}"`,
    message.created_at,
    message.updated_at,
  ]);

  // CSV Content
  const csvContent = [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\n");

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="kontakt-nachrichten-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}

function exportToJSON(messages: any[]) {
  const exportData = {
    export_date: new Date().toISOString(),
    total_messages: messages.length,
    messages: messages.map((message) => ({
      id: message.id,
      name: message.name,
      email: message.email,
      phone: message.phone,
      company: message.company,
      subject: message.subject,
      message: message.message,
      status: message.status,
      priority: message.priority,
      assigned_to: message.assigned_to,
      response_message: message.response_message,
      response_sent_at: message.response_sent_at,
      notes: message.notes,
      created_at: message.created_at,
      updated_at: message.updated_at,
    })),
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="kontakt-nachrichten-${new Date().toISOString().split("T")[0]}.json"`,
    },
  });
}
