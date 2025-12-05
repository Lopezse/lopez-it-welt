// =====================================================
// ENTERPRISE++ AI PROVIDER LAYER
// =====================================================
// Erstellt: 2025-12-02
// Zweck: Zentrale AI-Schnittstelle für alle KI-Operationen
// Standard: IBM/SAP/Siemens AI Integration Level
// =====================================================

import { getConnection } from "../database";

// =====================================================
// INTERFACES
// =====================================================

export interface AIRequest {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  userId?: number;
  endpoint?: string;
}

export interface AIResponse {
  success: boolean;
  content: string;
  provider: string;
  model: string;
  tokensUsed: number;
  costEstimate: number;
  responseTimeMs: number;
  error?: string;
}

export interface AIProviderConfig {
  name: string;
  apiKey: string;
  baseUrl: string;
  defaultModel: string;
  costPer1kTokens: number;
}

// =====================================================
// KONFIGURATION
// =====================================================

const AI_CONFIG = {
  // Default Provider
  defaultProvider: "openai",
  
  // Providers
  providers: {
    openai: {
      name: "OpenAI",
      baseUrl: "https://api.openai.com/v1",
      defaultModel: "gpt-4-turbo-preview",
      costPer1kTokens: 0.01,
    },
    anthropic: {
      name: "Anthropic",
      baseUrl: "https://api.anthropic.com/v1",
      defaultModel: "claude-3-sonnet-20240229",
      costPer1kTokens: 0.003,
    },
    local: {
      name: "Local (Demo)",
      baseUrl: "http://localhost:11434",
      defaultModel: "llama2",
      costPer1kTokens: 0,
    },
  },
  
  // Limits
  maxTokensDefault: 2000,
  temperatureDefault: 0.7,
  
  // Demo Mode - automatisch deaktiviert wenn API Key vorhanden
  demoMode: !process.env.OPENAI_API_KEY,
};

// =====================================================
// AI PROVIDER SERVICE
// =====================================================

export class AIProvider {
  
  /**
   * Generiert AI-Antwort über konfigurierten Provider
   */
  static async generate(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      const provider = AI_CONFIG.defaultProvider;
      const providerConfig = AI_CONFIG.providers[provider as keyof typeof AI_CONFIG.providers];
      const model = request.model || providerConfig.defaultModel;
      
      // Demo Mode: Simulierte Antworten
      if (AI_CONFIG.demoMode || !process.env.OPENAI_API_KEY) {
        return await this.generateDemoResponse(request, provider, model, startTime);
      }
      
      // Echte API-Anfrage (OpenAI)
      if (provider === "openai") {
        return await this.generateOpenAI(request, model, startTime);
      }
      
      // Fallback: Demo
      return await this.generateDemoResponse(request, provider, model, startTime);
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      // Error loggen
      await this.logUsage({
        userId: request.userId,
        endpoint: request.endpoint || "unknown",
        provider: AI_CONFIG.defaultProvider,
        model: request.model || "unknown",
        tokensInput: 0,
        tokensOutput: 0,
        tokensTotal: 0,
        costEstimate: 0,
        responseTimeMs: responseTime,
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      });
      
      return {
        success: false,
        content: "",
        provider: AI_CONFIG.defaultProvider,
        model: request.model || "unknown",
        tokensUsed: 0,
        costEstimate: 0,
        responseTimeMs: responseTime,
        error: error instanceof Error ? error.message : "AI-Anfrage fehlgeschlagen",
      };
    }
  }
  
  /**
   * OpenAI API Anfrage
   */
  private static async generateOpenAI(
    request: AIRequest,
    model: string,
    startTime: number
  ): Promise<AIResponse> {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return this.generateDemoResponse(request, "openai", model, startTime);
    }
    
    const messages = [];
    
    if (request.systemPrompt) {
      messages.push({ role: "system", content: request.systemPrompt });
    }
    
    messages.push({ role: "user", content: request.prompt });
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: request.maxTokens || AI_CONFIG.maxTokensDefault,
        temperature: request.temperature || AI_CONFIG.temperatureDefault,
      }),
    });
    
    const responseTime = Date.now() - startTime;
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API Error: ${response.status} - ${error}`);
    }
    
    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";
    const tokensUsed = data.usage?.total_tokens || 0;
    const costEstimate = (tokensUsed / 1000) * AI_CONFIG.providers.openai.costPer1kTokens;
    
    // Usage loggen
    await this.logUsage({
      userId: request.userId,
      endpoint: request.endpoint || "unknown",
      provider: "openai",
      model,
      tokensInput: data.usage?.prompt_tokens || 0,
      tokensOutput: data.usage?.completion_tokens || 0,
      tokensTotal: tokensUsed,
      costEstimate,
      responseTimeMs: responseTime,
      success: true,
    });
    
    return {
      success: true,
      content,
      provider: "openai",
      model,
      tokensUsed,
      costEstimate,
      responseTimeMs: responseTime,
    };
  }
  
  /**
   * Demo-Antwort für Entwicklung/Tests
   */
  private static async generateDemoResponse(
    request: AIRequest,
    provider: string,
    model: string,
    startTime: number
  ): Promise<AIResponse> {
    // Simulierte Verzögerung
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    const responseTime = Date.now() - startTime;
    const simulatedTokens = Math.floor(request.prompt.length / 4) + 200;
    
    // Demo-Content basierend auf Kontext
    let content = this.generateDemoContent(request.prompt, request.systemPrompt);
    
    // Usage loggen (Demo)
    await this.logUsage({
      userId: request.userId,
      endpoint: request.endpoint || "demo",
      provider: "local-demo",
      model: "demo-model",
      tokensInput: Math.floor(request.prompt.length / 4),
      tokensOutput: Math.floor(content.length / 4),
      tokensTotal: simulatedTokens,
      costEstimate: 0,
      responseTimeMs: responseTime,
      success: true,
    });
    
    return {
      success: true,
      content,
      provider: "local-demo",
      model: "demo-model",
      tokensUsed: simulatedTokens,
      costEstimate: 0,
      responseTimeMs: responseTime,
    };
  }
  
  /**
   * Generiert Demo-Content basierend auf Prompt-Typ
   */
  private static generateDemoContent(prompt: string, systemPrompt?: string): string {
    const lowerPrompt = prompt.toLowerCase();
    const lowerSystem = (systemPrompt || "").toLowerCase();
    
    // Customer Insights
    if (lowerSystem.includes("customer") || lowerPrompt.includes("kunden")) {
      return `**Kundenanalyse (Demo)**

