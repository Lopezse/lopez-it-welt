# 📝 CMS und Inhalte - Lopez IT Welt Enterprise++

## 📋 Content Management Übersicht

**CMS-Typ:** Headless CMS mit Admin-Interface  
**Content-Format:** Markdown + JSON  
**Versionierung:** Draft/Published mit Soft-Delete  
**Mehrsprachigkeit:** DE/EN/ES mit Fallback  
**Letzte Aktualisierung:** 2024-12-19

## 🏗️ System vs. Inhalt Trennung

### **System-Konfiguration (Technisch)**

```typescript
interface SystemConfig {
  // Technische Einstellungen
  database: DatabaseConfig;
  security: SecurityConfig;
  performance: PerformanceConfig;
  monitoring: MonitoringConfig;

  // Admin-spezifisch
  userManagement: UserConfig;
  roles: RoleConfig;
  permissions: PermissionConfig;
}
```

**Verantwortlichkeiten:**

- Datenbank-Schema
- API-Endpoints
- Benutzer-Authentifizierung
- System-Monitoring
- Backup-Konfiguration

### **Content-Management (Redaktionell)**

```typescript
interface ContentManagement {
  // Inhalte
  pages: PageContent;
  blocks: BlockContent;
  media: MediaContent;
  translations: TranslationContent;

  // Workflows
  drafts: DraftContent;
  published: PublishedContent;
  archived: ArchivedContent;
}
```

**Verantwortlichkeiten:**

- Seiten-Inhalte
- Medien-Upload
- Übersetzungen
- Content-Workflows
- SEO-Optimierung

## 📄 Seiten-Management

### **Seiten-Struktur**

```typescript
interface CmsPage {
  id: number;
  slug: string;
  title: string;
  content: string; // Markdown
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  status: "draft" | "published" | "archived";
  language: "de" | "en" | "es";
  parentId: number | null;
  sortOrder: number;
  isHomepage: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  createdBy: number;
}
```

### **Seiten-Erstellung Workflow**

```typescript
// 1. Redakteur erstellt neue Seite
const newPage = await prisma.cmsPage.create({
  data: {
    slug: "about-us",
    title: "Über uns",
    content: "# Über uns\n\nWir sind ein innovatives IT-Unternehmen...",
    metaTitle: "Über uns - Lopez IT Welt",
    metaDescription: "Erfahren Sie mehr über unser Unternehmen...",
    status: "draft",
    language: "de",
    createdBy: userId,
  },
});

// 2. Content-Validierung
const validationResult = await ContentValidator.validatePage(newPage);
if (!validationResult.isValid) {
  throw new Error(`Validation failed: ${validationResult.errors.join(", ")}`);
}

// 3. SEO-Optimierung
const seoScore = await SEOOptimizer.analyzePage(newPage);
if (seoScore.score < 80) {
  await NotificationService.notifyLowSEOScore(newPage.id, seoScore);
}
```

### **Seiten-Bearbeitung**

```typescript
// Content-Editor Interface
interface PageEditor {
  // WYSIWYG-Editor
  editor: WysiwygEditor;

  // Live-Preview
  preview: LivePreview;

  // SEO-Tools
  seoTools: SEOTools;

  // Übersetzungen
  translations: TranslationManager;

  // Medien-Integration
  mediaLibrary: MediaLibrary;
}

// Beispiel: Seite bearbeiten
const editPage = async (pageId: number, updates: Partial<CmsPage>) => {
  // 1. Aktuelle Version als Backup speichern
  await ContentVersioning.createBackup(pageId);

  // 2. Seite aktualisieren
  const updatedPage = await prisma.cmsPage.update({
    where: { id: pageId },
    data: {
      ...updates,
      updatedAt: new Date(),
    },
  });

  // 3. Cache invalidieren
  await CacheManager.invalidatePage(pageId);

  // 4. Audit-Log erstellen
  await AuditLogger.log(userId, "page.updated", "cms_page", pageId, oldValues, updates, request);

  return updatedPage;
};
```

## 🧩 Content-Blöcke

### **Block-Typen**

