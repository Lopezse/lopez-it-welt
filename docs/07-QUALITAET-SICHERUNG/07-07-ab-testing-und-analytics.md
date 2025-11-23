# 🧪 A/B Testing und Analytics - Lopez IT Welt Enterprise++

## 📋 A/B Testing Übersicht

**Test-Framework:** Custom A/B Testing Engine  
**Analytics:** Real-time Tracking + Historical Analysis  
**Statistische Signifikanz:** Chi-Quadrat-Test + Bayesian Analysis  
**Auto-Rollout:** Konfigurierbare Winner-Aktivierung  
**Letzte Aktualisierung:** 2024-12-19

## 🎯 A/B Testing Konzepte

### **Test-Typen**

```typescript
interface ABTestType {
  // Hero-Section Tests
  heroSection: {
    variants: HeroVariant[];
    metrics: ["impressions", "clicks", "conversions"];
    duration: number; // Tage
  };

  // Call-to-Action Tests
  ctaTests: {
    variants: CTAVariant[];
    metrics: ["clicks", "conversions"];
    duration: number;
  };

  // Layout-Tests
  layoutTests: {
    variants: LayoutVariant[];
    metrics: ["bounce_rate", "time_on_page", "conversions"];
    duration: number;
  };

  // Content-Tests
  contentTests: {
    variants: ContentVariant[];
    metrics: ["engagement", "conversions"];
    duration: number;
  };
}
```

### **Test-Konfiguration**

```typescript
interface ABTestConfig {
  id: number;
  testName: string;
  description: string;
  isActive: boolean;
  trafficSplit: number; // 0-100%
  autoActivateWinner: boolean;
  minSampleSize: number;
  confidenceLevel: number; // 95%, 99%
  startDate: Date;
  endDate: Date;
  variants: ABTestVariant[];
  metrics: TestMetric[];
  createdAt: Date;
  updatedAt: Date;
}

interface ABTestVariant {
  id: number;
  testId: number;
  variantKey: string; // 'A', 'B', 'C'
  variantName: string;
  weight: number; // Traffic-Anteil
  isActive: boolean;
  content: any; // Variant-spezifischer Content
  createdAt: Date;
}
```

## 🎲 Varianten-Zuweisung

### **Random Assignment**

```typescript
// Zufällige Varianten-Zuweisung
class VariantAssigner {
  // Einfache Random-Zuweisung
  static assignRandom(variants: ABTestVariant[]): string {
    const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
    const random = Math.random() * totalWeight;

    let currentWeight = 0;
    for (const variant of variants) {
      currentWeight += variant.weight;
      if (random <= currentWeight) {
        return variant.variantKey;
      }
    }

    // Fallback auf erste Variante
    return variants[0].variantKey;
  }

  // Device-spezifische Zuweisung
  static assignByDevice(
    variants: ABTestVariant[],
    deviceType: "desktop" | "mobile" | "tablet",
  ): string {
    // Device-spezifische Gewichtung
    const deviceWeights = this.getDeviceWeights(deviceType);
    const weightedVariants = variants.map((v) => ({
      ...v,
      weight: v.weight * deviceWeights[v.variantKey] || v.weight,
    }));

    return this.assignRandom(weightedVariants);
  }

  // User-spezifische Zuweisung (konsistent)
  static assignByUser(variants: ABTestVariant[], userId: string): string {
    // Hash-basierte Zuweisung für Konsistenz
    const hash = this.hashString(userId);
    const normalizedHash = hash / 0xffffffff; // 0-1

    const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
    let currentWeight = 0;

    for (const variant of variants) {
      currentWeight += variant.weight;
      if (normalizedHash <= currentWeight / totalWeight) {
        return variant.variantKey;
      }
    }

    return variants[0].variantKey;
  }

  // Hash-Funktion
  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // 32-bit integer
    }
    return Math.abs(hash);
  }
}
```

### **Traffic-Split Management**

