# 🚀 Deployment-Guide - Lopez IT Welt

**Version:** 1.0  
**Datum:** 2025-07-05  
**Status:** 🚧 IN ENTWICKLUNG  
**Autor:** Lopez IT Welt Team

## 📋 **ÜBERSICHT**

Der **Deployment-Guide** beschreibt die vollständige Deployment-Strategie für das Lopez IT Welt System. Er umfasst alle Umgebungen von Development bis Production und folgt DevOps-Best-Practices.

## 🎯 **DEPLOYMENT-STRATEGIE**

### **Umgebungen**
```yaml
# Umgebungs-Konfiguration
environments:
  development:
    url: http://localhost:3000
    database: lopez_it_welt_dev
    redis: redis://localhost:6379/0
    
  staging:
    url: https://staging.lopez-it-welt.de
    database: lopez_it_welt_staging
    redis: redis://staging-redis:6379/0
    
  production:
    url: https://lopez-it-welt.de
    database: lopez_it_welt_prod
    redis: redis://prod-redis:6379/0
```

### **Deployment-Pipeline**
```mermaid
graph LR
    A[Code Commit] --> B[Tests]
    B --> C[Build]
    C --> D[Security Scan]
    D --> E[Deploy to Staging]
    E --> F[Integration Tests]
    F --> G[Manual Review]
    G --> H[Deploy to Production]
    H --> I[Health Checks]
    I --> J[Monitoring]
```

## 🛠️ **VORBEREITUNG**

### **System-Anforderungen**
```bash
# Minimale System-Anforderungen
CPU: 2 Cores
RAM: 4GB
Storage: 20GB SSD
OS: Ubuntu 20.04 LTS oder höher
```

### **Abhängigkeiten installieren**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y \
    curl \
    wget \
    git \
    docker.io \
    docker-compose \
    nginx \
    certbot \
    python3-certbot-nginx

# Docker starten
sudo systemctl enable docker
sudo systemctl start docker

# Node.js installieren
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# MySQL installieren
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Redis installieren
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

### **Umgebungsvariablen**
```bash
# .env.production
NODE_ENV=production
PORT=3000

# Datenbank
DATABASE_URL=mysql://user:password@localhost:3306/lopez_it_welt_prod
REDIS_URL=redis://localhost:6379/0

# Authentifizierung
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://lopez-it-welt.de

# KI-Services
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# Monitoring
SENTRY_DSN=your-sentry-dsn
DATADOG_API_KEY=your-datadog-api-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=eu-central-1
AWS_S3_BUCKET=lopez-it-welt-storage
```

## 🐳 **DOCKER-DEPLOYMENT**

