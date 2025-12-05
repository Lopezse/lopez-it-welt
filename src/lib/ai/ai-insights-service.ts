// =====================================================
// ENTERPRISE++ AI INSIGHTS SERVICE
// =====================================================
// Erstellt: 2025-12-02
// Zweck: AI-Analyse für Kunden, Projekte, Rechnungen
// =====================================================

import { getConnection } from "../database";
import { AIProvider, AIResponse } from "./ai-provider";

// =====================================================
// INTERFACES
// =====================================================

export interface CustomerInsight {
  id: number;
  customerId: number;
  insightType: "summary" | "risk" | "potential" | "tone" | "recommendation";
  content: string;
  confidenceScore: number;
  provider: string;
  model: string;
  tokensUsed: number;
  costEstimate: number;
  createdAt: Date;
}

export interface ProjectInsight {
  id: number;
  projectId: number;
  insightType: "summary" | "risks" | "delays" | "recommendations" | "next_steps";
  content: string;
  confidenceScore: number;
  provider: string;
  createdAt: Date;
}

export interface InvoiceInsight {
  id: number;
  invoiceId: number;
  insightType: "summary" | "check" | "errors" | "suggestions" | "payment_risk";
  content: string;
  severity: "info" | "warning" | "error" | "critical";
  provider: string;
  createdAt: Date;
}

// =====================================================
// AI INSIGHTS SERVICE
// =====================================================

export class AIInsightsService {
  
  // =====================================================
  // CUSTOMER INSIGHTS
  // =====================================================
  
  /**
   * Generiert AI-Insights für einen Kunden
   */
  static async generateCustomerInsights(
    customerId: number,
    userId: number
  ): Promise<{ success: boolean; insights: CustomerInsight[]; error?: string }> {
    try {
      const pool = await getConnection();
      
      // Kundendaten laden
      const [customerRows] = await pool.execute(
        `SELECT c.*, 
                (SELECT COUNT(*) FROM lopez_projects WHERE customer_id = c.id) as project_count,
                (SELECT COUNT(*) FROM lopez_invoices WHERE customer_id = c.id) as invoice_count,
                (SELECT SUM(gross_amount) FROM lopez_invoices WHERE customer_id = c.id AND status = 'paid') as total_paid
         FROM lopez_customers c WHERE c.id = ?`,
        [customerId]
      );
      
      const customer = (customerRows as any[])[0];
      
      if (!customer) {
        return { success: false, insights: [], error: "Kunde nicht gefunden" };
      }
      
      // Notizen laden
      const [notes] = await pool.execute(
        "SELECT * FROM lopez_customer_notes WHERE customer_id = ? ORDER BY created_at DESC LIMIT 10",
        [customerId]
      );
      
      // AI-Prompt erstellen
      const customerName = customer.firmenname || `${customer.vorname} ${customer.nachname}`;
      const prompt = `
Analysiere folgenden Kunden und erstelle eine umfassende Analyse:

**Kunde:** ${customerName}
**Typ:** ${customer.customer_type || "Nicht angegeben"}
**Status:** ${customer.status || "aktiv"}
**Support-Level:** ${customer.support_level || "Standard"}
**Anzahl Projekte:** ${customer.project_count || 0}
**Anzahl Rechnungen:** ${customer.invoice_count || 0}
**Bezahltes Volumen:** ${customer.total_paid || 0} €

**Notizen:**
${(notes as any[]).map(n => `- ${n.content}`).join("\n") || "Keine Notizen vorhanden"}

Erstelle eine professionelle Analyse mit:
1. Zusammenfassung des Kunden
2. Risikoeinschätzung
3. Potenzialanalyse
4. Empfehlungen für die weitere Zusammenarbeit
`;

      const systemPrompt = `Du bist ein Enterprise-Business-Analyst. 
Analysiere Kundendaten professionell und gib strukturierte, actionable Insights.
Antworte auf Deutsch. Verwende Markdown-Formatierung.`;

      // AI-Anfrage
      const aiResponse = await AIProvider.generate({
        prompt,
        systemPrompt,
        userId,
        endpoint: `/api/admin/ai/customers/${customerId}/generate`,
      });
      
      if (!aiResponse.success) {
        return { success: false, insights: [], error: aiResponse.error };
      }
      
      // Insight speichern
      const [result] = await pool.execute(
        `INSERT INTO lopez_ai_customer_insights 
         (customer_id, insight_type, content, confidence_score, provider, model, tokens_used, cost_estimate, created_by_user_id)
         VALUES (?, 'summary', ?, 0.85, ?, ?, ?, ?, ?)`,
        [
          customerId,
          aiResponse.content,
          aiResponse.provider,
          aiResponse.model,
          aiResponse.tokensUsed,
          aiResponse.costEstimate,
          userId,
        ]
      );
      
      const insightId = (result as any).insertId;
      
      // Gespeicherte Insights zurückgeben
      return await this.getCustomerInsights(customerId);
      
    } catch (error) {
      console.error("Customer Insights Fehler:", error);
      return { success: false, insights: [], error: "Fehler bei der Kundenanalyse" };
    }
  }
  
