# Lopez IT Welt – Plattform Go-Live 2026

## Enterprise++ Masterplan

---

| Dokument-ID | LIW-PLT-2026-001 |
|-------------|------------------|
| Version | 1.0.0 |
| Status | 🚀 **AKTIV** |
| Erstellt | 05.12.2025 |
| Ziel-Datum | Q2/2026 |

---

## 1. Executive Summary

Nach erfolgreichem Abschluss des **AI Center 2.5.0** (Dezember 2025) startet die nächste Phase:
**Lopez IT Welt – Plattform Go-Live 2026**.

### Ziele

1. **Externe Kundenplattform** produktionsreif machen
2. **SaaS-Bereitschaft** für Multi-Tenant-Betrieb
3. **Infrastruktur** für professionellen Betrieb aufbauen
4. **Geschäftsmodell** mit Preisgestaltung finalisieren
5. **Marketing & Vertrieb** starten

### Status-Übersicht

| Bereich | Aktuell | Ziel Q2/2026 |
|---------|---------|--------------|
| AI Center | ✅ Production | ✅ Stabil |
| Admin-Backend | ✅ 90% | ✅ 100% |
| Kunden-Portal | ✅ 70% | ✅ 100% |
| Infrastruktur | ⚠️ 40% | ✅ 100% |
| SaaS-Features | ⚠️ 50% | ✅ 100% |
| Marketing | ❌ 10% | ✅ 100% |

### Letzte Aktualisierung: 05.12.2025

**Phase 1.1–1.4 abgeschlossen:**
- ✅ Registrierung (Argon2, E-Mail-Verifizierung)
- ✅ Login + 2FA (TOTP, Backup-Codes)
- ✅ Onboarding (4-Schritte Wizard)
- ✅ Kundendashboard + Portal-Seiten

---

## 2. Phasen-Übersicht

