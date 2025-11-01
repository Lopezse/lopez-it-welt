# Adminbereich – MySQL Datenbankstruktur (Enterprise++ konform)

**Stand:** 25.06.2025
**Pflicht: Jede Änderung an der DB-Struktur wird hier dokumentiert und vor Migration freigegeben.**

---

## 1. Zeiterfassung (Time Tracking)

```sql
CREATE TABLE time_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    module VARCHAR(50) NOT NULL, -- z.B. 'Monitoring', 'Kunden', 'Shop', ...
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    duration_minutes INT,
    description TEXT,
    status ENUM('active', 'completed', 'paused') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE time_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    duration_minutes INT,
    status ENUM('in-progress', 'completed', 'paused') DEFAULT 'in-progress',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES time_sessions(id)
);
```

---

## 2. Benutzer, Rollen & Rechte

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    twofa_secret VARCHAR(255), -- für Aegis/Google Authenticator
    role_id INT NOT NULL,
    status ENUM('active', 'inactive', 'locked') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- z.B. 'Superadmin', 'Admin', 'Techniker', ...
    description TEXT
);

CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    module VARCHAR(50) NOT NULL, -- z.B. 'Monitoring', 'Kunden', ...
    can_read BOOLEAN DEFAULT FALSE,
    can_write BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    can_admin BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
```

---

## 3. Audit-Log & Aktivitäten

```sql
CREATE TABLE audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    module VARCHAR(50),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 4. Kunden, Projekte, Shop, Support (Beispiel)

```sql
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('firma', 'privat') NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('active', 'completed', 'archived') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE shop_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE support_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('open', 'in_progress', 'closed') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

---

## 5. Änderungsverlauf

- **2025-06-25:** Initiale Struktur nach .md, Pflichtenheft und DSGVO angelegt (Cursor KI)
- **Jede weitere Änderung wird hier mit Zeitstempel und Begründung dokumentiert!**

---

**Hinweis:**

- Jede Migration wird erst nach .md-Freigabe ausgeführt.
- Änderungen an der DB ohne .md-Doku sind verboten (Enterprise++ Regel).
- DSGVO, IT-Sicherheit und Nachvollziehbarkeit werden strikt eingehalten.
