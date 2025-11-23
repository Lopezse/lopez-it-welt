# 💻 Development-Guidelines - Entwicklungs-Richtlinien

**Version:** 1.0  
**Datum:** 2025-07-05  
**Status:** 🚧 IN ENTWICKLUNG  
**Autor:** Lopez IT Welt Team

## 📋 **ÜBERSICHT**

Die **Development-Guidelines** definieren die vollständigen Entwicklungs-Richtlinien für das Lopez IT Welt System. Sie stellen sicher, dass alle Entwickler einheitlich, qualitativ hochwertig und effizient arbeiten.

## 🎯 **ENTWICKLUNGS-PRINZIPIEN**

### **✅ Code-Qualität**

- **Clean Code:** Lesbarer, wartbarer Code
- **SOLID-Prinzipien:** Einheitliche Architektur
- **DRY-Prinzip:** Keine Duplikate
- **KISS-Prinzip:** Einfachheit bevorzugen

### **✅ Sicherheit**

- **Security-First:** Sicherheit von Anfang an
- **Input-Validierung:** Alle Eingaben validieren
- **SQL-Injection-Schutz:** Prepared Statements verwenden
- **XSS-Schutz:** Content sanitization

### **✅ Performance**

- **Optimierung:** Performance von Anfang an
- **Caching:** Intelligentes Caching
- **Lazy Loading:** Ressourcen sparsam laden
- **Monitoring:** Performance überwachen

## 🛠️ **TECHNOLOGIE-STACK**

### **Frontend**

```typescript
// Technologie-Stack
{
  "framework": "Next.js 14",
  "language": "TypeScript 5.x",
  "styling": "TailwindCSS 3.x",
  "state": "React Hooks",
  "forms": "React Hook Form",
  "validation": "Zod",
  "icons": "Lucide React",
  "animations": "Framer Motion"
}
```

### **Backend**

```typescript
// Backend-Stack
{
  "runtime": "Node.js 18.x",
  "framework": "Next.js API Routes",
  "database": "MySQL 8.0",
  "cache": "Redis 7.x",
  "authentication": "NextAuth.js",
  "validation": "Zod",
  "logging": "Winston"
}
```

### **DevOps**

```typescript
// DevOps-Stack
{
  "versioning": "Git",
  "ci_cd": "GitHub Actions",
  "containerization": "Docker",
  "orchestration": "Kubernetes",
  "monitoring": "Prometheus + Grafana",
  "logging": "ELK Stack"
}
```

## 📝 **CODING-STANDARDS**

### **TypeScript-Richtlinien**

```typescript
// ✅ GUT: Klare Typisierung
interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  createdAt: Date;
}

// ✅ GUT: Funktionen mit Typen
function createUser(userData: Omit<User, "id" | "createdAt">): Promise<User> {
  // Implementation
}

// ❌ SCHLECHT: Any verwenden
function processData(data: any): any {
  // Implementation
}
```

### **React-Komponenten**

```typescript
// ✅ GUT: Funktionale Komponenten
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({
  variant,
  size,
  children,
  onClick,
  disabled = false
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// ❌ SCHLECHT: Props ohne Typen
export function Button(props) {
  return <button {...props} />;
}
```

### **Deutsche Namenskonventionen**

```typescript
// ✅ GUT: Deutsche Funktionsnamen
function benutzerHinzufuegen(benutzer: User): Promise<void> {
  // Implementation
}

function benutzerAktualisieren(benutzerId: string, daten: Partial<User>): Promise<void> {
  // Implementation
}

function benutzerLoeschen(benutzerId: string): Promise<void> {
  // Implementation
}

// ✅ GUT: Deutsche Variablen-Namen
const benutzerListe: User[] = [];
const aktuelleSeite: number = 1;
const gesamtAnzahl: number = 0;

// ❌ SCHLECHT: Englische Namen
function addUser(user: User): Promise<void> {
  // Implementation
}
```

## 🔒 **SICHERHEITS-RICHTLINIEN**

### **Input-Validierung**

```typescript
// ✅ GUT: Zod-Schema für Validierung
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein"),
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
  role: z.enum(["admin", "user"]),
});

// ✅ GUT: Validierung in API-Route
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const validatedData = userSchema.parse(data);

    // Verarbeitung mit validierten Daten
    const user = await createUser(validatedData);

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validierungsfehler", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: "Server-Fehler" }, { status: 500 });
  }
}
```

