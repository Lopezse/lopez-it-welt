// =====================================================
// DEVELOPMENT MODE DASHBOARD - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Development Mode Management Dashboard
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useEffect, useState } from "react";

// =====================================================
// INTERFACES
// =====================================================

interface DevelopmentModeStatus {
  enabled: boolean;
  bypassAuth: boolean;
  chefUserExists: boolean;
  environment: string;
  features: string[];
}

// =====================================================
// DEVELOPMENT MODE DASHBOARD
// =====================================================

export default function DevelopmentModeDashboard() {
  const [status, setStatus] = useState<DevelopmentModeStatus>({
    enabled: false,
    bypassAuth: false,
    chefUserExists: false,
    environment: "production",
    features: [],
  });
  const [loading, setLoading] = useState(true);

  // =====================================================
  // EFFECTS
  // =====================================================

  useEffect(() => {
    loadDevelopmentModeStatus();
  }, []);

  // =====================================================
  // FUNCTIONS
  // =====================================================

  const loadDevelopmentModeStatus = async () => {
    try {
      setLoading(true);

      // Development Mode Status laden
      const response = await fetch("/api/admin/development-mode/status");
      const data = await response.json();

      setStatus(data);
    } catch (error) {
      console.error("Fehler beim Laden des Development Mode Status:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDevelopmentMode = async () => {
    try {
      const response = await fetch("/api/admin/development-mode/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enabled: !status.enabled,
        }),
      });

      if (response.ok) {
        await loadDevelopmentModeStatus();
      }
    } catch (error) {
      console.error("Fehler beim Toggle des Development Mode:", error);
    }
  };

  const createChefUser = async () => {
    try {
      const response = await fetch("/api/admin/development-mode/create-chef", {
        method: "POST",
      });

      if (response.ok) {
        await loadDevelopmentModeStatus();
      }
    } catch (error) {
      console.error("Fehler beim Erstellen des Chef-Benutzers:", error);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Development Mode Status wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Development Mode Dashboard</h1>
        <p className="text-gray-600">
          Verwalte Development Mode und Chef-Benutzer für lokale Entwicklung
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card variant="outlined" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Development Mode</p>
              <p
                className={`text-2xl font-bold ${status.enabled ? "text-green-600" : "text-red-600"}`}
              >
                {status.enabled ? "Aktiv" : "Inaktiv"}
              </p>
            </div>
            <div
              className={`w-3 h-3 rounded-full ${status.enabled ? "bg-green-500" : "bg-red-500"}`}
            ></div>
          </div>
        </Card>

        <Card variant="outlined" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Auth Bypass</p>
              <p
                className={`text-2xl font-bold ${status.bypassAuth ? "text-green-600" : "text-red-600"}`}
              >
                {status.bypassAuth ? "Aktiv" : "Inaktiv"}
              </p>
            </div>
            <div
              className={`w-3 h-3 rounded-full ${status.bypassAuth ? "bg-green-500" : "bg-red-500"}`}
            ></div>
          </div>
        </Card>

        <Card variant="outlined" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chef-Benutzer</p>
              <p
                className={`text-2xl font-bold ${status.chefUserExists ? "text-green-600" : "text-red-600"}`}
              >
                {status.chefUserExists ? "Vorhanden" : "Fehlt"}
              </p>
            </div>
            <div
              className={`w-3 h-3 rounded-full ${status.chefUserExists ? "bg-green-500" : "bg-red-500"}`}
            ></div>
          </div>
        </Card>

        <Card variant="outlined" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Environment</p>
              <p className="text-2xl font-bold text-blue-600">{status.environment}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Development Mode Controls */}
        <Card variant="outlined" className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Development Mode Steuerung</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Development Mode aktivieren</p>
                <p className="text-sm text-gray-600">
                  Ermöglicht lokale Entwicklung ohne Authentication
                </p>
              </div>
              <Button
                variant={status.enabled ? "destructive" : "primary"}
                onClick={toggleDevelopmentMode}
              >
                {status.enabled ? "Deaktivieren" : "Aktivieren"}
              </Button>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-2">Environment Variables:</p>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                <div>NODE_ENV=development</div>
                <div>DEVELOPMENT_MODE=true</div>
                <div>BYPASS_AUTH=true</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Chef-Benutzer Management */}
        <Card variant="outlined" className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Chef-Benutzer Management</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Chef-Benutzer Status</p>
                <p className="text-sm text-gray-600">
                  {status.chefUserExists
                    ? "Chef-Benutzer ist vorhanden und einsatzbereit"
                    : "Chef-Benutzer muss erstellt werden"}
                </p>
              </div>
              {!status.chefUserExists && (
                <Button variant="primary" onClick={createChefUser}>
                  Chef erstellen
                </Button>
              )}
            </div>

            {status.chefUserExists && (
              <div className="bg-green-50 p-4 rounded-md">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <p className="text-sm text-green-800">
                    Chef-Benutzer: ramiro.lopezrodriguez@lopezitwelt.de
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Features Overview */}
      <Card variant="outlined" className="p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Verfügbare Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {status.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
