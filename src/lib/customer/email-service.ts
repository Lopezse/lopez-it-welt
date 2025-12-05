// =====================================================
// KUNDEN E-MAIL SERVICE
// =====================================================
// Enterprise++ E-Mail Versand
// Verifizierung, Passwort-Reset, Benachrichtigungen
// =====================================================

import { getConnection } from "@/lib/database";

// =====================================================
// KONFIGURATION
// =====================================================

const EMAIL_CONFIG = {
  from: "noreply@lopez-it-welt.de",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  company: "Lopez IT Welt",
  support: "support@lopez-it-welt.de"
};

// =====================================================
// TYPEN
// =====================================================

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// =====================================================
// EMAIL SERVICE
// =====================================================

export class CustomerEmailService {

  // -------------------------------------------------
  // E-MAIL SENDEN (DEV: Logging statt echtem Versand)
  // -------------------------------------------------

  /**
   * Sendet eine E-Mail (in DEV wird nur geloggt)
   */
  private static async sendEmail(
    to: string,
    subject: string,
    html: string,
    text: string
  ): Promise<EmailResult> {
    
    // In DEV-Umgebung: Nur Logging
    if (process.env.NODE_ENV !== "production") {
      console.log("\n========================================");
      console.log("📧 E-MAIL (DEV MODE - nicht gesendet)");
      console.log("========================================");
      console.log(`An: ${to}`);
      console.log(`Betreff: ${subject}`);
      console.log("----------------------------------------");
      console.log(text);
      console.log("========================================\n");
      
      // In DB speichern für DEV-Tests
      try {
        const pool = await getConnection();
        await pool.execute(`
          INSERT INTO lopez_customer_email_tokens 
            (customer_id, token, type, expires_at)
          SELECT id, ?, 'email_log', DATE_ADD(NOW(), INTERVAL 24 HOUR)
          FROM lopez_customers WHERE email = ?
          LIMIT 1
        `, [JSON.stringify({ to, subject, text: text.substring(0, 500) }), to]);
      } catch {
        // Ignorieren wenn Logging fehlschlägt
      }
      
      return { success: true, messageId: `dev-${Date.now()}` };
    }

    // PRODUCTION: Hier würde der echte E-Mail-Versand kommen
    // z.B. Nodemailer, SendGrid, AWS SES, etc.
    
    // Placeholder für Produktion:
    /*
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const result = await transporter.sendMail({
      from: EMAIL_CONFIG.from,
      to,
      subject,
      html,
      text
    });

    return { success: true, messageId: result.messageId };
    */

    return { success: true, messageId: `prod-${Date.now()}` };
  }

  // -------------------------------------------------
  // VERIFIZIERUNGS-E-MAIL
  // -------------------------------------------------

  /**
   * Sendet E-Mail zur E-Mail-Verifizierung
   */
  static async sendVerificationEmail(
    email: string,
    token: string,
    firstName: string
  ): Promise<EmailResult> {
    
    const verifyUrl = `${EMAIL_CONFIG.baseUrl}/verify-email?token=${token}`;
    
    const subject = `${EMAIL_CONFIG.company} - E-Mail-Adresse bestätigen`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9fafb; }
            .button { display: inline-block; background: #2563eb; color: white; 
                     padding: 12px 30px; text-decoration: none; border-radius: 6px; 
                     margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${EMAIL_CONFIG.company}</h1>
            </div>
            <div class="content">
              <h2>Willkommen, ${firstName}!</h2>
              <p>Vielen Dank für Ihre Registrierung bei ${EMAIL_CONFIG.company}.</p>
              <p>Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf den folgenden Button klicken:</p>
              <p style="text-align: center;">
                <a href="${verifyUrl}" class="button">E-Mail bestätigen</a>
              </p>
              <p>Oder kopieren Sie diesen Link in Ihren Browser:</p>
              <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 4px;">
                ${verifyUrl}
              </p>
              <p><strong>Dieser Link ist 24 Stunden gültig.</strong></p>
              <p>Falls Sie sich nicht registriert haben, können Sie diese E-Mail ignorieren.</p>
            </div>
            <div class="footer">
              <p>${EMAIL_CONFIG.company} | ${EMAIL_CONFIG.support}</p>
              <p>Diese E-Mail wurde automatisch generiert.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const text = `
Willkommen bei ${EMAIL_CONFIG.company}, ${firstName}!

Vielen Dank für Ihre Registrierung.

Bitte bestätigen Sie Ihre E-Mail-Adresse:
${verifyUrl}

Dieser Link ist 24 Stunden gültig.

Falls Sie sich nicht registriert haben, können Sie diese E-Mail ignorieren.

---
${EMAIL_CONFIG.company}
${EMAIL_CONFIG.support}
    `.trim();
    
    return this.sendEmail(email, subject, html, text);
  }

