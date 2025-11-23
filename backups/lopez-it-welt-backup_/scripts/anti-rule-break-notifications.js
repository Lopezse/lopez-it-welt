#!/usr/bin/env node

/**
 * 🔔 Anti-Regelbruch Enterprise++ Modul - Monitoring & Benachrichtigungen
 * Automatische Benachrichtigungen bei Regelbruch
 *
 * @author Ramiro Lopez Rodriguez
 * @version 1.0.0
 * @date 2025-06-30
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Enterprise++ Benachrichtigungs-Konfiguration
const NOTIFICATION_CONFIG = {
  // Slack Webhook
  slack: {
    enabled: false,
    webhookUrl: process.env.SLACK_WEBHOOK_URL || '',
    channel: '#anti-rule-break-alerts',
  },

  // Telegram Bot
  telegram: {
    enabled: false,
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    chatId: process.env.TELEGRAM_CHAT_ID || '',
  },

  // E-Mail
  email: {
    enabled: false,
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: process.env.SMTP_PORT || 587,
    username: process.env.SMTP_USERNAME || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.SMTP_FROM || '',
    to: process.env.SMTP_TO || '',
  },

  // Discord Webhook
  discord: {
    enabled: false,
    webhookUrl: process.env.DISCORD_WEBHOOK_URL || '',
  },
};

/**
 * 🔔 Anti-Regelbruch Benachrichtigungssystem
 */
class AntiRuleBreakNotifications {
  constructor() {
    this.config = NOTIFICATION_CONFIG;
    this.notificationHistory = [];
  }

  /**
   * 🚨 Regelbruch-Benachrichtigung senden
   */
  async sendViolationNotification(violation) {
    const timestamp = new Date().toISOString();
    const message = this.formatViolationMessage(violation);

    console.log('🔔 Anti-Regelbruch-Benachrichtigung wird gesendet...');

    // Benachrichtigung in Historie speichern
    this.notificationHistory.push({
      timestamp: timestamp,
      violation: violation,
      message: message,
      sent: false,
    });

    // Alle aktivierten Benachrichtigungen senden
    const promises = [];

    if (this.config.slack.enabled) {
      promises.push(this.sendSlackNotification(message));
    }

    if (this.config.telegram.enabled) {
      promises.push(this.sendTelegramNotification(message));
    }

    if (this.config.email.enabled) {
      promises.push(this.sendEmailNotification(message));
    }

    if (this.config.discord.enabled) {
      promises.push(this.sendDiscordNotification(message));
    }

    try {
      await Promise.all(promises);
      console.log('✅ Alle Benachrichtigungen erfolgreich gesendet');

      // Status in Historie aktualisieren
      this.notificationHistory[this.notificationHistory.length - 1].sent = true;
    } catch (error) {
      console.error('❌ Fehler beim Senden der Benachrichtigungen:', error);
    }
  }

