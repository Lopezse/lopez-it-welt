// =====================================================
// CUSTOMER SEARCH API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Fuzzy Search für Kundenverwaltung
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { CustomerService } from "@/lib/customer-service";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// GET - Fuzzy Search für Kunden
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: true,
        data: {
          customers: [],
          total: 0,
          query: query || "",
        },
      });
    }

    // Fuzzy Search: "${query}" (Limit: ${limit})

    // Fuzzy Search durchführen
    const customers = await CustomerService.fuzzySearch(query.trim(), limit);

    // Fuzzy Search gefunden: ${customers.length} Kunden

    return NextResponse.json({
      success: true,
      data: {
        customers,
        total: customers.length,
        query: query.trim(),
      },
    });
  } catch (error) {
    // Fuzzy Search Fehler: ${error}
    return NextResponse.json(
      {
        success: false,
        message: "Fehler bei der Kundensuche",
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 },
    );
  }
}

// =====================================================
// POST - Erweiterte Suche mit Filtern
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters = {}, limit = 10 } = body;

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: true,
        data: {
          customers: [],
          total: 0,
          query: query || "",
        },
      });
    }

    // Erweiterte Suche: "${query}" mit Filtern: ${filters}

    // Erweiterte Suche mit Filtern
    const searchFilters = {
      search: query.trim(),
      ...filters,
      limit,
    };

    const result = await CustomerService.searchCustomers(searchFilters);

    // Erweiterte Suche gefunden: ${result.customers.length} Kunden

    return NextResponse.json({
      success: true,
      data: {
        customers: result.customers,
        total: result.total,
        query: query.trim(),
        filters,
      },
    });
  } catch (error) {
    // Erweiterte Suche Fehler: ${error}
    return NextResponse.json(
      {
        success: false,
        message: "Fehler bei der erweiterten Suche",
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 },
    );
  }
}
