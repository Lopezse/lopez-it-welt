/**
 * API Route: /api/admin/navigation
 * 
 * Verwaltet die Admin-Navigation (aus Datenbank)
 * Enterprise++ Standard
 */

import { NextRequest, NextResponse } from "next/server";
import { executeQueryPool, executeQueryPoolWithResult } from "@/lib/db";
import { logger } from "@/lib/logger";

/**
 * GET /api/admin/navigation
 * Lädt die komplette Navigation-Struktur
 */
export async function GET(request: NextRequest) {
  try {
    // Prüfen ob Tabelle existiert
    try {
      await executeQueryPool<any[]>(
        `SELECT 1 FROM admin_navigation_items LIMIT 1`
      );
    } catch (tableError: any) {
      // Tabelle existiert nicht - Fallback auf leere Navigation
      logger.error("Navigation-Tabelle existiert nicht, verwende Fallback", tableError);
      return NextResponse.json([], { status: 200 });
    }

    // Haupt-Navigationspunkte laden
    const mainItems = await executeQueryPool<any[]>(
      `SELECT 
        id,
        name,
        href,
        icon_name,
        description,
        order_index,
        badge_text,
        badge_color,
        dynamic_badge,
        badge_api_endpoint,
        is_active,
        requires_permission
      FROM admin_navigation_items
      WHERE is_active = TRUE
      ORDER BY order_index ASC`
    );

    // Für jeden Hauptpunkt die Sub-Items laden
    const navigationItems = await Promise.all(
      (mainItems || []).map(async (item) => {
        try {
          const subItems = await executeQueryPool<any[]>(
            `SELECT 
              id,
              name,
              href,
              icon_name,
              order_index,
              badge_text,
              badge_color,
              dynamic_badge,
              badge_api_endpoint,
              is_active,
              requires_permission
            FROM admin_navigation_sub_items
            WHERE navigation_item_id = ? AND is_active = TRUE
            ORDER BY order_index ASC`,
            [item.id]
          );

          return {
            ...item,
            subItems: subItems || [],
          };
        } catch (subError) {
          logger.error(`Fehler beim Laden der Sub-Items für ${item.id}`, subError);
          return {
            ...item,
            subItems: [],
          };
        }
      })
    );

    return NextResponse.json(navigationItems, { status: 200 });
  } catch (error: any) {
    logger.error("Fehler beim Laden der Navigation", error);
    // Detaillierte Fehlerinformationen im Development-Modus
    const errorMessage = process.env.NODE_ENV === "development" 
      ? error?.message || "Fehler beim Laden der Navigation"
      : "Fehler beim Laden der Navigation";
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? {
          code: error?.code,
          sqlMessage: error?.sqlMessage,
        } : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/navigation
 * Erstellt einen neuen Navigationspunkt
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      href,
      icon_name,
      description,
      order_index,
      badge_text,
      badge_color,
      dynamic_badge,
      badge_api_endpoint,
      requires_permission,
    } = body;

    const result = await executeQueryPoolWithResult(
      `INSERT INTO admin_navigation_items 
        (name, href, icon_name, description, order_index, badge_text, badge_color, dynamic_badge, badge_api_endpoint, requires_permission)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        href || null,
        icon_name || null,
        description || null,
        order_index || 0,
        badge_text || null,
        badge_color || null,
        dynamic_badge || false,
        badge_api_endpoint || null,
        requires_permission || null,
      ]
    );

    return NextResponse.json(
      { id: result.insertId, message: "Navigationspunkt erstellt" },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Fehler beim Erstellen des Navigationspunkts", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen des Navigationspunkts" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/navigation
 * Aktualisiert einen Navigationspunkt
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      id,
      name,
      href,
      icon_name,
      description,
      order_index,
      badge_text,
      badge_color,
      dynamic_badge,
      badge_api_endpoint,
      is_active,
      requires_permission,
    } = body;

    await executeQueryPool(
      `UPDATE admin_navigation_items 
      SET name = ?, href = ?, icon_name = ?, description = ?, order_index = ?,
          badge_text = ?, badge_color = ?, dynamic_badge = ?, badge_api_endpoint = ?,
          is_active = ?, requires_permission = ?
      WHERE id = ?`,
      [
        name,
        href || null,
        icon_name || null,
        description || null,
        order_index || 0,
        badge_text || null,
        badge_color || null,
        dynamic_badge || false,
        badge_api_endpoint || null,
        is_active !== undefined ? is_active : true,
        requires_permission || null,
        id,
      ]
    );

    return NextResponse.json(
      { message: "Navigationspunkt aktualisiert" },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Fehler beim Aktualisieren des Navigationspunkts", error);
    return NextResponse.json(
      { error: "Fehler beim Aktualisieren des Navigationspunkts" },
      { status: 500 }
    );
  }
}

