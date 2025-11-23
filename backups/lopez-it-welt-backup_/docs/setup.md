# ⚙️ Setup Guide - Lopez IT Welt

## 📋 Übersicht

**Dokument:** Enterprise Setup Guide  
**Version:** 2.0.0  
**Erstellt:** 2025-07-05  
**Zweck:** Vollständige Setup-Anleitung für Enterprise-System

---

## 🚀 Quick Start

### **1. System-Anforderungen prüfen:**

```bash
# CPU-Check (mindestens 16 Cores)
nproc

# RAM-Check (mindestens 64 GB)
free -h

# Storage-Check (mindestens 1 TB)
df -h

# OS-Check (Ubuntu 22.04 empfohlen)
lsb_release -a
```

### **2. Repository klonen:**

```bash
git clone https://github.com/lopez-it-welt/enterprise.git
cd enterprise
```

### **3. Dependencies installieren:**

```bash
# Node.js (Version 18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### **4. Environment konfigurieren:**

```bash
# Environment-Datei erstellen
cp .env.example .env

# Environment-Variablen setzen
export NODE_ENV=production
export DATABASE_URL=postgresql://enterprise:password@localhost:5432/enterprise
export REDIS_URL=redis://localhost:6379
export JWT_SECRET=your_jwt_secret_here
```

---

## 🛠️ Detaillierte Installation

### **1. Betriebssystem Setup:**

```bash
# Ubuntu 22.04 LTS
sudo apt update && sudo apt upgrade -y

# Essential Tools
sudo apt install -y curl wget git vim htop

# Development Tools
sudo apt install -y build-essential python3 python3-pip

# Network Tools
sudo apt install -y net-tools nginx ufw
```

### **2. Database Setup:**

```bash
# PostgreSQL Installation
sudo apt install -y postgresql postgresql-contrib

# PostgreSQL konfigurieren
sudo -u postgres psql -c "CREATE USER enterprise WITH PASSWORD 'enterprise_password';"
sudo -u postgres psql -c "CREATE DATABASE enterprise OWNER enterprise;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE enterprise TO enterprise;"

# PostgreSQL Service starten
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### **3. Redis Setup:**

```bash
# Redis Installation
sudo apt install -y redis-server

# Redis konfigurieren
sudo sed -i 's/bind 127.0.0.1/bind 0.0.0.0/' /etc/redis/redis.conf
sudo sed -i 's/# requirepass foobared/requirepass enterprise_redis_password/' /etc/redis/redis.conf

# Redis Service starten
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### **4. Nginx Setup:**

```bash
# Nginx Installation
sudo apt install -y nginx

