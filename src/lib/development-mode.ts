// =====================================================
// DEVELOPMENT MODE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Login optional für lokale Entwicklung
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { DomainStrategy } from "./domain-strategy";
import { EnterpriseUserService } from "./enterprise-user-service";

// =====================================================
// INTERFACES
// =====================================================

export interface DevelopmentModeConfig {
  enabled: boolean;
  bypassAuth: boolean;
  defaultUser: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  };
}

// =====================================================
// DEVELOPMENT MODE CLASS
// =====================================================

export class DevelopmentMode {
  // =====================================================
  // KONFIGURATION
  // =====================================================

  /**
   * Prüft ob Development Mode aktiviert ist
   */
  static isEnabled(): boolean {
    return process.env.NODE_ENV === "development" && process.env.DEVELOPMENT_MODE === "true";
  }

  /**
   * Prüft ob Authentication umgangen werden soll
   */
  static shouldBypassAuth(): boolean {
    return this.isEnabled() && process.env.BYPASS_AUTH === "true";
  }

  /**
   * Gibt Development Mode Konfiguration zurück
   */
  static getConfig(): DevelopmentModeConfig {
    return {
      enabled: this.isEnabled(),
      bypassAuth: this.shouldBypassAuth(),
      defaultUser: {
        id: 1,
        username: "ramiro.lopezrodriguez",
        email: "ramiro.lopezrodriguez@lopezitwelt.de",
        first_name: "Ramiro",
        last_name: "Lopez Rodriguez",
        role: "Chef",
      },
    };
  }

  // =====================================================
  // AUTHENTICATION BYPASS
  // =====================================================

  /**
   * Erstellt Mock-User für Development Mode
   */
  static createMockUser(): Record<string, unknown> | null {
    if (!this.shouldBypassAuth()) {
      return null;
    }

    return {
      id: "dev-chef-uuid-001",
      username: "ramiro.lopezrodriguez",
      email: "ramiro.lopezrodriguez@lopezitwelt.de",
      email_external: "ramiro.lopezrodriguez@lopezitwelt.de",
      email_internal: "ramiro.lopezrodriguez@lopez-team.de",
      first_name: "Ramiro",
      last_name: "Lopez Rodriguez",
      display_name: "Ramiro Lopez Rodriguez - Chef",
      domain_type: "external",
      status: "active",
      is_owner: true,
      is_admin: true,
      is_employee: true,
      is_customer: false,
      role: "Chef",
      roles: ["chef", "admin", "owner"],
      permissions: ["*"], // Alle Rechte
      two_factor_enabled: false,
      failed_login_attempts: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Prüft ob Route im Development Mode umgangen werden soll
   */
  static shouldBypassRoute(route: string): boolean {
    if (!this.shouldBypassAuth()) {
      return false;
    }

    // Routen die im Development Mode umgangen werden
    const bypassRoutes = ["/api/auth/login", "/api/auth/logout", "/api/admin/*"];

    return bypassRoutes.some((pattern) => {
      if (pattern.includes("*")) {
        return route.startsWith(pattern.replace("*", ""));
      }
      return route === pattern;
    });
  }

  // =====================================================
  // MIDDLEWARE
  // =====================================================

  /**
   * Development Mode Middleware
   */
  static middleware(req: Request, res: Response, next: () => void) {
    if (this.shouldBypassAuth()) {
      // Mock-User in Request einfügen
      req.user = this.createMockUser();
      req.isDevelopmentMode = true;

      // Development Mode: Authentication umgangen
      // Mock-User: ${req.user.display_name}
    }

    next();
  }

  // =====================================================
  // API RESPONSES
  // =====================================================

  /**
   * Erstellt Development Mode Login Response
   */
  static createLoginResponse(): any {
    if (!this.shouldBypassAuth()) {
      return null;
    }

    return {
      success: true,
      message: "Development Mode: Login umgangen",
      user: this.createMockUser(),
      token: "dev-mode-token",
      isDevelopmentMode: true,
    };
  }

  /**
   * Erstellt Development Mode Logout Response
   */
  static createLogoutResponse(): any {
    if (!this.shouldBypassAuth()) {
      return null;
    }

    return {
      success: true,
      message: "Development Mode: Logout umgangen",
      isDevelopmentMode: true,
    };
  }

  // =====================================================
  // CHEF-BENUTZER MANAGEMENT
  // =====================================================

  /**
   * Erstellt Chef-Benutzer für Development Mode
   */
  static async createChefUser(): Promise<Record<string, unknown> | null> {
    if (!this.isEnabled()) {
      return null;
    }

    try {
      const chefData = DomainStrategy.createChefUser();
      const emails = DomainStrategy.generateUserEmails(chefData);

      const userData = {
        username: "ramiro.lopezrodriguez",
        email: emails.external,
        email_external: emails.external,
        email_internal: emails.internal,
        first_name: chefData.first_name,
        last_name: chefData.last_name,
        display_name: emails.display_name,
        password: "DevMode123!", // Development Password
        is_owner: true,
        is_admin: true,
        is_employee: true,
        is_customer: false,
        role: "Chef",
        permissions: ["*"],
        domain_type: "external",
      };

      return await EnterpriseUserService.createUser(userData);
    } catch (error) {
      // Fehler beim Erstellen des Chef-Benutzers: ${error}
      return null;
    }
  }

  /**
   * Prüft ob Chef-Benutzer existiert
   */
  static async checkChefUserExists(): Promise<boolean> {
    try {
      const user = await EnterpriseUserService.getUserByUsername("ramiro.lopezrodriguez");
      return user !== null;
    } catch {
      return false;
    }
  }

  // =====================================================
  // ENVIRONMENT SETUP
  // =====================================================

  /**
   * Setup Development Mode Environment
   */
  static async setupEnvironment(): Promise<void> {
    if (process.env.NODE_ENV === "development") {
      // Development Mode verfügbar
      // Um zu aktivieren:
      //   DEVELOPMENT_MODE=true
      //   BYPASS_AUTH=true
      //
      // Beispiel .env.local:
      //   NODE_ENV=development
      //   DEVELOPMENT_MODE=true
      //   BYPASS_AUTH=true

      // Chef-Benutzer prüfen/erstellen
      if (this.isEnabled()) {
        const chefExists = await this.checkChefUserExists();
        if (!chefExists) {
          // Chef-Benutzer wird erstellt...
          const chef = await this.createChefUser();
          if (chef) {
            // Chef-Benutzer erfolgreich erstellt: ${chef.display_name}
          } else {
            // Fehler beim Erstellen des Chef-Benutzers
          }
        } else {
          // Chef-Benutzer bereits vorhanden
        }
      }
    }
  }
}