📊 **Zusammenfassung:**
Der Kunde zeigt ein stabiles Engagement-Muster mit regelmäßiger Aktivität. Die Kommunikation ist professionell und lösungsorientiert.

⚠️ **Risikoeinschätzung:** Niedrig
- Zahlungsverhalten: Pünktlich
- Kommunikation: Positiv
- Bindung: Stabil

💡 **Potenzial:**
- Cross-Selling-Möglichkeiten im Bereich Projektmanagement
- Erweitertes Support-Paket empfohlen

🎯 **Empfehlung:**
Proaktive Kontaktaufnahme für Jahresgespräch planen.`;
    }
    
    // Project Analysis
    if (lowerSystem.includes("project") || lowerPrompt.includes("projekt")) {
      return `**Projektanalyse (Demo)**

📋 **Status-Zusammenfassung:**
Das Projekt befindet sich im geplanten Zeitrahmen. Die Meilensteine werden voraussichtlich eingehalten.

⏰ **Deadline-Prognose:**
- Aktuelle Fortschritt: 45%
- Geplantes Ende: Im Zeitplan
- Risiko für Verzögerung: Gering

⚠️ **Identifizierte Risiken:**
1. Ressourcenverfügbarkeit könnte im Q2 kritisch werden
2. Externe Abhängigkeiten noch nicht vollständig geklärt

📌 **Nächste Schritte:**
1. Milestone-Review durchführen
2. Ressourcenplanung für Q2 finalisieren
3. Kundenfeedback einholen`;
    }
    
    // Invoice Check
    if (lowerSystem.includes("invoice") || lowerPrompt.includes("rechnung")) {
      return `**Rechnungsprüfung (Demo)**

✅ **Prüfungsergebnis:** Keine kritischen Fehler

📋 **Geprüfte Punkte:**
- Rechnungsnummer: Korrekt
- Beträge: Plausibel
- MwSt-Berechnung: Korrekt
- Zahlungsziel: Standard

💡 **Empfehlungen:**
1. Detailliertere Positionsbeschreibungen könnten die Transparenz erhöhen
2. Skonto-Option könnte die Zahlungsgeschwindigkeit erhöhen

⚠️ **Zahlungsrisiko:** Niedrig
Basierend auf historischen Daten wird pünktliche Zahlung erwartet.`;
    }
    
    // Report Generation
    if (lowerSystem.includes("report") || lowerPrompt.includes("bericht")) {
      return `**Executive Summary (Demo)**

📊 **Berichtszeitraum:** Letzte 7 Tage

🏢 **Geschäftsübersicht:**
- Neue Kunden: 3
- Aktive Projekte: 12
- Offene Rechnungen: 5.430,00 €
- Bezahlte Rechnungen: 12.850,00 €