### **SQL-Injection-Schutz**

```typescript
// ✅ GUT: Prepared Statements
export async function getUserById(id: string): Promise<User | null> {
  const query = "SELECT * FROM users WHERE id = ?";
  const [rows] = await pool.execute(query, [id]);

  if (Array.isArray(rows) && rows.length > 0) {
    return rows[0] as User;
  }

  return null;
}

// ❌ SCHLECHT: String-Konkatenation
export async function getUserById(id: string): Promise<User | null> {
  const query = `SELECT * FROM users WHERE id = '${id}'`;
  const [rows] = await pool.execute(query);

  return rows[0] as User;
}
```

### **XSS-Schutz**

```typescript
// ✅ GUT: Content sanitization
import DOMPurify from 'dompurify';

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input);
}

// ✅ GUT: React mit sicheren Props
function UserProfile({ user }: { user: User }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      {/* Verwende dangerouslySetInnerHTML nur wenn nötig */}
      <div
        dangerouslySetInnerHTML={{
          __html: sanitizeInput(user.bio || '')
        }}
      />
    </div>
  );
}

// ❌ SCHLECHT: Unsichere HTML-Injection
function UserProfile({ user }: { user: User }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <div dangerouslySetInnerHTML={{ __html: user.bio }} />
    </div>
  );
}
```

## ⚡ **PERFORMANCE-RICHTLINIEN**

### **React-Optimierung**

```typescript
// ✅ GUT: React.memo für teure Komponenten
import { memo } from 'react';

interface ExpensiveComponentProps {
  data: ComplexData[];
  onItemClick: (id: string) => void;
}

export const ExpensiveComponent = memo(function ExpensiveComponent({
  data,
  onItemClick
}: ExpensiveComponentProps) {
  return (
    <div>
      {data.map(item => (
        <div key={item.id} onClick={() => onItemClick(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
});

// ✅ GUT: useMemo für teure Berechnungen
function DataTable({ data }: { data: User[] }) {
  const sortedData = useMemo(() => {
    return data.sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  return (
    <table>
      {sortedData.map(user => (
        <tr key={user.id}>
          <td>{user.name}</td>
          <td>{user.email}</td>
        </tr>
      ))}
    </table>
  );
}
```

### **Next.js-Optimierung**

```typescript
// ✅ GUT: Dynamische Imports
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Lade...</div>,
  ssr: false
});

// ✅ GUT: Image-Optimierung
import Image from 'next/image';

function OptimizedImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={500}
      height={300}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  );
}

// ✅ GUT: API-Route-Caching
export async function GET(request: NextRequest) {
  const response = NextResponse.json({ data: 'cached data' });

  // Cache für 1 Stunde
  response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');

  return response;
}
```

### **Database-Optimierung**

```typescript
// ✅ GUT: Connection Pooling
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

// ✅ GUT: Prepared Statements mit Pool
export async function getUsers(limit: number = 10): Promise<User[]> {
  const query = "SELECT * FROM users ORDER BY created_at DESC LIMIT ?";
  const [rows] = await pool.execute(query, [limit]);
  return rows as User[];
}

// ✅ GUT: Transaktionen
export async function createUserWithProfile(
  userData: UserData,
  profileData: ProfileData,
): Promise<User> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const user = await createUser(connection, userData);
    await createProfile(connection, user.id, profileData);

    await connection.commit();
    return user;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
```

## 🧪 **TESTING-RICHTLINIEN**

### **Unit-Tests**

```typescript
// ✅ GUT: Jest mit TypeScript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('rendert korrekt mit allen Props', () => {
    const handleClick = jest.fn();

    render(
      <Button
        variant="primary"
        size="md"
        onClick={handleClick}
      >
        Klick mich
      </Button>
    );

    const button = screen.getByRole('button', { name: /klick mich/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-primary', 'btn-md');
  });

  it('ruft onClick-Handler auf', () => {
    const handleClick = jest.fn();

    render(
      <Button variant="primary" onClick={handleClick}>
        Klick mich
      </Button>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('ist deaktiviert wenn disabled=true', () => {
    render(
      <Button variant="primary" disabled>
        Klick mich
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
```

### **Integration-Tests**

