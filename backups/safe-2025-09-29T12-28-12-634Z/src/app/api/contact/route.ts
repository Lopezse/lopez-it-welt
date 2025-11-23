import { emailService } from "@/lib/email-service";
import { NextRequest, NextResponse } from "next/server";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  priority: "niedrig" | "normal" | "hoch" | "dringend";
  created_at: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validierung
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: "Alle Pflichtfelder müssen ausgefüllt werden" },
        { status: 400 },
      );
    }

    // E-Mail-Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Ungültige E-Mail-Adresse" }, { status: 400 });
    }

    // Nachricht in Datenbank speichern
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "lopez_erp",
    });

    const insertQuery = `
            INSERT INTO lopez_business_contact_messages 
            (name, email, phone, company, subject, message, priority)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

    const priority =
      body.subject.toLowerCase().includes("dringend") ||
      body.subject.toLowerCase().includes("urgent")
        ? "hoch"
        : "normal";

    // Nachricht in Datenbank speichern und ID abrufen
    const [insertResult] = await connection.execute(insertQuery, [
      body.name,
      body.email,
      body.phone || null,
      body.company || null,
      body.subject,
      body.message,
      priority,
    ]);

    const messageId = (insertResult as { insertId: number }).insertId;
    await connection.end();

    // E-Mail-Benachrichtigungen senden
    const messageData: ContactMessage = {
      id: messageId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      company: body.company,
      subject: body.subject,
      message: body.message,
      priority: priority as "niedrig" | "normal" | "hoch" | "dringend",
      created_at: new Date().toISOString(),
    };

    // E-Mails parallel senden (Kunde + Admin)
    await emailService.sendContactNotifications(messageData);

    // Logging für Debugging
    // Kontakt-Formular verarbeitet: ${messageId}

    // Erfolgreiche Antwort
    return NextResponse.json(
      {
        success: true,
        message: "Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns bald bei Ihnen.",
      },
      { status: 200 },
    );
  } catch {
    // Fehler beim Verarbeiten der Kontakt-Anfrage

    return NextResponse.json(
      {
        error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
      },
      { status: 500 },
    );
  }
}

// OPTIONS für CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
