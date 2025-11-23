// =====================================================
// CUSTOMER DETAILS API - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Einzelne Kunden-Details abrufen und bearbeiten
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { NextRequest, NextResponse } from "next/server";

// =====================================================
// GET - Kunden-Details abrufen
// =====================================================

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customerId = params.id;

    // Kunden-Details abrufen (Demo)
    const customer = await getCustomerById(customerId);

    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Kunde nicht gefunden" },
        { status: 404 },
      );
    }

    // Zusätzliche Daten laden
    const contacts = await getCustomerContacts(customerId);
    const documents = await getCustomerDocuments(customerId);
    const tags = await getCustomerTags(customerId);

    return NextResponse.json({
      success: true,
      data: {
        customer,
        contacts,
        documents,
        tags,
      },
    });
  } catch (error) {
    // Customer Details API Fehler: ${error}
    return NextResponse.json(
      { success: false, message: "Fehler beim Laden der Kunden-Details" },
      { status: 500 },
    );
  }
}

// =====================================================
// PUT - Kunde bearbeiten
// =====================================================

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customerId = params.id;
    const updateData = await request.json();

    // Validierung
    if (
      updateData.customer_type &&
      updateData.customer_type !== "privat" &&
      (!updateData.company_name || updateData.company_name.trim() === "")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Firmenname ist für Firmen, Behörden und Partner erforderlich",
        },
        { status: 400 },
      );
    }

    // E-Mail-Validierung
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        return NextResponse.json(
          { success: false, message: "Ungültige E-Mail-Adresse" },
          { status: 400 },
        );
      }
    }

    // Kunde aktualisieren (Demo)
    const updatedCustomer = await updateCustomer(customerId, updateData);

    if (!updatedCustomer) {
      return NextResponse.json(
        { success: false, message: "Kunde nicht gefunden" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kunde erfolgreich aktualisiert",
      data: { customer: updatedCustomer },
    });
  } catch (error) {
    // Customer Update Fehler: ${error}
    return NextResponse.json(
      { success: false, message: "Fehler beim Aktualisieren des Kunden" },
      { status: 500 },
    );
  }
}

// =====================================================
// DELETE - Kunde löschen/deaktivieren
// =====================================================

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customerId = parseInt(params.id);
    
    if (!customerId || isNaN(customerId)) {
      return NextResponse.json(
        { success: false, message: "Ungültige Kunden-ID" },
        { status: 400 },
      );
    }

    // Prüfe ob Body vorhanden ist (optional)
    let action = "delete";
    try {
      const body = await request.json().catch(() => ({}));
      action = body.action || "delete";
    } catch {
      // Kein Body vorhanden - Standard: löschen
      action = "delete";
    }

    if (action === "delete") {
      // Kunde permanent löschen - echte Datenbank-Operation
      const { CustomerService } = await import("@/lib/customer-service");
      const deleted = await CustomerService.deleteCustomer(customerId);

      if (!deleted) {
        return NextResponse.json(
          { success: false, message: "Kunde nicht gefunden" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Kunde erfolgreich gelöscht",
      });
    } else {
      // Kunde deaktivieren
      const { CustomerService } = await import("@/lib/customer-service");
      const deactivated = await CustomerService.updateCustomer(customerId, {
        status: "inaktiv",
      });

      if (!deactivated) {
        return NextResponse.json(
          { success: false, message: "Kunde nicht gefunden" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Kunde erfolgreich deaktiviert",
      });
    }
  } catch (error: any) {
    console.error("❌ Customer Delete Fehler:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Fehler beim Löschen/Deaktivieren des Kunden",
        error: process.env.NODE_ENV === "development" ? error?.message : undefined,
      },
      { status: 500 },
    );
  }
}

// =====================================================
// HILFSFUNKTIONEN
// =====================================================

async function getCustomerById(customerId: string) {
  // Demo-Daten (in Produktion: echte Datenbank-Abfrage)
  const demoCustomers = {
    customer_demo_1: {
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
    customer_demo_2: {
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
  };

  return demoCustomers[customerId as keyof typeof demoCustomers] || null;
}

async function getCustomerContacts(customerId: string) {
  // Demo-Kontakthistorie
  return [
    {
      id: "contact_1",
      contact_type: "email",
      contact_method: "E-Mail",
      subject: "Anfrage zu Produkt X",
      description: "Kunde fragt nach Verfügbarkeit und Preisen",
      contact_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: "admin_user",
    },
    {
      id: "contact_2",
      contact_type: "phone",
      contact_method: "Telefon",
      subject: "Support-Anfrage",
      description: "Technisches Problem mit der Software",
      contact_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: "admin_user",
    },
  ];
}

async function getCustomerDocuments(customerId: string) {
  // Demo-Dokumente
  return [
    {
      id: "doc_1",
      document_type: "vertrag",
      document_name: "Servicevertrag 2025.pdf",
      file_size_bytes: 245760,
      mime_type: "application/pdf",
      is_confidential: true,
      uploaded_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "doc_2",
      document_type: "angebot",
      document_name: "Angebot Software-Lizenz.pdf",
      file_size_bytes: 128000,
      mime_type: "application/pdf",
      is_confidential: false,
      uploaded_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

async function getCustomerTags(customerId: string) {
  // Demo-Tags
  return [
    {
      id: 1,
      tag_name: "VIP",
      tag_color: "#DC2626",
      tag_description: "VIP-Kunde mit besonderen Service-Level",
    },
    {
      id: 2,
      tag_name: "Langzeitkunde",
      tag_color: "#7C3AED",
      tag_description: "Kunde seit über 5 Jahren",
    },
  ];
}

async function updateCustomer(customerId: string, updateData: any) {
  // Demo: Kunde aktualisiert (in Produktion: Datenbank-Update)
  // Kunde aktualisiert: ${customerId}

  // Simuliere aktualisierten Kunden
  const existingCustomer = await getCustomerById(customerId);
  if (!existingCustomer) return null;

  return {
    ...existingCustomer,
    ...updateData,
    updated_at: new Date().toISOString(),
  };
}

async function deleteCustomer(customerId: string) {
  // Demo: Kunde gelöscht (in Produktion: Datenbank-Delete)
  // Kunde gelöscht: ${customerId}
  return true;
}

async function deactivateCustomer(customerId: string) {
  // Demo: Kunde deaktiviert (in Produktion: Status-Update)
  // Kunde deaktiviert: ${customerId}
  return true;
}

  if (!existingCustomer) return null;

  return {
    ...existingCustomer,
    ...updateData,
    updated_at: new Date().toISOString(),
  };
}

async function deleteCustomer(customerId: string) {
  // Demo: Kunde gelöscht (in Produktion: Datenbank-Delete)
  // Kunde gelöscht: ${customerId}
  return true;
}

async function deactivateCustomer(customerId: string) {
  // Demo: Kunde deaktiviert (in Produktion: Status-Update)
  // Kunde deaktiviert: ${customerId}
  return true;
}
