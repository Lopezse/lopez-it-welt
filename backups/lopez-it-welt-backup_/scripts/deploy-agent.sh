#!/bin/bash

# =====================================================
# KI-Agenten Service Deployment Script
# =====================================================
# Erstellt: 2025-07-05 14:30:00
# Autor: Ramiro Lopez Rodriguez
# Zweck: Automatisiertes Deployment des Agent-Services
# =====================================================

set -e

# =====================================================
# Farben für Output
# =====================================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# =====================================================
# Logging Funktionen
# =====================================================
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# =====================================================
# Konfiguration
# =====================================================
SERVICE_NAME="lopez-it-welt-compliance-agent"
DOCKER_IMAGE="lopez-it-welt-agent"
DOCKER_TAG="latest"
PORT="4001"
HEALTH_CHECK_URL="http://localhost:${PORT}/health"

# =====================================================
# Hilfsfunktionen
# =====================================================
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker ist nicht installiert!"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        log_error "Docker ist nicht gestartet!"
        exit 1
    fi
    
    log_success "Docker ist verfügbar"
}

check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose ist nicht installiert!"
        exit 1
    fi
    
    log_success "Docker Compose ist verfügbar"
}

check_environment() {
    if [ ! -f ".env" ]; then
        log_warning ".env Datei nicht gefunden, erstelle Standard-Konfiguration..."
        cat > .env << EOF
# =====================================================
# KI-Agenten Service Environment
# =====================================================
NODE_ENV=production
AGENT_PORT=4001
AGENT_API_KEY=your-secure-api-key-here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-db-password
DB_NAME=lopez_it_welt_db
EOF
        log_success ".env Datei erstellt"
    fi
    
    log_success "Environment-Konfiguration geprüft"
}

# =====================================================
# Build Funktionen
# =====================================================
build_image() {
    log_info "Baue Docker Image..."
    
    if docker build -f Dockerfile.agent -t ${DOCKER_IMAGE}:${DOCKER_TAG} .; then
        log_success "Docker Image erfolgreich gebaut"
    else
        log_error "Docker Build fehlgeschlagen"
        exit 1
    fi
}

# =====================================================
# Deployment Funktionen
# =====================================================
deploy_with_docker() {
    log_info "Deploye mit Docker..."
    
    # Stoppe existierenden Container
    if docker ps -q -f name=${SERVICE_NAME} | grep -q .; then
        log_info "Stoppe existierenden Container..."
        docker stop ${SERVICE_NAME}
        docker rm ${SERVICE_NAME}
    fi
    
    # Starte neuen Container
    log_info "Starte neuen Container..."
    docker run -d \
        --name ${SERVICE_NAME} \
        --restart unless-stopped \
        -p ${PORT}:${PORT} \
        --env-file .env \
        ${DOCKER_IMAGE}:${DOCKER_TAG}
    
    log_success "Container gestartet"
}

deploy_with_compose() {
    log_info "Deploye mit Docker Compose..."
    
    # Stoppe existierende Services
    docker-compose -f docker-compose.agent.yml down
    
    # Starte Services
    docker-compose -f docker-compose.agent.yml up -d
    
    log_success "Docker Compose Services gestartet"
}

# =====================================================
# Health Check
# =====================================================
wait_for_health() {
    log_info "Warte auf Service Health Check..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s ${HEALTH_CHECK_URL} > /dev/null; then
            log_success "Service ist gesund und bereit!"
            return 0
        fi
        
        log_info "Versuch $attempt/$max_attempts - Service noch nicht bereit..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log_error "Service Health Check fehlgeschlagen nach $max_attempts Versuchen"
    return 1
}

# =====================================================
# Monitoring
# =====================================================
show_status() {
    log_info "Service Status:"
    echo "=================="
    
    # Container Status
    if docker ps -q -f name=${SERVICE_NAME} | grep -q .; then
        log_success "Container läuft"
        docker ps --filter name=${SERVICE_NAME} --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    else
        log_error "Container läuft nicht"
    fi
    
    echo ""
    
    # Health Check
    if curl -f -s ${HEALTH_CHECK_URL} > /dev/null; then
        log_success "Health Check: OK"
        curl -s ${HEALTH_CHECK_URL} | jq '.' 2>/dev/null || curl -s ${HEALTH_CHECK_URL}
    else
        log_error "Health Check: FAILED"
    fi
    
    echo ""
    
    # Logs (letzte 10 Zeilen)
    log_info "Letzte Logs:"
    docker logs --tail 10 ${SERVICE_NAME} 2>/dev/null || log_warning "Keine Logs verfügbar"
}

# =====================================================
# Cleanup
# =====================================================
cleanup() {
    log_info "Führe Cleanup durch..."
    
    # Stoppe und entferne Container
    docker stop ${SERVICE_NAME} 2>/dev/null || true
    docker rm ${SERVICE_NAME} 2>/dev/null || true
    
    # Entferne ungenutzte Images
    docker image prune -f
    
    log_success "Cleanup abgeschlossen"
}

# =====================================================
# Main Funktion
# =====================================================
main() {
    local command=${1:-deploy}
    
    case $command in
        "deploy")
            log_info "Starte KI-Agenten Service Deployment..."
            check_docker
            check_environment
            build_image
            deploy_with_docker
            wait_for_health
            show_status
            ;;
        "deploy-compose")
            log_info "Starte KI-Agenten Service Deployment mit Docker Compose..."
            check_docker
            check_docker_compose
            check_environment
            deploy_with_compose
            wait_for_health
            show_status
            ;;
        "status")
            show_status
            ;;
        "logs")
            log_info "Zeige Service Logs..."
            docker logs -f ${SERVICE_NAME}
            ;;
        "stop")
            log_info "Stoppe Service..."
            docker stop ${SERVICE_NAME}
            log_success "Service gestoppt"
            ;;
        "restart")
            log_info "Starte Service neu..."
            docker restart ${SERVICE_NAME}
            wait_for_health
            show_status
            ;;
        "cleanup")
            cleanup
            ;;
        "help")
            echo "KI-Agenten Service Deployment Script"
            echo "=================================="
            echo ""
            echo "Verwendung: $0 [COMMAND]"
            echo ""
            echo "Commands:"
            echo "  deploy         - Deploy mit Docker"
            echo "  deploy-compose - Deploy mit Docker Compose"
            echo "  status         - Zeige Service Status"
            echo "  logs           - Zeige Service Logs"
            echo "  stop           - Stoppe Service"
            echo "  restart        - Starte Service neu"
            echo "  cleanup        - Führe Cleanup durch"
            echo "  help           - Zeige diese Hilfe"
            ;;
        *)
            log_error "Unbekannter Command: $command"
            echo "Verwende '$0 help' für verfügbare Commands"
            exit 1
            ;;
    esac
}

# =====================================================
# Script ausführen
# =====================================================
main "$@" 