# 🟦 SKALIERBARKEITS-PLAN – Lopez IT Welt Enterprise++

**Datum:** 2025-11-27 00:29:04  
**Status:** 📋 **PLANUNG**  
**Zweck:** Vorbereitung für hohe Last (viele Kunden, viel Traffic)  
**Methode:** Enterprise++ Standard (SAP/IBM/Siemens-Niveau)

---

## 🎯 EXECUTIVE SUMMARY

**Ziel:** System skalierbar machen für:
- ✅ **Viele Kunden** (10.000+)
- ✅ **Hohe Last** (1000+ Requests/Sekunde)
- ✅ **Zero-Downtime** (keine Ausfallzeiten)
- ✅ **Automatische Skalierung** (ohne Codeänderungen)

**Strategie:** 3-Stufen-Plan
1. **Load Balancing** (automatisch, ohne Codeänderung)
2. **MariaDB Cluster** (kompatibel zu bestehendem Code)
3. **Orchestrator Queue** (Redis/RabbitMQ – Standard)

---

## 📊 PHASE 1 – LOAD BALANCING (AUTOMATISCH)

### **Ziel:** Mehrere Next.js-Instanzen hinter Load Balancer

**Vorteile:**
- ✅ Automatische Lastverteilung
- ✅ Keine Codeänderungen erforderlich
- ✅ Health-Check automatisch
- ✅ Failover automatisch

### **Implementierung:**

#### **1.1 Docker-Containerisierung (Basis)**

**Datei:** `Dockerfile` (neu erstellen)

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS build
COPY . .
RUN npm run build

FROM base AS runtime
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

#### **1.2 Docker Compose (Multi-Instance)**

**Datei:** `docker-compose.yml` (neu erstellen)

```yaml
version: '3.8'

services:
  # Next.js App (mehrere Instanzen)
  app:
    build: .
    environment:
      - NODE_ENV=production
      - DB_HOST=db-cluster
      - DB_PORT=3306
      - DB_NAME=lopez_erp
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    deploy:
      replicas: 3  # 3 Instanzen
      restart_policy:
        condition: on-failure
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Nginx Load Balancer
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
    restart: always

  # Redis (für Queue)
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: always

volumes:
  redis-data:
```

#### **1.3 Nginx Load Balancer Config**

**Datei:** `nginx.conf` (neu erstellen)

```nginx
upstream nextjs_backend {
    least_conn;  # Least Connection Load Balancing
    server app:3000 max_fails=3 fail_timeout=30s;
    server app:3000 max_fails=3 fail_timeout=30s;
    server app:3000 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    server_name _;

    # Health Check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Proxy zu Next.js
    location / {
        proxy_pass http://nextjs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### **Vorteile:**
- ✅ **Keine Codeänderungen** – Next.js läuft unverändert
- ✅ **Automatische Skalierung** – Docker Swarm/Kubernetes
- ✅ **Health-Check** – Automatisches Failover
- ✅ **Session-Sticky** – Optional über Cookies

---

## 📊 PHASE 2 – MARIADB CLUSTER (KOMPATIBEL)

### **Ziel:** MySQL → MariaDB Cluster (kompatibel zu bestehendem Code)

**Vorteile:**
- ✅ **100% MySQL-kompatibel** – Keine Codeänderungen
- ✅ **Automatische Replikation** – Master-Slave
- ✅ **Read-Scaling** – Lesen von Slaves
- ✅ **Failover** – Automatisch

### **Implementierung:**

#### **2.1 MariaDB Cluster Setup**

**Datei:** `docker-compose.db.yml` (neu erstellen)

```yaml
version: '3.8'

services:
  # MariaDB Master
  mariadb-master:
    image: mariadb:11
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
      - MYSQL_DATABASE=lopez_erp
      - MYSQL_REPLICATION_MODE=master
      - MYSQL_REPLICATION_USER=replicator
      - MYSQL_REPLICATION_PASSWORD=${DB_REPLICATOR_PASSWORD}
    volumes:
      - mariadb-master-data:/var/lib/mysql
      - ./database/init-master.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"
    restart: always

  # MariaDB Slave 1
  mariadb-slave-1:
    image: mariadb:11
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
      - MYSQL_DATABASE=lopez_erp
      - MYSQL_REPLICATION_MODE=slave
      - MYSQL_REPLICATION_USER=replicator
      - MYSQL_REPLICATION_PASSWORD=${DB_REPLICATOR_PASSWORD}
      - MYSQL_MASTER_HOST=mariadb-master
    volumes:
      - mariadb-slave-1-data:/var/lib/mysql
    depends_on:
      - mariadb-master
    restart: always

  # MariaDB Slave 2
  mariadb-slave-2:
    image: mariadb:11
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
      - MYSQL_DATABASE=lopez_erp
      - MYSQL_REPLICATION_MODE=slave
      - MYSQL_REPLICATION_USER=replicator
      - MYSQL_REPLICATION_PASSWORD=${DB_REPLICATOR_PASSWORD}
      - MYSQL_MASTER_HOST=mariadb-master
    volumes:
      - mariadb-slave-2-data:/var/lib/mysql
    depends_on:
      - mariadb-master
    restart: always

  # ProxySQL (Load Balancer für DB)
  proxysql:
    image: proxysql/proxysql:latest
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
    volumes:
      - ./proxysql.cnf:/etc/proxysql.cnf
    ports:
      - "6032:6032"  # Admin
      - "6033:6033"  # MySQL
    depends_on:
      - mariadb-master
      - mariadb-slave-1
      - mariadb-slave-2
    restart: always

