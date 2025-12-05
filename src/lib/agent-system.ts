// =====================================================
// ENTERPRISE++ AGENT-SYSTEM – PLAN • BUILD • RUN
// =====================================================
// Erstellt: 2025-12-02
// Aktualisiert: 2025-12-02
// Zweck: IBM / SAP / Siemens Standard – Prozessbasierte Modulsteuerung
// Status: ✅ ENTERPRISE++ IMPLEMENTIERT
// =====================================================
// 
// Agent-System nach Enterprise-Standard:
// - Agent-Plan: Analyse, Anforderungen, Roadmap, SOLL-Definition
// - Agent-Build: Umsetzung, Entwicklung, IST-Erfassung, Module bauen
// - Agent-Run: Qualitätssicherung, Tests, Betrieb, Freigaben
// =====================================================

import { getConnection } from "./database";

// =====================================================
// TYPEN & INTERFACES
// =====================================================

export type AgentType = "plan" | "build" | "run";
export type SollStatus = "open" | "planned" | "required";
export type IstStatus = "open" | "in_progress" | "done";
export type TaskStatus = "open" | "in_progress" | "done";
export type Priority = "low" | "medium" | "high";

// Enterprise++ Risiko-System
export type PriorityLevel = "P0" | "P1" | "P2" | "P3";
export type MaturityLevel = "M0" | "M1" | "M2" | "M3" | "M4" | "M5";
export type RiskLevel = "critical" | "high" | "medium" | "low";

export interface ModuleRegistry {
  id: number;
  category: string;
  module_name: string;
  description: string;
  priority: Priority;
  soll_status: SollStatus;
  created_at: Date;
  updated_at: Date;
}

export interface ModuleProgress {
  id: number;
  module_id: number;
  ist_status: IstStatus;
  progress_percent: number;
  comment: string;
  responsible_agent: AgentType;
  updated_at: Date;
}

export interface AgentTask {
  id: number;
  title: string;
  description: string;
  assigned_agent: AgentType;
  status: TaskStatus;
  related_module_id: number | null;
  priority: Priority;
  created_at: Date;
  updated_at: Date;
}

// =====================================================
// ENTERPRISE++ UTILITY FUNKTIONEN (Fehlertoleranz)
// =====================================================
// Diese Helper sorgen für konsistentes Default-Handling
// bei fehlenden module_progress Einträgen
// =====================================================

/**
 * Normalisiert depends_on Feld (NULL, undefined, '', ungültiges JSON -> [])
 */
export function normalizeDependsOn(dependsOnRaw: unknown): string[] {
  if (dependsOnRaw === null || dependsOnRaw === undefined || dependsOnRaw === "") {
    return [];
  }
  
  if (Array.isArray(dependsOnRaw)) {
    return dependsOnRaw.filter(d => typeof d === "string");
  }
  
  if (typeof dependsOnRaw === "string") {
    try {
      const parsed = JSON.parse(dependsOnRaw);
      if (Array.isArray(parsed)) {
        return parsed.filter(d => typeof d === "string");
      }
    } catch {
      // Ungültiges JSON -> leeres Array
    }
  }
  
  return [];
}

/**
 * Interface für normalisierte Modul-Daten mit Defaults
 */
export interface NormalizedModuleData {
  id: number;
  module_name: string;
  category: string;
  priority: Priority;
  soll_status: SollStatus;
  priority_level: PriorityLevel;
  maturity_level: MaturityLevel;
  risk_level: RiskLevel;
  depends_on: string[];
  go_live_required: boolean;
  progress_percent: number;
  ist_status: IstStatus;
  responsible_agent: AgentType;
  comment: string;
  has_progress_entry: boolean;
}

/**
 * Erstellt normalisierte Modul-Daten mit Defaults für fehlende progress-Einträge
 */
export function ensureModuleProgressDefaults(
  registryRow: any,
  progressRow?: any
): NormalizedModuleData {
  const hasProgressEntry = progressRow !== undefined && progressRow !== null;
  
  return {
    id: registryRow.id,
    module_name: registryRow.module_name || "Unknown",
    category: registryRow.category || "Uncategorized",
    priority: registryRow.priority || "medium",
    soll_status: registryRow.soll_status || "planned",
    priority_level: (registryRow.priority_level || "P2") as PriorityLevel,
    maturity_level: hasProgressEntry 
      ? (registryRow.maturity_level || "M0") as MaturityLevel
      : "M0",
    risk_level: hasProgressEntry
      ? (registryRow.risk_level || "medium") as RiskLevel
      : "medium",
    depends_on: normalizeDependsOn(registryRow.depends_on),
    go_live_required: Boolean(registryRow.go_live_required),
    progress_percent: hasProgressEntry ? (progressRow?.progress_percent ?? 0) : 0,
    ist_status: hasProgressEntry ? (progressRow?.ist_status ?? "open") as IstStatus : "open",
    responsible_agent: hasProgressEntry 
      ? (progressRow?.responsible_agent ?? "plan") as AgentType 
      : "plan",
    comment: hasProgressEntry ? (progressRow?.comment ?? "") : "",
    has_progress_entry: hasProgressEntry,
  };
}

/**
 * Logger-Levels für Enterprise++ Logging
 */
type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * Enterprise++ Logger (zentral, nicht console.log Spam)
 */
export const agentLogger = {
  debug: (message: string, data?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === "development" || process.env.AGENT_DEBUG === "true") {
      console.log(`[AGENT-DEBUG] ${message}`, data || "");
    }
  },
  info: (message: string, data?: Record<string, unknown>) => {
    console.log(`[AGENT-INFO] ${message}`, data || "");
  },
  warn: (message: string, data?: Record<string, unknown>) => {
    console.warn(`[AGENT-WARN] ${message}`, data || "");
  },
  error: (message: string, error?: unknown, data?: Record<string, unknown>) => {
    console.error(`[AGENT-ERROR] ${message}`, error instanceof Error ? error.message : error, data || "");
  },
};

// =====================================================
// ENTERPRISE++ SOLL-MODULE DEFINITION (Fein-Granular)
// =====================================================
// 50 Module in 10 Kategorien nach IBM/SAP/Siemens Standard
// =====================================================

