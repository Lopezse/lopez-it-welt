/**
 * GET /api/appointments/ical/export
 * ICS-Export für Kalender (iCal, Outlook, Google Calendar)
 */

import { createConnection } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let connection: any = null;

  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("project_id");
    const orderId = searchParams.get("order_id");
    const employeeId = searchParams.get("employee_id");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    try {
      connection = await createConnection();
    } catch (dbError) {
      console.error("❌ DB-Verbindungsfehler:", dbError);
      // Fallback: Leeres iCal-Objekt zurückgeben statt JSON-Fehler
      const emptyIcal =
        "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Lopez IT Welt//Office & Finance//DE\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nEND:VCALENDAR\r\n";
      return new NextResponse(emptyIcal, {
        status: 200,
        headers: {
          "Content-Type": "text/calendar; charset=utf-8",
          "Content-Disposition": 'attachment; filename="lopez-appointments.ics"',
        },
      });
    }

    let query = `
      SELECT * FROM lopez_appointments
      WHERE 1=1
    `;
    const params: any[] = [];

    if (projectId) {
      query += " AND project_id = ?";
      params.push(projectId);
    }

    if (orderId) {
      query += " AND order_id = ?";
      params.push(orderId);
    }

    if (employeeId) {
      query += " AND employee_id = ?";
      params.push(employeeId);
    }

    if (startDate) {
      query += " AND date_start >= ?";
      params.push(startDate);
    }

    if (endDate) {
      query += " AND date_end <= ?";
      params.push(endDate);
    }

    query += " ORDER BY date_start ASC";

    let appointments: any[] = [];
    try {
      // Prüfe ob Tabelle existiert
      try {
        const [tableCheck] = await connection.execute(
          "SELECT 1 FROM information_schema.tables WHERE table_schema = 'lopez_it_welt' AND table_name = 'lopez_appointments' LIMIT 1",
        );
        if (Array.isArray(tableCheck) && tableCheck.length === 0) {
          console.warn(
            "⚠️ Tabelle lopez_appointments existiert nicht - Fallback auf leeres Kalender-Objekt",
          );
          if (connection) {
            try {
              await connection.end();
            } catch {}
          }
          // Fallback: Leeres iCal-Objekt
          const emptyIcal =
            "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Lopez IT Welt//Office & Finance//DE\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nEND:VCALENDAR\r\n";
          return new NextResponse(emptyIcal, {
            status: 200,
            headers: {
              "Content-Type": "text/calendar; charset=utf-8",
              "Content-Disposition": 'attachment; filename="lopez-appointments.ics"',
            },
          });
        }
      } catch (checkError) {
        console.warn("⚠️ Fehler beim Prüfen der Tabelle:", checkError);
        // Weiter mit Query versuchen
      }

      const [rows] = await connection.execute(query, params);
      appointments = Array.isArray(rows) ? rows : [];
    } catch (queryError: any) {
      console.error("❌ SQL-Query-Fehler:", queryError);

      // Spezifische Fehlerbehandlung
      const errorMessage = queryError instanceof Error ? queryError.message : String(queryError);

      // Wenn Tabelle nicht existiert, gebe leeres Kalender-Objekt zurück
      if (errorMessage.includes("doesn't exist") || errorMessage.includes("Unknown table")) {
        console.warn(
          "⚠️ Tabelle lopez_appointments existiert nicht - Fallback auf leeres Kalender-Objekt",
        );
        if (connection) {
          try {
            await connection.end();
          } catch {}
        }
        const emptyIcal =
          "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Lopez IT Welt//Office & Finance//DE\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nEND:VCALENDAR\r\n";
        return new NextResponse(emptyIcal, {
          status: 200,
          headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Content-Disposition": 'attachment; filename="lopez-appointments.ics"',
          },
        });
      }

      // Andere Fehler: ebenfalls Fallback
      if (connection) {
        try {
          await connection.end();
        } catch {}
      }
      // Fallback: Leeres iCal-Objekt statt JSON-Fehler
      const emptyIcal =
        "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Lopez IT Welt//Office & Finance//DE\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nEND:VCALENDAR\r\n";
      return new NextResponse(emptyIcal, {
        status: 200,
        headers: {
          "Content-Type": "text/calendar; charset=utf-8",
          "Content-Disposition": 'attachment; filename="lopez-appointments.ics"',
        },
      });
    }

    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.warn("⚠️ Fehler beim Schließen der DB-Verbindung:", closeError);
      }
    }

    // ICS-Datei generieren (immer mindestens ein leeres Kalender-Objekt)
    let icsContent = "BEGIN:VCALENDAR\r\n";
    icsContent += "VERSION:2.0\r\n";
    icsContent += "PRODID:-//Lopez IT Welt//Office & Finance//DE\r\n";
    icsContent += "CALSCALE:GREGORIAN\r\n";
    icsContent += "METHOD:PUBLISH\r\n";

    try {
      for (const appt of appointments) {
        if (!appt || !appt.title) continue; // Überspringe ungültige Einträge

        icsContent += "BEGIN:VEVENT\r\n";

        if (appt.ical_uid) {
          icsContent += `UID:${escapeICSText(String(appt.ical_uid))}\r\n`;
        } else {
          icsContent += `UID:appt-${appt.id || Date.now()}@lopez-it-welt.de\r\n`;
        }

        // Datum-Formatierung mit Fehlerbehandlung
        try {
          const dtstart = appt.date_start
            ? new Date(appt.date_start).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
            : new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
          const dtend = appt.date_end
            ? new Date(appt.date_end).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
            : new Date(Date.now() + 3600000).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

          icsContent += `DTSTART:${dtstart}\r\n`;
          icsContent += `DTEND:${dtend}\r\n`;
        } catch (dateError) {
          console.warn("⚠️ Fehler beim Formatieren des Datums:", dateError);
          const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
          icsContent += `DTSTART:${now}\r\n`;
          icsContent += `DTEND:${now}\r\n`;
        }

        icsContent += `SUMMARY:${escapeICSText(String(appt.title || "Termin"))}\r\n`;

        if (appt.notes || appt.description) {
          icsContent += `DESCRIPTION:${escapeICSText(String(appt.notes || appt.description || ""))}\r\n`;
        }

        if (appt.location) {
          icsContent += `LOCATION:${escapeICSText(String(appt.location))}\r\n`;
        }

        const dtstamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
        icsContent += `DTSTAMP:${dtstamp}\r\n`;

        if (appt.is_all_day === 1 || appt.is_all_day === true) {
          icsContent += "X-MICROSOFT-CDO-ALLDAYEVENT:TRUE\r\n";
        }

        icsContent += "END:VEVENT\r\n";
      }
    } catch (icsError) {
      console.error("❌ Fehler beim Generieren des iCal-Contents:", icsError);
      // Fallback: Leeres Kalender-Objekt zurückgeben
      icsContent = "BEGIN:VCALENDAR\r\n";
      icsContent += "VERSION:2.0\r\n";
      icsContent += "PRODID:-//Lopez IT Welt//Office & Finance//DE\r\n";
      icsContent += "CALSCALE:GREGORIAN\r\n";
      icsContent += "METHOD:PUBLISH\r\n";
    }

    icsContent += "END:VCALENDAR\r\n";

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="lopez-appointments.ics"',
      },
    });
  } catch (error) {
    console.error("❌ ICS Export API Fehler:", error);
    // Stelle sicher, dass DB-Verbindung geschlossen wird
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }

    // Auch im äußeren catch: Leeres iCal-Objekt statt JSON-Fehler
    const emptyIcal =
      "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Lopez IT Welt//Office & Finance//DE\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nEND:VCALENDAR\r\n";
    return new NextResponse(emptyIcal, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="lopez-appointments.ics"',
      },
    });
  }
}

