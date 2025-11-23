# 🗄️ Datenmodell - Lopez IT Welt Enterprise++

## 📋 Datenbankübersicht

**Datenbank:** MySQL 8.0+  
**ORM:** Prisma  
**Encoding:** UTF-8 (Unicode)  
**Collation:** utf8mb4_unicode_ci  
**Letzte Aktualisierung:** 2024-12-19

## 🏗️ Entity-Relationship-Modell

### **Hauptentitäten**

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Users    │    │    Roles    │    │Permissions │
│             │    │             │    │             │
│ • id        │    │ • id        │    │ • id        │
│ • email     │    │ • name      │    │ • name      │
│ • name      │    │ • desc      │    │ • resource  │
│ • role_id   │    │ • active    │    │ • action    │
│ • active    │    └─────────────┘    │ • active    │
└─────────────┘           │           └─────────────┘
         │                │                   │
         └────────────────┼───────────────────┘
                          │
         ┌────────────────┼─────────────────┐
         │                │                 │
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Content   │    │    Media    │    │Translations│
│             │    │             │    │             │
│ • id        │    │ • id        │    │ • id        │
│ • type      │    │ • filename  │    │ • key       │
│ • title     │    │ • path      │    │ • language  │
│ • content   │    │ • mime_type │    │ • value     │
│ • status    │    │ • size      │    │ • active    │
│ • user_id   │    │ • user_id   │    └─────────────┘
└─────────────┘    └─────────────┘
```

## 📊 Tabellen-Schema

### **1. Benutzer-Management**

#### **users**

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_id INT NOT NULL,
    language VARCHAR(5) DEFAULT 'de',
    timezone VARCHAR(50) DEFAULT 'Europe/Berlin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_role_id (role_id),
    INDEX idx_active (is_active),
    INDEX idx_last_login (last_login_at),

    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);
```

#### **roles**

```sql
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_name (name),
    INDEX idx_active (is_active)
);
```

#### **permissions**

```sql
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_resource_action (resource, action),
    INDEX idx_active (is_active)
);
```

#### **role_permissions**

```sql
CREATE TABLE role_permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_role_permission (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);
```

### **2. Content Management**

#### **content_header**

```sql
CREATE TABLE content_header (
    id INT PRIMARY KEY AUTO_INCREMENT,
    logo_text VARCHAR(100) NOT NULL,
    logo_icon VARCHAR(50),
    navigation_items JSON NOT NULL,
    language_switch BOOLEAN DEFAULT TRUE,
    cta_text VARCHAR(50),
    cta_link VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_active (is_active),
    INDEX idx_updated (updated_at)
);
```

#### **content_hero**

```sql
CREATE TABLE content_hero (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(500),
    description TEXT,
    button_text VARCHAR(50),
    button_link VARCHAR(255),
    background_style ENUM('color', 'image', 'gradient') DEFAULT 'color',
    background_value VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_active (is_active),
    INDEX idx_updated (updated_at)
);
```

#### **cms_pages**

```sql
CREATE TABLE cms_pages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    language VARCHAR(5) DEFAULT 'de',
    parent_id INT NULL,
    sort_order INT DEFAULT 0,
    is_homepage BOOLEAN DEFAULT FALSE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL,

    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_language (language),
    INDEX idx_parent (parent_id),
    INDEX idx_created_by (created_by),
    INDEX idx_published (published_at),

    FOREIGN KEY (parent_id) REFERENCES cms_pages(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
);
```

#### **cms_blocks**

```sql
CREATE TABLE cms_blocks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    type ENUM('text', 'image', 'video', 'gallery', 'form', 'custom') NOT NULL,
    content LONGTEXT,
    settings JSON,
    is_global BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_name (name),
    INDEX idx_type (type),
    INDEX idx_global (is_global),
    INDEX idx_active (is_active),
    INDEX idx_created_by (created_by),

    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
);
```

#### **cms_media**

```sql
CREATE TABLE cms_media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    width INT NULL,
    height INT NULL,
    alt_text VARCHAR(255),
    caption TEXT,
    folder_path VARCHAR(500) DEFAULT '/',
    is_public BOOLEAN DEFAULT TRUE,
    uploaded_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_filename (filename),
    INDEX idx_mime_type (mime_type),
    INDEX idx_folder (folder_path),
    INDEX idx_public (is_public),
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_created (created_at),

    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT
);
```

#### **cms_translations**

```sql
CREATE TABLE cms_translations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    translation_key VARCHAR(255) NOT NULL,
    language VARCHAR(5) NOT NULL,
    value TEXT NOT NULL,
    context VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY unique_key_language (translation_key, language),
    INDEX idx_language (language),
    INDEX idx_context (context),
    INDEX idx_active (is_active)
);
```

