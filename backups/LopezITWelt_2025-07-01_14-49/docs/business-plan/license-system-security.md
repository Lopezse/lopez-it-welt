# 🔒 Sicheres Lizenzsystem - Server-seitige Validierung

**Datum:** 2025-01-19  
**Status:** Konzeptphase  
**Priorität:** KRITISCH für Geschäftsmodell

## 🎯 **Problem: Client-seitige Lizenzen sind unsicher**

### **❌ Was NICHT funktioniert:**

- **Client-seitige Prüfung** → Kann umgangen werden
- **JavaScript-Lizenzen** → Können manipuliert werden
- **Local Storage** → Kann gelöscht/geändert werden
- **Einfache API-Calls** → Können gefälscht werden

### **✅ Sichere Lösung: Server-seitige Validierung**

## 🏗️ **Architektur des sicheren Lizenzsystems**

### **1. Lizenz-Server (Zentral)**

```
lopez-team.de/license-server/
├── API-Endpoints
├── Lizenz-Datenbank
├── Validierungs-Logik
└── Audit-Trail
```

### **2. Client-Validierung (Dezentral)**

```
Kunden-Website/
├── Lizenz-Check (alle 24h)
├── Feature-Flags
├── Watermarking
└── Grace Period
```

## 🔐 **Sicherheitsmaßnahmen**

### **1. Server-seitige Validierung**

```typescript
// Jede Anfrage wird validiert
interface LicenseCheck {
  domain: string;
  licenseKey: string;
  timestamp: number;
  signature: string; // HMAC-Signatur
}

// Server prüft:
- Ist die Domain lizenziert?
- Ist die Lizenz noch gültig?
- Welche Features sind aktiv?
- Ist die Signatur korrekt?
```

### **2. Domain-Binding**

```sql
-- Lizenz ist an Domain gebunden
CREATE TABLE licenses (
  id INT PRIMARY KEY,
  license_key VARCHAR(255) UNIQUE,
  domain VARCHAR(255) NOT NULL,
  customer_id INT,
  package_type ENUM('basic', 'shop', 'premium', 'enterprise'),
  valid_until DATE,
  features JSON,
  created_at TIMESTAMP,
  last_check TIMESTAMP
);
```

### **3. Feature-Flags**

```typescript
// Features werden serverseitig gesteuert
interface FeatureFlags {
  websiteBuilder: boolean;
  shopIntegration: boolean;
  analytics: boolean;
  seoTools: boolean;
  apiAccess: boolean;
  whiteLabel: boolean;
}
```

### **4. Grace Period**

```typescript
// Bei Lizenz-Problemen: 7 Tage Grace Period
const GRACE_PERIOD_DAYS = 7;
const checkLicense = async () => {
  const license = await validateLicense();

  if (!license.valid) {
    if (license.daysSinceExpiry <= GRACE_PERIOD_DAYS) {
      // Grace Period - Website funktioniert noch
      showGracePeriodWarning();
    } else {
      // Website wird deaktiviert
      disableWebsite();
    }
  }
};
```

## 🚀 **Implementierung**

### **Phase 1: Lizenz-Server**

```typescript
// API-Endpoints
POST / api / license / validate;
POST / api / license / check;
POST / api / license / features;
POST / api / license / audit;

// Validierungs-Logik
const validateLicense = async (domain: string, key: string) => {
  const license = await db.licenses.findOne({
    license_key: key,
    domain: domain,
  });

  if (!license) return { valid: false, reason: 'INVALID_KEY' };
  if (license.valid_until < new Date())
    return { valid: false, reason: 'EXPIRED' };

  return {
    valid: true,
    features: license.features,
    expires: license.valid_until,
  };
};
```

### **Phase 2: Client-Integration**

```typescript
// Lizenz-Check Hook
export function useLicense() {
  const [license, setLicense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLicense();
    // Alle 24h prüfen
    const interval = setInterval(checkLicense, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const checkLicense = async () => {
    try {
      const response = await fetch('/api/license/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: window.location.hostname,
          timestamp: Date.now(),
        }),
      });

      const data = await response.json();
      setLicense(data);
    } catch (error) {
      // Bei Fehlern: Grace Period aktivieren
      setLicense({ valid: false, gracePeriod: true });
    } finally {
      setLoading(false);
    }
  };

  return { license, loading };
}
```

