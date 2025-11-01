# API-Dokumentation

## Übersicht

Die Lopez IT Welt API bietet REST und GraphQL Endpunkte für die Verwaltung von IT-Services und Cloud-Ressourcen.

## Authentifizierung

### JWT Token

```http
Authorization: Bearer <token>
```

### API Key

```http
X-API-Key: <api-key>
```

## REST API

### Benutzer-Management

#### Benutzer erstellen

```http
POST /api/v1/users
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword",
  "role": "user"
}
```

#### Benutzer abrufen

```http
GET /api/v1/users/{id}
```

### Service-Management

#### Service erstellen

```http
POST /api/v1/services
Content-Type: application/json

{
  "name": "Web Server",
  "type": "compute",
  "specs": {
    "cpu": 2,
    "memory": "4GB"
  }
}
```

#### Service-Status abrufen

```http
GET /api/v1/services/{id}/status
```

## GraphQL API

### Schema

```graphql
type User {
  id: ID!
  email: String!
  role: Role!
  services: [Service!]
}

type Service {
  id: ID!
  name: String!
  type: ServiceType!
  status: ServiceStatus!
  specs: ServiceSpecs!
}

enum Role {
  ADMIN
  USER
  GUEST
}

enum ServiceType {
  COMPUTE
  STORAGE
  NETWORK
}

enum ServiceStatus {
  RUNNING
  STOPPED
  ERROR
}

type ServiceSpecs {
  cpu: Int!
  memory: String!
  storage: String
}
```

### Queries

```graphql
query GetUser {
  user(id: "123") {
    id
    email
    services {
      name
      status
    }
  }
}
```

### Mutations

```graphql
mutation CreateService {
  createService(
    input: {
      name: "Web Server"
      type: COMPUTE
      specs: { cpu: 2, memory: "4GB" }
    }
  ) {
    id
    name
    status
  }
}
```

## Fehlerbehandlung

### HTTP Status Codes

- 200: Erfolg
- 400: Ungültige Anfrage
- 401: Nicht authentifiziert
- 403: Nicht autorisiert
- 404: Nicht gefunden
- 500: Server-Fehler

### Fehlerformat

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Ungültige Eingabedaten",
    "details": {
      "field": "email",
      "reason": "Ungültiges E-Mail-Format"
    }
  }
}
```

## Rate Limiting

- 100 Anfragen pro Minute pro API-Key
- 1000 Anfragen pro Stunde pro Benutzer

## Versionierung

- API-Version in URL: `/api/v1/`
- Versionierung durch Header: `Accept: application/vnd.lopez-it-welt.v1+json`

---

_Diese Dokumentation wird regelmäßig aktualisiert. Letzte Änderung: 2024-03-19_