### **3. A/B Testing**

#### **ab_test_config**

```sql
CREATE TABLE ab_test_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    test_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT FALSE,
    traffic_split DECIMAL(5,2) DEFAULT 50.00,
    auto_activate_winner BOOLEAN DEFAULT FALSE,
    min_sample_size INT DEFAULT 1000,
    confidence_level DECIMAL(5,2) DEFAULT 95.00,
    start_date TIMESTAMP NULL,
    end_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_active (is_active),
    INDEX idx_dates (start_date, end_date)
);
```

#### **hero_ab_tests**

```sql
CREATE TABLE hero_ab_tests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    test_id INT NOT NULL,
    variant_key VARCHAR(50) NOT NULL,
    variant_name VARCHAR(100) NOT NULL,
    weight DECIMAL(5,2) DEFAULT 50.00,
    is_active BOOLEAN DEFAULT TRUE,
    hero_content_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY unique_test_variant (test_id, variant_key),
    INDEX idx_test_id (test_id),
    INDEX idx_active (is_active),
    INDEX idx_weight (weight),

    FOREIGN KEY (test_id) REFERENCES ab_test_config(id) ON DELETE CASCADE,
    FOREIGN KEY (hero_content_id) REFERENCES content_hero(id) ON DELETE RESTRICT
);
```

#### **hero_test_stats**

```sql
CREATE TABLE hero_test_stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    test_id INT NOT NULL,
    variant_key VARCHAR(50) NOT NULL,
    device_type ENUM('desktop', 'mobile', 'tablet') NOT NULL,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY unique_test_variant_device_date (test_id, variant_key, device_type, date),
    INDEX idx_test_id (test_id),
    INDEX idx_variant (variant_key),
    INDEX idx_device (device_type),
    INDEX idx_date (date),

    FOREIGN KEY (test_id) REFERENCES ab_test_config(id) ON DELETE CASCADE
);
```

### **4. Audit & Logging**

#### **audit_log**

```sql
CREATE TABLE audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id INT NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_resource (resource_type, resource_id),
    INDEX idx_created (created_at),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

#### **system_logs**

```sql
CREATE TABLE system_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    level ENUM('debug', 'info', 'warn', 'error', 'fatal') NOT NULL,
    message TEXT NOT NULL,
    context JSON NULL,
    source VARCHAR(100),
    user_id INT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_level (level),
    INDEX idx_source (source),
    INDEX idx_user_id (user_id),
    INDEX idx_created (created_at),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

## 🔄 Versionierung von Inhalten

### **Draft/Published Status**

```sql
-- Beispiel für Content-Versionierung
CREATE TABLE content_versions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content_type ENUM('page', 'block', 'hero', 'header') NOT NULL,
    content_id INT NOT NULL,
    version_number INT NOT NULL,
    content_data JSON NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_content_version (content_type, content_id, version_number),
    INDEX idx_content (content_type, content_id),
    INDEX idx_status (status),
    INDEX idx_created_by (created_by),

    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
);
```

### **Soft-Delete Implementierung**

```sql
-- Soft-Delete für alle Content-Tabellen
ALTER TABLE cms_pages ADD COLUMN deleted_at TIMESTAMP NULL;
ALTER TABLE cms_blocks ADD COLUMN deleted_at TIMESTAMP NULL;
ALTER TABLE cms_media ADD COLUMN deleted_at TIMESTAMP NULL;

-- Index für Soft-Delete
CREATE INDEX idx_deleted_at ON cms_pages(deleted_at);
CREATE INDEX idx_deleted_at ON cms_blocks(deleted_at);
CREATE INDEX idx_deleted_at ON cms_media(deleted_at);
```

## 🔍 Indizes und Performance

### **Wichtige Indizes**

```sql
-- Composite Indizes für häufige Abfragen
CREATE INDEX idx_pages_status_language ON cms_pages(status, language);
CREATE INDEX idx_media_type_public ON cms_media(mime_type, is_public);
CREATE INDEX idx_translations_key_lang ON cms_translations(translation_key, language);
CREATE INDEX idx_ab_stats_test_date ON hero_test_stats(test_id, date);

-- Volltext-Indizes für Suche
CREATE FULLTEXT INDEX idx_pages_content ON cms_pages(title, content, meta_description);
CREATE FULLTEXT INDEX idx_media_search ON cms_media(original_filename, alt_text, caption);
```

### **Query-Optimierung**

```sql
-- Beispiel für optimierte Abfragen
EXPLAIN SELECT
    p.id, p.title, p.slug, p.published_at,
    u.first_name, u.last_name
FROM cms_pages p
JOIN users u ON p.created_by = u.id
WHERE p.status = 'published'
    AND p.language = 'de'
    AND p.deleted_at IS NULL
ORDER BY p.published_at DESC
LIMIT 10;
```

