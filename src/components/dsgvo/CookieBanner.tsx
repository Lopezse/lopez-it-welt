/**
 * Cookie-Banner Component - Enterprise++ Standard
 * 
 * DSGVO-konformes Cookie-Banner mit Kategorien
 * - Notwendige Cookies (kein Consent erforderlich)
 * - Funktionale Cookies (Consent erforderlich)
 * - Analytics-Cookies (Consent erforderlich)
 * - Marketing-Cookies (Consent erforderlich)
 * - KI-Verarbeitung (Consent erforderlich)
 * - Media-KI (Consent erforderlich)
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";

interface CookieCategory {
    id: string;
    name: string;
    description: string;
    required: boolean;
    consent_required: boolean;
}

interface CookieBannerProps {
    userId?: string;
    onConsentChange?: (consents: Record<string, boolean>) => void;
}

export default function CookieBanner({ userId, onConsentChange }: CookieBannerProps) {
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [categories, setCategories] = useState<CookieCategory[]>([]);
    const [consents, setConsents] = useState<Record<string, boolean>>({
        necessary: true, // Immer true
        functional: false,
        analytics: false,
        marketing: false,
        ki_processing: false,
        media_ki: false
    });

    useEffect(() => {
        // Prüfe, ob Consent bereits vorhanden
        const consentStatus = localStorage.getItem("cookie_consent");
        if (!consentStatus) {
            setShowBanner(true);
        }

        // Cookie-Konfiguration laden
        fetch("/api/dsgvo/cookies/config")
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data.categories) {
                    setCategories(data.data.categories);
                }
            })
            .catch(error => {
                console.error("Fehler beim Laden der Cookie-Konfiguration:", error);
            });
    }, []);

    const handleAcceptAll = async () => {
        const allConsents: Record<string, boolean> = {
            necessary: true,
            functional: true,
            analytics: true,
            marketing: true,
            ki_processing: true,
            media_ki: true
        };

        await saveConsents(allConsents);
        setShowBanner(false);
        localStorage.setItem("cookie_consent", "granted");
    };

    const handleRejectAll = async () => {
        const onlyNecessary: Record<string, boolean> = {
            necessary: true,
            functional: false,
            analytics: false,
            marketing: false,
            ki_processing: false,
            media_ki: false
        };

        await saveConsents(onlyNecessary);
        setShowBanner(false);
        localStorage.setItem("cookie_consent", "rejected");
    };

    const handleSaveSettings = async () => {
        await saveConsents(consents);
        setShowBanner(false);
        setShowSettings(false);
        localStorage.setItem("cookie_consent", "custom");
    };

    const saveConsents = async (consentData: Record<string, boolean>) => {
        if (!userId) {
            // Fallback: Session-ID verwenden
            const sessionId = `session_${Date.now()}`;
            for (const [consentType, granted] of Object.entries(consentData)) {
                if (consentType !== "necessary" && granted) {
                    try {
                        await fetch("/api/dsgvo/consents", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                user_id: sessionId,
                                consent_type: consentType,
                                consent_status: granted ? "granted" : "denied"
                            })
                        });
                    } catch (error) {
                        console.error(`Fehler beim Speichern des Consents: ${consentType}`, error);
                    }
                }
            }
        } else {
            // Mit User-ID speichern
            for (const [consentType, granted] of Object.entries(consentData)) {
                if (consentType !== "necessary" && granted) {
                    try {
                        await fetch("/api/dsgvo/consents", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                user_id: userId,
                                consent_type: consentType,
                                consent_status: granted ? "granted" : "denied"
                            })
                        });
                    } catch (error) {
                        console.error(`Fehler beim Speichern des Consents: ${consentType}`, error);
                    }
                }
            }
        }

        setConsents(consentData);
        if (onConsentChange) {
            onConsentChange(consentData);
        }
    };

    const toggleConsent = (categoryId: string) => {
        if (categoryId === "necessary") {
            return; // Notwendige Cookies können nicht deaktiviert werden
        }

        setConsents(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    if (!showBanner) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4">
                {!showSettings ? (
                    // Banner-Ansicht
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Cookie-Einstellungen
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung zu bieten. 
                                Einige Cookies sind notwendig, andere helfen uns, die Website zu verbessern.
                            </p>
                            <a
                                href="/datenschutz"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
                            >
                                Mehr erfahren
                            </a>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                                onClick={() => setShowSettings(true)}
                                variant="outline"
                                className="whitespace-nowrap"
                            >
                                Einstellungen
                            </Button>
                            <Button
                                onClick={handleRejectAll}
                                variant="outline"
                                className="whitespace-nowrap"
                            >
                                Nur notwendige
                            </Button>
                            <Button
                                onClick={handleAcceptAll}
                                className="whitespace-nowrap bg-black text-white"
                            >
                                Alle akzeptieren
                            </Button>
                        </div>
                    </div>
                ) : (
                    // Einstellungen-Ansicht
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Cookie-Einstellungen
                            </h3>
                            <button
                                onClick={() => setShowSettings(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {categories.map(category => (
                                <div
                                    key={category.id}
                                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                    {category.name}
                                                </h4>
                                                {category.required && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        (Erforderlich)
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {category.description}
                                            </p>
                                        </div>
                                        <Checkbox
                                            checked={consents[category.id] || false}
                                            disabled={category.required}
                                            onChange={() => toggleConsent(category.id)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                onClick={() => setShowSettings(false)}
                                variant="outline"
                            >
                                Abbrechen
                            </Button>
                            <Button
                                onClick={handleSaveSettings}
                                className="bg-black text-white"
                            >
                                Einstellungen speichern
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}



