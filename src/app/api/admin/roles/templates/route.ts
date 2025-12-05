import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

/**
 * GET /api/admin/roles/templates
 * 
 * Gibt alle verfügbaren Rollen-Templates zurück.
 */
export async function GET(request: NextRequest) {
  try {
    // Vordefinierte Rollen-Templates
    const templates = [
      {
        id: "admin",
        name: "Administrator",
        code: "admin",
        description: "Vollzugriff auf alle Funktionen des Systems",
        permissions: [
          "monitoring.view",
          "monitoring.manage",
          "logs.view",
          "logs.manage",
          "security.view",
          "security.manage",
          "office.view",
          "office.manage",
          "media.view",
          "media.manage",
          "compliance.view",
          "compliance.manage",
          "audit.view",
          "audit.manage",
          "policy.view",
          "policy.manage",
          "orchestrator.view",
          "orchestrator.manage",
          "system.view",
          "system.manage",
        ],
        category: "System",
        icon: "shield",
      },
      {
        id: "viewer",
        name: "Viewer",
        code: "viewer",
        description: "Nur Lese-Zugriff auf alle Bereiche",
        permissions: [
          "monitoring.view",
          "logs.view",
          "security.view",
          "office.view",
          "media.view",
          "compliance.view",
          "audit.view",
          "policy.view",
          "orchestrator.view",
          "system.view",
        ],
        category: "Standard",
        icon: "eye",
      },
      {
        id: "editor",
        name: "Editor",
        code: "editor",
        description: "Lese- und Schreib-Zugriff auf Content-Bereiche",
        permissions: [
          "monitoring.view",
          "logs.view",
          "office.view",
          "office.manage",
          "media.view",
          "media.manage",
          "compliance.view",
        ],
        category: "Content",
        icon: "edit",
      },
      {
        id: "office",
        name: "Office Manager",
        code: "office",
        description: "Vollzugriff auf Office-Management (Rechnungen, Projekte, etc.)",
        permissions: [
          "office.view",
          "office.manage",
          "monitoring.view",
          "logs.view",
          "audit.view",
        ],
        category: "Business",
        icon: "briefcase",
      },
      {
        id: "tech",
        name: "Techniker",
        code: "tech",
        description: "Zugriff auf technische Bereiche (Monitoring, Logs, System)",
        permissions: [
          "monitoring.view",
          "monitoring.manage",
          "logs.view",
          "logs.manage",
          "system.view",
          "system.manage",
          "orchestrator.view",
        ],
        category: "Technical",
        icon: "wrench",
      },
      {
        id: "compliance",
        name: "Compliance Manager",
        code: "compliance",
        description: "Vollzugriff auf Compliance-Bereiche (DSGVO, GoBD, Audit)",
        permissions: [
          "compliance.view",
          "compliance.manage",
          "audit.view",
          "audit.manage",
          "policy.view",
          "policy.manage",
          "monitoring.view",
        ],
        category: "Compliance",
        icon: "shield-check",
      },
    ];

    return NextResponse.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    logger.error("Fehler beim Laden der Rollen-Templates", error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden der Rollen-Templates" },
      { status: 500 },
    );
  }
}



