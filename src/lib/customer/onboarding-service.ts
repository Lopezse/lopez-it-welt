// =====================================================
// KUNDEN ONBOARDING SERVICE
// =====================================================
// Verwaltet den 4-Schritte Onboarding-Prozess
// Enterprise++ konform
// =====================================================

import { getConnection } from "@/lib/database";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// =====================================================
// TYPEN
// =====================================================

export type Salutation = "herr" | "frau" | "divers" | "firma";
export type Language = "de" | "en" | "es";
export type ServiceInterest = "website" | "ai_center" | "it_service" | "consulting";

export interface OnboardingStep1Data {
  salutation: Salutation;
  first_name: string;
  last_name: string;
  company_name?: string;
  phone?: string;
  language: Language;
}

export interface OnboardingStep2Data {
  street: string;
  postal_code: string;
  city: string;
  country: string;
  vat_id?: string;
}

export interface OnboardingStep3Data {
  agb_accepted: boolean;
  datenschutz_accepted: boolean;
  ai_processing_accepted: boolean;
  enable_2fa_reminder?: boolean;
}

export interface OnboardingStep4Data {
  service_interests: ServiceInterest[];
  referral_source?: string;
  notes?: string;
}

export interface OnboardingProgress {
  current_step: number;
  completed_steps: number[];
  step1_data?: OnboardingStep1Data;
  step2_data?: OnboardingStep2Data;
  step3_data?: OnboardingStep3Data;
  step4_data?: OnboardingStep4Data;
  is_complete: boolean;
}

// =====================================================
// ONBOARDING SERVICE
// =====================================================

export class OnboardingService {