volumes:
  mariadb-master-data:
  mariadb-slave-1-data:
  mariadb-slave-2-data:
```

#### **2.2 Datenbank-Connection-Pool erweitern**

**Datei:** `src/lib/database.ts` (erweitern)

```typescript
// Erweiterte Pool-Konfiguration für Cluster
const dbConfig = {
  host: process.env.DB_HOST || "proxysql",  // ProxySQL statt direkt MySQL
  port: parseInt(process.env.DB_PORT || "6033"),  // ProxySQL Port
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lopez_erp",
  waitForConnections: true,
  connectionLimit: 20,  // Erhöht für Cluster
  queueLimit: 0,
  // Read/Write Splitting (automatisch über ProxySQL)
  multipleStatements: false,
};
```

**Vorteile:**
- ✅ **Keine Codeänderungen** – Nur Connection-String ändern
- ✅ **Automatisches Read/Write Splitting** – ProxySQL
- ✅ **Failover** – Automatisch
- ✅ **Load Balancing** – Automatisch

---

## 📊 PHASE 3 – ORCHESTRATOR QUEUE (REDIS/RABBITMQ)

### **Ziel:** Orchestrator-Tasks in Hintergrund-Queue

**Vorteile:**
- ✅ **Asynchrone Verarbeitung** – Keine Blockierung
- ✅ **Retry-Mechanismus** – Automatisch
- ✅ **Priorisierung** – Wichtige Tasks zuerst
- ✅ **Monitoring** – Queue-Status sichtbar

### **Implementierung:**

#### **3.1 Redis Queue Integration**

**Datei:** `src/lib/ki-orchestrator/QueueManager.ts` (neu erstellen)

```typescript
/**
 * Queue Manager - Enterprise++ Standard
 * 
 * Verwaltet Orchestrator-Tasks in Redis-Queue
 * Standard: BullMQ (Redis-basiert)
 */

import { Queue, Worker, QueueEvents } from 'bullmq';
import { orchestratorCore } from './OrchestratorCore';
import type { OrchestratorTask } from './types';
import { logger } from '@/lib/logger';

// Redis Connection
const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
};

// Task Queue
export const orchestratorQueue = new Queue<OrchestratorTask>('orchestrator-tasks', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 3600, // 1 Stunde
      count: 1000,
    },
    removeOnFail: {
      age: 86400, // 24 Stunden
    },
  },
});

// Worker (verarbeitet Tasks)
export const orchestratorWorker = new Worker<OrchestratorTask>(
  'orchestrator-tasks',
  async (job) => {
    logger.info(`Processing orchestrator task: ${job.id}`);
    const result = await orchestratorCore.dispatchTask(job.data);
    return result;
  },
  {
    connection: redisConnection,
    concurrency: 5, // 5 Tasks parallel
  }
);

// Queue Events (Monitoring)
export const queueEvents = new QueueEvents('orchestrator-tasks', {
  connection: redisConnection,
});

// Task hinzufügen
export async function enqueueTask(task: OrchestratorTask, options?: {
  priority?: number;
  delay?: number;
}): Promise<string> {
  const job = await orchestratorQueue.add(
    `task-${task.agent}-${task.purpose}`,
    task,
    {
      priority: options?.priority || 0,
      delay: options?.delay || 0,
    }
  );
  return job.id!;
}