export const SOLL_MODULE_LIST: Omit<ModuleRegistry, "id" | "created_at" | "updated_at">[] = [
  // =====================================================
  // 1. Admin & Core Platform (ADM-01 bis ADM-07)
  // =====================================================
  {
    category: "Admin & Core Platform",
    module_name: "ADM-01 Admin-Dashboard",
    description: "Zentrales Admin-Dashboard mit Kacheln, Statusübersichten und Schnellzugriffen.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Admin & Core Platform",
    module_name: "ADM-02 Benutzerverwaltung",
    description: "Benutzer anlegen, bearbeiten, sperren, Passwortrücksetzung.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Admin & Core Platform",
    module_name: "ADM-03 Rollen & Rechte (RBAC/ABAC)",
    description: "Rollen definieren, Rechte zuweisen, Policy-Logik für RBAC/ABAC.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Admin & Core Platform",
    module_name: "ADM-04 2FA & Session-Management",
    description: "2FA-Integration (z. B. Aegis), Session-Übersicht, IP-Bindung, Session-Logout.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Admin & Core Platform",
    module_name: "ADM-05 Audit-Logs",
    description: "Protokollierung sicherheitsrelevanter Aktionen, einsehbar im Admin.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Admin & Core Platform",
    module_name: "ADM-06 Dynamic Settings",
    description: "Zentrales Settings-System (Firma, Domains, Limits, AI-Provider, Mail, etc.).",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Admin & Core Platform",
    module_name: "ADM-07 Modul-Registry (SOLL/IST)",
    description: "Verwaltung aller Module inkl. Kategorie, Status, Priorität und Agent-Zuordnung.",
    priority: "high",
    soll_status: "required",
  },

  // =====================================================
  // 2. Kunden & Projekte (KP-01 bis KP-05)
  // =====================================================
  {
    category: "Kunden & Projekte",
    module_name: "KP-01 Kundenliste",
    description: "Übersicht aller Kunden mit Filter- und Suchfunktionen.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Kunden & Projekte",
    module_name: "KP-02 Kundenstammdaten",
    description: "Verwaltung von Firmendaten, Ansprechpartnern, Adressen und Kontaktdaten.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Kunden & Projekte",
    module_name: "KP-03 Projekte pro Kunde",
    description: "Zuordnung und Verwaltung von Projekten je Kunde inkl. Status.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Kunden & Projekte",
    module_name: "KP-04 Projekt-Fortschritts-Tracking",
    description: "Projektfortschritt, Deadlines und Status (Ampel) je Projekt.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Kunden & Projekte",
    module_name: "KP-05 Projekt-Notizen & Dateien",
    description: "Interne Notizen und verknüpfte Dateien je Projekt.",
    priority: "medium",
    soll_status: "planned",
  },

  // =====================================================
  // 3. Support & Kommunikation (SUP-01 bis SUP-04)
  // =====================================================
  {
    category: "Support & Kommunikation",
    module_name: "SUP-01 Support-Tickets",
    description: "Ticket-System mit Status, Priorität, Zuweisung und Historie.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Support & Kommunikation",
    module_name: "SUP-02 Kontakt-Nachrichten",
    description: "Eingehende Kontaktformular-Anfragen von der Website im Admin anzeigen.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Support & Kommunikation",
    module_name: "SUP-03 E-Mail-Templates",
    description: "Verwaltung von Standard-E-Mail-Texten für Bestätigungen und Benachrichtigungen.",
    priority: "medium",
    soll_status: "planned",
  },
  {
    category: "Support & Kommunikation",
    module_name: "SUP-04 Benachrichtigungssystem (Admin)",
    description: "Badges, Hinweise und interne Benachrichtigungen im Admin-Dashboard.",
    priority: "medium",
    soll_status: "planned",
  },

  // =====================================================
  // 4. Inhalte & Medien (MED-01 bis MED-05)
  // =====================================================
  {
    category: "Inhalte & Medien",
    module_name: "MED-01 Medienbibliothek",
    description: "Übersicht aller hochgeladenen Medien inkl. Filter und Suche.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Inhalte & Medien",
    module_name: "MED-02 Sicherer Dateispeicher",
    description: "ID-basierte Dateistruktur, keine Klartext-Dateinamen, kein Directory Listing.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Inhalte & Medien",
    module_name: "MED-03 Media-KI Analyse",
    description: "Automatische KI-Analyse von Medien, inkl. Tags und DSGVO-Flags.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Inhalte & Medien",
    module_name: "MED-04 Meta-Daten-Verwaltung",
    description: "Verwaltung von meta.json + DB-Feldern (Titel, Beschreibung, KI-Ergebnis).",
    priority: "medium",
    soll_status: "required",
  },
  {
    category: "Inhalte & Medien",
    module_name: "MED-05 Medien-Zuordnung",
    description: "Verknüpfung von Medien mit Projekten, Kunden, Beiträgen usw.",
    priority: "medium",
    soll_status: "planned",
  },

  // =====================================================
  // 5. AI Center (AI-01 bis AI-05)
  // =====================================================
  {
    category: "AI Center",
    module_name: "AI-01 Customer Insights",
    description: "Auswertung von Kundenhistorien (Tickets, Projekte, Rechnungen) mit KI.",
    priority: "medium",
    soll_status: "planned",
  },
  {
    category: "AI Center",
    module_name: "AI-02 Project Analyzer",
    description: "Analyse von Projektstatus und Risiken basierend auf SOLL/IST und Texten.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "AI Center",
    module_name: "AI-03 Invoice Assistant",
    description: "KI-Unterstützung zur Prüfung von Rechnungen und Positionen.",
    priority: "medium",
    soll_status: "planned",
  },
  {
    category: "AI Center",
    module_name: "AI-04 Executive Reports",
    description: "KI-generierte Management-Reports (Woche, Monat, Risiko, Auslastung).",
    priority: "medium",
    soll_status: "planned",
  },
  {
    category: "AI Center",
    module_name: "AI-05 AI Cost & Provider Control",
    description: "Kostenkontrolle, Provider-Auswahl und Limits für KI-Provider.",
    priority: "high",
    soll_status: "required",
  },

  // =====================================================
  // 6. Finanzen & Rechnungen (FIN-01 bis FIN-05)
  // =====================================================
  {
    category: "Finanzen & Rechnungen",
    module_name: "FIN-01 Rechnungsmodul Basis",
    description: "Rechnungen anlegen, speichern, PDF-Erzeugung.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Finanzen & Rechnungen",
    module_name: "FIN-02 Produkt- und Dienstleistungskatalog",
    description: "Verwaltung von Leistungen, Produkten, Preisen und Stundensätzen.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Finanzen & Rechnungen",
    module_name: "FIN-03 Angebotsverwaltung",
    description: "Angebote erstellen, versionieren und in Rechnungen umwandeln.",
    priority: "medium",
    soll_status: "planned",
  },
  {
    category: "Finanzen & Rechnungen",
    module_name: "FIN-04 Zahlungstracking",
    description: "Offen, teilweise bezahlt, bezahlt, überfällig – inkl. Übersicht.",
    priority: "medium",
    soll_status: "planned",
  },
  {
    category: "Finanzen & Rechnungen",
    module_name: "FIN-05 Export (CSV/PDF)",
    description: "Export von Rechnungs- und Finanzdaten (CSV/PDF) für Steuer/Buchhaltung.",
    priority: "medium",
    soll_status: "planned",
  },

  // =====================================================
  // 7. Öffentliche Website (WEB-01 bis WEB-05)
  // =====================================================
  {
    category: "Öffentliche Website",
    module_name: "WEB-01 Landingpage Lopez IT Welt",
    description: "Startseite mit USP, Kernleistungen und Call-to-Action.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Öffentliche Website",
    module_name: "WEB-02 Leistungsseiten",
    description: "Detailseiten für Leistungen wie Webentwicklung, KI, Systemintegration, Hardware.",
    priority: "medium",
    soll_status: "planned",
  },
  {
    category: "Öffentliche Website",
    module_name: "WEB-03 Referenzen & Projekte",
    description: "Optional: Case-Studies und Referenzen, später erweiterbar.",
    priority: "low",
    soll_status: "planned",
  },
  {
    category: "Öffentliche Website",
    module_name: "WEB-04 Kontaktseite mit Formular",
    description: "Kontaktformular mit DSGVO-Hinweis und Anbindung an SUP-02.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Öffentliche Website",
    module_name: "WEB-05 Rechtliche Seiten",
    description: "Impressum, Datenschutzerklärung, Cookie-/Hinweisbanner.",
    priority: "high",
    soll_status: "required",
  },

  // =====================================================
  // 8. Kundenportal & Shop (PORT-01 bis PORT-03, SHOP-01 bis SHOP-04)
  // =====================================================
  {
    category: "Kundenportal & Shop",
    module_name: "PORT-01 Kunden-Login & Registrierung",
    description: "Registrierung und Login für Kunden inkl. E-Mail-Bestätigung.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Kundenportal & Shop",
    module_name: "PORT-02 Kundenprofil",
    description: "Verwaltung von Unternehmensdaten, Ansprechpartnern und Adressen im Portal.",
    priority: "medium",
    soll_status: "planned",
  },
  {
    category: "Kundenportal & Shop",
    module_name: "PORT-03 Kunden-Dashboard",
    description: "Übersicht über Projekte, Rechnungen, Tickets und Angebote im Portal.",
    priority: "medium",
    soll_status: "planned",
  },
  {
    category: "Kundenportal & Shop",
    module_name: "SHOP-01 Produktverwaltung (Shop)",
    description: "Verwaltung der Shop-Produkte, Preise und Kategorien.",
    priority: "medium",
    soll_status: "planned",
  },
  {
    category: "Kundenportal & Shop",
    module_name: "SHOP-02 Warenkorb & Bestellprozess",
    description: "Auswahl von Produkten, Warenkorb, Checkout-Prozess.",
    priority: "medium",
    soll_status: "planned",
  },
  {
    category: "Kundenportal & Shop",
    module_name: "SHOP-03 Bestellhistorie & Status",
    description: "Übersicht vergangener Bestellungen inkl. Status.",
    priority: "low",
    soll_status: "planned",
  },
  {
    category: "Kundenportal & Shop",
    module_name: "SHOP-04 Zahlungsarten (Phase 2)",
    description: "Integration von Zahlungsarten (Rechnung, SEPA, Stripe/PayPal) in späterer Phase.",
    priority: "low",
    soll_status: "planned",
  },

  // =====================================================
  // 9. Server, Sicherheit & Betrieb (OPS-01 bis OPS-05)
  // =====================================================
  {
    category: "Server, Sicherheit & Betrieb",
    module_name: "OPS-01 Netcup Debian 12 Grundsetup",
    description: "Grundhärtung, Benutzer, SSH, Firewall, Basis-Security.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Server, Sicherheit & Betrieb",
    module_name: "OPS-02 Deployment-Pipeline",
    description: "Automatisierter oder halbautomatischer Deploy von lokal nach Netcup (Staging/Prod).",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Server, Sicherheit & Betrieb",
    module_name: "OPS-03 Monitoring & Health Checks",
    description: "Basic-Monitoring für Erreichbarkeit und Fehlerstatus der Dienste.",
    priority: "medium",
    soll_status: "planned",
  },
  {
    category: "Server, Sicherheit & Betrieb",
    module_name: "OPS-04 Backup & Restore",
    description: "Strategie und Umsetzung für DB- und Dateibackups inkl. Restore-Test.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Server, Sicherheit & Betrieb",
    module_name: "OPS-05 Logging & Fehler-Monitoring",
    description: "Zentrales Error-Logging und Auswertung (z. B. später Sentry o. ä.).",
    priority: "medium",
    soll_status: "planned",
  },

  // =====================================================
  // 10. Dokumentation & Compliance (DOC-01 bis DOC-05)
  // =====================================================
  {
    category: "Dokumentation & Compliance",
    module_name: "DOC-01 System-Dokumentation",
    description: "Technische Architektur, Komponenten, Schnittstellen, Datenmodell.",
    priority: "medium",
    soll_status: "planned",
  },
  {
    category: "Dokumentation & Compliance",
    module_name: "DOC-02 Admin-Handbuch",
    description: "Anleitung für Admins zur Nutzung von Kunden-, Projekt- und Rechnungsmodul.",
    priority: "medium",
    soll_status: "planned",
  },
  {
    category: "Dokumentation & Compliance",
    module_name: "DOC-03 Betriebsdokumentation",
    description: "Deploy-Anleitung, Backup-Konzept, Notfallplan, Server-Doku.",
    priority: "medium",
    soll_status: "planned",
  },
  {
    category: "Dokumentation & Compliance",
    module_name: "DOC-04 DSGVO-Dokumentation",
    description: "Verarbeitungsverzeichnis, Datenflüsse, TOMs, Auftragsverarbeitung.",
    priority: "high",
    soll_status: "required",
  },
  {
    category: "Dokumentation & Compliance",
    module_name: "DOC-05 Changelog & STATUS",
    description: "Pflege von docs/STATUS.md, docs/CHANGELOG.md inkl. Sync zur DB.",
    priority: "medium",
    soll_status: "required",
  },
];

// =====================================================
// ENTERPRISE++ RISIKO-KONFIGURATION (P0-P3, Abhängigkeiten, Go-Live)
// =====================================================

