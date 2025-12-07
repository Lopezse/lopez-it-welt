// =====================================================
// ENTERPRISE++ AUDIT-MODUS SETTINGS API
// =====================================================
// GET /api/admin/settings/audit-mode - Status abrufen
// POST /api/admin/settings/audit-mode - Aktivieren/Deaktivieren
// 
// Enterprise++ Quality Gate:
// - auditMode = true: Tasks benötigen Score >= 70
// - auditMode = false: Keine automatische Prüfung
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";

// TODO: Admin-Auth/RBAC - Security-Phase

// =====================================================
// GET - Audit-Modus Status abrufen
// =====================================================

export async function GET() {
  try {
    const pool = await getConnection();
    
    // Setting aus DB laden
    const [rows] = await pool.execute(
      `SELECT setting_value FROM lopez_settings WHERE setting_key = 'audit_mode'`
    );
    
    const settings = rows as any[];
    const auditMode = settings.length > 0 
      ? settings[0].setting_value === 'true' 
      : true; // Default: aktiviert
    
    return NextResponse.json({
      success: true,
      data: {
        auditMode,
        description: auditMode 
          ? "Enterprise++ Audit-Modus AKTIV: Tasks benötigen Quality Gate >= 70/100"
          : "Audit-Modus deaktiviert: Keine automatische Quality-Prüfung",
        qualityGate: {
          minScore: 70,
          maxScore: 100
        }
      }
    });
    
  } catch (error) {
    console.error("❌ Audit-Mode GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Laden des Audit-Modus" },
      { status: 500 }
    );
  }
}

// =====================================================
// POST - Audit-Modus aktivieren/deaktivieren
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { enabled } = body;
    
    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { success: false, error: "enabled muss ein boolean sein" },
        { status: 400 }
      );
    }
    
    const pool = await getConnection();
    
    // Setting aktualisieren oder erstellen
    await pool.execute(`
      INSERT INTO lopez_settings (setting_key, setting_value, setting_type, description)
      VALUES ('audit_mode', ?, 'boolean', 'Enterprise++ Audit-Modus')
      ON DUPLICATE KEY UPDATE setting_value = ?, updated_at = NOW()
    `, [enabled ? 'true' : 'false', enabled ? 'true' : 'false']);
    
    // Audit-Log
    try {
      await pool.execute(`
        INSERT INTO lopez_audit_logs (user_id, action, entity_type, details)
        VALUES (1, 'AUDIT_MODE_CHANGED', 'settings', ?)
      `, [JSON.stringify({ auditMode: enabled })]);
    } catch (e) {
      // Audit optional
    }
    
    return NextResponse.json({
      success: true,
      message: enabled 
        ? "✅ Audit-Modus AKTIVIERT: Tasks benötigen Quality Gate >= 70/100"
        : "⚠️ Audit-Modus DEAKTIVIERT: Keine automatische Quality-Prüfung",
      data: {
        auditMode: enabled
      }
    });
    
  } catch (error) {
    console.error("❌ Audit-Mode POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Fehler beim Ändern des Audit-Modus" },
      { status: 500 }
    );
  }
}



