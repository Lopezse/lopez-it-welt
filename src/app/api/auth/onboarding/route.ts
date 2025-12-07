// =====================================================
// ONBOARDING API
// =====================================================
// GET /api/auth/onboarding - Status abrufen
// POST /api/auth/onboarding - Schritt speichern
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { OnboardingService } from "@/lib/customer/onboarding-service";
import { CustomerAuthService } from "@/lib/customer/auth-service";
import { cookies } from "next/headers";

// =====================================================
// GET - Onboarding Status
// =====================================================

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("customer_session")?.value;
    
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: "Nicht angemeldet" },
        { status: 401 }
      );
    }

    const session = await CustomerAuthService.validateSession(sessionToken);
    
    if (!session.valid || !session.customer_id) {
      return NextResponse.json(
        { success: false, error: "Ungültige Session" },
        { status: 401 }
      );
    }

    const progress = await OnboardingService.getProgress(session.customer_id);
    const summary = progress.is_complete 
      ? await OnboardingService.getSummary(session.customer_id)
      : null;

    return NextResponse.json({
      success: true,
      data: {
        progress,
        summary
      }
    });

  } catch (error) {
    console.error("❌ Onboarding GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

// =====================================================
// POST - Schritt speichern
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("customer_session")?.value;
    
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: "Nicht angemeldet" },
        { status: 401 }
      );
    }

    const session = await CustomerAuthService.validateSession(sessionToken);
    
    if (!session.valid || !session.customer_id) {
      return NextResponse.json(
        { success: false, error: "Ungültige Session" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { step, data } = body;

    if (!step || !data) {
      return NextResponse.json(
        { success: false, error: "Step und Data sind erforderlich" },
        { status: 400 }
      );
    }

    let result: { success: boolean; error?: string };

    switch (step) {
      case 1:
        // Validierung Schritt 1
        if (!data.salutation || !data.first_name || !data.last_name || !data.language) {
          return NextResponse.json(
            { success: false, error: "Anrede, Vorname, Nachname und Sprache sind erforderlich" },
            { status: 400 }
          );
        }
        result = await OnboardingService.saveStep1(session.customer_id, data);
        break;

      case 2:
        // Validierung Schritt 2
        if (!data.street || !data.postal_code || !data.city || !data.country) {
          return NextResponse.json(
            { success: false, error: "Straße, PLZ, Ort und Land sind erforderlich" },
            { status: 400 }
          );
        }
        result = await OnboardingService.saveStep2(session.customer_id, data);
        break;

      case 3:
        // Validierung Schritt 3
        if (!data.agb_accepted || !data.datenschutz_accepted) {
          return NextResponse.json(
            { success: false, error: "AGB und Datenschutz müssen akzeptiert werden" },
            { status: 400 }
          );
        }
        result = await OnboardingService.saveStep3(session.customer_id, data);
        break;

      case 4:
        // Validierung Schritt 4
        if (!data.service_interests || !Array.isArray(data.service_interests) || data.service_interests.length === 0) {
          return NextResponse.json(
            { success: false, error: "Bitte wählen Sie mindestens einen Service-Bereich" },
            { status: 400 }
          );
        }
        result = await OnboardingService.saveStep4(session.customer_id, data);
        break;

      default:
        return NextResponse.json(
          { success: false, error: "Ungültiger Schritt" },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // Aktuellen Fortschritt zurückgeben
    const progress = await OnboardingService.getProgress(session.customer_id);

    return NextResponse.json({
      success: true,
      message: step === 4 ? "Onboarding abgeschlossen!" : `Schritt ${step} gespeichert`,
      data: {
        progress,
        next_step: step < 4 ? step + 1 : null,
        is_complete: progress.is_complete
      }
    });

  } catch (error) {
    console.error("❌ Onboarding POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}