  /**
   * Lädt vorhandene Customer Insights
   */
  static async getCustomerInsights(customerId: number): Promise<{ success: boolean; insights: CustomerInsight[] }> {
    try {
      const pool = await getConnection();
      
      const [rows] = await pool.execute(
        `SELECT * FROM lopez_ai_customer_insights 
         WHERE customer_id = ? 
         ORDER BY created_at DESC`,
        [customerId]
      );
      
      const insights: CustomerInsight[] = (rows as any[]).map(row => ({
        id: row.id,
        customerId: row.customer_id,
        insightType: row.insight_type,
        content: row.content,
        confidenceScore: parseFloat(row.confidence_score),
        provider: row.provider,
        model: row.model,
        tokensUsed: row.tokens_used,
        costEstimate: parseFloat(row.cost_estimate),
        createdAt: new Date(row.created_at),
      }));
      
      return { success: true, insights };
    } catch (error) {
      console.error("Get Customer Insights Fehler:", error);
      return { success: true, insights: [] };
    }
  }
  
  // =====================================================
  // PROJECT INSIGHTS
  // =====================================================
  
  /**
   * Generiert AI-Insights für ein Projekt
   */
  static async generateProjectInsights(
    projectId: number,
    userId: number
  ): Promise<{ success: boolean; insights: ProjectInsight[]; error?: string }> {
    try {
      const pool = await getConnection();
      
      // Projektdaten laden
      const [projectRows] = await pool.execute(
        `SELECT p.*, 
                c.firmenname, c.vorname, c.nachname,
                (SELECT COUNT(*) FROM lopez_project_tasks WHERE project_id = p.id) as task_count,
                (SELECT COUNT(*) FROM lopez_project_tasks WHERE project_id = p.id AND status = 'done') as tasks_done,
                (SELECT COUNT(*) FROM lopez_invoices WHERE project_id = p.id) as invoice_count
         FROM lopez_projects p
         LEFT JOIN lopez_customers c ON p.customer_id = c.id
         WHERE p.id = ?`,
        [projectId]
      );
      
      const project = (projectRows as any[])[0];
      
      if (!project) {
        return { success: false, insights: [], error: "Projekt nicht gefunden" };
      }
      
      const customerName = project.firmenname || `${project.vorname} ${project.nachname}`;
      
      const prompt = `
Analysiere folgendes Projekt und erstelle eine umfassende Analyse:

**Projekt:** ${project.project_name}
**Code:** ${project.project_code || "N/A"}
**Kunde:** ${customerName}
**Status:** ${project.status}
**Startdatum:** ${project.start_date || "Nicht festgelegt"}
**Enddatum:** ${project.end_date || "Nicht festgelegt"}
**Budget:** ${project.budget_amount ? project.budget_amount + " €" : "Nicht festgelegt"}
**Aufgaben gesamt:** ${project.task_count || 0}
**Aufgaben erledigt:** ${project.tasks_done || 0}
**Rechnungen:** ${project.invoice_count || 0}

**Beschreibung:**
${project.description || "Keine Beschreibung"}

Erstelle eine professionelle Projektanalyse mit:
1. Status-Zusammenfassung
2. Deadline-Prognose
3. Risikoanalyse
4. Empfohlene nächste Schritte
`;

      const systemPrompt = `Du bist ein Enterprise-Projektmanagement-Analyst.
Analysiere Projektdaten professionell und gib strukturierte, actionable Insights.
Antworte auf Deutsch. Verwende Markdown-Formatierung.`;

      const aiResponse = await AIProvider.generate({
        prompt,
        systemPrompt,
        userId,
        endpoint: `/api/admin/ai/projects/${projectId}/analyze`,
      });
      
      if (!aiResponse.success) {
        return { success: false, insights: [], error: aiResponse.error };
      }
      
      // Insight speichern
      await pool.execute(
        `INSERT INTO lopez_ai_project_insights 
         (project_id, insight_type, content, confidence_score, provider, model, tokens_used, cost_estimate, created_by_user_id)
         VALUES (?, 'summary', ?, 0.85, ?, ?, ?, ?, ?)`,
        [
          projectId,
          aiResponse.content,
          aiResponse.provider,
          aiResponse.model,
          aiResponse.tokensUsed,
          aiResponse.costEstimate,
          userId,
        ]
      );
      
      return await this.getProjectInsights(projectId);
      
    } catch (error) {
      console.error("Project Insights Fehler:", error);
      return { success: false, insights: [], error: "Fehler bei der Projektanalyse" };
    }
  }
  
