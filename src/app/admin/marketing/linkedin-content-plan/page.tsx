"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
    FaCalendar,
    FaChartLine,
    FaClock,
    FaEdit,
    FaExclamationTriangle,
    FaFilePdf,
    FaFilter,
    FaHashtag,
    FaHistory,
    FaImage,
    FaInfoCircle,
    FaLink,
    FaSearch,
    FaSync,
    FaTag,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownMetadata {
    version?: string;
    lastUpdated?: string;
    status?: string;
}

interface TOCItem {
    id: string;
    level: number;
    text: string;
}

interface LinkedInPost {
    id: string;
    date: string;
    time: string;
    weekPhase: string;
    title: string;
    postType: "Behind the Scenes" | "System-Fortschritt" | "Erklärpost" | "Wochenabschluss" | "Sonstiges";
    linkedInUrl: string;
    imageHint: string;
    hashtags: string;
    mediaId?: string; // Enterprise++ Media-Reference (z.B. "2025-11-24-0830")
}

export default function LinkedInContentPlanPage() {
    const [markdownContent, setMarkdownContent] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [metadata, setMetadata] = useState<MarkdownMetadata>({});
    const [toc, setToc] = useState<TOCItem[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [posts, setPosts] = useState<LinkedInPost[]>([]);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<"content" | "logbook">("content");
    const [filterType, setFilterType] = useState<string>("all");
    const [filterMonth, setFilterMonth] = useState<string>("all");
    const [uploadingImage, setUploadingImage] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [newPost, setNewPost] = useState<Partial<LinkedInPost>>({
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
        weekPhase: "",
        title: "",
        postType: "System-Fortschritt",
        linkedInUrl: "",
        imageHint: "",
        hashtags: "",
        mediaId: undefined,
    });

    useEffect(() => {
        const loadMarkdown = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/admin/marketing/linkedin-content-plan");

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: Markdown-Datei konnte nicht geladen werden`);
                }

                const data = await response.json();
                if (!data.success || !data.content) {
                    throw new Error("Keine Inhalte in der Antwort");
                }

                setMarkdownContent(data.content);
                extractMetadata(data.content);
                extractTOC(data.content);
            } catch (err) {
                console.error("Fehler beim Laden der Markdown-Datei:", err);
                setError(
                    "Die Markdown-Datei konnte nicht geladen werden. Bitte prüfen Sie, ob die Datei unter docs/08-BUSINESS/08-02-linkedin-marketing-content-plan.md existiert."
                );
            } finally {
                setLoading(false);
            }
        };

        loadMarkdown();
        loadPosts();
    }, []);

    // Load posts from localStorage
    const loadPosts = () => {
        try {
            const stored = localStorage.getItem("linkedin-posts-logbook");
            if (stored) {
                const parsed = JSON.parse(stored);
                setPosts(parsed);
            } else {
                // Initialize with example entry
                const examplePost: LinkedInPost = {
                    id: "1",
                    date: "2025-11-24",
                    time: "08:30",
                    weekPhase: "Woche 1 – Enterprise++ Standards",
                    title: "Warum Enterprise++ für mich wichtig ist",
                    postType: "Behind the Scenes",
                    linkedInUrl: "",
                    imageHint: "Dashboard-Screenshot",
                    hashtags: "#EnterpriseIT #EnterpriseDevelopment #WebDevelopment #NextJS #TypeScript #SoftwareEngineering",
                };
                setPosts([examplePost]);
                localStorage.setItem("linkedin-posts-logbook", JSON.stringify([examplePost]));
            }
        } catch (error) {
            console.error("Fehler beim Laden der Posts:", error);
            setPosts([]);
        }
    };

    // Save posts to localStorage
    const savePosts = (postsToSave: LinkedInPost[]) => {
        try {
            localStorage.setItem("linkedin-posts-logbook", JSON.stringify(postsToSave));
            setPosts(postsToSave);
        } catch (error) {
            console.error("Fehler beim Speichern der Posts:", error);
        }
    };

    // Upload image
    const handleImageUpload = async () => {
        if (!selectedImage) {
            alert("Bitte wählen Sie ein Bild aus.");
            return;
        }

        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedImage);
            formData.append("category", "linkedin");
            if (newPost.title) formData.append("postTitle", newPost.title);
            if (newPost.date) formData.append("postDate", newPost.date);
            if (newPost.postType) formData.append("postType", newPost.postType);
            if (newPost.imageHint) formData.append("alt", newPost.imageHint);

            const response = await fetch("/api/admin/media/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload fehlgeschlagen");
            }

            const result = await response.json();
            setNewPost({ ...newPost, mediaId: result.mediaId });
            setSelectedImage(null);
            alert("Bild erfolgreich hochgeladen!");
        } catch (error) {
            console.error("Upload-Fehler:", error);
            alert("Fehler beim Upload des Bildes.");
        } finally {
            setUploadingImage(false);
        }
    };

    // Add new post
    const handleAddPost = () => {
        if (!newPost.date || !newPost.title) {
            alert("Bitte füllen Sie mindestens Datum und Titel aus.");
            return;
        }

        const post: LinkedInPost = {
            id: Date.now().toString(),
            date: newPost.date || "",
            time: newPost.time || "",
            weekPhase: newPost.weekPhase || "",
            title: newPost.title || "",
            postType: newPost.postType || "System-Fortschritt",
            linkedInUrl: newPost.linkedInUrl || "",
            imageHint: newPost.imageHint || "",
            hashtags: newPost.hashtags || "",
            mediaId: newPost.mediaId,
        };

        const updatedPosts = [post, ...posts];
        savePosts(updatedPosts);

        // Reset form
        setNewPost({
            date: new Date().toISOString().split("T")[0],
            time: new Date().toTimeString().slice(0, 5),
            weekPhase: "",
            title: "",
            postType: "System-Fortschritt",
            linkedInUrl: "",
            imageHint: "",
            hashtags: "",
            mediaId: undefined,
        });
        setSelectedImage(null);
        setShowAddForm(false);
    };

    const extractMetadata = (content: string) => {
        const versionMatch = content.match(/\*\*Version:\*\*\s*([^\n]+)/);
        const lastUpdatedMatch = content.match(/\*\*Zuletzt aktualisiert:\*\*\s*([^\n]+)/);
        const statusMatch = content.match(/\*\*Status:\*\*\s*([^\n]+)/);

        setMetadata({
            version: versionMatch ? versionMatch[1].trim() : "1.1.0",
            lastUpdated: lastUpdatedMatch ? lastUpdatedMatch[1].trim() : undefined,
            status: statusMatch ? statusMatch[1].trim() : undefined,
        });
    };

    const extractTOC = (content: string) => {
        const lines = content.split("\n");
        const tocItems: TOCItem[] = [];

        lines.forEach((line, index) => {
            const h1Match = line.match(/^#\s+(.+)$/);
            const h2Match = line.match(/^##\s+(.+)$/);
            const h3Match = line.match(/^###\s+(.+)$/);

            if (h1Match) {
                const text = h1Match[1].replace(/\*\*/g, "").trim();
                const id = `h1-${tocItems.length}`;
                tocItems.push({ id, level: 1, text });
            } else if (h2Match) {
                const text = h2Match[1].replace(/\*\*/g, "").trim();
                const id = `h2-${tocItems.length}`;
                tocItems.push({ id, level: 2, text });
            } else if (h3Match) {
                const text = h3Match[1].replace(/\*\*/g, "").trim();
                const id = `h3-${tocItems.length}`;
                tocItems.push({ id, level: 3, text });
            }
        });

        setToc(tocItems);
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query && contentRef.current) {
            const text = contentRef.current.innerText;
            const index = text.toLowerCase().indexOf(query.toLowerCase());
            if (index !== -1) {
                // Highlight search results (simplified - full implementation would require more complex logic)
                const elements = contentRef.current.querySelectorAll("p, h1, h2, h3, h4, li");
                elements.forEach((el) => {
                    const elText = el.textContent || "";
                    if (elText.toLowerCase().includes(query.toLowerCase())) {
                        el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                });
            }
        }
    };

    if (loading) {
        return (
            <main className="p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Lade LinkedIn-Content-Plan...</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-center">
                            <FaInfoCircle className="h-5 w-5 text-red-600 mr-3" />
                            <div>
                                <h3 className="text-lg font-semibold text-red-800">Fehler beim Laden</h3>
                                <p className="text-red-600 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="p-6 bg-gray-50 min-h-full">
            <div className="max-w-7xl mx-auto">
                {/* Enterprise Breadcrumb */}
                <nav className="mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Link href="/admin/marketing" className="hover:text-blue-600 transition-colors">
                            Marketing & Kommunikation
                        </Link>
                        <span className="text-gray-400">/</span>
                        <Link href="/admin/marketing" className="hover:text-blue-600 transition-colors">
                            Strategische Planung
                        </Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-900 font-medium">LinkedIn-Content-Plan</span>
                    </div>
                </nav>

                {/* Header Section */}
                <div className="mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4 flex-1">
                            <div className="flex-shrink-0">
                                <Image
                                    src="/LinkedIn_icon.svg.webp"
                                    alt="LinkedIn Icon"
                                    width={48}
                                    height={48}
                                    className="rounded-lg"
                                />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                    LinkedIn-Content-Plan <span className="text-blue-600 ml-2">(Enterprise++)</span>
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    Dies ist der zentrale LinkedIn-Marketing-Plan aus der Enterprise++ Dokumentation.
                                </p>
                            </div>
                        </div>

                        {/* Actions/Utility Bar */}
                        <div className="flex items-center space-x-2 ml-4">
                            <button
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Aktualisieren"
                            >
                                <FaSync className="h-4 w-4" />
                            </button>
                            <button
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-not-allowed"
                                title="Export-Funktion wird später aktiviert."
                                disabled
                            >
                                <FaFilePdf className="h-4 w-4" />
                            </button>
                            <div className="relative">
                                <button
                                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Suche im Dokument"
                                    onClick={() => setShowSearch(!showSearch)}
                                >
                                    <FaSearch className="h-4 w-4" />
                                </button>
                                {showSearch && (
                                    <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 min-w-[250px]">
                                        <input
                                            type="text"
                                            placeholder="Suche im Dokument..."
                                            value={searchQuery}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </div>
                            <button
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-not-allowed"
                                title="Version-Historie wird automatisch über Git verwaltet."
                                disabled
                            >
                                <FaHistory className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Governance Box */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                            <FaExclamationTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-gray-800">
                                <p className="font-medium mb-1">Enterprise++ Governance</p>
                                <p>
                                    Dieses Dokument ist Bestandteil der Enterprise++ Governance für Marketing & Kommunikation.
                                    Änderungen dürfen ausschließlich in der Markdown-Datei{" "}
                                    <code className="bg-yellow-100 px-1 py-0.5 rounded text-xs">docs/08-BUSINESS/08-02-linkedin-marketing-content-plan.md</code>{" "}
                                    vorgenommen werden. Direkte Bearbeitung im Admin-Dashboard ist nicht vorgesehen. Versionierung erfolgt über Git (Commit-Historie).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation - Prominent & Sichtbar */}
                <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                    <nav className="flex space-x-2">
                        <button
                            onClick={() => setActiveTab("content")}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${activeTab === "content"
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            📄 Content-Plan
                        </button>
                        <button
                            onClick={() => setActiveTab("logbook")}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all relative ${activeTab === "logbook"
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            📘 Post-Logbuch
                            {posts.length > 0 && (
                                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeTab === "logbook"
                                    ? "bg-white text-blue-600"
                                    : "bg-blue-100 text-blue-800"
                                    }`}>
                                    {posts.length}
                                </span>
                            )}
                        </button>
                    </nav>
                </div>

                {/* Content-Plan Tab */}
                {activeTab === "content" && (
                    <div className="flex gap-6">
                        {/* Left Sidebar - TOC */}
                        {toc.length > 0 && (
                            <aside className="w-64 flex-shrink-0">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-6">
                                    <h2 className="text-sm font-semibold text-gray-900 mb-3">Inhaltsverzeichnis</h2>
                                    <nav className="space-y-1">
                                        {toc.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => scrollToSection(item.id)}
                                                className={`block w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-50 transition-colors ${item.level === 1
                                                    ? "font-semibold text-gray-900"
                                                    : item.level === 2
                                                        ? "font-medium text-gray-700 ml-3"
                                                        : "text-gray-600 ml-6"
                                                    }`}
                                            >
                                                {item.text}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </aside>
                        )}

                        {/* Main Content Area */}
                        <div className="flex-1">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-8" ref={contentRef}>
                                    <div className="prose prose-lg max-w-none" style={{ maxWidth: "1100px", margin: "0 auto" }}>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h1: ({ node, ...props }) => (
                                                    <h1
                                                        id={`h1-${toc.findIndex((item) => item.level === 1 && item.text === props.children?.toString())}`}
                                                        className="text-3xl font-bold text-gray-900 mt-12 mb-6 border-b border-gray-200 pb-3 first:mt-0"
                                                        {...props}
                                                    />
                                                ),
                                                h2: ({ node, ...props }) => (
                                                    <h2
                                                        id={`h2-${toc.findIndex((item) => item.level === 2 && item.text === props.children?.toString())}`}
                                                        className="text-2xl font-semibold text-gray-800 mt-10 mb-4"
                                                        {...props}
                                                    />
                                                ),
                                                h3: ({ node, ...props }) => (
                                                    <h3
                                                        id={`h3-${toc.findIndex((item) => item.level === 3 && item.text === props.children?.toString())}`}
                                                        className="text-xl font-semibold text-gray-700 mt-8 mb-3"
                                                        {...props}
                                                    />
                                                ),
                                                h4: ({ node, ...props }) => (
                                                    <h4 className="text-lg font-medium text-gray-700 mt-6 mb-2" {...props} />
                                                ),
                                                p: ({ node, ...props }) => (
                                                    <p className="text-gray-700 mb-5 leading-relaxed" {...props} />
                                                ),
                                                ul: ({ node, ...props }) => (
                                                    <ul className="list-disc list-inside mb-5 space-y-2 text-gray-700 ml-4" {...props} />
                                                ),
                                                ol: ({ node, ...props }) => (
                                                    <ol className="list-decimal list-inside mb-5 space-y-2 text-gray-700 ml-4" {...props} />
                                                ),
                                                li: ({ node, ...props }) => <li className="ml-2" {...props} />,
                                                code: ({ node, inline, ...props }: any) => {
                                                    if (inline) {
                                                        return (
                                                            <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono" {...props} />
                                                        );
                                                    }
                                                    return (
                                                        <code className="block bg-gray-50 text-gray-800 p-4 rounded-lg overflow-x-auto text-sm font-mono mb-5 border border-gray-200" {...props} />
                                                    );
                                                },
                                                blockquote: ({ node, ...props }) => (
                                                    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-5" {...props} />
                                                ),
                                                table: ({ node, ...props }) => (
                                                    <div className="overflow-x-auto mb-5">
                                                        <table className="min-w-full divide-y divide-gray-200 border border-gray-300" {...props} />
                                                    </div>
                                                ),
                                                thead: ({ node, ...props }) => <thead className="bg-gray-50" {...props} />,
                                                tbody: ({ node, ...props }) => (
                                                    <tbody className="bg-white divide-y divide-gray-200" {...props} />
                                                ),
                                                tr: ({ node, ...props }) => <tr className="hover:bg-gray-50" {...props} />,
                                                th: ({ node, ...props }) => (
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />
                                                ),
                                                td: ({ node, ...props }) => (
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700" {...props} />
                                                ),
                                                hr: ({ node, ...props }) => <hr className="my-10 border-gray-200" {...props} />,
                                                strong: ({ node, ...props }) => (
                                                    <strong className="font-semibold text-gray-900" {...props} />
                                                ),
                                                em: ({ node, ...props }) => <em className="italic text-gray-700" {...props} />,
                                            }}
                                        >
                                            {markdownContent}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar - Version & KPIs */}
                        <aside className="w-64 flex-shrink-0 space-y-4">
                            {/* Version Box */}
                            {metadata.version && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="text-sm text-gray-600 mb-1">Version</div>
                                    <div className="text-lg font-semibold text-blue-700">{metadata.version}</div>
                                    {metadata.lastUpdated && (
                                        <>
                                            <div className="text-sm text-gray-600 mt-3 mb-1">Zuletzt aktualisiert</div>
                                            <div className="text-sm text-gray-700">{metadata.lastUpdated}</div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* KPI Box */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Content-Kennzahlen</h3>
                                <p className="text-xs text-gray-500 mb-3 italic">(automatisiert später)</p>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-gray-600">
                                            <FaCalendar className="h-3 w-3 mr-2" />
                                            <span>Geplante Wochen</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">4</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-gray-600">
                                            <FaEdit className="h-3 w-3 mr-2" />
                                            <span>Posts pro Woche</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">2–3</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-gray-600">
                                            <FaClock className="h-3 w-3 mr-2" />
                                            <span>Beitragslänge</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">~800–1200</span>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200">
                                        <div className="flex items-center text-gray-600 mb-1">
                                            <FaChartLine className="h-3 w-3 mr-2" />
                                            <span className="text-xs">Aktueller Zyklus</span>
                                        </div>
                                        <span className="text-xs font-medium text-gray-900">Woche 1 aktiv</span>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200">
                                        <div className="flex items-center text-gray-600 mb-1">
                                            <FaClock className="h-3 w-3 mr-2" />
                                            <span className="text-xs">Nächster Post</span>
                                        </div>
                                        <div className="text-xs">
                                            <span className="font-semibold text-gray-900">Mittwoch</span>
                                            <span className="text-gray-700">, </span>
                                            <span className="font-semibold text-gray-900">09:00 Uhr</span>
                                            <span className="text-gray-700"> (Woche 1)</span>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200">
                                        <div className="text-xs font-semibold text-gray-900 mb-2">Post-Zeiten (optimal):</div>
                                        <div className="space-y-1.5">
                                            <div className="flex items-center text-gray-700">
                                                <FaCalendar className="h-3 w-3 mr-2 text-gray-500" />
                                                <span className="text-xs">Montag: </span>
                                                <span className="text-xs font-semibold text-gray-900 ml-1">08:15 Uhr</span>
                                            </div>
                                            <div className="flex items-center text-gray-700">
                                                <FaCalendar className="h-3 w-3 mr-2 text-gray-500" />
                                                <span className="text-xs">Mittwoch: </span>
                                                <span className="text-xs font-semibold text-gray-900 ml-1">09:00 Uhr</span>
                                            </div>
                                            <div className="flex items-center text-gray-700">
                                                <FaCalendar className="h-3 w-3 mr-2 text-gray-500" />
                                                <span className="text-xs">Freitag: </span>
                                                <span className="text-xs font-semibold text-gray-900 ml-1">08:45 Uhr</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                )}

                {/* Logbook Tab */}
                {activeTab === "logbook" && (
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        📘 LinkedIn-Posts – Logbuch (Enterprise++)
                                    </h2>
                                    <p className="text-gray-600 text-sm">
                                        Dokumentation aller veröffentlichten LinkedIn-Beiträge mit vollständiger Metadaten-Erfassung.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowAddForm(!showAddForm)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
                                >
                                    <span>+</span>
                                    <span>Neuer Eintrag</span>
                                </button>
                            </div>

                            {/* KPI Overview Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Gesamt Posts</p>
                                            <p className="text-2xl font-bold text-blue-700">{posts.length}</p>
                                        </div>
                                        <FaChartLine className="h-8 w-8 text-blue-500" />
                                    </div>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Dieser Monat</p>
                                            <p className="text-2xl font-bold text-green-700">
                                                {posts.filter((p) => {
                                                    const postDate = new Date(p.date);
                                                    const now = new Date();
                                                    return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
                                                }).length}
                                            </p>
                                        </div>
                                        <FaCalendar className="h-8 w-8 text-green-500" />
                                    </div>
                                </div>
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Post-Typen</p>
                                            <p className="text-2xl font-bold text-purple-700">
                                                {new Set(posts.map((p) => p.postType)).size}
                                            </p>
                                        </div>
                                        <FaTag className="h-8 w-8 text-purple-500" />
                                    </div>
                                </div>
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Mit Links</p>
                                            <p className="text-2xl font-bold text-orange-700">
                                                {posts.filter((p) => p.linkedInUrl).length}
                                            </p>
                                        </div>
                                        <FaLink className="h-8 w-8 text-orange-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Filter Section */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center space-x-4">
                                    <FaFilter className="h-4 w-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">Filter:</span>
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">Alle Typen</option>
                                        <option value="Behind the Scenes">Behind the Scenes</option>
                                        <option value="System-Fortschritt">System-Fortschritt</option>
                                        <option value="Erklärpost">Erklärpost</option>
                                        <option value="Wochenabschluss">Wochenabschluss</option>
                                        <option value="Sonstiges">Sonstiges</option>
                                    </select>
                                    <select
                                        value={filterMonth}
                                        onChange={(e) => setFilterMonth(e.target.value)}
                                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">Alle Monate</option>
                                        {Array.from(new Set(posts.map((p) => {
                                            const date = new Date(p.date);
                                            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
                                        }))).sort().reverse().map((month) => {
                                            const [year, monthNum] = month.split("-");
                                            const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString("de-DE", { month: "long", year: "numeric" });
                                            return (
                                                <option key={month} value={month}>
                                                    {monthName}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Add Form Section */}
                        {showAddForm && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Neuer LinkedIn-Post</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Datum <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={newPost.date}
                                            onChange={(e) => setNewPost({ ...newPost, date: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Uhrzeit</label>
                                        <input
                                            type="time"
                                            value={newPost.time}
                                            onChange={(e) => setNewPost({ ...newPost, time: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Woche/Phase</label>
                                        <input
                                            type="text"
                                            value={newPost.weekPhase}
                                            onChange={(e) => setNewPost({ ...newPost, weekPhase: e.target.value })}
                                            placeholder="z.B. Woche 1 – Enterprise++ Standards"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Titel / Thema <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={newPost.title}
                                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                            placeholder="Titel des Posts"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Post-Typ</label>
                                        <select
                                            value={newPost.postType}
                                            onChange={(e) =>
                                                setNewPost({ ...newPost, postType: e.target.value as LinkedInPost["postType"] })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Behind the Scenes">Behind the Scenes</option>
                                            <option value="System-Fortschritt">System-Fortschritt</option>
                                            <option value="Erklärpost">Erklärpost</option>
                                            <option value="Wochenabschluss">Wochenabschluss</option>
                                            <option value="Sonstiges">Sonstiges</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn-URL</label>
                                        <input
                                            type="url"
                                            value={newPost.linkedInUrl}
                                            onChange={(e) => setNewPost({ ...newPost, linkedInUrl: e.target.value })}
                                            placeholder="https://linkedin.com/..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bild-Hinweis</label>
                                        <input
                                            type="text"
                                            value={newPost.imageHint}
                                            onChange={(e) => setNewPost({ ...newPost, imageHint: e.target.value })}
                                            placeholder="z.B. Dashboard-Screenshot"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Bild hochladen (Enterprise++ Media)
                                        </label>
                                        <div className="space-y-2">
                                            <input
                                                type="file"
                                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setSelectedImage(file);
                                                        if (!newPost.imageHint) {
                                                            setNewPost({ ...newPost, imageHint: file.name });
                                                        }
                                                    }
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {selectedImage && (
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs text-gray-600">{selectedImage.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={handleImageUpload}
                                                        disabled={uploadingImage}
                                                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:bg-gray-400"
                                                    >
                                                        {uploadingImage ? "Upload..." : "Hochladen"}
                                                    </button>
                                                </div>
                                            )}
                                            {newPost.mediaId && (
                                                <div className="text-xs text-green-600 flex items-center space-x-1">
                                                    <FaImage className="h-3 w-3" />
                                                    <span>Media-ID: {newPost.mediaId}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hashtags</label>
                                        <input
                                            type="text"
                                            value={newPost.hashtags}
                                            onChange={(e) => setNewPost({ ...newPost, hashtags: e.target.value })}
                                            placeholder="#EnterpriseIT #NextJS ..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-end space-x-3 mt-4">
                                    <button
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setNewPost({
                                                date: new Date().toISOString().split("T")[0],
                                                time: new Date().toTimeString().slice(0, 5),
                                                weekPhase: "",
                                                title: "",
                                                postType: "System-Fortschritt",
                                                linkedInUrl: "",
                                                imageHint: "",
                                                hashtags: "",
                                            });
                                        }}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                    >
                                        Abbrechen
                                    </button>
                                    <button
                                        onClick={handleAddPost}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                    >
                                        Eintrag hinzufügen
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Posts grouped by Month */}
                        {(() => {
                            const filteredPosts = posts.filter((post) => {
                                if (filterType !== "all" && post.postType !== filterType) return false;
                                if (filterMonth !== "all") {
                                    const postDate = new Date(post.date);
                                    const postMonth = `${postDate.getFullYear()}-${String(postDate.getMonth() + 1).padStart(2, "0")}`;
                                    if (postMonth !== filterMonth) return false;
                                }
                                return true;
                            });

                            const groupedByMonth = filteredPosts.reduce((acc, post) => {
                                const date = new Date(post.date);
                                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
                                const monthName = date.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
                                if (!acc[monthKey]) {
                                    acc[monthKey] = { name: monthName, posts: [] };
                                }
                                acc[monthKey].posts.push(post);
                                return acc;
                            }, {} as Record<string, { name: string; posts: LinkedInPost[] }>);

                            const sortedMonths = Object.keys(groupedByMonth).sort().reverse();

                            if (sortedMonths.length === 0) {
                                return (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                        <FaInfoCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 text-lg font-medium">Noch keine Einträge vorhanden</p>
                                        <p className="text-gray-500 text-sm mt-2">Klicken Sie auf "Neuer Eintrag" um einen Post zu dokumentieren.</p>
                                    </div>
                                );
                            }

                            return sortedMonths.map((monthKey) => {
                                const { name, posts: monthPosts } = groupedByMonth[monthKey];
                                return (
                                    <div key={monthKey} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                        <div className="mb-4 pb-3 border-b border-gray-200">
                                            <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                                                <FaCalendar className="h-5 w-5 text-blue-600" />
                                                <span>{name}</span>
                                                <span className="text-sm font-normal text-gray-500 ml-2">
                                                    ({monthPosts.length} {monthPosts.length === 1 ? "Post" : "Posts"})
                                                </span>
                                            </h3>
                                        </div>
                                        <div className="space-y-4">
                                            {monthPosts
                                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                                .map((post) => (
                                                    <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-3 mb-2">
                                                                    <span className="text-sm font-semibold text-gray-900">{post.title}</span>
                                                                    <span className={`px-2 py-1 text-xs font-medium rounded ${post.postType === "Behind the Scenes" ? "bg-purple-100 text-purple-800" :
                                                                        post.postType === "System-Fortschritt" ? "bg-blue-100 text-blue-800" :
                                                                            post.postType === "Erklärpost" ? "bg-green-100 text-green-800" :
                                                                                post.postType === "Wochenabschluss" ? "bg-orange-100 text-orange-800" :
                                                                                    "bg-gray-100 text-gray-800"
                                                                        }`}>
                                                                        {post.postType}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center space-x-4 text-xs text-gray-600">
                                                                    <span className="flex items-center space-x-1">
                                                                        <FaCalendar className="h-3 w-3" />
                                                                        <span>{new Date(post.date).toLocaleDateString("de-DE")}</span>
                                                                    </span>
                                                                    <span className="flex items-center space-x-1">
                                                                        <FaClock className="h-3 w-3" />
                                                                        <span>{post.time}</span>
                                                                    </span>
                                                                    {post.weekPhase && (
                                                                        <span className="text-gray-500">{post.weekPhase}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {post.linkedInUrl && (
                                                                <a
                                                                    href={post.linkedInUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="ml-4 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium flex items-center space-x-1"
                                                                >
                                                                    <FaLink className="h-3 w-3" />
                                                                    <span>Öffnen</span>
                                                                </a>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                            {post.imageHint && (
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-gray-600 font-medium">Bild:</span>
                                                                    <span className="text-gray-700">{post.imageHint}</span>
                                                                    {post.mediaId && (
                                                                        <a
                                                                            href={`/api/admin/media/view?id=${post.mediaId}&type=thumbnail`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 flex items-center space-x-1"
                                                                            title="Medien ansehen"
                                                                        >
                                                                            <FaImage className="h-3 w-3" />
                                                                            <span>Ansehen</span>
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            )}
                                                            {post.hashtags && (
                                                                <div>
                                                                    <span className="text-gray-600 font-medium flex items-center space-x-1">
                                                                        <FaHashtag className="h-3 w-3" />
                                                                        <span>Hashtags:</span>
                                                                    </span>
                                                                    <span className="ml-2 text-gray-700">{post.hashtags}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                )}
            </div>
        </main>
    );
}
