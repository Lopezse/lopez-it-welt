"use client";

/**
 * SuccessMessage - Enterprise++ Standard
 * 
 * Professionelle Erfolgsanzeige-Komponente
 */

import { FaCheckCircle, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";

interface SuccessMessageProps {
    message: string;
    onDismiss?: () => void;
    autoDismiss?: boolean;
    autoDismissDelay?: number;
}

export default function SuccessMessage({
    message,
    onDismiss,
    autoDismiss = true,
    autoDismissDelay = 3000,
}: SuccessMessageProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (autoDismiss && visible) {
            const timer = setTimeout(() => {
                setVisible(false);
                onDismiss?.();
            }, autoDismissDelay);
            return () => clearTimeout(timer);
        }
    }, [autoDismiss, autoDismissDelay, onDismiss, visible]);

    if (!visible) return null;

    const handleDismiss = () => {
        setVisible(false);
        onDismiss?.();
    };

    return (
        <div
            className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-4 flex items-start gap-3"
            role="status"
            aria-live="polite"
        >
            <FaCheckCircle className="text-green-600 text-lg mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1">
                <p className="text-sm font-medium">{message}</p>
            </div>
            {onDismiss && (
                <button
                    onClick={handleDismiss}
                    className="text-green-800 hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded"
                    aria-label="Erfolgsmeldung schließen"
                >
                    <FaTimes className="text-sm" aria-hidden="true" />
                </button>
            )}
        </div>
    );
}





