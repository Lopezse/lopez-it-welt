# 🔌 APIs und Endpoints - Lopez IT Welt Enterprise++

## 📋 API-Übersicht

**API-Typ:** RESTful API mit Next.js API Routes  
**Authentifizierung:** JWT + NextAuth.js  
**Dokumentation:** OpenAPI 3.0 (Swagger)  
**Rate Limiting:** Express Rate Limit  
**Letzte Aktualisierung:** 2024-12-19

## 🏗️ API-Architektur

### **API-Struktur**

```
/api
├── auth/                    # Authentifizierung
│   ├── login
│   ├── logout
│   ├── register
│   └── refresh
├── content/                 # Content Management
│   ├── pages/
│   ├── blocks/
│   ├── media/
│   ├── translations/
│   └── hero/
├── admin/                   # Admin-Funktionen
│   ├── users/
│   ├── roles/
│   ├── permissions/
│   └── system/
├── ab-test/                 # A/B Testing
│   ├── config/
│   ├── track/
│   └── stats/
└── public/                  # Öffentliche APIs
    ├── content/
    └── health
```

### **API-Versionierung**

```typescript
// API Version Header
const API_VERSION = "v1";
const API_BASE_URL = `/api/${API_VERSION}`;

// Versioned Response
interface ApiResponse<T> {
  version: string;
  status: "success" | "error";
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: PaginationMeta;
    timestamp: string;
    requestId: string;
  };
}
```

## 🔐 Authentifizierung & Autorisierung

### **JWT-Token Management**

```typescript
// JWT Payload
interface JWTPayload {
  sub: string; // User ID
  email: string; // E-Mail
  role: string; // User Role
  permissions: string[]; // User Permissions
  iat: number; // Issued At
  exp: number; // Expires At
  jti: string; // JWT ID
}

// Token Service
class TokenService {
  // Token generieren
  static generateToken(payload: Omit<JWTPayload, "iat" | "exp" | "jti">): string {
    return jwt.sign(
      {
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 Stunden
        jti: crypto.randomUUID(),
      },
      process.env.JWT_SECRET!,
      { algorithm: "HS256" },
    );
  }

  // Token verifizieren
  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  // Token erneuern
  static refreshToken(oldToken: string): string | null {
    const payload = this.verifyToken(oldToken);
    if (!payload) return null;

    return this.generateToken({
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      permissions: payload.permissions,
    });
  }
}
```

### **Auth Middleware**

```typescript
// Authentication Middleware
export function withAuth(requiredPermissions: string[] = []) {
  return function (handler: NextApiHandler) {
    return async function (req: NextApiRequest, res: NextApiResponse) {
      try {
        // Token aus Header extrahieren
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
          return res.status(401).json({
            status: "error",
            error: {
              code: "UNAUTHORIZED",
              message: "Missing or invalid authorization header",
            },
          });
        }

        const token = authHeader.substring(7);
        const payload = TokenService.verifyToken(token);

        if (!payload) {
          return res.status(401).json({
            status: "error",
            error: {
              code: "UNAUTHORIZED",
              message: "Invalid or expired token",
            },
          });
        }

        // Berechtigungen prüfen
        if (requiredPermissions.length > 0) {
          const hasPermission = requiredPermissions.every((permission) =>
            payload.permissions.includes(permission),
          );

          if (!hasPermission) {
            return res.status(403).json({
              status: "error",
              error: { code: "FORBIDDEN", message: "Insufficient permissions" },
            });
          }
        }

        // User-Info an Request anhängen
        req.user = payload;
        return handler(req, res);
      } catch (error) {
        return res.status(500).json({
          status: "error",
          error: { code: "INTERNAL_ERROR", message: "Authentication failed" },
        });
      }
    };
  };
}
```

## 📄 Content Management APIs

### **Pages API**

```typescript
// GET /api/content/pages
export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const language = searchParams.get("language");

    const where: any = {};
    if (status) where.status = status;
    if (language) where.language = language;

    const [pages, total] = await Promise.all([
      prisma.cmsPage.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: {
          createdBy: {
            select: { firstName: true, lastName: true, email: true },
          },
        },
      }),
      prisma.cmsPage.count({ where }),
    ]);

    return NextResponse.json({
      version: "v1",
      status: "success",
      data: pages,
      meta: {
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        version: "v1",
        status: "error",
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch pages",
          details: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 },
    );
  }
};

// POST /api/content/pages
export const POST = withAuth(["content.create"])(async (req: NextApiRequest) => {
  try {
    const pageData = req.body;

    // Validierung
    const validation = await PageValidator.validate(pageData);
    if (!validation.isValid) {
      return res.status(400).json({
        status: "error",
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid page data",
          details: validation.errors,
        },
      });
    }

    // Seite erstellen
    const page = await prisma.cmsPage.create({
      data: {
        ...pageData,
        createdBy: req.user.sub,
      },
    });

    // Audit-Log
    await AuditLogger.log(req.user.sub, "page.created", "cms_page", page.id, null, pageData, req);

    return res.status(201).json({
      version: "v1",
      status: "success",
      data: page,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to create page",
      },
    });
  }
});
```

