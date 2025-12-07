// =====================================================
// DEVICE MANAGEMENT API - LOPEZ IT WELT
// =====================================================
// Geräte verwalten
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { AdvancedSecurityService } from "@/lib/advanced-security-service";
import { SessionSecurityService } from "@/lib/session-security";

// GET - Alle Geräte des aktuellen Benutzers
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("adm_session")?.value;
    const jwtToken = request.cookies.get("adm_token")?.value;
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const validation = await SessionSecurityService.validateSession(
      sessionToken,
      jwtToken,
      clientIp,
      userAgent
    );

    if (!validation.valid || !validation.session) {
      return NextResponse.json({ success: false, message: "Nicht autorisiert" }, { status: 401 });
    }

    const devices = await AdvancedSecurityService.getUserDevices(validation.session.userId);

    // Aktuelles Gerät markieren
    const currentFingerprint = await getCurrentDeviceFingerprint(userAgent, clientIp);

    return NextResponse.json({
      success: true,
      data: {
        devices: devices.map(d => ({
          ...d,
          isCurrent: d.deviceFingerprint === currentFingerprint,
        })),
      },
    });
  } catch (error) {
    console.error("Devices GET Fehler:", error);
    return NextResponse.json({ success: false, message: "Fehler" }, { status: 500 });
  }
}

// DELETE - Gerät entfernen
export async function DELETE(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("adm_session")?.value;
    const jwtToken = request.cookies.get("adm_token")?.value;
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const validation = await SessionSecurityService.validateSession(
      sessionToken,
      jwtToken,
      clientIp,
      userAgent
    );

    if (!validation.valid || !validation.session) {
      return NextResponse.json({ success: false, message: "Nicht autorisiert" }, { status: 401 });
    }

    const body = await request.json();
    const { deviceId, removeAll } = body;

    if (removeAll) {
      // Alle Geräte entfernen (außer aktuelles)
      const currentFingerprint = await getCurrentDeviceFingerprint(userAgent, clientIp);
      const devices = await AdvancedSecurityService.getUserDevices(validation.session.userId);
      const currentDevice = devices.find(d => d.deviceFingerprint === currentFingerprint);

      const removed = await AdvancedSecurityService.removeAllDevices(
        validation.session.userId,
        currentDevice?.id
      );

      return NextResponse.json({
        success: true,
        message: `${removed} Geräte entfernt`,
      });
    }

    if (deviceId) {
      const success = await AdvancedSecurityService.removeDevice(
        validation.session.userId,
        deviceId
      );

      if (!success) {
        return NextResponse.json({ success: false, message: "Gerät nicht gefunden" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: "Gerät entfernt",
      });
    }

    return NextResponse.json({ success: false, message: "Keine Aktion angegeben" }, { status: 400 });
  } catch (error) {
    console.error("Devices DELETE Fehler:", error);
    return NextResponse.json({ success: false, message: "Fehler" }, { status: 500 });
  }
}

// PUT - Gerät als vertrauenswürdig markieren
export async function PUT(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("adm_session")?.value;
    const jwtToken = request.cookies.get("adm_token")?.value;
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const validation = await SessionSecurityService.validateSession(
      sessionToken,
      jwtToken,
      clientIp,
      userAgent
    );

    if (!validation.valid || !validation.session) {
      return NextResponse.json({ success: false, message: "Nicht autorisiert" }, { status: 401 });
    }

    const body = await request.json();
    const { deviceId, trusted } = body;

    if (trusted) {
      const success = await AdvancedSecurityService.trustDevice(
        validation.session.userId,
        deviceId
      );

      if (!success) {
        return NextResponse.json({ success: false, message: "Gerät nicht gefunden" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: "Gerät als vertrauenswürdig markiert",
      });
    }

    return NextResponse.json({ success: false, message: "Keine Aktion angegeben" }, { status: 400 });
  } catch (error) {
    console.error("Devices PUT Fehler:", error);
    return NextResponse.json({ success: false, message: "Fehler" }, { status: 500 });
  }
}

// Hilfsfunktion: Device Fingerprint erstellen
async function getCurrentDeviceFingerprint(userAgent: string, ipAddress: string): Promise<string> {
  const crypto = await import("crypto");
  
  let browser = "Unknown";
  let os = "Unknown";
  
  if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Edg")) browser = "Edge";
  else if (userAgent.includes("Chrome")) browser = "Chrome";
  else if (userAgent.includes("Safari")) browser = "Safari";
  
  if (userAgent.includes("Windows")) os = "Windows";
  else if (userAgent.includes("Mac")) os = "macOS";
  else if (userAgent.includes("Linux")) os = "Linux";
  
  const data = `${browser}|${os}|${userAgent.length}`;
  return crypto.createHash("sha256").update(data).digest("hex").substring(0, 32);
}















