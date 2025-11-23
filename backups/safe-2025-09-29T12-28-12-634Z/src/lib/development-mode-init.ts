// =====================================================
// DEVELOPMENT MODE INITIALISIERUNG - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Automatische Initialisierung des Development Mode
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { DevelopmentMode } from "./development-mode";

// =====================================================
// INITIALISIERUNG
// =====================================================

/**
 * Initialisiert Development Mode beim Server-Start
 */
export async function initializeDevelopmentMode(): Promise<void> {
  try {
    // Development Mode Setup
    await DevelopmentMode.setupEnvironment();

    // Chef-Benutzer prüfen/erstellen
    if (DevelopmentMode.isEnabled()) {
      console.log("🔧 Development Mode wird initialisiert...");

      const chefExists = await DevelopmentMode.checkChefUserExists();
      if (!chefExists) {
        console.log("👤 Chef-Benutzer wird erstellt...");
        const chef = await DevelopmentMode.createChefUser();
        if (chef) {
          console.log("✅ Chef-Benutzer erfolgreich erstellt:", chef.display_name);
        } else {
          console.log("❌ Fehler beim Erstellen des Chef-Benutzers");
        }
      } else {
        console.log("✅ Chef-Benutzer bereits vorhanden");
      }

      console.log("🚀 Development Mode bereit!");
      console.log("📝 Verfügbare Features:");
      console.log("   - Authentication Bypass");
      console.log("   - Mock-User (Chef)");
      console.log("   - Admin-Zugriff");
      console.log("   - Monitoring-Daten");
      console.log("");
    }
  } catch (error) {
    console.error("❌ Fehler bei Development Mode Initialisierung:", error);
  }
}

// =====================================================
// AUTOMATISCHE INITIALISIERUNG
// =====================================================

// Nur im Development Mode automatisch initialisieren
if (process.env.NODE_ENV === "development") {
  initializeDevelopmentMode();
}
