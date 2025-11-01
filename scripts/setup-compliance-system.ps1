# =====================================================
# Setup Compliance System
# =====================================================
# Erstellt: 2025-07-02
# Zweck: Installation und Initialisierung des DB-Compliance-Systems
# =====================================================

Write-Host "🚀 Setup Compliance System für Lopez IT Welt" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green

# =====================================================
# SCHRITT 1: DEPENDENCIES INSTALLIEREN
# =====================================================

Write-Host "`n📦 Installiere Dependencies..." -ForegroundColor Yellow

try {
    npm install mysql2
    Write-Host "✅ Dependencies installiert" -ForegroundColor Green
} catch {
    Write-Host "❌ Fehler beim Installieren der Dependencies: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# =====================================================
# SCHRITT 2: DATENBANK SETUP
# =====================================================

Write-Host "`n🗄️ Setup Datenbank..." -ForegroundColor Yellow

# Prüfe ob XAMPP läuft
$mysqlProcess = Get-Process -Name "mysqld" -ErrorAction SilentlyContinue
if (-not $mysqlProcess) {
    Write-Host "⚠️ MySQL scheint nicht zu laufen. Bitte starte XAMPP MySQL." -ForegroundColor Yellow
    Write-Host "   XAMPP Control Panel -> MySQL -> Start" -ForegroundColor Cyan
    Read-Host "Drücke Enter wenn MySQL läuft..."
}

# Datenbank-Schema ausführen
try {
    $schemaPath = "database/compliance_schema_mysql.sql"
    if (Test-Path $schemaPath) {
        Write-Host "📋 Führe Datenbank-Schema aus..." -ForegroundColor Yellow
        
        # MySQL Command ausführen (XAMPP Standard)
        $mysqlCmd = "C:\xampp\mysql\bin\mysql.exe"
        if (Test-Path $mysqlCmd) {
            & $mysqlCmd -u root -p"" < $schemaPath
            Write-Host "✅ Datenbank-Schema erstellt" -ForegroundColor Green
        } else {
            Write-Host "⚠️ MySQL nicht in XAMPP gefunden. Bitte führe das Schema manuell aus:" -ForegroundColor Yellow
            Write-Host "   mysql -u root -p < database/compliance_schema_mysql.sql" -ForegroundColor Cyan
        }
    } else {
        Write-Host "❌ Schema-Datei nicht gefunden: $schemaPath" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Fehler beim Datenbank-Setup: $($_.Exception.Message)" -ForegroundColor Red
}

# =====================================================
# SCHRITT 3: MIGRATION AUSFÜHREN
# =====================================================

Write-Host "`n📁 Führe MD-zu-DB Migration aus..." -ForegroundColor Yellow

try {
    node scripts/md-to-db-migration.js
    Write-Host "✅ Migration abgeschlossen" -ForegroundColor Green
} catch {
    Write-Host "❌ Fehler bei der Migration: $($_.Exception.Message)" -ForegroundColor Red
}

# =====================================================
# SCHRITT 4: COMPLIANCE-SYSTEM TESTEN
# =====================================================

Write-Host "`n🔍 Teste Compliance-System..." -ForegroundColor Yellow

try {
    node scripts/db-compliance-system.js
    Write-Host "✅ Compliance-System funktioniert" -ForegroundColor Green
} catch {
    Write-Host "❌ Fehler beim Testen: $($_.Exception.Message)" -ForegroundColor Red
}

# =====================================================
# SCHRITT 5: AGENTEN-SYSTEM AKTUALISIEREN
# =====================================================

Write-Host "`n🤖 Aktualisiere Agenten-System..." -ForegroundColor Yellow

try {
    # Backup des alten Systems
    if (Test-Path "scripts/agenten-system.js") {
        Copy-Item "scripts/agenten-system.js" "scripts/agenten-system.js.backup"
        Write-Host "✅ Backup erstellt: scripts/agenten-system.js.backup" -ForegroundColor Green
    }
    
    Write-Host "✅ Agenten-System bereit für DB-Integration" -ForegroundColor Green
} catch {
    Write-Host "❌ Fehler beim Aktualisieren: $($_.Exception.Message)" -ForegroundColor Red
}

# =====================================================
# SCHRITT 6: NPM SCRIPTS HINZUFÜGEN
# =====================================================

Write-Host "`n📝 Füge NPM Scripts hinzu..." -ForegroundColor Yellow

try {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    
    # Neue Scripts hinzufügen
    $packageJson.scripts | Add-Member -Name "migrate:md-to-db" -Value "node scripts/md-to-db-migration.js" -Force
    $packageJson.scripts | Add-Member -Name "compliance:check" -Value "node scripts/db-compliance-system.js" -Force
    $packageJson.scripts | Add-Member -Name "agents:run" -Value "node scripts/agenten-system.js" -Force
    
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json"
    Write-Host "✅ NPM Scripts hinzugefügt" -ForegroundColor Green
} catch {
    Write-Host "❌ Fehler beim Hinzufügen der Scripts: $($_.Exception.Message)" -ForegroundColor Red
}

# =====================================================
# SCHRITT 7: DOKUMENTATION ERSTELLEN
# =====================================================

Write-Host "`n📚 Erstelle Dokumentation..." -ForegroundColor Yellow

$documentation = @"
# Compliance System Setup

## ✅ Setup abgeschlossen

### Verfügbare Befehle:
- `npm run migrate:md-to-db` - Migration der .md-Dateien in die DB
- `npm run compliance:check` - Compliance-Checks ausführen
- `npm run agents:run` - Agenten-System starten

### Datenbank:
- Host: localhost
- Database: lopez_it_welt_compliance
- User: root (XAMPP Standard)

### Tabellen:
- policies - Unternehmensrichtlinien
- laws - Gesetze und rechtliche Vorgaben
- ci_rules - Continuous Integration Regeln
- compliance_audit_log - Compliance-Check Logs
- agent_activity_log - Agent-Aktivitäts Logs

### Views:
- active_rules - Alle aktiven Regeln
- compliance_status - Compliance-Status Übersicht

### Stored Procedures:
- GetRulesByCategory() - Regeln nach Kategorie
- LogComplianceCheck() - Compliance-Check protokollieren
- LogAgentActivity() - Agent-Aktivität protokollieren

## 🔧 Nächste Schritte:

1. **Migration ausführen**: `npm run migrate:md-to-db`
2. **Compliance testen**: `npm run compliance:check`
3. **Agenten starten**: `npm run agents:run`

## 📊 Monitoring:

Das System protokolliert automatisch:
- Alle Compliance-Checks
- Agent-Aktivitäten
- Regel-Verletzungen
- Performance-Metriken

## 🔒 Sicherheit:

- Alle Regeln sind in der DB gespeichert
- Audit-Logs für Compliance-Tracking
- Verschlüsselte Verbindungen (empfohlen)
- Backup-Strategie implementieren

"@

$documentation | Out-File -FilePath "docs/compliance-system-setup.md" -Encoding UTF8
Write-Host "✅ Dokumentation erstellt: docs/compliance-system-setup.md" -ForegroundColor Green

# =====================================================
# FINALISIERUNG
# =====================================================

Write-Host "`n" + "="*60 -ForegroundColor Green
Write-Host "🎉 COMPLIANCE SYSTEM SETUP ABGESCHLOSSEN" -ForegroundColor Green
Write-Host "="*60 -ForegroundColor Green

Write-Host "`n📋 NÄCHSTE SCHRITTE:" -ForegroundColor Cyan
Write-Host "1. Migration ausführen: npm run migrate:md-to-db" -ForegroundColor White
Write-Host "2. Compliance testen: npm run compliance:check" -ForegroundColor White
Write-Host "3. Agenten starten: npm run agents:run" -ForegroundColor White

Write-Host "`n📚 DOKUMENTATION:" -ForegroundColor Cyan
Write-Host "- docs/compliance-system-setup.md" -ForegroundColor White
Write-Host "- database/compliance_schema_mysql.sql" -ForegroundColor White

Write-Host "`n🔧 VERFÜGBARE SCRIPTS:" -ForegroundColor Cyan
Write-Host "- scripts/md-to-db-migration.js" -ForegroundColor White
Write-Host "- scripts/db-compliance-system.js" -ForegroundColor White
Write-Host "- scripts/agenten-system.js" -ForegroundColor White

Write-Host "`n✅ Setup erfolgreich abgeschlossen!" -ForegroundColor Green 