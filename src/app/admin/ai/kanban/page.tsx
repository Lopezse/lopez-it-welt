"use client";

// =====================================================
// AI CENTER - KANBAN BOARD PAGE
// =====================================================
// /admin/ai/kanban
// Enterprise++ Dev-Tasks Visualisierung
// =====================================================

import { useState } from "react";
import { 
  FaColumns, 
  FaSyncAlt, 
  FaArrowLeft,
  FaPlus,
  FaFilter,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import Link from "next/link";
import { KanbanBoard } from "@/components/admin/ai/KanbanBoard";

// =====================================================
// KOMPONENTE
// =====================================================

export default function KanbanPage() {
  const [showCancelled, setShowCancelled] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-[#050509] text-[#f4f4f4]">
      {/* Header */}
      <div className="border-b border-[#272a33] bg-[#111217] px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/ai"
              className="p-2 hover:bg-[#272a33] rounded-lg transition-colors"
            >
              <FaArrowLeft className="h-4 w-4 text-[#b3b3b3]" />
            </Link>
            <div className="p-3 bg-gradient-to-br from-[#ffd700] to-[#ff8c00] rounded-xl">
              <FaColumns className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#f4f4f4]">
                Dev-Tasks Kanban
              </h1>
              <p className="text-[#b3b3b3]">
                Enterprise++ Workflow-Übersicht
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Toggle Cancelled */}
            <button
              onClick={() => setShowCancelled(!showCancelled)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                showCancelled 
                  ? "bg-red-400/10 text-red-400 border border-red-400/30" 
                  : "bg-[#272a33] text-[#b3b3b3]"
              }`}
            >
              {showCancelled ? <FaEye /> : <FaEyeSlash />}
              Abgebrochen
            </button>
            
            {/* Refresh */}
            <button
              onClick={() => setRefreshKey(k => k + 1)}
              className="flex items-center gap-2 px-4 py-2 bg-[#272a33] hover:bg-[#353840] rounded-lg transition-colors"
            >
              <FaSyncAlt />
              Aktualisieren
            </button>
            
            {/* New Task */}
            <Link
              href="/admin/ai/dev-tasks?new=true"
              className="flex items-center gap-2 px-4 py-2 bg-[#ffd700] hover:bg-[#ffed4a] text-black font-medium rounded-lg transition-colors"
            >
              <FaPlus />
              Neuer Task
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Workflow-Info */}
        <div className="mb-6 p-4 bg-[#111217] border border-[#272a33] rounded-xl">
          <h3 className="font-semibold text-[#f4f4f4] mb-2 flex items-center gap-2">
            <FaColumns className="h-4 w-4 text-[#ffd700]" />
            Enterprise++ Workflow
          </h3>
          <div className="flex items-center gap-2 text-sm text-[#b3b3b3] flex-wrap">
            <span className="px-2 py-1 bg-gray-400/10 text-gray-400 rounded">Offen</span>
            <span className="text-[#71717a]">→</span>
            <span className="px-2 py-1 bg-amber-400/10 text-amber-400 rounded">Agent-A Plant</span>
            <span className="text-[#71717a]">→</span>
            <span className="px-2 py-1 bg-blue-400/10 text-blue-400 rounded">Geplant</span>
            <span className="text-[#71717a]">→</span>
            <span className="px-2 py-1 bg-purple-400/10 text-purple-400 rounded">Agent-B Codet</span>
            <span className="text-[#71717a]">→</span>
            <span className="px-2 py-1 bg-orange-400/10 text-orange-400 rounded">Agent-C Reviewed</span>
            <span className="text-[#71717a]">→</span>
            <span className="px-2 py-1 bg-green-400/10 text-green-400 rounded">Fertig</span>
          </div>
        </div>

        {/* Kanban Board */}
        <KanbanBoard 
          key={refreshKey}
          showCancelled={showCancelled}
        />

        {/* Help */}
        <div className="mt-6 p-4 bg-[#111217] border border-[#272a33] rounded-xl">
          <h4 className="font-semibold text-[#f4f4f4] mb-2">Tipps</h4>
          <ul className="text-sm text-[#b3b3b3] space-y-1">
            <li>• Klicke auf einen Task für Details</li>
            <li>• Hover über einen Task für Quick-Actions</li>
            <li>• Neue Tasks können aus dem Projekt-Analyzer erstellt werden (Risk → Task)</li>
            <li>• Agent-A plant automatisch neue Tasks</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

