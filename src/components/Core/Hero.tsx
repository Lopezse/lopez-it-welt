"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "../Features/I18nProvider";
import { loadABVariant, trackABEvent, detectDeviceType } from "@/lib/ab-testing";

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
interface ABVariant {
  active: boolean;
  experiment_id?: number;
  experiment_name?: string;
  variant: {
    key: string;
    title: string;
    subtitle: string;
    description: string;
    button_text: string;
    button_link: string;
  };
  split_a?: number;
  device_type?: string;
}

export function Hero() {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [abVariant, setAbVariant] = useState<ABVariant | null>(null);

  // Hero-Daten mit A/B-Testing laden
  useEffect(() => {
    const loadHeroData = async () => {
      try {
        setError(null);
        setLoading(true);

        // 1. Versuche A/B-Test Variante zu laden
        const abTestVariant = await loadABVariant();

        if (abTestVariant && abTestVariant.active) {
          // A/B-Test aktiv - verwende Variante
          setAbVariant(abTestVariant);
          setHeroData({
            id: 0,
            title: abTestVariant.variant.title,
            subtitle: abTestVariant.variant.subtitle,
            description: abTestVariant.variant.description,
            button_text: abTestVariant.variant.button_text,
            button_link: abTestVariant.variant.button_link,
            background_style: "gradient",
            background_value: "from-blue-900 to-blue-600",
            is_active: true,
            created_at: "",
            updated_at: "",
          });
          console.log("A/B-Test Variante geladen:", abTestVariant);
        } else {
          // A/B-Test nicht aktiv - lade normale Hero-Daten
          setAbVariant(null);
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

    loadHeroData();
  }, []);

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
            onClick={async () => {
              // Click tracken wenn A/B-Test aktiv
              if (abVariant && abVariant.active && abVariant.experiment_id) {
                await trackABEvent({
                  experiment_id: abVariant.experiment_id,
                  variant_key: abVariant.variant.key,
                  event_type: "click",
                  device_type: detectDeviceType(),
                });
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