  /**
   * 📝 Verstoß-Nachricht formatieren
   */
  formatViolationMessage(violation) {
    const timestamp = new Date().toISOString();

    return {
      text:
        `🚨 ANTI-REGELBRUCH: AKTION BLOCKIERT\n\n` +
        `**Regel:** ${violation.rule}\n` +
        `**Grund:** ${violation.reason}\n` +
        `**Verstoß #:** ${violation.violationCount}\n` +
        `**Zeitstempel:** ${timestamp}\n` +
        `**Status:** ❌ BLOCKIERT - Freigabe erforderlich\n\n` +
        `**System:** Anti-Regelbruch Enterprise++ Modul aktiviert\n` +
        `**Projekt:** Lopez IT Welt\n` +
        `**Phase:** Langzeittest (30.06.2025 - 07.07.2025)`,

      // Slack/Discord Format
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🚨 ANTI-REGELBRUCH: AKTION BLOCKIERT',
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Regel:*\n${violation.rule}`,
            },
            {
              type: 'mrkdwn',
              text: `*Verstoß #:*\n${violation.violationCount}`,
            },
            {
              type: 'mrkdwn',
              text: `*Grund:*\n${violation.reason}`,
            },
            {
              type: 'mrkdwn',
              text: `*Status:*\n❌ BLOCKIERT`,
            },
          ],
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `🛡️ Anti-Regelbruch Enterprise++ Modul | ${timestamp}`,
            },
          ],
        },
      ],
    };
  }

  /**
   * 📱 Slack-Benachrichtigung senden
   */
  async sendSlackNotification(message) {
    if (!this.config.slack.webhookUrl) {
      console.warn('⚠️ Slack Webhook URL nicht konfiguriert');
      return;
    }

    const payload = {
      channel: this.config.slack.channel,
      text: message.text,
      blocks: message.blocks,
    };

    return new Promise((resolve, reject) => {
      const data = JSON.stringify(payload);

      const options = {
        hostname: new URL(this.config.slack.webhookUrl).hostname,
        port: 443,
        path: new URL(this.config.slack.webhookUrl).pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
        },
      };

      const req = https.request(options, res => {
        if (res.statusCode === 200) {
          console.log('✅ Slack-Benachrichtigung gesendet');
          resolve();
        } else {
          reject(new Error(`Slack API Fehler: ${res.statusCode}`));
        }
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  /**
   * 📱 Telegram-Benachrichtigung senden
   */
  async sendTelegramNotification(message) {
    if (!this.config.telegram.botToken || !this.config.telegram.chatId) {
      console.warn('⚠️ Telegram Bot Token oder Chat ID nicht konfiguriert');
      return;
    }

    const url = `https://api.telegram.org/bot${this.config.telegram.botToken}/sendMessage`;
    const payload = {
      chat_id: this.config.telegram.chatId,
      text: message.text,
      parse_mode: 'Markdown',
    };

    return new Promise((resolve, reject) => {
      const data = JSON.stringify(payload);

      const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${this.config.telegram.botToken}/sendMessage`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
        },
      };

      const req = https.request(options, res => {
        if (res.statusCode === 200) {
          console.log('✅ Telegram-Benachrichtigung gesendet');
          resolve();
        } else {
          reject(new Error(`Telegram API Fehler: ${res.statusCode}`));
        }
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  /**
   * 📧 E-Mail-Benachrichtigung senden
   */
  async sendEmailNotification(message) {
    if (!this.config.email.smtpHost || !this.config.email.username) {
      console.warn('⚠️ SMTP-Konfiguration nicht vollständig');
      return;
    }

    // Hier würde die E-Mail-Versendung implementiert
    // Für dieses Beispiel nur Logging
    console.log('📧 E-Mail-Benachrichtigung würde gesendet werden:');
    console.log(`   Von: ${this.config.email.from}`);
    console.log(`   An: ${this.config.email.to}`);
    console.log(`   Betreff: 🚨 Anti-Regelbruch: Aktion blockiert`);
    console.log(`   Inhalt: ${message.text}`);
  }

  /**
   * 🎮 Discord-Benachrichtigung senden
   */
  async sendDiscordNotification(message) {
    if (!this.config.discord.webhookUrl) {
      console.warn('⚠️ Discord Webhook URL nicht konfiguriert');
      return;
    }

    const payload = {
      content: message.text,
      embeds: [
        {
          title: '🚨 Anti-Regelbruch: Aktion blockiert',
          description: message.text,
          color: 0xff0000, // Rot
          timestamp: new Date().toISOString(),
          footer: {
            text: 'Anti-Regelbruch Enterprise++ Modul',
          },
        },
      ],
    };

    return new Promise((resolve, reject) => {
      const data = JSON.stringify(payload);

      const options = {
        hostname: new URL(this.config.discord.webhookUrl).hostname,
        port: 443,
        path: new URL(this.config.discord.webhookUrl).pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
        },
      };

      const req = https.request(options, res => {
        if (res.statusCode === 204) {
          console.log('✅ Discord-Benachrichtigung gesendet');
          resolve();
        } else {
          reject(new Error(`Discord API Fehler: ${res.statusCode}`));
        }
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  /**
   * 📊 Benachrichtigungs-Status anzeigen
   */
  showStatus() {
    console.log('\n🔔 Anti-Regelbruch-Benachrichtigungssystem Status:');
    console.log(
      `   Slack: ${this.config.slack.enabled ? '✅ Aktiviert' : '❌ Deaktiviert'}`
    );
    console.log(
      `   Telegram: ${this.config.telegram.enabled ? '✅ Aktiviert' : '❌ Deaktiviert'}`
    );
    console.log(
      `   E-Mail: ${this.config.email.enabled ? '✅ Aktiviert' : '❌ Deaktiviert'}`
    );
    console.log(
      `   Discord: ${this.config.discord.enabled ? '✅ Aktiviert' : '❌ Deaktiviert'}`
    );
    console.log(
      `   Gesendete Benachrichtigungen: ${this.notificationHistory.filter(n => n.sent).length}`
    );
    console.log(
      `   Fehlgeschlagene Benachrichtigungen: ${this.notificationHistory.filter(n => !n.sent).length}`
    );
  }

  /**
   * 🔧 Konfiguration aktualisieren
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log('🔧 Benachrichtigungs-Konfiguration aktualisiert');
  }

  /**
   * 📝 Benachrichtigungs-Historie speichern
   */
  saveHistory() {
    const historyFile = 'anti-rule-break-notifications.json';
    try {
      fs.writeFileSync(
        historyFile,
        JSON.stringify(this.notificationHistory, null, 2)
      );
      console.log(
        `📝 Benachrichtigungs-Historie in ${historyFile} gespeichert`
      );
    } catch (error) {
      console.error('❌ Fehler beim Speichern der Historie:', error);
    }
  }

  /**
   * 📖 Benachrichtigungs-Historie laden
   */
  loadHistory() {
    const historyFile = 'anti-rule-break-notifications.json';
    try {
      if (fs.existsSync(historyFile)) {
        this.notificationHistory = JSON.parse(
          fs.readFileSync(historyFile, 'utf8')
        );
        console.log(`📖 Benachrichtigungs-Historie aus ${historyFile} geladen`);
      }
    } catch (error) {
      console.error('❌ Fehler beim Laden der Historie:', error);
    }
  }
}

// Export für Verwendung in anderen Modulen
module.exports = {
  AntiRuleBreakNotifications,
  NOTIFICATION_CONFIG,
};

// Hauptfunktion für Kommandozeilen-Aufruf
if (require.main === module) {
  const command = process.argv[2];
  const notifications = new AntiRuleBreakNotifications();

  switch (command) {
    case 'test':
      // Test-Benachrichtigung senden
      const testViolation = {
        rule: 'Test-Regel',
        reason: 'Test-Verstoß für Langzeittest',
        violationCount: 999,
      };
      notifications.sendViolationNotification(testViolation);
      break;
    case 'status':
      notifications.showStatus();
      break;
    case 'history':
      notifications.loadHistory();
      console.log('📊 Benachrichtigungs-Historie:');
      notifications.notificationHistory.forEach((notification, index) => {
        console.log(
          `   ${index + 1}. ${notification.timestamp} - ${notification.sent ? '✅' : '❌'} ${notification.violation.rule}`
        );
      });
      break;
    default:
      console.log(
        '🔔 Anti-Regelbruch Enterprise++ Modul - Monitoring & Benachrichtigungen'
      );
      console.log('Verwendung:');
      console.log(
        '  node anti-rule-break-notifications.js test     - Test-Benachrichtigung senden'
      );
      console.log(
        '  node anti-rule-break-notifications.js status   - Status anzeigen'
      );
      console.log(
        '  node anti-rule-break-notifications.js history  - Historie anzeigen'
      );
  }
}
