import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/contact-messages/stats - Statistiken für Badge-Updates
export async function GET(request: NextRequest) {
  let connection: any = null;
  try {
    try {
      connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "lopez_erp",
      });
    } catch (dbError) {
      console.error("❌ DB-Verbindungsfehler (contact-messages/stats):", dbError);
      // Fallback: Leere Statistiken zurückgeben statt HTTP 500
      return NextResponse.json({
        success: true,
        stats: {
          new_messages: 0,
          in_progress: 0,
          last_24h: 0,
          urgent: 0,
          total_active: 0,
        },
      });
    }

    try {
      // Neue Nachrichten (Status: neu)
      const newMessagesQuery = `
            SELECT COUNT(*) as count
            FROM lopez_business_contact_messages 
            WHERE status = 'neu' AND is_spam = 0
        `;
      const [newResult] = await connection.execute(newMessagesQuery);
      const newMessages = (newResult as any)[0]?.count || 0;

      // Nachrichten in Bearbeitung
      const inProgressQuery = `
            SELECT COUNT(*) as count
            FROM lopez_business_contact_messages 
            WHERE status = 'in_bearbeitung' AND is_spam = 0
        `;
      const [progressResult] = await connection.execute(inProgressQuery);
      const inProgress = (progressResult as any)[0]?.count || 0;

      // Nachrichten der letzten 24 Stunden
      const last24hQuery = `
            SELECT COUNT(*) as count
            FROM lopez_business_contact_messages 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR) AND is_spam = 0
        `;
      const [last24hResult] = await connection.execute(last24hQuery);
      const last24h = (last24hResult as any)[0]?.count || 0;

      // Dringende Nachrichten (Priority: hoch oder dringend)
      const urgentQuery = `
            SELECT COUNT(*) as count
            FROM lopez_business_contact_messages 
            WHERE priority IN ('hoch', 'dringend') AND status != 'erledigt' AND is_spam = 0
        `;
      const [urgentResult] = await connection.execute(urgentQuery);
      const urgent = (urgentResult as any)[0]?.count || 0;

      if (connection) {
        try {
          await connection.end();
        } catch {}
      }

      return NextResponse.json({
        success: true,
        stats: {
          new_messages: newMessages,
          in_progress: inProgress,
          last_24h: last24h,
          urgent: urgent,
          total_active: newMessages + inProgress,
        },
      });
    } catch (queryError) {
      console.error("❌ SQL-Query-Fehler (contact-messages/stats):", queryError);
      if (connection) {
        try {
          await connection.end();
        } catch {}
      }
      // Fallback: Leere Statistiken zurückgeben statt HTTP 500
      return NextResponse.json({
        success: true,
        stats: {
          new_messages: 0,
          in_progress: 0,
          last_24h: 0,
          urgent: 0,
          total_active: 0,
        },
      });
    }
  } catch (error) {
    console.error("❌ Fehler beim Laden der Kontakt-Statistiken:", error);
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }
    // Fallback: Leere Statistiken zurückgeben statt HTTP 500
    return NextResponse.json({
      success: true,
      stats: {
        new_messages: 0,
        in_progress: 0,
        last_24h: 0,
        urgent: 0,
        total_active: 0,
      },
    });
  }
}
