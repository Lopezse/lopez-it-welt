// =====================================================
// CUSTOMERS API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Kundenverwaltung API (B2C & B2B)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { CustomerService, SearchFilters } from "@/lib/customer-service";
import { NextRequest, NextResponse } from "next/server";

// =====================================================
// GET - Kundenliste mit Filter & Suche
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Filter-Parameter
    const customerType = searchParams.get("customer_type");
    const status = searchParams.get("status");
    const supportLevel = searchParams.get("support_level");
    const land = searchParams.get("land");
    const search = searchParams.get("search");

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Sortierung
    const sortBy = searchParams.get("sort_by") || "created_at";
    const sortOrder = (searchParams.get("sort_order") || "DESC") as "ASC" | "DESC";

    // Echte Datenbank-Abfrage
    const filters: SearchFilters = {
      customer_type: customerType || undefined,
      status: status || undefined,
      support_level: supportLevel || undefined,
      land: land || undefined,
      search: search || undefined,
      page,
      limit,
      sort_by: sortBy,
      sort_order: sortOrder,
    };

    const result = await CustomerService.searchCustomers(filters);

    return NextResponse.json({
      success: true,
      data: {
        customers: result.customers,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
        filters: {
          customer_type: customerType,
          status,
          support_level: supportLevel,
          land,
          search,
        },
      },
    });
  } catch (error: any) {
    console.error("❌ Customers API Fehler (GET):", error);
    console.error("❌ Error Stack:", error?.stack);
    console.error("❌ Error Details:", JSON.stringify(error, null, 2));
    
    // Prüfe ob es ein MySQL-Fehler ist
    const mysqlError = error?.code || error?.sqlMessage || error?.message;
    
    return NextResponse.json(
      { 
        success: false, 
        message: mysqlError || "Fehler beim Laden der Kunden",
        error: process.env.NODE_ENV === "development" ? error?.message : undefined,
        code: error?.code,
      },
      { status: 500 },
    );
  }
}

// =====================================================
// POST - Neuen Kunden erstellen
// =====================================================

export async function POST(request: NextRequest) {
  try {
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (jsonError) {
      console.error("❌ JSON Parse Fehler:", jsonError);
      return NextResponse.json(
        { success: false, message: "Ungültiges JSON-Format im Request-Body" },
        { status: 400 },
      );
    }

    const {
      customer_type,
      anrede,
      titel,
      vorname,
      nachname,
      company_name,
      ust_id,
      contact_person_anrede,
      contact_person_titel,
      contact_person_vorname,
      contact_person_nachname,
      email,
      email_secondary,
      phone_mobile,
      phone_business,
      phone_private,
      strasse,
      plz,
      stadt,
      land,
      land_iso,
      support_level,
      account_manager,
      status,
      notes,
    } = requestBody;

    // Validierung
    if (!customer_type || !email || !vorname || !nachname) {
      return NextResponse.json(
        {
          success: false,
          message: "Kundentyp, E-Mail, Vorname und Nachname sind erforderlich",
        },
        { status: 400 },
      );
    }

    // Firmenname-Validierung
    if (customer_type !== "privat" && (!company_name || company_name.trim() === "")) {
      return NextResponse.json(
        {
          success: false,
          message: "Firmenname ist für Firmen, Behörden und Partner erforderlich",
        },
        { status: 400 },
      );
    }

    // E-Mail-Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Ungültige E-Mail-Adresse" },
        { status: 400 },
      );
    }

    // Kunde erstellen - echte Datenbank-Operation
    try {
      const newCustomer = await CustomerService.createCustomer({
        customer_type,
        anrede: anrede || "Keine Angabe",
        titel: titel || null,
        vorname,
        nachname,
        firmenname: company_name || null,
        email,
        telefon: phone_mobile || phone_business || phone_private || null,
        strasse: strasse || null,
        plz: plz || null,
        ort: stadt || null,
        land: land || "Deutschland",
        status: status || "aktiv",
        support_level: support_level || "Standard",
        notes: notes || null,
      });

      return NextResponse.json({
        success: true,
        message: "Kunde erfolgreich erstellt",
        data: { 
          customer_id: newCustomer.id,
          kundennummer: newCustomer.kundennummer,
          customer: newCustomer,
        },
      });
    } catch (createError: any) {
      console.error("❌ Fehler beim Erstellen des Kunden (inner catch):", createError);
      console.error("❌ Error Stack:", createError?.stack);
      console.error("❌ Error Details:", JSON.stringify(createError, null, 2));
      
      // Prüfe ob es ein MySQL-Fehler ist
      const mysqlError = createError?.code || createError?.sqlMessage || createError?.message;
      
      return NextResponse.json(
        { 
          success: false, 
          message: mysqlError || "Fehler beim Erstellen des Kunden in der Datenbank",
          error: process.env.NODE_ENV === "development" ? createError?.message : undefined,
          code: createError?.code,
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    // Äußerer catch für unerwartete Fehler
    console.error("❌ Fehler beim Erstellen des Kunden (outer catch):", error);
    console.error("❌ Error Stack:", error?.stack);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error?.message || "Unerwarteter Fehler beim Erstellen des Kunden",
        error: process.env.NODE_ENV === "development" ? error?.message : undefined,
      },
      { status: 500 },
    );
  }
}

