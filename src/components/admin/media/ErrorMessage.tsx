"use client";

/**
 * ErrorMessage - Enterprise++ Standard
 * 
 * Professionelle Fehleranzeige-Komponente
 * Ersetzt alert() für Enterprise++ UX
 */

import { FaExclamationCircle, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";

interface ErrorMessageProps {
    message: string;
    type?: "error" | "warning" | "info";
    onDismiss?: () => void;
    autoDismiss?: boolean;
    autoDismissDelay?: number;
}

export default function ErrorMessage({
    message,
    type = "error",
    onDismiss,
    autoDismiss = false,
    autoDismissDelay = 5000,
}: ErrorMessageProps) {
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

    const getConfig = () => {
        switch (type) {
            case "error":
                return {
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    textColor: "text-red-800",
                    iconColor: "text-red-600",
                };
            case "warning":
                return {
                    bgColor: "bg-yellow-50",
                    borderColor: "border-yellow-200",
                    textColor: "text-yellow-800",
                    iconColor: "text-yellow-600",
                };
            case "info":
                return {
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-200",
                    textColor: "text-blue-800",
                    iconColor: "text-blue-600",
                };
        }
    };

    const config = getConfig();

    const handleDismiss = () => {
        setVisible(false);
        onDismiss?.();
    };

    return (
        <div
            className={`${config.bgColor} ${config.borderColor} ${config.textColor} border rounded-lg p-4 mb-4 flex items-start gap-3`}
            role="alert"
            aria-live="polite"
        >
            <FaExclamationCircle className={`${config.iconColor} text-lg mt-0.5 flex-shrink-0`} aria-hidden="true" />
            <div className="flex-1">
                <p className="text-sm font-medium">{message}</p>
            </div>
            {onDismiss && (
                <button
                    onClick={handleDismiss}
                    className={`${config.textColor} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${type === "error" ? "red" : type === "warning" ? "yellow" : "blue"}-500 rounded`}
                    aria-label="Fehlermeldung schließen"
                >
                    <FaTimes className="text-sm" aria-hidden="true" />
                </button>
            )}
        </div>
    );
}





