/**
 * Privacy-Center Page - Enterprise++ Standard
 * 
 * DSGVO Self-Service für Betroffenenrechte
 */

"use client";

import { useEffect, useState } from "react";
import PrivacyCenter from "@/components/dsgvo/PrivacyCenter";

export default function PrivacyCenterPage() {
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // User-ID aus Session laden
        const loadUserId = async () => {
            try {
                const response = await fetch("/api/auth/admin/me");
                const data = await response.json();
                if (data.success && data.data.id) {
                    setUserId(data.data.id);
                } else {
                    // Fallback: Session-ID verwenden
                    const sessionId = `session_${Date.now()}`;
                    setUserId(sessionId);
                }
            } catch (error) {
                console.error("Fehler beim Laden der User-ID:", error);
                // Fallback: Session-ID verwenden
                const sessionId = `session_${Date.now()}`;
                setUserId(sessionId);
            } finally {
                setLoading(false);
            }
        };

        loadUserId();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Lade Privacy-Center...</p>
                </div>
            </div>
        );
    }

    if (!userId) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Privacy-Center
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Bitte melden Sie sich an, um auf das Privacy-Center zuzugreifen.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Privacy-Center
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Verwalten Sie Ihre personenbezogenen Daten und Einwilligungen.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <PrivacyCenter userId={userId} />
                </div>
            </div>
        </div>
    );
}



