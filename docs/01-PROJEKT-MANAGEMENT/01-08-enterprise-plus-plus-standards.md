# 🏢 ENTERPRISE++ STANDARDS - Lopez IT Welt

**Datum:** 2025-09-13  
**Version:** 1.0  
**Status:** ✅ AKTIV

---

## 📋 **ÜBERSICHT**

Dieses Dokument definiert die einheitlichen Marken- und SEO-Standards für das Lopez IT Welt Projekt. Alle Inhalte, Metadaten und Dokumentationen müssen diese Standards einhalten.

---

## 🎯 **KERN-REGELN**

### **1. SEITEN-TITEL (HTML <title>)**

```
Lopez IT Welt | Digitale Enterprise++ IT-Lösungen
```

**Regeln:**

- ✅ Immer mit "Enterprise++" (mit den beiden ++)
- ✅ Pipe-Symbol "|" als Trenner
- ✅ Keine Tippfehler oder Abweichungen
- ✅ Einheitlich für alle Seiten

### **2. META-DESCRIPTION (SEO)**

```
Lopez IT Welt bietet moderne, barrierefreie und mehrsprachige IT-Lösungen auf Enterprise++-Niveau – zuverlässig, sicher und zukunftsorientiert.
```

**Regeln:**

- ✅ Einheitlich für Startseite
- ✅ Sprache: Deutsch
- ✅ Enthält "Enterprise++"
- ✅ Enthält "Lopez IT Welt"
- ✅ Beschreibt Kernkompetenzen

### **3. MARKEN-IDENTITÄT**

#### **Firmenname:**

- ✅ **"Lopez IT Welt"** (immer genau so)
- ❌ NICHT: "Lopez IT", "Lopez-IT-Welt", "LopezITWelt"

#### **Markenbestandteil:**

- ✅ **"Enterprise++"** (immer mit beiden ++)
- ❌ NICHT: "Enterprise+", "Enterprise Plus", "Enterprise Plus Plus"

---

## 📝 **ANWENDUNGSBEREICHE**

### **1. HTML-METADATEN**

- `<title>` Tags
- `<meta name="description">`
- OpenGraph-Tags
- Twitter-Cards

### **2. DOKUMENTATION (.md-Dateien)**

- Alle README-Dateien
- Projekt-Dokumentation
- Status-Updates
- Task-Listen

### **3. SEO-INHALTE**

- Seitenbeschreibungen
- Alt-Texte für Bilder
- Navigationstexte
- Call-to-Action-Texte

### **4. TECHNISCHE DOKUMENTATION**

- Code-Kommentare
- API-Dokumentation
- Konfigurationsdateien
- Deployment-Skripte

---

## 🔧 **IMPLEMENTIERUNG**

### **1. LAYOUT.TSX (Next.js)**

```typescript
export const metadata: Metadata = {
  title: "Lopez IT Welt | Digitale Enterprise++ IT-Lösungen",
  description:
    "Lopez IT Welt bietet moderne, barrierefreie und mehrsprachige IT-Lösungen auf Enterprise++-Niveau – zuverlässig, sicher und zukunftsorientiert.",
  keywords:
    "Lopez IT Welt, Enterprise++, IT-Lösungen, barrierefreie Webentwicklung, mehrsprachige Websites, DSGVO-Compliance, React, Next.js, TypeScript, digitale Transformation",
  // ...
};
```

### **2. SEITENSPEZIFISCHE METADATEN**

```typescript
// Beispiel für Unterseiten
export const metadata: Metadata = {
  title: "Leistungen | Lopez IT Welt | Digitale Enterprise++ IT-Lösungen",
  description:
    "Unsere Enterprise++ IT-Leistungen: Webentwicklung, App-Entwicklung, digitale Transformation und mehr.",
  // ...
};
```

### **3. .MD-DOKUMENTATION**

```markdown
# 📋 TASKLIST.md – Lopez IT Welt

**Datum:** 2025-09-13  
**Projekt:** Lopez IT Welt  
**Status:** AKTIV

## 🎯 **KONTEXT (Projekt, Tagesziel)**

- **Projekt:** Lopez IT Welt – Enterprise++ Compliance & Workflow-Absicherung
```

---

## ✅ **VALIDIERUNG**

### **1. AUTOMATISCHE PRÜFUNG**

- Linter-Regeln für Metadaten
- CI/CD-Validierung
- SEO-Tools-Integration

### **2. MANUELLE PRÜFUNG**

- Regelmäßige Reviews
- Cross-Browser-Tests
- SEO-Audits

### **3. QUALITÄTSSICHERUNG**

- Einheitlichkeit in allen Bereichen
- Markenkonformität
- Suchmaschinenoptimierung

---

## 📊 **STATUS**

| Bereich           | Status           | Letzte Prüfung | Nächste Prüfung |
| ----------------- | ---------------- | -------------- | --------------- |
| HTML-Metadaten    | ✅ Implementiert | 2025-09-13     | 2025-09-20      |
| .md-Dokumentation | ✅ Implementiert | 2025-09-13     | 2025-09-20      |
| SEO-Inhalte       | ✅ Implementiert | 2025-09-13     | 2025-09-20      |
| Technische Docs   | ✅ Implementiert | 2025-09-13     | 2025-09-20      |

---

## 🚀 **NÄCHSTE SCHRITTE**

1. ✅ **Layout.tsx aktualisiert** - Metadaten angepasst
2. ✅ **Standards dokumentiert** - Diese Datei erstellt
3. 🔄 **Unterseiten prüfen** - Alle Seiten auf Konformität prüfen
4. 🔄 **SEO-Tools testen** - Metadaten in Suchmaschinen testen
5. 🔄 **Team informieren** - Alle Entwickler über Standards informieren

---

## 📞 **KONTAKT**

**Verantwortlich:** Ramiro Lopez Rodriguez  
**E-Mail:** [E-Mail-Adresse]  
**Datum der Erstellung:** 2025-09-13  
**Letzte Aktualisierung:** 2025-09-13

---

_Dieses Dokument ist Teil des Lopez IT Welt Enterprise++ Standards und muss bei allen Änderungen aktualisiert werden._