function escapeICSText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");
}

      }

      // Andere Fehler: ebenfalls Fallback
      if (connection) {
        try {
          await connection.end();
        } catch {}
      }
      // Fallback: Leeres iCal-Objekt statt JSON-Fehler
      const emptyIcal =
        "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Lopez IT Welt//Office & Finance//DE\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nEND:VCALENDAR\r\n";
      return new NextResponse(emptyIcal, {
        status: 200,
        headers: {
          "Content-Type": "text/calendar; charset=utf-8",
          "Content-Disposition": 'attachment; filename="lopez-appointments.ics"',
        },
      });
    }

    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.warn("⚠️ Fehler beim Schließen der DB-Verbindung:", closeError);
      }
    }

    // ICS-Datei generieren (immer mindestens ein leeres Kalender-Objekt)
    let icsContent = "BEGIN:VCALENDAR\r\n";
    icsContent += "VERSION:2.0\r\n";
    icsContent += "PRODID:-//Lopez IT Welt//Office & Finance//DE\r\n";
    icsContent += "CALSCALE:GREGORIAN\r\n";
    icsContent += "METHOD:PUBLISH\r\n";

    try {
      for (const appt of appointments) {
        if (!appt || !appt.title) continue; // Überspringe ungültige Einträge

        icsContent += "BEGIN:VEVENT\r\n";

        if (appt.ical_uid) {
          icsContent += `UID:${escapeICSText(String(appt.ical_uid))}\r\n`;
        } else {
          icsContent += `UID:appt-${appt.id || Date.now()}@lopez-it-welt.de\r\n`;
        }

        // Datum-Formatierung mit Fehlerbehandlung
        try {
          const dtstart = appt.date_start
            ? new Date(appt.date_start).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
            : new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
          const dtend = appt.date_end
            ? new Date(appt.date_end).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
            : new Date(Date.now() + 3600000).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

          icsContent += `DTSTART:${dtstart}\r\n`;
          icsContent += `DTEND:${dtend}\r\n`;
        } catch (dateError) {
          console.warn("⚠️ Fehler beim Formatieren des Datums:", dateError);
          const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
          icsContent += `DTSTART:${now}\r\n`;
          icsContent += `DTEND:${now}\r\n`;
        }

        icsContent += `SUMMARY:${escapeICSText(String(appt.title || "Termin"))}\r\n`;

        if (appt.notes || appt.description) {
          icsContent += `DESCRIPTION:${escapeICSText(String(appt.notes || appt.description || ""))}\r\n`;
        }

        if (appt.location) {
          icsContent += `LOCATION:${escapeICSText(String(appt.location))}\r\n`;
        }

        const dtstamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
        icsContent += `DTSTAMP:${dtstamp}\r\n`;

        if (appt.is_all_day === 1 || appt.is_all_day === true) {
          icsContent += "X-MICROSOFT-CDO-ALLDAYEVENT:TRUE\r\n";
        }

        icsContent += "END:VEVENT\r\n";
      }
    } catch (icsError) {
      console.error("❌ Fehler beim Generieren des iCal-Contents:", icsError);
      // Fallback: Leeres Kalender-Objekt zurückgeben
      icsContent = "BEGIN:VCALENDAR\r\n";
      icsContent += "VERSION:2.0\r\n";
      icsContent += "PRODID:-//Lopez IT Welt//Office & Finance//DE\r\n";
      icsContent += "CALSCALE:GREGORIAN\r\n";
      icsContent += "METHOD:PUBLISH\r\n";
    }

    icsContent += "END:VCALENDAR\r\n";

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="lopez-appointments.ics"',
      },
    });
  } catch (error) {
    console.error("❌ ICS Export API Fehler:", error);
    // Stelle sicher, dass DB-Verbindung geschlossen wird
    if (connection) {
      try {
        await connection.end();
      } catch {}
    }

    // Auch im äußeren catch: Leeres iCal-Objekt statt JSON-Fehler
    const emptyIcal =
      "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Lopez IT Welt//Office & Finance//DE\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nEND:VCALENDAR\r\n";
    return new NextResponse(emptyIcal, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="lopez-appointments.ics"',
      },
    });
  }
}

function escapeICSText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");
}