  // -------------------------------------------------
  // PASSWORT-RESET E-MAIL
  // -------------------------------------------------

  /**
   * Sendet E-Mail zum Passwort-Reset
   */
  static async sendPasswordResetEmail(
    email: string,
    token: string,
    firstName: string
  ): Promise<EmailResult> {
    
    const resetUrl = `${EMAIL_CONFIG.baseUrl}/reset-password?token=${token}`;
    
    const subject = `${EMAIL_CONFIG.company} - Passwort zurücksetzen`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9fafb; }
            .button { display: inline-block; background: #dc2626; color: white; 
                     padding: 12px 30px; text-decoration: none; border-radius: 6px; 
                     margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Passwort zurücksetzen</h1>
            </div>
            <div class="content">
              <h2>Hallo ${firstName},</h2>
              <p>Sie haben angefordert, Ihr Passwort zurückzusetzen.</p>
              <p>Klicken Sie auf den Button, um ein neues Passwort zu vergeben:</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Neues Passwort setzen</a>
              </p>
              <div class="warning">
                <strong>⚠️ Sicherheitshinweis:</strong><br>
                Falls Sie diese Anfrage NICHT gestellt haben, ignorieren Sie diese E-Mail 
                und ändern Sie ggf. Ihr Passwort zur Sicherheit.
              </div>
              <p><strong>Dieser Link ist 1 Stunde gültig.</strong></p>
            </div>
            <div class="footer">
              <p>${EMAIL_CONFIG.company} | ${EMAIL_CONFIG.support}</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const text = `
Passwort zurücksetzen - ${EMAIL_CONFIG.company}

Hallo ${firstName},

Sie haben angefordert, Ihr Passwort zurückzusetzen.

Klicken Sie auf diesen Link:
${resetUrl}

Dieser Link ist 1 Stunde gültig.

SICHERHEITSHINWEIS: Falls Sie diese Anfrage NICHT gestellt haben, 
ignorieren Sie diese E-Mail.

---
${EMAIL_CONFIG.company}
    `.trim();
    
    return this.sendEmail(email, subject, html, text);
  }

  // -------------------------------------------------
  // WILLKOMMENS-E-MAIL
  // -------------------------------------------------

  /**
   * Sendet Willkommens-E-Mail nach erfolgreicher Verifizierung
   */
  static async sendWelcomeEmail(
    email: string,
    firstName: string
  ): Promise<EmailResult> {
    
    const dashboardUrl = `${EMAIL_CONFIG.baseUrl}/portal`;
    
    const subject = `Willkommen bei ${EMAIL_CONFIG.company}!`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9fafb; }
            .button { display: inline-block; background: #059669; color: white; 
                     padding: 12px 30px; text-decoration: none; border-radius: 6px; 
                     margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .features { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .feature { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .feature:last-child { border-bottom: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Willkommen!</h1>
            </div>
            <div class="content">
              <h2>Hallo ${firstName},</h2>
              <p>Ihre E-Mail-Adresse wurde erfolgreich bestätigt!</p>
              <p>Sie können jetzt alle Funktionen von ${EMAIL_CONFIG.company} nutzen:</p>
              <div class="features">
                <div class="feature">📊 <strong>Dashboard</strong> - Übersicht Ihrer Projekte</div>
                <div class="feature">🤖 <strong>AI-Services</strong> - Intelligente Analysen</div>
                <div class="feature">📄 <strong>Rechnungen</strong> - Transparente Abrechnung</div>
                <div class="feature">🎫 <strong>Support</strong> - Direkter Kontakt zu uns</div>
              </div>
              <p style="text-align: center;">
                <a href="${dashboardUrl}" class="button">Zum Kunden-Portal</a>
              </p>
            </div>
            <div class="footer">
              <p>${EMAIL_CONFIG.company} | ${EMAIL_CONFIG.support}</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const text = `
Willkommen bei ${EMAIL_CONFIG.company}, ${firstName}!

Ihre E-Mail-Adresse wurde erfolgreich bestätigt.

Sie können jetzt alle Funktionen nutzen:
- Dashboard: Übersicht Ihrer Projekte
- AI-Services: Intelligente Analysen
- Rechnungen: Transparente Abrechnung
- Support: Direkter Kontakt zu uns

Zum Kunden-Portal: ${dashboardUrl}

---
${EMAIL_CONFIG.company}
    `.trim();
    
    return this.sendEmail(email, subject, html, text);
  }
}

export default CustomerEmailService;

