"use client";

/**
 * Media Detail Page - Enterprise++ Standard
 * 
 * Detailansicht für ein einzelnes Medium
 * - Bild-Preview (links)
 * - Metadaten und KI-Informationen (rechts, Tabs)
 */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaImage, FaSpinner } from "react-icons/fa";
import AIStatusPanel from "@/components/admin/media/AIStatusPanel";
import AIDescriptionPanel from "@/components/admin/media/AIDescriptionPanel";
import AITagsPanel from "@/components/admin/media/AITagsPanel";
import QualityScorePanel from "@/components/admin/media/QualityScorePanel";
import CategorySuggestionPanel from "@/components/admin/media/CategorySuggestionPanel";
import DSGVOPanel from "@/components/admin/media/DSGVOPanel";
import MediaDetailActions from "@/components/admin/media/MediaDetailActions";
import { MediaAIMonitoringPanel } from "@/components/admin/media/ai/MediaAIMonitoringPanel";
import { MediaAIAuditLogs } from "@/components/admin/media/ai/MediaAIAuditLogs";
import { logger } from "@/lib/logger";

interface MediaDetail {
    id: string;
    mime: string;
    category: string;
    size: number;
    createdAt: string;
    originalFileName?: string;
    alt?: string;
    fileSize: number;
    lastModified: string;
    // KI-Felder
    ai_status?: "pending" | "running" | "done" | "error" | "idle" | null;
    ai_error_message?: string | null;
    ai_retry_count?: number;
    ai_analyzed_at?: string | null;
    ai?: {
        tags?: string[];
        description_ai?: string;
        quality_score?: number;
        quality_warnings?: string[];
        category_suggestion?: string;
        has_person?: boolean;
        has_text_in_image?: boolean;
    } | null;
    dsgvo_approved_by_admin?: boolean;
    dsgvo_approved_at?: string;
    dsgvo_approved_by?: string;
}