// Queue-Status
export async function getQueueStatus() {
  const [waiting, active, completed, failed] = await Promise.all([
    orchestratorQueue.getWaitingCount(),
    orchestratorQueue.getActiveCount(),
    orchestratorQueue.getCompletedCount(),
    orchestratorQueue.getFailedCount(),
  ]);

  return {
    waiting,
    active,
    completed,
    failed,
    total: waiting + active + completed + failed,
  };
}
```

#### **3.2 OrchestratorCore erweitern (Queue-Integration)**

**Datei:** `src/lib/ki-orchestrator/OrchestratorCore.ts` (erweitern)

```typescript
// Neue Methode: dispatchTaskAsync (Queue)
async dispatchTaskAsync(task: OrchestratorTask, options?: {
  priority?: number;
  delay?: number;
}): Promise<string> {
  const { enqueueTask } = await import('./QueueManager');
  return await enqueueTask(task, options);
}
```

#### **3.3 API-Route erweitern (Queue-Support)**

**Datei:** `src/app/api/orchestrator/task/route.ts` (erweitern)

```typescript
// Optional: async Parameter
const { agent, purpose, userId, payload, priority, async } = body;

if (async) {
  // In Queue einreihen
  const taskId = await orchestratorCore.dispatchTaskAsync(task, { priority });
  return NextResponse.json({
    success: true,
    data: { taskId, status: 'queued' }
  });
} else {
  // Synchron verarbeiten (wie bisher)
  const result = await orchestratorCore.dispatchTask(task);
  return NextResponse.json({ success: result.success, data: result });
}
```

### **Vorteile:**
- ✅ **Asynchrone Verarbeitung** – Keine Timeouts
- ✅ **Retry-Mechanismus** – Automatisch bei Fehlern
- ✅ **Priorisierung** – Wichtige Tasks zuerst
- ✅ **Monitoring** – Queue-Status in Admin-UI

---

## 📊 IMPLEMENTIERUNGSPLAN

### **Sprint 1: Load Balancing (1-2 Wochen)**
- ✅ Docker-Containerisierung
- ✅ Docker Compose Setup
- ✅ Nginx Load Balancer
- ✅ Health-Check Integration
- ✅ Testing (3 Instanzen)

### **Sprint 2: MariaDB Cluster (2-3 Wochen)**
- ✅ MariaDB Master-Slave Setup
- ✅ ProxySQL Integration
- ✅ Connection-Pool Anpassung
- ✅ Read/Write Splitting Test
- ✅ Failover-Test

### **Sprint 3: Orchestrator Queue (2-3 Wochen)**
- ✅ Redis Setup
- ✅ BullMQ Integration
- ✅ QueueManager implementieren
- ✅ OrchestratorCore erweitern
- ✅ Admin-UI für Queue-Status
- ✅ Monitoring & Alerts

---

## 🎯 QUALITÄTSKRITERIEN

### **Load Balancing:**
- ✅ 3+ Instanzen parallel
- ✅ Automatisches Failover (< 5 Sekunden)
- ✅ Health-Check funktioniert
- ✅ Session-Sticky (optional)

### **MariaDB Cluster:**
- ✅ Master-Slave Replikation aktiv
- ✅ Read/Write Splitting funktioniert
- ✅ Failover automatisch (< 10 Sekunden)
- ✅ Keine Codeänderungen erforderlich

### **Orchestrator Queue:**
- ✅ Tasks werden asynchron verarbeitet
- ✅ Retry-Mechanismus funktioniert
- ✅ Priorisierung funktioniert
- ✅ Queue-Status sichtbar in Admin-UI

---

## 📋 IMPLEMENTIERUNGS-ENTSCHEIDUNG

### **Option A: Schrittweise (Empfohlen)**
1. **Sprint 1:** Load Balancing (1-2 Wochen)
2. **Sprint 2:** MariaDB Cluster (2-3 Wochen)
3. **Sprint 3:** Orchestrator Queue (2-3 Wochen)

**Vorteil:** Jede Phase ist testbar, risikoarm

### **Option B: Komplett (Für später)**
Alle 3 Phasen parallel (4-6 Wochen)

**Vorteil:** Schneller, aber höheres Risiko

---

## 🎯 EMPFEHLUNG: SPRINT 1 STARTEN

**Begründung:**
- ✅ Schnell umsetzbar (1-2 Wochen)
- ✅ Sofortige Skalierbarkeit (3+ Instanzen)
- ✅ Keine Codeänderungen erforderlich
- ✅ Basis für weitere Phasen
- ✅ Health-Check bereits vorhanden (`/api/monitoring/status`)

**Soll ich Sprint 1 jetzt starten?**

---

*Generated by Enterprise++ Skalierbarkeits-Plan System*  
*Last updated: 2025-11-27 00:29:04*  
*Status: 📋 PLANUNG ABGESCHLOSSEN – BEREIT FÜR IMPLEMENTIERUNG*

