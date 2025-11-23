# 📦 Neues Modul - Lopez IT Welt

## 📋 Übersicht

**Dokument:** Neues Modul Template  
**Version:** 2.0.0  
**Erstellt:** 2025-07-05  
**Zweck:** Template für neue Module im Enterprise-System

---

## 🎯 Modul-Struktur

### **Standard-Modul-Struktur:**

```
modules/neues-modul/
├── 📁 src/
│   ├── 📄 index.ts              # Modul-Hauptdatei
│   ├── 📄 types.ts              # TypeScript-Definitionen
│   ├── 📄 constants.ts          # Konstanten
│   ├── 📄 utils.ts              # Hilfsfunktionen
│   ├── 📁 controllers/          # Controller
│   │   └── 📄 neues-modul.controller.ts
│   ├── 📁 services/             # Business Logic
│   │   └── 📄 neues-modul.service.ts
│   ├── 📁 models/               # Datenmodelle
│   │   └── 📄 neues-modul.model.ts
│   ├── 📁 routes/               # API-Routen
│   │   └── 📄 neues-modul.routes.ts
│   ├── 📁 middleware/           # Middleware
│   │   └── 📄 neues-modul.middleware.ts
│   ├── 📁 validators/           # Validierung
│   │   └── 📄 neues-modul.validator.ts
│   └── 📁 tests/                # Tests
│       ├── 📄 neues-modul.test.ts
│       ├── 📄 neues-modul.integration.test.ts
│       └── 📄 neues-modul.e2e.test.ts
├── 📄 package.json              # Modul-Dependencies
├── 📄 README.md                 # Modul-Dokumentation
├── 📄 CHANGELOG.md              # Änderungsprotokoll
├── 📄 LICENSE                   # Lizenz
└── 📄 tsconfig.json             # TypeScript-Konfiguration
```

---

## 🚀 Modul-Erstellung

### **1. Modul-Generator:**

```bash
# Modul erstellen
npm run create:module neues-modul

# Oder manuell
mkdir -p modules/neues-modul/src/{controllers,services,models,routes,middleware,validators,tests}
```

### **2. Package.json Template:**

```json
{
  "name": "@lopez-it-welt/neues-modul",
  "version": "1.0.0",
  "description": "Neues Modul für Lopez IT Welt Enterprise-System",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "dev": "ts-node-dev --respawn src/index.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "joi": "^17.9.2",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "winston": "^3.8.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.2",
    "@types/node": "^20.3.1",
    "@typescript-eslint/eslint-plugin": "^5.59.7",
    "@typescript-eslint/parser": "^5.59.7",
    "eslint": "^8.42.0",
    "jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.1.3"
  },
  "keywords": ["lopez-it-welt", "enterprise", "module", "neues-modul"],
  "author": "Lopez IT Welt Team",
  "license": "MIT"
}
```

### **3. TypeScript-Konfiguration:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "resolveJsonModule": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

---

## 📝 Modul-Templates

### **1. Controller Template:**

```typescript
// src/controllers/neues-modul.controller.ts
import { Request, Response, NextFunction } from 'express';
import { NeuesModulService } from '../services/neues-modul.service';
import { NeuesModulValidator } from '../validators/neues-modul.validator';
import { logger } from '../utils/logger';

export class NeuesModulController {
  private neuesModulService: NeuesModulService;
  private neuesModulValidator: NeuesModulValidator;

  constructor() {
    this.neuesModulService = new NeuesModulService();
    this.neuesModulValidator = new NeuesModulValidator();
  }

  /**
   * GET /api/neues-modul
   * Alle Einträge abrufen
   */
  public getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        page = 1,
        limit = 10,
        sort = 'createdAt',
        order = 'desc',
      } = req.query;

      const result = await this.neuesModulService.getAll({
        page: Number(page),
        limit: Number(limit),
        sort: String(sort),
        order: String(order),
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error('Error in getAll:', error);
      next(error);
    }
  };

  /**
   * GET /api/neues-modul/:id
   * Einen Eintrag abrufen
   */
  public getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const validation = this.neuesModulValidator.validateId(id);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          error: validation.errors,
        });
        return;
      }

      const result = await this.neuesModulService.getById(id);

      if (!result) {
        res.status(404).json({
          success: false,
          error: 'Eintrag nicht gefunden',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in getById:', error);
      next(error);
    }
  };

  /**
   * POST /api/neues-modul
   * Neuen Eintrag erstellen
   */
  public create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validation = this.neuesModulValidator.validateCreate(req.body);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          error: validation.errors,
        });
        return;
      }

      const result = await this.neuesModulService.create(req.body);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in create:', error);
      next(error);
    }
  };

  /**
   * PUT /api/neues-modul/:id
   * Eintrag aktualisieren
   */
  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const validation = this.neuesModulValidator.validateUpdate(id, req.body);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          error: validation.errors,
        });
        return;
      }

      const result = await this.neuesModulService.update(id, req.body);

      if (!result) {
        res.status(404).json({
          success: false,
          error: 'Eintrag nicht gefunden',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error in update:', error);
      next(error);
    }
  };

  /**
   * DELETE /api/neues-modul/:id
   * Eintrag löschen
   */
  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const validation = this.neuesModulValidator.validateId(id);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          error: validation.errors,
        });
        return;
      }

      const result = await this.neuesModulService.delete(id);

      if (!result) {
        res.status(404).json({
          success: false,
          error: 'Eintrag nicht gefunden',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Eintrag erfolgreich gelöscht',
      });
    } catch (error) {
      logger.error('Error in delete:', error);
      next(error);
    }
  };
}
```

