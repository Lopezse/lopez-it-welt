// =====================================================
// LOPEZ IT WELT E-MAIL-KONFIGURATION
// =====================================================
// Enterprise++ E-Mail-System
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import nodemailer from "nodemailer";

// E-Mail-Konfiguration
export const emailConfig = {
  // SMTP-Konfiguration (für lokale Entwicklung - Echte E-Mails)
  smtp: {
    host: "smtp.gmail.com", // Gmail SMTP
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || "ihre-email@gmail.com",
      pass: process.env.EMAIL_PASS || "ihr-app-passwort",
    },
  },

  // Produktions-SMTP (für Live-System)
  production: {
    host: "smtp.gmail.com", // Oder Ihr SMTP-Server
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || "kontakt@lopez-it-welt.de",
      pass: process.env.EMAIL_PASS || "your-email-password",
    },
  },

  // Absender-Informationen
  from: {
    name: "Lopez IT Welt",
    email: "kontakt@lopez-it-welt.de",
  },

  // Admin-E-Mail (für Benachrichtigungen)
  admin: {
    name: "Lopez IT Welt Admin",
    email: "admin@lopez-it-welt.de",
  },
};

// E-Mail-Transporter erstellen
export function createEmailTransporter() {
  const isProduction = process.env.NODE_ENV === "production";
  const config = isProduction ? emailConfig.production : emailConfig.smtp;

  return nodemailer.createTransporter(config);
}

// Ticket-Nummer generieren
export function generateTicketNumber(): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `#${year}-${timestamp}`;
}

// Service-Level-Agreement (SLA)
export const sla = {
  responseTime: "24 Stunden",
  businessHours: "Mo-Fr 9:00-18:00 Uhr",
  emergencyContact: "+49 (0) 123 456 789",
};