  /**
   * Lädt den aktuellen Onboarding-Status eines Kunden
   */
  static async getProgress(customerId: number): Promise<OnboardingProgress> {
    const pool = await getConnection();

    const [customers] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        onboarding_step,
        onboarding_completed,
        salutation,
        first_name,
        last_name,
        company_name,
        phone,
        language,
        street,
        postal_code,
        city,
        country,
        company_vat_id,
        agb_accepted,
        agb_accepted_at,
        datenschutz_accepted,
        datenschutz_accepted_at,
        ai_processing_accepted,
        service_interests,
        referral_source
      FROM lopez_customers 
      WHERE id = ?
    `, [customerId]);

    if (customers.length === 0) {
      return {
        current_step: 1,
        completed_steps: [],
        is_complete: false
      };
    }

    const c = customers[0];
    const completedSteps: number[] = [];

    // Prüfen welche Schritte abgeschlossen sind
    if (c.first_name && c.last_name && c.salutation && c.language) {
      completedSteps.push(1);
    }
    if (c.street && c.postal_code && c.city && c.country) {
      completedSteps.push(2);
    }
    if (c.agb_accepted && c.datenschutz_accepted) {
      completedSteps.push(3);
    }
    if (c.service_interests) {
      completedSteps.push(4);
    }

    return {
      current_step: c.onboarding_step || 1,
      completed_steps: completedSteps,
      step1_data: c.first_name ? {
        salutation: c.salutation || "herr",
        first_name: c.first_name,
        last_name: c.last_name,
        company_name: c.company_name,
        phone: c.phone,
        language: c.language || "de"
      } : undefined,
      step2_data: c.street ? {
        street: c.street,
        postal_code: c.postal_code,
        city: c.city,
        country: c.country || "DE",
        vat_id: c.company_vat_id
      } : undefined,
      step3_data: c.agb_accepted !== undefined ? {
        agb_accepted: !!c.agb_accepted,
        datenschutz_accepted: !!c.datenschutz_accepted,
        ai_processing_accepted: !!c.ai_processing_accepted,
        enable_2fa_reminder: true
      } : undefined,
      step4_data: c.service_interests ? {
        service_interests: typeof c.service_interests === 'string' 
          ? JSON.parse(c.service_interests) 
          : c.service_interests,
        referral_source: c.referral_source
      } : undefined,
      is_complete: !!c.onboarding_completed
    };
  }

  /**
   * Speichert Schritt 1 - Basisdaten
   */
  static async saveStep1(customerId: number, data: OnboardingStep1Data): Promise<{ success: boolean; error?: string }> {
    const pool = await getConnection();

    try {
      await pool.execute(`
        UPDATE lopez_customers SET
          salutation = ?,
          first_name = ?,
          last_name = ?,
          company_name = ?,
          phone = ?,
          language = ?,
          onboarding_step = GREATEST(COALESCE(onboarding_step, 1), 2)
        WHERE id = ?
      `, [
        data.salutation,
        data.first_name,
        data.last_name,
        data.company_name || null,
        data.phone || null,
        data.language,
        customerId
      ]);

      return { success: true };
    } catch (error) {
      console.error("Onboarding Step 1 Error:", error);
      return { success: false, error: "Fehler beim Speichern" };
    }
  }

  /**
   * Speichert Schritt 2 - Rechnungsadresse
   */
  static async saveStep2(customerId: number, data: OnboardingStep2Data): Promise<{ success: boolean; error?: string }> {
    const pool = await getConnection();

    try {
      await pool.execute(`
        UPDATE lopez_customers SET
          street = ?,
          postal_code = ?,
          city = ?,
          country = ?,
          company_vat_id = ?,
          onboarding_step = GREATEST(COALESCE(onboarding_step, 1), 3)
        WHERE id = ?
      `, [
        data.street,
        data.postal_code,
        data.city,
        data.country,
        data.vat_id || null,
        customerId
      ]);

      return { success: true };
    } catch (error) {
      console.error("Onboarding Step 2 Error:", error);
      return { success: false, error: "Fehler beim Speichern" };
    }
  }

  /**
   * Speichert Schritt 3 - Rechtliches
   */
  static async saveStep3(customerId: number, data: OnboardingStep3Data): Promise<{ success: boolean; error?: string }> {
    const pool = await getConnection();

    try {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      await pool.execute(`
        UPDATE lopez_customers SET
          agb_accepted = ?,
          agb_accepted_at = ?,
          datenschutz_accepted = ?,
          datenschutz_accepted_at = ?,
          ai_processing_accepted = ?,
          onboarding_step = GREATEST(COALESCE(onboarding_step, 1), 4)
        WHERE id = ?
      `, [
        data.agb_accepted,
        data.agb_accepted ? now : null,
        data.datenschutz_accepted,
        data.datenschutz_accepted ? now : null,
        data.ai_processing_accepted,
        customerId
      ]);

      return { success: true };
    } catch (error) {
      console.error("Onboarding Step 3 Error:", error);
      return { success: false, error: "Fehler beim Speichern" };
    }
  }

  /**
   * Speichert Schritt 4 - Service-Auswahl & Abschluss
   */
  static async saveStep4(customerId: number, data: OnboardingStep4Data): Promise<{ success: boolean; error?: string }> {
    const pool = await getConnection();

    try {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      await pool.execute(`
        UPDATE lopez_customers SET
          service_interests = ?,
          referral_source = ?,
          onboarding_step = 5,
          onboarding_completed = TRUE,
          onboarding_completed_at = ?
        WHERE id = ?
      `, [
        JSON.stringify(data.service_interests),
        data.referral_source || null,
        now,
        customerId
      ]);

      // Audit-Log
      try {
        await pool.execute(`
          INSERT INTO lopez_audit_logs 
            (table_name, record_id, action, user_id, new_values)
          VALUES ('lopez_customers', ?, 'UPDATE', ?, ?)
        `, [
          customerId,
          customerId,
          JSON.stringify({ event: 'ONBOARDING_COMPLETED', service_interests: data.service_interests })
        ]);
      } catch (auditError) {
        console.error("Audit Log Error:", auditError);
        // Continue even if audit fails
      }

      return { success: true };
    } catch (error) {
      console.error("Onboarding Step 4 Error:", error);
      return { success: false, error: "Fehler beim Speichern" };
    }
  }

  /**
   * Prüft ob Onboarding abgeschlossen ist
   */
  static async isComplete(customerId: number): Promise<boolean> {
    const pool = await getConnection();

    const [result] = await pool.execute<RowDataPacket[]>(
      "SELECT onboarding_completed FROM lopez_customers WHERE id = ?",
      [customerId]
    );

    return result.length > 0 && !!result[0].onboarding_completed;
  }

  /**
   * Holt Zusammenfassung für Schritt 4
   */
  static async getSummary(customerId: number): Promise<{
    basisdaten: { name: string; company?: string; language: string };
    adresse: { full: string };
    rechtlich: { agb: boolean; datenschutz: boolean; ai: boolean };
    services: ServiceInterest[];
  } | null> {
    const pool = await getConnection();

    const [customers] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        salutation, first_name, last_name, company_name, language,
        street, postal_code, city, country,
        agb_accepted, datenschutz_accepted, ai_processing_accepted,
        service_interests
      FROM lopez_customers WHERE id = ?
    `, [customerId]);

    if (customers.length === 0) return null;

    const c = customers[0];
    const salutationMap: Record<string, string> = {
      herr: "Herr",
      frau: "Frau",
      divers: "",
      firma: "Firma"
    };

    let serviceInterests: ServiceInterest[] = [];
    if (c.service_interests) {
      serviceInterests = typeof c.service_interests === 'string' 
        ? JSON.parse(c.service_interests) 
        : c.service_interests;
    }

    return {
      basisdaten: {
        name: `${salutationMap[c.salutation] || ""} ${c.first_name} ${c.last_name}`.trim(),
        company: c.company_name,
        language: c.language === "de" ? "Deutsch" : c.language === "en" ? "English" : "Español"
      },
      adresse: {
        full: `${c.street}, ${c.postal_code} ${c.city}, ${c.country}`
      },
      rechtlich: {
        agb: !!c.agb_accepted,
        datenschutz: !!c.datenschutz_accepted,
        ai: !!c.ai_processing_accepted
      },
      services: serviceInterests
    };
  }
}

export default OnboardingService;

