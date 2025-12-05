/**
 * Policy Validation API - Enterprise++ Standard E.2.4
 * 
 * POST /api/admin/policies/validate - Policy validieren
 * 
 * RBAC: policy.manage
 */

import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, category, type, content } = body;

    // RBAC-Prüfung (vereinfacht - in Produktion: echte Session-Prüfung)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const errors: string[] = [];

    // Validierung
    if (!name || name.trim().length === 0) {
      errors.push("Name ist erforderlich");
    }

    if (!description || description.trim().length === 0) {
      errors.push("Beschreibung ist erforderlich");
    }

    if (!category || category.trim().length === 0) {
      errors.push("Kategorie ist erforderlich");
    }

    if (!type) {
      errors.push("Typ ist erforderlich");
    }

    if (!content || content.trim().length === 0) {
      errors.push("Policy-Inhalt ist erforderlich");
    } else {
      // JSON-Validierung
      try {
        JSON.parse(content);
      } catch (jsonError) {
        errors.push("Policy-Inhalt muss gültiges JSON sein");
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        valid: errors.length === 0,
        errors,
      },
    });
  } catch (error) {
    logger.error("Fehler bei der Policy-Validierung", error);
    return NextResponse.json(
      { success: false, error: "Fehler bei der Validierung" },
      { status: 500 }
    );
  }
}