```typescript
// Traffic-Split Konfiguration
interface TrafficSplitConfig {
  testId: number;
  variantKey: string;
  percentage: number; // 0-100
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
}

// Traffic-Split Manager
class TrafficSplitManager {
  // Traffic-Split anwenden
  static async applyTrafficSplit(
    testId: number,
    userId: string,
    deviceType: string,
  ): Promise<string | null> {
    const config = await this.getActiveConfig(testId);
    if (!config) return null;

    // User in Test-Gruppe?
    const userHash = this.hashUser(userId, testId);
    const userPercentage = (userHash % 100) + 1;

    if (userPercentage > config.trafficSplit) {
      return null; // User nicht im Test
    }

    // Variante zuweisen
    const variants = await this.getActiveVariants(testId);
    return VariantAssigner.assignByUser(variants, userId);
  }

  // Traffic-Split dynamisch anpassen
  static async adjustTrafficSplit(testId: number, newSplit: number): Promise<void> {
    await prisma.abTestConfig.update({
      where: { id: testId },
      data: { trafficSplit: newSplit },
    });

    // Cache invalidieren
    await CacheManager.invalidate(`test-config-${testId}`);
  }
}
```

## 📊 Event-Tracking

### **Tracking-Events**

```typescript
// Event-Types
interface TrackingEvent {
  testId: number;
  variantKey: string;
  eventType: "impression" | "click" | "conversion" | "bounce";
  userId?: string;
  sessionId: string;
  deviceType: "desktop" | "mobile" | "tablet";
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Event-Tracker
class EventTracker {
  // Impression tracken
  static async trackImpression(
    testId: number,
    variantKey: string,
    sessionId: string,
    deviceType: string,
    metadata?: any,
  ): Promise<void> {
    await this.trackEvent({
      testId,
      variantKey,
      eventType: "impression",
      sessionId,
      deviceType,
      metadata,
    });
  }

  // Click tracken
  static async trackClick(
    testId: number,
    variantKey: string,
    sessionId: string,
    deviceType: string,
    metadata?: any,
  ): Promise<void> {
    await this.trackEvent({
      testId,
      variantKey,
      eventType: "click",
      sessionId,
      deviceType,
      metadata,
    });
  }

  // Conversion tracken
  static async trackConversion(
    testId: number,
    variantKey: string,
    sessionId: string,
    deviceType: string,
    metadata?: any,
  ): Promise<void> {
    await this.trackEvent({
      testId,
      variantKey,
      eventType: "conversion",
      sessionId,
      deviceType,
      metadata,
    });
  }

  // Event in Datenbank speichern
  private static async trackEvent(event: TrackingEvent): Promise<void> {
    const today = new Date().toISOString().split("T")[0];

    await prisma.heroTestStats.upsert({
      where: {
        unique_test_variant_device_date: {
          testId: event.testId,
          variantKey: event.variantKey,
          deviceType: event.deviceType,
          date: today,
        },
      },
      update: {
        [event.eventType === "impression"
          ? "impressions"
          : event.eventType === "click"
            ? "clicks"
            : "conversions"]: {
          increment: 1,
        },
      },
      create: {
        testId: event.testId,
        variantKey: event.variantKey,
        deviceType: event.deviceType,
        impressions: event.eventType === "impression" ? 1 : 0,
        clicks: event.eventType === "click" ? 1 : 0,
        conversions: event.eventType === "conversion" ? 1 : 0,
        date: today,
      },
    });
  }
}
```

### **Client-side Tracking**

```typescript
// Frontend Event-Tracking
class ClientEventTracker {
  private sessionId: string;
  private deviceType: string;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.deviceType = this.detectDeviceType();
  }

  // Impression tracken
  trackImpression(testId: number, variantKey: string) {
    this.sendEvent({
      testId,
      variantKey,
      eventType: "impression",
      sessionId: this.sessionId,
      deviceType: this.deviceType,
    });
  }

  // Click tracken
  trackClick(testId: number, variantKey: string, elementId?: string) {
    this.sendEvent({
      testId,
      variantKey,
      eventType: "click",
      sessionId: this.sessionId,
      deviceType: this.deviceType,
      metadata: { elementId },
    });
  }

  // Conversion tracken
  trackConversion(testId: number, variantKey: string, conversionValue?: number) {
    this.sendEvent({
      testId,
      variantKey,
      eventType: "conversion",
      sessionId: this.sessionId,
      deviceType: this.deviceType,
      metadata: { conversionValue },
    });
  }

  // Event an Server senden
  private async sendEvent(event: any) {
    try {
      await fetch("/api/ab-test/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error("Failed to track event:", error);
    }
  }

  // Session-ID generieren/abrufen
  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem("ab-test-session-id");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("ab-test-session-id", sessionId);
    }
    return sessionId;
  }

  // Device-Type erkennen
  private detectDeviceType(): "desktop" | "mobile" | "tablet" {
    const width = window.innerWidth;
    if (width < 768) return "mobile";
    if (width < 1024) return "tablet";
    return "desktop";
  }
}
```

