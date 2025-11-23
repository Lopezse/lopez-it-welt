// =====================================================
// SLACK ALERTING SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Enterprise++ Slack Alerting System
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

export interface SlackConfig {
  enabled: boolean;
  webhookUrl: string;
  token?: string;
  channel: string;
  username: string;
  iconEmoji: string;
  mentionUsers?: string[];
  mentionGroups?: string[];
}

export interface SlackMessage {
  id: string;
  type: "security" | "performance" | "compliance" | "system" | "error";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  timestamp: string;
  source: string;
  metadata?: Record<string, any>;
  fields?: Array<{
    title: string;
    value: string;
    short: boolean;
  }>;
}

export class SlackAlertingService {
  private config: SlackConfig;

  constructor(config: SlackConfig) {
    this.config = config;
  }

  // =====================================================
  // SLACK MESSAGE SENDING
  // =====================================================

  async sendSlackMessage(slack: SlackMessage): Promise<boolean> {
    try {
      if (!this.config.enabled) {
        console.log("💬 Slack Alerting deaktiviert");
        return false;
      }

      const payload = this.generateSlackPayload(slack);

      const response = await fetch(this.config.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("✅ Slack Nachricht gesendet");
        return true;
      } else {
        console.error("❌ Slack Fehler:", response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error("❌ Fehler beim Senden der Slack Nachricht:", error);
      return false;
    }
  }

  // =====================================================
  // SLACK PAYLOAD GENERATION
  // =====================================================

  private generateSlackPayload(slack: SlackMessage): any {
    const severityColor = this.getSeverityColor(slack.severity);
    const severityEmoji = this.getSeverityEmoji(slack.severity);
    const typeEmoji = this.getTypeEmoji(slack.type);

    const mentions = this.generateMentions(slack.severity);

    const payload: any = {
      channel: this.config.channel,
      username: this.config.username,
      icon_emoji: this.config.iconEmoji,
      text: `${severityEmoji} ${typeEmoji} *${slack.title}*`,
      attachments: [
        {
          color: severityColor,
          title: `${severityEmoji} ${typeEmoji} ${slack.title}`,
          title_link: `${process.env.NEXT_PUBLIC_APP_URL}/admin/monitoring`,
          text: `${mentions}\n${slack.description}`,
          fields: [
            {
              title: "Typ",
              value: slack.type.toUpperCase(),
              short: true,
            },
            {
              title: "Schweregrad",
              value: slack.severity.toUpperCase(),
              short: true,
            },
            {
              title: "Zeitstempel",
              value: new Date(slack.timestamp).toLocaleString("de-DE"),
              short: true,
            },
            {
              title: "Quelle",
              value: slack.source,
              short: true,
            },
          ],
          footer: "Lopez IT Welt Enterprise++ System",
          footer_icon: "https://lopezitwelt.de/favicon.ico",
          ts: Math.floor(new Date(slack.timestamp).getTime() / 1000),
        },
      ],
    };

    // Zusätzliche Felder hinzufügen
    if (slack.fields && slack.fields.length > 0) {
      payload.attachments[0].fields.push(...slack.fields);
    }

    // Metadaten als zusätzliche Felder hinzufügen
    if (slack.metadata) {
      Object.entries(slack.metadata).forEach(([key, value]) => {
        payload.attachments[0].fields.push({
          title: key,
          value: typeof value === "object" ? JSON.stringify(value, null, 2) : String(value),
          short: false,
        });
      });
    }

    return payload;
  }

  // =====================================================
  // MENTION GENERATION
  // =====================================================

  private generateMentions(severity: string): string {
    let mentions = "";

    // Kritische Alerts erwähnen alle Benutzer
    if (severity === "critical") {
      if (this.config.mentionUsers && this.config.mentionUsers.length > 0) {
        mentions += this.config.mentionUsers.map((user) => `<@${user}>`).join(" ");
      }
      if (this.config.mentionGroups && this.config.mentionGroups.length > 0) {
        mentions += this.config.mentionGroups.map((group) => `<!subteam^${group}>`).join(" ");
      }
    }

    // High severity erwähnt nur bestimmte Benutzer
    if (severity === "high" && this.config.mentionUsers) {
      const highPriorityUsers = this.config.mentionUsers.slice(0, 2); // Erste 2 Benutzer
      mentions += highPriorityUsers.map((user) => `<@${user}>`).join(" ");
    }

    return mentions;
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  private getSeverityEmoji(severity: string): string {
    const emojis = {
      low: ":large_green_circle:",
      medium: ":large_yellow_circle:",
      high: ":large_orange_circle:",
      critical: ":red_circle:",
    };
    return emojis[severity as keyof typeof emojis] || ":white_circle:";
  }

  private getTypeEmoji(type: string): string {
    const emojis = {
      security: ":lock:",
      performance: ":zap:",
      compliance: ":clipboard:",
      system: ":computer:",
      error: ":x:",
    };
    return emojis[type as keyof typeof emojis] || ":bell:";
  }

  private getSeverityColor(severity: string): string {
    const colors = {
      low: "good",
      medium: "warning",
      high: "danger",
      critical: "danger",
    };
    return colors[severity as keyof typeof colors] || "#36a64f";
  }

  // =====================================================
  // BATCH SLACK MESSAGES
  // =====================================================

  async sendBatchSlackMessages(
    slackList: SlackMessage[],
  ): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (const slack of slackList) {
      const success = await this.sendSlackMessage(slack);
      if (success) {
        sent++;
      } else {
        failed++;
      }
    }

    console.log(`💬 Batch Slack abgeschlossen: ${sent} gesendet, ${failed} fehlgeschlagen`);
    return { sent, failed };
  }

  // =====================================================
  // SLACK API METHODS (mit Token)
  // =====================================================

  async sendDirectMessage(userId: string, message: SlackMessage): Promise<boolean> {
    if (!this.config.token) {
      console.error("❌ Slack Token erforderlich für Direct Messages");
      return false;
    }

    try {
      const payload = this.generateSlackPayload(message);
      payload.channel = userId;

      const response = await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.ok) {
        console.log("✅ Slack Direct Message gesendet");
        return true;
      } else {
        console.error("❌ Slack API Fehler:", result.error);
        return false;
      }
    } catch (error) {
      console.error("❌ Fehler beim Senden der Slack Direct Message:", error);
      return false;
    }
  }

  async updateMessage(
    channelId: string,
    messageTs: string,
    updatedMessage: SlackMessage,
  ): Promise<boolean> {
    if (!this.config.token) {
      console.error("❌ Slack Token erforderlich für Message Updates");
      return false;
    }

    try {
      const payload = this.generateSlackPayload(updatedMessage);
      payload.channel = channelId;
      payload.ts = messageTs;

      const response = await fetch("https://slack.com/api/chat.update", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.ok) {
        console.log("✅ Slack Nachricht aktualisiert");
        return true;
      } else {
        console.error("❌ Slack Update Fehler:", result.error);
        return false;
      }
    } catch (error) {
      console.error("❌ Fehler beim Aktualisieren der Slack Nachricht:", error);
      return false;
    }
  }

  // =====================================================
  // CONFIGURATION MANAGEMENT
  // =====================================================

  updateConfig(newConfig: Partial<SlackConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): SlackConfig {
    return { ...this.config };
  }

  // =====================================================
  // TEST METHODS
  // =====================================================

  async testConnection(): Promise<boolean> {
    try {
      const testPayload = {
        channel: this.config.channel,
        username: this.config.username,
        icon_emoji: this.config.iconEmoji,
        text: "🧪 Test Nachricht von Lopez IT Welt Enterprise++ System",
      };

      const response = await fetch(this.config.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testPayload),
      });

      if (response.ok) {
        console.log("✅ Slack Verbindung erfolgreich");
        return true;
      } else {
        console.error("❌ Slack Verbindung fehlgeschlagen:", response.status);
        return false;
      }
    } catch (error) {
      console.error("❌ Slack Verbindungstest fehlgeschlagen:", error);
      return false;
    }
  }

  async sendTestSlackMessage(): Promise<boolean> {
    const testSlack: SlackMessage = {
      id: `test_slack_${Date.now()}`,
      type: "system",
      severity: "low",
      title: "Test Slack - Lopez IT Welt",
      description: "Dies ist eine Test-Nachricht des Lopez IT Welt Enterprise++ Systems.",
      timestamp: new Date().toISOString(),
      source: "SlackAlertingService",
      metadata: {
        test: true,
        version: "1.0.0",
      },
    };

    return await this.sendSlackMessage(testSlack);
  }
}

// =====================================================
// DEFAULT CONFIGURATION
// =====================================================

export const defaultSlackConfig: SlackConfig = {
  enabled: true,
  webhookUrl: process.env.SLACK_WEBHOOK_URL || "",
  token: process.env.SLACK_BOT_TOKEN,
  channel: process.env.SLACK_CHANNEL || "#alerts",
  username: "Lopez IT Welt Bot",
  iconEmoji: ":robot_face:",
  mentionUsers: process.env.SLACK_MENTION_USERS?.split(","),
  mentionGroups: process.env.SLACK_MENTION_GROUPS?.split(","),
};

// =====================================================
// SINGLETON INSTANCE
// =====================================================

export const slackAlertingService = new SlackAlertingService(defaultSlackConfig);