  /**
   * Lädt vorhandene Project Insights
   */
  static async getProjectInsights(projectId: number): Promise<{ success: boolean; insights: ProjectInsight[] }> {
    try {
      const pool = await getConnection();
      
      const [rows] = await pool.execute(
        `SELECT * FROM lopez_ai_project_insights 
         WHERE project_id = ? 
         ORDER BY created_at DESC`,
        [projectId]
      );
      
      const insights: ProjectInsight[] = (rows as any[]).map(row => ({
        id: row.id,
        projectId: row.project_id,
        insightType: row.insight_type,
        content: row.content,
        confidenceScore: parseFloat(row.confidence_score),
        provider: row.provider,
        createdAt: new Date(row.created_at),
      }));
      
      return { success: true, insights };
    } catch (error) {
      return { success: true, insights: [] };
    }
  }
  
  /**
   * Enterprise++ Extended Project Analysis
   * Generiert AI-Insights für ein Projekt mit benutzerdefinierten Analysetypen
   */
  static async generateProjectInsightsExtended(
    projectId: number,
    userId: number,
    analysisTypes: string[]
  ): Promise<{ success: boolean; insights: any[]; error?: string }> {
    try {
      const pool = await getConnection();
      
      // Projektdaten laden - INKL. progress_percent aus MD-Sync!
      const [projectRows] = await pool.execute(
        `SELECT p.*, 
                c.firmenname, c.vorname, c.nachname,
                (SELECT COUNT(*) FROM lopez_project_tasks WHERE project_id = p.id) as task_count,
                (SELECT COUNT(*) FROM lopez_project_tasks WHERE project_id = p.id AND status = 'done') as tasks_done,
                (SELECT COUNT(*) FROM lopez_project_tasks WHERE project_id = p.id AND status = 'in_progress') as tasks_in_progress,
                (SELECT COUNT(*) FROM lopez_invoices WHERE project_id = p.id) as invoice_count,
                (SELECT SUM(gross_amount) FROM lopez_invoices WHERE project_id = p.id AND status = 'paid') as paid_amount
         FROM lopez_projects p
         LEFT JOIN lopez_customers c ON p.customer_id = c.id
         WHERE p.id = ?`,
        [projectId]
      );
      
      const project = (projectRows as any[])[0];
      
      if (!project) {
        return { success: false, insights: [], error: "Projekt nicht gefunden" };
      }
      
      const customerName = project.firmenname || `${project.vorname} ${project.nachname}`;
      
      // Analyse-Typen in deutschen Text umwandeln
      const analysisLabels: Record<string, string> = {
        summary: "Status-Zusammenfassung",
        timeline: "Zeitplan-Analyse & Deadline-Prognose",
        risks: "Risiko-Analyse",
        next_steps: "Empfohlene nächste Schritte",
        code_quality: "Code-Qualitätsanalyse",
        docs_review: "Dokumentations-Review",
      };
      
      const selectedAnalyses = analysisTypes
        .filter(t => analysisLabels[t])
        .map(t => analysisLabels[t]);
      
      // =====================================================
      // ENTERPRISE++ FORTSCHRITTS-LOGIK
      // =====================================================
      // Priorität: 
      // 1. progress_percent aus DB (vom MD-Sync) 
      // 2. Fallback: taskProgress aus Tasks
      // =====================================================
      
      const taskProgress = project.task_count > 0 
        ? Math.round((project.tasks_done / project.task_count) * 100) 
        : 0;
      
      // Nutze den MD-Sync Fortschritt wenn verfügbar (> 0)
      const mdProgress = project.progress_percent || 0;
      const mdStatusText = project.progress_status_text || null;
      const lastProgressUpdate = project.last_progress_update;
      
      // Der "echte" Fortschritt: MD-Sync hat Priorität!
      const actualProgress = mdProgress > 0 ? mdProgress : taskProgress;
      const progressSource = mdProgress > 0 ? "STATUS.md" : "Aufgaben";
      
      // Berechne Tage bis Deadline
      let daysUntilDeadline = "Keine Deadline";
      if (project.end_date) {
        const endDate = new Date(project.end_date);
        const today = new Date();
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        daysUntilDeadline = diffDays > 0 
          ? `${diffDays} Tage verbleibend` 
          : diffDays === 0 
            ? "Heute fällig!" 
            : `${Math.abs(diffDays)} Tage überfällig!`;
      }
      
      const prompt = `
# Enterprise++ Projektanalyse

Analysiere folgendes Projekt professionell und erstelle einen strukturierten Report.

## Projektdaten

| Feld | Wert |
|------|------|
| **Projektname** | ${project.project_name} |
| **Code** | ${project.project_code || "N/A"} |
| **Kunde** | ${customerName} |
| **Status** | ${project.status} |
| **Startdatum** | ${project.start_date ? new Date(project.start_date).toLocaleDateString("de-DE") : "Nicht festgelegt"} |
| **Enddatum** | ${project.end_date ? new Date(project.end_date).toLocaleDateString("de-DE") : "Nicht festgelegt"} |
| **Deadline-Status** | ${daysUntilDeadline} |
| **Budget** | ${project.budget_amount ? project.budget_amount.toLocaleString("de-DE") + " €" : "Nicht festgelegt"} |

## 📊 AKTUELLER FORTSCHRITT (${progressSource})

| Metrik | Wert |
|--------|------|
| **GESAMTFORTSCHRITT** | **${actualProgress}%** |
| **Datenquelle** | ${progressSource} |
${mdProgress > 0 ? `| **MD-Sync Status** | ${mdStatusText || "Synchronisiert"} |` : ""}
${lastProgressUpdate ? `| **Letztes Update** | ${new Date(lastProgressUpdate).toLocaleDateString("de-DE")} |` : ""}
| **Aufgaben gesamt** | ${project.task_count || 0} |
| **Aufgaben erledigt** | ${project.tasks_done || 0} |
| **In Bearbeitung** | ${project.tasks_in_progress || 0} |
| **Rechnungen** | ${project.invoice_count || 0} |
| **Bezahlt** | ${project.paid_amount ? project.paid_amount.toLocaleString("de-DE") + " €" : "0 €"} |

${mdProgress >= 70 ? "**✅ PROJEKT IST WEIT FORTGESCHRITTEN!** Die meisten Meilensteine wurden erreicht." : ""}
${mdProgress >= 30 && mdProgress < 70 ? "**🟡 PROJEKT IN AKTIVER BEARBEITUNG.** Gute Fortschritte sichtbar." : ""}
${mdProgress > 0 && mdProgress < 30 ? "**⚠️ PROJEKT IN FRÜHER PHASE.** Weitere Aktivität erforderlich." : ""}

## Beschreibung
${project.description || "Keine Beschreibung vorhanden"}

---

## Angeforderte Analysen
${selectedAnalyses.map(a => `- ${a}`).join("\n")}

---

Erstelle eine professionelle Analyse im SAP/IBM Enterprise-Stil mit klaren Überschriften, Bullet Points und konkreten Empfehlungen.

**WICHTIG - FORTSCHRITTS-INTERPRETATION:**
- Der GESAMTFORTSCHRITT von **${actualProgress}%** aus "${progressSource}" ist die WAHRHEIT
- Bei Fortschritt ≥70%: Risiken sind NIEDRIG, Projekt ist auf Kurs
- Bei Fortschritt ≥30%: Risiken sind MITTEL, normale Projektarbeit
- Bei Fortschritt <30%: Risiken können HOCH sein, mehr Aktivität nötig
- NIEMALS "0% Fortschritt" oder "Projekt steht am Anfang" schreiben, wenn der Fortschritt > 0 ist!

Für jede angeforderte Analyse:
1. Nutze klare Überschriften (##)
2. Verwende Bullet Points für Details
3. Gib konkrete, umsetzbare Empfehlungen
4. Bewerte Risiken mit Kritikalität (🔴 Hoch / 🟡 Mittel / 🟢 Niedrig)
5. Berücksichtige den tatsächlichen Fortschritt bei der Risikobewertung!
6. Schließe mit einem Executive Summary ab
`;

      const systemPrompt = `Du bist ein Enterprise-Projektmanagement-Analyst auf SAP/IBM-Niveau.
Erstelle professionelle, strukturierte Analysen mit klaren Empfehlungen.
Antworte auf Deutsch. Verwende Markdown-Formatierung mit Tabellen und Emojis für Kritikalität.
Sei präzise, professionell und action-orientiert.`;

      const aiResponse = await AIProvider.generate({
        prompt,
        systemPrompt,
        userId,
        endpoint: `/api/admin/ai/projects/${projectId}/analyze`,
        maxTokens: 2500,
      });
      
      if (!aiResponse.success) {
        return { success: false, insights: [], error: aiResponse.error };
      }
      
      // Insight speichern
      const insightType = analysisTypes.join(",");
      
      await pool.execute(
        `INSERT INTO lopez_ai_project_insights 
         (project_id, insight_type, content, confidence_score, provider, model, tokens_used, cost_estimate, created_by_user_id)
         VALUES (?, ?, ?, 0.90, ?, ?, ?, ?, ?)`,
        [
          projectId,
          insightType.substring(0, 50), // Limit to 50 chars
          aiResponse.content,
          aiResponse.provider,
          aiResponse.model,
          aiResponse.tokensUsed,
          aiResponse.costEstimate,
          userId,
        ]
      );
      
      // Aktuelle Insights laden und zurückgeben
      const [rows] = await pool.execute(
        `SELECT * FROM lopez_ai_project_insights 
         WHERE project_id = ? 
         ORDER BY created_at DESC
         LIMIT 5`,
        [projectId]
      );
      
      return { success: true, insights: rows as any[] };
      
    } catch (error) {
      console.error("Extended Project Insights Fehler:", error);
      return { success: false, insights: [], error: "Fehler bei der erweiterten Projektanalyse" };
    }
  }
  
