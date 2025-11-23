// =====================================================
// ALERTING API ROUTE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Enterprise++ Alerting API Endpoint
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { UnifiedAlert, unifiedAlertingService } from "@/lib/unified-alerting";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // API: Alerting Request erhalten

    const body = await request.json();
    const { alert, test = false } = body;

    if (!alert) {
      return NextResponse.json(
        {
          success: false,
          error: "Alert-Daten erforderlich",
        },
        { status: 400 },
      );
    }

    // Alert validieren
    const validationResult = validateAlert(alert);
    if (!validationResult.valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Ungültige Alert-Daten",
          details: validationResult.errors,
        },
        { status: 400 },
      );
    }

    // Test-Modus
    if (test) {
      // Test-Alert wird gesendet...
      const testResult = await unifiedAlertingService.sendTestAlert();

      return NextResponse.json({
        success: testResult,
        message: testResult ? "Test-Alert erfolgreich gesendet" : "Test-Alert fehlgeschlagen",
        test: true,
      });
    }

    // Echten Alert senden
    const result = await unifiedAlertingService.sendAlert(alert as UnifiedAlert);

    // API: Alert erfolgreich verarbeitet
    return NextResponse.json({
      success: true,
      message: "Alert erfolgreich gesendet",
      results: result,
      alertId: alert.id,
    });
  } catch (error) {
    // API: Alerting Fehler: ${error}

    return NextResponse.json(
      {
        success: false,
        error: "Interner Server-Fehler",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // API: Alerting Status abfragen

    // Verbindungstests durchführen
    const connectionTests = await unifiedAlertingService.testAllConnections();

    // Konfiguration abrufen
    const config = unifiedAlertingService.getConfig();

    // Regeln abrufen
    const rules = unifiedAlertingService.getRules();

    return NextResponse.json({
      success: true,
      status: {
        connections: connectionTests,
        config: {
          email: {
            enabled: config.email.enabled,
            from: config.email.from,
            to: config.email.to,
          },
          sms: {
            enabled: config.sms.enabled,
            provider: config.sms.provider,
            to: config.sms.to,
          },
          slack: {
            enabled: config.slack.enabled,
            channel: config.slack.channel,
            username: config.slack.username,
          },
        },
        rules: Object.keys(rules),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    // API: Alerting Status Fehler: ${error}

    return NextResponse.json(
      {
        success: false,
        error: "Status konnte nicht abgerufen werden",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// =====================================================
// VALIDATION FUNCTIONS
// =====================================================

function validateAlert(alert: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Erforderliche Felder prüfen
  if (!alert.id || typeof alert.id !== "string") {
    errors.push("ID ist erforderlich und muss ein String sein");
  }

  if (
    !alert.type ||
    !["security", "performance", "compliance", "system", "error"].includes(alert.type)
  ) {
    errors.push(
      "Typ muss einer der folgenden sein: security, performance, compliance, system, error",
    );
  }

  if (!alert.severity || !["low", "medium", "high", "critical"].includes(alert.severity)) {
    errors.push("Schweregrad muss einer der folgenden sein: low, medium, high, critical");
  }

  if (!alert.title || typeof alert.title !== "string") {
    errors.push("Titel ist erforderlich und muss ein String sein");
  }

  if (!alert.description || typeof alert.description !== "string") {
    errors.push("Beschreibung ist erforderlich und muss ein String sein");
  }

  if (!alert.timestamp || typeof alert.timestamp !== "string") {
    errors.push("Zeitstempel ist erforderlich und muss ein String sein");
  }

  if (!alert.source || typeof alert.source !== "string") {
    errors.push("Quelle ist erforderlich und muss ein String sein");
  }

  // Optionale Felder prüfen
  if (alert.channels && !Array.isArray(alert.channels)) {
    errors.push("Kanäle müssen ein Array sein");
  }

  if (
    alert.priority &&
    (typeof alert.priority !== "number" || alert.priority < 1 || alert.priority > 10)
  ) {
    errors.push("Priorität muss eine Zahl zwischen 1 und 10 sein");
  }

  if (alert.metadata && typeof alert.metadata !== "object") {
    errors.push("Metadaten müssen ein Objekt sein");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
