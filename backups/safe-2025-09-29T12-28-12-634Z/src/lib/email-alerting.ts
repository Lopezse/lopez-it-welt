// =====================================================
// EMAIL ALERTING SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Enterprise++ E-Mail Alerting System
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import nodemailer from "nodemailer";

export interface AlertConfig {
  enabled: boolean;
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
}

export interface AlertMessage {
  id: string;
  type: "security" | "performance" | "compliance" | "system" | "error";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  timestamp: string;
  source: string;
  metadata?: Record<string, any>;
}

export class EmailAlertingService {
  private transporter: nodemailer.Transporter;
  private config: AlertConfig;

  constructor(config: AlertConfig) {
    this.config = config;
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: config.smtp.auth,
    });
  }

  // =====================================================
  // ALERT SENDING
  // =====================================================

  async sendAlert(alert: AlertMessage): Promise<boolean> {
    try {
      if (!this.config.enabled) {
        console.log("📧 E-Mail Alerting deaktiviert");
        return false;
      }

      const emailContent = this.generateEmailContent(alert);
      const subject = this.generateSubject(alert);

      const mailOptions = {
        from: this.config.from,
        to: this.config.to.join(", "),
        cc: this.config.cc?.join(", "),
        bcc: this.config.bcc?.join(", "),
        subject: subject,
        html: emailContent,
        text: this.generateTextContent(alert),
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("✅ E-Mail Alert gesendet:", result.messageId);

      return true;
    } catch (error) {
      console.error("❌ Fehler beim Senden des E-Mail Alerts:", error);
      return false;
    }
  }

  // =====================================================
  // EMAIL CONTENT GENERATION
  // =====================================================

  private generateSubject(alert: AlertMessage): string {
    const severityEmoji = this.getSeverityEmoji(alert.severity);
    const typeEmoji = this.getTypeEmoji(alert.type);

    return `${severityEmoji} ${typeEmoji} Lopez IT Welt Alert: ${alert.title}`;
  }

  private generateEmailContent(alert: AlertMessage): string {
    const severityColor = this.getSeverityColor(alert.severity);
    const typeColor = this.getTypeColor(alert.type);

    return `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lopez IT Welt Alert</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
        .alert-box { background: ${severityColor}; color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .metadata { background: #e9ecef; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .footer { text-align: center; color: #6c757d; font-size: 12px; margin-top: 20px; }
        .severity-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .type-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; background: ${typeColor}; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚨 Lopez IT Welt Alert System</h1>
            <p>Enterprise++ Monitoring & Security</p>
        </div>
        
        <div class="content">
            <div class="alert-box">
                <h2>${alert.title}</h2>
                <p><strong>Typ:</strong> <span class="type-badge">${alert.type.toUpperCase()}</span></p>
                <p><strong>Schweregrad:</strong> <span class="severity-badge" style="background: ${severityColor};">${alert.severity.toUpperCase()}</span></p>
                <p><strong>Zeitstempel:</strong> ${new Date(alert.timestamp).toLocaleString("de-DE")}</p>
            </div>

            <h3>📋 Beschreibung</h3>
            <p>${alert.description}</p>

            <div class="metadata">
                <h4>🔍 Metadaten</h4>
                <p><strong>Quelle:</strong> ${alert.source}</p>
                <p><strong>Alert ID:</strong> ${alert.id}</p>
                ${
                  alert.metadata
                    ? Object.entries(alert.metadata)
                        .map(
                          ([key, value]) =>
                            `<p><strong>${key}:</strong> ${typeof value === "object" ? JSON.stringify(value, null, 2) : value}</p>`,
                        )
                        .join("")
                    : ""
                }
            </div>

            <div class="footer">
                <p>Lopez IT Welt Enterprise++ System</p>
                <p>Automatisch generiert am ${new Date().toLocaleString("de-DE")}</p>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  private generateTextContent(alert: AlertMessage): string {
    return `
LOPEZ IT WELT ALERT SYSTEM
==========================

ALERT: ${alert.title}
Typ: ${alert.type.toUpperCase()}
Schweregrad: ${alert.severity.toUpperCase()}
Zeitstempel: ${new Date(alert.timestamp).toLocaleString("de-DE")}
Quelle: ${alert.source}
Alert ID: ${alert.id}

BESCHREIBUNG:
${alert.description}

${
  alert.metadata
    ? `
METADATEN:
${Object.entries(alert.metadata)
  .map(
    ([key, value]) =>
      `${key}: ${typeof value === "object" ? JSON.stringify(value, null, 2) : value}`,
  )
  .join("\n")}
`
    : ""
}

---
Lopez IT Welt Enterprise++ System
Automatisch generiert am ${new Date().toLocaleString("de-DE")}
        `;
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  private getSeverityEmoji(severity: string): string {
    const emojis = {
      low: "🟢",
      medium: "🟡",
      high: "🟠",
      critical: "🔴",
    };
    return emojis[severity as keyof typeof emojis] || "⚪";
  }

  private getTypeEmoji(type: string): string {
    const emojis = {
      security: "🔒",
      performance: "⚡",
      compliance: "📋",
      system: "🖥️",
      error: "❌",
    };
    return emojis[type as keyof typeof emojis] || "📢";
  }

  private getSeverityColor(severity: string): string {
    const colors = {
      low: "#28a745",
      medium: "#ffc107",
      high: "#fd7e14",
      critical: "#dc3545",
    };
    return colors[severity as keyof typeof colors] || "#6c757d";
  }

  private getTypeColor(type: string): string {
    const colors = {
      security: "#dc3545",
      performance: "#17a2b8",
      compliance: "#6f42c1",
      system: "#28a745",
      error: "#dc3545",
    };
    return colors[type as keyof typeof colors] || "#6c757d";
  }

  // =====================================================
  // BATCH ALERTING
  // =====================================================

  async sendBatchAlerts(alerts: AlertMessage[]): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (const alert of alerts) {
      const success = await this.sendAlert(alert);
      if (success) {
        sent++;
      } else {
        failed++;
      }
    }

    console.log(`📧 Batch Alerting abgeschlossen: ${sent} gesendet, ${failed} fehlgeschlagen`);
    return { sent, failed };
  }

  // =====================================================
  // CONFIGURATION MANAGEMENT
  // =====================================================

  updateConfig(newConfig: Partial<AlertConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Transporter neu erstellen wenn SMTP-Konfiguration geändert wurde
    if (newConfig.smtp) {
      this.transporter = nodemailer.createTransport({
        host: this.config.smtp.host,
        port: this.config.smtp.port,
        secure: this.config.smtp.secure,
        auth: this.config.smtp.auth,
      });
    }
  }

  getConfig(): AlertConfig {
    return { ...this.config };
  }

  // =====================================================
  // TEST METHODS
  // =====================================================

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log("✅ E-Mail Alerting Verbindung erfolgreich");
      return true;
    } catch (error) {
      console.error("❌ E-Mail Alerting Verbindung fehlgeschlagen:", error);
      return false;
    }
  }

  async sendTestAlert(): Promise<boolean> {
    const testAlert: AlertMessage = {
      id: `test_${Date.now()}`,
      type: "system",
      severity: "low",
      title: "Test Alert - Lopez IT Welt",
      description: "Dies ist ein Test-Alert des Lopez IT Welt Enterprise++ Systems.",
      timestamp: new Date().toISOString(),
      source: "EmailAlertingService",
      metadata: {
        test: true,
        version: "1.0.0",
      },
    };

    return await this.sendAlert(testAlert);
  }
}

// =====================================================
// DEFAULT CONFIGURATION
// =====================================================

export const defaultEmailAlertConfig: AlertConfig = {
  enabled: true,
  smtp: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  },
  from: process.env.ALERT_FROM_EMAIL || "alerts@lopezitwelt.de",
  to: (process.env.ALERT_TO_EMAILS || "admin@lopezitwelt.de").split(","),
  cc: process.env.ALERT_CC_EMAILS?.split(","),
  bcc: process.env.ALERT_BCC_EMAILS?.split(","),
};

// =====================================================
// SINGLETON INSTANCE
// =====================================================

export const emailAlertingService = new EmailAlertingService(defaultEmailAlertConfig);