## 📈 Analytics & Statistiken

### **KPI-Berechnung**

```typescript
// A/B Test Statistiken
interface ABTestStats {
  testId: number;
  variantKey: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number; // Click-Through-Rate
  conversionRate: number;
  confidence: number; // Statistische Signifikanz
  isWinner: boolean;
  lift: number; // Performance-Lift vs. Kontrolle
}

// Statistiken berechnen
class ABTestAnalytics {
  // Test-Statistiken laden
  static async getTestStats(testId: number): Promise<ABTestStats[]> {
    const stats = await prisma.heroTestStats.findMany({
      where: { testId },
      orderBy: { variantKey: "asc" },
    });

    // Aggregieren
    const aggregated = this.aggregateStats(stats);

    // KPIs berechnen
    return aggregated.map((variant) => ({
      ...variant,
      ctr: this.calculateCTR(variant.clicks, variant.impressions),
      conversionRate: this.calculateConversionRate(variant.conversions, variant.clicks),
      confidence: this.calculateConfidence(variant, aggregated),
      isWinner: this.isWinner(variant, aggregated),
      lift: this.calculateLift(variant, aggregated),
    }));
  }

  // CTR berechnen
  private static calculateCTR(clicks: number, impressions: number): number {
    if (impressions === 0) return 0;
    return (clicks / impressions) * 100;
  }

  // Conversion-Rate berechnen
  private static calculateConversionRate(conversions: number, clicks: number): number {
    if (clicks === 0) return 0;
    return (conversions / clicks) * 100;
  }

  // Statistische Signifikanz (Chi-Quadrat-Test)
  private static calculateConfidence(variant: any, allVariants: any[]): number {
    const controlVariant = allVariants.find((v) => v.variantKey === "A");
    if (!controlVariant) return 0;

    // Chi-Quadrat-Test
    const chiSquare = this.chiSquareTest(variant, controlVariant);

    // p-Wert berechnen (vereinfacht)
    const pValue = this.calculatePValue(chiSquare);

    // Konfidenz-Level (1 - p-Wert)
    return (1 - pValue) * 100;
  }

  // Chi-Quadrat-Test
  private static chiSquareTest(variant: any, control: any): number {
    const observed = [variant.conversions, variant.clicks - variant.conversions];
    const expected = [
      control.conversions * (variant.clicks / control.clicks),
      (control.clicks - control.conversions) * (variant.clicks / control.clicks),
    ];

    let chiSquare = 0;
    for (let i = 0; i < observed.length; i++) {
      if (expected[i] > 0) {
        chiSquare += Math.pow(observed[i] - expected[i], 2) / expected[i];
      }
    }

    return chiSquare;
  }

  // p-Wert berechnen (vereinfacht)
  private static calculatePValue(chiSquare: number): number {
    // Vereinfachte p-Wert-Berechnung
    // In der Praxis würde man eine Chi-Quadrat-Verteilungstabelle verwenden
    if (chiSquare > 6.63) return 0.01; // 99% Konfidenz
    if (chiSquare > 3.84) return 0.05; // 95% Konfidenz
    if (chiSquare > 2.71) return 0.1; // 90% Konfidenz
    return 0.2; // 80% Konfidenz
  }
}
```

### **Real-time Dashboard**