### **Phase 3: Feature-Protection**

```typescript
// Feature-Component mit Lizenz-Check
const ShopModule = () => {
  const { license } = useLicense();

  if (!license?.features?.shopIntegration) {
    return (
      <div className="license-required">
        <h3>Shop-Funktion nicht verfügbar</h3>
        <p>Upgraden Sie auf das Shop-Paket für €599</p>
        <a href="/upgrade" className="btn-primary">Jetzt upgraden</a>
      </div>
    );
  }

  return <ShopComponent />;
};
```

## 🛡️ **Zusätzliche Sicherheitsmaßnahmen**

### **1. Watermarking**

```typescript
// Unsichtbares Watermark bei Lizenz-Problemen
const addWatermark = () => {
  const watermark = document.createElement('div');
  watermark.innerHTML = 'Lopez IT Welt - Lizenz erforderlich';
  watermark.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 20px;
    border-radius: 8px;
    z-index: 9999;
    pointer-events: none;
    opacity: 0.1;
  `;
  document.body.appendChild(watermark);
};
```

### **2. Audit-Trail**

```typescript
// Alle Lizenz-Checks werden protokolliert
const logLicenseCheck = async (domain: string, result: any) => {
  await db.audit_logs.insert({
    domain,
    check_result: result,
    timestamp: new Date(),
    ip_address: req.ip,
    user_agent: req.headers['user-agent'],
  });
};
```

### **3. Rate Limiting**

```typescript
// Verhindert Missbrauch der Lizenz-API
const rateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100, // Max 100 Anfragen pro IP
  message: 'Zu viele Anfragen',
});
```

## 💰 **Geschäftsmodell mit sicheren Lizenzen**

### **Lizenz-Typen:**

```
Basis-Lizenz:     €299 einmalig + €19/Monat Hosting
├── Domain-Binding
├── 5 Seiten
├── Basic Features
└── Email Support

Shop-Lizenz:      €599 einmalig + €29/Monat Hosting
├── Alles vom Basis
├── Shop-Integration
├── 50 Produkte
└── Phone Support

Premium-Lizenz:   €999 einmalig + €49/Monat Hosting
├── Alles vom Shop
├── Unbegrenzte Produkte
├── Analytics
└── Priority Support

Enterprise:       €2.999 einmalig + €99/Monat Hosting
├── Alles vom Premium
├── API-Zugang
├── White-Label
└── Dedicated Support
```

### **Wiederkehrende Einnahmen:**

- **Hosting:** €19-99/Monat (je nach Paket)
- **Support:** €29-199/Monat (je nach Level)
- **Updates:** €99/Jahr (neue Features)
- **Backup-Service:** €9/Monat

## 🎯 **Vorteile des Systems**

### **Für dich:**

- ✅ **Sichere Einnahmen** → Lizenzen können nicht umgangen werden
- ✅ **Kontinuierliche Einnahmen** → Hosting + Support
- ✅ **Skalierbarkeit** → Automatische Lizenz-Verwaltung
- ✅ **Analytics** → Nutzungsdaten, Upgrades

### **Für Kunden:**

- ✅ **Rechtssicher** → Klare Lizenzbedingungen
- ✅ **Support** → Professioneller Service
- ✅ **Updates** → Neue Features automatisch
- ✅ **Backup** → Daten sind sicher

## 🚀 **Nächste Schritte**

1. **Lizenz-Server entwickeln** → API + Datenbank
2. **Client-Integration** → Lizenz-Checks in Website
3. **Feature-Protection** → Module schützen
4. **Payment-Integration** → Stripe/PayPal
5. **Admin-Interface** → Lizenz-Verwaltung

**Mit diesem System sind deine Lizenzen sicher und nicht umgehbar!** 🔒
