// =====================================================
// EMAIL SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: E-Mail-Versand für Kundenverwaltung
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import nodemailer from "nodemailer";
import { Customer } from "./customer-service";

// =====================================================
// INTERFACES
// =====================================================

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface UserEmailData {
  first_name: string;
  last_name: string;
  domain_type: "external" | "internal";
  admin_alias?: string;
}

// =====================================================
// EMAIL SERVICE CLASS
// =====================================================

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || "localhost",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
      },
    });
  }

  // =====================================================
  // E-MAIL-VERSAND
  // =====================================================

  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || "noreply@lopez-it-welt.de",
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("✅ E-Mail erfolgreich versendet:", result.messageId);
      return true;
    } catch (error) {
      console.error("❌ E-Mail-Versand fehlgeschlagen:", error);
      return false;
    }
  }

  // =====================================================
  // KUNDEN-E-MAILS
  // =====================================================

  async sendCustomerWelcome(customer: Customer): Promise<boolean> {
    const subject = "Willkommen bei Lopez IT Welt";
    const html = this.getWelcomeHTML(customer);
    const text = this.getWelcomeText(customer);

    return await this.sendEmail({ to: customer.email, subject, html, text });
  }

  async sendCustomerUpdate(customer: Customer, changes: string[]): Promise<boolean> {
    const subject = "Ihre Kundendaten wurden aktualisiert";
    const html = this.getUpdateHTML(customer, changes);
    const text = this.getUpdateText(customer, changes);

    return await this.sendEmail({ to: customer.email, subject, html, text });
  }

  // =====================================================
  // ADMIN-E-MAILS
  // =====================================================

  async sendAdminNotification(
    subject: string,
    message: string,
    adminEmails: string[],
  ): Promise<boolean> {
    const html = this.getAdminNotificationHTML(subject, message);
    const text = this.getAdminNotificationText(subject, message);

    return await this.sendEmail({
      to: adminEmails.join(", "),
      subject,
      html,
      text,
    });
  }

  // =====================================================
  // E-MAIL-TEMPLATES
  // =====================================================

  private getWelcomeHTML(customer: Customer): string {
    return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Willkommen bei Lopez IT Welt</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f8fafc; }
                    .footer { background: #64748b; color: white; padding: 15px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Willkommen bei Lopez IT Welt</h1>
                    </div>
                    <div class="content">
                        <h2>Hallo ${customer.anrede} ${customer.vorname} ${customer.nachname},</h2>
                        <p>herzlich willkommen in unserem Kundenverwaltungssystem!</p>
                        <p><strong>Ihre Kundendaten:</strong></p>
                        <ul>
                            <li>Kundennummer: ${customer.kundennummer}</li>
                            <li>E-Mail: ${customer.email}</li>
                            <li>Support-Level: ${customer.support_level}</li>
                            <li>Status: ${customer.status}</li>
                        </ul>
                        <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
                        <p>Mit freundlichen Grüßen<br>Ihr Lopez IT Welt Team</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Lopez IT Welt - Vertraulich</p>
                    </div>
                </div>
            </body>
            </html>
        `;
  }

  private getWelcomeText(customer: Customer): string {
    return `
            Willkommen bei Lopez IT Welt
            
            Hallo ${customer.anrede} ${customer.vorname} ${customer.nachname},
            
            herzlich willkommen in unserem Kundenverwaltungssystem!
            
            Ihre Kundendaten:
            - Kundennummer: ${customer.kundennummer}
            - E-Mail: ${customer.email}
            - Support-Level: ${customer.support_level}
            - Status: ${customer.status}
            
            Bei Fragen stehen wir Ihnen gerne zur Verfügung.
            
            Mit freundlichen Grüßen
            Ihr Lopez IT Welt Team
            
            © 2025 Lopez IT Welt - Vertraulich
        `;
  }

  private getUpdateHTML(customer: Customer, changes: string[]): string {
    return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Kundendaten aktualisiert</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f8fafc; }
                    .footer { background: #64748b; color: white; padding: 15px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Kundendaten aktualisiert</h1>
                    </div>
                    <div class="content">
                        <h2>Hallo ${customer.anrede} ${customer.vorname} ${customer.nachname},</h2>
                        <p>Ihre Kundendaten wurden erfolgreich aktualisiert.</p>
                        <p><strong>Geänderte Felder:</strong> ${changes.join(", ")}</p>
                        <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
                        <p>Mit freundlichen Grüßen<br>Ihr Lopez IT Welt Team</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Lopez IT Welt - Vertraulich</p>
                    </div>
                </div>
            </body>
            </html>
        `;
  }

  private getUpdateText(customer: Customer, changes: string[]): string {
    return `
            Kundendaten aktualisiert
            
            Hallo ${customer.anrede} ${customer.vorname} ${customer.nachname},
            
            Ihre Kundendaten wurden erfolgreich aktualisiert.
            
            Geänderte Felder: ${changes.join(", ")}
            
            Bei Fragen stehen wir Ihnen gerne zur Verfügung.
            
            Mit freundlichen Grüßen
            Ihr Lopez IT Welt Team
            
            © 2025 Lopez IT Welt - Vertraulich
        `;
  }

  private getAdminNotificationHTML(subject: string, message: string): string {
    return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Admin-Benachrichtigung</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f8fafc; }
                    .footer { background: #64748b; color: white; padding: 15px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Admin-Benachrichtigung</h1>
                    </div>
                    <div class="content">
                        <h2>${subject}</h2>
                        <p>${message}</p>
                        <p><strong>Zeitstempel:</strong> ${new Date().toLocaleString("de-DE")}</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Lopez IT Welt - Vertraulich</p>
                    </div>
                </div>
            </body>
            </html>
        `;
  }

  private getAdminNotificationText(subject: string, message: string): string {
    return `
            Admin-Benachrichtigung
            
            ${subject}
            
            ${message}
            
            Zeitstempel: ${new Date().toLocaleString("de-DE")}
            
            © 2025 Lopez IT Welt - Vertraulich
        `;
  }

  // =====================================================
  // E-MAIL-VALIDIERUNG
  // =====================================================

  async validateEmail(email: string): Promise<boolean> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // =====================================================
  // DOMAIN-STRATEGIE METHODS
  // =====================================================

  /**
   * Generiert E-Mail-Adresse basierend auf Domain-Strategie
   * Gesetzliche Namenskonvention: Doppel-Nachname zusammen + Vorname
   */
  static generateEmailAddress(userData: UserEmailData): string {
    const { first_name, last_name, domain_type } = userData;

    // Gesetzliche Namenskonvention: Doppel-Nachname zusammenfügen
    const cleanFirstName = first_name.toLowerCase().replace(/[^a-zäöüß]/g, "");
    const cleanLastName = last_name
      .toLowerCase()
      .replace(/[^a-zäöüß]/g, "")
      .replace(/\s+/g, "");
    const domain = domain_type === "external" ? "lopezitwelt.de" : "lopez-team.de";

    return `${cleanFirstName}.${cleanLastName}@${domain}`;
  }

  /**
   * Generiert Display-Name für Benutzer
   */
  static generateDisplayName(firstName: string, lastName: string, role?: string): string {
    const fullName = `${firstName} ${lastName}`;
    return role ? `${fullName} - ${role}` : fullName;
  }

  /**
   * Validiert E-Mail-Adresse basierend auf Domain-Strategie
   */
  static validateEmailDomain(email: string, domainType: "external" | "internal"): boolean {
    const expectedDomain = domainType === "external" ? "lopezitwelt.de" : "lopez-team.de";
    return email.endsWith(`@${expectedDomain}`);
  }

  // =====================================================
  // E-MAIL-KONFIGURATION TESTEN
  // =====================================================

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log("✅ E-Mail-Verbindung erfolgreich getestet");
      return true;
    } catch (error) {
      console.error("❌ E-Mail-Verbindung fehlgeschlagen:", error);
      return false;
    }
  }
}