### **2. Service Template:**

```typescript
// src/services/neues-modul.service.ts
import { NeuesModulModel } from '../models/neues-modul.model';
import {
  INeuesModul,
  INeuesModulCreate,
  INeuesModulUpdate,
  IQueryOptions,
} from '../types';
import { logger } from '../utils/logger';

export class NeuesModulService {
  private neuesModulModel: NeuesModulModel;

  constructor() {
    this.neuesModulModel = new NeuesModulModel();
  }

  /**
   * Alle Einträge abrufen
   */
  public async getAll(options: IQueryOptions): Promise<{
    data: INeuesModul[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const { data, total } = await this.neuesModulModel.findAll(options);

      return {
        data,
        pagination: {
          page: options.page,
          limit: options.limit,
          total,
          pages: Math.ceil(total / options.limit),
        },
      };
    } catch (error) {
      logger.error('Error in getAll service:', error);
      throw error;
    }
  }

  /**
   * Einen Eintrag abrufen
   */
  public async getById(id: string): Promise<INeuesModul | null> {
    try {
      return await this.neuesModulModel.findById(id);
    } catch (error) {
      logger.error('Error in getById service:', error);
      throw error;
    }
  }

  /**
   * Neuen Eintrag erstellen
   */
  public async create(data: INeuesModulCreate): Promise<INeuesModul> {
    try {
      // Business Logic hier
      const enrichedData = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return await this.neuesModulModel.create(enrichedData);
    } catch (error) {
      logger.error('Error in create service:', error);
      throw error;
    }
  }

  /**
   * Eintrag aktualisieren
   */
  public async update(
    id: string,
    data: INeuesModulUpdate
  ): Promise<INeuesModul | null> {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date(),
      };

      return await this.neuesModulModel.update(id, updateData);
    } catch (error) {
      logger.error('Error in update service:', error);
      throw error;
    }
  }

  /**
   * Eintrag löschen
   */
  public async delete(id: string): Promise<boolean> {
    try {
      return await this.neuesModulModel.delete(id);
    } catch (error) {
      logger.error('Error in delete service:', error);
      throw error;
    }
  }

  /**
   * Custom Business Logic
   */
  public async customBusinessLogic(data: any): Promise<any> {
    try {
      // Implementiere hier die spezifische Business Logic
      logger.info('Custom business logic executed');

      return {
        success: true,
        data: 'Custom business logic result',
      };
    } catch (error) {
      logger.error('Error in customBusinessLogic:', error);
      throw error;
    }
  }
}
```

### **3. Model Template:**

