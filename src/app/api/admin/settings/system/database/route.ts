/**
 * Enterprise++ API: Datenbank-Einstellungen
 * GET /api/admin/settings/system/database - DB-Status abrufen
 * POST /api/admin/settings/system/database - DB-Aktion ausführen
 */

import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lopez_it_welt",
};

interface TableInfo {
  name: string;
  rows: number;
  size: string;
  engine: string;
  created: string;
}

/**
 * GET: Datenbank-Status abrufen
 */
export async function GET(request: NextRequest) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Datenbank-Informationen
    const [versionRows] = await connection.execute(`SELECT VERSION() as version`);
    const version = (versionRows as any[])[0]?.version || "Unknown";
    
    // Tabellen-Informationen
    const [tableRows] = await connection.execute(`
      SELECT 
        table_name as name,
        table_rows as rows,
        ROUND((data_length + index_length) / 1024 / 1024, 2) as size_mb,
        engine,
        create_time as created
      FROM information_schema.tables
      WHERE table_schema = ?
      ORDER BY table_name
    `, [dbConfig.database]);
    
    const tables: TableInfo[] = (tableRows as any[]).map(t => ({
      name: t.name,
      rows: t.rows || 0,
      size: `${t.size_mb || 0} MB`,
      engine: t.engine || "InnoDB",
      created: t.created ? new Date(t.created).toISOString() : "",
    }));
    
    // Gesamtgröße
    const [sizeRows] = await connection.execute(`
      SELECT 
        ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as total_size
      FROM information_schema.tables
      WHERE table_schema = ?
    `, [dbConfig.database]);
    const totalSize = (sizeRows as any[])[0]?.total_size || 0;
    
    // Verbindungs-Statistiken
    const [connRows] = await connection.execute(`SHOW STATUS LIKE 'Threads_connected'`);
    const connections = parseInt((connRows as any[])[0]?.Value || "0", 10);
    
    const [maxConnRows] = await connection.execute(`SHOW VARIABLES LIKE 'max_connections'`);
    const maxConnections = parseInt((maxConnRows as any[])[0]?.Value || "100", 10);
    
    await connection.end();
    
    return NextResponse.json({
      success: true,
      data: {
        connection: {
          host: dbConfig.host,
          database: dbConfig.database,
          status: "connected",
          version,
        },
        statistics: {
          tables_count: tables.length,
          total_size: `${totalSize} MB`,
          active_connections: connections,
          max_connections: maxConnections,
        },
        tables,
      },
    });
  } catch (error: any) {
    console.error("Fehler beim Laden der Datenbank-Informationen:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Fehler beim Laden", 
        error: error.message,
        data: {
          connection: {
            host: dbConfig.host,
            database: dbConfig.database,
            status: "error",
            version: "Unknown",
          },
          statistics: {
            tables_count: 0,
            total_size: "0 MB",
            active_connections: 0,
            max_connections: 0,
          },
          tables: [],
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST: Datenbank-Aktion ausführen
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, table } = body;
    
    const connection = await mysql.createConnection(dbConfig);
    
    switch (action) {
      case "optimize":
        // Tabelle optimieren
        if (table) {
          await connection.execute(`OPTIMIZE TABLE ${mysql.escapeId(table)}`);
          await connection.end();
          return NextResponse.json({
            success: true,
            message: `Tabelle ${table} wurde optimiert`,
          });
        }
        // Alle Tabellen optimieren
        const [tables] = await connection.execute(`
          SELECT table_name FROM information_schema.tables 
          WHERE table_schema = ?
        `, [dbConfig.database]);
        
        for (const t of tables as any[]) {
          await connection.execute(`OPTIMIZE TABLE ${mysql.escapeId(t.table_name)}`);
        }
        await connection.end();
        return NextResponse.json({
          success: true,
          message: `${(tables as any[]).length} Tabellen wurden optimiert`,
        });
        
      case "analyze":
        // Tabellen analysieren
        if (table) {
          await connection.execute(`ANALYZE TABLE ${mysql.escapeId(table)}`);
          await connection.end();
          return NextResponse.json({
            success: true,
            message: `Tabelle ${table} wurde analysiert`,
          });
        }
        break;
        
      case "check":
        // Tabellen prüfen
        if (table) {
          const [result] = await connection.execute(`CHECK TABLE ${mysql.escapeId(table)}`);
          await connection.end();
          return NextResponse.json({
            success: true,
            message: `Tabelle ${table} wurde geprüft`,
            data: result,
          });
        }
        break;
        
      case "test_connection":
        // Verbindungstest
        await connection.execute(`SELECT 1`);
        await connection.end();
        return NextResponse.json({
          success: true,
          message: "Datenbankverbindung erfolgreich",
        });
        
      default:
        await connection.end();
        return NextResponse.json(
          { success: false, message: "Unbekannte Aktion" },
          { status: 400 }
        );
    }
    
    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Fehler bei Datenbank-Aktion:", error);
    return NextResponse.json(
      { success: false, message: "Fehler", error: error.message },
      { status: 500 }
    );
  }
}




