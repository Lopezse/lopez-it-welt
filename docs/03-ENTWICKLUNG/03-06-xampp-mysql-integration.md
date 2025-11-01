# XAMPP MySQL Integration
## Content-Management-System mit XAMPP MySQL

### 🎯 **ÜBERSICHT**
Das Content-Management-System nutzt XAMPP MySQL als Datenbank-Technologie für die Speicherung und Verwaltung aller Webseiten-Texte.

### 🗄️ **DATENBANK-KONFIGURATION**

#### **XAMPP MySQL Einstellungen:**
- **MySQL-Pfad:** C:\xampp\mysql
- **XAMPP-Installation:** C:\xampp\
- **Host:** localhost
- **Port:** 3306
- **Benutzer:** root
- **Passwort:** (leer - Standard XAMPP)
- **Datenbank:** lopez_it_welt

#### **Verbindungsdaten:**
```javascript
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'lopez_it_welt'
};
```

#### **XAMPP MySQL-Pfad:**
```bash
# MySQL-Binärdateien
C:\xampp\mysql\bin\mysql.exe

# MySQL-Datenverzeichnis
C:\xampp\mysql\data\

# MySQL-Konfiguration
C:\xampp\mysql\bin\my.ini
```

### 📊 **DATENBANK-SCHEMA**

#### **Tabelle: site_texts**
```sql
CREATE TABLE site_texts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    `key` VARCHAR(100) NOT NULL,
    value TEXT NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'de',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_text (`key`, language)
);
```

#### **Beispieldaten:**
```sql
INSERT INTO site_texts (`key`, value, language) VALUES
('hero_title', 'Professionelle IT-Dienstleistungen', 'de'),
('hero_title', 'Professional IT Services', 'en'),
('hero_title', 'Servicios IT Profesionales', 'es'),
('hero_subtitle', 'Ihre IT-Partner für moderne Lösungen', 'de'),
('hero_subtitle', 'Your IT partner for modern solutions', 'en'),
('hero_subtitle', 'Su socio IT para soluciones modernas', 'es');
```

### 🔌 **API-INTEGRATION**

#### **MySQL-Verbindung in Next.js:**
```typescript
// src/lib/database.ts
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'lopez_it_welt'
};

export async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

export async function query(sql: string, params?: any[]) {
  const connection = await getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    await connection.end();
  }
}
```

#### **Aktualisierte API-Route:**
```typescript
// src/app/api/texts/route.ts
import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const language = searchParams.get('lang') || 'de';

    let sql = 'SELECT * FROM site_texts';
    let params: any[] = [];

    if (key) {
      sql += ' WHERE `key` = ? AND language = ?';
      params = [key, language];
    } else {
      sql += ' WHERE language = ?';
      params = [language];
    }

    const results = await query(sql, params);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Datenbankfehler:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Texte' },
      { status: 500 }
    );
  }
}
```

### 🛠️ **SETUP-ANLEITUNG**

#### **1. XAMPP installieren und starten:**
```bash
# XAMPP herunterladen und installieren
# Apache und MySQL starten
```

#### **2. Datenbank erstellen:**
```sql
CREATE DATABASE lopez_it_welt;
USE lopez_it_welt;
```

#### **3. Tabelle erstellen:**
```sql
CREATE TABLE site_texts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    `key` VARCHAR(100) NOT NULL,
    value TEXT NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'de',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_text (`key`, language)
);
```

#### **4. Testdaten einfügen:**
```sql
INSERT INTO site_texts (`key`, value, language) VALUES
('hero_title', 'Professionelle IT-Dienstleistungen', 'de'),
('hero_title', 'Professional IT Services', 'en'),
('hero_title', 'Servicios IT Profesionales', 'es'),
('hero_subtitle', 'Ihre IT-Partner für moderne Lösungen', 'de'),
('hero_subtitle', 'Your IT partner for modern solutions', 'en'),
('hero_subtitle', 'Su socio IT para soluciones modernas', 'es');
```

### 📦 **NPM-PAKETE**

#### **Benötigte Pakete:**
```bash
npm install mysql2
```

#### **package.json Ergänzung:**
```json
{
  "dependencies": {
    "mysql2": "^3.0.0"
  }
}
```

### 🔧 **KONFIGURATION**

#### **Environment Variables (.env.local):**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=lopez_it_welt
```

#### **Datenbank-Konfiguration:**
```typescript
// src/lib/database.ts
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lopez_it_welt'
};
```

### 🧪 **TESTING**

#### **Verbindung testen:**
```typescript
// src/scripts/test-database.ts
import { query } from '@/lib/database';

async function testConnection() {
  try {
    const results = await query('SELECT 1 as test');
    console.log('✅ Datenbank-Verbindung erfolgreich:', results);
  } catch (error) {
    console.error('❌ Datenbank-Verbindung fehlgeschlagen:', error);
  }
}

testConnection();
```

### 🚀 **NÄCHSTE SCHRITTE**

1. **XAMPP MySQL starten**
2. **Datenbank und Tabelle erstellen**
3. **Testdaten einfügen**
4. **API-Integration implementieren**
5. **Frontend-Integration testen**

### 📝 **STATUS**
- **Priorität:** HOCH
- **Status:** IN ENTWICKLUNG
- **Kategorie:** Datenbank-Integration
- **Technologie:** XAMPP MySQL

---

*Erstellt: 2025-07-06*  
*Aktualisiert: 2025-07-06*  
*Version: 1.0* 