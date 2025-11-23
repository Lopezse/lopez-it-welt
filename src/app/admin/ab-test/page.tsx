/**
 * LEGACY A/B-Testing Dashboard
 * Umleitung zum neuen Experimentation Core Dashboard
 */

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ABTestPage() {
  const router = useRouter();

  useEffect(() => {
    // Umleitung zum neuen Dashboard
    router.replace("/admin/ab-experiments");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Weiterleitung zum neuen A/B-Testing Dashboard...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  );
}