export const MODULE_RISK_CONFIG: Record<string, {
  priority_level: PriorityLevel;
  depends_on?: string[];
  go_live_required: boolean;
}> = {
  // ===== P0 - KRITISCH (Go-Live-blockierend) =====
  "ADM-02 Benutzerverwaltung": { priority_level: "P0", depends_on: [], go_live_required: true },
  "ADM-03 Rollen & Rechte (RBAC/ABAC)": { priority_level: "P0", depends_on: ["ADM-02 Benutzerverwaltung"], go_live_required: true },
  "ADM-04 2FA & Session-Management": { priority_level: "P0", depends_on: ["ADM-02 Benutzerverwaltung", "ADM-03 Rollen & Rechte (RBAC/ABAC)"], go_live_required: true },
  "ADM-05 Audit-Logs": { priority_level: "P0", depends_on: ["ADM-02 Benutzerverwaltung"], go_live_required: true },
  "ADM-07 Modul-Registry (SOLL/IST)": { priority_level: "P0", depends_on: [], go_live_required: true },
  "OPS-01 Netcup Debian 12 Grundsetup": { priority_level: "P0", depends_on: [], go_live_required: true },
  "OPS-04 Backup & Restore": { priority_level: "P0", depends_on: ["OPS-01 Netcup Debian 12 Grundsetup"], go_live_required: true },
  "DOC-04 DSGVO-Dokumentation": { priority_level: "P0", depends_on: [], go_live_required: true },
  "WEB-05 Rechtliche Seiten": { priority_level: "P0", depends_on: ["WEB-01 Landingpage Lopez IT Welt"], go_live_required: true },
  "FIN-01 Rechnungsmodul Basis": { priority_level: "P0", depends_on: ["KP-01 Kundenliste"], go_live_required: true },

  // ===== P1 - WICHTIG (Go-Live Kernfunktion) =====
  "ADM-01 Admin-Dashboard": { priority_level: "P1", depends_on: [], go_live_required: true },
  "ADM-06 Dynamic Settings": { priority_level: "P1", depends_on: [], go_live_required: true },
  "KP-01 Kundenliste": { priority_level: "P1", depends_on: [], go_live_required: true },
  "KP-02 Kundenstammdaten": { priority_level: "P1", depends_on: ["KP-01 Kundenliste"], go_live_required: true },
  "KP-03 Projekte pro Kunde": { priority_level: "P1", depends_on: ["KP-01 Kundenliste"], go_live_required: true },
  "KP-04 Projekt-Fortschritts-Tracking": { priority_level: "P1", depends_on: ["KP-03 Projekte pro Kunde"], go_live_required: true },
  "MED-01 Medienbibliothek": { priority_level: "P1", depends_on: [], go_live_required: true },
  "MED-02 Sicherer Dateispeicher": { priority_level: "P1", depends_on: ["MED-01 Medienbibliothek"], go_live_required: true },
  "MED-03 Media-KI Analyse": { priority_level: "P1", depends_on: ["MED-01 Medienbibliothek", "MED-02 Sicherer Dateispeicher"], go_live_required: true },
  "MED-04 Meta-Daten-Verwaltung": { priority_level: "P1", depends_on: ["MED-01 Medienbibliothek"], go_live_required: true },
  "AI-02 Project Analyzer": { priority_level: "P1", depends_on: ["ADM-07 Modul-Registry (SOLL/IST)", "KP-03 Projekte pro Kunde"], go_live_required: true },
  "AI-05 AI Cost & Provider Control": { priority_level: "P1", depends_on: [], go_live_required: true },
  "WEB-01 Landingpage Lopez IT Welt": { priority_level: "P1", depends_on: [], go_live_required: true },
  "WEB-04 Kontaktseite mit Formular": { priority_level: "P1", depends_on: ["WEB-01 Landingpage Lopez IT Welt", "SUP-02 Kontakt-Nachrichten"], go_live_required: true },
  "PORT-01 Kunden-Login & Registrierung": { priority_level: "P1", depends_on: ["ADM-02 Benutzerverwaltung"], go_live_required: true },
  "OPS-02 Deployment-Pipeline": { priority_level: "P1", depends_on: ["OPS-01 Netcup Debian 12 Grundsetup"], go_live_required: true },
  "OPS-03 Monitoring & Health Checks": { priority_level: "P1", depends_on: ["OPS-01 Netcup Debian 12 Grundsetup"], go_live_required: true },
  "OPS-05 Logging & Fehler-Monitoring": { priority_level: "P1", depends_on: ["OPS-01 Netcup Debian 12 Grundsetup"], go_live_required: true },
  "DOC-01 System-Dokumentation": { priority_level: "P1", depends_on: [], go_live_required: true },
  "DOC-03 Betriebsdokumentation": { priority_level: "P1", depends_on: [], go_live_required: true },
  "DOC-05 Changelog & STATUS": { priority_level: "P1", depends_on: [], go_live_required: true },
  "SUP-02 Kontakt-Nachrichten": { priority_level: "P1", depends_on: [], go_live_required: true },

  // ===== P2 - NICE-TO-HAVE (kurzfristig nach Go-Live) =====
  "SUP-01 Support-Tickets": { priority_level: "P2", depends_on: ["KP-01 Kundenliste"], go_live_required: false },
  "SUP-03 E-Mail-Templates": { priority_level: "P2", depends_on: [], go_live_required: false },
  "SUP-04 Benachrichtigungssystem (Admin)": { priority_level: "P2", depends_on: [], go_live_required: false },
  "KP-05 Projekt-Notizen & Dateien": { priority_level: "P2", depends_on: ["KP-03 Projekte pro Kunde"], go_live_required: false },
  "AI-01 Customer Insights": { priority_level: "P2", depends_on: ["KP-01 Kundenliste"], go_live_required: false },
  "AI-03 Invoice Assistant": { priority_level: "P2", depends_on: ["FIN-01 Rechnungsmodul Basis"], go_live_required: false },
  "AI-04 Executive Reports": { priority_level: "P2", depends_on: [], go_live_required: false },
  "FIN-02 Produkt- und Dienstleistungskatalog": { priority_level: "P2", depends_on: [], go_live_required: false },
  "FIN-03 Angebotsverwaltung": { priority_level: "P2", depends_on: ["FIN-02 Produkt- und Dienstleistungskatalog"], go_live_required: false },
  "FIN-04 Zahlungstracking": { priority_level: "P2", depends_on: ["FIN-01 Rechnungsmodul Basis"], go_live_required: false },
  "FIN-05 Export (CSV/PDF)": { priority_level: "P2", depends_on: ["FIN-01 Rechnungsmodul Basis"], go_live_required: false },
  "WEB-02 Leistungsseiten": { priority_level: "P2", depends_on: ["WEB-01 Landingpage Lopez IT Welt"], go_live_required: false },
  "PORT-02 Kundenprofil": { priority_level: "P2", depends_on: ["PORT-01 Kunden-Login & Registrierung"], go_live_required: false },
  "PORT-03 Kunden-Dashboard": { priority_level: "P2", depends_on: ["PORT-01 Kunden-Login & Registrierung"], go_live_required: false },
  "SHOP-01 Produktverwaltung (Shop)": { priority_level: "P2", depends_on: ["FIN-02 Produkt- und Dienstleistungskatalog"], go_live_required: false },
  "SHOP-02 Warenkorb & Bestellprozess": { priority_level: "P2", depends_on: ["SHOP-01 Produktverwaltung (Shop)"], go_live_required: false },
  "SHOP-03 Bestellhistorie & Status": { priority_level: "P2", depends_on: ["SHOP-02 Warenkorb & Bestellprozess"], go_live_required: false },
  "MED-05 Medien-Zuordnung": { priority_level: "P2", depends_on: ["MED-01 Medienbibliothek"], go_live_required: false },
  "DOC-02 Admin-Handbuch": { priority_level: "P2", depends_on: [], go_live_required: false },

  // ===== P3 - SPÄTERE OPTIMIERUNGEN =====
  "WEB-03 Referenzen & Projekte": { priority_level: "P3", depends_on: ["WEB-01 Landingpage Lopez IT Welt"], go_live_required: false },
  "SHOP-04 Zahlungsarten (Phase 2)": { priority_level: "P3", depends_on: ["SHOP-02 Warenkorb & Bestellprozess"], go_live_required: false },
};

// =====================================================
// IST-FORTSCHRITTE (Reale Werte Stand 2025-12-02)
// =====================================================

export const IST_PROGRESS_VALUES: Record<string, number> = {
  // Admin & Core Platform
  "ADM-01 Admin-Dashboard": 80,
  "ADM-02 Benutzerverwaltung": 60,
  "ADM-03 Rollen & Rechte (RBAC/ABAC)": 70,
  "ADM-04 2FA & Session-Management": 90,
  "ADM-05 Audit-Logs": 80,
  "ADM-06 Dynamic Settings": 50,
  "ADM-07 Modul-Registry (SOLL/IST)": 100,

  // Inhalte & Medien
  "MED-01 Medienbibliothek": 70,
  "MED-02 Sicherer Dateispeicher": 90,
  "MED-03 Media-KI Analyse": 85,
  "MED-04 Meta-Daten-Verwaltung": 70,
  "MED-05 Medien-Zuordnung": 0,

  // AI Center
  "AI-01 Customer Insights": 0,
  "AI-02 Project Analyzer": 30,
  "AI-03 Invoice Assistant": 0,
  "AI-04 Executive Reports": 10,
  "AI-05 AI Cost & Provider Control": 60,

  // Kunden & Projekte
  "KP-01 Kundenliste": 80,
  "KP-02 Kundenstammdaten": 70,
  "KP-03 Projekte pro Kunde": 80,
  "KP-04 Projekt-Fortschritts-Tracking": 30,
  "KP-05 Projekt-Notizen & Dateien": 0,

  // Support & Kommunikation
  "SUP-01 Support-Tickets": 30,
  "SUP-02 Kontakt-Nachrichten": 90,
  "SUP-03 E-Mail-Templates": 0,
  "SUP-04 Benachrichtigungssystem (Admin)": 20,

  // Finanzen & Rechnungen
  "FIN-01 Rechnungsmodul Basis": 85,
  "FIN-02 Produkt- und Dienstleistungskatalog": 0,
  "FIN-03 Angebotsverwaltung": 0,
  "FIN-04 Zahlungstracking": 0,
  "FIN-05 Export (CSV/PDF)": 0,

  // Öffentliche Website
  "WEB-01 Landingpage Lopez IT Welt": 0,
  "WEB-02 Leistungsseiten": 0,
  "WEB-03 Referenzen & Projekte": 0,
  "WEB-04 Kontaktseite mit Formular": 0,
  "WEB-05 Rechtliche Seiten": 0,

  // Kundenportal & Shop
  "PORT-01 Kunden-Login & Registrierung": 0,
  "PORT-02 Kundenprofil": 0,
  "PORT-03 Kunden-Dashboard": 0,
  "SHOP-01 Produktverwaltung (Shop)": 0,
  "SHOP-02 Warenkorb & Bestellprozess": 0,
  "SHOP-03 Bestellhistorie & Status": 0,
  "SHOP-04 Zahlungsarten (Phase 2)": 0,

  // Server, Sicherheit & Betrieb
  "OPS-01 Netcup Debian 12 Grundsetup": 0,
  "OPS-02 Deployment-Pipeline": 0,
  "OPS-03 Monitoring & Health Checks": 0,
  "OPS-04 Backup & Restore": 0,
  "OPS-05 Logging & Fehler-Monitoring": 0,

  // Dokumentation & Compliance
  "DOC-01 System-Dokumentation": 0,
  "DOC-02 Admin-Handbuch": 0,
  "DOC-03 Betriebsdokumentation": 0,
  "DOC-04 DSGVO-Dokumentation": 0,
  "DOC-05 Changelog & STATUS": 0,
};

// =====================================================
// AGENT-SYSTEM SERVICE
// =====================================================

export class AgentSystemService {
  