# Nginx konfigurieren
sudo tee /etc/nginx/sites-available/lopez-enterprise << 'EOF'
server {
    listen 80;
    server_name lopez-enterprise.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Nginx aktivieren
sudo ln -s /etc/nginx/sites-available/lopez-enterprise /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔧 Application Setup

### **1. Node.js Application:**

```bash
# Dependencies installieren
npm install

# Environment-Datei erstellen
cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://enterprise:enterprise_password@localhost:5432/enterprise
REDIS_URL=redis://:enterprise_redis_password@localhost:6379
JWT_SECRET=your_super_secret_jwt_key_here
SESSION_SECRET=your_super_secret_session_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
EOF

# Database migrieren
npm run migrate

# Seeds ausführen
npm run seed

# Application starten
npm start
```

### **2. Docker Setup:**

```bash
# Docker Images bauen
docker build -t lopezitwelt/enterprise-api:latest .
docker build -t lopezitwelt/enterprise-web:latest ./frontend

# Docker Compose starten
docker-compose up -d

# Status prüfen
docker-compose ps
```

### **3. Kubernetes Setup:**

```bash
# k3s installieren
curl -sfL https://get.k3s.io | sh -

# kubeconfig konfigurieren
sudo chmod 644 /etc/rancher/k3s/k3s.yaml
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $USER:$USER ~/.kube/config

# Kubernetes Deployments
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

---

## 🔒 Security Setup

### **1. SSL-Zertifikate:**

```bash
# Let's Encrypt Certbot
sudo apt install -y certbot python3-certbot-nginx

# SSL-Zertifikat generieren
sudo certbot --nginx -d lopez-enterprise.com -d www.lopez-enterprise.com

# Auto-Renewal konfigurieren
sudo crontab -e
# Füge hinzu: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **2. Firewall konfigurieren:**

```bash
# UFW aktivieren
sudo ufw enable

# Standard-Regeln
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Erlaubte Ports
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp

# Firewall-Status prüfen
sudo ufw status
```

### **3. VPN Setup:**

```bash
# OpenVPN installieren
sudo apt install -y openvpn

# VPN-Zertifikate generieren
sudo mkdir -p /etc/openvpn/certs
cd /etc/openvpn/certs

# CA-Zertifikat
openssl genrsa -out ca.key 2048
openssl req -new -x509 -days 365 -key ca.key -out ca.crt

# Server-Zertifikat
openssl genrsa -out server.key 2048
openssl req -new -key server.key -out server.csr
openssl x509 -req -days 365 -in server.csr -CA ca.crt -CAkey ca.key -out server.crt
```

---

## 📊 Monitoring Setup

### **1. Prometheus:**

```bash
# Prometheus installieren
wget https://github.com/prometheus/prometheus/releases/download/v2.45.0/prometheus-2.45.0.linux-amd64.tar.gz
tar xvf prometheus-2.45.0.linux-amd64.tar.gz
cd prometheus-2.45.0.linux-amd64

# Prometheus konfigurieren
cat > prometheus.yml << 'EOF'
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'enterprise-api'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'
EOF

# Prometheus starten
./prometheus --config.file=prometheus.yml
```

### **2. Grafana:**

```bash
# Grafana installieren
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
echo "deb https://packages.grafana.com/oss/deb stable main" | sudo tee /etc/apt/sources.list.d/grafana.list
sudo apt update
sudo apt install -y grafana

# Grafana starten
sudo systemctl start grafana-server
sudo systemctl enable grafana-server

# Grafana konfigurieren
sudo sed -i 's/;admin_user = admin/admin_user = admin/' /etc/grafana/grafana.ini
sudo sed -i 's/;admin_password = admin/admin_password = enterprise_grafana_password/' /etc/grafana/grafana.ini
```

### **3. Alert Manager:**

```bash
# Alert Manager installieren
wget https://github.com/prometheus/alertmanager/releases/download/v0.25.0/alertmanager-0.25.0.linux-amd64.tar.gz
tar xvf alertmanager-0.25.0.linux-amd64.tar.gz
cd alertmanager-0.25.0.linux-amd64

# Alert Manager konfigurieren
cat > alertmanager.yml << 'EOF'
global:
  smtp_smarthost: 'localhost:587'
  smtp_from: 'alertmanager@lopez-enterprise.com'

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'enterprise-support'

receivers:
- name: 'enterprise-support'
  email_configs:
  - to: 'support@lopez-enterprise.com'
EOF

# Alert Manager starten
./alertmanager --config.file=alertmanager.yml
```

---

## 🧪 Testing Setup

### **1. Unit Tests:**

```bash
# Jest installieren
npm install --save-dev jest @types/jest

# Jest konfigurieren
cat > jest.config.js << 'EOF'
module.exports = {
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.test.{js,ts}'
  ]
};
EOF

# Tests ausführen
npm test
```

### **2. Integration Tests:**

```bash
# Supertest installieren
npm install --save-dev supertest

# Integration Tests ausführen
npm run test:integration
```

### **3. E2E Tests:**

```bash
# Playwright installieren
npm install --save-dev @playwright/test

# Playwright konfigurieren
npx playwright install

# E2E Tests ausführen
npm run test:e2e
```

---

## 🔄 CI/CD Setup

### **1. GitHub Actions:**

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:integration
      - run: npm run test:e2e

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm audit
      - run: npm run security:scan

  deploy:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - run: npm run deploy:production
```

### **2. Docker Registry:**

```bash
# Docker Registry Setup
docker run -d \
  --name registry \
  -p 5000:5000 \
  -v registry-data:/var/lib/registry \
  registry:2

# Images taggen und pushen
docker tag lopezitwelt/enterprise-api:latest localhost:5000/lopezitwelt/enterprise-api:latest
docker push localhost:5000/lopezitwelt/enterprise-api:latest
```

---

## 📋 Setup Checklist

### **Pre-Setup:**

- [ ] System-Anforderungen prüfen
- [ ] Repository klonen
- [ ] Dependencies installieren
- [ ] Environment konfigurieren

### **Core Setup:**

- [ ] Betriebssystem konfigurieren
- [ ] Database installieren
- [ ] Redis installieren
- [ ] Nginx konfigurieren
- [ ] Application deployen

### **Security Setup:**

- [ ] SSL-Zertifikate installieren
- [ ] Firewall konfigurieren
- [ ] VPN einrichten
- [ ] Security-Scans durchführen

### **Monitoring Setup:**

- [ ] Prometheus installieren
- [ ] Grafana konfigurieren
- [ ] Alert Manager einrichten
- [ ] Dashboards erstellen

### **Testing Setup:**

- [ ] Unit Tests konfigurieren
- [ ] Integration Tests einrichten
- [ ] E2E Tests aufsetzen
- [ ] Test-Automation aktivieren

### **CI/CD Setup:**

- [ ] GitHub Actions konfigurieren
- [ ] Docker Registry einrichten
- [ ] Deployment-Pipeline erstellen
- [ ] Monitoring aktivieren

---

## 🚨 Troubleshooting

### **Häufige Probleme:**

#### **1. Port-Konflikte:**

```bash
# Ports prüfen
sudo netstat -tlnp | grep :3000

# Prozess beenden
sudo kill -9 $(sudo lsof -t -i:3000)
```

#### **2. Database-Verbindung:**

```bash
# PostgreSQL Status prüfen
sudo systemctl status postgresql

# Connection testen
psql -h localhost -U enterprise -d enterprise -c "SELECT 1;"
```

#### **3. Redis-Verbindung:**

```bash
# Redis Status prüfen
sudo systemctl status redis-server

# Connection testen
redis-cli -a enterprise_redis_password ping
```

#### **4. Nginx-Konfiguration:**

```bash
# Nginx Syntax prüfen
sudo nginx -t

# Nginx Status prüfen
sudo systemctl status nginx

# Logs prüfen
sudo tail -f /var/log/nginx/error.log
```

---

## 📞 Support

### **Setup-Support:**

- **E-Mail:** setup@lopez-enterprise.com
- **Telefon:** +49 231 12345678
- **Dokumentation:** https://docs.lopez-enterprise.com/setup

### **24/7 Support:**

- **E-Mail:** support@lopez-enterprise.com
- **Telefon:** +49 231 12345679
- **Chat:** https://support.lopez-enterprise.com

---

**🎯 Ziel:** Schnelle und sichere Setup-Prozedur!  
**📅 Letzte Aktualisierung:** 2025-07-05  
**👥 Verantwortlich:** DevOps Team