  // =====================================================
  // INVOICE INSIGHTS
  // =====================================================
  
  /**
   * Prüft eine Rechnung mit AI
   */
  static async checkInvoice(
    invoiceId: number,
    userId: number
  ): Promise<{ success: boolean; insights: InvoiceInsight[]; error?: string }> {
    try {
      const pool = await getConnection();
      
      // Rechnungsdaten laden
      const [invoiceRows] = await pool.execute(
        `SELECT i.*, 
                c.firmenname, c.vorname, c.nachname, c.email,
                p.project_name
         FROM lopez_invoices i
         LEFT JOIN lopez_customers c ON i.customer_id = c.id
         LEFT JOIN lopez_projects p ON i.project_id = p.id
         WHERE i.id = ?`,
        [invoiceId]
      );
      
      const invoice = (invoiceRows as any[])[0];
      
      if (!invoice) {
        return { success: false, insights: [], error: "Rechnung nicht gefunden" };
      }
      
      // Positionen laden
      const [items] = await pool.execute(
        "SELECT * FROM lopez_invoice_items WHERE invoice_id = ?",
        [invoiceId]
      );
      
      const customerName = invoice.firmenname || `${invoice.vorname} ${invoice.nachname}`;
      
      const prompt = `
Prüfe folgende Rechnung auf Fehler, Unstimmigkeiten und gib Empfehlungen:

**Rechnung:** ${invoice.invoice_number}
**Kunde:** ${customerName}
**E-Mail:** ${invoice.email || "N/A"}
**Projekt:** ${invoice.project_name || "Keinem Projekt zugeordnet"}
**Status:** ${invoice.status}
**Rechnungsdatum:** ${invoice.issue_date}
**Fälligkeitsdatum:** ${invoice.due_date}
**Netto:** ${invoice.net_amount} €
**MwSt (${invoice.tax_rate}%):** ${invoice.tax_amount} €
**Brutto:** ${invoice.gross_amount} €

**Positionen:**
${(items as any[]).map(item => 
  `- ${item.description}: ${item.quantity}x ${item.unit_price}€ = ${item.gross_amount}€`
).join("\n") || "Keine Positionen"}

**Zahlungsbedingungen:** ${invoice.payment_terms || "Standard"}

Prüfe:
1. Sind alle Pflichtangaben vorhanden?
2. Sind die Berechnungen korrekt?
3. Gibt es Risiken (z.B. verspätete Zahlung)?
4. Empfehlungen zur Verbesserung
`;

      const systemPrompt = `Du bist ein Enterprise-Rechnungsprüfer.
Analysiere Rechnungen professionell und identifiziere Fehler, Risiken und Verbesserungspotenzial.
Antworte auf Deutsch. Verwende Markdown-Formatierung.`;

      const aiResponse = await AIProvider.generate({
        prompt,
        systemPrompt,
        userId,
        endpoint: `/api/admin/ai/invoices/${invoiceId}/check`,
      });
      
      if (!aiResponse.success) {
        return { success: false, insights: [], error: aiResponse.error };
      }
      
      // Insight speichern
      await pool.execute(
        `INSERT INTO lopez_ai_invoice_insights 
         (invoice_id, insight_type, content, severity, provider, model, tokens_used, cost_estimate, created_by_user_id)
         VALUES (?, 'check', ?, 'info', ?, ?, ?, ?, ?)`,
        [
          invoiceId,
          aiResponse.content,
          aiResponse.provider,
          aiResponse.model,
          aiResponse.tokensUsed,
          aiResponse.costEstimate,
          userId,
        ]
      );
      
      return await this.getInvoiceInsights(invoiceId);
      
    } catch (error) {
      console.error("Invoice Check Fehler:", error);
      return { success: false, insights: [], error: "Fehler bei der Rechnungsprüfung" };
    }
  }
  
