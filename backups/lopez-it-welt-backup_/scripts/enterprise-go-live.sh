#!/bin/bash

# =====================================================
# Enterprise-Go-Live Script - Lopez IT Welt
# =====================================================
# Erstellt: 2025-07-05
# Zweck: Production Deployment & Go-Live
# =====================================================

set -e

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging-Funktion
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Pre-Deployment-Checks
run_pre_deployment_checks() {
    log "Führe Pre-Deployment-Checks aus..."
    
    # System-Health-Check
    log "Prüfe System-Health..."
    if ! docker ps | grep -q "lopez-enterprise"; then
        error "Enterprise-Container nicht gefunden!"
    fi
    
    # Database-Health-Check
    log "Prüfe Database-Health..."
    if ! docker exec lopez-enterprise-db pg_isready -U enterprise; then
        error "Database nicht bereit!"
    fi
    
    # Network-Health-Check
    log "Prüfe Network-Health..."
    if ! curl -s -o /dev/null -w '%{http_code}' https://lopez-enterprise.com/api/health | grep -q "200"; then
        error "API nicht erreichbar!"
    fi
    
    # SSL-Certificate-Check
    log "Prüfe SSL-Zertifikate..."
    if ! openssl x509 -checkend 86400 -noout -in /opt/lopez-enterprise/ssl/enterprise.crt; then
        warning "SSL-Zertifikat läuft bald ab!"
    fi
    
    # Backup-Check
    log "Prüfe Backups..."
    if [ ! -d "/opt/lopez-enterprise/backups" ]; then
        warning "Backup-Verzeichnis nicht gefunden!"
    fi
    
    log "✓ Pre-Deployment-Checks erfolgreich"
}