// =====================================================
// HILFSFUNKTIONEN
// =====================================================

async function getCustomers(filters: any) {
  // Demo-Daten (in Produktion: echte Datenbank-Abfrage)
  const demoCustomers = [
    {
      id: "customer_demo_1",
      customer_type: "privat",
      anrede: "Herr",
      titel: null,
      vorname: "Max",
      nachname: "Mustermann",
      company_name: null,
      ust_id: null,
      contact_person_anrede: null,
      contact_person_titel: null,
      contact_person_vorname: null,
      contact_person_nachname: null,
      email: "max.mustermann@email.de",
      email_secondary: null,
      phone_mobile: "+49 123 456789",
      phone_business: null,
      phone_private: null,
      strasse: "Musterstraße 123",
      plz: "30159",
      stadt: "Hannover",
      land: "Deutschland",
      land_iso: "DE",
      support_level: "Standard",
      account_manager: null,
      account_manager_name: null,
      account_manager_lastname: null,
      status: "aktiv",
      notes: null,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "customer_demo_2",
      customer_type: "firma",
      anrede: "Frau",
      titel: null,
      vorname: "Anna",
      nachname: "Schmidt",
      company_name: "Beispiel GmbH",
      ust_id: "DE123456789",
      contact_person_anrede: "Frau",
      contact_person_titel: null,
      contact_person_vorname: "Anna",
      contact_person_nachname: "Schmidt",
      email: "anna.schmidt@beispiel-gmbh.de",
      email_secondary: "info@beispiel-gmbh.de",
      phone_mobile: "+49 511 987654",
      phone_business: "+49 511 987654",
      phone_private: null,
      strasse: "Firmenstraße 456",
      plz: "30159",
      stadt: "Hannover",
      land: "Deutschland",
      land_iso: "DE",
      support_level: "Premium",
      account_manager: "admin_user",
      account_manager_name: "Lopez",
      account_manager_lastname: "Admin",
      status: "aktiv",
      notes: "Wichtiger Kunde mit Premium-Support",
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "customer_demo_3",
      customer_type: "behörde",
      anrede: "Herr",
      titel: "Dr.",
      vorname: "Müller",
      nachname: "Verwaltung",
      company_name: "Stadt Hannover",
      ust_id: null,
      contact_person_anrede: "Herr",
      contact_person_titel: "Dr.",
      contact_person_vorname: "Müller",
      contact_person_nachname: "Verwaltung",
      email: "verwaltung@stadt-hannover.de",
      email_secondary: null,
      phone_mobile: "+49 511 555123",
      phone_business: "+49 511 555123",
      phone_private: null,
      strasse: "Rathausplatz 1",
      plz: "30159",
      stadt: "Hannover",
      land: "Deutschland",
      land_iso: "DE",
      support_level: "SLA 24h",
      account_manager: "admin_user",
      account_manager_name: "Lopez",
      account_manager_lastname: "Admin",
      status: "aktiv",
      notes: "Öffentliche Einrichtung - besondere Compliance-Anforderungen",
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Filter anwenden
  let filteredCustomers = demoCustomers;

  if (filters.customerType) {
    filteredCustomers = filteredCustomers.filter((c) => c.customer_type === filters.customerType);
  }
  if (filters.status) {
    filteredCustomers = filteredCustomers.filter((c) => c.status === filters.status);
  }
  if (filters.supportLevel) {
    filteredCustomers = filteredCustomers.filter((c) => c.support_level === filters.supportLevel);
  }
  if (filters.land) {
    filteredCustomers = filteredCustomers.filter((c) => c.land === filters.land);
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredCustomers = filteredCustomers.filter(
      (c) =>
        c.vorname.toLowerCase().includes(searchLower) ||
        c.nachname.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        (c.company_name && c.company_name.toLowerCase().includes(searchLower)) ||
        c.stadt.toLowerCase().includes(searchLower),
    );
  }

  // Sortierung
  filteredCustomers.sort((a, b) => {
    const aVal = a[filters.sortBy as keyof typeof a];
    const bVal = b[filters.sortBy as keyof typeof b];

    if (filters.sortOrder === "ASC") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Pagination
  return filteredCustomers.slice(filters.offset, filters.offset + filters.limit);
}

async function getCustomersCount(filters: any) {
  // Demo: Einfache Zählung (in Produktion: COUNT-Query)
  return 3;
}