### **Dockerfile**
```dockerfile
# Multi-stage build für optimierte Images
FROM node:18-alpine AS base

# Installiere Abhängigkeiten
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Build-Stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production-Stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### **Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mysql://user:password@db:3306/lopez_it_welt
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    restart: unless-stopped
    networks:
      - app-network

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: lopez_it_welt
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"
    restart: unless-stopped
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - app-network

volumes:
  mysql_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

### **Nginx-Konfiguration**
```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    server {
        listen 80;
        server_name lopez-it-welt.de www.lopez-it-welt.de;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name lopez-it-welt.de www.lopez-it-welt.de;

        # SSL-Konfiguration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
        ssl_prefer_server_ciphers off;

        # Security Headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

        # Gzip-Kompression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

        # API-Routen mit Rate Limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Login-Route mit strengerem Rate Limiting
        location /api/auth/login {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Statische Dateien
        location /_next/static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            proxy_pass http://app;
        }

        # Alle anderen Anfragen
        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## ☁️ **CLOUD-DEPLOYMENT**

### **AWS ECS Deployment**
```yaml
# task-definition.json
{
  "family": "lopez-it-welt",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::123456789012:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "app",
      "image": "123456789012.dkr.ecr.eu-central-1.amazonaws.com/lopez-it-welt:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "DATABASE_URL",
          "value": "mysql://user:password@db-cluster.cluster-xyz.eu-central-1.rds.amazonaws.com:3306/lopez_it_welt"
        }
      ],
      "secrets": [
        {
          "name": "NEXTAUTH_SECRET",
          "valueFrom": "arn:aws:secretsmanager:eu-central-1:123456789012:secret:lopez-it-welt/nextauth-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/lopez-it-welt",
          "awslogs-region": "eu-central-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### **Kubernetes Deployment**
```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: lopez-it-welt
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: lopez-it-welt
  template:
    metadata:
      labels:
        app: lopez-it-welt
    spec:
      containers:
      - name: app
        image: lopez-it-welt:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: lopez-it-welt-secrets
              key: database-url
        - name: NEXTAUTH_SECRET
          valueFrom:
            secretKeyRef:
              name: lopez-it-welt-secrets
              key: nextauth-secret
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: lopez-it-welt-service
  namespace: production
spec:
  selector:
    app: lopez-it-welt
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: lopez-it-welt-ingress
  namespace: production
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - lopez-it-welt.de
    secretName: lopez-it-welt-tls
  rules:
  - host: lopez-it-welt.de
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: lopez-it-welt-service
            port:
              number: 80
```

## 🔄 **CI/CD-PIPELINE**

### **GitHub Actions**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint
    
    - name: Type check
      run: npm run type-check

  security-scan:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Run security scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=high

  build:
    needs: [test, security-scan]
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to ECR
      uses: aws-actions/amazon-ecr-login@v1
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    steps:
    - name: Deploy to staging
      run: |
        aws ecs update-service \
          --cluster staging-cluster \
          --service lopez-it-welt-staging \
          --force-new-deployment

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
    - name: Deploy to production
      run: |
        aws ecs update-service \
          --cluster production-cluster \
          --service lopez-it-welt-production \
          --force-new-deployment
    
    - name: Run smoke tests
      run: |
        curl -f https://lopez-it-welt.de/api/health
        curl -f https://lopez-it-welt.de/api/version
```

### **Database Migration**
```bash
# Migration-Script
#!/bin/bash

echo "Starting database migration..."

# Backup erstellen
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME > backup_$(date +%Y%m%d_%H%M%S).sql

# Migration ausführen
npm run db:migrate

# Rollback bei Fehler
if [ $? -ne 0 ]; then
    echo "Migration failed, rolling back..."
    npm run db:rollback
    exit 1
fi

echo "Migration completed successfully"
```

## 📊 **MONITORING & ALERTING**

### **Health Checks**
```typescript
// pages/api/health.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { checkDatabaseConnection } from '@/lib/database';
import { checkRedisConnection } from '@/lib/redis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Datenbank-Check
    const dbStatus = await checkDatabaseConnection();
    
    // Redis-Check
    const redisStatus = await checkRedisConnection();
    
    // Externe Services
    const openaiStatus = await checkOpenAIConnection();
    
    const isHealthy = dbStatus && redisStatus && openaiStatus;
    
    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: dbStatus,
        redis: redisStatus,
        openai: openaiStatus
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
```

### **Prometheus Metrics**
```typescript
// lib/metrics.ts
import { register, Counter, Histogram, Gauge } from 'prom-client';

// Metriken definieren
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

export const activeUsers = new Gauge({
  name: 'active_users',
  help: 'Number of currently active users'
});

export const chatMessagesTotal = new Counter({
  name: 'chat_messages_total',
  help: 'Total number of chat messages',
  labelNames: ['agent_id', 'type']
});

// Middleware für Request-Metriken
export function metricsMiddleware(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    
    httpRequestDuration
      .labels(req.method!, req.url!, res.statusCode.toString())
      .observe(duration);
    
    httpRequestsTotal
      .labels(req.method!, req.url!, res.statusCode.toString())
      .inc();
  });
  
  next();
}
```

### **Grafana Dashboard**
```json
{
  "dashboard": {
    "title": "Lopez IT Welt - Production",
    "panels": [
      {
        "title": "HTTP Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Active Users",
        "type": "stat",
        "targets": [
          {
            "expr": "active_users"
          }
        ]
      },
      {
        "title": "Chat Messages",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(chat_messages_total[5m])",
            "legendFormat": "{{agent_id}} - {{type}}"
          }
        ]
      }
    ]
  }
}
```

## 🔒 **SICHERHEIT**

### **SSL/TLS-Konfiguration**
```bash
# Let's Encrypt Zertifikat
sudo certbot --nginx -d lopez-it-welt.de -d www.lopez-it-welt.de

# Automatische Erneuerung
sudo crontab -e
# Füge hinzu: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **Firewall-Konfiguration**
```bash
# UFW Firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### **Backup-Strategie**
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Datenbank-Backup
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Dateien-Backup
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz /var/www/lopez-it-welt

# Alte Backups löschen (älter als 30 Tage)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

# Backup zu S3 hochladen
aws s3 sync $BACKUP_DIR s3://lopez-it-welt-backups/
```

## 🚨 **TROUBLESHOOTING**

### **Häufige Probleme**

#### **Datenbank-Verbindung fehlgeschlagen**
```bash
# MySQL-Status prüfen
sudo systemctl status mysql

# Verbindung testen
mysql -u user -p -h localhost lopez_it_welt

# Logs prüfen
sudo tail -f /var/log/mysql/error.log
```

#### **Redis-Verbindung fehlgeschlagen**
```bash
# Redis-Status prüfen
sudo systemctl status redis-server

# Verbindung testen
redis-cli ping

# Logs prüfen
sudo tail -f /var/log/redis/redis-server.log
```

#### **Application-Fehler**
```bash
# Application-Logs prüfen
docker logs lopez-it-welt-app

# Container-Status prüfen
docker ps -a

# Ressourcen-Nutzung prüfen
docker stats
```

### **Performance-Optimierung**
```bash
# MySQL-Performance
mysql -u root -p -e "SHOW VARIABLES LIKE 'innodb_buffer_pool_size';"
mysql -u root -p -e "SET GLOBAL innodb_buffer_pool_size = 1073741824;"

# Redis-Performance
redis-cli info memory
redis-cli config set maxmemory 512mb
```

---

**Letzte Aktualisierung:** 2025-07-05  
**Nächste Überprüfung:** 2025-07-06 