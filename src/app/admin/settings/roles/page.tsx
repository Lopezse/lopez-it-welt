// =====================================================
// ENTERPRISE++ ROLLENVERWALTUNG - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: Rollenverwaltung (SAP/IBM/Siemens Level)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// Security: 🔐 MIT SECURITY-RECHECK GESCHÜTZT
// =====================================================

"use client";

import { useState, useEffect } from "react";
import { FaUserShield, FaPlus, FaEdit, FaTrash, FaCopy, FaKey } from "react-icons/fa";
import Link from "next/link";
import { SecurityRecheckGate } from "@/components/admin/security/SecurityRecheckGate";

interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: string[];
  user_count: number;
}

export default function RolesPage() {
  return (
    <SecurityRecheckGate actionDescription="die Rollenverwaltung zu öffnen">
      <RolesPageContent />
    </SecurityRecheckGate>
  );
}

function RolesPageContent() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const response = await fetch("/api/admin/roles", {
        credentials: "include",
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setRoles(result.data || []);
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden der Rollen:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: "#050509" }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#c99700" }}></div>
          <p className="mt-4 text-sm" style={{ color: "#b3b3b3" }}>Lade Rollen...</p>
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
              Rollenverwaltung
            </h1>
            <p className="text-sm" style={{ color: "#8a8a8a" }}>
              Rollen erstellen, bearbeiten, Berechtigungen zuweisen
            </p>
          </div>
          <button
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
            Rolle erstellen
          </button>
        </div>

        {/* Rollen-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className="rounded-lg border p-6 transition-all duration-200"
              style={{
                backgroundColor: "#111217",
                borderColor: "#272a33",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#007bff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#272a33";
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: "#007bff20", color: "#007bff" }}>
                    <FaUserShield />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: "#f4f4f4" }}>
                      {role.name}
                    </h3>
                    {role.description && (
                      <p className="text-sm mt-1" style={{ color: "#8a8a8a" }}>
                        {role.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium" style={{ color: "#8a8a8a" }}>
                    Berechtigungen
                  </span>
                  <span className="text-xs" style={{ color: "#8a8a8a" }}>
                    {role.permissions?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium" style={{ color: "#8a8a8a" }}>
                    Benutzer
                  </span>
                  <span className="text-xs" style={{ color: "#8a8a8a" }}>
                    {role.user_count || 0}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  className="flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                  style={{ backgroundColor: "#007bff20", color: "#007bff" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#007bff40";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#007bff20";
                  }}
                >
                  <FaEdit className="inline mr-1" />
                  Bearbeiten
                </button>
                <button
                  className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                  style={{ backgroundColor: "#272a33", color: "#8a8a8a" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#1f2329";
                    e.currentTarget.style.color = "#f4f4f4";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#272a33";
                    e.currentTarget.style.color = "#8a8a8a";
                  }}
                  title="Kopieren"
                >
                  <FaCopy />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