```typescript
interface ContentBlock {
  id: number;
  name: string;
  type: "text" | "image" | "video" | "gallery" | "form" | "custom";
  content: string;
  settings: BlockSettings;
  isGlobal: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
}

// Block-Settings
interface BlockSettings {
  // Layout
  width: "full" | "half" | "third" | "quarter";
  alignment: "left" | "center" | "right";

  // Styling
  backgroundColor: string;
  textColor: string;
  padding: number;
  margin: number;

  // Responsive
  mobileSettings: MobileSettings;
  tabletSettings: TabletSettings;

  // Animation
  animation: AnimationSettings;
}
```

### **Block-Management**

```typescript
// Block erstellen
const createBlock = async (blockData: CreateBlockData) => {
  const block = await prisma.cmsBlock.create({
    data: {
      name: blockData.name,
      type: blockData.type,
      content: blockData.content,
      settings: JSON.stringify(blockData.settings),
      isGlobal: blockData.isGlobal,
      createdBy: userId,
    },
  });

  // Block-Validierung
  await BlockValidator.validate(block);

  return block;
};

// Block in Seite einbinden
const addBlockToPage = async (pageId: number, blockId: number, position: number) => {
  await prisma.pageBlocks.create({
    data: {
      pageId,
      blockId,
      position,
      createdAt: new Date(),
    },
  });

  // Cache invalidieren
  await CacheManager.invalidatePage(pageId);
};
```

## 🖼️ Medienbibliothek

### **Medien-Verwaltung**

```typescript
interface MediaFile {
  id: number;
  filename: string;
  originalFilename: string;
  filePath: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  width: number | null;
  height: number | null;
  altText: string;
  caption: string;
  folderPath: string;
  isPublic: boolean;
  uploadedBy: number;
  createdAt: Date;
  updatedAt: Date;
}

// Medien-Upload
const uploadMedia = async (file: File, metadata: MediaMetadata) => {
  // 1. Datei-Validierung
  const validation = await MediaValidator.validateFile(file);
  if (!validation.isValid) {
    throw new Error(`Invalid file: ${validation.errors.join(", ")}`);
  }

  // 2. Datei speichern
  const filePath = await FileStorage.save(file, metadata.folderPath);

  // 3. Metadaten extrahieren
  const fileInfo = await MediaProcessor.extractMetadata(file);

  // 4. Datenbank-Eintrag erstellen
  const mediaFile = await prisma.cmsMedia.create({
    data: {
      filename: fileInfo.filename,
      originalFilename: file.originalname,
      filePath: filePath,
      fileUrl: `${process.env.MEDIA_URL}${filePath}`,
      mimeType: file.mimetype,
      fileSize: file.size,
      width: fileInfo.width,
      height: fileInfo.height,
      altText: metadata.altText,
      caption: metadata.caption,
      folderPath: metadata.folderPath,
      uploadedBy: userId,
    },
  });

  // 5. Thumbnails generieren
  await MediaProcessor.generateThumbnails(mediaFile);

  return mediaFile;
};
```

### **Medien-Richtlinien**

```typescript
// Upload-Richtlinien
const mediaGuidelines = {
  // Erlaubte Formate
  allowedFormats: {
    images: ["jpg", "jpeg", "png", "webp", "svg"],
    videos: ["mp4", "webm", "ogg"],
    documents: ["pdf", "doc", "docx", "txt"],
  },

  // Maximale Dateigrößen
  maxFileSizes: {
    images: 5 * 1024 * 1024, // 5MB
    videos: 100 * 1024 * 1024, // 100MB
    documents: 10 * 1024 * 1024, // 10MB
  },

  // Bild-Dimensionen
  imageDimensions: {
    maxWidth: 4000,
    maxHeight: 4000,
    minWidth: 100,
    minHeight: 100,
  },

  // Responsive Images
  responsiveSizes: [320, 640, 768, 1024, 1280, 1920],
};

// Responsive Image Generation
const generateResponsiveImages = async (mediaFile: MediaFile) => {
  const sizes = mediaGuidelines.responsiveSizes;
  const responsiveImages = [];

  for (const size of sizes) {
    const resizedImage = await ImageProcessor.resize(mediaFile, size);
    responsiveImages.push({
      size,
      url: resizedImage.url,
      width: resizedImage.width,
      height: resizedImage.height,
    });
  }

  return responsiveImages;
};
```

