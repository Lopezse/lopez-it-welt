#!/bin/bash

# =====================================================
# Enterprise-Installation Script - Lopez IT Welt
# =====================================================
# Erstellt: 2025-07-05
# Zweck: Enterprise-System Installation
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

# System-Check
check_system_requirements() {
    log "Prüfe System-Anforderungen..."
    
    # CPU-Check
    CPU_CORES=$(nproc)
    if [ $CPU_CORES -lt 16 ]; then
        error "Mindestens 16 CPU-Cores erforderlich. Gefunden: $CPU_CORES"
    fi
    log "✓ CPU-Cores: $CPU_CORES"
    
    # RAM-Check
    RAM_GB=$(free -g | awk '/^Mem:/{print $2}')
    if [ $RAM_GB -lt 64 ]; then
        error "Mindestens 64 GB RAM erforderlich. Gefunden: ${RAM_GB}GB"
    fi
    log "✓ RAM: ${RAM_GB}GB"
    
    # Storage-Check
    STORAGE_GB=$(df -BG / | awk 'NR==2{print $2}' | sed 's/G//')
    if [ $STORAGE_GB -lt 1000 ]; then
        error "Mindestens 1 TB Speicher erforderlich. Gefunden: ${STORAGE_GB}GB"
    fi
    log "✓ Storage: ${STORAGE_GB}GB"
}

# Docker-Installation
install_docker() {
    log "Installiere Docker..."
    
    # Docker Repository hinzufügen
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Pakete aktualisieren und Docker installieren
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Docker Service starten
    sudo systemctl start docker
    sudo systemctl enable docker
    
    # Benutzer zur Docker-Gruppe hinzufügen
    sudo usermod -aG docker $USER
    
    log "✓ Docker installiert"
}

# Kubernetes-Installation
install_kubernetes() {
    log "Installiere Kubernetes (k3s)..."
    
    # k3s installieren
    curl -sfL https://get.k3s.io | sh -
    
    # kubeconfig für Benutzer verfügbar machen
    sudo chmod 644 /etc/rancher/k3s/k3s.yaml
    mkdir -p ~/.kube
    sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
    sudo chown $USER:$USER ~/.kube/config
    
    log "✓ Kubernetes (k3s) installiert"
}

# PostgreSQL-Installation
install_postgresql() {
    log "Installiere PostgreSQL..."
    
    # PostgreSQL Repository hinzufügen
    sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
    
    # PostgreSQL installieren
    sudo apt-get update
    sudo apt-get install -y postgresql-14 postgresql-contrib-14
    
    # PostgreSQL Service starten
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    log "✓ PostgreSQL installiert"
}

# Redis-Installation
install_redis() {
    log "Installiere Redis..."
    
    # Redis installieren
    sudo apt-get install -y redis-server
    
    # Redis konfigurieren
    sudo sed -i 's/bind 127.0.0.1/bind 0.0.0.0/' /etc/redis/redis.conf
    sudo sed -i 's/# requirepass foobared/requirepass enterprise_redis_password/' /etc/redis/redis.conf
    
    # Redis Service starten
    sudo systemctl start redis-server
    sudo systemctl enable redis-server
    
    log "✓ Redis installiert"
}