## 🔐 Sicherheit und Compliance

### **Datenverschlüsselung**

```sql
-- Sensitive Daten verschlüsseln
CREATE TABLE user_sensitive_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    encrypted_data LONGBLOB NOT NULL,
    encryption_key_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### **DSGVO-Compliance**

```sql
-- Datenlöschung nach DSGVO
CREATE TABLE data_retention_policies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(100) NOT NULL,
    retention_days INT NOT NULL,
    auto_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Beispiel-Policies
INSERT INTO data_retention_policies (table_name, retention_days, auto_delete) VALUES
('audit_log', 2555, TRUE),  -- 7 Jahre
('system_logs', 365, TRUE), -- 1 Jahr
('hero_test_stats', 1095, TRUE); -- 3 Jahre
```

## 📊 Beispiel-SQL Queries

### **Content-Abfragen**

```sql
-- Alle aktiven Seiten einer Sprache
SELECT
    p.id, p.title, p.slug, p.published_at,
    CONCAT(u.first_name, ' ', u.last_name) as author
FROM cms_pages p
JOIN users u ON p.created_by = u.id
WHERE p.status = 'published'
    AND p.language = 'de'
    AND p.deleted_at IS NULL
ORDER BY p.published_at DESC;

-- A/B Test Statistiken
SELECT
    h.variant_key,
    h.variant_name,
    SUM(s.impressions) as total_impressions,
    SUM(s.clicks) as total_clicks,
    ROUND(SUM(s.clicks) / SUM(s.impressions) * 100, 2) as ctr
FROM hero_ab_tests h
JOIN hero_test_stats s ON h.test_id = s.test_id AND h.variant_key = s.variant_key
WHERE h.is_active = TRUE
    AND s.date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY h.variant_key, h.variant_name
ORDER BY ctr DESC;
```

### **Performance-Monitoring**

```sql
-- Langsamste Queries identifizieren
SELECT
    query_time,
    lock_time,
    rows_sent,
    rows_examined,
    sql_text
FROM mysql.slow_log
WHERE start_time >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
ORDER BY query_time DESC
LIMIT 10;
```

## 🚀 Migration und Seeding

### **Prisma Schema**

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id            Int      @id @default(autoincrement())
  email         String   @unique
  passwordHash  String   @map("password_hash")
  firstName     String   @map("first_name")
  lastName      String   @map("last_name")
  roleId        Int      @map("role_id")
  language      String   @default("de")
  timezone      String   @default("Europe/Berlin")
  isActive      Boolean  @default(true) @map("is_active")
  lastLoginAt   DateTime? @map("last_login_at")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  role          Role     @relation(fields: [roleId], references: [id])
  pages         CmsPage[]
  media         CmsMedia[]
  auditLogs     AuditLog[]

  @@map("users")
}
```

### **Seed-Daten**

```typescript
// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Rollen erstellen
  const adminRole = await prisma.role.create({
    data: {
      name: "admin",
      description: "Vollzugriff auf alle Funktionen",
      isSystemRole: true,
    },
  });

  const editorRole = await prisma.role.create({
    data: {
      name: "editor",
      description: "Content Management und Redaktion",
      isSystemRole: true,
    },
  });

  // Admin-User erstellen
  await prisma.user.create({
    data: {
      email: "admin@lopez-it-welt.de",
      passwordHash: "$2b$10$...", // Gehashtes Passwort
      firstName: "Admin",
      lastName: "User",
      roleId: adminRole.id,
    },
  });

  // Basis-Content erstellen
  await prisma.contentHeader.create({
    data: {
      logoText: "Lopez IT Welt",
      logoIcon: "FaRocket",
      navigationItems: JSON.stringify([
        { label: "Startseite", link: "/", active: true },
        { label: "Über uns", link: "/about", active: true },
        { label: "Kontakt", link: "/contact", active: true },
      ]),
      ctaText: "Webshop",
      ctaLink: "/shop",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## 📚 Verwandte Dokumentation

- [Definition of Done](../01-PROJEKT-MANAGEMENT/01-03-definition-of-done.md) - Zentrale DoD-Kriterien
- [Architektur und Module](../02-ARCHITEKTUR/02-02-architektur-und-module.md) - System-Architektur
- [Rechte und Rollen](../04-ENTERPRISE/04-11-rechte-und-rollen.md) - Berechtigungskonzept

---

**Nächste Schritte:**

- [ ] Prisma-Schema finalisieren
- [ ] Migration-Scripts erstellen
- [ ] Seed-Daten definieren
- [ ] Performance-Tests durchführen
- [ ] Backup-Strategie implementieren