## 🌐 Übersetzungen

### **Übersetzungs-System**

```typescript
interface Translation {
  id: number;
  translationKey: string;
  language: "de" | "en" | "es";
  value: string;
  context: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Übersetzungs-Manager
class TranslationManager {
  // Übersetzung laden
  static async getTranslation(key: string, language: string): Promise<string> {
    const translation = await prisma.cmsTranslation.findFirst({
      where: {
        translationKey: key,
        language,
        isActive: true,
      },
    });

    if (translation) {
      return translation.value;
    }

    // Fallback auf Deutsch
    if (language !== "de") {
      return await this.getTranslation(key, "de");
    }

    // Fallback auf Key
    return key;
  }

  // Übersetzungen für Seite laden
  static async getPageTranslations(pageId: number, language: string) {
    const page = await prisma.cmsPage.findUnique({
      where: { id: pageId },
    });

    if (!page) return {};

    // Übersetzungsschlüssel extrahieren
    const keys = this.extractTranslationKeys(page.content);

    // Übersetzungen laden
    const translations = await prisma.cmsTranslation.findMany({
      where: {
        translationKey: { in: keys },
        language,
        isActive: true,
      },
    });

    return translations.reduce(
      (acc, t) => {
        acc[t.translationKey] = t.value;
        return acc;
      },
      {} as Record<string, string>,
    );
  }
}
```

### **Mehrsprachige Inhalte**

```typescript
// Mehrsprachige Seite erstellen
const createMultilingualPage = async (pageData: MultilingualPageData) => {
  const languages = ["de", "en", "es"];
  const createdPages = [];

  for (const lang of languages) {
    const page = await prisma.cmsPage.create({
      data: {
        slug: `${pageData.slug}-${lang}`,
        title: pageData.titles[lang],
        content: pageData.contents[lang],
        metaTitle: pageData.metaTitles[lang],
        metaDescription: pageData.metaDescriptions[lang],
        language: lang,
        status: "draft",
        createdBy: userId,
      },
    });

    createdPages.push(page);
  }

  return createdPages;
};
```

## 🔄 Content-Workflows

### **Draft → Review → Published**

```typescript
// Workflow-States
enum ContentStatus {
  DRAFT = "draft",
  REVIEW = "review",
  APPROVED = "approved",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

// Workflow-Manager
class ContentWorkflow {
  // Status ändern
  static async changeStatus(
    contentId: number,
    newStatus: ContentStatus,
    userId: number,
    comment?: string,
  ) {
    const content = await prisma.cmsPage.findUnique({
      where: { id: contentId },
    });

    if (!content) {
      throw new Error("Content not found");
    }

    // Workflow-Validierung
    const canTransition = await this.validateTransition(content.status, newStatus);
    if (!canTransition) {
      throw new Error(`Invalid transition from ${content.status} to ${newStatus}`);
    }

    // Status aktualisieren
    const updatedContent = await prisma.cmsPage.update({
      where: { id: contentId },
      data: {
        status: newStatus,
        updatedAt: new Date(),
        publishedAt: newStatus === ContentStatus.PUBLISHED ? new Date() : null,
      },
    });

    // Workflow-History erstellen
    await this.createWorkflowHistory(contentId, content.status, newStatus, userId, comment);

    // Benachrichtigungen senden
    await this.sendWorkflowNotifications(updatedContent, newStatus);

    return updatedContent;
  }

  // Workflow-Validierung
  static async validateTransition(from: string, to: string): Promise<boolean> {
    const validTransitions = {
      draft: ["review", "archived"],
      review: ["draft", "approved", "archived"],
      approved: ["published", "draft"],
      published: ["archived"],
      archived: ["draft"],
    };

    return validTransitions[from]?.includes(to) || false;
  }
}
```

### **Content-Review System**

