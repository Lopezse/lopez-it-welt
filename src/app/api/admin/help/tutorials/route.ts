/**
 * API Route: /api/admin/help/tutorials
 * 
 * Verwaltet Tutorials im Help-System
 * Enterprise++ Standard
 */

import { NextRequest, NextResponse } from "next/server";
import { executeQueryPool, executeQueryPoolWithResult } from "@/lib/db";
import { logger } from "@/lib/logger";

/**
 * GET /api/admin/help/tutorials
 * Lädt alle Tutorials mit ihren Schritten
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = `SELECT 
      id,
      title,
      description,
      category,
      order_index,
      is_active
    FROM help_tutorials
    WHERE is_active = TRUE`;

    const params: any[] = [];

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    query += " ORDER BY order_index ASC";

    const tutorials = await executeQueryPool<any[]>(query, params);

    // Für jedes Tutorial die Schritte laden
    const tutorialsWithSteps = await Promise.all(
      (tutorials || []).map(async (tutorial) => {
        const steps = await executeQueryPool<any[]>(
          `SELECT 
            id,
            title,
            description,
            order_index
          FROM help_tutorial_steps
          WHERE tutorial_id = ? AND is_active = TRUE
          ORDER BY order_index ASC`,
          [tutorial.id]
        );

        return {
          id: tutorial.id,
          title: tutorial.title,
          description: tutorial.description,
          category: tutorial.category,
          steps: (steps || []).map((step) => ({
            title: step.title,
            description: step.description,
            completed: false, // TODO: Aus help_tutorial_progress laden
          })),
          completed: false, // TODO: Aus help_tutorial_progress laden
        };
      })
    );

    return NextResponse.json(tutorialsWithSteps, { status: 200 });
  } catch (error) {
    logger.error("Fehler beim Laden der Tutorials", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Tutorials" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/help/tutorials
 * Erstellt ein neues Tutorial
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { title, description, category, order_index, steps } = body;

    // Tutorial erstellen
    const result = await executeQueryPoolWithResult(
      `INSERT INTO help_tutorials (title, description, category, order_index)
      VALUES (?, ?, ?, ?)`,
      [title, description || null, category || null, order_index || 0]
    );

    const tutorialId = result.insertId;

    // Schritte erstellen
    if (steps && Array.isArray(steps)) {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        await executeQueryPool(
          `INSERT INTO help_tutorial_steps (tutorial_id, title, description, order_index)
          VALUES (?, ?, ?, ?)`,
          [tutorialId, step.title, step.description || null, i]
        );
      }
    }

    return NextResponse.json(
      { id: tutorialId, message: "Tutorial erstellt" },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Fehler beim Erstellen des Tutorials", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen des Tutorials" },
      { status: 500 }
    );
  }
}

