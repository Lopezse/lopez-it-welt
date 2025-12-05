// =====================================================
// PORTAL - SUPPORT
// =====================================================

"use client";

import React, { useState, useEffect } from "react";
import { 
  FaHeadset, FaSpinner, FaPlus, FaCheck, FaClock, 
  FaHourglass, FaCheckDouble, FaTimes, FaComments
} from "react-icons/fa";

interface Ticket {
  id: number;
  ticket_number: string;
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'general' | 'feature_request' | 'bug_report';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  project_name?: string;
  message_count: number;
}

const statusConfig = {
  open: { label: "Offen", color: "text-blue-400", bg: "bg-blue-500/20", icon: FaClock },
  in_progress: { label: "In Bearbeitung", color: "text-amber-400", bg: "bg-amber-500/20", icon: FaHourglass },
  waiting_customer: { label: "Warte auf Antwort", color: "text-purple-400", bg: "bg-purple-500/20", icon: FaClock },
  resolved: { label: "Gelöst", color: "text-green-400", bg: "bg-green-500/20", icon: FaCheck },
  closed: { label: "Geschlossen", color: "text-slate-400", bg: "bg-slate-500/20", icon: FaCheckDouble }
};

const priorityConfig = {
  low: { label: "Niedrig", color: "text-slate-400" },
  medium: { label: "Mittel", color: "text-blue-400" },
  high: { label: "Hoch", color: "text-amber-400" },
  urgent: { label: "Dringend", color: "text-red-400" }
};

const categoryLabels: Record<string, string> = {
  technical: "Technisch",
  billing: "Abrechnung",
  general: "Allgemein",
  feature_request: "Feature-Wunsch",
  bug_report: "Bug-Report"
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTicket, setNewTicket] = useState({ 
    subject: "", description: "", category: "general", priority: "medium" 
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => { loadTickets(); }, []);

  const loadTickets = async () => {
    try {
      const res = await fetch("/api/portal/support");
      const data = await res.json();
      if (data.success) setTickets(data.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const createTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/portal/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket)
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setNewTicket({ subject: "", description: "", category: "general", priority: "medium" });
        loadTickets();
      }
    } catch { /* ignore */ }
    setCreating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="text-3xl text-blue-400 animate-spin" />
      </div>
    );
  }

  const openTickets = tickets.filter(t => ['open', 'in_progress', 'waiting_customer'].includes(t.status)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Support</h1>
          <p className="text-slate-400">
            {openTickets > 0 ? `${openTickets} offene Tickets` : "Alle Tickets bearbeitet"}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                   text-white rounded-lg transition-colors"
        >
          <FaPlus /> Neues Ticket
        </button>
      </div>

      {/* Tickets Liste */}
      {tickets.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
          <FaHeadset className="text-5xl text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Keine Tickets</h3>
          <p className="text-slate-400 mb-4">Erstellen Sie ein Ticket wenn Sie Hilfe benötigen</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Ticket erstellen
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => {
            const status = statusConfig[ticket.status];
            const priority = priorityConfig[ticket.priority];
            const StatusIcon = status.icon;
            
            return (
              <div
                key={ticket.id}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 
                         hover:border-slate-600 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg ${status.bg} flex items-center justify-center flex-shrink-0`}>
                    <StatusIcon className={status.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-500 text-sm">{ticket.ticket_number}</span>
                      <span className={`text-xs ${priority.color}`}>{priority.label}</span>
                    </div>
                    <h3 className="font-medium text-white truncate">{ticket.subject}</h3>
                    <p className="text-slate-400 text-sm line-clamp-1">{ticket.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>{categoryLabels[ticket.category]}</span>
                      <span className="flex items-center gap-1">
                        <FaComments /> {ticket.message_count}
                      </span>
                      <span>{new Date(ticket.updated_at).toLocaleDateString('de-DE')}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${status.bg} ${status.color} flex-shrink-0`}>
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Neues Ticket */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-4">Neues Support-Ticket</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Betreff *</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 
                           text-white focus:outline-none focus:border-blue-500"
                  placeholder="Kurze Beschreibung des Problems"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Kategorie</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 
                             text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="general">Allgemein</option>
                    <option value="technical">Technisch</option>
                    <option value="billing">Abrechnung</option>
                    <option value="feature_request">Feature-Wunsch</option>
                    <option value="bug_report">Bug-Report</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Priorität</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 
                             text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="low">Niedrig</option>
                    <option value="medium">Mittel</option>
                    <option value="high">Hoch</option>
                    <option value="urgent">Dringend</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-slate-300 mb-2">Beschreibung *</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 
                           text-white focus:outline-none focus:border-blue-500 resize-none"
                  rows={5}
                  placeholder="Beschreiben Sie Ihr Anliegen ausführlich..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
              >
                Abbrechen
              </button>
              <button
                onClick={createTicket}
                disabled={creating || !newTicket.subject.trim() || !newTicket.description.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 
                         text-white rounded-lg flex items-center justify-center gap-2"
              >
                {creating ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                Absenden
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