### **Media API**

```typescript
// POST /api/content/media/upload
export const POST = withAuth(["media.upload"])(async (req: NextApiRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const metadata = JSON.parse(formData.get("metadata") as string);

    // Datei-Validierung
    const validation = await MediaValidator.validateFile(file);
    if (!validation.isValid) {
      return res.status(400).json({
        status: "error",
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid file",
          details: validation.errors,
        },
      });
    }

    // Datei speichern
    const filePath = await FileStorage.save(file, metadata.folderPath);
    const fileInfo = await MediaProcessor.extractMetadata(file);

    // Thumbnails generieren
    const thumbnails = await MediaProcessor.generateThumbnails(file, filePath);

    // Datenbank-Eintrag
    const mediaFile = await prisma.cmsMedia.create({
      data: {
        filename: fileInfo.filename,
        originalFilename: file.name,
        filePath,
        fileUrl: `${process.env.MEDIA_URL}${filePath}`,
        mimeType: file.type,
        fileSize: file.size,
        width: fileInfo.width,
        height: fileInfo.height,
        altText: metadata.altText,
        caption: metadata.caption,
        folderPath: metadata.folderPath,
        uploadedBy: req.user.sub,
      },
    });

    return res.status(201).json({
      version: "v1",
      status: "success",
      data: {
        ...mediaFile,
        thumbnails,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to upload media",
      },
    });
  }
});
```

## 🧪 A/B Testing APIs

### **A/B Test Configuration**

```typescript
// GET /api/ab-test/config
export const GET = async (req: NextRequest) => {
  try {
    const config = await prisma.abTestConfig.findFirst({
      where: { isActive: true },
      include: {
        variants: {
          where: { isActive: true },
          include: {
            heroContent: true,
          },
        },
      },
    });

    if (!config) {
      return NextResponse.json({
        version: "v1",
        status: "success",
        data: {
          isActive: false,
          message: "No active A/B test found",
        },
      });
    }

    return NextResponse.json({
      version: "v1",
      status: "success",
      data: config,
    });
  } catch (error) {
    return NextResponse.json(
      {
        version: "v1",
        status: "error",
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch A/B test config",
        },
      },
      { status: 500 },
    );
  }
};

// POST /api/ab-test/track
export const POST = async (req: NextRequest) => {
  try {
    const { testId, variantKey, event, deviceType, metadata } = await req.json();

    // Event validieren
    const validEvents = ["impression", "click", "conversion"];
    if (!validEvents.includes(event)) {
      return NextResponse.json(
        {
          version: "v1",
          status: "error",
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid event type",
          },
        },
        { status: 400 },
      );
    }

    // Statistiken aktualisieren
    const today = new Date().toISOString().split("T")[0];

    await prisma.heroTestStats.upsert({
      where: {
        unique_test_variant_device_date: {
          testId,
          variantKey,
          deviceType,
          date: today,
        },
      },
      update: {
        [event === "impression" ? "impressions" : event === "click" ? "clicks" : "conversions"]: {
          increment: 1,
        },
      },
      create: {
        testId,
        variantKey,
        deviceType,
        impressions: event === "impression" ? 1 : 0,
        clicks: event === "click" ? 1 : 0,
        conversions: event === "conversion" ? 1 : 0,
        date: today,
      },
    });

    return NextResponse.json({
      version: "v1",
      status: "success",
      data: { tracked: true },
    });
  } catch (error) {
    return NextResponse.json(
      {
        version: "v1",
        status: "error",
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to track event",
        },
      },
      { status: 500 },
    );
  }
};
```

## 📊 Admin APIs

### **User Management**

```typescript
// GET /api/admin/users
export const GET = withAuth(["users.read"])(async (req: NextApiRequest) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;

    const where: any = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search as string } },
        { lastName: { contains: search as string } },
        { email: { contains: search as string } },
      ];
    }
    if (role) where.roleId = parseInt(role as string);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: {
          role: {
            select: { name: true, description: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return res.status(200).json({
      version: "v1",
      status: "success",
      data: users,
      meta: {
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      version: "v1",
      status: "error",
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to fetch users",
      },
    });
  }
});
```

### **System Monitoring**

```typescript
// GET /api/admin/system/health
export const GET = withAuth(["system.monitor"])(async (req: NextApiRequest) => {
  try {
    // Datenbank-Status prüfen
    const dbStatus = await prisma.$queryRaw`SELECT 1 as status`;

    // System-Metriken sammeln
    const metrics = {
      database: {
        status: "healthy",
        responseTime: Date.now() - performance.now(),
      },
      memory: {
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal,
      },
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json({
      version: "v1",
      status: "success",
      data: metrics,
    });
  } catch (error) {
    return res.status(500).json({
      version: "v1",
      status: "error",
      error: {
        code: "INTERNAL_ERROR",
        message: "Health check failed",
      },
    });
  }
});
```

