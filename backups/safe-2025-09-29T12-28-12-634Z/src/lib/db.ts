import mysql from "mysql2/promise";

/**
 * Zentrale MySQL-Datenbankverbindung mit UTF-8 Konfiguration
 * Enterprise++ Standard für alle API-Routen
 *
 * @author Ramiro Lopez Rodriguez
 * @version 1.0.0
 * @date 2025-09-28
 */

// MySQL-Verbindungskonfiguration - MySQL2-kompatibel
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "lopez_it_welt",
  port: 3306,
  charset: "utf8mb4",
  supportBigNumbers: true,
  bigNumberStrings: true,
  // MySQL2-spezifische Pool-Optionen
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
};

// Verbindungspool für bessere Performance
let pool: mysql.Pool | null = null;

/**
 * Erstellt oder gibt bestehenden Verbindungspool zurück
 */
export function getConnectionPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "",
      database: "lopez_it_welt",
      port: 3306,
      charset: "utf8mb4",
      supportBigNumbers: true,
      bigNumberStrings: true,
      // Pool-spezifische Konfiguration (nur gültige Optionen)
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

/**
 * Erstellt eine neue Datenbankverbindung mit UTF-8 Konfiguration
 */
export async function createConnection(): Promise<mysql.Connection> {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // UTF-8 explizit setzen für maximale Kompatibilität
    await connection.execute("SET NAMES utf8mb4");
    await connection.execute("SET CHARACTER SET utf8mb4");
    await connection.execute("SET character_set_connection=utf8mb4");
    await connection.execute("SET character_set_results=utf8mb4");
    await connection.execute("SET character_set_client=utf8mb4");

    return connection;
  } catch (error) {
    console.error("❌ MySQL-Verbindung fehlgeschlagen:", error);
    throw new Error(
      `Datenbankverbindung fehlgeschlagen: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`,
    );
  }
}

/**
 * Führt eine Query mit UTF-8 Konfiguration aus
 */
export async function executeQuery<T = any>(sql: string, params: any[] = []): Promise<T> {
  const connection = await createConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows as T;
  } finally {
    await connection.end();
  }
}

/**
 * Führt eine Query mit Verbindungspool aus (für häufige Abfragen)
 */
export async function executeQueryPool<T = any>(sql: string, params: any[] = []): Promise<T> {
  const pool = getConnectionPool();
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}

/**
 * Schließt den Verbindungspool (beim Herunterfahren)
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

/**
 * Testet die Datenbankverbindung
 */
export async function testConnection(): Promise<boolean> {
  try {
    const connection = await createConnection();
    await connection.execute("SELECT 1");
    await connection.end();
    return true;
  } catch (error) {
    console.error("❌ Datenbankverbindung fehlgeschlagen:", error);
    return false;
  }
}

/**
 * Prüft UTF-8 Konfiguration der Datenbank
 */
export async function checkUTF8Config(): Promise<{
  database: string;
  server: string;
  connection: string;
  results: string;
}> {
  const connection = await createConnection();
  try {
    const [rows] = await connection.execute(`
      SELECT 
        @@character_set_database as database,
        @@character_set_server as server,
        @@character_set_connection as connection,
        @@character_set_results as results
    `);

    const result = (rows as any[])[0];
    await connection.end();

    return {
      database: result.database,
      server: result.server,
      connection: result.connection,
      results: result.results,
    };
  } catch (error) {
    await connection.end();
    throw error;
  }
}