# Enterprise-System-Installation
install_enterprise_system() {
    log "Installiere Enterprise-System..."
    
    # Enterprise-Verzeichnis erstellen
    sudo mkdir -p /opt/lopez-enterprise
    sudo chown $USER:$USER /opt/lopez-enterprise
    
    # Enterprise-Images herunterladen
    docker pull lopezitwelt/enterprise-api:latest
    docker pull lopezitwelt/enterprise-web:latest
    docker pull lopezitwelt/enterprise-db:latest
    docker pull lopezitwelt/enterprise-redis:latest
    
    # Enterprise-Konfiguration erstellen
    cat > /opt/lopez-enterprise/docker-compose.yml << 'EOF'
version: '3.8'

services:
  enterprise-api:
    image: lopezitwelt/enterprise-api:latest
    container_name: lopez-enterprise-api
    restart: unless-stopped
    ports:
      - "3000:3000"
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

  enterprise-web:
    image: lopezitwelt/enterprise-web:latest
    container_name: lopez-enterprise-web
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - enterprise-api
    networks:
      - enterprise-network

  enterprise-db:
    image: lopezitwelt/enterprise-db:latest
    container_name: lopez-enterprise-db
    restart: unless-stopped
    environment:
      - POSTGRES_DB=enterprise
      - POSTGRES_USER=enterprise
      - POSTGRES_PASSWORD=enterprise_password
    volumes:
      - enterprise-db-data:/var/lib/postgresql/data
    networks:
      - enterprise-network

  enterprise-redis:
    image: lopezitwelt/enterprise-redis:latest
    container_name: lopez-enterprise-redis
    restart: unless-stopped
    command: redis-server --requirepass enterprise_redis_password
    volumes:
      - enterprise-redis-data:/data
    networks:
      - enterprise-network

volumes:
  enterprise-db-data:
  enterprise-redis-data:

networks:
  enterprise-network:
    driver: bridge
EOF

    # Enterprise-System starten
    cd /opt/lopez-enterprise
    docker-compose up -d
    
    log "✓ Enterprise-System installiert und gestartet"
}

# Multi-Tenant-Setup
setup_multi_tenant() {
    log "Konfiguriere Multi-Tenant-Setup..."
    
    # Tenant-Datenbanken erstellen
    docker exec lopez-enterprise-db psql -U enterprise -d enterprise -c "
        CREATE DATABASE tenant_1;
        CREATE DATABASE tenant_2;
        CREATE DATABASE tenant_3;
    "
    
    # Tenant-Isolation konfigurieren
    cat > /opt/lopez-enterprise/tenant-config.json << 'EOF'
{
  "tenants": [
    {
      "id": "tenant_1",
      "name": "Enterprise Tenant 1",
      "domain": "tenant1.lopez-enterprise.com",
      "database": "tenant_1",
      "isolation": "database_per_tenant",
      "features": ["basic", "security", "compliance"]
    },
    {
      "id": "tenant_2", 
      "name": "Enterprise Tenant 2",
      "domain": "tenant2.lopez-enterprise.com",
      "database": "tenant_2",
      "isolation": "database_per_tenant",
      "features": ["basic", "security", "compliance", "scaling"]
    },
    {
      "id": "tenant_3",
      "name": "Enterprise Tenant 3", 
      "domain": "tenant3.lopez-enterprise.com",
      "database": "tenant_3",
      "isolation": "database_per_tenant",
      "features": ["basic", "security", "compliance", "scaling", "monitoring"]
    }
  ]
}
EOF

    log "✓ Multi-Tenant-Setup konfiguriert"
}

# Security-Framework-Setup
setup_security_framework() {
    log "Konfiguriere Security-Framework..."
    
    # SSL-Zertifikate generieren
    mkdir -p /opt/lopez-enterprise/ssl
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /opt/lopez-enterprise/ssl/enterprise.key \
        -out /opt/lopez-enterprise/ssl/enterprise.crt \
        -subj "/C=DE/ST=NRW/L=Dortmund/O=Lopez IT Welt/CN=lopez-enterprise.com"
    
    # Firewall-Regeln konfigurieren
    sudo ufw allow 22/tcp    # SSH
    sudo ufw allow 80/tcp    # HTTP
    sudo ufw allow 443/tcp   # HTTPS
    sudo ufw allow 3000/tcp  # API
    sudo ufw --force enable
    
    # Security-Monitoring einrichten
    cat > /opt/lopez-enterprise/security-monitoring.yml << 'EOF'
security:
  monitoring:
    enabled: true
    logLevel: "info"
    alerting:
      email: "security@lopez-enterprise.com"
      slack: "https://hooks.slack.com/services/..."
  
  authentication:
    mfa: true
    sessionTimeout: 3600
    maxLoginAttempts: 5
    
  encryption:
    algorithm: "AES-256-GCM"
    keyRotation: 30
    
  audit:
    enabled: true
    retention: 90
    realTime: true
EOF

    log "✓ Security-Framework konfiguriert"
}

