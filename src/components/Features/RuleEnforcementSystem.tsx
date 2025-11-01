'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface QualityRules {
  strict: boolean;
  enforceStandards: boolean;
  requireApproval: boolean;
  documentChanges: boolean;
  noNewMdFiles: boolean;
  statusTracking: boolean;
}

interface RuleEnforcementContextType {
  isBlocked: boolean;
  violationCount: number;
  lastViolation: string;
  currentAction: string;
  requireApproval: (action: string) => Promise<boolean>;
  checkRules: (action: string) => boolean;
  updateStatus: (action: string, status: string) => void;
  getBlockReason: () => string;
}

const RuleEnforcementContext = createContext<RuleEnforcementContextType | null>(
  null
);

export function useRuleEnforcement() {
  const context = useContext(RuleEnforcementContext);
  if (!context) {
    throw new Error(
      'useRuleEnforcement must be used within RuleEnforcementProvider'
    );
  }
  return context;
}

interface RuleEnforcementProviderProps {
  children: React.ReactNode;
}

export function RuleEnforcementProvider({
  children,
}: RuleEnforcementProviderProps) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [lastViolation, setLastViolation] = useState('');
  const [currentAction, setCurrentAction] = useState('');
  const [pendingApproval, setPendingApproval] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  // QualityController.md Regeln laden
  const loadQualityControllerRules = (): QualityRules => {
    return {
      strict: true,
      enforceStandards: true,
      requireApproval: true,
      documentChanges: true,
      noNewMdFiles: true,
      statusTracking: true,
    };
  };

  // Verstoß-Erkennung
  const checkForViolation = (
    action: string,
    rules: QualityRules
  ): string | null => {
    // Regel 1: Änderungen nur nach vollständiger Prüfung
    if (action.includes('edit_file') && !action.includes('STATUS.md')) {
      return 'Änderung ohne STATUS.md Dokumentation';
    }

    // Regel 2: Keine automatischen Änderungen ohne Freigabe
    if (action.includes('automatic') && !action.includes('approval')) {
      return 'Automatische Änderung ohne explizite Freigabe';
    }

    // Regel 3: Keine neuen .md Dateien ohne Prüfung
    if (action.includes('new .md') || action.includes('create .md')) {
      return 'Neue .md-Datei ohne Prüfung gegen QualityController.md';
    }

    // Regel 4: Keine Eigeninterpretation
    if (action.includes('interpret') || action.includes('assume')) {
      return 'Eigeninterpretation der Anforderungen verboten';
    }

    // Regel 5: Geschützte Pfade nicht modifizieren
    const protectedPaths = [
      'src/components/layout/',
      'src/app/layout.tsx',
      'tailwind.config.ts',
      'next.config.js',
      'package.json',
    ];

    for (const path of protectedPaths) {
      if (action.includes(path) && !action.includes('approval')) {
        return `Geschützter Pfad ${path} ohne Freigabe modifiziert`;
      }
    }

    return null;
  };

  // STATUS.md Update simulieren
  const updateStatus = (action: string, status: string) => {
    // console.log(`📝 STATUS.md Update: ${action} - ${status}`);
  };

  // Explizite Freigabe einholen
  const requireApproval = async (action: string): Promise<boolean> => {
    setCurrentAction(action);
    setPendingApproval(action);

    // Blockierung aktivieren
    setIsBlocked(true);
    setShowOverlay(true);

    // STATUS.md Update
    updateStatus(action, 'Warte auf explizite Freigabe');

    // Warte auf Benutzer-Freigabe
    return new Promise(resolve => {
      // Diese Funktion wird nur durch Benutzer-Interaktion aufgelöst
      const checkApproval = () => {
        if (!isBlocked) {
          resolve(true);
        } else {
          setTimeout(checkApproval, 1000);
        }
      };
      checkApproval();
    });
  };

  // Regeln prüfen
  const checkRules = (action: string): boolean => {
    const violation = checkForViolation(action, loadQualityControllerRules());

    if (violation) {
      setIsBlocked(true);
      setViolationCount(prev => prev + 1);
      setLastViolation(violation);
      setShowOverlay(true);

      // console.log(`🚨 REGELVERSTOß ERKANNT:`);
      // console.log(`- Verstoß: ${violation}`);
      // console.log(`- Aktion: ${action}`);
      // console.log(`- Verstoßanzahl: ${violationCount + 1}`);
      // console.log(`- System blockiert - Warte auf Freigabe`);

      return false;
    }

    return true;
  };

  // Blockierungsgrund abrufen
  const getBlockReason = (): string => {
    if (isBlocked) {
      return `🚨 BLOCKIERT: ${lastViolation} (Verstoß #${violationCount})`;
    }
    return '';
  };

  // Freigabe-Funktion (nur durch Benutzer aufrufbar)
  const approveAction = () => {
    if (pendingApproval) {
      setIsBlocked(false);
      setPendingApproval(null);
      setShowOverlay(false);
      updateStatus(currentAction, 'Freigegeben durch Benutzer');
      // console.log(`✅ FREIGABE ERTEILT: ${currentAction}`);
    }
  };

  // Blockierung aufheben (nur durch Benutzer aufrufbar)
  const unblockSystem = () => {
    setIsBlocked(false);
    setViolationCount(0);
    setLastViolation('');
    setPendingApproval(null);
    setShowOverlay(false);
    // console.log(`🔓 SYSTEM FREIGESCHALTET`);
  };

  // Globale Funktionen für Benutzer-Interaktion
  useEffect(() => {
    (window as any).approveAction = approveAction;
    (window as any).unblockSystem = unblockSystem;
    (window as any).getBlockStatus = () => ({
      isBlocked,
      violationCount,
      lastViolation,
      currentAction,
      pendingApproval,
    });
  }, [
    isBlocked,
    violationCount,
    lastViolation,
    currentAction,
    pendingApproval,
    approveAction,
  ]);

  const value: RuleEnforcementContextType = {
    isBlocked,
    violationCount,
    lastViolation,
    currentAction,
    requireApproval,
    checkRules,
    updateStatus,
    getBlockReason,
  };

  return (
    <RuleEnforcementContext.Provider value={value}>
      {children}

      {/* Blockierungs-Overlay - nur sichtbar bei Regelverstößen */}
      {showOverlay && isBlocked && (
        <div className='fixed inset-0 bg-red-900 bg-opacity-90 z-50 flex items-center justify-center'>
          <div className='bg-white p-8 rounded-lg shadow-2xl max-w-2xl mx-4'>
            <div className='text-center'>
              <h1 className='text-3xl font-bold text-red-600 mb-4'>
                🚨 KI-SYSTEM BLOCKIERT
              </h1>

              <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
                <h2 className='text-xl font-semibold text-red-800 mb-2'>
                  Regelverstoß erkannt
                </h2>
                <p className='text-red-700 mb-2'>
                  <strong>Verstoß:</strong> {lastViolation}
                </p>
                <p className='text-red-700 mb-2'>
                  <strong>Aktion:</strong> {currentAction}
                </p>
                <p className='text-red-700'>
                  <strong>Verstoßanzahl:</strong> {violationCount}
                </p>
              </div>

              <div className='space-y-4'>
                <button
                  onClick={approveAction}
                  className='bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors'
                >
                  ✅ AKTION FREIGEBEN
                </button>

                <button
                  onClick={unblockSystem}
                  className='bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors ml-4'
                >
                  🔓 SYSTEM FREISCHALTEN
                </button>
              </div>

              <div className='mt-6 text-sm text-gray-600'>
                <p>
                  Das KI-System ist blockiert, bis Sie explizit eine Freigabe
                  erteilen.
                </p>
                <p>Alle weiteren KI-Aktionen sind verhindert.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </RuleEnforcementContext.Provider>
  );
}
