// =====================================================
// Memory System für KI-Agenten
// =====================================================
// Erstellt: 2025-07-05 14:30:00
// Autor: Ramiro Lopez Rodriguez
// Zweck: Persistente Regelspeicherung für KI-Agenten
// =====================================================

export class MemorySystem {
  private rules: Map<string, string[]> = new Map();

  constructor() {
    this.initializeDefaultRules();
  }

  private initializeDefaultRules(): void {
    // DSGVO-Regeln
    this.rules.set('compliance', [
      'Alle Kontaktformulare müssen DSGVO-konform sein mit Consent-Checkbox',
      'Personenbezogene Daten dürfen nur mit expliziter Einwilligung verarbeitet werden',
      'Datenschutzerklärung muss auf jeder Seite verfügbar sein',
      'Cookie-Consent ist für alle nicht-essentiellen Cookies erforderlich',
    ]);

    // Enterprise++ Regeln
    this.rules.set('enterprise', [
      'Enterprise++ Standards: 100% Test-Coverage, 0 Lint-Fehler',
      'Anti-Regelbruch-System: Keine Aktionen ohne explizite Freigabe',
      'Alle Änderungen müssen in STATUS.md dokumentiert werden',
      'Strikte Datumsvalidierung: System-Zeit verwenden, niemals kopieren',
    ]);

    // Qualitätsregeln
    this.rules.set('quality', [
      'WCAG 2.1 AA Konformität für alle Komponenten',
      'TypeScript Strict Mode für alle Dateien',
      'Prettier-Formatierung für konsistenten Code',
      'Keine any-Typen verwenden',
    ]);

    // Sicherheitsregeln
    this.rules.set('security', [
      'Keine Passwörter oder API-Keys im Code speichern',
      'Alle externen APIs über HTTPS aufrufen',
      'Input-Validierung für alle Benutzereingaben',
      'Environment Variables für sensitive Daten verwenden',
    ]);
  }

  async storeRule(rule: string, category: string): Promise<void> {
    if (!this.rules.has(category)) {
      this.rules.set(category, []);
    }

    this.rules.get(category)!.push(rule);
    console.log(`✅ Regel in Kategorie "${category}" gespeichert`);
  }

  async recallRules(context: string, limit: number = 5): Promise<string[]> {
    const relevantRules: string[] = [];

    // Suche nach relevanten Regeln basierend auf Kontext
    for (const [category, rules] of this.rules) {
      for (const rule of rules) {
        if (this.isRuleRelevant(context, rule)) {
          relevantRules.push(rule);
          if (relevantRules.length >= limit) {
            break;
          }
        }
      }
    }

    console.log(
      `📋 ${relevantRules.length} relevante Regeln für Kontext gefunden`
    );
    return relevantRules;
  }

  private isRuleRelevant(context: string, rule: string): boolean {
    const contextLower = context.toLowerCase();
    const ruleLower = rule.toLowerCase();

    // Einfache Keyword-basierte Relevanzprüfung
    const keywords = contextLower.split(' ');
    return keywords.some(keyword => ruleLower.includes(keyword));
  }

  async validateCompliance(action: string): Promise<boolean> {
    const relevantRules = await this.recallRules(action, 3);

    // Einfache Compliance-Validierung
    const hasConsent =
      action.toLowerCase().includes('consent') ||
      action.toLowerCase().includes('dsgvo');
    const hasQuality =
      action.toLowerCase().includes('test') ||
      action.toLowerCase().includes('quality');
    const hasSecurity =
      action.toLowerCase().includes('https') ||
      action.toLowerCase().includes('environment');

    return hasConsent && hasQuality && hasSecurity;
  }

  async getRulesByCategory(category: string): Promise<string[]> {
    return this.rules.get(category) || [];
  }

  async getAllRules(): Promise<Map<string, string[]>> {
    return new Map(this.rules);
  }

  async clearRules(category?: string): Promise<void> {
    if (category) {
      this.rules.delete(category);
      console.log(`🗑️ Regeln für Kategorie "${category}" gelöscht`);
    } else {
      this.rules.clear();
      console.log('🗑️ Alle Regeln gelöscht');
    }
  }
}
