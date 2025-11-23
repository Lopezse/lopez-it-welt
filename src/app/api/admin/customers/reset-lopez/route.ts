// =====================================================
// RESET LOPEZ IT WELT CUSTOMER - LOPEZ IT WELT
// =====================================================
// Temporäre Route zum Löschen und Neu-Anlegen des Kunden "Lopez IT Welt"
// =====================================================

import { CustomerService } from "@/lib/customer-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 1. Kunde "Lopez IT Welt" suchen
    const result = await CustomerService.searchCustomers({
      search: "Lopez IT Welt",
      limit: 10,
    });

    const lopezCustomer = result.customers.find(
      (c) =>
        c.firmenname?.toLowerCase().includes("lopez") ||
        c.firmenname?.toLowerCase().includes("welt"),
    );

    // 2. Kunde löschen, falls gefunden
    if (lopezCustomer && lopezCustomer.id) {
      const deleted = await CustomerService.deleteCustomer(lopezCustomer.id);
      if (deleted) {
        console.log("✅ Kunde 'Lopez IT Welt' gelöscht:", lopezCustomer.id);
      }
    }

    // 3. Kunde neu anlegen
    const newCustomer = await CustomerService.createCustomer({
      customer_type: "firma",
      anrede: "Keine Angabe",
      titel: null,
      vorname: "Ramiro",
      nachname: "Lopez Rodriguez",
      firmenname: "Lopez IT Welt",
      email: "ra-lopez@t-online.de",
      telefon: "0173 2961024",
      strasse: "Alte Bahnhofstraße 13",
      plz: "31515",
      ort: "Wunstorf",
      land: "Deutschland",
      status: "aktiv",
      support_level: "Standard",
      notes: null,
    });

    return NextResponse.json({
      success: true,
      message: "Kunde 'Lopez IT Welt' erfolgreich gelöscht und neu angelegt",
      data: {
        old_customer_id: lopezCustomer?.id || null,
        new_customer: {
          id: newCustomer.id,
          kundennummer: newCustomer.kundennummer,
          firmenname: newCustomer.firmenname,
        },
      },
    });
  } catch (error: any) {
    console.error("❌ Fehler beim Zurücksetzen des Kunden:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Fehler beim Zurücksetzen des Kunden",
        error: process.env.NODE_ENV === "development" ? error?.message : undefined,
      },
      { status: 500 },
    );
  }
}


// RESET LOPEZ IT WELT CUSTOMER - LOPEZ IT WELT
// =====================================================
// Temporäre Route zum Löschen und Neu-Anlegen des Kunden "Lopez IT Welt"
// =====================================================

import { CustomerService } from "@/lib/customer-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 1. Kunde "Lopez IT Welt" suchen
    const result = await CustomerService.searchCustomers({
      search: "Lopez IT Welt",
      limit: 10,
    });

    const lopezCustomer = result.customers.find(
      (c) =>
        c.firmenname?.toLowerCase().includes("lopez") ||
        c.firmenname?.toLowerCase().includes("welt"),
    );

    // 2. Kunde löschen, falls gefunden
    if (lopezCustomer && lopezCustomer.id) {
      const deleted = await CustomerService.deleteCustomer(lopezCustomer.id);
      if (deleted) {
        console.log("✅ Kunde 'Lopez IT Welt' gelöscht:", lopezCustomer.id);
      }
    }

    // 3. Kunde neu anlegen
    const newCustomer = await CustomerService.createCustomer({
      customer_type: "firma",
      anrede: "Keine Angabe",
      titel: null,
      vorname: "Ramiro",
      nachname: "Lopez Rodriguez",
      firmenname: "Lopez IT Welt",
      email: "ra-lopez@t-online.de",
      telefon: "0173 2961024",
      strasse: "Alte Bahnhofstraße 13",
      plz: "31515",
      ort: "Wunstorf",
      land: "Deutschland",
      status: "aktiv",
      support_level: "Standard",
      notes: null,
    });

    return NextResponse.json({
      success: true,
      message: "Kunde 'Lopez IT Welt' erfolgreich gelöscht und neu angelegt",
      data: {
        old_customer_id: lopezCustomer?.id || null,
        new_customer: {
          id: newCustomer.id,
          kundennummer: newCustomer.kundennummer,
          firmenname: newCustomer.firmenname,
        },
      },
    });
  } catch (error: any) {
    console.error("❌ Fehler beim Zurücksetzen des Kunden:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Fehler beim Zurücksetzen des Kunden",
        error: process.env.NODE_ENV === "development" ? error?.message : undefined,
      },
      { status: 500 },
    );
  }
}



