export default function MediaDetailPage() {
    const params = useParams();
    const router = useRouter();
    const mediaId = params.id as string;

    const [media, setMedia] = useState<MediaDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"basic" | "ai" | "monitoring" | "audit">("basic");
    const [refreshing, setRefreshing] = useState(false);
    
    // Editierbare Felder (State für Übernahme-Funktionen)
    const [editedAlt, setEditedAlt] = useState<string | undefined>(undefined);
    const [editedCategory, setEditedCategory] = useState<string | undefined>(undefined);
    const [editedTags, setEditedTags] = useState<string[] | undefined>(undefined);
    const [saving, setSaving] = useState(false);
    
    // Berechtigungen
    const [hasManagePermission, setHasManagePermission] = useState(false);

    // Media-Details laden
    const loadMediaDetail = async () => {
        try {
            setRefreshing(true);
            const response = await fetch(`/api/admin/media/detail?id=${mediaId}`);
            const data = await response.json();

            if (data.success) {
                setMedia(data.data);
            } else {
                logger.error("Fehler beim Laden der Media-Details", new Error(data.message));
            }
        } catch (error) {
            logger.error("Fehler beim Laden der Media-Details", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Berechtigungen laden
    const loadPermissions = async () => {
        try {
            const response = await fetch("/api/auth/admin/me");
            const data = await response.json();
            if (data.success && data.data.permissions) {
                const permissions = data.data.permissions as string[];
                setHasManagePermission(
                    permissions.includes("media.ai.manage") ||
                    permissions.includes("media.*") ||
                    permissions.includes("*")
                );
            }
        } catch (error) {
            logger.error("Fehler beim Laden der Berechtigungen", error);
        }
    };

    useEffect(() => {
        if (mediaId) {
            loadMediaDetail();
            loadPermissions();
        }
    }, [mediaId]);

    // Editierbare Felder zurücksetzen, wenn Media geladen wird
    useEffect(() => {
        if (media) {
            setEditedAlt(media.alt);
            setEditedCategory(media.category);
            // Tags werden aktuell nicht in MediaMeta gespeichert, nur in ai.tags
            setEditedTags(media.ai?.tags || []);
        }
    }, [media]);

    // Bild-URL generieren
    const getImageUrl = () => {
        if (!media) return null;
        return `/api/admin/media/view?id=${media.id}`;
    };

    // Format: Date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("de-DE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Format: File Size
    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    // Übernahme-Funktionen
    const handleAdoptAltText = (text: string) => {
        setEditedAlt(text);
    };

    const handleAdoptTags = (tags: string[]) => {
        setEditedTags(tags);
    };

    const handleAdoptCategory = (category: string) => {
        setEditedCategory(category);
    };

    // Stammdaten speichern
    const handleSaveBasicData = async () => {
        if (!media) return;

        setSaving(true);
        try {
            const response = await fetch("/api/admin/media/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mediaId: media.id,
                    alt: editedAlt,
                    category: editedCategory,
                    // Tags werden aktuell nicht in MediaMeta gespeichert
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Media-Details neu laden
                await loadMediaDetail();
            } else {
                logger.error("Fehler beim Speichern der Stammdaten", new Error(data.message));
            }
        } catch (error) {
            logger.error("Fehler beim Speichern der Stammdaten", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-blue-600 text-4xl mx-auto mb-4" />
                    <p className="text-gray-600">Lade Media-Details...</p>
                </div>
            </div>
        );
    }

    if (!media) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <p className="text-gray-600 mb-4">Medium nicht gefunden</p>
                        <button
                            onClick={() => router.push("/admin/media")}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Zurück zur Medienliste
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const imageUrl = getImageUrl();
    const isImage = media.mime?.startsWith("image/");

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push("/admin/media")}
                                className="text-gray-600 hover:text-gray-900"
                                aria-label="Zurück zur Medienliste"
                            >
                                <FaArrowLeft className="text-xl" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <FaImage className="text-blue-600" />
                                    Media-Details
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Media-ID: <code className="text-xs font-mono">{media.id}</code>
                                </p>
                            </div>
                        </div>
                        {refreshing && (
                            <FaSpinner className="animate-spin text-blue-600" aria-label="Aktualisiere..." />
                        )}
                    </div>
                </div>

                {/* Main Content: 2-Spalten-Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Linke Seite: Bild-Preview */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bild-Preview</h2>
                        {isImage && imageUrl ? (
                            <div className="relative">
                                <img
                                    src={imageUrl}
                                    alt={media.alt || media.originalFileName || "Media Preview"}
                                    className="max-w-full h-auto rounded-lg border border-gray-200"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg border border-gray-200">
                                <div className="text-center text-gray-400">
                                    <FaImage className="text-4xl mx-auto mb-2" />
                                    <p>Keine Bildvorschau verfügbar</p>
                                    <p className="text-sm mt-1">{media.mime}</p>
                                </div>
                            </div>
                        )}

                        {/* Datei-Informationen */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Datei-Informationen</h3>
                            <dl className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Größe:</dt>
                                    <dd className="text-gray-900">{formatFileSize(media.fileSize)}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">MIME-Type:</dt>
                                    <dd className="text-gray-900">{media.mime}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Erstellt:</dt>
                                    <dd className="text-gray-900">{formatDate(media.createdAt)}</dd>
                                </div>
                                {media.originalFileName && (
                                    <div className="flex justify-between">
                                        <dt className="text-gray-600">Original-Dateiname:</dt>
                                        <dd className="text-gray-900 truncate ml-2">{media.originalFileName}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>

                    {/* Rechte Seite: Tabs */}
                    <div className="bg-white rounded-lg shadow-sm">
                        {/* Tab-Navigation */}
                        <div className="border-b border-gray-200">
                            <nav className="flex">
                                <button
                                    onClick={() => setActiveTab("basic")}
                                    className={`px-6 py-3 text-sm font-medium ${
                                        activeTab === "basic"
                                            ? "text-blue-600 border-b-2 border-blue-600"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                    aria-label="Stammdaten anzeigen"
                                >
                                    Stammdaten
                                </button>
                                <button
                                    onClick={() => setActiveTab("ai")}
                                    className={`px-6 py-3 text-sm font-medium ${
                                        activeTab === "ai"
                                            ? "text-blue-600 border-b-2 border-blue-600"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                    aria-label="KI-Analyse anzeigen"
                                >
                                    KI-Analyse
                                </button>
                                <button
                                    onClick={() => setActiveTab("monitoring")}
                                    className={`px-6 py-3 text-sm font-medium ${
                                        activeTab === "monitoring"
                                            ? "text-blue-600 border-b-2 border-blue-600"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                    aria-label="KI-Monitoring anzeigen"
                                >
                                    Monitoring
                                </button>
                                <button
                                    onClick={() => setActiveTab("audit")}
                                    className={`px-6 py-3 text-sm font-medium ${
                                        activeTab === "audit"
                                            ? "text-blue-600 border-b-2 border-blue-600"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                    aria-label="Audit-Logs anzeigen"
                                >
                                    Audit-Logs
                                </button>
                            </nav>
                        </div>

                        {/* Tab-Content */}
                        <div className="p-6">
                            {activeTab === "basic" && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900">Basis-Informationen</h3>
                                        {hasManagePermission && (
                                            <button
                                                onClick={handleSaveBasicData}
                                                disabled={saving}
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label="Stammdaten speichern"
                                            >
                                                {saving ? "Wird gespeichert..." : "Speichern"}
                                            </button>
                                        )}
                                    </div>
                                    <dl className="space-y-3">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-600">Media-ID</dt>
                                            <dd className="mt-1 text-sm text-gray-900 font-mono">{media.id}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-600">Kategorie</dt>
                                            {hasManagePermission ? (
                                                <select
                                                    value={editedCategory || media.category}
                                                    onChange={(e) => setEditedCategory(e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                                >
                                                    <option value="linkedin">LinkedIn</option>
                                                    <option value="gallery">Gallery</option>
                                                    <option value="document">Document</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            ) : (
                                                <dd className="mt-1 text-sm text-gray-900">{media.category}</dd>
                                            )}
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-600">Erstellt</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formatDate(media.createdAt)}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-600">Letzte Änderung</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formatDate(media.lastModified)}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-600">Alt-Text</dt>
                                            {hasManagePermission ? (
                                                <textarea
                                                    value={editedAlt || ""}
                                                    onChange={(e) => setEditedAlt(e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                                    rows={3}
                                                    aria-label="Alt-Text bearbeiten"
                                                />
                                            ) : (
                                                <dd className="mt-1 text-sm text-gray-900">{media.alt || "—"}</dd>
                                            )}
                                        </div>
                                        {editedTags && editedTags.length > 0 && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-600">Tags</dt>
                                                <dd className="mt-1 flex flex-wrap gap-2">
                                                    {editedTags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            )}

                            {activeTab === "ai" && (
                                <div className="space-y-6">
                                    {/* Aktionen-Toolbar */}
                                    <MediaDetailActions
                                        mediaId={media.id}
                                        aiStatus={media.ai_status || null}
                                        hasManagePermission={hasManagePermission}
                                        onActionComplete={loadMediaDetail}
                                    />

                                    {/* AI-Status-Panel */}
                                    <AIStatusPanel
                                        status={media.ai_status || null}
                                        errorMessage={media.ai_error_message}
                                        retryCount={media.ai_retry_count || 0}
                                        analyzedAt={media.ai_analyzed_at}
                                    />

                                    {/* KI-Beschreibung-Panel */}
                                    {media.ai?.description_ai && (
                                        <AIDescriptionPanel
                                            description={media.ai.description_ai}
                                            altApproved={false} // TODO: aus meta lesen
                                            currentAlt={editedAlt}
                                            hasManagePermission={hasManagePermission}
                                            onAdoptAltText={handleAdoptAltText}
                                        />
                                    )}

                                    {/* KI-Tags-Panel */}
                                    {media.ai?.tags && media.ai.tags.length > 0 && (
                                        <AITagsPanel
                                            tags={media.ai.tags}
                                            tagsApproved={false}
                                            currentTags={editedTags}
                                            hasManagePermission={hasManagePermission}
                                            onAdoptTags={handleAdoptTags}
                                        />
                                    )}

                                    {/* Quality-Score-Panel */}
                                    {media.ai?.quality_score !== undefined && (
                                        <QualityScorePanel
                                            score={media.ai.quality_score}
                                            warnings={media.ai.quality_warnings || []}
                                        />
                                    )}

                                    {/* Kategorie-Vorschlag-Panel */}
                                    {media.ai?.category_suggestion && (
                                        <CategorySuggestionPanel
                                            suggestion={media.ai.category_suggestion}
                                            currentCategory={editedCategory || media.category}
                                            categoryApproved={false}
                                            hasManagePermission={hasManagePermission}
                                            onAdoptCategory={handleAdoptCategory}
                                        />
                                    )}

                                    {/* DSGVO-Panel */}
                                    <DSGVOPanel
                                        hasPerson={media.ai?.has_person || false}
                                        dsgvoApproved={media.dsgvo_approved_by_admin || false}
                                        approvedAt={media.dsgvo_approved_at}
                                        approvedBy={media.dsgvo_approved_by}
                                        mediaId={media.id}
                                        hasManagePermission={hasManagePermission}
                                        onApprovalComplete={loadMediaDetail}
                                    />
                                </div>
                            )}

                            {activeTab === "monitoring" && (
                                <div className="space-y-6">
                                    <MediaAIMonitoringPanel mediaId={media.id} />
                                </div>
                            )}

                            {activeTab === "audit" && (
                                <div className="space-y-6">
                                    <MediaAIAuditLogs mediaId={media.id} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

