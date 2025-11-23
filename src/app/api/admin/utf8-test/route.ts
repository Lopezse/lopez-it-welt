import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * UTF-8 Test API Route
 * Testet Umlaute mit Node.js/MySQL2 direkt
 *
 * @author Ramiro Lopez Rodriguez
 * @version 1.0.0
 * @date 2025-09-29
 */

export async function POST() {
  try {
    const connection = await createConnection();

    // Test-Tabelle löschen und neu erstellen
    await connection.execute("DROP TABLE IF EXISTS test_utf8");
    await connection.execute(`
      CREATE TABLE test_utf8 (
        id INT AUTO_INCREMENT PRIMARY KEY,
        txt VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Test-Daten mit korrekten Umlauten einfügen
    const testData = [
      "Lösungen Test",
      "maßgeschneiderte Software",
      "persönliche Betreuung",
      "für digitale Innovation",
      "ö, ä, ü, ß Test",
      "Professionelle IT-Lösungen",
      "Wir entwickeln maßgeschneiderte Software-Lösungen mit Fokus auf Barrierefreiheit und persönliche Betreuung.",
    ];

    const results = [];
    for (const text of testData) {
      const [result] = await connection.execute("INSERT INTO test_utf8 (txt) VALUES (?)", [text]);
      results.push({
        id: (result as any).insertId,
        text: text,
        status: "success",
      });
    }

    // Test-Daten abrufen und prüfen
    const [rows] = await connection.execute("SELECT * FROM test_utf8 ORDER BY id");

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        message: "Test-Umlaute erfolgreich eingefügt",
        inserted: results.length,
        data: rows,
        testResults: results,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    );
  } catch (error) {
    console.error("❌ UTF-8 Test Fehler:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Fehler beim Einfügen der Test-Umlaute",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    );
  }
}

export async function GET() {
  try {
    const connection = await createConnection();

    // Test-Daten abrufen
    const [rows] = await connection.execute("SELECT * FROM test_utf8 ORDER BY id");

    await connection.end();

    return NextResponse.json(
      {
        success: true,
        data: rows,
        count: rows.length,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    );
  } catch (error) {
    console.error("❌ UTF-8 Test GET Fehler:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Fehler beim Abrufen der Test-Daten",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    );
  }
}