  /**
   * Lädt vorhandene Invoice Insights
   */
  static async getInvoiceInsights(invoiceId: number): Promise<{ success: boolean; insights: InvoiceInsight[] }> {
    try {
      const pool = await getConnection();
      
      const [rows] = await pool.execute(
        `SELECT * FROM lopez_ai_invoice_insights 
         WHERE invoice_id = ? 
         ORDER BY created_at DESC`,
        [invoiceId]
      );
      
      const insights: InvoiceInsight[] = (rows as any[]).map(row => ({
        id: row.id,
        invoiceId: row.invoice_id,
        insightType: row.insight_type,
        content: row.content,
        severity: row.severity,
        provider: row.provider,
        createdAt: new Date(row.created_at),
      }));
      
      return { success: true, insights };
    } catch (error) {
      return { success: true, insights: [] };
    }
  }
  
  // =====================================================
  // EXECUTIVE REPORTS
  // =====================================================
  
  /**
   * Generiert einen Executive Report
   */
  static async generateReport(
    reportType: "weekly" | "monthly" | "quarterly" | "security" | "financial",
    userId: number
  ): Promise<{ success: boolean; reportId?: number; content?: string; error?: string }> {
    try {
      const pool = await getConnection();
      
      // Daten sammeln basierend auf Report-Typ
      let dataSnapshot: any = {};
      let periodStart = new Date();
      let periodEnd = new Date();
      
      if (reportType === "weekly") {
        periodStart.setDate(periodStart.getDate() - 7);
      } else if (reportType === "monthly") {
        periodStart.setMonth(periodStart.getMonth() - 1);
      } else if (reportType === "quarterly") {
        periodStart.setMonth(periodStart.getMonth() - 3);
      }
      
      // Kunden-Statistiken
      const [customerStats] = await pool.execute(
        `SELECT COUNT(*) as total, 
                SUM(CASE WHEN created_at > ? THEN 1 ELSE 0 END) as new_count
         FROM lopez_customers`,
        [periodStart]
      );
      dataSnapshot.customers = (customerStats as any[])[0];
      
      // Projekt-Statistiken
      const [projectStats] = await pool.execute(
        `SELECT COUNT(*) as total,
                SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN status = 'done' AND updated_at > ? THEN 1 ELSE 0 END) as completed
         FROM lopez_projects`,
        [periodStart]
      );
      dataSnapshot.projects = (projectStats as any[])[0];
      
      // Rechnungs-Statistiken
      const [invoiceStats] = await pool.execute(
        `SELECT COUNT(*) as total,
                SUM(CASE WHEN status = 'paid' THEN gross_amount ELSE 0 END) as paid_amount,
                SUM(CASE WHEN status = 'sent' THEN gross_amount ELSE 0 END) as open_amount,
                SUM(CASE WHEN status = 'overdue' THEN gross_amount ELSE 0 END) as overdue_amount
         FROM lopez_invoices WHERE issue_date > ?`,
        [periodStart]
      );
      dataSnapshot.invoices = (invoiceStats as any[])[0];
      
      // Security-Statistiken
      const [securityStats] = await pool.execute(
        `SELECT COUNT(*) as total_events,
                SUM(CASE WHEN risk_level IN ('high', 'critical') THEN 1 ELSE 0 END) as high_risk
         FROM lopez_security_events WHERE created_at > ?`,
        [periodStart]
      );
      dataSnapshot.security = (securityStats as any[])[0];
      
      // Report-Prompt
      const prompt = `
Erstelle einen ${reportType === "weekly" ? "Wochenbericht" : reportType === "monthly" ? "Monatsbericht" : "Quartalsbericht"} 
im Enterprise-Executive-Style (wie SAP/IBM).

**Berichtszeitraum:** ${periodStart.toLocaleDateString("de-DE")} - ${periodEnd.toLocaleDateString("de-DE")}

**Geschäftsdaten:**
- Kunden gesamt: ${dataSnapshot.customers?.total || 0}
- Neue Kunden im Zeitraum: ${dataSnapshot.customers?.new_count || 0}

**Projekte:**
- Gesamt: ${dataSnapshot.projects?.total || 0}
- Aktiv: ${dataSnapshot.projects?.active || 0}
- Abgeschlossen im Zeitraum: ${dataSnapshot.projects?.completed || 0}

**Finanzen:**
- Bezahlt: ${dataSnapshot.invoices?.paid_amount || 0} €
- Offen: ${dataSnapshot.invoices?.open_amount || 0} €
- Überfällig: ${dataSnapshot.invoices?.overdue_amount || 0} €

**Sicherheit:**
- Security Events: ${dataSnapshot.security?.total_events || 0}
- Kritische Events: ${dataSnapshot.security?.high_risk || 0}

Erstelle einen professionellen Executive Summary mit:
1. Zusammenfassung der wichtigsten KPIs
2. Trends und Entwicklungen
3. Identifizierte Risiken
4. Empfohlene Maßnahmen
5. Ausblick auf die nächste Periode
`;

      const systemPrompt = `Du bist ein Enterprise-Business-Intelligence-Analyst.
Erstelle professionelle Executive Reports im SAP/IBM-Stil.
Antworte auf Deutsch. Verwende klare Struktur und Markdown-Formatierung.`;

      const aiResponse = await AIProvider.generate({
        prompt,
        systemPrompt,
        userId,
        endpoint: `/api/admin/ai/reports/generate?type=${reportType}`,
        maxTokens: 3000,
      });
      
      if (!aiResponse.success) {
        return { success: false, error: aiResponse.error };
      }
      
      // Report speichern
      const title = `${reportType === "weekly" ? "Wochenbericht" : reportType === "monthly" ? "Monatsbericht" : "Quartalsbericht"} - ${periodEnd.toLocaleDateString("de-DE")}`;
      
      const [result] = await pool.execute(
        `INSERT INTO lopez_ai_reports 
         (report_type, title, content, summary, period_start, period_end, data_snapshot, 
          provider, model, tokens_used, cost_estimate, created_by_user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          reportType,
          title,
          aiResponse.content,
          aiResponse.content.substring(0, 500) + "...",
          periodStart,
          periodEnd,
          JSON.stringify(dataSnapshot),
          aiResponse.provider,
          aiResponse.model,
          aiResponse.tokensUsed,
          aiResponse.costEstimate,
          userId,
        ]
      );
      
      return {
        success: true,
        reportId: (result as any).insertId,
        content: aiResponse.content,
      };
      
    } catch (error) {
      console.error("Report Generation Fehler:", error);
      return { success: false, error: "Fehler bei der Report-Generierung" };
    }
  }
  
  /**
   * Lädt vorhandene Reports
   */
  static async getReports(limit: number = 20): Promise<any[]> {
    try {
      const pool = await getConnection();
      
      const [rows] = await pool.execute(
        `SELECT * FROM lopez_ai_reports ORDER BY generated_at DESC LIMIT ?`,
        [limit]
      );
      
      return rows as any[];
    } catch (error) {
      return [];
    }
  }
}

export default AIInsightsService;

