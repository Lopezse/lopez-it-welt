// =====================================================
// Compliance Agent - DSGVO-konforme Formulare
// =====================================================
// Erstellt: 2025-07-05 14:30:00
// Autor: Ramiro Lopez Rodriguez
// Zweck: Automatische Erstellung DSGVO-konformer Formulare
// =====================================================

import { KIAgent } from "../ki-agent";
import { MemorySystem } from "../memory-system";

interface DSGVOFormData {
  formName: string;
  fields: string[];
  purpose: string;
  dataRetention: string;
  legalBasis: string;
}

interface ComplianceResult {
  isCompliant: boolean;
  violations: string[];
  recommendations: string[];
  score: number;
}

export class ComplianceAgent extends KIAgent {
  private memory: MemorySystem;

  constructor() {
    super();
    this.memory = new MemorySystem();
  }

  async createDSGVOCompliantForm(formData: DSGVOFormData): Promise<{
    success: boolean;
    form: string;
    compliance: ComplianceResult;
    rules: string[];
  }> {
    try {
      console.log("🛡️ Compliance-Agent: DSGVO-konformes Formular erstellen...");

      // 1. Relevante DSGVO-Regeln abrufen
      const rules = await this.memory.recallRules("DSGVO Formular Consent Datenschutz", 5);
      console.log(`📋 ${rules.length} DSGVO-Regeln abgerufen`);

      // 2. Compliance prüfen
      const compliance = await this.validateDSGVOCompliance(formData, rules);

      if (!compliance.isCompliant) {
        return {
          success: false,
          form: "",
          compliance,
          rules,
        };
      }

      // 3. DSGVO-konformes Formular generieren
      const form = await this.generateDSGVOCompliantForm(formData, rules);

      // 4. Finale Compliance-Prüfung
      const finalCompliance = await this.validateFinalForm(form, rules);

      return {
        success: true,
        form,
        compliance: finalCompliance,
        rules,
      };
    } catch (error) {
      console.error("❌ Compliance-Agent Fehler:", error);
      throw error;
    }
  }

  private async validateDSGVOCompliance(
    formData: DSGVOFormData,
    rules: string[],
  ): Promise<ComplianceResult> {
    const violations: string[] = [];
    const recommendations: string[] = [];

    // DSGVO-Validierung
    if (!formData.purpose) {
      violations.push("❌ Zweck der Datenverarbeitung nicht angegeben");
    }

    if (!formData.legalBasis) {
      violations.push("❌ Rechtsgrundlage nicht angegeben");
    }

    if (!formData.dataRetention) {
      violations.push("❌ Aufbewahrungsfrist nicht angegeben");
    }

    // Consent-Mechanismen prüfen
    if (!formData.fields.some((field) => field.toLowerCase().includes("consent"))) {
      violations.push("❌ Consent-Checkbox fehlt");
      recommendations.push("✅ Consent-Checkbox für Datenschutz hinzufügen");
    }

    // Datenschutz-Link prüfen
    if (!formData.fields.some((field) => field.toLowerCase().includes("datenschutz"))) {
      violations.push("❌ Datenschutz-Link fehlt");
      recommendations.push("✅ Link zur Datenschutzerklärung hinzufügen");
    }

    const score = violations.length === 0 ? 100 : Math.max(0, 100 - violations.length * 20);

    return {
      isCompliant: violations.length === 0,
      violations,
      recommendations,
      score,
    };
  }

  private async generateDSGVOCompliantForm(
    formData: DSGVOFormData,
    rules: string[],
  ): Promise<string> {
    const formFields = formData.fields.map((field) => this.generateFormField(field)).join("\n");

    const form = `
import React, { useState } from 'react';

interface ${formData.formName}Props {
  onSubmit: (data: any) => void;
}

export const ${formData.formName}: React.FC<${formData.formName}Props> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [consent, setConsent] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consent || !privacyConsent) {
      alert('Bitte stimmen Sie den Datenschutzbestimmungen zu.');
      return;
    }
    
    onSubmit({ ...formData, consent, privacyConsent });
  };

  return (
    <form onSubmit={handleSubmit} className="dsgvo-compliant-form">
      <h2>${formData.formName}</h2>
      
      ${formFields}
      
      {/* DSGVO-konforme Consent-Checkboxen */}
      <div className="consent-section">
        <div className="consent-item">
          <input
            type="checkbox"
            id="privacy-consent"
            checked={privacyConsent}
            onChange={(e) => setPrivacyConsent(e.target.checked)}
            required
          />
          <label htmlFor="privacy-consent">
            Ich habe die <a href="/datenschutz" target="_blank">Datenschutzerklärung</a> gelesen 
            und stimme der Verarbeitung meiner Daten zu.
          </label>
        </div>
        
        <div className="consent-item">
          <input
            type="checkbox"
            id="general-consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
          />
          <label htmlFor="general-consent">
            Ich stimme der Verarbeitung meiner Daten für den Zweck: ${formData.purpose} zu.
          </label>
        </div>
      </div>
      
      {/* DSGVO-Informationen */}
      <div className="dsgvo-info">
        <p><strong>Rechtsgrundlage:</strong> ${formData.legalBasis}</p>
        <p><strong>Aufbewahrungsfrist:</strong> ${formData.dataRetention}</p>
        <p><strong>Zweck:</strong> ${formData.purpose}</p>
      </div>
      
      <button type="submit" disabled={!consent || !privacyConsent}>
        Absenden
      </button>
    </form>
  );
};

export default ${formData.formName};
    `;

    return form;
  }

