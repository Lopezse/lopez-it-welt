// =====================================================
// UNIFIED ALERTING SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Enterprise++ Unified Alerting System
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { AlertConfig, AlertMessage as EmailAlert, EmailAlertingService } from "./email-alerting";
import { SlackAlertingService, SlackConfig, SlackMessage } from "./slack-alerting";
import { SMSAlertingService, SMSConfig, SMSMessage } from "./sms-alerting";

export interface UnifiedAlert {
  id: string;
  type: "security" | "performance" | "compliance" | "system" | "error";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  timestamp: string;
  source: string;
  metadata?: Record<string, any>;
  channels: ("email" | "sms" | "slack")[];
  priority: number; // 1-10, höher = wichtiger
}

export interface UnifiedAlertingConfig {
  email: AlertConfig;
  sms: SMSConfig;
  slack: SlackConfig;
  rules: {
    [key: string]: {
      channels: ("email" | "sms" | "slack")[];
      conditions: {
        severity?: string[];
        type?: string[];
        source?: string[];
      };
    };
  };
}

export class UnifiedAlertingService {
  private emailService: EmailAlertingService;
  private smsService: SMSAlertingService;
  private slackService: SlackAlertingService;
  private config: UnifiedAlertingConfig;

  constructor(config: UnifiedAlertingConfig) {
    this.config = config;
    this.emailService = new EmailAlertingService(config.email);
    this.smsService = new SMSAlertingService(config.sms);
    this.slackService = new SlackAlertingService(config.slack);
  }

  // =====================================================
  // UNIFIED ALERT SENDING
  // =====================================================

  async sendAlert(alert: UnifiedAlert): Promise<{
    email: boolean;
    sms: boolean;
    slack: boolean;
    totalSent: number;
    totalFailed: number;
  }> {
    const results = {
      email: false,
      sms: false,
      slack: false,
      totalSent: 0,
      totalFailed: 0,
    };

    // Bestimme Kanäle basierend auf Regeln
    const channels = this.determineChannels(alert);

    // E-Mail senden
    if (channels.includes("email")) {
      const emailAlert = this.convertToEmailAlert(alert);
      results.email = await this.emailService.sendAlert(emailAlert);
      if (results.email) results.totalSent++;
      else results.totalFailed++;
    }

    // SMS senden
    if (channels.includes("sms")) {
      const smsAlert = this.convertToSMSAlert(alert);
      results.sms = await this.smsService.sendSMS(smsAlert);
      if (results.sms) results.totalSent++;
      else results.totalFailed++;
    }

    // Slack senden
    if (channels.includes("slack")) {
      const slackAlert = this.convertToSlackAlert(alert);
      results.slack = await this.slackService.sendSlackMessage(slackAlert);
      if (results.slack) results.totalSent++;
      else results.totalFailed++;
    }

    console.log(
      `📢 Unified Alert gesendet: ${results.totalSent} erfolgreich, ${results.totalFailed} fehlgeschlagen`,
    );
    return results;
  }

  // =====================================================
  // CHANNEL DETERMINATION
  // =====================================================

  private determineChannels(alert: UnifiedAlert): ("email" | "sms" | "slack")[] {
    // Prüfe Regeln in der Reihenfolge ihrer Priorität
    for (const [ruleName, rule] of Object.entries(this.config.rules)) {
      if (this.matchesRule(alert, rule.conditions)) {
        console.log(`📋 Regel "${ruleName}" angewendet für Alert ${alert.id}`);
        return rule.channels;
      }
    }

    // Fallback: Standard-Kanäle basierend auf Schweregrad
    return this.getDefaultChannels(alert.severity);
  }

  private matchesRule(alert: UnifiedAlert, conditions: any): boolean {
    // Prüfe Schweregrad
    if (conditions.severity && !conditions.severity.includes(alert.severity)) {
      return false;
    }

    // Prüfe Typ
    if (conditions.type && !conditions.type.includes(alert.type)) {
      return false;
    }

    // Prüfe Quelle
    if (conditions.source && !conditions.source.includes(alert.source)) {
      return false;
    }

    return true;
  }

  private getDefaultChannels(severity: string): ("email" | "sms" | "slack")[] {
    switch (severity) {
      case "critical":
        return ["email", "sms", "slack"];
      case "high":
        return ["email", "slack"];
      case "medium":
        return ["email", "slack"];
      case "low":
        return ["email"];
      default:
        return ["email"];
    }
  }

  // =====================================================
  // ALERT CONVERSION
  // =====================================================

  private convertToEmailAlert(alert: UnifiedAlert): EmailAlert {
    return {
      id: alert.id,
      type: alert.type,
      severity: alert.severity,
      title: alert.title,
      description: alert.description,
      timestamp: alert.timestamp,
      source: alert.source,
      metadata: alert.metadata,
    };
  }

  private convertToSMSAlert(alert: UnifiedAlert): SMSMessage {
    return {
      id: alert.id,
      type: alert.type,
      severity: alert.severity,
      title: alert.title,
      message: alert.description,
      timestamp: alert.timestamp,
      source: alert.source,
      metadata: alert.metadata,
    };
  }

  private convertToSlackAlert(alert: UnifiedAlert): SlackMessage {
    return {
      id: alert.id,
      type: alert.type,
      severity: alert.severity,
      title: alert.title,
      description: alert.description,
      timestamp: alert.timestamp,
      source: alert.source,
      metadata: alert.metadata,
    };
  }

  // =====================================================
  // BATCH ALERTING
  // =====================================================