```typescript
// src/models/neues-modul.model.ts
import {
  INeuesModul,
  INeuesModulCreate,
  INeuesModulUpdate,
  IQueryOptions,
} from '../types';
import { Database } from '../utils/database';
import { logger } from '../utils/logger';

export class NeuesModulModel {
  private db: Database;
  private tableName = 'neues_modul';

  constructor() {
    this.db = new Database();
  }

  /**
   * Alle Einträge finden
   */
  public async findAll(options: IQueryOptions): Promise<{
    data: INeuesModul[];
    total: number;
  }> {
    try {
      const { page, limit, sort, order } = options;
      const offset = (page - 1) * limit;

      const query = `
        SELECT * FROM ${this.tableName}
        ORDER BY ${sort} ${order}
        LIMIT $1 OFFSET $2
      `;

      const countQuery = `SELECT COUNT(*) FROM ${this.tableName}`;

      const [data, countResult] = await Promise.all([
        this.db.query(query, [limit, offset]),
        this.db.query(countQuery),
      ]);

      return {
        data: data.rows,
        total: parseInt(countResult.rows[0].count),
      };
    } catch (error) {
      logger.error('Error in findAll:', error);
      throw error;
    }
  }

  /**
   * Einen Eintrag finden
   */
  public async findById(id: string): Promise<INeuesModul | null> {
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
      const result = await this.db.query(query, [id]);

      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error in findById:', error);
      throw error;
    }
  }

  /**
   * Neuen Eintrag erstellen
   */
  public async create(data: INeuesModulCreate): Promise<INeuesModul> {
    try {
      const query = `
        INSERT INTO ${this.tableName} (name, description, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const values = [
        data.name,
        data.description,
        data.status,
        data.createdAt,
        data.updatedAt,
      ];

      const result = await this.db.query(query, values);
      return result.rows[0];
    } catch (error) {
      logger.error('Error in create:', error);
      throw error;
    }
  }

  /**
   * Eintrag aktualisieren
   */
  public async update(
    id: string,
    data: INeuesModulUpdate
  ): Promise<INeuesModul | null> {
    try {
      const query = `
        UPDATE ${this.tableName}
        SET name = COALESCE($1, name),
            description = COALESCE($2, description),
            status = COALESCE($3, status),
            updated_at = $4
        WHERE id = $5
        RETURNING *
      `;

      const values = [
        data.name,
        data.description,
        data.status,
        data.updatedAt,
        id,
      ];

      const result = await this.db.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error in update:', error);
      throw error;
    }
  }

  /**
   * Eintrag löschen
   */
  public async delete(id: string): Promise<boolean> {
    try {
      const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
      const result = await this.db.query(query, [id]);

      return result.rowCount > 0;
    } catch (error) {
      logger.error('Error in delete:', error);
      throw error;
    }
  }
}
```

---

## 🧪 Test-Templates

### **1. Unit Test Template:**

```typescript
// src/tests/neues-modul.test.ts
import { NeuesModulService } from '../services/neues-modul.service';
import { NeuesModulModel } from '../models/neues-modul.model';
import { INeuesModul, INeuesModulCreate } from '../types';

// Mock das Model
jest.mock('../models/neues-modul.model');

describe('NeuesModulService', () => {
  let neuesModulService: NeuesModulService;
  let mockNeuesModulModel: jest.Mocked<NeuesModulModel>;

  beforeEach(() => {
    mockNeuesModulModel = new NeuesModulModel() as jest.Mocked<NeuesModulModel>;
    neuesModulService = new NeuesModulService();
  });

  describe('getAll', () => {
    it('should return all entries with pagination', async () => {
      const mockData = [
        {
          id: '1',
          name: 'Test 1',
          description: 'Description 1',
          status: 'active',
        },
        {
          id: '2',
          name: 'Test 2',
          description: 'Description 2',
          status: 'active',
        },
      ];

      mockNeuesModulModel.findAll.mockResolvedValue({
        data: mockData,
        total: 2,
      });

      const result = await neuesModulService.getAll({
        page: 1,
        limit: 10,
        sort: 'createdAt',
        order: 'desc',
      });

      expect(result.data).toEqual(mockData);
      expect(result.pagination.total).toBe(2);
      expect(mockNeuesModulModel.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        sort: 'createdAt',
        order: 'desc',
      });
    });
  });

  describe('getById', () => {
    it('should return entry by id', async () => {
      const mockEntry: INeuesModul = {
        id: '1',
        name: 'Test Entry',
        description: 'Test Description',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockNeuesModulModel.findById.mockResolvedValue(mockEntry);

      const result = await neuesModulService.getById('1');

      expect(result).toEqual(mockEntry);
      expect(mockNeuesModulModel.findById).toHaveBeenCalledWith('1');
    });

    it('should return null for non-existent id', async () => {
      mockNeuesModulModel.findById.mockResolvedValue(null);

      const result = await neuesModulService.getById('999');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create new entry', async () => {
      const createData: INeuesModulCreate = {
        name: 'New Entry',
        description: 'New Description',
        status: 'active',
      };

      const mockCreatedEntry: INeuesModul = {
        id: '1',
        ...createData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockNeuesModulModel.create.mockResolvedValue(mockCreatedEntry);

      const result = await neuesModulService.create(createData);

      expect(result).toEqual(mockCreatedEntry);
      expect(mockNeuesModulModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createData,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })
      );
    });
  });
});
```

### **2. Integration Test Template:**

```typescript
// src/tests/neues-modul.integration.test.ts
import request from 'supertest';
import { app } from '../index';
import { Database } from '../utils/database';

