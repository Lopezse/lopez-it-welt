"use client";

/**
 * AIStatusBadge - Enterprise++ Standard
 * 
 * Zeigt den KI-Analyse-Status als Badge an
 * - pending: Gelb
 * - running: Blau
 * - done: Grün
 * - error: Rot
 * - idle/null: Grau
 */

import { FaClock, FaSpinner, FaCheckCircle, FaExclamationCircle, FaMinus } from "react-icons/fa";

export type AIStatus = "pending" | "running" | "done" | "error" | "idle" | null;

interface AIStatusBadgeProps {
    status: AIStatus;
    errorMessage?: string | null;
    analyzedAt?: string | null;
}

export default function AIStatusBadge({ status, errorMessage, analyzedAt }: AIStatusBadgeProps) {
    const getStatusConfig = () => {
        switch (status) {
            case "pending":
                return {
                    label: "KI-Analyse ausstehend",
                    icon: FaClock,
                    bgColor: "bg-yellow-100",
                    textColor: "text-yellow-800",
                    borderColor: "border-yellow-200",
                };
            case "running":
                return {
                    label: "KI-Analyse läuft...",
                    icon: FaSpinner,
                    bgColor: "bg-blue-100",
                    textColor: "text-blue-800",
                    borderColor: "border-blue-200",
                };
            case "done":
                return {
                    label: "KI-Analyse abgeschlossen",
                    icon: FaCheckCircle,
                    bgColor: "bg-green-100",
                    textColor: "text-green-800",
                    borderColor: "border-green-200",
                };
            case "error":
                return {
                    label: "KI-Analyse fehlgeschlagen",
                    icon: FaExclamationCircle,
                    bgColor: "bg-red-100",
                    textColor: "text-red-800",
                    borderColor: "border-red-200",
                };
            case "idle":
            case null:
            default:
                return {
                    label: "Noch nicht analysiert",
                    icon: FaMinus,
                    bgColor: "bg-gray-100",
                    textColor: "text-gray-800",
                    borderColor: "border-gray-200",
                };
        }
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    // Tooltip-Text generieren
    const getTooltipText = () => {
        if (status === "error" && errorMessage) {
            return `Fehler: ${errorMessage}`;
        }
        if (status === "done" && analyzedAt) {
            const date = new Date(analyzedAt);
            return `Analysiert am: ${date.toLocaleDateString("de-DE", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            })}`;
        }
        return config.label;
    };

    const isSpinning = status === "running";

    return (
        <div
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
            title={getTooltipText()}
            aria-label={config.label}
            role="status"
            aria-live={status === "running" ? "polite" : "off"}
        >
            <Icon className={`mr-1 text-sm ${isSpinning ? "animate-spin" : ""}`} aria-hidden="true" />
            <span>{config.label}</span>
        </div>
    );
}

