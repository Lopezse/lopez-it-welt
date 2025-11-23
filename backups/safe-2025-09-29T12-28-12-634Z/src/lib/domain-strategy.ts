// =====================================================
// DOMAIN STRATEGY - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Domain-Strategie Implementation (lopezitwelt.de / lopez-team.de)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { EmailService } from "./email-service";

// =====================================================
// INTERFACES
// =====================================================

export interface DomainUser {
  first_name: string;
  last_name: string;
  role: string;
  domain_type: "external" | "internal";
}

// =====================================================
// DOMAIN STRATEGY CLASS
// =====================================================

export class DomainStrategy {
  // =====================================================
  // CHEF-BENUTZER ERSTELLEN
  // =====================================================

  /**
   * Erstellt Chef-Benutzer (ramiro.lopezrodriguez)
   */
  static createChefUser(): DomainUser {
    return {
      first_name: "Ramiro",
      last_name: "Lopez Rodriguez",
      role: "Chef",
      domain_type: "external",
    };
  }

  /**
   * Erstellt Sohn-Benutzer (ramiro.lopezmclean)
   */
  static createSohnUser(): DomainUser {
    return {
      first_name: "Ramiro",
      last_name: "Lopez Mc Lean",
      role: "CTO",
      domain_type: "external",
    };
  }

  // =====================================================
  // E-MAIL-GENERIERUNG
  // =====================================================

  /**
   * Generiert alle E-Mail-Adressen für einen Benutzer
   * Gesetzliche Namenskonvention: Doppel-Nachname zusammen + Vorname
   */
  static generateUserEmails(user: DomainUser): {
    external: string;
    internal: string;
    display_name: string;
  } {
    const externalEmail = EmailService.generateEmailAddress({
      first_name: user.first_name,
      last_name: user.last_name,
      domain_type: "external",
    });

    const internalEmail = EmailService.generateEmailAddress({
      first_name: user.first_name,
      last_name: user.last_name,
      domain_type: "internal",
    });

    const displayName = EmailService.generateDisplayName(
      user.first_name,
      user.last_name,
      user.role,
    );

    return {
      external: externalEmail,
      internal: internalEmail,
      display_name: displayName,
    };
  }

  // =====================================================
  // VALIDIERUNG
  // =====================================================

  /**
   * Validiert Domain-Strategie E-Mail-Adressen
   */
  static validateDomainStrategy(user: DomainUser): {
    external_valid: boolean;
    internal_valid: boolean;
    emails: {
      external: string;
      internal: string;
    };
  } {
    const emails = this.generateUserEmails(user);

    const externalValid = EmailService.validateEmailDomain(emails.external, "external");
    const internalValid = EmailService.validateEmailDomain(emails.internal, "internal");

    return {
      external_valid: externalValid,
      internal_valid: internalValid,
      emails: {
        external: emails.external,
        internal: emails.internal,
      },
    };
  }

  // =====================================================
  // DEMO-DATEN
  // =====================================================

  /**
   * Erstellt Demo-Benutzer für Domain-Strategie
   */
  static createDemoUsers(): DomainUser[] {
    return [
      this.createChefUser(),
      this.createSohnUser(),
      {
        first_name: "Max",
        last_name: "Mustermann",
        role: "Support",
        domain_type: "internal",
      },
      {
        first_name: "Anna",
        last_name: "Schmidt",
        role: "Sales",
        domain_type: "internal",
      },
    ];
  }

  // =====================================================
  // SQL-INSERT GENERIERUNG
  // =====================================================

  /**
   * Generiert SQL-Insert für Chef-Benutzer
   * Gesetzliche Namenskonvention: ramiro.lopezrodriguez
   */
  static generateChefUserSQL(): string {
    const chef = this.createChefUser();
    const emails = this.generateUserEmails(chef);

    return `
INSERT INTO lopez_users (
    username, email, email_external, email_internal, password_hash,
    first_name, last_name, display_name, domain_type, status
) VALUES (
    'ramiro.lopezrodriguez',
    '${emails.external}',
    '${emails.external}',
    '${emails.internal}',
    '$2b$12$hashed_password_here', -- In Produktion: echtes Hash
    '${chef.first_name}',
    '${chef.last_name}',
    '${emails.display_name}',
    '${chef.domain_type}',
    'active'
);`;
  }

  /**
   * Generiert SQL-Insert für Sohn-Benutzer
   * Gesetzliche Namenskonvention: ramiro.lopezmclean
   */
  static generateSohnUserSQL(): string {
    const sohn = this.createSohnUser();
    const emails = this.generateUserEmails(sohn);

    return `
INSERT INTO lopez_users (
    username, email, email_external, email_internal, password_hash,
    first_name, last_name, display_name, domain_type, status
) VALUES (
    'ramiro.lopezmclean',
    '${emails.external}',
    '${emails.external}',
    '${emails.internal}',
    '$2b$12$hashed_password_here', -- In Produktion: echtes Hash
    '${sohn.first_name}',
    '${sohn.last_name}',
    '${emails.display_name}',
    '${sohn.domain_type}',
    'active'
);`;
  }
}
