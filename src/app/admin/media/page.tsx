"use client";

/**
 * Media Management - Enterprise++ Standard
 * 
 * Hash-basierte Media-Verwaltung im Admin-Dashboard
 * - Medienliste nach Kategorie, Datum
 * - Detailansicht pro mediaId
 * - Sichere Preview-Links
 */

import { useEffect, useState } from "react";
import { FaImage, FaFilter, FaSearch, FaEye, FaCalendar, FaFolder } from "react-icons/fa";
import AIStatusBadge, { type AIStatus } from "@/components/admin/media/AIStatusBadge";
import DSGVOWarningBadge from "@/components/admin/media/DSGVOWarningBadge";
import BulkActionsToolbar from "@/components/admin/media/BulkActionsToolbar";
import Link from "next/link";

interface MediaItem {
    id: string;
    mime: string;
    category: string;
    size: number;
    createdAt: string;
    originalFileName?: string;
    alt?: string;
    thumbnailId?: string;
    folderPath: string;
    fileExists: boolean;
    fileSize: number;
    lastModified: string;
    // KI-Felder
    ai_status?: AIStatus;
    ai_error_message?: string | null;
    ai_analyzed_at?: string | null;
    has_person?: boolean;
    dsgvo_approved_by_admin?: boolean;
    ai_tags?: string[] | null;
    ai_quality_score?: number | null;
}

interface MediaListResponse {
    success: boolean;
    data: {
        media: MediaItem[];
        pagination: {
            total: number;
            limit: number;
            offset: number;
            hasMore: boolean;
        };
    };
}

export default function MediaManagementPage() {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const [selectedMediaIds, setSelectedMediaIds] = useState<Set<string>>(new Set());
    const [hasManagePermission, setHasManagePermission] = useState(false);
    const [pagination, setPagination] = useState({
        total: 0,
        limit: 100,
        offset: 0,
        hasMore: false,
    });

    // Medienliste laden
    const loadMedia = async (category: string | null = null, offset: number = 0) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (category) params.set("category", category);
            params.set("limit", String(pagination.limit));
            params.set("offset", String(offset));

            const response = await fetch(`/api/admin/media/list?${params.toString()}`);
            const data: MediaListResponse = await response.json();

            if (data.success) {
                setMedia(data.data.media);
                setPagination(data.data.pagination);
            }
        } catch (error) {
            // Fehler wird stillschweigend behandelt (UI zeigt leere Liste)
        } finally {
            setLoading(false);
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
            console.error("❌ Fehler beim Laden der Berechtigungen:", error);
        }
    };

    useEffect(() => {
        loadMedia(selectedCategory, 0);
        loadPermissions();
    }, [selectedCategory]);

    // Checkbox-Handling
    const toggleMediaSelection = (mediaId: string) => {
        setSelectedMediaIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(mediaId)) {
                newSet.delete(mediaId);
            } else {
                newSet.add(mediaId);
            }
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedMediaIds.size === media.length) {
            setSelectedMediaIds(new Set());
        } else {
            setSelectedMediaIds(new Set(media.map((m) => m.id)));
        }
    };

    const selectedMediaItems = media.filter((m) => selectedMediaIds.has(m.id));

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

    // Kategorie-Filter
    const categories = ["linkedin", "gallery", "document", "other"];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <FaImage className="text-blue-600" />
                                Media-Verwaltung
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Hash-basierte Medien-Verwaltung (Enterprise++ Standard)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filter & Search */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <FaFilter className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">Kategorie:</span>
                        </div>
                        <select
                            value={selectedCategory || ""}
                            onChange={(e) => setSelectedCategory(e.target.value || null)}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Alle Kategorien</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>
                        <div className="ml-auto text-sm text-gray-600">
                            {pagination.total} Medien gefunden
                        </div>
                    </div>
                </div>

                {/* Bulk-Actions-Toolbar */}
                {hasManagePermission && selectedMediaItems.length > 0 && (
                    <BulkActionsToolbar
                        selectedMedia={selectedMediaItems}
                        hasManagePermission={hasManagePermission}
                        onActionComplete={() => {
                            setSelectedMediaIds(new Set());
                            loadMedia(selectedCategory, pagination.offset);
                        }}
                    />
                )}

                {/* Media List */}
                {loading ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="text-gray-400">Lade Medien...</div>
                    </div>
                ) : media.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="text-gray-400">Keine Medien gefunden</div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200" role="table" aria-label="Medienliste">
                            <thead className="bg-gray-50">
                                <tr role="row">
                                    {hasManagePermission && (
                                        <th className="px-6 py-3 text-left" role="columnheader" scope="col">
                                            <input
                                                type="checkbox"
                                                checked={selectedMediaIds.size === media.length && media.length > 0}
                                                onChange={toggleSelectAll}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                                                aria-label="Alle Medien auswählen"
                                                aria-controls="media-table-body"
                                            />
                                        </th>
                                    )}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" role="columnheader" scope="col">
                                        Media-ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" role="columnheader" scope="col">
                                        Kategorie
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" role="columnheader" scope="col">
                                        Typ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" role="columnheader" scope="col">
                                        KI-Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" role="columnheader" scope="col">
                                        DSGVO
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" role="columnheader" scope="col">
                                        Größe
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" role="columnheader" scope="col">
                                        Erstellt
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" role="columnheader" scope="col">
                                        Aktionen
                                    </th>
                                </tr>
                            </thead>
                            <tbody id="media-table-body" className="bg-white divide-y divide-gray-200">
                                {media.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50" role="row">
                                        {hasManagePermission && (
                                            <td className="px-6 py-4 whitespace-nowrap" role="gridcell">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMediaIds.has(item.id)}
                                                    onChange={() => toggleMediaSelection(item.id)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                                                    aria-label={`Medium ${item.id} auswählen`}
                                                />
                                            </td>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <code className="text-xs font-mono text-gray-900">
                                                {item.id}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                <FaFolder className="mr-1" />
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.mime}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <AIStatusBadge
                                                status={item.ai_status || null}
                                                errorMessage={item.ai_error_message}
                                                analyzedAt={item.ai_analyzed_at}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <DSGVOWarningBadge
                                                hasPerson={item.has_person || false}
                                                dsgvoApproved={item.dsgvo_approved_by_admin || false}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatFileSize(item.fileSize)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <FaCalendar className="text-gray-400" />
                                                {formatDate(item.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={`/api/admin/media/view?id=${item.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                                >
                                                    <FaEye />
                                                    Ansehen
                                                </a>
                                                <span className="text-gray-300">|</span>
                                                <Link
                                                    href={`/admin/media/${item.id}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Details
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {pagination.hasMore && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => loadMedia(selectedCategory, pagination.offset + pagination.limit)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Mehr laden
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}