# Compliance-Framework-Setup
setup_compliance_framework() {
    log "Konfiguriere Compliance-Framework..."
    
    # GDPR-Compliance
    cat > /opt/lopez-enterprise/gdpr-config.json << 'EOF'
{
  "gdpr": {
    "enabled": true,
    "dataRetention": 730,
    "rightToBeForgotten": true,
    "dataPortability": true,
    "consentManagement": true,
    "dpoContact": "dpo@lopez-enterprise.com"
  }
}
EOF

    # ISO-27001-Compliance
    cat > /opt/lopez-enterprise/iso27001-config.json << 'EOF'
{
  "iso27001": {
    "enabled": true,
    "isms": {
      "scope": "Enterprise System",
      "policy": "Information Security Policy",
      "objectives": ["Confidentiality", "Integrity", "Availability"]
    },
    "riskAssessment": {
      "enabled": true,
      "frequency": "quarterly"
    }
  }
}
EOF

    # SOC-2-Compliance
    cat > /opt/lopez-enterprise/soc2-config.json << 'EOF'
{
  "soc2": {
    "enabled": true,
    "trustServiceCriteria": {
      "security": true,
      "availability": true,
      "processingIntegrity": true,
      "confidentiality": true,
      "privacy": true
    }
  }
}
EOF

    log "✓ Compliance-Framework konfiguriert"
}

# Auto-Scaling-Setup
setup_auto_scaling() {
    log "Konfiguriere Auto-Scaling..."
    
    # Kubernetes HPA konfigurieren
    cat > /opt/lopez-enterprise/hpa-config.yaml << 'EOF'
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: enterprise-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: enterprise-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
EOF

    # Load-Balancer konfigurieren
    cat > /opt/lopez-enterprise/loadbalancer-config.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: enterprise-loadbalancer
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: enterprise-api
EOF

    log "✓ Auto-Scaling konfiguriert"
}

# Monitoring-Setup
setup_monitoring() {
    log "Konfiguriere Monitoring..."
    
    # Prometheus konfigurieren
    cat > /opt/lopez-enterprise/prometheus-config.yml << 'EOF'
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'enterprise-api'
    static_configs:
      - targets: ['enterprise-api:3000']
    metrics_path: '/metrics'
    
  - job_name: 'enterprise-web'
    static_configs:
      - targets: ['enterprise-web:80']
    metrics_path: '/metrics'
EOF

    # Grafana-Dashboards konfigurieren
    mkdir -p /opt/lopez-enterprise/grafana/dashboards
    cat > /opt/lopez-enterprise/grafana/dashboards/enterprise-overview.json << 'EOF'
{
  "dashboard": {
    "title": "Enterprise Overview",
    "panels": [
      {
        "title": "API Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_request_duration_seconds_sum[5m])"
          }
        ]
      },
      {
        "title": "CPU Usage",
        "type": "graph", 
        "targets": [
          {
            "expr": "rate(container_cpu_usage_seconds_total[5m])"
          }
        ]
      }
    ]
  }
}
EOF

    log "✓ Monitoring konfiguriert"
}

# Hauptfunktion
main() {
    log "Starte Enterprise-Installation..."
    
    check_system_requirements
    install_docker
    install_kubernetes
    install_postgresql
    install_redis
    install_enterprise_system
    setup_multi_tenant
    setup_security_framework
    setup_compliance_framework
    setup_auto_scaling
    setup_monitoring
    
    log "✅ Enterprise-Installation erfolgreich abgeschlossen!"
    log "🌐 Enterprise-System verfügbar unter: https://lopez-enterprise.com"
    log "📊 Monitoring verfügbar unter: https://monitoring.lopez-enterprise.com"
    log "🔒 Security-Dashboard verfügbar unter: https://security.lopez-enterprise.com"
}

# Script ausführen
main "$@" 