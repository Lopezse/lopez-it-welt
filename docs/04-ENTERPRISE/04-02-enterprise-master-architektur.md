# 🏗️ Enterprise++ Master-Architektur - Vollständige System-Architektur

**Version:** 1.0  
**Datum:** 2025-07-05  
**Status:** 🚧 IN ENTWICKLUNG  
**Autor:** Lopez IT Welt Team

## 📋 **ÜBERSICHT**

Die **Enterprise++ Master-Architektur** definiert die vollständige System-Architektur für alle Enterprise++ Projekte. Sie stellt sicher, dass alle Komponenten einheitlich, skalierbar und wartbar sind.

## 🎯 **ARCHITEKTUR-PRINZIPIEN**

### **✅ Enterprise++ Standards**

- **Modularität:** Alle Komponenten sind modular aufgebaut
- **Skalierbarkeit:** Horizontale und vertikale Skalierung möglich
- **Sicherheit:** Security-First-Ansatz in allen Schichten
- **Qualität:** Automatisierte Qualitätssicherung
- **Performance:** Optimierte Performance in allen Bereichen

### **🏗️ Architektur-Schichten**

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │
│  │   React     │ │  Next.js    │ │   i18n      │         │
│  │ Components  │ │   App       │ │  System     │         │
│  └─────────────┘ └─────────────┘ └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    BUSINESS LAYER                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │
│  │   Hooks     │ │  Services   │ │  Utils      │         │
│  │  (Custom)   │ │ (Business)  │ │ (Helpers)   │         │
│  └─────────────┘ └─────────────┘ └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │
│  │   MySQL     │ │   Redis     │ │   File      │         │
│  │  Database   │ │   Cache     │ │   System    │         │
│  └─────────────┘ └─────────────┘ └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE LAYER                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │
│  │   Docker    │ │ Kubernetes  │ │   CI/CD     │         │
│  │  Container  │ │  Orchestr.  │ │  Pipeline   │         │
│  └─────────────┘ └─────────────┘ └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 🎨 **PRESENTATION LAYER**

### **React Components**

```typescript
// src/components/Core/
├── Header.tsx              // Hauptnavigation
├── Footer.tsx              // Footer-Komponente
├── Layout.tsx              // Layout-Wrapper
└── Navigation.tsx          // Navigation-Komponente

// src/components/Features/
├── Button.tsx              // Button-Komponente
├── Card.tsx                // Card-Komponente
├── Modal.tsx               // Modal-Komponente
├── Form.tsx                // Form-Komponente
└── Table.tsx               // Table-Komponente

// src/components/admin/
├── Dashboard.tsx           // Admin-Dashboard
├── UserManagement.tsx      // Benutzer-Verwaltung
├── Settings.tsx            // Einstellungen
└── Analytics.tsx           // Analytics-Dashboard
```

### **Next.js App Router**

```typescript
// src/app/
├── (main)/                 // Haupt-Bereich
│   ├── page.tsx           // Startseite
│   ├── about/page.tsx     // Über uns
│   ├── services/page.tsx  // Dienstleistungen
│   └── contact/page.tsx   // Kontakt
├── admin/                 // Admin-Bereich
│   ├── page.tsx           // Admin-Dashboard
│   ├── users/page.tsx     // Benutzer-Verwaltung
│   └── settings/page.tsx  // Einstellungen
├── api/                   // API-Routen
│   ├── auth/              // Authentifizierung
│   ├── admin/             // Admin-API
│   └── public/            // Öffentliche API
└── globals.css            // Globale Styles
```

### **i18n System**

```typescript
// src/i18n/
├── locales/
│   ├── de.json            // Deutsche Übersetzungen
│   ├── en.json            // Englische Übersetzungen
│   └── es.json            // Spanische Übersetzungen
├── config.ts              // i18n-Konfiguration
└── hooks/
    └── useTranslation.ts  // Translation-Hook
```

## 💼 **BUSINESS LAYER**

### **Custom Hooks**

```typescript
// src/hooks/
├── useAuth.ts             // Authentifizierung
├── useApi.ts              // API-Calls
├── useLocalStorage.ts     // Local Storage
├── useDebounce.ts         // Debounce-Funktionalität
├── useTexts.ts            // Text-Management
└── useValidation.ts       // Form-Validierung
```

### **Services**

```typescript
// src/services/
├── authService.ts         // Authentifizierung-Service
├── userService.ts         // Benutzer-Service
├── apiService.ts          // API-Service
├── storageService.ts      // Storage-Service
└── validationService.ts   // Validierung-Service
```

### **Utils**

```typescript
// src/utils/
├── constants.ts           // Konstanten
├── helpers.ts            // Hilfsfunktionen
├── validators.ts         // Validierungsfunktionen
├── formatters.ts         // Formatierungsfunktionen
└── types.ts              // TypeScript-Typen
```

## 🗄️ **DATA LAYER**

### **MySQL Database**

```sql
-- Haupt-Datenbank-Schema
CREATE DATABASE lopez_it_welt;

-- Benutzer-Tabelle
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Text-Management-Tabelle
CREATE TABLE site_texts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  language VARCHAR(10) DEFAULT 'de',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Memory-System-Tabelle
CREATE TABLE memory_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **Redis Cache**

```typescript
// src/lib/redis.ts
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || "0"),
});

export default redis;
```

### **File System**

```typescript
// src/lib/fileSystem.ts
import fs from "fs/promises";
import path from "path";

export class FileSystem {
  // Dateien lesen
  static async readFile(filePath: string): Promise<string> {
    return await fs.readFile(filePath, "utf-8");
  }

