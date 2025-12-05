# 💾 ENTERPRISE++ BACKUP & MONITORING

**Stand:** 2025-12-04  
**Status:** ⬚ GEPLANT (OPS-03, OPS-04)  
**Version:** 1.0

---

## 📋 Übersicht

Dieses Dokument beschreibt die Backup-Strategie und das Monitoring-Konzept.

### Zugehörige Module

| Code | Name | Status |
|------|------|--------|
| OPS-03 | Monitoring & Health Checks | ⬚ Offen |
| OPS-04 | Backup & Restore | ⬚ Offen |
| OPS-05 | Logging & Fehler-Monitoring | ⬚ Offen |

---

## 💾 Backup-Strategie

### Backup-Typen

| Typ | Häufigkeit | Aufbewahrung | Inhalt |
|-----|------------|--------------|--------|
| **Full** | Wöchentlich | 4 Wochen | Komplette DB + Dateien |
| **Incremental** | Täglich | 7 Tage | Änderungen seit letztem Full |
| **Transaction Log** | Stündlich | 24 Stunden | DB-Transaktionen |

### Backup-Ziele

1. **Lokal:** `/var/backups/lopez-it-welt/`
2. **Remote:** Netcup Storage Box (optional)
3. **Offsite:** Verschlüsseltes Cloud-Backup (geplant)

### Backup-Inhalte

| Komponente | Backup | Methode |
|------------|--------|---------|
| MySQL Database | ✅ | mysqldump |
| Uploads/Media | ✅ | rsync |
| .env Konfiguration | ✅ | Verschlüsselt |
| Logs | ⬚ | Optional |

---

## 🔄 Restore-Prozess

### Voraussetzungen

1. Zugriff auf Backup-Storage
2. Admin-Rechte auf Ziel-Server
3. Dokumentierte Backup-Verschlüsselung

### Restore-Schritte

```bash
# 1. Datenbank wiederherstellen
mysql -u root -p lopez_it_welt < backup_YYYY-MM-DD.sql

# 2. Uploads wiederherstellen
rsync -avz backup/uploads/ /var/www/uploads/

# 3. Konfiguration prüfen
# .env manuell prüfen und anpassen

# 4. Anwendung neustarten
pm2 restart lopez-it-welt
```

### Restore-Test

- **Häufigkeit:** Monatlich
- **Ziel:** Staging-Umgebung
- **Dokumentation:** Ergebnis protokollieren

---

## 📊 Monitoring-Konzept

### Health Checks

| Check | Intervall | Schwellwert |
|-------|-----------|-------------|
| HTTP Response | 1 min | < 2s |
| Database Connection | 1 min | < 500ms |
| Disk Space | 5 min | > 20% frei |
| Memory Usage | 1 min | < 80% |
| CPU Usage | 1 min | < 90% |

### Endpoints

```
GET /api/health         # Basis-Check
GET /api/health/db      # DB-Check
GET /api/health/full    # Vollständiger Check
```

### Alerting

| Severity | Kanal | Reaktionszeit |
|----------|-------|---------------|
| Critical | SMS + E-Mail | < 15 min |
| High | E-Mail | < 1 Stunde |
| Medium | Dashboard | < 4 Stunden |
| Low | Log | Nächster Arbeitstag |

---

## 📈 Metriken

### Zu überwachende Metriken

| Metrik | Beschreibung |
|--------|--------------|
| Response Time | Durchschnittliche Antwortzeit |
| Error Rate | Fehlerquote pro Stunde |
| Active Users | Gleichzeitige Benutzer |
| DB Queries/s | Datenbankabfragen pro Sekunde |
| Backup Status | Letztes erfolgreiches Backup |

### Dashboard

Das Monitoring-Dashboard ist unter `/admin/monitoring` verfügbar (wenn OPS-03 implementiert).

---

## 🚨 Incident Response

### Eskalationsstufen

| Stufe | Auslöser | Maßnahme |
|-------|----------|----------|
| 1 | Service degraded | Auto-Restart |
| 2 | Service down | Alert + Manuelle Prüfung |
| 3 | Data loss | Restore aus Backup |
| 4 | Security breach | Sofort-Eskalation |

### Notfall-Kontakte

| Rolle | Kontakt | Erreichbarkeit |
|-------|---------|----------------|
| Admin | TBD | 24/7 |
| Backup | TBD | Geschäftszeiten |
| Security | TBD | 24/7 |

---

**Letzte Aktualisierung:** 2025-12-04