```typescript
// Review-Interface
interface ContentReview {
  id: number;
  contentId: number;
  reviewerId: number;
  status: "pending" | "approved" | "rejected";
  comments: string;
  createdAt: Date;
  updatedAt: Date;
}

// Review-Prozess
const submitForReview = async (contentId: number, userId: number) => {
  // 1. Content-Validierung
  const validation = await ContentValidator.validateForReview(contentId);
  if (!validation.isValid) {
    throw new Error(`Content validation failed: ${validation.errors.join(", ")}`);
  }

  // 2. Review erstellen
  const review = await prisma.contentReview.create({
    data: {
      contentId,
      reviewerId: await this.getAssignedReviewer(contentId),
      status: "pending",
    },
  });

  // 3. Status ändern
  await ContentWorkflow.changeStatus(contentId, ContentStatus.REVIEW, userId);

  // 4. Reviewer benachrichtigen
  await NotificationService.notifyReviewer(review);

  return review;
};
```

## 🎯 SEO-Optimierung

### **SEO-Tools**

```typescript
// SEO-Analyzer
class SEOAnalyzer {
  // SEO-Score berechnen
  static async analyzePage(page: CmsPage): Promise<SEOScore> {
    const checks = [
      this.checkTitleLength(page.metaTitle),
      this.checkDescriptionLength(page.metaDescription),
      this.checkKeywordDensity(page.content),
      this.checkHeadingStructure(page.content),
      this.checkImageAltTexts(page.content),
      this.checkInternalLinks(page.content),
    ];

    const results = await Promise.all(checks);
    const score = results.reduce((sum, check) => sum + check.score, 0) / results.length;

    return {
      score: Math.round(score),
      checks: results,
      recommendations: this.generateRecommendations(results),
    };
  }

  // Meta-Title Länge prüfen
  static checkTitleLength(title: string): SEOCheck {
    const length = title.length;
    const score =
      length >= 30 && length <= 60
        ? 100
        : length < 30
          ? (length / 30) * 100
          : Math.max(0, 100 - (length - 60) * 2);

    return {
      name: "Meta Title Length",
      score,
      status: score >= 80 ? "good" : "warning",
      message: `Title length: ${length} characters (recommended: 30-60)`,
    };
  }
}
```

### **Structured Data**

```typescript
// Structured Data Generator
class StructuredDataGenerator {
  // Organization Schema
  static generateOrganizationSchema(): object {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Lopez IT Welt",
      url: "https://lopez-it-welt.de",
      logo: "https://lopez-it-welt.de/logo.png",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+49-123-456789",
        contactType: "customer service",
        availableLanguage: ["German", "English", "Spanish"],
      },
      sameAs: ["https://www.linkedin.com/company/lopez-it-welt", "https://twitter.com/lopezitwelt"],
    };
  }

  // Breadcrumb Schema
  static generateBreadcrumbSchema(breadcrumbs: Breadcrumb[]): object {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    };
  }
}
```

## 📊 Content-Analytics

### **Content-Performance**

```typescript
// Content-Analytics
interface ContentAnalytics {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  averageTimeOnPage: number;
  conversionRate: number;
  topKeywords: KeywordPerformance[];
  socialShares: SocialShareData;
}

// Analytics-Service
class ContentAnalyticsService {
  // Seiten-Performance laden
  static async getPageAnalytics(pageId: number, dateRange: DateRange) {
    const analytics = await prisma.contentAnalytics.findMany({
      where: {
        pageId,
        date: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
      },
    });

    return this.aggregateAnalytics(analytics);
  }

  // Top-Performing Content
  static async getTopContent(limit: number = 10) {
    return await prisma.cmsPage.findMany({
      where: { status: "published" },
      orderBy: { pageViews: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        pageViews: true,
        publishedAt: true,
      },
    });
  }
}
```

## 📚 Verwandte Dokumentation

- [Definition of Done](../01-PROJEKT-MANAGEMENT/01-03-definition-of-done.md) - Zentrale DoD-Kriterien
- [A/B-Testing und Analytics](../07-QUALITAET-SICHERUNG/07-07-ab-testing-und-analytics.md) - Test-System
- [Admin-UI und Navigation](../06-ADMIN-BEREICH/06-10-admin-ui-und-navigation.md) - Admin-Interface

---

**Nächste Schritte:**

- [ ] WYSIWYG-Editor integrieren
- [ ] Advanced SEO-Tools implementieren
- [ ] Content-Templates erstellen
- [ ] Workflow-Automatisierung
- [ ] Performance-Monitoring