```
┌─────────────────────────────────────────────────────────────────────┐
│                     PLATTFORM GO-LIVE 2026                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Phase 1 (Jan-Feb)     Phase 2 (Mär-Apr)     Phase 3 (Mai-Jun)     │
│  ─────────────────     ─────────────────     ─────────────────     │
│  Kunden-Portal         Infrastruktur         Go-Live               │
│  Completion            Hardening             Launch                │
│                                                                     │
│  ┌─────────────┐       ┌─────────────┐       ┌─────────────┐       │
│  │ Portal UI   │       │ Monitoring  │       │ Beta-Test   │       │
│  │ Onboarding  │       │ Backups     │       │ Soft-Launch │       │
│  │ Billing     │       │ Security    │       │ Marketing   │       │
│  │ Support     │       │ Performance │       │ Go-Live!    │       │
│  └─────────────┘       └─────────────┘       └─────────────┘       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Phase 1: Kunden-Portal Completion

**Zeitraum:** Januar – Februar 2026

### 3.1 Kunden-Dashboard

| Feature | Priorität | Status |
|---------|-----------|--------|
| Dashboard-Übersicht | P1 | ✅ FERTIG |
| Projekt-Liste | P1 | ✅ FERTIG |
| Rechnungs-Übersicht | P1 | ✅ FERTIG |
| Support-Tickets | P2 | ✅ FERTIG |
| AI-Services Übersicht | P2 | ✅ FERTIG |
| Einstellungen | P2 | ✅ FERTIG |
| Dokumenten-Ablage | P3 | ⬜ TODO |
| Benachrichtigungen | P3 | ⬜ TODO |

### 3.2 Onboarding-Flow

| Schritt | Beschreibung | Status |
|---------|--------------|--------|
| Registrierung | Self-Service Signup | ✅ FERTIG |
| E-Mail-Verifizierung | Double Opt-In | ✅ FERTIG |
| Profil-Erstellung | Firmendaten, Kontakt | ✅ FERTIG (Onboarding) |
| Plan-Auswahl | Tarif wählen | ⬜ TODO (Phase 1.5) |
| Zahlung | Stripe/PayPal Integration | ⬜ TODO (Phase 1.5) |
| Welcome-Wizard | Erste Schritte | ✅ FERTIG (4-Schritte) |

### 3.3 Billing & Subscription

| Feature | Beschreibung | Status |
|---------|--------------|--------|
| Tarif-Pläne | Free, Starter, Pro, Enterprise | ⬜ TODO |
| Stripe-Integration | Zahlungsabwicklung | ⬜ TODO |
| Rechnungserstellung | Automatisch, DSGVO-konform | ✅ Teilweise |
| PDF-Rechnungen | Generierung & Download | ⬜ TODO |
| Usage-Tracking | Verbrauchsabrechnung | ⬜ TODO |
| Upgrade/Downgrade | Self-Service Planwechsel | ⬜ TODO |

### 3.4 Support-System

| Feature | Beschreibung | Status |
|---------|--------------|--------|
| Ticket-System | Anfragen erstellen/verfolgen | ✅ FERTIG |
| Ticket-Nachrichten | Chat mit Support | ✅ DB-Struktur |
| Knowledge-Base | FAQ, Dokumentation | ⬜ TODO |
| Chat-Widget | Live-Support (optional) | ⬜ TODO |
| Status-Page | System-Status | ⬜ TODO |

---

## 4. Phase 2: Infrastruktur Hardening

**Zeitraum:** März – April 2026

### 4.1 Hosting & Deployment

| Komponente | Aktuell | Ziel |
|------------|---------|------|
| Webserver | Lokal | Netcup VPS |
| Datenbank | Lokal | Managed MySQL |
| CDN | - | Cloudflare |
| SSL | - | Let's Encrypt |
| Domain | lopez-it-welt.de | ✅ Vorhanden |

### 4.2 Monitoring & Alerting

| System | Beschreibung | Status |
|--------|--------------|--------|
| Uptime-Monitoring | 24/7 Verfügbarkeit | ⬜ TODO |
| Performance-Monitoring | Response-Zeiten | ⬜ TODO |
| Error-Tracking | Sentry/ähnlich | ⬜ TODO |
| Log-Aggregation | Zentrale Logs | ⬜ TODO |
| Alerting | E-Mail/SMS bei Problemen | ⬜ TODO |

### 4.3 Backup & Recovery

| Typ | Frequenz | Aufbewahrung |
|-----|----------|--------------|
| Datenbank-Backup | Täglich | 30 Tage |
| Datei-Backup | Wöchentlich | 90 Tage |
| Konfig-Backup | Bei Änderung | Unbegrenzt |
| Disaster Recovery | Dokumentiert | N/A |

### 4.4 Security Hardening

| Maßnahme | Beschreibung | Status |
|----------|--------------|--------|
| WAF | Web Application Firewall | ⬜ TODO |
| DDoS-Schutz | Cloudflare | ⬜ TODO |
| Rate-Limiting | Global + API | ✅ Teilweise |
| Security-Headers | CSP, HSTS, etc. | ⬜ TODO |
| Penetration-Test | Externer Test | ⬜ TODO |

### 4.5 Performance-Optimierung

| Bereich | Maßnahme | Status |
|---------|----------|--------|
| Frontend | Code-Splitting, Lazy-Loading | ⬜ TODO |
| Backend | Query-Optimierung | ⬜ TODO |
| Caching | Redis/Memcached | ⬜ TODO |
| CDN | Statische Assets | ⬜ TODO |

---

## 5. Phase 3: Go-Live

**Zeitraum:** Mai – Juni 2026

### 5.1 Beta-Test (Mai)

| Aktivität | Dauer | Beschreibung |
|-----------|-------|--------------|
| Internal Beta | 2 Wochen | Team-interne Tests |
| Closed Beta | 2 Wochen | 10-20 ausgewählte Tester |
| Bug-Fixing | Parallel | Gefundene Fehler beheben |
| Feedback-Auswertung | 1 Woche | Änderungen priorisieren |

### 5.2 Soft-Launch (Ende Mai)

| Aktivität | Beschreibung |
|-----------|--------------|
| Limited Access | Nur auf Einladung |
| Monitoring | Intensive Überwachung |
| Support | Direkter Kontakt |
| Iteration | Schnelle Anpassungen |

### 5.3 Marketing-Vorbereitung

| Kanal | Maßnahme | Status |
|-------|----------|--------|
| Website | Landing-Pages, Preise | ⬜ TODO |
| LinkedIn | Content-Strategie | ✅ Läuft |
| SEO | Keyword-Optimierung | ⬜ TODO |
| Content | Blog-Artikel, Case Studies | ⬜ TODO |
| E-Mail | Newsletter-Setup | ⬜ TODO |

### 5.4 Go-Live (Juni 2026)

| Meilenstein | Datum | Beschreibung |
|-------------|-------|--------------|
| Public Launch | 01.06.2026 | Plattform öffentlich |
| Marketing-Push | 01-15.06 | Aktive Bewerbung |
| First Customers | 06/2026 | Erste zahlende Kunden |
| Review & Adjust | 30.06.2026 | Auswertung, Anpassungen |

---

## 6. Tarif-Modell (Entwurf)

### 6.1 Pläne

| Plan | Preis/Monat | Zielgruppe |
|------|-------------|------------|
| **Free** | 0€ | Tester, Einzelpersonen |
| **Starter** | 49€ | Freelancer, kleine Teams |
| **Pro** | 149€ | KMU, Agenturen |
| **Enterprise** | Auf Anfrage | Konzerne, spezielle Anforderungen |

### 6.2 Feature-Matrix

| Feature | Free | Starter | Pro | Enterprise |
|---------|------|---------|-----|------------|
| Projekte | 1 | 5 | 20 | Unbegrenzt |
| Benutzer | 1 | 3 | 10 | Unbegrenzt |
| AI-Analysen/Monat | 10 | 100 | 500 | Unbegrenzt |
| Playbooks | 3 | Alle | Alle | Custom |
| Support | Community | E-Mail | Priorität | Dedicated |
| SLA | - | - | 99.5% | 99.9% |
| API-Zugang | ❌ | ✅ | ✅ | ✅ |
| Whitelabel | ❌ | ❌ | ❌ | ✅ |

### 6.3 Add-Ons

| Add-On | Preis | Beschreibung |
|--------|-------|--------------|
| Extra AI-Credits | 10€/100 | Zusätzliche Analysen |
| Extra Benutzer | 10€/User | Weitere Team-Mitglieder |
| Priority-Support | 50€/Monat | Schnellere Reaktion |
| Custom Playbooks | 200€/Stück | Individuelle Templates |

---

## 7. Team & Ressourcen

### 7.1 Rollen

| Rolle | Verantwortung | Aktuell |
|-------|---------------|---------|
| Entwicklung | Code, Features | ✅ Vorhanden |
| Design | UI/UX | ⚠️ Teilweise |
| Operations | Hosting, Monitoring | ⬜ Aufzubauen |
| Marketing | Content, Ads | ⬜ Aufzubauen |
| Support | Kundenbetreuung | ⬜ Aufzubauen |

### 7.2 Tools

| Bereich | Tool | Status |
|---------|------|--------|
| Code | GitHub/GitLab | ✅ |
| Projekt | Linear/Jira | ⬜ TODO |
| Kommunikation | Slack/Discord | ⬜ TODO |
| Docs | Notion/Confluence | ⬜ TODO |
| CRM | HubSpot/Pipedrive | ⬜ TODO |
| Support | Zendesk/Freshdesk | ⬜ TODO |

---

## 8. Risiken & Mitigationen

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| Verzögerung Entwicklung | Mittel | Hoch | Buffer einplanen, Prioritäten setzen |
| Sicherheitslücke | Niedrig | Kritisch | Security-Audit, Pen-Test |
| Keine Kunden | Mittel | Hoch | Early-Access, Feedback-Loop |
| Überlastung | Mittel | Mittel | Skalierbare Infrastruktur |
| Konkurrenz | Hoch | Mittel | USP schärfen, Nische fokussieren |

---

## 9. Budget (Schätzung)

### 9.1 Einmalige Kosten

| Posten | Geschätzt |
|--------|-----------|
| Domain & SSL | 50€ |
| Security-Audit | 500-2000€ |
| Marketing-Material | 500€ |
| Rechtliche Prüfung | 500-1000€ |
| **Summe** | **~2000-4000€** |

### 9.2 Laufende Kosten (monatlich)

| Posten | Geschätzt |
|--------|-----------|
| Hosting (VPS) | 30-100€ |
| Datenbank (Managed) | 20-50€ |
| E-Mail-Service | 20-50€ |
| Monitoring-Tools | 20-50€ |
| Stripe-Gebühren | 1.4% + 0.25€/Tx |
| **Summe** | **~100-300€** |

---

## 10. Meilensteine

### 10.1 Timeline

```
2025                          2026
────────────────────────────────────────────────────────────
Dez     Jan     Feb     Mär     Apr     Mai     Jun
 │       │       │       │       │       │       │
 ▼       ▼       ▼       ▼       ▼       ▼       ▼
 AI      Portal  Portal  Infra   Infra   Beta    GO
 Center  Start   Done    Start   Done    Test    LIVE
 2.5.0                                           🚀
 ✅
