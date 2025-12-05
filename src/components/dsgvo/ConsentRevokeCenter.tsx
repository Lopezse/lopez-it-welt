/**
 * Consent-Revoke-Center Component - Enterprise++ Standard
 * 
 * Ermöglicht es Benutzern, ihre Einwilligungen zu widerrufen
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";

interface Consent {
    id: number;
    consent_type: string;
    consent_status: string;
    created_at: string;
    revoked_at?: string | null;
}

interface ConsentRevokeCenterProps {
    userId: string;
}

export default function ConsentRevokeCenter({ userId }: ConsentRevokeCenterProps) {
    const [consents, setConsents] = useState<Consent[]>([]);
    const [loading, setLoading] = useState(true);
    const [revoking, setRevoking] = useState<string | null>(null);

    useEffect(() => {
        loadConsents();
    }, [userId]);

    const loadConsents = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/dsgvo/consents?user_id=${userId}`);
            const data = await response.json();

            if (data.success && data.data.consents) {
                setConsents(data.data.consents);
            }
        } catch (error) {
            console.error("Fehler beim Laden der Consents:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async (consentType: string) => {
        try {
            setRevoking(consentType);
            const response = await fetch(
                `/api/dsgvo/consents?user_id=${userId}&consent_type=${consentType}`,
                { method: "DELETE" }
            );

            const data = await response.json();
            if (data.success) {
                await loadConsents();
            }
        } catch (error) {
            console.error("Fehler beim Widerrufen des Consents:", error);
        } finally {
            setRevoking(null);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Lade Consents...</div>;
    }

    const activeConsents = consents.filter(c => c.consent_status === "granted");

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Einwilligungen verwalten
            </h2>

            {activeConsents.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                    Keine aktiven Einwilligungen vorhanden.
                </p>
            ) : (
                <div className="space-y-3">
                    {activeConsents.map(consent => (
                        <div
                            key={consent.id}
                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                        {consent.consent_type}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Erteilt am: {new Date(consent.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => handleRevoke(consent.consent_type)}
                                    disabled={revoking === consent.consent_type}
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                >
                                    {revoking === consent.consent_type ? "Wird widerrufen..." : "Widerrufen"}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}