```typescript
// Real-time Analytics Dashboard
class RealTimeAnalytics {
  // Live-Statistiken
  static async getLiveStats(testId: number): Promise<LiveStats> {
    const stats = await prisma.heroTestStats.findMany({
      where: {
        testId,
        date: new Date().toISOString().split("T")[0],
      },
    });

    const totalImpressions = stats.reduce((sum, s) => sum + s.impressions, 0);
    const totalClicks = stats.reduce((sum, s) => sum + s.clicks, 0);
    const totalConversions = stats.reduce((sum, s) => sum + s.conversions, 0);

    return {
      testId,
      totalImpressions,
      totalClicks,
      totalConversions,
      overallCTR: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
      overallConversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
      variants: stats.map((s) => ({
        variantKey: s.variantKey,
        impressions: s.impressions,
        clicks: s.clicks,
        conversions: s.conversions,
        ctr: s.impressions > 0 ? (s.clicks / s.impressions) * 100 : 0,
        conversionRate: s.clicks > 0 ? (s.conversions / s.clicks) * 100 : 0,
      })),
    };
  }

  // Trend-Analyse
  static async getTrendData(testId: number, days: number = 7): Promise<TrendData[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await prisma.heroTestStats.findMany({
      where: {
        testId,
        date: {
          gte: startDate.toISOString().split("T")[0],
        },
      },
      orderBy: { date: "asc" },
    });

    // Nach Datum gruppieren
    const grouped = stats.reduce(
      (acc, stat) => {
        const date = stat.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(stat);
        return acc;
      },
      {} as Record<string, any[]>,
    );

    // Trend-Daten erstellen
    return Object.entries(grouped).map(([date, dayStats]) => ({
      date,
      totalImpressions: dayStats.reduce((sum, s) => sum + s.impressions, 0),
      totalClicks: dayStats.reduce((sum, s) => sum + s.clicks, 0),
      totalConversions: dayStats.reduce((sum, s) => sum + s.conversions, 0),
      variants: dayStats.map((s) => ({
        variantKey: s.variantKey,
        impressions: s.impressions,
        clicks: s.clicks,
        conversions: s.conversions,
      })),
    }));
  }
}
```

## 🏆 Winner-Detection & Auto-Rollout

### **Winner-Detection Algorithmus**

```typescript
// Winner-Detection
class WinnerDetector {
  // Winner ermitteln
  static async detectWinner(testId: number): Promise<WinnerResult | null> {
    const stats = await ABTestAnalytics.getTestStats(testId);
    const controlVariant = stats.find((s) => s.variantKey === "A");

    if (!controlVariant) return null;

    const testVariants = stats.filter((s) => s.variantKey !== "A");
    const winners = testVariants.filter((variant) =>
      this.isSignificantWinner(variant, controlVariant),
    );

    if (winners.length === 0) return null;

    // Besten Winner auswählen
    const bestWinner = winners.reduce((best, current) =>
      current.lift > best.lift ? current : best,
    );

    return {
      testId,
      winner: bestWinner,
      confidence: bestWinner.confidence,
      lift: bestWinner.lift,
      isSignificant: bestWinner.confidence >= 95,
    };
  }

  // Signifikanter Winner?
  private static isSignificantWinner(variant: ABTestStats, control: ABTestStats): boolean {
    return (
      variant.confidence >= 95 && // 95% Konfidenz
      variant.lift > 5 && // Mindestens 5% Lift
      variant.impressions >= 1000 // Mindestens 1000 Impressions
    );
  }

  // Auto-Rollout durchführen
  static async performAutoRollout(testId: number): Promise<boolean> {
    const config = await prisma.abTestConfig.findUnique({
      where: { id: testId },
    });

    if (!config?.autoActivateWinner) return false;

    const winner = await this.detectWinner(testId);
    if (!winner?.isSignificant) return false;

    // Winner als Standard setzen
    await this.activateWinner(testId, winner.winner.variantKey);

    // Test beenden
    await prisma.abTestConfig.update({
      where: { id: testId },
      data: {
        isActive: false,
        endDate: new Date(),
      },
    });

    // Notification senden
    await NotificationService.sendWinnerNotification(testId, winner);

    return true;
  }

  // Winner aktivieren
  private static async activateWinner(testId: number, winnerKey: string): Promise<void> {
    // Winner-Content als Standard setzen
    const winnerVariant = await prisma.heroAbTest.findFirst({
      where: { testId, variantKey: winnerKey },
    });

    if (winnerVariant) {
      await prisma.contentHero.update({
        where: { id: winnerVariant.heroContentId },
        data: { isActive: true },
      });
    }
  }
}
```