  // Dateien schreiben
  static async writeFile(filePath: string, content: string): Promise<void> {
    await fs.writeFile(filePath, content, "utf-8");
  }

  // Verzeichnis erstellen
  static async createDirectory(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true });
  }
}
```

## 🛡️ **SECURITY LAYER**

### **Authentication**

```typescript
// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Authentifizierungs-Logik
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Benutzer aus Datenbank abrufen
        const user = await getUserByEmail(credentials.email);

        if (!user) {
          return null;
        }

        // Passwort überprüfen
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};
```

### **Authorization**

```typescript
// src/lib/authorization.ts
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export function requireAuth(role?: UserRole) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      // Authentifizierung prüfen
      if (!this.user) {
        throw new Error("Nicht authentifiziert");
      }

      // Autorisierung prüfen
      if (role && this.user.role !== role) {
        throw new Error("Keine Berechtigung");
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
```

### **Input Validation**

```typescript
// src/lib/validation.ts
import { z } from "zod";

// Benutzer-Schema
export const userSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein"),
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
});

// Text-Schema
export const textSchema = z.object({
  key: z.string().min(1, "Key ist erforderlich"),
  value: z.string().min(1, "Value ist erforderlich"),
  language: z.string().default("de"),
});

// Validierungs-Funktionen
export function validateUser(data: unknown) {
  return userSchema.parse(data);
}

export function validateText(data: unknown) {
  return textSchema.parse(data);
}
```

## 🔄 **API LAYER**

### **REST API**

```typescript
// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { signIn } from "next-auth/react";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Authentifizierung
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return NextResponse.json({ error: "Ungültige Anmeldedaten" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server-Fehler" }, { status: 500 });
  }
}
```

### **Admin API**

```typescript
// src/app/api/admin/texts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { validateText } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    // Authentifizierung prüfen
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 });
    }

    // Texte aus Datenbank abrufen
    const texts = await getTextsFromDatabase();

    return NextResponse.json(texts);
  } catch (error) {
    return NextResponse.json({ error: "Server-Fehler" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authentifizierung prüfen
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 });
    }

    const data = await request.json();

    // Validierung
    const validatedData = validateText(data);

    // Text in Datenbank speichern
    const newText = await saveTextToDatabase(validatedData);

    return NextResponse.json(newText, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server-Fehler" }, { status: 500 });
  }
}
```

## 🚀 **DEPLOYMENT LAYER**

### **Docker Configuration**

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### **Kubernetes Configuration**

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: lopez-it-welt
  labels:
    app: lopez-it-welt
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
        - name: lopez-it-welt
          image: lopez-it-welt:latest
          ports:
            - containerPort: 3000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: url
            - name: NEXTAUTH_SECRET
              valueFrom:
                secretKeyRef:
                  name: auth-secret
                  key: secret
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
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
```

### **CI/CD Pipeline**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run test
      - run: npm run lint
      - run: npm run security:scan

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run build
      - run: docker build -t lopez-it-welt .
      - run: docker push lopez-it-welt:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: azure/k8s-set-context@v3
        with:
          kubeconfig: ${{ secrets.KUBECONFIG }}
      - run: kubectl apply -f k8s/
      - run: kubectl rollout restart deployment/lopez-it-welt
```

## 📊 **MONITORING & OBSERVABILITY**

### **Health Checks**

```typescript
// src/app/api/health/route.ts
import { NextResponse } from "next/server";
import { checkDatabaseConnection } from "@/lib/database";
import { checkRedisConnection } from "@/lib/redis";

export async function GET() {
  try {
    // Datenbank-Verbindung prüfen
    const dbStatus = await checkDatabaseConnection();

    // Redis-Verbindung prüfen
    const redisStatus = await checkRedisConnection();

    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        redis: redisStatus,
      },
    };

    return NextResponse.json(health);
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 500 },
    );
  }
}
```

### **Logging**

```typescript
// src/lib/logger.ts
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: "lopez-it-welt" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

export default logger;
```

## 🎯 **PERFORMANCE OPTIMIZATION**

### **Caching Strategy**

```typescript
// src/lib/cache.ts
import redis from "@/lib/redis";

export class CacheManager {
  // Cache-Schlüssel generieren
  static generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}:${params[key]}`)
      .join(":");
    return `${prefix}:${sortedParams}`;
  }

  // Daten cachen
  static async set(key: string, data: any, ttl: number = 3600): Promise<void> {
    await redis.setex(key, ttl, JSON.stringify(data));
  }

  // Daten aus Cache abrufen
  static async get(key: string): Promise<any | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  // Cache invalidieren
  static async invalidate(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}
```

### **Database Optimization**

```typescript
// src/lib/database.ts
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
});

export async function query(sql: string, params: any[] = []): Promise<any> {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function transaction<T>(callback: (connection: any) => Promise<T>): Promise<T> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
```

## 🔒 **SECURITY MEASURES**

### **CORS Configuration**

```typescript
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // CORS-Header setzen
  response.headers.set("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGINS || "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Credentials", "true");

  // Security-Header setzen
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
```

### **Rate Limiting**

```typescript
// src/lib/rateLimit.ts
import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function rateLimit(
  request: NextRequest,
  limit: number = 100,
  window: number = 3600,
): Promise<NextResponse | null> {
  const ip = request.ip || "unknown";
  const key = `rate_limit:${ip}`;

  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, window);
  }

  if (current > limit) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  return null;
}
```

---

**Letzte Aktualisierung:** 2025-07-05  
**Nächste Überprüfung:** 2025-07-06
