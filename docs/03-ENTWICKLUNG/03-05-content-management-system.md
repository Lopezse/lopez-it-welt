# Content-Management-System (CMS)
## Dynamische Webseiten-Texte aus der Datenbank

### 🎯 **ÜBERSICHT**
Das Content-Management-System ermöglicht es, alle Texte der Webseite dynamisch aus der Datenbank zu laden und über ein Admin-Interface zu bearbeiten.

### 📋 **ANFORDERUNGEN**

#### **Kern-Funktionalitäten:**
- ✅ Alle Webseiten-Texte aus Datenbank laden
- ✅ Admin-Interface für Text-Bearbeitung
- ✅ Mehrsprachigkeit (DE/EN/ES)
- ✅ Versionierung von Content
- ✅ Live-Preview der Änderungen
- ✅ Backup und Wiederherstellung von Content

#### **Technische Anforderungen:**
- ✅ API-Endpunkte für Content-CRUD
- ✅ Datenbank-Schema für Texte und Übersetzungen
- ✅ Frontend-Integration mit React
- ✅ Caching für Performance
- ✅ SEO-optimierte URLs

### 🗄️ **DATENBANK-SCHEMA**

```sql
-- Content-Management Tabellen
CREATE TABLE content_pages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    page_key VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE content_texts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    page_id INT NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'de',
    section_key VARCHAR(100) NOT NULL,
    content_text LONGTEXT,
    content_html LONGTEXT,
    is_active BOOLEAN DEFAULT TRUE,
    version INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (page_id) REFERENCES content_pages(id),
    UNIQUE KEY unique_content (page_id, language, section_key, version)
);

CREATE TABLE content_versions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    text_id INT NOT NULL,
    version INT NOT NULL,
    content_text LONGTEXT,
    content_html LONGTEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (text_id) REFERENCES content_texts(id)
);
```

### 🔌 **API-ENDPUNKTE**

#### **Content laden:**
```javascript
// GET /api/content/{page_key}/{language}
GET /api/content/homepage/de
GET /api/content/about/en
GET /api/content/services/es

// Response:
{
  "page": {
    "key": "homepage",
    "title": "Lopez IT Welt",
    "sections": {
      "hero_title": "Willkommen bei Lopez IT Welt",
      "hero_subtitle": "Ihre Experten für IT-Lösungen",
      "services_intro": "Unsere Dienstleistungen...",
      "contact_info": "Kontaktieren Sie uns..."
    }
  }
}
```

#### **Content bearbeiten:**
```javascript
// PUT /api/content/{page_key}/{language}
PUT /api/content/homepage/de
{
  "sections": {
    "hero_title": "Neuer Titel",
    "hero_subtitle": "Neuer Untertitel"
  }
}
```

### 🎛️ **ADMIN-INTERFACE**

#### **Content-Editor Komponente:**
```typescript
// src/components/admin/ContentEditor.tsx
interface ContentEditorProps {
  pageKey: string;
  language: string;
  onSave: (content: ContentData) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  pageKey,
  language,
  onSave
}) => {
  const [content, setContent] = useState<ContentData>({});
  const [isLoading, setIsLoading] = useState(false);

  // Content laden
  useEffect(() => {
    loadContent(pageKey, language);
  }, [pageKey, language]);

  // Content speichern
  const handleSave = async () => {
    setIsLoading(true);
    try {
      await saveContent(pageKey, language, content);
      onSave(content);
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="content-editor">
      <h2>Content Editor: {pageKey} ({language})</h2>
      
      {Object.entries(content).map(([key, value]) => (
        <div key={key} className="content-section">
          <label>{key}:</label>
          <textarea
            value={value}
            onChange={(e) => setContent({
              ...content,
              [key]: e.target.value
            })}
            rows={4}
          />
        </div>
      ))}
      
      <button onClick={handleSave} disabled={isLoading}>
        {isLoading ? 'Speichere...' : 'Speichern'}
      </button>
    </div>
  );
};
```

### 🔄 **FRONTEND-INTEGRATION**

#### **Content-Loader Hook:**
```typescript
// src/hooks/useContent.ts
export const useContent = (pageKey: string, language: string = 'de') => {
  const [content, setContent] = useState<ContentData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/content/${pageKey}/${language}`);
        const data = await response.json();
        setContent(data.page.sections);
      } catch (err) {
        setError('Fehler beim Laden des Contents');
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [pageKey, language]);

  return { content, isLoading, error };
};
```

#### **Verwendung in Komponenten:**
```typescript
// src/components/Core/HeroSection.tsx
import { useContent } from '@/hooks/useContent';

const HeroSection: React.FC = () => {
  const { content, isLoading, error } = useContent('homepage');

  if (isLoading) return <div>Lade Content...</div>;
  if (error) return <div>Fehler: {error}</div>;

  return (
    <section className="hero">
      <h1>{content.hero_title}</h1>
      <p>{content.hero_subtitle}</p>
      <button>{content.cta_button}</button>
    </section>
  );
};
```

### 📊 **IMPLEMENTIERUNGS-PLAN**

#### **Phase 1: Grundlagen (HOCH-PRIORITÄT)**
- [ ] Datenbank-Schema erstellen
- [ ] API-Endpunkte implementieren
- [ ] Content-Loader Hook entwickeln
- [ ] Basis-Admin-Interface

#### **Phase 2: Erweiterungen**
- [ ] Mehrsprachigkeit
- [ ] Versionierung
- [ ] Live-Preview
- [ ] Caching-System

#### **Phase 3: Optimierung**
- [ ] Performance-Optimierung
- [ ] SEO-Integration
- [ ] Backup-System
- [ ] Analytics

### 🚀 **NÄCHSTE SCHRITTE**

1. **Datenbank-Schema implementieren**
2. **API-Endpunkte erstellen**
3. **Frontend-Integration entwickeln**
4. **Admin-Interface aufbauen**

### 📝 **STATUS**
- **Priorität:** HOCH
- **Status:** FEHLER (nicht implementiert)
- **Kategorie:** Content-Management
- **Abhängigkeiten:** Datenbank, API, Frontend

---

*Erstellt: 2025-07-06*  
*Aktualisiert: 2025-07-06*  
*Version: 1.0* 