  /**
   * Initialisiert alle Agent-System Tabellen
   */
  static async initializeTables(): Promise<{
    tablesCreated: string[];
    modulesInserted: number;
  }> {
    const pool = await getConnection();
    const tablesCreated: string[] = [];

    // =====================================================
    // TABLE 1: module_registry (SOLL-Zustand)
    // =====================================================
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS module_registry (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        module_name VARCHAR(255) NOT NULL,
        description TEXT,
        priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
        soll_status ENUM('open', 'planned', 'required') DEFAULT 'open',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uk_module_name (module_name),
        INDEX idx_category (category),
        INDEX idx_priority (priority),
        INDEX idx_soll_status (soll_status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    tablesCreated.push("module_registry");
    console.log("✅ Tabelle module_registry erstellt");

    // =====================================================
    // TABLE 2: module_progress (IST-Zustand)
    // =====================================================
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS module_progress (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        module_id BIGINT NOT NULL,
        ist_status ENUM('open', 'in_progress', 'done') DEFAULT 'open',
        progress_percent INT UNSIGNED DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
        comment TEXT,
        responsible_agent ENUM('plan', 'build', 'run') DEFAULT 'plan',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (module_id) REFERENCES module_registry(id) ON DELETE CASCADE,
        UNIQUE KEY uk_module_progress (module_id),
        INDEX idx_ist_status (ist_status),
        INDEX idx_responsible_agent (responsible_agent)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    tablesCreated.push("module_progress");
    console.log("✅ Tabelle module_progress erstellt (PLAN/BUILD/RUN)");

    // =====================================================
    // TABLE 3: agent_tasks (Aufgaben)
    // =====================================================
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS agent_tasks (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        assigned_agent ENUM('plan', 'build', 'run') NOT NULL,
        status ENUM('open', 'in_progress', 'done') DEFAULT 'open',
        related_module_id BIGINT NULL,
        priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (related_module_id) REFERENCES module_registry(id) ON DELETE SET NULL,
        INDEX idx_assigned_agent (assigned_agent),
        INDEX idx_status (status),
        INDEX idx_priority (priority),
        INDEX idx_related_module (related_module_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    tablesCreated.push("agent_tasks");
    console.log("✅ Tabelle agent_tasks erstellt");

    // =====================================================
    // SOLL-Module UPSERT (Insert oder Update)
    // Enterprise++: module_code aus module_name parsen
    // Format: "ADM-01 Admin-Dashboard" → code="ADM-01", name="Admin-Dashboard"
    // =====================================================
    let modulesInserted = 0;
    let modulesUpdated = 0;

    for (const module of SOLL_MODULE_LIST) {
      try {
        // Enterprise++: module_code und module_name aus dem kombinierten Namen parsen
        const fullName = module.module_name;
        const spaceIndex = fullName.indexOf(" ");
        const moduleCode = spaceIndex > 0 ? fullName.substring(0, spaceIndex) : fullName;
        const moduleName = spaceIndex > 0 ? fullName.substring(spaceIndex + 1) : fullName;

        // Prüfe ob Modul bereits existiert (per module_code für Eindeutigkeit)
        const [existing] = await pool.execute(
          "SELECT id FROM module_registry WHERE module_code = ?",
          [moduleCode]
        );

        if ((existing as any[]).length === 0) {
          // NEU: Modul einfügen mit module_code
          const [result] = await pool.execute(
            `INSERT INTO module_registry 
             (module_code, module_name, category, description, priority, soll_status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              moduleCode,
              moduleName,
              module.category,
              module.description,
              module.priority,
              module.soll_status,
            ]
          );

          const moduleId = (result as any).insertId;

          // IST-Zustand initial anlegen (open, 0%) - Start bei PLAN
          await pool.execute(
            `INSERT INTO module_progress 
             (module_id, ist_status, progress_percent, comment, responsible_agent)
             VALUES (?, 'open', 0, 'Noch nicht gestartet', 'plan')
             ON DUPLICATE KEY UPDATE updated_at = NOW()`,
            [moduleId]
          );

          modulesInserted++;
          console.log(`✅ NEU: [${moduleCode}] "${moduleName}"`);
        } else {
          // UPDATE: Nur SOLL-Daten aktualisieren (module_name, category, description, priority, soll_status)
          // NICHT: IST-Status, Fortschritt, Agent-Zuordnung
          await pool.execute(
            `UPDATE module_registry 
             SET module_name = ?, category = ?, description = ?, priority = ?, soll_status = ?, updated_at = NOW()
             WHERE module_code = ?`,
            [
              moduleName,
              module.category,
              module.description,
              module.priority,
              module.soll_status,
              moduleCode,
            ]
          );
          modulesUpdated++;
          console.log(`🔄 UPDATE: [${moduleCode}] "${moduleName}"`);
        }
      } catch (error) {
        console.warn(`⚠️ Modul "${module.module_name}" Fehler:`, error);
      }
    }

    console.log(`📋 SOLL-Module: ${modulesInserted} neu, ${modulesUpdated} aktualisiert`);

    // =====================================================
    // MIGRATION: agent_a/b/c → plan/build/run
    // =====================================================
    let migrated = 0;
    try {
      // Prüfe ob alte ENUM-Werte existieren
      const [oldProgress] = await pool.execute(
        "SELECT COUNT(*) as count FROM module_progress WHERE responsible_agent IN ('agent_a', 'agent_b', 'agent_c')"
      );
      const oldProgressCount = (oldProgress as any[])[0]?.count || 0;

      if (oldProgressCount > 0) {
        // Migration durchführen
        await pool.execute("UPDATE module_progress SET responsible_agent = 'plan' WHERE responsible_agent = 'agent_a'");
        await pool.execute("UPDATE module_progress SET responsible_agent = 'build' WHERE responsible_agent = 'agent_b'");
        await pool.execute("UPDATE module_progress SET responsible_agent = 'run' WHERE responsible_agent = 'agent_c'");
        migrated += oldProgressCount;
        console.log(`✅ ${oldProgressCount} module_progress Einträge migriert`);
      }

      const [oldTasks] = await pool.execute(
        "SELECT COUNT(*) as count FROM agent_tasks WHERE assigned_agent IN ('agent_a', 'agent_b', 'agent_c')"
      );
      const oldTasksCount = (oldTasks as any[])[0]?.count || 0;

      if (oldTasksCount > 0) {
        await pool.execute("UPDATE agent_tasks SET assigned_agent = 'plan' WHERE assigned_agent = 'agent_a'");
        await pool.execute("UPDATE agent_tasks SET assigned_agent = 'build' WHERE assigned_agent = 'agent_b'");
        await pool.execute("UPDATE agent_tasks SET assigned_agent = 'run' WHERE assigned_agent = 'agent_c'");
        migrated += oldTasksCount;
        console.log(`✅ ${oldTasksCount} agent_tasks Einträge migriert`);
      }
    } catch (migrationError) {
      console.log("ℹ️ Keine Migration nötig (neue Struktur bereits aktiv)");
    }

    const totalModules = modulesInserted + modulesUpdated;
    console.log(`✅ Enterprise++ Module Registry seeding completed: ${totalModules} modules upserted.`);
    console.log(`   → ${modulesInserted} neu eingefügt, ${modulesUpdated} aktualisiert, ${migrated} Agent-Zuordnungen migriert`);

    return { tablesCreated, modulesInserted, modulesUpdated, migrated, totalModules };
  }

  /**
   * Setzt die realen IST-Fortschritte für alle Module (UPSERT)
   * Enterprise++: Sucht per module_code (extrahiert aus dem Key)
   */
  static async seedModuleProgress(): Promise<{
    updated: number;
    inserted: number;
    skipped: number;
  }> {
    const pool = await getConnection();
    let updated = 0;
    let inserted = 0;
    let skipped = 0;

    for (const [moduleName, progress] of Object.entries(IST_PROGRESS_VALUES)) {
      try {
        // Enterprise++: module_code aus dem Key extrahieren (Format: "ADM-01 Admin-Dashboard")
        const spaceIndex = moduleName.indexOf(" ");
        const moduleCode = spaceIndex > 0 ? moduleName.substring(0, spaceIndex) : moduleName;

        // Finde die module_id per module_code
        const [moduleRows] = await pool.execute(
          "SELECT id FROM module_registry WHERE module_code = ?",
          [moduleCode]
        );

        if ((moduleRows as any[]).length === 0) {
          console.warn(`⚠️ Modul nicht gefunden: [${moduleCode}] "${moduleName}"`);
          skipped++;
          continue;
        }

        const moduleId = (moduleRows as any[])[0].id;

        // Prüfe ob module_progress Eintrag existiert
        const [progressRows] = await pool.execute(
          "SELECT id FROM module_progress WHERE module_id = ?",
          [moduleId]
        );

        // Bestimme ist_status basierend auf progress
        let istStatus: IstStatus = "open";
        if (progress >= 100) {
          istStatus = "done";
        } else if (progress > 0) {
          istStatus = "in_progress";
        }

        // Bestimme Agent basierend auf Fortschritt (PLAN → BUILD → RUN)
        let agent: AgentType = "plan";
        if (progress >= 80) {
          agent = "run"; // QA/Betrieb Phase
        } else if (progress >= 30) {
          agent = "build"; // Entwicklung Phase
        }

        if ((progressRows as any[]).length === 0) {
          // INSERT neuen Eintrag
          await pool.execute(
            `INSERT INTO module_progress 
             (module_id, ist_status, progress_percent, comment, responsible_agent, updated_at)
             VALUES (?, ?, ?, ?, ?, NOW())`,
            [
              moduleId,
              istStatus,
              progress,
              progress === 0 ? "Noch nicht gestartet" : `IST-Stand: ${progress}%`,
              agent,
            ]
          );
          inserted++;
          console.log(`📥 INSERT: "${moduleName}" → ${progress}% (${agent})`);
        } else {
          // UPDATE existierenden Eintrag
          await pool.execute(
            `UPDATE module_progress 
             SET ist_status = ?, progress_percent = ?, 
                 comment = ?, responsible_agent = ?, updated_at = NOW()
             WHERE module_id = ?`,
            [
              istStatus,
              progress,
              progress === 0 ? "Noch nicht gestartet" : `IST-Stand: ${progress}%`,
              agent,
              moduleId,
            ]
          );
          updated++;
          console.log(`🔄 UPDATE: "${moduleName}" → ${progress}% (${agent})`);
        }
      } catch (error) {
        console.error(`❌ Fehler bei "${moduleName}":`, error);
        skipped++;
      }
    }

    console.log(`✅ IST-Fortschritte gesetzt: ${updated} aktualisiert, ${inserted} neu, ${skipped} übersprungen`);
    return { updated, inserted, skipped };
  }

  /**
   * Erweitert module_registry um Enterprise++ Risiko-Felder
   */
  static async extendModuleRegistrySchema(): Promise<boolean> {
    const pool = await getConnection();

    try {
      // Prüfe ob Spalten bereits existieren
      const [columns] = await pool.execute(
        "SHOW COLUMNS FROM module_registry LIKE 'priority_level'"
      );

      if ((columns as any[]).length === 0) {
        // Spalten hinzufügen
        await pool.execute(`
          ALTER TABLE module_registry 
          ADD COLUMN priority_level ENUM('P0','P1','P2','P3') DEFAULT 'P2' AFTER priority,
          ADD COLUMN maturity_level ENUM('M0','M1','M2','M3','M4','M5') DEFAULT 'M0' AFTER priority_level,
          ADD COLUMN risk_level ENUM('critical','high','medium','low') DEFAULT 'medium' AFTER maturity_level,
          ADD COLUMN depends_on JSON NULL AFTER risk_level,
          ADD COLUMN go_live_required BOOLEAN DEFAULT FALSE AFTER depends_on
        `);
        console.log("✅ module_registry erweitert (priority_level, maturity_level, risk_level, depends_on, go_live_required)");
      } else {
        console.log("ℹ️ module_registry bereits erweitert");
      }

      return true;
    } catch (error) {
      console.error("❌ Fehler beim Erweitern von module_registry:", error);
      return false;
    }
  }

  /**
   * Berechnet Maturity Level aus Progress Percent
   */
  static calculateMaturityLevel(progressPercent: number): MaturityLevel {
    if (progressPercent === 0) return "M0";
    if (progressPercent <= 10) return "M1";
    if (progressPercent <= 30) return "M2";
    if (progressPercent <= 60) return "M3";
    if (progressPercent <= 90) return "M4";
    return "M5";
  }

  /**
   * Berechnet Risk Level aus Priority + Maturity
   */
  static calculateRiskLevel(priorityLevel: PriorityLevel, maturityLevel: MaturityLevel): RiskLevel {
    const maturityValue = parseInt(maturityLevel.substring(1)); // M0 -> 0, M5 -> 5
    const priorityValue = parseInt(priorityLevel.substring(1)); // P0 -> 0, P3 -> 3

    // Critical: P0 und M0-M2
    if (priorityValue === 0 && maturityValue <= 2) return "critical";

    // High: (P0 und M3) oder (P1 und M0-M2)
    if ((priorityValue === 0 && maturityValue === 3) || 
        (priorityValue === 1 && maturityValue <= 2)) return "high";

    // Medium: (P1 und M3-M4) oder (P2 und M1-M3)
    if ((priorityValue === 1 && maturityValue >= 3 && maturityValue <= 4) ||
        (priorityValue === 2 && maturityValue >= 1 && maturityValue <= 3)) return "medium";

    // Low: M5 oder (P2/P3 und M4-M5)
    return "low";
  }

  /**
   * Setzt Prioritäten, Reifegrade und Risiken für alle Module
   * ENTERPRISE++: Fehlertolerant - einzelne Update-Fehler werden geloggt, nicht geworfen
   */
  static async seedRiskData(): Promise<{
    updated: number;
    failed: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    warnings: string[];
  }> {
    const pool = await getConnection();
    const warnings: string[] = [];

    // Schema erweitern falls nötig (fehlertolerant)
    try {
      await this.extendModuleRegistrySchema();
    } catch (schemaError) {
      agentLogger.warn("Schema-Erweiterung in seedRiskData fehlgeschlagen", { error: schemaError });
      warnings.push("Schema konnte nicht erweitert werden, verwende bestehende Struktur.");
    }

    let updated = 0;
    let failed = 0;
    let criticalCount = 0;
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;

    // Hole alle Module mit Fortschritt
    let modules: any[] = [];
    try {
      const [rows] = await pool.execute(`
        SELECT 
          mr.id, mr.module_name,
          COALESCE(mp.progress_percent, 0) as progress_percent
        FROM module_registry mr
        LEFT JOIN module_progress mp ON mr.id = mp.module_id
      `);
      modules = rows as any[];
    } catch (fetchError) {
      agentLogger.error("Fehler beim Abrufen der Module fuer Risiko-Seed", fetchError);
      return { updated: 0, failed: 0, criticalCount: 0, highCount: 0, mediumCount: 0, lowCount: 0, warnings: ["Module konnten nicht geladen werden."] };
    }

    for (const mod of modules) {
      const moduleName = mod.module_name;
      const progressPercent = mod.progress_percent || 0;

      // Risiko-Konfiguration holen oder Default
      const config = MODULE_RISK_CONFIG[moduleName] || {
        priority_level: "P2" as PriorityLevel,
        depends_on: [],
        go_live_required: false,
      };

      // Maturity berechnen
      let maturityLevel = this.calculateMaturityLevel(progressPercent);
      
      // Spezialfaelle
      if (moduleName === "ADM-07 Modul-Registry (SOLL/IST)" && progressPercent >= 90) {
        maturityLevel = "M5";
      }
      if (moduleName === "FIN-01 Rechnungsmodul Basis" && progressPercent >= 80) {
        maturityLevel = "M4";
      }

      // Risk berechnen
      const riskLevel = this.calculateRiskLevel(config.priority_level, maturityLevel);

      // Zaehler aktualisieren (auch bei fehlgeschlagenem Update, da Berechnung korrekt ist)
      switch (riskLevel) {
        case "critical": criticalCount++; break;
        case "high": highCount++; break;
        case "medium": mediumCount++; break;
        case "low": lowCount++; break;
      }

      // Update durchfuehren (fehlertolerant)
      try {
        await pool.execute(
          `UPDATE module_registry SET
            priority_level = ?,
            maturity_level = ?,
            risk_level = ?,
            depends_on = ?,
            go_live_required = ?
          WHERE id = ?`,
          [
            config.priority_level,
            maturityLevel,
            riskLevel,
            config.depends_on ? JSON.stringify(config.depends_on) : null,
            config.go_live_required,
            mod.id,
          ]
        );
        updated++;
      } catch (updateError) {
        failed++;
        agentLogger.warn(`Fehler beim Aktualisieren von Modul ${moduleName}`, { moduleId: mod.id, error: updateError });
      }
    }

    if (failed > 0) {
      warnings.push(`${failed} Module konnten nicht aktualisiert werden.`);
    }

    agentLogger.info(`Risiko-Seed abgeschlossen: ${updated}/${modules.length} Module aktualisiert`, {
      critical: criticalCount, high: highCount, medium: mediumCount, low: lowCount, failed
    });

    return { updated, failed, criticalCount, highCount, mediumCount, lowCount, warnings };
  }

  /**
   * Go-Live-Readiness-Check
   * ENTERPRISE++: Fehlertolerant bei fehlenden module_progress Eintraegen
   */
  static async evaluateGoLiveReadiness(): Promise<{
    go_live_ready: boolean;
    required_modules_total: number;
    blocking_modules: Array<{
      module_name: string;
      priority_level: PriorityLevel;
      maturity_level: MaturityLevel;
      risk_level: RiskLevel;
      progress_percent: number;
      has_progress_entry: boolean;
    }>;
    blocking_count: number;
    summary: string;
    stats: {
      P0_total: number;
      P0_ready: number;
      P0_blocking: number;
      P1_total: number;
      P1_ready: number;
      P1_blocking: number;
    };
    category_readiness: Record<string, { total: number; ready: number; blocking: number }>;
    warnings: string[];
  }> {
    const pool = await getConnection();
    const warnings: string[] = [];
    let modulesWithoutProgress = 0;

    // Hole alle Go-Live-Required Module (LEFT JOIN fuer Fehlertoleranz)
    const [modules] = await pool.execute(`
      SELECT 
        mr.id, mr.module_name, mr.category, 
        COALESCE(mr.priority_level, 'P2') as priority_level, 
        COALESCE(mr.maturity_level, 'M0') as maturity_level, 
        COALESCE(mr.risk_level, 'medium') as risk_level,
        COALESCE(mp.progress_percent, 0) as progress_percent,
        CASE WHEN mp.id IS NOT NULL THEN 1 ELSE 0 END as has_progress_entry
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
      WHERE mr.go_live_required = TRUE OR mr.go_live_required = 1
      ORDER BY mr.priority_level, mr.category, mr.module_name
    `);

    const moduleList = modules as any[];
    const requiredTotal = moduleList.length;

    agentLogger.debug(`Go-Live-Check: ${requiredTotal} erforderliche Module gefunden`);

    const blockingModules: Array<{
      module_name: string;
      priority_level: PriorityLevel;
      maturity_level: MaturityLevel;
      risk_level: RiskLevel;
      progress_percent: number;
      has_progress_entry: boolean;
    }> = [];
    const stats = {
      P0_total: 0, P0_ready: 0, P0_blocking: 0,
      P1_total: 0, P1_ready: 0, P1_blocking: 0,
    };
    const categoryReadiness: Record<string, { total: number; ready: number; blocking: number }> = {};

    for (const mod of moduleList) {
      // Sichere Defaults fuer NULL-Werte
      const maturityLevel = (mod.maturity_level || "M0") as MaturityLevel;
      const priorityLevel = (mod.priority_level || "P2") as PriorityLevel;
      const riskLevel = (mod.risk_level || "medium") as RiskLevel;
      const progressPercent = mod.progress_percent ?? 0;
      const hasProgressEntry = Boolean(mod.has_progress_entry);
      const category = mod.category || "Uncategorized";

      // Tracke Module ohne progress-Eintrag
      if (!hasProgressEntry) {
        modulesWithoutProgress++;
      }

      const maturityValue = parseInt(maturityLevel.substring(1));
      const isBlocking = maturityValue <= 2 || riskLevel === "critical";

      // Stats nach Priority
      if (priorityLevel === "P0") {
        stats.P0_total++;
        if (isBlocking) stats.P0_blocking++; else stats.P0_ready++;
      } else if (priorityLevel === "P1") {
        stats.P1_total++;
        if (isBlocking) stats.P1_blocking++; else stats.P1_ready++;
      }

      // Stats nach Kategorie
      if (!categoryReadiness[category]) {
        categoryReadiness[category] = { total: 0, ready: 0, blocking: 0 };
      }
      categoryReadiness[category].total++;
      if (isBlocking) {
        categoryReadiness[category].blocking++;
        blockingModules.push({
          module_name: mod.module_name,
          priority_level: priorityLevel,
          maturity_level: maturityLevel,
          risk_level: riskLevel,
          progress_percent: progressPercent,
          has_progress_entry: hasProgressEntry,
        });
      } else {
        categoryReadiness[category].ready++;
      }
    }

    // Warnung wenn Module ohne progress-Eintrag existieren
    if (modulesWithoutProgress > 0) {
      warnings.push(`${modulesWithoutProgress} Module haben keinen Fortschrittseintrag und wurden als open/M0 gewertet.`);
      agentLogger.debug(`Go-Live-Check: ${modulesWithoutProgress} Module ohne progress-Eintrag`);
    }

    const goLiveReady = blockingModules.length === 0;

    // Summary generieren
    let summary = "";
    if (goLiveReady) {
      summary = `✅ GO-LIVE BEREIT! Alle ${requiredTotal} erforderlichen Module haben mindestens Reifegrad M3.`;
    } else {
      const criticalBlockers = blockingModules.filter(m => m.risk_level === "critical").length;
      summary = `⛔ GO-LIVE NICHT BEREIT. ${blockingModules.length} von ${requiredTotal} Modulen blockieren.`;
      if (criticalBlockers > 0) {
        summary += ` Davon ${criticalBlockers} KRITISCH.`;
      }
      if (stats.P0_blocking > 0) {
        summary += ` ${stats.P0_blocking} P0-Module nicht bereit.`;
      }
    }

    agentLogger.debug(`Go-Live-Check abgeschlossen: ${goLiveReady ? "BEREIT" : "BLOCKIERT"}`, {
      required: requiredTotal, blocking: blockingModules.length, warnings: warnings.length
    });

    return {
      go_live_ready: goLiveReady,
      required_modules_total: requiredTotal,
      blocking_modules: blockingModules.slice(0, 20), // Top 20 Blocker
      blocking_count: blockingModules.length,
      summary,
      stats,
      category_readiness: categoryReadiness,
      warnings,
    };
  }

  /**
   * Holt Risiko-Statistiken fuer Dashboard
   * ENTERPRISE++: Fehlertolerant bei DB-Problemen
   */
  static async getRiskStatistics(): Promise<{
    total: number;
    byRisk: Record<RiskLevel, number>;
    byPriority: Record<PriorityLevel, number>;
    byCategory: Record<string, {
      total: number;
      avgMaturity: number;
      maxRisk: RiskLevel;
      criticalCount: number;
    }>;
    goLiveRequired: number;
    goLiveReady: number;
  }> {
    const pool = await getConnection();

    // Gesamt und nach Risiko
    const [riskStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN risk_level = 'critical' THEN 1 ELSE 0 END) as critical_count,
        SUM(CASE WHEN risk_level = 'high' THEN 1 ELSE 0 END) as high_count,
        SUM(CASE WHEN risk_level = 'medium' THEN 1 ELSE 0 END) as medium_count,
        SUM(CASE WHEN risk_level = 'low' THEN 1 ELSE 0 END) as low_count,
        SUM(CASE WHEN priority_level = 'P0' THEN 1 ELSE 0 END) as p0_count,
        SUM(CASE WHEN priority_level = 'P1' THEN 1 ELSE 0 END) as p1_count,
        SUM(CASE WHEN priority_level = 'P2' THEN 1 ELSE 0 END) as p2_count,
        SUM(CASE WHEN priority_level = 'P3' THEN 1 ELSE 0 END) as p3_count,
        SUM(CASE WHEN go_live_required = TRUE THEN 1 ELSE 0 END) as go_live_required,
        SUM(CASE WHEN go_live_required = TRUE AND maturity_level IN ('M3','M4','M5') AND risk_level != 'critical' THEN 1 ELSE 0 END) as go_live_ready
      FROM module_registry
    `);

    const stats = (riskStats as any[])[0];

    // Nach Kategorie
    const [categoryStats] = await pool.execute(`
      SELECT 
        category,
        COUNT(*) as total,
        AVG(CAST(SUBSTRING(maturity_level, 2) AS UNSIGNED)) as avg_maturity,
        MAX(CASE risk_level 
          WHEN 'critical' THEN 4 
          WHEN 'high' THEN 3 
          WHEN 'medium' THEN 2 
          ELSE 1 
        END) as max_risk_value,
        SUM(CASE WHEN risk_level = 'critical' THEN 1 ELSE 0 END) as critical_count
      FROM module_registry
      GROUP BY category
    `);

    const byCategory: Record<string, any> = {};
    for (const cat of categoryStats as any[]) {
      const maxRiskMap: Record<number, RiskLevel> = { 4: "critical", 3: "high", 2: "medium", 1: "low" };
      byCategory[cat.category] = {
        total: cat.total,
        avgMaturity: Math.round(cat.avg_maturity * 10) / 10,
        maxRisk: maxRiskMap[cat.max_risk_value] || "medium",
        criticalCount: cat.critical_count,
      };
    }

    return {
      total: stats.total || 0,
      byRisk: {
        critical: stats.critical_count || 0,
        high: stats.high_count || 0,
        medium: stats.medium_count || 0,
        low: stats.low_count || 0,
      },
      byPriority: {
        P0: stats.p0_count || 0,
        P1: stats.p1_count || 0,
        P2: stats.p2_count || 0,
        P3: stats.p3_count || 0,
      },
      byCategory,
      goLiveRequired: stats.go_live_required || 0,
      goLiveReady: stats.go_live_ready || 0,
    };
  }

  /**
   * Enterprise++ Projektanalyse: Berechnet Gesamtfortschritt aus allen Modulen
   */
  static async analyzeProjectProgress(projectName: string = "Lopez IT Welt – Enterprise++ Operations System 2025"): Promise<{
    project: string;
    projectId: number | null;
    overall_progress: number;
    categories: Record<string, number>;
    doneCount: number;
    inProgressCount: number;
    openCount: number;
    highRiskCount: number;
    totalModules: number;
    statusText: string;
    snapshotId?: number;
  }> {
    const pool = await getConnection();

    // =====================================================
    // 1. Hole alle Module mit Fortschritt
    // =====================================================
    const [modules] = await pool.execute(`
      SELECT 
        mr.id,
        mr.category,
        mr.module_name,
        mr.priority,
        mr.soll_status,
        COALESCE(mp.progress_percent, 0) as progress_percent,
        COALESCE(mp.ist_status, 'open') as ist_status
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
      ORDER BY mr.category, mr.module_name
    `);

    const moduleList = modules as any[];
    const totalModules = moduleList.length;

    if (totalModules === 0) {
      return {
        project: projectName,
        projectId: null,
        overall_progress: 0,
        categories: {},
        doneCount: 0,
        inProgressCount: 0,
        openCount: 0,
        highRiskCount: 0,
        totalModules: 0,
        statusText: "Keine Module vorhanden.",
      };
    }

    // =====================================================
    // 2. Berechne Statistiken
    // =====================================================
    let totalProgress = 0;
    let doneCount = 0;
    let inProgressCount = 0;
    let openCount = 0;
    let highRiskCount = 0;

    const categoryProgress: Record<string, { total: number; count: number }> = {};

    for (const mod of moduleList) {
      const progress = mod.progress_percent || 0;
      totalProgress += progress;

      // Zähler
      if (progress === 100) {
        doneCount++;
      } else if (progress > 0) {
        inProgressCount++;
      } else {
        openCount++;
      }

      // High-Risk: priority = high UND progress < 30
      if (mod.priority === "high" && progress < 30) {
        highRiskCount++;
      }

      // Kategorie-Fortschritt
      if (!categoryProgress[mod.category]) {
        categoryProgress[mod.category] = { total: 0, count: 0 };
      }
      categoryProgress[mod.category].total += progress;
      categoryProgress[mod.category].count++;
    }

    // Durchschnitte berechnen
    const overallProgress = Math.round(totalProgress / totalModules);
    const categories: Record<string, number> = {};
    for (const [cat, data] of Object.entries(categoryProgress)) {
      categories[cat] = Math.round(data.total / data.count);
    }

    // =====================================================
    // 3. Status-Text generieren
    // =====================================================
    const highProgress = Object.entries(categories)
      .filter(([_, val]) => val >= 60)
      .map(([cat]) => cat);
    const midProgress = Object.entries(categories)
      .filter(([_, val]) => val >= 20 && val < 60)
      .map(([cat]) => cat);
    const lowProgress = Object.entries(categories)
      .filter(([_, val]) => val < 20)
      .map(([cat]) => cat);

    let statusText = "";
    if (highProgress.length > 0) {
      statusText += `${highProgress.join(", ")} ${highProgress.length === 1 ? "ist" : "sind"} weit fortgeschritten. `;
    }
    if (midProgress.length > 0) {
      statusText += `${midProgress.join(", ")} ${midProgress.length === 1 ? "ist" : "sind"} teilweise umgesetzt. `;
    }
    if (lowProgress.length > 0) {
      statusText += `${lowProgress.join(", ")} ${lowProgress.length === 1 ? "befindet" : "befinden"} sich noch in der Planungs- bzw. Startphase.`;
    }
    statusText = statusText.trim() || `Gesamtfortschritt: ${overallProgress}%`;

    // =====================================================
    // 4. Projekt in lopez_projects aktualisieren
    // =====================================================
    let projectId: number | null = null;

    try {
      const [projectRows] = await pool.execute(
        "SELECT id FROM lopez_projects WHERE project_name = ?",
        [projectName]
      );

      if ((projectRows as any[]).length > 0) {
        projectId = (projectRows as any[])[0].id;

        await pool.execute(
          `UPDATE lopez_projects 
           SET progress_percent = ?, 
               progress_status_text = ?,
               last_progress_update = NOW(),
               updated_at = NOW()
           WHERE id = ?`,
          [overallProgress, statusText, projectId]
        );
        console.log(`✅ Projekt "${projectName}" aktualisiert: ${overallProgress}%`);
      } else {
        console.warn(`⚠️ Projekt "${projectName}" nicht gefunden in lopez_projects`);
      }
    } catch (error) {
      console.error("❌ Fehler beim Aktualisieren des Projekts:", error);
    }

    // =====================================================
    // 5. Snapshot in project_analysis speichern
    // =====================================================
    let snapshotId: number | undefined;

    try {
      // Tabelle erstellen falls nicht vorhanden
      await pool.execute(`
        CREATE TABLE IF NOT EXISTS project_analysis (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          project_id BIGINT,
          project_name VARCHAR(255),
          overall_progress INT DEFAULT 0,
          category_admin INT DEFAULT 0,
          category_customers INT DEFAULT 0,
          category_support INT DEFAULT 0,
          category_media INT DEFAULT 0,
          category_ai INT DEFAULT 0,
          category_finance INT DEFAULT 0,
          category_website INT DEFAULT 0,
          category_portal_shop INT DEFAULT 0,
          category_ops INT DEFAULT 0,
          category_docs INT DEFAULT 0,
          done_count INT DEFAULT 0,
          in_progress_count INT DEFAULT 0,
          open_count INT DEFAULT 0,
          high_risk_count INT DEFAULT 0,
          total_modules INT DEFAULT 0,
          status_text TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_project_id (project_id),
          INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Snapshot einfügen
      const [result] = await pool.execute(
        `INSERT INTO project_analysis 
         (project_id, project_name, overall_progress, 
          category_admin, category_customers, category_support, category_media,
          category_ai, category_finance, category_website, category_portal_shop,
          category_ops, category_docs,
          done_count, in_progress_count, open_count, high_risk_count, total_modules,
          status_text)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          projectId,
          projectName,
          overallProgress,
          categories["Admin & Core Platform"] || 0,
          categories["Kunden & Projekte"] || 0,
          categories["Support & Kommunikation"] || 0,
          categories["Inhalte & Medien"] || 0,
          categories["AI Center"] || 0,
          categories["Finanzen & Rechnungen"] || 0,
          categories["Öffentliche Website"] || 0,
          categories["Kundenportal & Shop"] || 0,
          categories["Server, Sicherheit & Betrieb"] || 0,
          categories["Dokumentation & Compliance"] || 0,
          doneCount,
          inProgressCount,
          openCount,
          highRiskCount,
          totalModules,
          statusText,
        ]
      );
      snapshotId = (result as any).insertId;
      console.log(`📸 Analyse-Snapshot #${snapshotId} gespeichert`);
    } catch (error) {
      console.error("❌ Fehler beim Speichern des Snapshots:", error);
    }

    return {
      project: projectName,
      projectId,
      overall_progress: overallProgress,
      categories,
      doneCount,
      inProgressCount,
      openCount,
      highRiskCount,
      totalModules,
      statusText,
      snapshotId,
    };
  }

  /**
   * Holt die letzten Analyse-Snapshots
   */
  static async getAnalysisHistory(limit: number = 10): Promise<any[]> {
    const pool = await getConnection();

    try {
      const [rows] = await pool.execute(
        `SELECT * FROM project_analysis ORDER BY created_at DESC LIMIT ?`,
        [limit]
      );
      return rows as any[];
    } catch (error) {
      console.error("❌ Fehler beim Abrufen der Analyse-Historie:", error);
      return [];
    }
  }

  // =====================================================
  // HYBRID AUTO-COMPLETE SYSTEM (Enterprise++)
  // =====================================================

  /**
   * Prüft ob ein einzelnes Modul auto-complete-fähig ist
   */
  static async checkAutoCompleteEligibility(moduleId: number): Promise<{
    eligible: boolean;
    requires_approval: boolean;
    blocked: boolean;
    block_reasons: string[];
    module_name: string;
    priority_level: PriorityLevel;
    maturity_level: MaturityLevel;
    risk_level: RiskLevel;
    progress_percent: number;
    open_tasks: number;
    unmet_dependencies: string[];
  }> {
    const pool = await getConnection();

    // Hole Modul-Daten
    const [moduleRows] = await pool.execute(`
      SELECT 
        mr.id, mr.module_name, mr.priority_level, mr.maturity_level, 
        mr.risk_level, mr.depends_on, mr.go_live_required,
        COALESCE(mp.progress_percent, 0) as progress_percent,
        COALESCE(mp.ist_status, 'open') as ist_status
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
      WHERE mr.id = ?
    `, [moduleId]);

    if ((moduleRows as any[]).length === 0) {
      return {
        eligible: false,
        requires_approval: false,
        blocked: true,
        block_reasons: ["Modul nicht gefunden"],
        module_name: "Unknown",
        priority_level: "P2",
        maturity_level: "M0",
        risk_level: "medium",
        progress_percent: 0,
        open_tasks: 0,
        unmet_dependencies: [],
      };
    }

    const mod = (moduleRows as any[])[0];
    const blockReasons: string[] = [];
    const unmetDependencies: string[] = [];

    // Bereits fertig?
    if (mod.progress_percent >= 100 || mod.ist_status === "done") {
      return {
        eligible: false,
        requires_approval: false,
        blocked: true,
        block_reasons: ["Modul bereits abgeschlossen"],
        module_name: mod.module_name,
        priority_level: mod.priority_level || "P2",
        maturity_level: mod.maturity_level || "M0",
        risk_level: mod.risk_level || "medium",
        progress_percent: mod.progress_percent,
        open_tasks: 0,
        unmet_dependencies: [],
      };
    }

    // 1. Prüfe offene Tasks
    const [taskRows] = await pool.execute(`
      SELECT COUNT(*) as open_count 
      FROM agent_tasks 
      WHERE related_module_id = ? AND status != 'done'
    `, [moduleId]);
    const openTasks = (taskRows as any[])[0].open_count || 0;

    if (openTasks > 0) {
      blockReasons.push(`${openTasks} offene Tasks`);
    }

    // 2. Prüfe Risiko
    if (mod.risk_level === "critical") {
      blockReasons.push("Kritisches Risiko");
    }

    // 3. Prüfe Maturity
    const maturityValue = parseInt((mod.maturity_level || "M0").substring(1));
    if (maturityValue < 3) {
      blockReasons.push(`Maturity ${mod.maturity_level} < M3`);
    }

    // 4. Prüfe Abhängigkeiten (mit normalizeDependsOn für Fehlertoleranz)
    const dependencies = normalizeDependsOn(mod.depends_on);
    
    if (dependencies.length > 0) {
      for (const depName of dependencies) {
        try {
          const [depRows] = await pool.execute(`
            SELECT mr.module_name, COALESCE(mp.progress_percent, 0) as progress_percent
            FROM module_registry mr
            LEFT JOIN module_progress mp ON mr.id = mp.module_id
            WHERE mr.module_name = ?
          `, [depName]);

          if ((depRows as any[]).length > 0) {
            const dep = (depRows as any[])[0];
            if (dep.progress_percent < 100) {
              unmetDependencies.push(depName);
            }
          } else {
            // Abhängigkeit existiert nicht in DB - als unerfüllt werten
            agentLogger.debug(`Abhängigkeit nicht gefunden: ${depName}`, { moduleId });
            unmetDependencies.push(`${depName} (nicht gefunden)`);
          }
        } catch (depError) {
          // Bei DB-Fehler: Abhängigkeit als unbekannt loggen, nicht als blockierend
          agentLogger.warn(`Fehler beim Prüfen der Abhängigkeit: ${depName}`, { moduleId, error: depError });
        }
      }

      if (unmetDependencies.length > 0) {
        blockReasons.push(`${unmetDependencies.length} Abhängigkeiten nicht erfüllt`);
      }
    }

    // Entscheidung
    const isBlocked = blockReasons.length > 0;
    const priorityLevel = (mod.priority_level || "P2") as PriorityLevel;
    const requiresApproval = !isBlocked && ["P0", "P1"].includes(priorityLevel);
    const eligible = !isBlocked;

    return {
      eligible,
      requires_approval: requiresApproval,
      blocked: isBlocked,
      block_reasons: blockReasons,
      module_name: mod.module_name,
      priority_level: priorityLevel,
      maturity_level: (mod.maturity_level || "M0") as MaturityLevel,
      risk_level: (mod.risk_level || "medium") as RiskLevel,
      progress_percent: mod.progress_percent,
      open_tasks: openTasks,
      unmet_dependencies: unmetDependencies,
    };
  }

  /**
   * Schließt ein Modul automatisch ab
   */
  static async autoCompleteModule(moduleId: number, force: boolean = false): Promise<{
    success: boolean;
    message: string;
    module_name?: string;
  }> {
    const pool = await getConnection();

    // Erst Eligibility prüfen
    const eligibility = await this.checkAutoCompleteEligibility(moduleId);

    // Enterprise++ Regel: force=true überschreibt ALLE Blockierungen (manuelle Freigabe)
    if (!force) {
      // Ohne force: Blockierung beachten
      if (eligibility.blocked) {
        return {
          success: false,
          message: `Modul blockiert: ${eligibility.block_reasons.join(", ")}`,
          module_name: eligibility.module_name,
        };
      }

      // Ohne force: P0/P1 brauchen Freigabe
      if (eligibility.requires_approval) {
        return {
          success: false,
          message: `Modul ${eligibility.module_name} (${eligibility.priority_level}) benötigt manuelle Freigabe`,
          module_name: eligibility.module_name,
        };
      }
    }
    
    // Mit force=true: ALLES wird überschrieben (Enterprise++ Manual Override)

    // Auto-Complete durchführen
    try {
      // 1. module_progress aktualisieren
      const [existingProgress] = await pool.execute(
        "SELECT id FROM module_progress WHERE module_id = ?",
        [moduleId]
      );

      if ((existingProgress as any[]).length === 0) {
        await pool.execute(`
          INSERT INTO module_progress (module_id, ist_status, progress_percent, comment, responsible_agent)
          VALUES (?, 'done', 100, 'Auto-Complete (Enterprise++)', 'run')
        `, [moduleId]);
      } else {
        await pool.execute(`
          UPDATE module_progress 
          SET ist_status = 'done', 
              progress_percent = 100, 
              comment = 'Auto-Complete (Enterprise++)',
              responsible_agent = 'run',
              updated_at = NOW()
          WHERE module_id = ?
        `, [moduleId]);
      }

      // 2. module_registry aktualisieren (Maturity + Risk)
      await pool.execute(`
        UPDATE module_registry 
        SET maturity_level = 'M5', 
            risk_level = 'low',
            updated_at = NOW()
        WHERE id = ?
      `, [moduleId]);

      // 3. Log in project_analysis (falls Tabelle existiert)
      const logMessage = force 
        ? `✅ ${eligibility.module_name} MANUELL fertiggestellt (Enterprise++ Override, ${eligibility.priority_level})`
        : `✅ ${eligibility.module_name} automatisch abgeschlossen (${eligibility.priority_level})`;
      
      try {
        await pool.execute(`
          INSERT INTO project_analysis 
          (project_name, overall_progress, status_text, created_at)
          VALUES (?, 0, ?, NOW())
        `, [
          force ? "Manual-Complete Log" : "Auto-Complete Log",
          logMessage,
        ]);
      } catch (logError) {
        console.warn("Log-Eintrag konnte nicht erstellt werden:", logError);
      }

      console.log(`✅ ${force ? "Manual" : "Auto"}-Complete: ${eligibility.module_name} → 100%, M5, low`);

      return {
        success: true,
        message: `Modul "${eligibility.module_name}" erfolgreich abgeschlossen`,
        module_name: eligibility.module_name,
      };
    } catch (error) {
      console.error("❌ Auto-Complete Fehler:", error);
      return {
        success: false,
        message: "Fehler beim Abschließen des Moduls",
        module_name: eligibility.module_name,
      };
    }
  }

  /**
   * Holt alle Module mit Auto-Complete-Status (für Dashboard)
   */
  static async getModulesEligibleForAutoComplete(): Promise<{
    auto: Array<{ id: number; module_name: string; priority_level: PriorityLevel; progress_percent: number }>;
    requires_approval: Array<{ id: number; module_name: string; priority_level: PriorityLevel; progress_percent: number }>;
    blocked: Array<{ id: number; module_name: string; priority_level: PriorityLevel; progress_percent: number; block_reasons: string[] }>;
    already_done: Array<{ id: number; module_name: string; priority_level: PriorityLevel }>;
    summary: {
      total: number;
      auto_count: number;
      approval_count: number;
      blocked_count: number;
      done_count: number;
    };
  }> {
    const pool = await getConnection();

    // Hole alle Module
    const [modules] = await pool.execute(`
      SELECT mr.id, mr.module_name, mr.priority_level,
             COALESCE(mp.progress_percent, 0) as progress_percent,
             COALESCE(mp.ist_status, 'open') as ist_status
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
      ORDER BY mr.priority_level, mr.category, mr.module_name
    `);

    const auto: any[] = [];
    const requiresApproval: any[] = [];
    const blocked: any[] = [];
    const alreadyDone: any[] = [];

    for (const mod of modules as any[]) {
      // Bereits fertig?
      if (mod.progress_percent >= 100 || mod.ist_status === "done") {
        alreadyDone.push({
          id: mod.id,
          module_name: mod.module_name,
          priority_level: mod.priority_level || "P2",
        });
        continue;
      }

      const eligibility = await this.checkAutoCompleteEligibility(mod.id);

      if (eligibility.blocked) {
        blocked.push({
          id: mod.id,
          module_name: mod.module_name,
          priority_level: eligibility.priority_level,
          progress_percent: eligibility.progress_percent,
          block_reasons: eligibility.block_reasons,
        });
      } else if (eligibility.requires_approval) {
        requiresApproval.push({
          id: mod.id,
          module_name: mod.module_name,
          priority_level: eligibility.priority_level,
          progress_percent: eligibility.progress_percent,
        });
      } else {
        auto.push({
          id: mod.id,
          module_name: mod.module_name,
          priority_level: eligibility.priority_level,
          progress_percent: eligibility.progress_percent,
        });
      }
    }

    return {
      auto,
      requires_approval: requiresApproval,
      blocked,
      already_done: alreadyDone,
      summary: {
        total: (modules as any[]).length,
        auto_count: auto.length,
        approval_count: requiresApproval.length,
        blocked_count: blocked.length,
        done_count: alreadyDone.length,
      },
    };
  }

  /**
   * Batch Auto-Complete für alle P2/P3 Module
   */
  static async batchAutoComplete(): Promise<{
    completed: string[];
    failed: string[];
    skipped: string[];
  }> {
    const eligible = await this.getModulesEligibleForAutoComplete();
    
    const completed: string[] = [];
    const failed: string[] = [];
    const skipped: string[] = [];

    for (const mod of eligible.auto) {
      const result = await this.autoCompleteModule(mod.id, false);
      if (result.success) {
        completed.push(mod.module_name);
      } else {
        failed.push(mod.module_name);
      }
    }

    // P0/P1 werden übersprungen (brauchen manuelle Freigabe)
    for (const mod of eligible.requires_approval) {
      skipped.push(mod.module_name);
    }

    console.log(`✅ Batch Auto-Complete: ${completed.length} abgeschlossen, ${failed.length} fehlgeschlagen, ${skipped.length} übersprungen (P0/P1)`);

    return { completed, failed, skipped };
  }

  /**
   * Holt alle SOLL-Module mit IST-Fortschritt
   */
  static async getModulesWithProgress(): Promise<(ModuleRegistry & {
    ist_status: IstStatus;
    progress_percent: number;
    responsible_agent: AgentType;
    comment: string;
  })[]> {
    const pool = await getConnection();

    const [rows] = await pool.execute(`
      SELECT 
        mr.*,
        COALESCE(mp.ist_status, 'open') as ist_status,
        COALESCE(mp.progress_percent, 0) as progress_percent,
        COALESCE(mp.responsible_agent, 'agent_a') as responsible_agent,
        COALESCE(mp.comment, '') as comment
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
      ORDER BY 
        FIELD(mr.priority, 'high', 'medium', 'low'),
        mr.category,
        mr.module_name
    `);

    return rows as any[];
  }

  /**
   * Aktualisiert den IST-Fortschritt eines Moduls
   */
  static async updateModuleProgress(
    moduleId: number,
    updates: {
      ist_status?: IstStatus;
      progress_percent?: number;
      comment?: string;
      responsible_agent?: AgentType;
    }
  ): Promise<boolean> {
    const pool = await getConnection();

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (updates.ist_status !== undefined) {
      updateFields.push("ist_status = ?");
      updateValues.push(updates.ist_status);
    }
    if (updates.progress_percent !== undefined) {
      updateFields.push("progress_percent = ?");
      updateValues.push(Math.min(100, Math.max(0, updates.progress_percent)));
    }
    if (updates.comment !== undefined) {
      updateFields.push("comment = ?");
      updateValues.push(updates.comment);
    }
    if (updates.responsible_agent !== undefined) {
      updateFields.push("responsible_agent = ?");
      updateValues.push(updates.responsible_agent);
    }

    if (updateFields.length === 0) return false;

    updateValues.push(moduleId);

    const [result] = await pool.execute(
      `UPDATE module_progress SET ${updateFields.join(", ")} WHERE module_id = ?`,
      updateValues
    );

    return (result as any).affectedRows > 0;
  }

  /**
   * Holt alle Tasks für einen Agent
   */
  static async getAgentTasks(agent?: AgentType): Promise<AgentTask[]> {
    const pool = await getConnection();

    let query = `
      SELECT at.*, mr.module_name as related_module_name
      FROM agent_tasks at
      LEFT JOIN module_registry mr ON at.related_module_id = mr.id
    `;
    const params: any[] = [];

    if (agent) {
      query += " WHERE at.assigned_agent = ?";
      params.push(agent);
    }

    query += " ORDER BY FIELD(at.priority, 'high', 'medium', 'low'), at.status, at.created_at DESC";

    const [rows] = await pool.execute(query, params);
    return rows as AgentTask[];
  }

  /**
   * Erstellt eine neue Task
   */
  static async createTask(task: Omit<AgentTask, "id" | "created_at" | "updated_at">): Promise<number> {
    const pool = await getConnection();

    const [result] = await pool.execute(
      `INSERT INTO agent_tasks 
       (title, description, assigned_agent, status, related_module_id, priority)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        task.title,
        task.description,
        task.assigned_agent,
        task.status || "open",
        task.related_module_id || null,
        task.priority || "medium",
      ]
    );

    return (result as any).insertId;
  }

  /**
   * Aktualisiert eine Task
   */
  static async updateTask(
    taskId: number,
    updates: Partial<Pick<AgentTask, "title" | "description" | "assigned_agent" | "status" | "priority">>
  ): Promise<boolean> {
    const pool = await getConnection();

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (updates.title !== undefined) {
      updateFields.push("title = ?");
      updateValues.push(updates.title);
    }
    if (updates.description !== undefined) {
      updateFields.push("description = ?");
      updateValues.push(updates.description);
    }
    if (updates.assigned_agent !== undefined) {
      updateFields.push("assigned_agent = ?");
      updateValues.push(updates.assigned_agent);
    }
    if (updates.status !== undefined) {
      updateFields.push("status = ?");
      updateValues.push(updates.status);
    }
    if (updates.priority !== undefined) {
      updateFields.push("priority = ?");
      updateValues.push(updates.priority);
    }

    if (updateFields.length === 0) return false;

    updateValues.push(taskId);

    const [result] = await pool.execute(
      `UPDATE agent_tasks SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );

    return (result as any).affectedRows > 0;
  }

  /**
   * Berechnet Statistiken für das Agent-System
   */
  static async getStatistics(): Promise<{
    totalModules: number;
    modulesByStatus: Record<IstStatus, number>;
    modulesByPriority: Record<Priority, number>;
    overallProgress: number;
    tasksByAgent: Record<AgentType, { total: number; open: number; done: number }>;
    tasksByStatus: Record<TaskStatus, number>;
  }> {
    const pool = await getConnection();

    // Module-Statistiken
    const [moduleStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN mp.ist_status = 'open' THEN 1 ELSE 0 END) as status_open,
        SUM(CASE WHEN mp.ist_status = 'in_progress' THEN 1 ELSE 0 END) as status_in_progress,
        SUM(CASE WHEN mp.ist_status = 'done' THEN 1 ELSE 0 END) as status_done,
        SUM(CASE WHEN mr.priority = 'high' THEN 1 ELSE 0 END) as priority_high,
        SUM(CASE WHEN mr.priority = 'medium' THEN 1 ELSE 0 END) as priority_medium,
        SUM(CASE WHEN mr.priority = 'low' THEN 1 ELSE 0 END) as priority_low,
        AVG(COALESCE(mp.progress_percent, 0)) as avg_progress
      FROM module_registry mr
      LEFT JOIN module_progress mp ON mr.id = mp.module_id
    `);

    const stats = (moduleStats as any[])[0];

    // Task-Statistiken nach Agent
    const [taskStats] = await pool.execute(`
      SELECT 
        assigned_agent,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_count,
        SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as done_count
      FROM agent_tasks
      GROUP BY assigned_agent
    `);

    const tasksByAgent: Record<AgentType, { total: number; open: number; done: number }> = {
      plan: { total: 0, open: 0, done: 0 },
      build: { total: 0, open: 0, done: 0 },
      run: { total: 0, open: 0, done: 0 },
    };

    for (const row of taskStats as any[]) {
      tasksByAgent[row.assigned_agent as AgentType] = {
        total: row.total,
        open: row.open_count,
        done: row.done_count,
      };
    }

    // Task-Statistiken nach Status
    const [taskStatusStats] = await pool.execute(`
      SELECT status, COUNT(*) as count
      FROM agent_tasks
      GROUP BY status
    `);

    const tasksByStatus: Record<TaskStatus, number> = {
      open: 0,
      in_progress: 0,
      done: 0,
    };

    for (const row of taskStatusStats as any[]) {
      tasksByStatus[row.status as TaskStatus] = row.count;
    }

    return {
      totalModules: stats.total || 0,
      modulesByStatus: {
        open: stats.status_open || 0,
        in_progress: stats.status_in_progress || 0,
        done: stats.status_done || 0,
      },
      modulesByPriority: {
        high: stats.priority_high || 0,
        medium: stats.priority_medium || 0,
        low: stats.priority_low || 0,
      },
      overallProgress: Math.round(stats.avg_progress || 0),
      tasksByAgent,
      tasksByStatus,
    };
  }
}