  async sendBatchAlerts(alerts: UnifiedAlert[]): Promise<{
    totalSent: number;
    totalFailed: number;
    channelResults: {
      email: { sent: number; failed: number };
      sms: { sent: number; failed: number };
      slack: { sent: number; failed: number };
    };
  }> {
    const channelResults = {
      email: { sent: 0, failed: 0 },
      sms: { sent: 0, failed: 0 },
      slack: { sent: 0, failed: 0 },
    };

    let totalSent = 0;
    let totalFailed = 0;

    for (const alert of alerts) {
      const result = await this.sendAlert(alert);

      if (result.email) channelResults.email.sent++;
      else channelResults.email.failed++;

      if (result.sms) channelResults.sms.sent++;
      else channelResults.sms.failed++;

      if (result.slack) channelResults.slack.sent++;
      else channelResults.slack.failed++;

      totalSent += result.totalSent;
      totalFailed += result.totalFailed;
    }

    console.log(
      `📢 Batch Alerting abgeschlossen: ${totalSent} gesendet, ${totalFailed} fehlgeschlagen`,
    );

    return {
      totalSent,
      totalFailed,
      channelResults,
    };
  }

  // =====================================================
  // CONFIGURATION MANAGEMENT
  // =====================================================

  updateConfig(newConfig: Partial<UnifiedAlertingConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Services neu konfigurieren
    this.emailService.updateConfig(newConfig.email || {});
    this.smsService.updateConfig(newConfig.sms || {});
    this.slackService.updateConfig(newConfig.slack || {});
  }

  getConfig(): UnifiedAlertingConfig {
    return { ...this.config };
  }

  // =====================================================
  // TEST METHODS
  // =====================================================

  async testAllConnections(): Promise<{
    email: boolean;
    sms: boolean;
    slack: boolean;
    allWorking: boolean;
  }> {
    const results = {
      email: await this.emailService.testConnection(),
      sms: await this.smsService.testConnection(),
      slack: await this.slackService.testConnection(),
      allWorking: false,
    };

    results.allWorking = results.email && results.sms && results.slack;

    console.log("🧪 Verbindungstests:", results);
    return results;
  }

  async sendTestAlert(): Promise<boolean> {
    const testAlert: UnifiedAlert = {
      id: `test_unified_${Date.now()}`,
      type: "system",
      severity: "low",
      title: "Test Unified Alert - Lopez IT Welt",
      description:
        "Dies ist ein Test-Alert des Lopez IT Welt Enterprise++ Unified Alerting Systems.",
      timestamp: new Date().toISOString(),
      source: "UnifiedAlertingService",
      channels: ["email", "slack"], // SMS nur bei kritischen Alerts
      priority: 1,
      metadata: {
        test: true,
        version: "1.0.0",
      },
    };

    const result = await this.sendAlert(testAlert);
    return result.totalSent > 0;
  }

  // =====================================================
  // ALERT RULES MANAGEMENT
  // =====================================================

  addRule(
    name: string,
    rule: {
      channels: ("email" | "sms" | "slack")[];
      conditions: {
        severity?: string[];
        type?: string[];
        source?: string[];
      };
    },
  ): void {
    this.config.rules[name] = rule;
    console.log(`📋 Regel "${name}" hinzugefügt`);
  }

  removeRule(name: string): void {
    delete this.config.rules[name];
    console.log(`📋 Regel "${name}" entfernt`);
  }

  updateRule(
    name: string,
    rule: {
      channels: ("email" | "sms" | "slack")[];
      conditions: {
        severity?: string[];
        type?: string[];
        source?: string[];
      };
    },
  ): void {
    if (this.config.rules[name]) {
      this.config.rules[name] = rule;
      console.log(`📋 Regel "${name}" aktualisiert`);
    } else {
      console.warn(`⚠️ Regel "${name}" nicht gefunden`);
    }
  }

  getRules(): { [key: string]: any } {
    return { ...this.config.rules };
  }
}

// =====================================================
// DEFAULT CONFIGURATION
// =====================================================

export const defaultUnifiedAlertingConfig: UnifiedAlertingConfig = {
  email: {
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
  },
  sms: {
    enabled: true,
    provider: "twilio",
    apiKey: process.env.SMS_API_KEY || "",
    apiSecret: process.env.SMS_API_SECRET || "",
    from: process.env.SMS_FROM || "+49123456789",
    to: (process.env.SMS_TO_NUMBERS || "+49123456789").split(","),
    webhook: process.env.SMS_WEBHOOK_URL,
  },
  slack: {
    enabled: true,
    webhookUrl: process.env.SLACK_WEBHOOK_URL || "",
    token: process.env.SLACK_BOT_TOKEN,
    channel: process.env.SLACK_CHANNEL || "#alerts",
    username: "Lopez IT Welt Bot",
    iconEmoji: ":robot_face:",
    mentionUsers: process.env.SLACK_MENTION_USERS?.split(","),
    mentionGroups: process.env.SLACK_MENTION_GROUPS?.split(","),
  },
  rules: {
    critical_security: {
      channels: ["email", "sms", "slack"],
      conditions: {
        severity: ["critical"],
        type: ["security"],
      },
    },
    high_performance: {
      channels: ["email", "slack"],
      conditions: {
        severity: ["high"],
        type: ["performance"],
      },
    },
    compliance_violations: {
      channels: ["email", "slack"],
      conditions: {
        type: ["compliance"],
      },
    },
    system_errors: {
      channels: ["email"],
      conditions: {
        type: ["error", "system"],
      },
    },
  },
};

// =====================================================
// SINGLETON INSTANCE
// =====================================================

export const unifiedAlertingService = new UnifiedAlertingService(defaultUnifiedAlertingConfig);
