"use client";

// =====================================================
// ALERTING DASHBOARD - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Enterprise++ Alerting Management Dashboard
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AlertingStatus {
  connections: {
    email: boolean;
    sms: boolean;
    slack: boolean;
    allWorking: boolean;
  };
  config: {
    email: {
      enabled: boolean;
      from: string;
      to: string[];
    };
    sms: {
      enabled: boolean;
      provider: string;
      to: string[];
    };
    slack: {
      enabled: boolean;
      channel: string;
      username: string;
    };
  };
  rules: string[];
  timestamp: string;
}

interface TestResult {
  success: boolean;
  message: string;
  test: boolean;
}

export default function AlertingDashboard() {
  const [status, setStatus] = useState<AlertingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [sendingTest, setSendingTest] = useState(false);

  // =====================================================
  // DATA LOADING
  // =====================================================

  useEffect(() => {
    loadAlertingStatus();
  }, []);

  const loadAlertingStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/alerting/send");
      const data = await response.json();

      if (data.success) {
        setStatus(data.status);
      } else {
        console.error("Fehler beim Laden des Alerting-Status:", data.error);
      }
    } catch (error) {
      console.error("Fehler beim Laden des Alerting-Status:", error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // TEST FUNCTIONS
  // =====================================================

  const sendTestAlert = async () => {
    try {
      setSendingTest(true);
      setTestResult(null);

      const response = await fetch("/api/alerting/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test: true }),
      });

      const data = await response.json();
      setTestResult(data);

      // Status nach Test aktualisieren
      setTimeout(() => {
        loadAlertingStatus();
      }, 2000);
    } catch (error) {
      console.error("Fehler beim Senden des Test-Alerts:", error);
      setTestResult({
        success: false,
        message: "Fehler beim Senden des Test-Alerts",
        test: true,
      });
    } finally {
      setSendingTest(false);
    }
  };

  // =====================================================
  // RENDER FUNCTIONS
  // =====================================================

  const renderConnectionStatus = (service: string, isConnected: boolean) => (
    <motion.div
      key={service}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border-2 ${
        isConnected ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
          <span className="font-medium capitalize">{service}</span>
        </div>
        <span className={`text-sm ${isConnected ? "text-green-600" : "text-red-600"}`}>
          {isConnected ? "Verbunden" : "Getrennt"}
        </span>
      </div>
    </motion.div>
  );

  const renderConfigCard = (title: string, config: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-md border"
    >
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span className={`font-medium ${config.enabled ? "text-green-600" : "text-red-600"}`}>
            {config.enabled ? "Aktiviert" : "Deaktiviert"}
          </span>
        </div>
        {config.from && (
          <div className="flex justify-between">
            <span className="text-gray-600">Von:</span>
            <span className="font-medium">{config.from}</span>
          </div>
        )}
        {config.to && (
          <div className="flex justify-between">
            <span className="text-gray-600">An:</span>
            <span className="font-medium">
              {Array.isArray(config.to) ? config.to.join(", ") : config.to}
            </span>
          </div>
        )}
        {config.channel && (
          <div className="flex justify-between">
            <span className="text-gray-600">Kanal:</span>
            <span className="font-medium">{config.channel}</span>
          </div>
        )}
        {config.provider && (
          <div className="flex justify-between">
            <span className="text-gray-600">Provider:</span>
            <span className="font-medium capitalize">{config.provider}</span>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🚨 Alerting Dashboard</h1>
          <p className="text-gray-600">Enterprise++ Alerting System Management</p>
        </motion.div>

        {/* Test Alert Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Test Alert</h2>
              <button
                onClick={sendTestAlert}
                disabled={sendingTest}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  sendingTest
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {sendingTest ? "Sende..." : "Test Alert senden"}
              </button>
            </div>

            <AnimatePresence>
              {testResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-4 rounded-lg ${
                    testResult.success
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{testResult.success ? "✅" : "❌"}</span>
                    <span
                      className={`font-medium ${
                        testResult.success ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {testResult.message}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {status && (
          <>
            {/* Connection Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold mb-4">Verbindungsstatus</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderConnectionStatus("E-Mail", status.connections.email)}
                {renderConnectionStatus("SMS", status.connections.sms)}
                {renderConnectionStatus("Slack", status.connections.slack)}
              </div>
            </motion.div>

            {/* Configuration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold mb-4">Konfiguration</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderConfigCard("E-Mail Alerting", status.config.email)}
                {renderConfigCard("SMS Alerting", status.config.sms)}
                {renderConfigCard("Slack Alerting", status.config.slack)}
              </div>
            </motion.div>

            {/* Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold mb-4">Alerting-Regeln</h2>
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {status.rules.map((rule, index) => (
                    <motion.div
                      key={rule}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 bg-gray-50 rounded-lg border"
                    >
                      <span className="font-medium text-gray-800">{rule}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Timestamp */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-gray-500 text-sm"
            >
              Letzte Aktualisierung: {new Date(status.timestamp).toLocaleString("de-DE")}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
