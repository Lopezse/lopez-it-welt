#!/bin/bash

# 🚀 Lopez IT Welt - Staging Deployment Script
# Automatisches Deployment mit Health-Checks und Rollback

set -e  # Exit on any error

# 📋 Konfiguration
ENVIRONMENT="staging"
APP_NAME="lopez-it-welt"
DOCKER_IMAGE="lopez-it-welt:staging"
CONTAINER_NAME="lopez-it-welt-staging"
PORT=3000
HEALTH_CHECK_URL="http://localhost:3000/api/health"
BACKUP_DIR="/backups/staging"

# 🎨 Colors für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 📝 Logging
LOG_FILE="/var/log/lopez-it-welt-staging-deploy.log"

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

# 🔍 Pre-Deployment Checks
pre_deployment_checks() {
    log "🔍 Pre-Deployment Checks starten..."
    
    # Docker verfügbar?
    if ! command -v docker &> /dev/null; then
        error "Docker ist nicht installiert!"
        exit 1
    fi
    
    # Docker läuft?
    if ! docker info &> /dev/null; then
        error "Docker läuft nicht!"
        exit 1
    fi
    
    # Port verfügbar?
    if netstat -tuln | grep ":$PORT " > /dev/null; then
        warning "Port $PORT ist bereits belegt"
    fi
    
    # Backup-Verzeichnis erstellen
    mkdir -p "$BACKUP_DIR"
    
    success "Pre-Deployment Checks bestanden"
}

# 💾 Backup erstellen
create_backup() {
    log "💾 Backup erstellen..."
    
    if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
        # Container läuft - Backup erstellen
        BACKUP_FILE="$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar"
        docker commit "$CONTAINER_NAME" "$CONTAINER_NAME-backup"
        docker save "$CONTAINER_NAME-backup" > "$BACKUP_FILE"
        success "Backup erstellt: $BACKUP_FILE"
    else
        warning "Kein laufender Container für Backup gefunden"
    fi
}

# 🏗️ Build Docker Image
build_image() {
    log "🏗️ Docker Image bauen..."
    
    docker build \
        --build-arg BUILD_ENV=staging \
        --build-arg BUILD_VERSION=$(date +%Y%m%d-%H%M%S) \
        -t "$DOCKER_IMAGE" \
        .
    
    success "Docker Image gebaut: $DOCKER_IMAGE"
}

# 🛑 Alten Container stoppen
stop_old_container() {
    log "🛑 Alten Container stoppen..."
    
    if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
        docker stop "$CONTAINER_NAME"
        docker rm "$CONTAINER_NAME"
        success "Alter Container gestoppt und entfernt"
    else
        warning "Kein laufender Container gefunden"
    fi
}

# 🚀 Neuen Container starten
start_new_container() {
    log "🚀 Neuen Container starten..."
    
    docker run -d \
        --name "$CONTAINER_NAME" \
        --restart unless-stopped \
        -p "$PORT:3000" \
        -e NODE_ENV=staging \
        -e DATABASE_URL="$DATABASE_URL" \
        -e REDIS_URL="$REDIS_URL" \
        --health-cmd="curl -f $HEALTH_CHECK_URL || exit 1" \
        --health-interval=30s \
        --health-timeout=10s \
        --health-retries=3 \
        --health-start-period=40s \
        "$DOCKER_IMAGE"
    
    success "Neuer Container gestartet: $CONTAINER_NAME"
}

# 🔍 Health Check
health_check() {
    log "🔍 Health Check durchführen..."
    
    # Warten bis Container bereit ist
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f "$HEALTH_CHECK_URL" > /dev/null 2>&1; then
            success "Health Check bestanden"
            return 0
        fi
        
        log "Health Check Versuch $attempt/$max_attempts..."
        sleep 10
        ((attempt++))
    done
    
    error "Health Check fehlgeschlagen nach $max_attempts Versuchen"
    return 1
}

