/**
 * API Route: /api/admin/navigation/sub-items
 * 
 * Verwaltet Sub-Navigationspunkte
 * Enterprise++ Standard
 */

import { NextRequest, NextResponse } from "next/server";
import { executeQueryPool, executeQueryPoolWithResult } from "@/lib/db";
import { logger } from "@/lib/logger";

/**
 * GET /api/admin/navigation/sub-items
 * Lädt alle Sub-Items (optional gefiltert nach navigation_item_id)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const navigationItemId = searchParams.get("navigation_item_id");

    let query = `SELECT 
      id,
      navigation_item_id,
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
    WHERE is_active = TRUE`;

    const params: any[] = [];

    if (navigationItemId) {
      query += " AND navigation_item_id = ?";
      params.push(navigationItemId);
    }

    query += " ORDER BY order_index ASC";

    const subItems = await executeQueryPool<any[]>(query, params);

    return NextResponse.json(subItems, { status: 200 });
  } catch (error) {
    logger.error("Fehler beim Laden der Sub-Navigationspunkte", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Sub-Navigationspunkte" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/navigation/sub-items
 * Erstellt einen neuen Sub-Navigationspunkt
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      navigation_item_id,
      name,
      href,
      icon_name,
      order_index,
      badge_text,
      badge_color,
      dynamic_badge,
      badge_api_endpoint,
      requires_permission,
    } = body;

    const result = await executeQueryPoolWithResult(
      `INSERT INTO admin_navigation_sub_items 
        (navigation_item_id, name, href, icon_name, order_index, badge_text, badge_color, dynamic_badge, badge_api_endpoint, requires_permission)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        navigation_item_id,
        name,
        href,
        icon_name || null,
        order_index || 0,
        badge_text || null,
        badge_color || null,
        dynamic_badge || false,
        badge_api_endpoint || null,
        requires_permission || null,
      ]
    );

    return NextResponse.json(
      { id: result.insertId, message: "Sub-Navigationspunkt erstellt" },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Fehler beim Erstellen des Sub-Navigationspunkts", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen des Sub-Navigationspunkts" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/navigation/sub-items
 * Aktualisiert einen Sub-Navigationspunkt
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const {
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
      requires_permission,
    } = body;

    await executeQueryPool(
      `UPDATE admin_navigation_sub_items 
      SET name = ?, href = ?, icon_name = ?, order_index = ?,
          badge_text = ?, badge_color = ?, dynamic_badge = ?, badge_api_endpoint = ?,
          is_active = ?, requires_permission = ?
      WHERE id = ?`,
      [
        name,
        href,
        icon_name || null,
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
      { message: "Sub-Navigationspunkt aktualisiert" },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Fehler beim Aktualisieren des Sub-Navigationspunkts", error);
    return NextResponse.json(
      { error: "Fehler beim Aktualisieren des Sub-Navigationspunkts" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/navigation/sub-items
 * Löscht einen Sub-Navigationspunkt (soft delete)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID erforderlich" },
        { status: 400 }
      );
    }

    await executeQueryPool(
      `UPDATE admin_navigation_sub_items 
      SET is_active = FALSE 
      WHERE id = ?`,
      [id]
    );

    return NextResponse.json(
      { message: "Sub-Navigationspunkt gelöscht" },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Fehler beim Löschen des Sub-Navigationspunkts", error);
    return NextResponse.json(
      { error: "Fehler beim Löschen des Sub-Navigationspunkts" },
      { status: 500 }
    );
  }
}