## 📊 Advanced Analytics

### **Cohort-Analyse**

```typescript
// Cohort-Analyse für A/B Tests
class CohortAnalysis {
  // User-Cohorts basierend auf Test-Zeitpunkt
  static async analyzeCohorts(testId: number): Promise<CohortData[]> {
    const test = await prisma.abTestConfig.findUnique({
      where: { id: testId },
      include: { variants: true },
    });

    if (!test) return [];

    // User-Cohorts erstellen
    const cohorts = await this.createCohorts(testId, test.startDate);

    // Retention-Raten berechnen
    return cohorts.map((cohort) => ({
      cohortDate: cohort.date,
      cohortSize: cohort.size,
      retentionRates: this.calculateRetentionRates(cohort),
      conversionRates: this.calculateConversionRates(cohort),
    }));
  }

  // Funnel-Analyse
  static async analyzeFunnel(testId: number): Promise<FunnelData> {
    const stats = await prisma.heroTestStats.findMany({
      where: { testId },
    });

    const aggregated = this.aggregateStats(stats);

    return {
      testId,
      steps: [
        {
          name: "Impressions",
          count: aggregated.reduce((sum, v) => sum + v.impressions, 0),
        },
        {
          name: "Clicks",
          count: aggregated.reduce((sum, v) => sum + v.clicks, 0),
        },
        {
          name: "Conversions",
          count: aggregated.reduce((sum, v) => sum + v.conversions, 0),
        },
      ],
      conversionRates: this.calculateStepConversionRates(aggregated),
    };
  }
}
```

### **Predictive Analytics**

```typescript
// Vorhersage-Modelle für A/B Tests
class PredictiveAnalytics {
  // Test-Erfolg vorhersagen
  static async predictTestSuccess(testId: number): Promise<PredictionResult> {
    const currentStats = await ABTestAnalytics.getTestStats(testId);
    const historicalData = await this.getHistoricalTestData();

    // Machine Learning Model (vereinfacht)
    const prediction = this.mlPredict(currentStats, historicalData);

    return {
      testId,
      predictedWinner: prediction.winner,
      confidence: prediction.confidence,
      estimatedDuration: prediction.estimatedDuration,
      recommendedAction: prediction.recommendedAction,
    };
  }

  // Optimale Test-Dauer berechnen
  static calculateOptimalDuration(
    currentStats: ABTestStats[],
    targetConfidence: number = 95,
  ): number {
    const controlVariant = currentStats.find((s) => s.variantKey === "A");
    if (!controlVariant) return 0;

    // Power-Analyse (vereinfacht)
    const effectSize = this.calculateEffectSize(currentStats);
    const power = this.calculatePower(effectSize, controlVariant.impressions);

    if (power >= targetConfidence / 100) {
      return 0; // Test bereits ausreichend
    }

    // Zusätzliche Tage berechnen
    const additionalDays = Math.ceil(
      (targetConfidence / 100 - power) * 30, // Vereinfachte Formel
    );

    return additionalDays;
  }
}
```

## 📚 Verwandte Dokumentation

- [Definition of Done](../01-PROJEKT-MANAGEMENT/01-03-definition-of-done.md) - Zentrale DoD-Kriterien
- [CMS und Inhalte](../05-QUALITAET/05-04-cms-und-inhalte.md) - Content Management
- [Admin-UI und Navigation](../06-ADMIN-BEREICH/06-10-admin-ui-und-navigation.md) - Admin-Interface

---

**Nächste Schritte:**

- [ ] Machine Learning Integration
- [ ] Advanced Statistical Tests
- [ ] Multi-Armed Bandit Algorithmen
- [ ] Personalization Engine
- [ ] Cross-Device Tracking