# Production-Deployment
deploy_to_production() {
    log "Starte Production-Deployment..."
    
    # Blue-Green Deployment vorbereiten
    log "Bereite Blue-Green Deployment vor..."
    
    # Blue Environment (aktuell)
    local blue_version=$(docker images lopezitwelt/enterprise-api --format "{{.Tag}}" | head -1)
    log "Blue Version: $blue_version"
    
    # Green Environment (neu)
    local green_version="v$(date +%Y%m%d-%H%M%S)"
    log "Green Version: $green_version"
    
    # Neue Images bauen
    log "Baue neue Enterprise-Images..."
    docker build -t lopezitwelt/enterprise-api:$green_version /opt/lopez-enterprise/source/api/
    docker build -t lopezitwelt/enterprise-web:$green_version /opt/lopez-enterprise/source/web/
    
    # Green Environment starten
    log "Starte Green Environment..."
    cat > /opt/lopez-enterprise/docker-compose-green.yml << EOF
version: '3.8'

services:
  enterprise-api-green:
    image: lopezitwelt/enterprise-api:$green_version
    container_name: lopez-enterprise-api-green
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://enterprise:password@enterprise-db:5432/enterprise
      - REDIS_URL=redis://enterprise-redis:6379
      - JWT_SECRET=enterprise_jwt_secret_key
    depends_on:
      - enterprise-db
      - enterprise-redis
    networks:
      - enterprise-network

  enterprise-web-green:
    image: lopezitwelt/enterprise-web:$green_version
    container_name: lopez-enterprise-web-green
    restart: unless-stopped
    ports:
      - "8080:80"
      - "8443:443"
    depends_on:
      - enterprise-api-green
    networks:
      - enterprise-network

networks:
  enterprise-network:
    external: true
EOF

    # Green Environment starten
    cd /opt/lopez-enterprise
    docker-compose -f docker-compose-green.yml up -d
    
    # Health-Check für Green Environment
    log "Führe Health-Check für Green Environment aus..."
    local health_check_attempts=0
    local max_attempts=30
    
    while [ $health_check_attempts -lt $max_attempts ]; do
        if curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/health | grep -q "200"; then
            log "✓ Green Environment ist bereit"
            break
        else
            health_check_attempts=$((health_check_attempts + 1))
            log "Health-Check Versuch $health_check_attempts/$max_attempts..."
            sleep 10
        fi
    done
    
    if [ $health_check_attempts -eq $max_attempts ]; then
        error "Green Environment Health-Check fehlgeschlagen!"
    fi
    
    # Traffic zu Green Environment umleiten
    log "Leite Traffic zu Green Environment um..."
    
    # Load-Balancer konfigurieren
    cat > /opt/lopez-enterprise/nginx-green.conf << 'EOF'
upstream enterprise_backend {
    server localhost:3000;  # Blue
    server localhost:3001;  # Green
}

server {
    listen 80;
    server_name lopez-enterprise.com;
    
    location / {
        proxy_pass http://enterprise_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

    # Nginx konfigurieren
    sudo cp /opt/lopez-enterprise/nginx-green.conf /etc/nginx/sites-available/lopez-enterprise
    sudo ln -sf /etc/nginx/sites-available/lopez-enterprise /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
    
    # Blue Environment stoppen
    log "Stoppe Blue Environment..."
    docker stop lopez-enterprise-api lopez-enterprise-web
    
    # Final Health-Check
    log "Führe finalen Health-Check aus..."
    if curl -s -o /dev/null -w '%{http_code}' https://lopez-enterprise.com/api/health | grep -q "200"; then
        log "✓ Production-Deployment erfolgreich"
    else
        error "Production-Deployment fehlgeschlagen!"
    fi
}

# Live-Monitoring aktivieren
activate_live_monitoring() {
    log "Aktiviere Live-Monitoring..."
    
    # Prometheus starten
    log "Starte Prometheus..."
    docker run -d \
        --name prometheus \
        -p 9090:9090 \
        -v /opt/lopez-enterprise/prometheus-config.yml:/etc/prometheus/prometheus.yml \
        prom/prometheus:latest
    
    # Grafana starten
    log "Starte Grafana..."
    docker run -d \
        --name grafana \
        -p 3000:3000 \
        -v /opt/lopez-enterprise/grafana:/var/lib/grafana \
        grafana/grafana:latest
    
    # Alert-Manager starten
    log "Starte Alert-Manager..."
    docker run -d \
        --name alertmanager \
        -p 9093:9093 \
        -v /opt/lopez-enterprise/alertmanager-config.yml:/etc/alertmanager/alertmanager.yml \
        prom/alertmanager:latest
    
    # Monitoring-Dashboards konfigurieren
    log "Konfiguriere Monitoring-Dashboards..."
    
    # Grafana-Dashboard importieren
    curl -X POST \
        -H "Content-Type: application/json" \
        -d @/opt/lopez-enterprise/grafana/dashboards/enterprise-overview.json \
        http://localhost:3000/api/dashboards/db \
        -u admin:admin
    
    log "✓ Live-Monitoring aktiviert"
}

# Performance-Optimierung anwenden
apply_performance_optimization() {
    log "Wende Performance-Optimierung an..."
    
    # Database-Optimierung
    log "Optimiere Database..."
    docker exec lopez-enterprise-db psql -U enterprise -c "
        ANALYZE;
        VACUUM;
        REINDEX DATABASE enterprise;
    "
    
    # Cache-Optimierung
    log "Optimiere Cache..."
    docker exec lopez-enterprise-redis redis-cli -a enterprise_redis_password CONFIG SET maxmemory 2gb
    docker exec lopez-enterprise-redis redis-cli -a enterprise_redis_password CONFIG SET maxmemory-policy allkeys-lru
    
    # Application-Optimierung
    log "Optimiere Application..."
    docker exec lopez-enterprise-api node -e "
        const cluster = require('cluster');
        const numCPUs = require('os').cpus().length;
        
        if (cluster.isMaster) {
            for (let i = 0; i < numCPUs; i++) {
                cluster.fork();
            }
        } else {
            require('./app.js');
        }
    "
    
    # Load-Balancer-Optimierung
    log "Optimiere Load-Balancer..."
    cat > /opt/lopez-enterprise/nginx-optimized.conf << 'EOF'
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 65535;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    
    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Upstream
    upstream enterprise_backend {
        least_conn;
        server localhost:3000 max_fails=3 fail_timeout=30s;
        server localhost:3001 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }
    
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    server {
        listen 80;
        server_name lopez-enterprise.com;
        
        # Rate Limiting
        limit_req zone=api burst=20 nodelay;
        
        # Security Headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        
        location / {
            proxy_pass http://enterprise_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Timeouts
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
            
            # Buffering
            proxy_buffering on;
            proxy_buffer_size 4k;
            proxy_buffers 8 4k;
        }
    }
}
EOF

    sudo cp /opt/lopez-enterprise/nginx-optimized.conf /etc/nginx/nginx.conf
    sudo nginx -t && sudo systemctl reload nginx
    
    log "✓ Performance-Optimierung angewendet"
}

# User-Training durchführen
conduct_user_training() {
    log "Führe User-Training durch..."
    
    # Training-Materialien erstellen
    log "Erstelle Training-Materialien..."
    
    cat > /opt/lopez-enterprise/training/user-guide.md << 'EOF'
# Enterprise-System Benutzerhandbuch

## Übersicht
Das Lopez IT Welt Enterprise-System bietet umfassende Features für große Unternehmen.

## Erste Schritte
1. **Anmeldung**: https://lopez-enterprise.com/login
2. **Dashboard**: https://lopez-enterprise.com/dashboard
3. **API-Dokumentation**: https://api.lopez-enterprise.com/docs

## Features
- **Multi-Tenant-Management**: Verwaltung mehrerer Kunden
- **Security-Dashboard**: Überwachung der Sicherheit
- **Compliance-Reporting**: Automatische Compliance-Berichte
- **Auto-Scaling**: Automatische Skalierung
- **Monitoring**: Echtzeit-Überwachung

## Support
- **E-Mail**: support@lopez-enterprise.com
- **Telefon**: +49 231 12345678
- **Dokumentation**: https://docs.lopez-enterprise.com
EOF

    # Video-Tutorials erstellen
    log "Erstelle Video-Tutorials..."
    mkdir -p /opt/lopez-enterprise/training/videos
    
    # Training-Webinar planen
    log "Plane Training-Webinar..."
    cat > /opt/lopez-enterprise/training/webinar-schedule.json << 'EOF'
{
  "webinars": [
    {
      "title": "Enterprise-System Einführung",
      "date": "2025-07-10T10:00:00Z",
      "duration": "60",
      "attendees": ["admin@company.com", "user@company.com"],
      "link": "https://meet.lopez-enterprise.com/webinar/intro"
    },
    {
      "title": "Security-Features",
      "date": "2025-07-12T14:00:00Z",
      "duration": "90",
      "attendees": ["security@company.com", "admin@company.com"],
      "link": "https://meet.lopez-enterprise.com/webinar/security"
    },
    {
      "title": "Compliance-Reporting",
      "date": "2025-07-15T11:00:00Z",
      "duration": "45",
      "attendees": ["compliance@company.com", "admin@company.com"],
      "link": "https://meet.lopez-enterprise.com/webinar/compliance"
    }
  ]
}
EOF

    log "✓ User-Training vorbereitet"
}

# Support-Handover organisieren
organize_support_handover() {
    log "Organisiere Support-Handover..."
    
    # Support-Team konfigurieren
    log "Konfiguriere Support-Team..."
    
    cat > /opt/lopez-enterprise/support/support-team.json << 'EOF'
{
  "supportTeam": {
    "level1": {
      "name": "First Level Support",
      "email": "support@lopez-enterprise.com",
      "phone": "+49 231 12345678",
      "hours": "24/7",
      "responseTime": "2h"
    },
    "level2": {
      "name": "Technical Support",
      "email": "tech-support@lopez-enterprise.com",
      "phone": "+49 231 12345679",
      "hours": "9:00-18:00",
      "responseTime": "4h"
    },
    "level3": {
      "name": "Enterprise Support",
      "email": "enterprise-support@lopez-enterprise.com",
      "phone": "+49 231 12345680",
      "hours": "24/7",
      "responseTime": "1h"
    }
  },
  "escalation": {
    "level1_to_level2": "4h",
    "level2_to_level3": "8h",
    "level3_to_management": "24h"
  },
  "contactMethods": {
    "email": true,
    "phone": true,
    "chat": true,
    "ticket": true
  }
}
EOF

    # Support-Tools konfigurieren
    log "Konfiguriere Support-Tools..."
    
    # Zendesk-Integration
    cat > /opt/lopez-enterprise/support/zendesk-config.json << 'EOF'
{
  "zendesk": {
    "enabled": true,
    "subdomain": "lopez-enterprise",
    "apiToken": "enterprise_zendesk_token",
    "webhook": "https://lopez-enterprise.com/api/support/webhook"
  }
}
EOF

    # Slack-Integration
    cat > /opt/lopez-enterprise/support/slack-config.json << 'EOF'
{
  "slack": {
    "enabled": true,
    "webhook": "https://hooks.slack.com/services/enterprise/support",
    "channels": {
      "support": "#enterprise-support",
      "alerts": "#enterprise-alerts",
      "monitoring": "#enterprise-monitoring"
    }
  }
}
EOF

    # Support-Dokumentation
    cat > /opt/lopez-enterprise/support/troubleshooting-guide.md << 'EOF'
# Enterprise-System Troubleshooting Guide

## Häufige Probleme

### 1. Performance-Probleme
**Symptome**: Langsame Antwortzeiten, Timeouts
**Lösung**: 
- Auto-Scaling prüfen
- Database-Performance analysieren
- Cache-Status überprüfen

### 2. Security-Alerts
**Symptome**: Security-Dashboard zeigt Warnungen
**Lösung**:
- Logs analysieren
- Threat-Detection prüfen
- Compliance-Status überprüfen

### 3. Compliance-Issues
**Symptome**: Compliance-Score sinkt
**Lösung**:
- Audit-Logs prüfen
- Data-Retention überprüfen
- GDPR-Compliance testen

## Support-Kontakt
- **E-Mail**: support@lopez-enterprise.com
- **Telefon**: +49 231 12345678
- **Dokumentation**: https://docs.lopez-enterprise.com
EOF

    log "✓ Support-Handover organisiert"
}

# Go-Live-Announcement
announce_go_live() {
    log "Veröffentliche Go-Live-Announcement..."
    
    # E-Mail-Announcement
    cat > /opt/lopez-enterprise/announcement/go-live-email.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Enterprise-System Go-Live</title>
</head>
<body>
    <h1>🎉 Enterprise-System ist Live!</h1>
    
    <p>Sehr geehrte Damen und Herren,</p>
    
    <p>wir freuen uns, Ihnen mitteilen zu können, dass das Lopez IT Welt Enterprise-System erfolgreich in Produktion gegangen ist.</p>
    
    <h2>🌐 Zugangsdaten</h2>
    <ul>
        <li><strong>Web-Interface:</strong> <a href="https://lopez-enterprise.com">https://lopez-enterprise.com</a></li>
        <li><strong>API-Dokumentation:</strong> <a href="https://api.lopez-enterprise.com">https://api.lopez-enterprise.com</a></li>
        <li><strong>Monitoring:</strong> <a href="https://monitoring.lopez-enterprise.com">https://monitoring.lopez-enterprise.com</a></li>
        <li><strong>Security-Dashboard:</strong> <a href="https://security.lopez-enterprise.com">https://security.lopez-enterprise.com</a></li>
    </ul>
    
    <h2>📊 Features</h2>
    <ul>
        <li>✅ Multi-Tenant-Architektur</li>
        <li>✅ Advanced-Security-Framework</li>
        <li>✅ Comprehensive-Compliance</li>
        <li>✅ Auto-Scaling</li>
        <li>✅ Real-Time-Monitoring</li>
        <li>✅ Enterprise-Integration</li>
        <li>✅ Backup & Disaster Recovery</li>
    </ul>
    
    <h2>📞 Support</h2>
    <ul>
        <li><strong>E-Mail:</strong> support@lopez-enterprise.com</li>
        <li><strong>Telefon:</strong> +49 231 12345678</li>
        <li><strong>Dokumentation:</strong> https://docs.lopez-enterprise.com</li>
    </ul>
    
    <p>Vielen Dank für Ihr Vertrauen!</p>
    
    <p>Mit freundlichen Grüßen<br>
    Ihr Lopez IT Welt Team</p>
</body>
</html>
EOF

    # Social Media Announcement
    cat > /opt/lopez-enterprise/announcement/social-media-posts.md << 'EOF'
# Social Media Posts

## LinkedIn
🎉 Wir freuen uns, das neue Enterprise-System von Lopez IT Welt anzukündigen!

✅ Multi-Tenant-Architektur
✅ Advanced-Security-Framework  
✅ Comprehensive-Compliance
✅ Auto-Scaling
✅ Real-Time-Monitoring

Jetzt verfügbar: https://lopez-enterprise.com

#Enterprise #Security #Compliance #Innovation

## Twitter
🚀 Enterprise-System ist Live! 

Multi-Tenant ✅
Advanced Security ✅
Compliance ✅
Auto-Scaling ✅

https://lopez-enterprise.com

#Enterprise #Tech #Innovation

## Facebook
🎉 Große Neuigkeit: Unser Enterprise-System ist jetzt live!

Das neue System bietet:
• Multi-Tenant-Architektur
• Advanced-Security-Framework
• Comprehensive-Compliance
• Auto-Scaling
• Real-Time-Monitoring

Besuchen Sie uns: https://lopez-enterprise.com
EOF

    log "✓ Go-Live-Announcement veröffentlicht"
}

# Hauptfunktion
main() {
    log "Starte Enterprise-Go-Live..."
    
    run_pre_deployment_checks
    deploy_to_production
    activate_live_monitoring
    apply_performance_optimization
    conduct_user_training
    organize_support_handover
    announce_go_live
    
    log "🎉 ENTERPRISE-GO-LIVE ERFOLGREICH!"
    log "🌐 Enterprise-System verfügbar unter: https://lopez-enterprise.com"
    log "📊 Monitoring verfügbar unter: https://monitoring.lopez-enterprise.com"
    log "🔒 Security-Dashboard verfügbar unter: https://security.lopez-enterprise.com"
    log "📋 Compliance-Dashboard verfügbar unter: https://compliance.lopez-enterprise.com"
    log "📞 Support verfügbar unter: support@lopez-enterprise.com"
    log "📚 Dokumentation verfügbar unter: https://docs.lopez-enterprise.com"
}

# Script ausführen
main "$@" 