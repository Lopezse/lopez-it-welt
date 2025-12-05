// =====================================================
// PORTAL - EINSTELLUNGEN
// =====================================================

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FaSpinner, FaUser, FaShieldAlt, 
  FaCheck, FaTimes, FaArrowRight, FaKey
} from "react-icons/fa";

interface CustomerProfile {
  id: number;
  email: string;
  salutation?: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  language?: string;
  two_factor_enabled: boolean;
}

export default function EinstellungenPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success) setProfile(data.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage(null);
    
    try {
      const res = await fetch("/api/portal/einstellungen", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: profile.first_name,
          last_name: profile.last_name,
          company_name: profile.company_name,
          language: profile.language
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Einstellungen gespeichert' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Fehler beim Speichern' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Fehler beim Speichern' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="text-3xl text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-red-400">Profil konnte nicht geladen werden</div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Einstellungen</h1>
        <p className="text-slate-400">Verwalten Sie Ihr Profil und Sicherheitseinstellungen</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.type === 'success' ? <FaCheck /> : <FaTimes />}
          {message.text}
        </div>
      )}

      {/* Profil */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaUser className="text-blue-400" />
          <h2 className="text-lg font-medium text-white">Profil</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">E-Mail</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full bg-slate-700/30 border border-slate-600 rounded-lg px-4 py-2 
                       text-slate-400 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500 mt-1">E-Mail kann nicht geändert werden</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Vorname</label>
              <input
                type="text"
                value={profile.first_name || ""}
                onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 
                         text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Nachname</label>
              <input
                type="text"
                value={profile.last_name || ""}
                onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 
                         text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Firma</label>
            <input
              type="text"
              value={profile.company_name || ""}
              onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 
                       text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Sprache</label>
            <select
              value={profile.language || "de"}
              onChange={(e) => setProfile({ ...profile, language: e.target.value })}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 
                       text-white focus:outline-none focus:border-blue-500"
            >
              <option value="de">Deutsch</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          <button
            onClick={saveProfile}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 
                     text-white rounded-lg flex items-center gap-2"
          >
            {saving ? <FaSpinner className="animate-spin" /> : <FaCheck />}
            Speichern
          </button>
        </div>
      </div>

      {/* Sicherheit */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaShieldAlt className="text-green-400" />
          <h2 className="text-lg font-medium text-white">Sicherheit</h2>
        </div>

        <div className="space-y-4">
          {/* 2FA Status */}
          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <FaKey className={profile.two_factor_enabled ? "text-green-400" : "text-slate-400"} />
              <div>
                <p className="text-white font-medium">Zwei-Faktor-Authentifizierung</p>
                <p className="text-sm text-slate-400">
                  {profile.two_factor_enabled ? "Aktiviert" : "Nicht aktiviert"}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/kunde/2fa")}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg 
                       text-sm flex items-center gap-1"
            >
              {profile.two_factor_enabled ? "Verwalten" : "Aktivieren"} 
              <FaArrowRight className="text-xs" />
            </button>
          </div>

          {/* Passwort ändern */}
          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <FaKey className="text-slate-400" />
              <div>
                <p className="text-white font-medium">Passwort</p>
                <p className="text-sm text-slate-400">Passwort ändern</p>
              </div>
            </div>
            <button
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg 
                       text-sm flex items-center gap-1"
            >
              Ändern <FaArrowRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