```

### 10.2 Checkpoints

| Datum | Meilenstein | Kriterien |
|-------|-------------|-----------|
| 31.01.2026 | Portal MVP | Dashboard, Onboarding fertig |
| 28.02.2026 | Portal Complete | Billing, Support integriert |
| 31.03.2026 | Infra MVP | Hosting live, Monitoring aktiv |
| 30.04.2026 | Infra Complete | Security-Audit bestanden |
| 15.05.2026 | Beta Start | Erste externe Tester |
| 31.05.2026 | Soft-Launch | Limited Access |
| **15.06.2026** | **Go-Live** | **Plattform öffentlich** |

---

## 11. Erfolgs-Metriken

### 11.1 Launch-Ziele (Q2/2026)

| Metrik | Ziel |
|--------|------|
| Registrierungen | 100+ |
| Zahlende Kunden | 10+ |
| MRR (Monthly Recurring Revenue) | 500€+ |
| Uptime | 99.5%+ |
| NPS (Net Promoter Score) | 30+ |

### 11.2 Jahres-Ziele (Ende 2026)

| Metrik | Ziel |
|--------|------|
| Zahlende Kunden | 50+ |
| MRR | 3000€+ |
| ARR (Annual Recurring Revenue) | 36.000€+ |
| Churn-Rate | < 5% |

---

## 12. Nächste Schritte

### Sofort (Diese Woche)

1. [ ] Masterplan mit Team besprechen
2. [ ] Sprint 1 für Portal planen
3. [ ] Hosting-Optionen evaluieren

### Kurzfristig (Januar)

1. [ ] Kunden-Dashboard Entwicklung starten
2. [ ] Onboarding-Flow designen
3. [ ] Stripe-Account einrichten

### Mittelfristig (Q1/2026)

1. [ ] Portal fertigstellen
2. [ ] Infrastruktur aufsetzen
3. [ ] Beta-Tester rekrutieren

---

## 13. Dokumenten-Kontrolle

| Version | Datum | Änderung | Autor |
|---------|-------|----------|-------|
| 1.0.0 | 05.12.2025 | Initiale Version | System |
| 1.1.0 | 05.12.2025 | Phase 1.1–1.4 abgeschlossen (Portal, Auth, Onboarding, Dashboard) | AI Center |

---

**Ende des Masterplans**

---

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 LOPEZ IT WELT – PLATTFORM GO-LIVE 2026                  ║
║                                                               ║
║   Status: MASTERPLAN AKTIV                                    ║
║   Ziel: Q2/2026                                               ║
║                                                               ║
║   "Von der internen Plattform zum SaaS-Produkt"              ║
║                                                               ║
║   Enterprise++ Standards | EU AI Act | DSGVO                  ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