describe('NeuesModul API Integration Tests', () => {
  let db: Database;

  beforeAll(async () => {
    db = new Database();
    // Setup test database
    await db.query(`
      CREATE TABLE IF NOT EXISTS neues_modul (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });

  afterAll(async () => {
    // Cleanup test database
    await db.query('DROP TABLE IF EXISTS neues_modul');
    await db.close();
  });

  beforeEach(async () => {
    // Clear test data
    await db.query('DELETE FROM neues_modul');
  });

  describe('GET /api/neues-modul', () => {
    it('should return empty array when no entries exist', async () => {
      const response = await request(app).get('/api/neues-modul').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });

    it('should return all entries with pagination', async () => {
      // Insert test data
      await db.query(`
        INSERT INTO neues_modul (name, description, status)
        VALUES 
          ('Test Entry 1', 'Description 1', 'active'),
          ('Test Entry 2', 'Description 2', 'active'),
          ('Test Entry 3', 'Description 3', 'inactive')
      `);

      const response = await request(app)
        .get('/api/neues-modul?page=1&limit=2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.total).toBe(3);
      expect(response.body.pagination.pages).toBe(2);
    });
  });

  describe('GET /api/neues-modul/:id', () => {
    it('should return entry by id', async () => {
      // Insert test data
      const result = await db.query(`
        INSERT INTO neues_modul (name, description, status)
        VALUES ('Test Entry', 'Test Description', 'active')
        RETURNING id
      `);
      const id = result.rows[0].id;

      const response = await request(app)
        .get(`/api/neues-modul/${id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Entry');
      expect(response.body.data.description).toBe('Test Description');
    });

    it('should return 404 for non-existent id', async () => {
      const response = await request(app)
        .get('/api/neues-modul/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Eintrag nicht gefunden');
    });
  });

  describe('POST /api/neues-modul', () => {
    it('should create new entry', async () => {
      const newEntry = {
        name: 'New Entry',
        description: 'New Description',
        status: 'active',
      };

      const response = await request(app)
        .post('/api/neues-modul')
        .send(newEntry)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(newEntry.name);
      expect(response.body.data.description).toBe(newEntry.description);
      expect(response.body.data.id).toBeDefined();
    });

    it('should return 400 for invalid data', async () => {
      const invalidEntry = {
        name: '', // Invalid: empty name
        description: 'Test Description',
      };

      const response = await request(app)
        .post('/api/neues-modul')
        .send(invalidEntry)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
});
```

---

## 📋 Modul-Checkliste

### **Pre-Development:**

- [ ] Modul-Anforderungen definieren
- [ ] API-Spezifikation erstellen
- [ ] Datenbank-Schema designen
- [ ] Security-Requirements prüfen

### **Development:**

- [ ] Modul-Struktur erstellen
- [ ] Controller implementieren
- [ ] Service implementieren
- [ ] Model implementieren
- [ ] Validierung implementieren
- [ ] Middleware implementieren

### **Testing:**

- [ ] Unit Tests schreiben
- [ ] Integration Tests schreiben
- [ ] E2E Tests schreiben
- [ ] Test-Coverage > 90%
- [ ] Performance Tests durchführen

### **Documentation:**

- [ ] API-Dokumentation erstellen
- [ ] README.md schreiben
- [ ] CHANGELOG.md pflegen
- [ ] Code-Kommentare hinzufügen

### **Deployment:**

- [ ] Modul in Hauptanwendung integrieren
- [ ] Database-Migration erstellen
- [ ] Environment-Variablen konfigurieren
- [ ] Monitoring einrichten

---

## 🚀 Modul-Deployment

### **1. Modul registrieren:**

```typescript
// src/modules/index.ts
import { NeuesModulRoutes } from './neues-modul/routes/neues-modul.routes';

export const registerModules = (app: Express) => {
  // Neues Modul registrieren
  app.use('/api/neues-modul', NeuesModulRoutes);
};
```

### **2. Database-Migration:**

```sql
-- migrations/001_create_neues_modul_table.sql
CREATE TABLE neues_modul (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_neues_modul_status ON neues_modul(status);
CREATE INDEX idx_neues_modul_created_at ON neues_modul(created_at);
```

### **3. Environment-Variablen:**

```bash
# .env
NEUES_MODUL_ENABLED=true
NEUES_MODUL_API_KEY=your_api_key_here
NEUES_MODUL_WEBHOOK_URL=https://webhook.lopez-enterprise.com/neues-modul
```

---

## 📞 Support

### **Modul-Support:**

- **E-Mail:** modules@lopez-enterprise.com
- **Telefon:** +49 231 12345678
- **Dokumentation:** https://docs.lopez-enterprise.com/modules

### **Development-Support:**

- **E-Mail:** dev@lopez-enterprise.com
- **Slack:** #module-development
- **GitHub:** https://github.com/lopez-it-welt/modules

---

**🎯 Ziel:** Schnelle und qualitativ hochwertige Modul-Entwicklung!  
**📅 Letzte Aktualisierung:** 2025-07-05  
**👥 Verantwortlich:** Module Development Team
