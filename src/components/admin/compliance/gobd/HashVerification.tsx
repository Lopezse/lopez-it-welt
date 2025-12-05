/**
 * Hash Verification Component - Enterprise++ Standard E.2.2
 * 
 * Hash-Verifikation für Rechnungen und Backups
 */

"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";

interface HashVerificationData {
  invoice_id?: string;
  backup_id?: string;
  calculated_hash: string;
  stored_hash: string;
  match: boolean;
  verified_at: string;
}

export function HashVerification() {
  const [invoiceId, setInvoiceId] = useState<string>("");
  const [backupId, setBackupId] = useState<string>("");
  const [invoiceResult, setInvoiceResult] = useState<HashVerificationData | null>(null);
  const [backupResult, setBackupResult] = useState<HashVerificationData | null>(null);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifyInvoice = async () => {
    if (!invoiceId) {
      setError("Bitte Rechnungs-ID eingeben");
      return;
    }

    try {
      setVerifying("invoice");
      setError(null);

      const response = await fetch(`/api/compliance/gobd/verify-invoice/${invoiceId}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler bei der Hash-Verifikation");
      }

      setInvoiceResult(result.data);
    } catch (err) {
      logger.error("Fehler bei der Rechnungs-Hash-Verifikation", err, { invoiceId });
      setError(err instanceof Error ? err.message : "Fehler bei der Hash-Verifikation");
    } finally {
      setVerifying(null);
    }
  };

  const verifyBackup = async () => {
    if (!backupId) {
      setError("Bitte Backup-ID eingeben");
      return;
    }

    try {
      setVerifying("backup");
      setError(null);

      const response = await fetch(`/api/compliance/gobd/verify-backup/${backupId}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler bei der Hash-Verifikation");
      }

      setBackupResult(result.data);
    } catch (err) {
      logger.error("Fehler bei der Backup-Hash-Verifikation", err, { backupId });
      setError(err instanceof Error ? err.message : "Fehler bei der Hash-Verifikation");
    } finally {
      setVerifying(null);
    }
  };

  return (
    <div className="space-y-6">
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {/* Rechnungs-Verifikation */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rechnungs-Hash-Verifikation</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rechnungs-ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={invoiceId}
                  onChange={(e) => setInvoiceId(e.target.value)}
                  placeholder="Rechnungs-ID eingeben"
                  className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                />
                <Button
                  onClick={verifyInvoice}
                  disabled={verifying === "invoice" || !invoiceId}
                >
                  {verifying === "invoice" ? "Verifiziere..." : "Verifizieren"}
                </Button>
              </div>
            </div>

            {invoiceResult && (
              <div className={`border rounded-lg p-4 ${
                invoiceResult.match 
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" 
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-semibold ${invoiceResult.match ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {invoiceResult.match ? "✓ Hash stimmt überein" : "✗ Hash stimmt nicht überein"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(invoiceResult.verified_at).toLocaleString("de-DE")}
                  </span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mt-2">
                  <div>Berechneter Hash: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{invoiceResult.calculated_hash.substring(0, 32)}...</code></div>
                  <div>Gespeicherter Hash: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{invoiceResult.stored_hash.substring(0, 32)}...</code></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Backup-Verifikation */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Backup-Hash-Verifikation</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Backup-ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={backupId}
                  onChange={(e) => setBackupId(e.target.value)}
                  placeholder="Backup-ID eingeben"
                  className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                />
                <Button
                  onClick={verifyBackup}
                  disabled={verifying === "backup" || !backupId}
                >
                  {verifying === "backup" ? "Verifiziere..." : "Verifizieren"}
                </Button>
              </div>
            </div>

            {backupResult && (
              <div className={`border rounded-lg p-4 ${
                backupResult.match 
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" 
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-semibold ${backupResult.match ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {backupResult.match ? "✓ Hash stimmt überein" : "✗ Hash stimmt nicht überein"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(backupResult.verified_at).toLocaleString("de-DE")}
                  </span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mt-2">
                  <div>Berechneter Hash: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{backupResult.calculated_hash.substring(0, 32)}...</code></div>
                  <div>Gespeicherter Hash: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{backupResult.stored_hash.substring(0, 32)}...</code></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}



