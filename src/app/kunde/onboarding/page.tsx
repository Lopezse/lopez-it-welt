// =====================================================
// KUNDEN ONBOARDING WIZARD
// =====================================================
// /kunde/onboarding
// 4-Schritte Onboarding nach Registrierung
// =====================================================

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FaUser, FaMapMarkerAlt, FaFileContract, FaRocket,
  FaCheck, FaArrowRight, FaArrowLeft, FaSpinner,
  FaTimesCircle, FaShieldAlt, FaGlobe, FaLaptopCode,
  FaBrain, FaHeadset, FaChartLine, FaBuilding
} from "react-icons/fa";

// =====================================================
// TYPEN
// =====================================================

type Salutation = "herr" | "frau" | "divers" | "firma";
type Language = "de" | "en" | "es";
type ServiceInterest = "website" | "ai_center" | "it_service" | "consulting";

interface Step1Data {
  salutation: Salutation;
  first_name: string;
  last_name: string;
  company_name: string;
  phone: string;
  language: Language;
}

interface Step2Data {
  street: string;
  postal_code: string;
  city: string;
  country: string;
  vat_id: string;
}

interface Step3Data {
  agb_accepted: boolean;
  datenschutz_accepted: boolean;
  ai_processing_accepted: boolean;
}

interface Step4Data {
  service_interests: ServiceInterest[];
  referral_source: string;
}

// =====================================================
// SCHRITTE KONFIGURATION
// =====================================================

const steps = [
  { number: 1, title: "Basisdaten", icon: FaUser, description: "Ihre persönlichen Daten" },
  { number: 2, title: "Adresse", icon: FaMapMarkerAlt, description: "Rechnungsadresse" },
  { number: 3, title: "Rechtliches", icon: FaFileContract, description: "AGB & Datenschutz" },
  { number: 4, title: "Start", icon: FaRocket, description: "Service-Auswahl" }
];

const services: { id: ServiceInterest; name: string; icon: React.ElementType; description: string }[] = [
  { id: "website", name: "Website & Shop", icon: FaGlobe, description: "Webseiten, Online-Shops, Web-Apps" },
  { id: "ai_center", name: "AI Center", icon: FaBrain, description: "KI-Analysen, Automatisierung, Agenten" },
  { id: "it_service", name: "IT-Service", icon: FaLaptopCode, description: "Wartung, Support, Infrastruktur" },
  { id: "consulting", name: "Consulting", icon: FaChartLine, description: "Beratung, Konzepte, Strategie" }
];

// =====================================================
// COMPONENT
// =====================================================

