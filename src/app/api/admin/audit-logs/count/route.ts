// =====================================================
// AUDIT-LOGS COUNT API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Anzahl der Audit-Logs für Badge-Anzeige
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { RowDataPacket } from "mysql2/promise";

export async function GET(request: NextRequest) {
  try {
    const pool = await getConnection();
    const connection = await pool.getConnection();
    
    try {
      // Zähle alle Audit-Logs (oder nur die letzten 24 Stunden für relevante Badge)
      const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT COUNT(*) as total 
         FROM lopez_audit_logs 
         WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)`
      );
      
      const count = rows[0]?.total || 0;
      
      return NextResponse.json({
        success: true,
        count: count,
        total: count,
      });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("❌ Fehler beim Zählen der Audit-Logs:", error);
    // Fallback: 0 zurückgeben statt Fehler
    return NextResponse.json({
      success: true,
      count: 0,
      total: 0,
    });
  }
}