## 🚦 Rate Limiting

### **Rate Limit Konfiguration**

```typescript
import rateLimit from "express-rate-limit";

// Allgemeine Rate Limits
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100, // Maximal 100 Requests pro IP
  message: {
    status: "error",
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests, please try again later",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strenge Rate Limits für Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Maximal 5 Login-Versuche
  message: {
    status: "error",
    error: {
      code: "AUTH_RATE_LIMIT_EXCEEDED",
      message: "Too many authentication attempts",
    },
  },
});

// API-spezifische Limits
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 Minute
  max: 60, // 60 Requests pro Minute
  keyGenerator: (req) => req.user?.sub || req.ip,
  message: {
    status: "error",
    error: {
      code: "API_RATE_LIMIT_EXCEEDED",
      message: "API rate limit exceeded",
    },
  },
});
```

## 📝 API-Dokumentation

### **OpenAPI 3.0 Schema**

```yaml
openapi: 3.0.0
info:
  title: Lopez IT Welt Enterprise++ API
  version: 1.0.0
  description: RESTful API für Content Management und A/B Testing
  contact:
    name: Lopez IT Welt
    email: api@lopez-it-welt.de
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://api.lopez-it-welt.de/v1
    description: Production server
  - url: https://staging-api.lopez-it-welt.de/v1
    description: Staging server
  - url: http://localhost:3000/api/v1
    description: Development server

paths:
  /content/pages:
    get:
      summary: Get all pages
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
        - name: status
          in: query
          schema:
            type: string
            enum: [draft, published, archived]
        - name: language
          in: query
          schema:
            type: string
            enum: [de, en, es]
      responses:
        "200":
          description: Success
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/PageListResponse"
        "401":
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
        "500":
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"

components:
  schemas:
    PageListResponse:
      type: object
      properties:
        version:
          type: string
          example: "v1"
        status:
          type: string
          enum: [success, error]
        data:
          type: array
          items:
            $ref: "#/components/schemas/Page"
        meta:
          $ref: "#/components/schemas/ResponseMeta"

    Page:
      type: object
      properties:
        id:
          type: integer
        slug:
          type: string
        title:
          type: string
        content:
          type: string
        status:
          type: string
          enum: [draft, published, archived]
        language:
          type: string
          enum: [de, en, es]
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
```

## 🔍 Error Handling

### **Error Response Format**

```typescript
interface ErrorResponse {
  version: string;
  status: "error";
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    requestId: string;
  };
}

// Error Codes
const ERROR_CODES = {
  // Authentication
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_TOKEN: "INVALID_TOKEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",

  // Authorization
  FORBIDDEN: "FORBIDDEN",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",

  // Validation
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",

  // Resource
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",

  // Rate Limiting
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",

  // Server
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
};

// Error Handler
class ErrorHandler {
  static handle(error: Error, req: NextApiRequest): ErrorResponse {
    const requestId = crypto.randomUUID();

    // Log Error
    console.error(`[${requestId}] ${error.message}`, {
      stack: error.stack,
      url: req.url,
      method: req.method,
      userAgent: req.headers["user-agent"],
    });

    // Return appropriate error response
    if (error instanceof ValidationError) {
      return {
        version: "v1",
        status: "error",
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details: error.details,
          timestamp: new Date().toISOString(),
          requestId,
        },
      };
    }

    return {
      version: "v1",
      status: "error",
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
        timestamp: new Date().toISOString(),
        requestId,
      },
    };
  }
}
```

## 📊 API-Monitoring

### **Request Logging**

```typescript
// Request Logger Middleware
export function withLogging(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();

    // Request loggen
    console.log(`[${requestId}] ${req.method} ${req.url}`, {
      userAgent: req.headers["user-agent"],
      ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      userId: req.user?.sub,
    });

    // Response loggen
    res.on("finish", () => {
      const duration = Date.now() - startTime;
      console.log(`[${requestId}] ${res.statusCode} ${duration}ms`);
    });

    return handler(req, res);
  };
}
```

## 📚 Verwandte Dokumentation

- [Definition of Done](../01-PROJEKT-MANAGEMENT/01-03-definition-of-done.md) - Zentrale DoD-Kriterien
- [Architektur und Module](../02-ARCHITEKTUR/02-02-architektur-und-module.md) - System-Architektur
- [Datenmodell](../02-ARCHITEKTUR/02-03-datenmodell.md) - Datenbank-Schema

---

**Nächste Schritte:**

- [ ] GraphQL API implementieren
- [ ] WebSocket für Real-time Updates
- [ ] API-Versioning Strategy
- [ ] Advanced Caching
- [ ] API-Gateway Integration
