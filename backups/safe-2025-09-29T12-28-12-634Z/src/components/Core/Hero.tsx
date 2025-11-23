"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "../Features/I18nProvider";

// Types für Hero-Daten
interface HeroData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  button_text: string;
  button_link: string;
  background_style: string;
  background_value: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Types für A/B-Testing
interface ABTestConfig {
  id: number;
  test_name: string;
  is_active: boolean;
  variant_a_id: number;
  variant_b_id: number;
  traffic_split: number;
  auto_activate_winner: boolean;
  auto_activate_threshold: number;
  auto_activate_days: number;
}

interface HeroVariant {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  button_text: string;
  button_link: string;
  background_style: string;
  background_value: string;
}

export function Hero() {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [abTestConfig, setAbTestConfig] = useState<ABTestConfig | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<HeroVariant | null>(null);
  const [deviceType, setDeviceType] = useState<"desktop" | "mobile" | "tablet">("desktop");

  // Device Type Detection
  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType("mobile");
      } else if (width < 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    detectDevice();
    window.addEventListener("resize", detectDevice);
    return () => window.removeEventListener("resize", detectDevice);
  }, []);

  // A/B-Test Konfiguration laden
  useEffect(() => {
    const loadABTestConfig = async () => {
      try {
        const response = await fetch("/api/ab-test/config");
        if (response.ok) {
          const config = await response.json();
          setAbTestConfig(config);
          console.log("A/B-Test Konfiguration geladen:", config);
        } else {
          // A/B-Test API nicht verfügbar - deaktiviere A/B-Test
          console.warn("A/B-Test API nicht verfügbar - deaktiviere A/B-Test");
          setAbTestConfig({ is_active: false } as ABTestConfig);
        }
      } catch (error) {
        console.error("Fehler beim Laden der A/B-Test Konfiguration:", error);
        // A/B-Test API Fehler - deaktiviere A/B-Test
        setAbTestConfig({ is_active: false } as ABTestConfig);
      }
    };

    loadABTestConfig();
  }, []);

  // Hero-Daten mit A/B-Testing laden
  useEffect(() => {
    const loadHeroData = async () => {
      try {
        setError(null);

        // A/B-Test aktiv? Dann Variante auswählen
        if (abTestConfig?.is_active) {
          const variants = await loadHeroVariants(
            abTestConfig.variant_a_id,
            abTestConfig.variant_b_id,
          );
          const selectedVariant = selectVariant(variants, abTestConfig.traffic_split);
          setSelectedVariant(selectedVariant);
          setHeroData(selectedVariant as HeroData);

          // Impression tracken
          trackImpression(selectedVariant.id, selectedVariant.title, deviceType);
        } else {
          // Normale Hero-Daten laden
          const response = await fetch("/api/content/hero");
          if (response.ok) {
            const data = await response.json();
            console.log("Hero-Daten geladen:", data);
            setHeroData(data);
          } else {
            const errorMsg = `API-Fehler: ${response.status} ${response.statusText}`;
            console.error(errorMsg);
            setError(errorMsg);
          }
        }
      } catch (error) {
        const errorMsg = `Fehler beim Laden der Hero-Daten: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`;
        console.error(errorMsg);
        setError(errorMsg);
        setHeroData(null);
      } finally {
        setLoading(false);
      }
    };

    // Hero-Daten immer laden (auch wenn A/B-Test nicht verfügbar)
    loadHeroData();
  }, [abTestConfig, deviceType]);

  // Hero-Varianten laden
  const loadHeroVariants = async (
    variantAId: number,
    variantBId: number,
  ): Promise<HeroVariant[]> => {
    try {
      const [responseA, responseB] = await Promise.all([
        fetch(`/api/content/hero/${variantAId}`),
        fetch(`/api/content/hero/${variantBId}`),
      ]);

      const [variantA, variantB] = await Promise.all([responseA.json(), responseB.json()]);

      return [variantA, variantB];
    } catch (error) {
      console.error("Fehler beim Laden der Hero-Varianten:", error);
      return [];
    }
  };

  // Variante auswählen basierend auf Traffic-Split
  const selectVariant = (variants: HeroVariant[], trafficSplit: number): HeroVariant => {
    const random = Math.random() * 100;
    return random < trafficSplit ? variants[0] : variants[1];
  };

  // Impression tracken
  const trackImpression = async (heroId: number, variantName: string, deviceType: string) => {
    try {
      await fetch("/api/ab-test/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero_id: heroId,
          variant_name: variantName,
          device_type: deviceType,
          event_type: "impression",
        }),
      });
    } catch (error) {
      console.error("Fehler beim Tracken der Impression:", error);
    }
  };

  // Click tracken
  const trackClick = async (heroId: number, variantName: string, deviceType: string) => {
    try {
      await fetch("/api/ab-test/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero_id: heroId,
          variant_name: variantName,
          device_type: deviceType,
          event_type: "click",
        }),
      });
    } catch (error) {
      console.error("Fehler beim Tracken des Klicks:", error);
    }
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Hero-Section rendern wenn Daten geladen oder Fehler aufgetreten
  if (loading) {
    return (
      <section className="relative min-h-screen gradient-corporate flex items-center justify-center overflow-hidden">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Hero-Daten werden geladen...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative min-h-screen gradient-corporate flex items-center justify-center overflow-hidden">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Lopez IT Welt</h1>
          <p className="text-xl mb-8">Professionelle IT-Lösungen</p>
          <p className="text-red-300 mb-8">Fehler beim Laden der Hero-Daten: {error}</p>
          <Link
            href="/kontakt"
            className="bg-akzentblau hover:bg-akzentblau/90 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Jetzt beraten lassen
          </Link>
        </div>
      </section>
    );
  }

  if (!heroData) {
    return null;
  }

  return (
    <section className="relative min-h-screen gradient-corporate flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-akzentblau rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-akzent-orange rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gruen-aa rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-weiss/5 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
          <span className="text-akzentblau">{heroData.title}</span>
          <br />
          <span className="text-4xl md:text-5xl lg:text-6xl">{heroData.subtitle}</span>
        </h1>

        {/* Subtitle */}
        <p className="text-2xl md:text-3xl text-weiss/80 max-w-4xl mx-auto mb-12 leading-relaxed font-medium">
          {heroData.description}
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href={heroData.button_link}
            className="bg-akzentblau hover:bg-akzentblau/90 text-white px-8 py-4 rounded-xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={() => {
              // Click tracken wenn A/B-Test aktiv
              if (abTestConfig?.is_active && selectedVariant) {
                trackClick(selectedVariant.id, selectedVariant.title, deviceType);
              }
            }}
          >
            {heroData.button_text}
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-weiss/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-weiss/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