```typescript
// ✅ GUT: API-Route-Tests
import { createMocks } from "node-mocks-http";
import { POST } from "@/app/api/users/route";

describe("/api/users", () => {
  it("erstellt einen neuen Benutzer", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        name: "Test User",
        email: "test@example.org",
        password: "password123",
      },
    });

    await POST(req);

    expect(res._getStatusCode()).toBe(201);

    const data = JSON.parse(res._getData());
    expect(data.name).toBe("Test User");
    expect(data.email).toBe("test@example.org");
  });

  it("gibt Fehler bei ungültigen Daten zurück", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        name: "",
        email: "invalid-email",
        password: "123",
      },
    });

    await POST(req);

    expect(res._getStatusCode()).toBe(400);

    const data = JSON.parse(res._getData());
    expect(data.error).toBe("Validierungsfehler");
  });
});
```

### **E2E-Tests**

```typescript
// ✅ GUT: Cypress-Tests
describe("Benutzer-Verwaltung", () => {
  beforeEach(() => {
    cy.visit("/admin/users");
    cy.login("admin@lopez-it-welt.de", "password");
  });

  it("erstellt einen neuen Benutzer", () => {
    cy.get('[data-testid="create-user-button"]').click();

    cy.get('[data-testid="user-name-input"]').type("Neuer Benutzer");
    cy.get('[data-testid="user-email-input"]').type("test@example.org");
    cy.get('[data-testid="user-password-input"]').type("password123");
    cy.get('[data-testid="user-role-select"]').select("user");

    cy.get('[data-testid="save-user-button"]').click();

    cy.get('[data-testid="success-message"]').should("contain", "Benutzer erstellt");
    cy.get('[data-testid="users-table"]').should("contain", "Neuer Benutzer");
  });

  it("bearbeitet einen bestehenden Benutzer", () => {
    cy.get('[data-testid="edit-user-button"]').first().click();

    cy.get('[data-testid="user-name-input"]').clear().type("Bearbeiteter Name");
    cy.get('[data-testid="save-user-button"]').click();

    cy.get('[data-testid="success-message"]').should("contain", "Benutzer aktualisiert");
  });

  it("löscht einen Benutzer", () => {
    cy.get('[data-testid="delete-user-button"]').first().click();
    cy.get('[data-testid="confirm-delete-button"]').click();

    cy.get('[data-testid="success-message"]').should("contain", "Benutzer gelöscht");
  });
});
```

## 📚 **DOKUMENTATION-RICHTLINIEN**

### **Code-Dokumentation**

````typescript
// ✅ GUT: JSDoc-Kommentare
/**
 * Erstellt einen neuen Benutzer im System
 * @param userData - Die Benutzerdaten
 * @param options - Zusätzliche Optionen
 * @returns Promise mit dem erstellten Benutzer
 * @throws {ValidationError} Wenn die Daten ungültig sind
 * @throws {DatabaseError} Wenn die Datenbank nicht erreichbar ist
 * @example
 * ```typescript
 * const user = await createUser({
 *   name: 'Max Mustermann',
 *   email: 'test@example.org',
 *   password: 'secure123'
 * });
 * ```
 */
export async function createUser(
  userData: CreateUserData,
  options: CreateUserOptions = {},
): Promise<User> {
  // Implementation
}

// ✅ GUT: Interface-Dokumentation
/**
 * Repräsentiert einen Benutzer im System
 */
interface User {
  /** Eindeutige ID des Benutzers */
  id: string;

  /** E-Mail-Adresse des Benutzers (muss eindeutig sein) */
  email: string;

  /** Vollständiger Name des Benutzers */
  name: string;

  /** Rolle des Benutzers im System */
  role: "admin" | "user";

  /** Zeitpunkt der Erstellung */
  createdAt: Date;

  /** Zeitpunkt der letzten Aktualisierung */
  updatedAt: Date;
}
````

### **README-Dokumentation**

````markdown
# Lopez IT Welt - Development Guidelines

## 🚀 Schnellstart

### Voraussetzungen

- Node.js 18.x oder höher
- MySQL 8.0 oder höher
- Redis 7.x oder höher

### Installation

```bash
# Repository klonen
git clone https://github.com/lopez-it-welt/lopez-it-welt.git
cd lopez-it-welt

# Abhängigkeiten installieren
npm install

# Umgebungsvariablen konfigurieren
cp .env.example .env.local
# .env.local bearbeiten

# Datenbank-Migrationen ausführen
npm run db:migrate

# Entwicklungsserver starten
npm run dev
```
````

### Entwicklung