  private generateFormField(fieldName: string): string {
    const fieldType = this.determineFieldType(fieldName);

    switch (fieldType) {
      case "email":
        return `
        <div className="form-field">
          <label htmlFor="${fieldName}">${this.capitalizeFirst(fieldName)}</label>
          <input
            type="email"
            id="${fieldName}"
            name="${fieldName}"
            required
            onChange={(e) => setFormData({ ...formData, ${fieldName}: e.target.value })}
          />
        </div>`;

      case "phone":
        return `
        <div className="form-field">
          <label htmlFor="${fieldName}">${this.capitalizeFirst(fieldName)}</label>
          <input
            type="tel"
            id="${fieldName}"
            name="${fieldName}"
            required
            onChange={(e) => setFormData({ ...formData, ${fieldName}: e.target.value })}
          />
        </div>`;

      case "textarea":
        return `
        <div className="form-field">
          <label htmlFor="${fieldName}">${this.capitalizeFirst(fieldName)}</label>
          <textarea
            id="${fieldName}"
            name="${fieldName}"
            required
            rows={4}
            onChange={(e) => setFormData({ ...formData, ${fieldName}: e.target.value })}
          />
        </div>`;

      default:
        return `
        <div className="form-field">
          <label htmlFor="${fieldName}">${this.capitalizeFirst(fieldName)}</label>
          <input
            type="text"
            id="${fieldName}"
            name="${fieldName}"
            required
            onChange={(e) => setFormData({ ...formData, ${fieldName}: e.target.value })}
          />
        </div>`;
    }
  }

  private determineFieldType(fieldName: string): string {
    const lowerField = fieldName.toLowerCase();

    if (lowerField.includes("email") || lowerField.includes("e-mail")) return "email";
    if (lowerField.includes("phone") || lowerField.includes("telefon")) return "phone";
    if (
      lowerField.includes("message") ||
      lowerField.includes("nachricht") ||
      lowerField.includes("text")
    )
      return "textarea";

    return "text";
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private async validateFinalForm(form: string, rules: string[]): Promise<ComplianceResult> {
    const violations: string[] = [];
    const recommendations: string[] = [];

    // Prüfe DSGVO-konforme Elemente
    if (!form.includes("consent")) {
      violations.push("❌ Consent-Checkbox fehlt im generierten Formular");
    }

    if (!form.includes("datenschutz")) {
      violations.push("❌ Datenschutz-Link fehlt im generierten Formular");
    }

    if (!form.includes("required")) {
      violations.push("❌ Required-Attribute fehlt bei Pflichtfeldern");
    }

    if (!form.includes("onChange")) {
      violations.push("❌ onChange-Handler fehlt für Formularfelder");
    }

    const score = violations.length === 0 ? 100 : Math.max(0, 100 - violations.length * 20);

    return {
      isCompliant: violations.length === 0,
      violations,
      recommendations,
      score,
    };
  }

  async validateExistingForm(formPath: string): Promise<ComplianceResult> {
    try {
      const fs = require("fs");
      const formContent = fs.readFileSync(formPath, "utf8");

      const violations: string[] = [];
      const recommendations: string[] = [];

      // DSGVO-Compliance prüfen
      if (!formContent.includes("consent")) {
        violations.push("❌ Consent-Checkbox fehlt");
        recommendations.push("✅ Consent-Checkbox hinzufügen");
      }

      if (!formContent.includes("datenschutz")) {
        violations.push("❌ Datenschutz-Link fehlt");
        recommendations.push("✅ Link zur Datenschutzerklärung hinzufügen");
      }

      if (!formContent.includes("required")) {
        violations.push("❌ Required-Attribute fehlt");
        recommendations.push("✅ Required-Attribute für Pflichtfelder hinzufügen");
      }

      const score = violations.length === 0 ? 100 : Math.max(0, 100 - violations.length * 20);

      return {
        isCompliant: violations.length === 0,
        violations,
        recommendations,
        score,
      };
    } catch (error) {
      console.error("❌ Fehler beim Validieren des Formulars:", error);
      throw error;
    }
  }
}