export default function OnboardingPage() {
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Step Data
  const [step1, setStep1] = useState<Step1Data>({
    salutation: "herr",
    first_name: "",
    last_name: "",
    company_name: "",
    phone: "",
    language: "de"
  });
  
  const [step2, setStep2] = useState<Step2Data>({
    street: "",
    postal_code: "",
    city: "",
    country: "DE",
    vat_id: ""
  });
  
  const [step3, setStep3] = useState<Step3Data>({
    agb_accepted: false,
    datenschutz_accepted: false,
    ai_processing_accepted: false
  });
  
  const [step4, setStep4] = useState<Step4Data>({
    service_interests: [],
    referral_source: ""
  });

  // -------------------------------------------------
  // INIT - Fortschritt laden
  // -------------------------------------------------

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const response = await fetch("/api/auth/onboarding");
      const data = await response.json();
      
      if (!data.success) {
        router.push("/kunde/login");
        return;
      }
      
      const { progress } = data.data;
      
      // Bereits abgeschlossen? -> Dashboard
      if (progress.is_complete) {
        router.push("/portal");
        return;
      }
      
      // Daten laden falls vorhanden
      if (progress.step1_data) {
        setStep1({
          salutation: progress.step1_data.salutation || "herr",
          first_name: progress.step1_data.first_name || "",
          last_name: progress.step1_data.last_name || "",
          company_name: progress.step1_data.company_name || "",
          phone: progress.step1_data.phone || "",
          language: progress.step1_data.language || "de"
        });
      }
      if (progress.step2_data) {
        setStep2({
          street: progress.step2_data.street || "",
          postal_code: progress.step2_data.postal_code || "",
          city: progress.step2_data.city || "",
          country: progress.step2_data.country || "DE",
          vat_id: progress.step2_data.vat_id || ""
        });
      }
      if (progress.step3_data) {
        setStep3({
          agb_accepted: progress.step3_data.agb_accepted || false,
          datenschutz_accepted: progress.step3_data.datenschutz_accepted || false,
          ai_processing_accepted: progress.step3_data.ai_processing_accepted || false
        });
      }
      if (progress.step4_data) {
        setStep4({
          service_interests: progress.step4_data.service_interests || [],
          referral_source: progress.step4_data.referral_source || ""
        });
      }
      
      // Zum aktuellen Schritt springen
      setCurrentStep(Math.min(progress.current_step, 4));
      setLoading(false);
      
    } catch (err) {
      console.error("Load progress error:", err);
      router.push("/kunde/login");
    }
  };

  // -------------------------------------------------
  // SAVE STEP
  // -------------------------------------------------

  const saveStep = async () => {
    setError(null);
    setSaving(true);
    
    let stepData;
    switch (currentStep) {
      case 1: stepData = step1; break;
      case 2: stepData = step2; break;
      case 3: stepData = step3; break;
      case 4: stepData = step4; break;
    }
    
    try {
      const response = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: currentStep, data: stepData })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        setError(data.error);
        setSaving(false);
        return false;
      }
      
      setSaving(false);
      
      // Abgeschlossen?
      if (data.data.is_complete) {
        router.push("/portal");
        return true;
      }
      
      return true;
      
    } catch (err) {
      console.error("Save step error:", err);
      setError("Ein Fehler ist aufgetreten");
      setSaving(false);
      return false;
    }
  };

  // -------------------------------------------------
  // NAVIGATION
  // -------------------------------------------------

  const handleNext = async () => {
    const saved = await saveStep();
    if (saved && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleService = (serviceId: ServiceInterest) => {
    setStep4(prev => ({
      ...prev,
      service_interests: prev.service_interests.includes(serviceId)
        ? prev.service_interests.filter(s => s !== serviceId)
        : [...prev.service_interests, serviceId]
    }));
  };

  // -------------------------------------------------
  // LOADING
  // -------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
                      flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Onboarding wird geladen...</p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------
  // RENDER
  // -------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Willkommen bei Lopez IT Welt
          </h1>
          <p className="text-slate-400">
            Vervollständigen Sie Ihr Profil in wenigen Schritten
          </p>
        </div>

        {/* Stepper */}
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex flex-col items-center ${index < steps.length - 1 ? "w-full" : ""}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
                              ${currentStep === step.number 
                                ? "bg-blue-600 text-white" 
                                : currentStep > step.number 
                                  ? "bg-green-600 text-white"
                                  : "bg-slate-700 text-slate-400"}`}>
                  {currentStep > step.number ? (
                    <FaCheck className="text-lg" />
                  ) : (
                    <step.icon className="text-lg" />
                  )}
                </div>
                <span className={`text-xs mt-2 hidden sm:block
                              ${currentStep >= step.number ? "text-white" : "text-slate-500"}`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`hidden sm:block flex-1 h-1 mx-2 rounded
                              ${currentStep > step.number ? "bg-green-600" : "bg-slate-700"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8">
          
          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 
                           flex items-center gap-3">
              <FaTimesCircle className="text-red-400 flex-shrink-0" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          {/* STEP 1 - Basisdaten */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <FaUser className="text-4xl text-blue-400 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-white">Basisdaten</h2>
                <p className="text-slate-400 text-sm">Wie dürfen wir Sie ansprechen?</p>
              </div>

              {/* Anrede */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Anrede *</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["herr", "frau", "divers", "firma"] as Salutation[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStep1({ ...step1, salutation: s })}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all
                                ${step1.salutation === s 
                                  ? "bg-blue-600 text-white" 
                                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
                    >
                      {s === "herr" ? "Herr" : s === "frau" ? "Frau" : s === "divers" ? "Divers" : "Firma"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Vorname *</label>
                  <input
                    type="text"
                    value={step1.first_name}
                    onChange={(e) => setStep1({ ...step1, first_name: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 
                             text-white focus:outline-none focus:border-blue-500"
                    placeholder="Max"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nachname *</label>
                  <input
                    type="text"
                    value={step1.last_name}
                    onChange={(e) => setStep1({ ...step1, last_name: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 
                             text-white focus:outline-none focus:border-blue-500"
                    placeholder="Mustermann"
                  />
                </div>
              </div>

              {/* Firma & Telefon */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <FaBuilding className="inline mr-1" /> Firma (optional)
                  </label>
                  <input
                    type="text"
                    value={step1.company_name}
                    onChange={(e) => setStep1({ ...step1, company_name: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 
                             text-white focus:outline-none focus:border-blue-500"
                    placeholder="Musterfirma GmbH"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Telefon (optional)</label>
                  <input
                    type="tel"
                    value={step1.phone}
                    onChange={(e) => setStep1({ ...step1, phone: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 
                             text-white focus:outline-none focus:border-blue-500"
                    placeholder="+49 123 456789"
                  />
                </div>
              </div>

              {/* Sprache */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <FaGlobe className="inline mr-1" /> Bevorzugte Sprache *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([{ id: "de", label: "Deutsch" }, { id: "en", label: "English" }, { id: "es", label: "Español" }] as const).map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setStep1({ ...step1, language: lang.id })}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all
                                ${step1.language === lang.id 
                                  ? "bg-blue-600 text-white" 
                                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 - Adresse */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <FaMapMarkerAlt className="text-4xl text-blue-400 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-white">Rechnungsadresse</h2>
                <p className="text-slate-400 text-sm">Für Rechnungen und offizielle Dokumente</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Straße & Hausnummer *</label>
                <input
                  type="text"
                  value={step2.street}
                  onChange={(e) => setStep2({ ...step2, street: e.target.value })}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 
                           text-white focus:outline-none focus:border-blue-500"
                  placeholder="Musterstraße 123"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">PLZ *</label>
                  <input
                    type="text"
                    value={step2.postal_code}
                    onChange={(e) => setStep2({ ...step2, postal_code: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 
                             text-white focus:outline-none focus:border-blue-500"
                    placeholder="12345"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Ort *</label>
                  <input
                    type="text"
                    value={step2.city}
                    onChange={(e) => setStep2({ ...step2, city: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 
                             text-white focus:outline-none focus:border-blue-500"
                    placeholder="Musterstadt"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Land *</label>
                  <select
                    value={step2.country}
                    onChange={(e) => setStep2({ ...step2, country: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 
                             text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="DE">Deutschland</option>
                    <option value="AT">Österreich</option>
                    <option value="CH">Schweiz</option>
                    <option value="ES">Spanien</option>
                    <option value="OTHER">Anderes Land</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">USt-IdNr. (optional)</label>
                  <input
                    type="text"
                    value={step2.vat_id}
                    onChange={(e) => setStep2({ ...step2, vat_id: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 
                             text-white focus:outline-none focus:border-blue-500"
                    placeholder="DE123456789"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 - Rechtliches */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <FaFileContract className="text-4xl text-blue-400 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-white">Rechtliches</h2>
                <p className="text-slate-400 text-sm">Wichtige Vereinbarungen</p>
              </div>

              <div className="space-y-4">
                {/* AGB */}
                <label className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg cursor-pointer 
                                 hover:bg-slate-700/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={step3.agb_accepted}
                    onChange={(e) => setStep3({ ...step3, agb_accepted: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-500"
                  />
                  <div>
                    <span className="text-white font-medium">
                      Allgemeine Geschäftsbedingungen (AGB) *
                    </span>
                    <p className="text-slate-400 text-sm mt-1">
                      Ich habe die{" "}
                      <Link href="/agb" className="text-blue-400 hover:underline" target="_blank">
                        AGB
                      </Link>{" "}
                      gelesen und akzeptiere diese.
                    </p>
                  </div>
                </label>

                {/* Datenschutz */}
                <label className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg cursor-pointer 
                                 hover:bg-slate-700/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={step3.datenschutz_accepted}
                    onChange={(e) => setStep3({ ...step3, datenschutz_accepted: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-500"
                  />
                  <div>
                    <span className="text-white font-medium">
                      Datenschutzerklärung *
                    </span>
                    <p className="text-slate-400 text-sm mt-1">
                      Ich habe die{" "}
                      <Link href="/datenschutz" className="text-blue-400 hover:underline" target="_blank">
                        Datenschutzerklärung
                      </Link>{" "}
                      zur Kenntnis genommen.
                    </p>
                  </div>
                </label>

                {/* AI Processing */}
                <label className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg cursor-pointer 
                                 hover:bg-slate-700/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={step3.ai_processing_accepted}
                    onChange={(e) => setStep3({ ...step3, ai_processing_accepted: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-500"
                  />
                  <div>
                    <span className="text-white font-medium">
                      KI-Verarbeitung (optional, empfohlen)
                    </span>
                    <p className="text-slate-400 text-sm mt-1">
                      Ich stimme zu, dass meine Daten zur Verbesserung der KI-Services 
                      verarbeitet werden dürfen. Diese Einwilligung kann jederzeit widerrufen werden.
                    </p>
                  </div>
                </label>
              </div>

              {/* 2FA Empfehlung */}
              <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <FaShieldAlt className="text-amber-400 mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-amber-300 font-medium">Sicherheitsempfehlung</span>
                    <p className="text-slate-300 text-sm mt-1">
                      Aktivieren Sie 2-Faktor-Authentifizierung für maximale Sicherheit.
                    </p>
                    <Link 
                      href="/kunde/2fa" 
                      className="text-amber-400 text-sm hover:underline inline-flex items-center gap-1 mt-2"
                    >
                      Jetzt 2FA einrichten <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 - Service-Auswahl */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <FaRocket className="text-4xl text-blue-400 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-white">Womit starten wir?</h2>
                <p className="text-slate-400 text-sm">Wählen Sie Ihre Interessenbereiche (mehrere möglich)</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleService(service.id)}
                    className={`p-4 rounded-xl text-left transition-all border-2
                              ${step4.service_interests.includes(service.id)
                                ? "bg-blue-600/20 border-blue-500"
                                : "bg-slate-700/30 border-slate-600 hover:border-slate-500"}`}
                  >
                    <service.icon className={`text-2xl mb-2 
                                            ${step4.service_interests.includes(service.id) 
                                              ? "text-blue-400" : "text-slate-400"}`} />
                    <h3 className="font-semibold text-white">{service.name}</h3>
                    <p className="text-slate-400 text-sm mt-1">{service.description}</p>
                    {step4.service_interests.includes(service.id) && (
                      <div className="mt-2">
                        <FaCheck className="text-green-400" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Referral */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Wie haben Sie von uns erfahren? (optional)
                </label>
                <select
                  value={step4.referral_source}
                  onChange={(e) => setStep4({ ...step4, referral_source: e.target.value })}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 
                           text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Bitte wählen...</option>
                  <option value="google">Google-Suche</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="empfehlung">Empfehlung</option>
                  <option value="social">Social Media</option>
                  <option value="other">Anderes</option>
                </select>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-700">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                        ${currentStep === 1 
                          ? "text-slate-500 cursor-not-allowed" 
                          : "text-slate-300 hover:text-white hover:bg-slate-700"}`}
            >
              <FaArrowLeft /> Zurück
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={saving || (currentStep === 4 && step4.service_interests.length === 0)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 
                       disabled:bg-slate-600 disabled:cursor-not-allowed
                       text-white font-medium rounded-lg transition-all"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Speichern...
                </>
              ) : currentStep === 4 ? (
                <>
                  Zum Dashboard <FaRocket />
                </>
              ) : (
                <>
                  Weiter <FaArrowRight />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Info */}
        <p className="text-center text-slate-500 text-sm mt-4">
          Schritt {currentStep} von 4
        </p>
      </div>
    </div>
  );
}







