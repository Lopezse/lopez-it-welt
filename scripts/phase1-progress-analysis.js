/**
 * ENTERPRISE++ PHASE 1: FORTSCHRITTSANALYSE (READ ONLY)
 * =====================================================
 * KEINE DB-Änderungen!
 * Nur SELECT-Abfragen und Datei-Analyse.
 * =====================================================
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Modul-Definitionen mit SOLL-Funktionen
const MODULE_SPECS = {
  // =====================================================
  // ADMIN & CORE PLATFORM
  // =====================================================
  'ADM-01': {
    name: 'Admin-Dashboard',
    category: 'Admin & Core Platform',
    sollFunctions: [
      'Dashboard-Layout mit Sidebar',
      'Statistik-Kacheln (Module, Users, etc.)',
      'Schnellzugriffe',
      'Status-Übersicht',
      'Responsive Design'
    ],
    searchPatterns: ['admin/page.tsx', 'admin/layout.tsx', 'AdminDashboard', 'admin-dashboard']
  },
  'ADM-02': {
    name: 'Benutzerverwaltung',
    category: 'Admin & Core Platform',
    sollFunctions: [
      'Benutzer-Liste anzeigen',
      'Benutzer erstellen',
      'Benutzer bearbeiten',
      'Benutzer deaktivieren',
      'Passwort zurücksetzen',
      'Rollen zuweisen'
    ],
    searchPatterns: ['settings/users', 'api/admin/users', 'UserManagement', 'lopez_users']
  },
  'ADM-03': {
    name: 'Rollen & Rechte (RBAC/ABAC)',
    category: 'Admin & Core Platform',
    sollFunctions: [
      'Rollen-Liste',
      'Rolle erstellen',
      'Berechtigungen zuweisen',
      'ABAC-Policies',
      'Permission-Checks'
    ],
    searchPatterns: ['settings/roles', 'api/admin/roles', 'RoleManagement', 'permissions', 'rbac', 'abac']
  },
  'ADM-04': {
    name: '2FA & Session-Management',
    category: 'Admin & Core Platform',
    sollFunctions: [
      '2FA Setup (QR-Code)',
      '2FA Verifizierung',
      'Session-Übersicht',
      'Session-Logout',
      'IP-Bindung'
    ],
    searchPatterns: ['2fa', 'totp', 'session', 'TwoFactorAuth', 'SessionManagement']
  },
  'ADM-05': {
    name: 'Audit-Logs',
    category: 'Admin & Core Platform',
    sollFunctions: [
      'Audit-Log-Tabelle',
      'Event-Logging',
      'Filter & Suche',
      'Export-Funktion',
      'Zeitstempel'
    ],
    searchPatterns: ['audit', 'AuditLog', 'lopez_audit', 'logEvent']
  },
  'ADM-06': {
    name: 'Dynamic Settings',
    category: 'Admin & Core Platform',
    sollFunctions: [
      'Settings-UI',
      'Firma-Einstellungen',
      'Mail-Konfiguration',
      'AI-Provider',
      'System-Limits'
    ],
    searchPatterns: ['settings/system', 'api/admin/settings', 'DynamicSettings', 'lopez_settings']
  },
  'ADM-07': {
    name: 'Modul-Registry (SOLL/IST)',
    category: 'Admin & Core Platform',
    sollFunctions: [
      'Modul-Liste UI',
      'Fortschrittsanzeige',
      'Agent-Zuordnung',
      'Statistik-Dashboard',
      'SOLL/IST-Vergleich'
    ],
    searchPatterns: ['agent-system', 'module_registry', 'ModuleRegistry', 'AgentSystem']
  },

  // =====================================================
  // KUNDEN & PROJEKTE
  // =====================================================
  'KP-01': {
    name: 'Kundenliste',
    category: 'Kunden & Projekte',
    sollFunctions: [
      'Kunden-Tabelle',
      'Filter & Suche',
      'Sortierung',
      'Pagination',
      'Quick-Actions'
    ],
    searchPatterns: ['customers', 'Kundenliste', 'lopez_customers', 'CustomerList']
  },
  'KP-02': {
    name: 'Kundenstammdaten',
    category: 'Kunden & Projekte',
    sollFunctions: [
      'Kundenprofil-UI',
      'Firmendaten',
      'Ansprechpartner',
      'Adressen',
      'Kontaktdaten'
    ],
    searchPatterns: ['customer/[id]', 'CustomerDetail', 'customer-form', 'CustomerProfile']
  },
  'KP-03': {
    name: 'Projekte pro Kunde',
    category: 'Kunden & Projekte',
    sollFunctions: [
      'Projekt-Liste pro Kunde',
      'Projekt erstellen',
      'Projekt-Status',
      'Projekt-Details',
      'Verknüpfung Kunde-Projekt'
    ],
    searchPatterns: ['projects', 'lopez_projects', 'ProjectList', 'customer_projects']
  },
  'KP-04': {
    name: 'Projekt-Fortschritts-Tracking',
    category: 'Kunden & Projekte',
    sollFunctions: [
      'Fortschrittsbalken',
      'Deadline-Anzeige',
      'Status-Ampel',
      'Meilensteine',
      'Progress-Updates'
    ],
    searchPatterns: ['progress', 'ProjectProgress', 'project-tracking', 'progress_percent']
  },
  'KP-05': {
    name: 'Projekt-Notizen & Dateien',
    category: 'Kunden & Projekte',
    sollFunctions: [
      'Notizen pro Projekt',
      'Datei-Upload',
      'Datei-Verknüpfung',
      'Notiz-Timeline',
      'Datei-Preview'
    ],
    searchPatterns: ['project-notes', 'project-files', 'ProjectNotes', 'project_attachments']
  },

  // =====================================================
  // SUPPORT & KOMMUNIKATION
  // =====================================================
  'SUP-01': {
    name: 'Support-Tickets',
    category: 'Support & Kommunikation',
    sollFunctions: [
      'Ticket-Liste',
      'Ticket erstellen',
      'Status-Workflow',
      'Prioritäten',
      'Zuweisung'
    ],
    searchPatterns: ['tickets', 'SupportTicket', 'lopez_tickets', 'TicketList']
  },
  'SUP-02': {
    name: 'Kontakt-Nachrichten',
    category: 'Support & Kommunikation',
    sollFunctions: [
      'Kontaktformular',
      'Nachrichten-Liste im Admin',
      'Antwort-Funktion',
      'Status-Tracking',
      'E-Mail-Benachrichtigung'
    ],
    searchPatterns: ['contact', 'ContactForm', 'lopez_contact', 'contact-messages']
  },
  'SUP-03': {
    name: 'E-Mail-Templates',
    category: 'Support & Kommunikation',
    sollFunctions: [
      'Template-Liste',
      'Template-Editor',
      'Variablen-Platzhalter',
      'Template-Vorschau',
      'Template-Versand'
    ],
    searchPatterns: ['email-templates', 'EmailTemplate', 'mail-template', 'email_templates']
  },
  'SUP-04': {
    name: 'Benachrichtigungssystem (Admin)',
    category: 'Support & Kommunikation',
    sollFunctions: [
      'Notification-Center',
      'Badge-Anzeige',
      'Push-Notifications',
      'Benachrichtigungs-Settings',
      'Mark as Read'
    ],
    searchPatterns: ['notifications', 'NotificationCenter', 'admin-notifications', 'notification_']
  },

  // =====================================================
  // INHALTE & MEDIEN
  // =====================================================
  'MED-01': {
    name: 'Medienbibliothek',
    category: 'Inhalte & Medien',
    sollFunctions: [
      'Media-Grid',
      'Upload-Funktion',
      'Filter & Suche',
      'Preview',
      'Bulk-Aktionen'
    ],
    searchPatterns: ['media', 'MediaLibrary', 'lopez_media', 'media-browser']
  },
  'MED-02': {
    name: 'Sicherer Dateispeicher',
    category: 'Inhalte & Medien',
    sollFunctions: [
      'ID-basierte Speicherung',
      'Kein Directory Listing',
      'Access Control',
      'Verschlüsselung',
      'Secure Download'
    ],
    searchPatterns: ['secure-storage', 'file-storage', 'SecureStorage', 'media/download']
  },
  'MED-03': {
    name: 'Media-KI Analyse',
    category: 'Inhalte & Medien',
    sollFunctions: [
      'Auto-Tagging',
      'Bildanalyse',
      'OCR',
      'Personenerkennung',
      'DSGVO-Flags'
    ],
    searchPatterns: ['media-ai', 'MediaAI', 'ai/media', 'media_ai_results']
  },
  'MED-04': {
    name: 'DSGVO-Consent im Media-Upload',
    category: 'Inhalte & Medien',
    sollFunctions: [
      'Consent-Dialog',
      'Consent-Speicherung',
      'Personenrechte-Prüfung',
      'Lösch-Workflow',
      'Audit-Trail'
    ],
    searchPatterns: ['consent', 'MediaConsent', 'dsgvo', 'media_consent']
  },
  'MED-05': {
    name: 'Media-Tags & Kategorien',
    category: 'Inhalte & Medien',
    sollFunctions: [
      'Tag-Verwaltung',
      'Kategorie-Hierarchie',
      'Auto-Tags von KI',
      'Tag-Filter',
      'Bulk-Tagging'
    ],
    searchPatterns: ['media-tags', 'MediaTags', 'media_tags', 'tag-management']
  },

  // =====================================================
  // FINANZEN & ABRECHNUNG
  // =====================================================
  'FIN-01': {
    name: 'Rechnungsmodul Basis',
    category: 'Finanzen & Abrechnung',
    sollFunctions: [
      'Rechnung erstellen',
      'Rechnung bearbeiten',
      'PDF-Export',
      'Rechnungsnummer',
      'Positionen verwalten'
    ],
    searchPatterns: ['invoices', 'InvoiceForm', 'lopez_invoices', 'invoice-create']
  },
  'FIN-02': {
    name: 'Produkt- und Dienstleistungskatalog',
    category: 'Finanzen & Abrechnung',
    sollFunctions: [
      'Produkt-Liste',
      'Produkt erstellen',
      'Preise verwalten',
      'Kategorien',
      'Stundensätze'
    ],
    searchPatterns: ['products', 'ProductCatalog', 'lopez_products', 'services']
  },
  'FIN-03': {
    name: 'Rechnungsübersicht',
    category: 'Finanzen & Abrechnung',
    sollFunctions: [
      'Rechnungsliste',
      'Status-Filter (offen/bezahlt)',
      'Umsatz-Übersicht',
      'Mahnwesen',
      'Export'
    ],
    searchPatterns: ['invoice-list', 'InvoiceList', 'invoices/page', 'invoice-overview']
  },
  'FIN-04': {
    name: 'Steuer- & Währungsmanagement',
    category: 'Finanzen & Abrechnung',
    sollFunctions: [
      'MwSt-Sätze',
      'Währungen',
      'Rabatt-System',
      'Steuer-Berichte',
      'Währungsumrechnung'
    ],
    searchPatterns: ['tax', 'currency', 'TaxManagement', 'vat', 'discount']
  },
  'FIN-05': {
    name: 'Zeitabrechnung (Timetracking)',
    category: 'Finanzen & Abrechnung',
    sollFunctions: [
      'Zeiterfassung',
      'Stunden-Übersicht',
      'Projekt-Zuordnung',
      'Abrechnung generieren',
      'Timer-Funktion'
    ],
    searchPatterns: ['timetracking', 'TimeEntry', 'time-entries', 'work_hours']
  },

  // =====================================================
  // KI-INTEGRATION
  // =====================================================
  'AI-01': {
    name: 'Customer Insights',
    category: 'KI-Integration',
    sollFunctions: [
      'Kundenanalyse',
      'Potenzial-Score',
      'Risiko-Bewertung',
      'Empfehlungen',
      'Historien-Analyse'
    ],
    searchPatterns: ['customer-insights', 'CustomerInsights', 'ai/customers', 'ai_customer_insights']
  },
  'AI-02': {
    name: 'Project Analyzer',
    category: 'KI-Integration',
    sollFunctions: [
      'Projektanalyse',
      'Deadline-Prognose',
      'Risiko-Erkennung',
      'Ressourcen-Empfehlung',
      'Status-Vorhersage'
    ],
    searchPatterns: ['project-analyzer', 'ProjectAnalyzer', 'ai/projects', 'ai_project_insights']
  },
  'AI-03': {
    name: 'Invoice Assistant',
    category: 'KI-Integration',
    sollFunctions: [
      'Rechnungsprüfung',
      'Fehler-Erkennung',
      'Auto-Vervollständigung',
      'Preis-Vorschläge',
      'Anomalie-Erkennung'
    ],
    searchPatterns: ['invoice-assistant', 'InvoiceAssistant', 'ai/invoices', 'ai_invoice_insights']
  },
  'AI-04': {
    name: 'Executive Reports',
    category: 'KI-Integration',
    sollFunctions: [
      'Wochen-Report',
      'Monats-Report',
      'Quartals-Report',
      'KPI-Zusammenfassung',
      'Trend-Analyse'
    ],
    searchPatterns: ['executive-reports', 'ExecutiveReport', 'ai/reports', 'ai_reports']
  },
  'AI-05': {
    name: 'AI Cost & Provider Control',
    category: 'KI-Integration',
    sollFunctions: [
      'Provider-Auswahl',
      'Kosten-Tracking',
      'Usage-Limits',
      'Fallback-Logik',
      'Cost-Dashboard'
    ],
    searchPatterns: ['ai-provider', 'AIProvider', 'ai/usage', 'ai_usage', 'ai-cost']
  },

  // =====================================================
  // WEBSITE & ÖFFENTLICHER BEREICH
  // =====================================================
  'WEB-01': {
    name: 'Öffentliche Website (Frontend)',
    category: 'Website & Öffentlicher Bereich',
    sollFunctions: [
      'Hero-Section',
      'Services-Bereich',
      'Referenzen',
      'Kontakt-Seite',
      'Responsive Design'
    ],
    searchPatterns: ['(website)', 'HomePage', 'landing', 'public/page', 'hero']
  },
  'WEB-02': {
    name: 'Kundenportal Login',
    category: 'Website & Öffentlicher Bereich',
    sollFunctions: [
      'Portal-Login',
      'Registrierung',
      'Passwort-Reset',
      'Portal-Dashboard',
      'Session-Management'
    ],
    searchPatterns: ['portal', 'PortalLogin', 'customer-portal', 'portal/login']
  },
  'WEB-03': {
    name: 'SEO & Meta-Konfiguration',
    category: 'Website & Öffentlicher Bereich',
    sollFunctions: [
      'Meta-Tags',
      'OG-Tags',
      'Canonical-URLs',
      'Sitemap',
      'robots.txt'
    ],
    searchPatterns: ['seo', 'metadata', 'generateMetadata', 'og:', 'sitemap']
  },
  'WEB-04': {
    name: 'Cookie-Consent (DSGVO)',
    category: 'Website & Öffentlicher Bereich',
    sollFunctions: [
      'Cookie-Banner',
      'Präferenzen-Dialog',
      'Cookie-Speicherung',
      'Opt-Out',
      'Consent-Logging'
    ],
    searchPatterns: ['cookie', 'CookieConsent', 'cookie-banner', 'consent']
  },
  'WEB-05': {
    name: 'Impressum & Datenschutz (dynamisch)',
    category: 'Website & Öffentlicher Bereich',
    sollFunctions: [
      'Impressum-Seite',
      'Datenschutz-Seite',
      'Dynamische Inhalte',
      'Settings-Integration',
      'Rechtssicher'
    ],
    searchPatterns: ['impressum', 'datenschutz', 'privacy', 'legal', 'imprint']
  },

  // =====================================================
  // SICHERHEIT & COMPLIANCE
  // =====================================================
  'SEC-01': {
    name: 'DSGVO Consent Management',
    category: 'Sicherheit & Compliance',
    sollFunctions: [
      'Consent-Übersicht',
      'Einwilligungen verwalten',
      'Zeitstempel',
      'Widerruf',
      'Consent-History'
    ],
    searchPatterns: ['consent-management', 'ConsentManager', 'dsgvo_consent', 'consent_events']
  },
  'SEC-02': {
    name: 'Datenexport (DSGVO Art.20)',
    category: 'Sicherheit & Compliance',
    sollFunctions: [
      'Export-Funktion',
      'Alle User-Daten',
      'JSON/CSV Format',
      'Anfrage-Workflow',
      'Audit-Log'
    ],
    searchPatterns: ['data-export', 'DataExport', 'dsgvo/export', 'user-data-export']
  },
  'SEC-03': {
    name: 'Löschkonzept (DSGVO Art.17)',
    category: 'Sicherheit & Compliance',
    sollFunctions: [
      'Lösch-Anfragen',
      'Automatische Löschung',
      'Fristen-Management',
      'Anonymisierung',
      'Lösch-Protokoll'
    ],
    searchPatterns: ['data-deletion', 'DataDeletion', 'dsgvo/delete', 'retention']
  },
  'SEC-04': {
    name: 'Security-Audit Dashboard',
    category: 'Sicherheit & Compliance',
    sollFunctions: [
      'Security-Status',
      'Risiko-Übersicht',
      'Schwachstellen',
      'Empfehlungen',
      'Compliance-Check'
    ],
    searchPatterns: ['security-dashboard', 'SecurityAudit', 'security-status', 'vulnerability']
  },
  'SEC-05': {
    name: 'Penetration-Test Vorbereitung',
    category: 'Sicherheit & Compliance',
    sollFunctions: [
      'Test-Dokumentation',
      'Scope-Definition',
      'Kontakt-Info',
      'Ergebnis-Tracking',
      'Maßnahmen-Plan'
    ],
    searchPatterns: ['pentest', 'PenetrationTest', 'security-test', 'pentest-prep']
  },

  // =====================================================
  // SERVER & BETRIEB
  // =====================================================
  'OPS-01': {
    name: 'Netcup Debian 12 Grundsetup',
    category: 'Server & Betrieb',
    sollFunctions: [
      'SSH-Härtung',
      'Firewall (ufw)',
      'Benutzer-Setup',
      'Fail2ban',
      'Updates'
    ],
    searchPatterns: ['server-setup', 'netcup', 'debian', 'server-hardening', 'deployment/server']
  },
  'OPS-02': {
    name: 'Deployment-Pipeline',
    category: 'Server & Betrieb',
    sollFunctions: [
      'CI/CD Pipeline',
      'Auto-Build',
      'Auto-Deploy',
      'Staging',
      'Rollback'
    ],
    searchPatterns: ['deployment', 'pipeline', 'ci-cd', '.github/workflows', 'deploy.sh']
  },
  'OPS-03': {
    name: 'Monitoring & Health Checks',
    category: 'Server & Betrieb',
    sollFunctions: [
      'Uptime-Monitoring',
      'Health-Endpoint',
      'Alert-System',
      'Dashboard',
      'Log-Aggregation'
    ],
    searchPatterns: ['monitoring', 'health', 'HealthCheck', 'uptime', 'api/health']
  },
  'OPS-04': {
    name: 'Backup & Restore',
    category: 'Server & Betrieb',
    sollFunctions: [
      'DB-Backup',
      'File-Backup',
      'Automatisierung',
      'Restore-Test',
      'Offsite-Backup'
    ],
    searchPatterns: ['backup', 'BackupService', 'restore', 'backup-script']
  },
  'OPS-05': {
    name: 'Logging & Fehler-Monitoring',
    category: 'Server & Betrieb',
    sollFunctions: [
      'Zentrales Logging',
      'Error-Tracking',
      'Log-Rotation',
      'Log-Analyse',
      'Alerting'
    ],
    searchPatterns: ['logging', 'error-tracking', 'Logger', 'log-service', 'winston']
  },

  // =====================================================
  // DOKUMENTATION & SCHULUNG
  // =====================================================
  'DOC-01': {
    name: 'System-Dokumentation',
    category: 'Dokumentation & Schulung',
    sollFunctions: [
      'Architektur-Docs',
      'API-Dokumentation',
      'Datenmodell',
      'Setup-Guide',
      'Deployment-Guide'
    ],
    searchPatterns: ['docs/02-ARCHITEKTUR', 'docs/03-ENTWICKLUNG', 'README', 'api-doc']
  },
  'DOC-02': {
    name: 'Admin-Handbuch',
    category: 'Dokumentation & Schulung',
    sollFunctions: [
      'Benutzer-Guide',
      'Feature-Beschreibungen',
      'Troubleshooting',
      'FAQ',
      'Screenshots'
    ],
    searchPatterns: ['docs/06-ADMIN', 'admin-guide', 'user-manual', 'admin-handbuch']
  },
  'DOC-03': {
    name: 'Betriebsdokumentation',
    category: 'Dokumentation & Schulung',
    sollFunctions: [
      'Runbooks',
      'Incident-Response',
      'Wartungsplan',
      'Kontakte',
      'Eskalation'
    ],
    searchPatterns: ['docs/OPERATIONS', 'runbook', 'incident', 'maintenance', 'operations-guide']
  },
  'DOC-04': {
    name: 'DSGVO-Dokumentation',
    category: 'Dokumentation & Schulung',
    sollFunctions: [
      'Verfahrensverzeichnis',
      'TOM',
      'Datenschutzerklärung',
      'Auftragsverarbeitung',
      'Löschkonzept-Doku'
    ],
    searchPatterns: ['docs/COMPLIANCE', 'dsgvo', 'privacy', 'data-protection', 'tom']
  },
  'DOC-05': {
    name: 'Changelog & STATUS',
    category: 'Dokumentation & Schulung',
    sollFunctions: [
      'Changelog-Datei',
      'STATUS-Datei',
      'Versionierung',
      'Release-Notes',
      'KW-Updates'
    ],
    searchPatterns: ['CHANGELOG', 'STATUS', 'docs/KW-SYSTEM', 'release-notes']
  },

  // =====================================================
  // KUNDENPORTAL & SHOP (Extra)
  // =====================================================
  'PORT-01': {
    name: 'Kunden-Login & Registrierung',
    category: 'Kundenportal & Shop',
    sollFunctions: [
      'Portal-Login',
      'Registrierung',
      'E-Mail-Verifikation',
      'Passwort-Reset',
      'Remember-Me'
    ],
    searchPatterns: ['portal/login', 'portal/register', 'PortalAuth', 'customer-auth']
  },
  'PORT-02': {
    name: 'Kundenprofil',
    category: 'Kundenportal & Shop',
    sollFunctions: [
      'Profil-Ansicht',
      'Profil bearbeiten',
      'Passwort ändern',
      'Adressverwaltung',
      'Benachrichtigungen'
    ],
    searchPatterns: ['portal/profile', 'CustomerProfile', 'my-profile', 'customer/settings']
  },
  'PORT-03': {
    name: 'Kunden-Dashboard',
    category: 'Kundenportal & Shop',
    sollFunctions: [
      'Übersicht',
      'Projekte',
      'Rechnungen',
      'Tickets',
      'Dokumente'
    ],
    searchPatterns: ['portal/dashboard', 'CustomerDashboard', 'my-dashboard', 'portal/page']
  },
  'SHOP-01': {
    name: 'Produktverwaltung (Shop)',
    category: 'Kundenportal & Shop',
    sollFunctions: [
      'Shop-Produkte',
      'Kategorien',
      'Preise',
      'Lager',
      'Varianten'
    ],
    searchPatterns: ['shop/products', 'ShopProduct', 'shop_products', 'product-catalog']
  },
  'SHOP-02': {
    name: 'Warenkorb & Bestellprozess',
    category: 'Kundenportal & Shop',
    sollFunctions: [
      'Warenkorb',
      'Checkout',
      'Bestellbestätigung',
      'Lieferadresse',
      'Zahlungsauswahl'
    ],
    searchPatterns: ['cart', 'checkout', 'ShoppingCart', 'order-process']
  },
  'SHOP-03': {
    name: 'Bestellhistorie & Status',
    category: 'Kundenportal & Shop',
    sollFunctions: [
      'Bestellliste',
      'Bestelldetails',
      'Status-Tracking',
      'Rechnung Download',
      'Nachbestellung'
    ],
    searchPatterns: ['orders', 'OrderHistory', 'order-status', 'my-orders']
  },
  'SHOP-04': {
    name: 'Zahlungsarten (Phase 2)',
    category: 'Kundenportal & Shop',
    sollFunctions: [
      'Zahlungsgateway',
      'Kreditkarte',
      'PayPal',
      'Rechnung',
      'SEPA'
    ],
    searchPatterns: ['payment', 'PaymentGateway', 'stripe', 'paypal', 'payment-methods']
  }
};

async function analyzeModule(moduleCode, spec, fileList) {
  const result = {
    code: moduleCode,
    name: spec.name,
    category: spec.category,
    sollFunctions: spec.sollFunctions,
    istFunctions: [],
    foundFiles: [],
    missingFunctions: [],
    progressPercent: 0,
    recommendation: '',
    uncertain: false
  };

  // Suche nach relevanten Dateien
  for (const pattern of spec.searchPatterns) {
    const matches = fileList.filter(f => 
      f.toLowerCase().includes(pattern.toLowerCase()) ||
      f.includes(pattern)
    );
    result.foundFiles.push(...matches);
  }
  result.foundFiles = [...new Set(result.foundFiles)]; // Duplikate entfernen

  // Bewerte IST-Funktionen basierend auf gefundenen Dateien
  const hasUI = result.foundFiles.some(f => f.includes('page.tsx') || f.includes('Page.tsx') || f.includes('.tsx'));
  const hasAPI = result.foundFiles.some(f => f.includes('route.ts') || f.includes('api/'));
  const hasLib = result.foundFiles.some(f => f.includes('lib/') || f.includes('service'));
  const hasComponent = result.foundFiles.some(f => f.includes('components/'));

  // Einfache Heuristik für IST-Funktionen
  let implementedCount = 0;
  
  for (const sollFunc of spec.sollFunctions) {
    // Prüfe ob Funktion wahrscheinlich implementiert ist
    let implemented = false;
    
    if (sollFunc.toLowerCase().includes('ui') || sollFunc.toLowerCase().includes('anzeig') || 
        sollFunc.toLowerCase().includes('liste') || sollFunc.toLowerCase().includes('dashboard')) {
      implemented = hasUI;
    } else if (sollFunc.toLowerCase().includes('api') || sollFunc.toLowerCase().includes('erstellen') ||
               sollFunc.toLowerCase().includes('bearbeiten') || sollFunc.toLowerCase().includes('löschen')) {
      implemented = hasAPI;
    } else if (sollFunc.toLowerCase().includes('service') || sollFunc.toLowerCase().includes('logik')) {
      implemented = hasLib;
    } else {
      // Generische Prüfung
      implemented = result.foundFiles.length >= 2;
    }
    
    if (implemented) {
      result.istFunctions.push(sollFunc);
      implementedCount++;
    } else {
      result.missingFunctions.push(sollFunc);
    }
  }

  // Berechne Fortschritt
  if (spec.sollFunctions.length > 0) {
    result.progressPercent = Math.round((implementedCount / spec.sollFunctions.length) * 100);
  }

  // Empfehlung
  if (result.progressPercent >= 100) {
    result.recommendation = 'Bereit für M5 / Go-Live-fähig';
  } else if (result.progressPercent >= 80) {
    result.recommendation = 'Fast fertig, letzte Feinarbeit';
  } else if (result.progressPercent >= 50) {
    result.recommendation = 'In Entwicklung, Kernfunktionen vorhanden';
  } else if (result.progressPercent >= 20) {
    result.recommendation = 'Begonnen, aber unvollständig';
  } else if (result.foundFiles.length === 0) {
    result.recommendation = 'Noch nicht begonnen';
    result.uncertain = true;
  } else {
    result.recommendation = 'Minimal begonnen';
  }

  // Unsicherheit markieren
  if (result.foundFiles.length === 0) {
    result.uncertain = true;
    result.recommendation += ' (unsicher - keine Dateien gefunden)';
  }

  return result;
}

async function main() {
  console.log('=====================================================');
  console.log('ENTERPRISE++ PHASE 1: FORTSCHRITTSANALYSE');
  console.log('=====================================================');
  console.log('Modus: READ ONLY - KEINE DB-ÄNDERUNGEN');
  console.log('Datum:', new Date().toISOString());
  console.log('');

  // 1. Dateiliste erstellen
  console.log('=== Schritt 1: Dateiliste erstellen ===');
  const directories = ['src/app', 'src/lib', 'src/components', 'scripts', 'docs'];
  let allFiles = [];

  for (const dir of directories) {
    try {
      const files = getAllFiles(dir);
      allFiles.push(...files);
    } catch (e) {
      console.log(`  Überspringe ${dir}: ${e.message}`);
    }
  }
  console.log(`  ${allFiles.length} Dateien gefunden`);

  // 2. Module aus DB laden
  console.log('');
  console.log('=== Schritt 2: Module aus DB laden (SELECT) ===');
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lopez_it_welt'
  });

  const [dbModules] = await conn.execute(`
    SELECT module_code, module_name, category, risk_level, priority_level
    FROM module_registry
    ORDER BY module_code
  `);
  console.log(`  ${dbModules.length} Module in DB`);
  await conn.end();

  // 3. Analyse durchführen
  console.log('');
  console.log('=== Schritt 3: Module analysieren ===');
  const results = [];

  for (const dbMod of dbModules) {
    const spec = MODULE_SPECS[dbMod.module_code];
    if (spec) {
      const result = await analyzeModule(dbMod.module_code, spec, allFiles);
      result.riskLevel = dbMod.risk_level;
      result.priorityLevel = dbMod.priority_level;
      results.push(result);
      console.log(`  [${dbMod.module_code}] ${result.progressPercent}% - ${result.foundFiles.length} Dateien`);
    } else {
      // Modul ohne Spec
      results.push({
        code: dbMod.module_code,
        name: dbMod.module_name,
        category: dbMod.category,
        riskLevel: dbMod.risk_level,
        priorityLevel: dbMod.priority_level,
        progressPercent: 0,
        uncertain: true,
        recommendation: 'Keine Spezifikation vorhanden',
        sollFunctions: [],
        istFunctions: [],
        foundFiles: [],
        missingFunctions: []
      });
      console.log(`  [${dbMod.module_code}] ? - keine Spec definiert`);
    }
  }

  // 4. Reports speichern
  console.log('');
  console.log('=== Schritt 4: Reports erstellen ===');
  
  // Speichere Ergebnisse als JSON für spätere Verarbeitung
  fs.writeFileSync('scripts/progress-analysis-results.json', JSON.stringify(results, null, 2));
  console.log('  Ergebnisse gespeichert: scripts/progress-analysis-results.json');

  // Statistiken
  const stats = {
    total: results.length,
    done: results.filter(r => r.progressPercent >= 100).length,
    inProgress: results.filter(r => r.progressPercent > 0 && r.progressPercent < 100).length,
    open: results.filter(r => r.progressPercent === 0).length,
    avgProgress: Math.round(results.reduce((sum, r) => sum + r.progressPercent, 0) / results.length),
    uncertain: results.filter(r => r.uncertain).length
  };

  console.log('');
  console.log('=== ZUSAMMENFASSUNG ===');
  console.log(`  Gesamt Module: ${stats.total}`);
  console.log(`  Fertig (100%): ${stats.done}`);
  console.log(`  In Arbeit: ${stats.inProgress}`);
  console.log(`  Offen (0%): ${stats.open}`);
  console.log(`  Durchschnitt: ${stats.avgProgress}%`);
  console.log(`  Unsicher: ${stats.uncertain}`);
  console.log('');
  console.log('KEINE DB-ÄNDERUNGEN DURCHGEFÜHRT.');
  console.log('Reports werden von separatem Script erstellt.');

  return { results, stats };
}

function getAllFiles(dir, files = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
      getAllFiles(fullPath, files);
    } else if (item.isFile()) {
      files.push(fullPath.replace(/\\/g, '/'));
    }
  }
  return files;
}

main().catch(e => console.error('Fehler:', e.message));