🔐 **Sicherheitsstatus:**
- Erfolgreiche Logins: 47
- Fehlgeschlagene Versuche: 2
- Keine kritischen Security-Events

📈 **Trends:**
- Kundenaktivität: +15% vs. Vorwoche
- Projektabschlüsse: Im Plan
- Umsatz: Stabil

🎯 **Empfohlene Aktionen:**
1. Follow-up bei 2 überfälligen Rechnungen
2. Projekt-Review für Q2 planen
3. Security-Audit für nächsten Monat einplanen`;
    }
    
    // Default
    return `**AI-Analyse (Demo)**

Diese Analyse wurde im Demo-Modus generiert. 
Für vollständige KI-Funktionalität bitte OpenAI API-Key konfigurieren.

📌 **Hinweis:** 
Die Demo zeigt die Struktur der AI-Antworten. 
In der Produktionsumgebung werden echte AI-Modelle verwendet.`;
  }
  
  /**
   * Loggt AI-Nutzung in die Datenbank
   */
  private static async logUsage(usage: {
    userId?: number;
    endpoint: string;
    provider: string;
    model: string;
    tokensInput: number;
    tokensOutput: number;
    tokensTotal: number;
    costEstimate: number;
    responseTimeMs: number;
    success: boolean;
    errorMessage?: string;
  }): Promise<void> {
    try {
      const pool = await getConnection();
      
      await pool.execute(
        `INSERT INTO lopez_ai_usage 
         (user_id, endpoint, provider, model, tokens_input, tokens_output, tokens_total, 
          cost_estimate, response_time_ms, success, error_message)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          usage.userId || null,
          usage.endpoint,
          usage.provider,
          usage.model,
          usage.tokensInput,
          usage.tokensOutput,
          usage.tokensTotal,
          usage.costEstimate,
          usage.responseTimeMs,
          usage.success,
          usage.errorMessage || null,
        ]
      );
    } catch (error) {
      console.error("AI Usage Logging fehlgeschlagen:", error);
    }
  }
  
  /**
   * Gibt AI-Nutzungsstatistiken zurück
   */
  static async getUsageStats(days: number = 30): Promise<{
    totalRequests: number;
    successfulRequests: number;
    totalTokens: number;
    totalCost: number;
    avgResponseTime: number;
    byProvider: Record<string, number>;
    byEndpoint: Record<string, number>;
  }> {
    try {
      const pool = await getConnection();
      
      const [stats] = await pool.execute(
        `SELECT 
          COUNT(*) as totalRequests,
          SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successfulRequests,
          SUM(tokens_total) as totalTokens,
          SUM(cost_estimate) as totalCost,
          AVG(response_time_ms) as avgResponseTime
         FROM lopez_ai_usage 
         WHERE created_at > DATE_SUB(NOW(), INTERVAL ? DAY)`,
        [days]
      );
      
      const [byProvider] = await pool.execute(
        `SELECT provider, COUNT(*) as count 
         FROM lopez_ai_usage 
         WHERE created_at > DATE_SUB(NOW(), INTERVAL ? DAY)
         GROUP BY provider`,
        [days]
      );
      
      const [byEndpoint] = await pool.execute(
        `SELECT endpoint, COUNT(*) as count 
         FROM lopez_ai_usage 
         WHERE created_at > DATE_SUB(NOW(), INTERVAL ? DAY)
         GROUP BY endpoint`,
        [days]
      );
      
      const statsRow = (stats as any[])[0];
      
      const providerMap: Record<string, number> = {};
      (byProvider as any[]).forEach(row => {
        providerMap[row.provider] = row.count;
      });
      
      const endpointMap: Record<string, number> = {};
      (byEndpoint as any[]).forEach(row => {
        endpointMap[row.endpoint] = row.count;
      });
      
      return {
        totalRequests: statsRow.totalRequests || 0,
        successfulRequests: statsRow.successfulRequests || 0,
        totalTokens: statsRow.totalTokens || 0,
        totalCost: parseFloat(statsRow.totalCost) || 0,
        avgResponseTime: Math.round(statsRow.avgResponseTime) || 0,
        byProvider: providerMap,
        byEndpoint: endpointMap,
      };
    } catch (error) {
      console.error("AI Usage Stats Fehler:", error);
      return {
        totalRequests: 0,
        successfulRequests: 0,
        totalTokens: 0,
        totalCost: 0,
        avgResponseTime: 0,
        byProvider: {},
        byEndpoint: {},
      };
    }
  }
}

export default AIProvider;

