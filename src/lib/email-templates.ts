// =====================================================
// LOPEZ IT WELT E-MAIL-TEMPLATES
// =====================================================
// Enterprise++ E-Mail-Templates
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { generateTicketNumber } from "./email-config";

export interface ContactMessage {
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

// =====================================================
// 1. KUNDEN-BESTÄTIGUNG (Transaktionsmail)
// =====================================================

export function createCustomerConfirmationEmail(message: ContactMessage) {
  const ticketNumber = generateTicketNumber();
  const priorityText = getPriorityText(message.priority);
  const responseTime = getResponseTime(message.priority);

  return {
    to: message.email,
    subject: `Ihre Anfrage bei Lopez IT Welt – Vielen Dank! (${ticketNumber})`,
    html: `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kontakt-Bestätigung - Lopez IT Welt</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .ticket-info { background: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0; }
        .priority-${message.priority} { 
            display: inline-block; 
            padding: 5px 15px; 
            border-radius: 20px; 
            font-weight: bold; 
            font-size: 12px;
            text-transform: uppercase;
        }
        .priority-hoch { background: #fef3c7; color: #d97706; }
        .priority-dringend { background: #fee2e2; color: #dc2626; }
        .priority-normal { background: #d1fae5; color: #059669; }
        .priority-niedrig { background: #e5e7eb; color: #6b7280; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
        .button { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Lopez IT Welt</h1>
            <p>Digitale Enterprise++ IT-Lösungen</p>
        </div>
        
        <div class="content">
            <h2>Vielen Dank für Ihre Anfrage!</h2>
            
            <p>Sehr geehrte/r <strong>${message.name}</strong>,</p>
            
            <p>vielen Dank für Ihr Vertrauen in Lopez IT Welt! Wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
            
            <div class="ticket-info">
                <h3>📋 Ihre Anfrage-Details:</h3>
                <p><strong>Ticket-Nummer:</strong> ${ticketNumber}</p>
                <p><strong>Betreff:</strong> ${message.subject}</p>
                <p><strong>Priorität:</strong> <span class="priority-${message.priority}">${priorityText}</span></p>
                <p><strong>Eingegangen am:</strong> ${new Date(message.created_at).toLocaleString("de-DE")}</p>
            </div>
            
            <h3>📝 Zusammenfassung Ihrer Anfrage:</h3>
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                <p><strong>${message.subject}</strong></p>
                <p>${message.message.replace(/\n/g, "<br>")}</p>
            </div>
            
            <h3>⏰ Was passiert als nächstes?</h3>
            <ul>
                <li>✅ Ihre Anfrage wurde in unserem System erfasst</li>
                <li>🔍 Unser Team prüft Ihre Anfrage und priorisiert sie</li>
                <li>📞 Wir melden uns innerhalb von <strong>${responseTime}</strong> bei Ihnen</li>
                <li>💬 Bei dringenden Anfragen kontaktieren wir Sie sofort</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:kontakt@lopez-it-welt.de" class="button">📧 Direkt antworten</a>
            </div>
            
            <h3>📞 Kontakt-Informationen:</h3>
            <p>
                <strong>Telefon:</strong> +49 (0) 123 456 789<br>
                <strong>E-Mail:</strong> kontakt@lopez-it-welt.de<br>
                <strong>Geschäftszeiten:</strong> Mo-Fr 9:00-18:00 Uhr
            </p>
        </div>
        
        <div class="footer">
            <p><strong>Lopez IT Welt</strong> - Digitale Enterprise++ IT-Lösungen</p>
            <p>Musterstraße 123, 12345 Musterstadt | www.lopez-it-welt.de</p>
            <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht direkt auf diese E-Mail.</p>
        </div>
    </div>
</body>
</html>
        `,
    text: `
Lopez IT Welt - Kontakt-Bestätigung

Sehr geehrte/r ${message.name},

vielen Dank für Ihre Anfrage bei Lopez IT Welt!

TICKET-DETAILS:
- Ticket-Nummer: ${ticketNumber}
- Betreff: ${message.subject}
- Priorität: ${priorityText}
- Eingegangen: ${new Date(message.created_at).toLocaleString("de-DE")}

Ihre Anfrage:
${message.subject}

${message.message}

WAS PASSIERT ALS NÄCHSTES:
- Wir prüfen Ihre Anfrage und priorisieren sie
- Wir melden uns innerhalb von ${responseTime} bei Ihnen
- Bei dringenden Anfragen kontaktieren wir Sie sofort

KONTAKT:
Telefon: +49 (0) 123 456 789
E-Mail: kontakt@lopez-it-welt.de
Geschäftszeiten: Mo-Fr 9:00-18:00 Uhr

Mit freundlichen Grüßen,
Ihr Lopez IT Welt Team

---
Lopez IT Welt - Digitale Enterprise++ IT-Lösungen
Musterstraße 123, 12345 Musterstadt
www.lopez-it-welt.de
        `,
  };
}

// =====================================================
// 2. ADMIN-BENACHRICHTIGUNG (interne Mail)
// =====================================================

export function createAdminNotificationEmail(message: ContactMessage) {
  const ticketNumber = generateTicketNumber();
  const priorityText = getPriorityText(message.priority);
  const adminUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/admin/support/contact-messages`;

  return {
    to: "admin@lopez-it-welt.de",
    subject: `🚨 Neue Support-Anfrage eingegangen – Ticket ${ticketNumber} (${priorityText})`,
    html: `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neue Support-Anfrage - Lopez IT Welt Admin</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .alert { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .customer-info { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0; }
        .message-content { background: #f1f5f9; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0; }
        .priority-${message.priority} { 
            display: inline-block; 
            padding: 8px 20px; 
            border-radius: 25px; 
            font-weight: bold; 
            font-size: 14px;
            text-transform: uppercase;
        }
        .priority-hoch { background: #fef3c7; color: #d97706; }
        .priority-dringend { background: #fee2e2; color: #dc2626; }
        .priority-normal { background: #d1fae5; color: #059669; }
        .priority-niedrig { background: #e5e7eb; color: #6b7280; }
        .button { display: inline-block; background: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚨 Neue Support-Anfrage</h1>
            <p>Lopez IT Welt Admin-Dashboard</p>
        </div>
        
        <div class="content">
            <div class="alert">
                <h3>⚠️ Sofortige Aufmerksamkeit erforderlich!</h3>
                <p>Eine neue Kontakt-Anfrage mit <strong>${priorityText}</strong> Priorität ist eingegangen.</p>
            </div>
            
            <h2>📋 Ticket-Informationen:</h2>
            <div class="customer-info">
                <p><strong>Ticket-Nummer:</strong> ${ticketNumber}</p>
                <p><strong>Priorität:</strong> <span class="priority-${message.priority}">${priorityText}</span></p>
                <p><strong>Eingegangen:</strong> ${new Date(message.created_at).toLocaleString("de-DE")}</p>
                <p><strong>Status:</strong> Neu (noch nicht bearbeitet)</p>
            </div>
            
            <h2>👤 Kundendetails:</h2>
            <div class="customer-info">
                <p><strong>Name:</strong> ${message.name}</p>
                <p><strong>E-Mail:</strong> ${message.email}</p>
                ${message.phone ? `<p><strong>Telefon:</strong> ${message.phone}</p>` : ""}
                ${message.company ? `<p><strong>Unternehmen:</strong> ${message.company}</p>` : ""}
            </div>
            
            <h2>📝 Anfrage-Inhalt:</h2>
            <div class="message-content">
                <h3>${message.subject}</h3>
                <p>${message.message.replace(/\n/g, "<br>")}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${adminUrl}" class="button">🔗 Zum Admin-Dashboard</a>
            </div>
            
            <h3>⚡ Nächste Schritte:</h3>
            <ul>
                <li>✅ Ticket im Admin-Dashboard öffnen</li>
                <li>📞 Kunde kontaktieren (innerhalb von ${getResponseTime(message.priority)})</li>
                <li>📝 Status auf "In Bearbeitung" setzen</li>
                <li>💬 Interne Notizen hinzufügen</li>
            </ul>
            
            <h3>📊 Service-Level-Agreement:</h3>
            <p>
                <strong>Antwortzeit:</strong> ${getResponseTime(message.priority)}<br>
                <strong>Geschäftszeiten:</strong> Mo-Fr 9:00-18:00 Uhr<br>
                <strong>Notfall-Kontakt:</strong> +49 (0) 123 456 789
            </p>
        </div>
        
        <div class="footer">
            <p><strong>Lopez IT Welt Admin-System</strong></p>
            <p>Diese Benachrichtigung wurde automatisch generiert.</p>
        </div>
    </div>
</body>
</html>
        `,
    text: `
🚨 NEUE SUPPORT-ANFRAGE - LOPEZ IT WELT ADMIN

TICKET-DETAILS:
- Ticket-Nummer: ${ticketNumber}
- Priorität: ${priorityText}
- Eingegangen: ${new Date(message.created_at).toLocaleString("de-DE")}
- Status: Neu (noch nicht bearbeitet)

KUNDENDETAILS:
- Name: ${message.name}
- E-Mail: ${message.email}
${message.phone ? `- Telefon: ${message.phone}` : ""}
${message.company ? `- Unternehmen: ${message.company}` : ""}

ANFRAGE-INHALT:
Betreff: ${message.subject}

${message.message}

NÄCHSTE SCHRITTE:
1. Ticket im Admin-Dashboard öffnen: ${adminUrl}
2. Kunde kontaktieren (innerhalb von ${getResponseTime(message.priority)})
3. Status auf "In Bearbeitung" setzen
4. Interne Notizen hinzufügen

SERVICE-LEVEL-AGREEMENT:
- Antwortzeit: ${getResponseTime(message.priority)}
- Geschäftszeiten: Mo-Fr 9:00-18:00 Uhr
- Notfall-Kontakt: +49 (0) 123 456 789

---
Lopez IT Welt Admin-System
Diese Benachrichtigung wurde automatisch generiert.
        `,
  };
}

// =====================================================
// HILFSFUNKTIONEN
// =====================================================

function getPriorityText(priority: string): string {
  const priorityMap = {
    niedrig: "Niedrig",
    normal: "Normal",
    hoch: "Hoch",
    dringend: "Dringend",
  };
  return priorityMap[priority as keyof typeof priorityMap] || "Normal";
}

function getResponseTime(priority: string): string {
  const responseTimeMap = {
    niedrig: "48 Stunden",
    normal: "24 Stunden",
    hoch: "12 Stunden",
    dringend: "2 Stunden",
  };
  return responseTimeMap[priority as keyof typeof responseTimeMap] || "24 Stunden";
}