```bash
# Tests ausführen
npm run test

# Linting
npm run lint

# Type-Checking
npm run type-check

# Build erstellen
npm run build
```

## 📁 Projekt-Struktur

```
src/
├── app/                    # Next.js App Router
│   ├── (main)/            # Haupt-Bereich
│   ├── admin/             # Admin-Bereich
│   ├── api/               # API-Routen
│   └── globals.css        # Globale Styles
├── components/             # React-Komponenten
│   ├── Core/              # Core-Komponenten
│   ├── Features/          # Feature-Komponenten
│   └── admin/             # Admin-Komponenten
├── lib/                   # Utilities und Services
│   ├── auth.ts            # Authentifizierung
│   ├── database.ts        # Datenbank-Verbindung
│   └── utils.ts           # Hilfsfunktionen
└── types/                 # TypeScript-Typen
    └── index.ts           # Globale Typen
```

## 🎯 Coding-Standards

### TypeScript

- Strikte TypeScript-Konfiguration verwenden
- Alle Funktionen und Variablen typisieren
- `any` vermeiden, `unknown` bevorzugen
- Interface über Type für Objekt-Typen

### React

- Funktionale Komponenten verwenden
- Hooks für State-Management
- Props mit TypeScript-Interfaces definieren
- Memoization für Performance-kritische Komponenten

### Styling

- TailwindCSS für Styling
- CSS-Module für komplexe Komponenten
- Responsive Design von Anfang an
- Accessibility (WCAG 2.1 AA) beachten

## 🧪 Testing

### Unit-Tests

- Jest + React Testing Library
- Mindestens 80% Code-Coverage
- Alle öffentlichen Funktionen testen
- Mocking für externe Dependencies

### Integration-Tests

- API-Route-Tests
- Datenbank-Integration-Tests
- Authentication-Tests
- Error-Handling-Tests

### E2E-Tests

- Cypress für Browser-Tests
- Kritische User-Journeys testen
- Cross-Browser-Testing
- Performance-Tests

## 🔒 Sicherheit

### Input-Validierung

- Zod für Schema-Validierung
- Server-seitige Validierung immer
- Client-seitige Validierung für UX
- Sanitization für HTML-Content

### Authentication

- NextAuth.js für Session-Management
- JWT für API-Authentifizierung
- Role-based Access Control (RBAC)
- Rate Limiting für API-Routen

### Database

- Prepared Statements verwenden
- SQL-Injection-Schutz
- Input-Sanitization
- Audit-Logging für kritische Operationen

## ⚡ Performance

### Frontend

- Code-Splitting mit Next.js
- Lazy Loading für Komponenten
- Image-Optimization
- Bundle-Analyse regelmäßig

### Backend

- Connection Pooling
- Query-Optimierung
- Caching-Strategien
- Monitoring und Alerting

## 📊 Monitoring

### Logging

- Winston für strukturiertes Logging
- Verschiedene Log-Level
- Error-Tracking
- Performance-Monitoring

### Metrics

- Application Performance Monitoring (APM)
- Database-Performance
- User-Experience-Metrics
- Business-Metrics

## 🚀 Deployment

### CI/CD

- GitHub Actions für Automatisierung
- Automatische Tests bei jedem Push
- Staging-Umgebung für Tests
- Blue-Green-Deployment

### Environment

- Development
- Staging
- Production
- Disaster Recovery

## 📞 Support

### Dokumentation

- API-Dokumentation mit OpenAPI
- Code-Dokumentation mit JSDoc
- README-Dateien für alle Module
- Troubleshooting-Guide

### Kommunikation

- GitHub Issues für Bugs
- Pull Requests für Features
- Code-Reviews obligatorisch
- Pair-Programming für komplexe Features

````

## 🔧 **TOOLS & WORKFLOW**

### **Entwicklungs-Tools**

```json
{
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "cypress": "^13.0.0"
  }
}
````

### **ESLint-Konfiguration**

```javascript
// .eslintrc.js
module.exports = {
  extends: ["next/core-web-vitals", "@typescript-eslint/recommended"],
  rules: {
    // TypeScript-Regeln
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",

    // React-Regeln
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // Allgemeine Regeln
    "no-console": "warn",
    "prefer-const": "error",
    "no-var": "error",
  },
};
```

### **Prettier-Konfiguration**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

---

**Letzte Aktualisierung:** 2025-07-05  
**Nächste Überprüfung:** 2025-07-06
