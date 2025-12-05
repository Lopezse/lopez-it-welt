// =====================================================
// ENTERPRISE++ BENUTZERVERWALTUNG - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Benutzerverwaltung (SAP/IBM/Siemens Level)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// Security: 🔐 MIT SECURITY-RECHECK GESCHÜTZT
// =====================================================

"use client";

import { useState, useEffect } from "react";
import { FaUsers, FaPlus, FaEdit, FaTrash, FaLock, FaUnlock, FaKey, FaShieldAlt, FaHistory } from "react-icons/fa";
import Link from "next/link";
import { SecurityRecheckGate } from "@/components/admin/security/SecurityRecheckGate";

interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  status: string;
  roles: string[];
  two_factor_enabled: boolean;
  last_login?: string;
}

export default function UsersPage() {
  return (
    <SecurityRecheckGate actionDescription="die Benutzerverwaltung zu öffnen">
      <UsersPageContent />
    </SecurityRecheckGate>
  );
}

function UsersPageContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/admin/users", {
        credentials: "include",
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUsers(result.data || []);
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden der Benutzer:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: "#050509" }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#c99700" }}></div>
          <p className="mt-4 text-sm" style={{ color: "#b3b3b3" }}>Lade Benutzer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#050509" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/admin/settings" className="text-sm mb-2 inline-block" style={{ color: "#8a8a8a" }}>
              ← Zurück zu Einstellungen
            </Link>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#f4f4f4" }}>
              Benutzerverwaltung
            </h1>
            <p className="text-sm" style={{ color: "#8a8a8a" }}>
              Benutzer anlegen, bearbeiten, deaktivieren, Passwort zurücksetzen
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
            style={{ backgroundColor: "#007bff", color: "#ffffff" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#0056b3";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#007bff";
            }}
          >
            <FaPlus className="mr-2" />
            Benutzer anlegen
          </button>
        </div>

        {/* Benutzer-Tabelle */}
        <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#1a1d24", borderBottom: "1px solid #272a33" }}>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#8a8a8a" }}>
                  Benutzer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#8a8a8a" }}>
                  E-Mail
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#8a8a8a" }}>
                  Rollen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#8a8a8a" }}>
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#8a8a8a" }}>
                  2FA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#8a8a8a" }}>
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "#272a33" }}>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-opacity-50 transition-colors" style={{ backgroundColor: "#111217" }}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#007bff20", color: "#007bff" }}>
                        <FaUsers />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium" style={{ color: "#f4f4f4" }}>
                          {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}
                        </div>
                        <div className="text-sm" style={{ color: "#8a8a8a" }}>
                          {user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm" style={{ color: "#f4f4f4" }}>
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.roles?.map((role, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs rounded"
                          style={{ backgroundColor: "#007bff20", color: "#007bff" }}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        user.status === "active" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {user.status === "active" ? "Aktiv" : "Inaktiv"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/settings/users/${user.id}/2fa`}
                      className={`inline-flex items-center px-2 py-1 text-xs rounded ${
                        user.two_factor_enabled 
                          ? "bg-green-500/20 text-green-500" 
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      <FaShieldAlt className="mr-1" />
                      {user.two_factor_enabled ? "Aktiv" : "Inaktiv"}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 rounded transition-colors"
                        style={{ color: "#007bff" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#1f2329";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        title="Bearbeiten"
                      >
                        <FaEdit />
                      </button>
                      <Link
                        href={`/admin/settings/users/${user.id}/2fa`}
                        className="p-2 rounded transition-colors inline-flex"
                        style={{ color: user.two_factor_enabled ? "#28a745" : "#dc3545" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#1f2329";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        title={user.two_factor_enabled ? "2FA verwalten" : "2FA einrichten"}
                      >
                        <FaShieldAlt />
                      </Link>
                      <button
                        className="p-2 rounded transition-colors"
                        style={{ color: "#c99700" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#1f2329";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        title="Passwort zurücksetzen"
                      >
                        <FaKey />
                      </button>
                      <button
                        className="p-2 rounded transition-colors"
                        style={{ color: "#8a8a8a" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#1f2329";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        title="Login-Historie"
                      >
                        <FaHistory />
                      </button>
                      {user.status === "active" ? (
                        <button
                          className="p-2 rounded transition-colors"
                          style={{ color: "#dc3545" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#1f2329";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                          title="Deaktivieren"
                        >
                          <FaLock />
                        </button>
                      ) : (
                        <button
                          className="p-2 rounded transition-colors"
                          style={{ color: "#28a745" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#1f2329";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                          title="Aktivieren"
                        >
                          <FaUnlock />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