# 🔄 Rollback durchführen
rollback() {
    log "🔄 Rollback durchführen..."
    
    # Neuen Container stoppen
    if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
        docker stop "$CONTAINER_NAME"
        docker rm "$CONTAINER_NAME"
    fi
    
    # Backup wiederherstellen
    local latest_backup=$(ls -t "$BACKUP_DIR"/*.tar 2>/dev/null | head -1)
    if [ -n "$latest_backup" ]; then
        log "Backup wiederherstellen: $latest_backup"
        docker load < "$latest_backup"
        
        # Alten Container starten
        docker run -d \
            --name "$CONTAINER_NAME" \
            --restart unless-stopped \
            -p "$PORT:3000" \
            -e NODE_ENV=staging \
            "$CONTAINER_NAME-backup"
        
        success "Rollback erfolgreich"
    else
        error "Kein Backup für Rollback verfügbar"
        exit 1
    fi
}

# 📊 Post-Deployment Tests
post_deployment_tests() {
    log "📊 Post-Deployment Tests..."
    
    # API Tests
    if curl -f "$HEALTH_CHECK_URL" > /dev/null 2>&1; then
        success "API Health Check bestanden"
    else
        error "API Health Check fehlgeschlagen"
        return 1
    fi
    
    # Performance Test
    local response_time=$(curl -w "%{time_total}" -o /dev/null -s "$HEALTH_CHECK_URL")
    if (( $(echo "$response_time < 2.0" | bc -l) )); then
        success "Performance Test bestanden: ${response_time}s"
    else
        warning "Performance Test: ${response_time}s (langsam)"
    fi
    
    # Log Check
    if docker logs "$CONTAINER_NAME" 2>&1 | grep -q "error\|Error\|ERROR"; then
        warning "Fehler in Container-Logs gefunden"
    else
        success "Log-Check bestanden"
    fi
}

# 📈 Monitoring Setup
setup_monitoring() {
    log "📈 Monitoring Setup..."
    
    # Prometheus Metrics
    if command -v curl &> /dev/null; then
        curl -f "http://localhost:3000/api/metrics" > /dev/null 2>&1 && \
        success "Prometheus Metrics verfügbar" || \
        warning "Prometheus Metrics nicht verfügbar"
    fi
    
    # Grafana Dashboard Update
    if [ -d "/etc/grafana/provisioning" ]; then
        cp -r monitoring/grafana/* /etc/grafana/provisioning/ 2>/dev/null && \
        success "Grafana Dashboards aktualisiert" || \
        warning "Grafana Dashboards Update fehlgeschlagen"
    fi
}

# 🔔 Benachrichtigung senden
send_notification() {
    local status="$1"
    local message="$2"
    
    log "🔔 Benachrichtigung senden: $status - $message"
    
    # Slack Webhook (falls konfiguriert)
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚀 Staging Deployment: $status - $message\"}" \
            "$SLACK_WEBHOOK_URL" > /dev/null 2>&1
    fi
    
    # Email (falls konfiguriert)
    if [ -n "$EMAIL_RECIPIENT" ]; then
        echo "Staging Deployment: $status - $message" | \
        mail -s "Lopez IT Welt Staging Deployment" "$EMAIL_RECIPIENT"
    fi
}

# 📋 Hauptfunktion
main() {
    log "🚀 Staging Deployment startet..."
    
    # Environment Variables
    DATABASE_URL="${DATABASE_URL:-mysql://root:password@localhost:3306/lopez_it_welt}"
    REDIS_URL="${REDIS_URL:-redis://localhost:6379}"
    
    # Pre-Deployment Checks
    pre_deployment_checks
    
    # Backup erstellen
    create_backup
    
    # Build Image
    build_image
    
    # Alten Container stoppen
    stop_old_container
    
    # Neuen Container starten
    start_new_container
    
    # Health Check
    if health_check; then
        # Post-Deployment Tests
        if post_deployment_tests; then
            # Monitoring Setup
            setup_monitoring
            
            # Erfolgreiche Benachrichtigung
            send_notification "SUCCESS" "Deployment erfolgreich abgeschlossen"
            
            success "🚀 Staging Deployment erfolgreich abgeschlossen!"
            exit 0
        else
            error "Post-Deployment Tests fehlgeschlagen"
            rollback
            send_notification "FAILED" "Post-Deployment Tests fehlgeschlagen"
            exit 1
        fi
    else
        error "Health Check fehlgeschlagen"
        rollback
        send_notification "FAILED" "Health Check fehlgeschlagen"
        exit 1
    fi
}

# 🚀 Script ausführen
main "$@" 