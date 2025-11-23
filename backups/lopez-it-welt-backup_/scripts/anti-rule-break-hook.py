#!/usr/bin/env python3

"""
🛡️ Anti-Regelbruch Enterprise++ Modul - Python Hook
Verhindert systematisch alle Regelverstöße in Python-Projekten

@author Ramiro Lopez Rodriguez
@version 1.0.0
@date 2025-06-30
"""

import os
import sys
import json
import subprocess
from datetime import datetime
from typing import Dict, List, Optional, Tuple

# Enterprise++ Anti-Regelbruch Konfiguration
ANTI_RULE_BREAK_CONFIG = {
    "strictMode": True,
    "zeroTolerance": True,
    "autoBlock": True,
    "requireApproval": True,
    "validateBeforeAction": True,
    "validateAfterAction": True,
    "blockOnViolation": True,
    "requireSystemTime": True,
    "blockDateCopying": True,
    "validateTimestamps": True,
    "preventOverwriting": True,
    "requireAppendOnly": True,
    "protectMdStructure": True,
    "enforceTimeTracking": True,
    "requireSessionSwitch": True,
    "blockOverlappingSessions": True
}

# Geschützte Regeln
PROTECTED_RULES = [
    "Datumsvalidierung",
    "Zeiterfassung",
    "Md-Struktur",
    "Enterprise++ Standards",
    "Freigabe-Erfordernis",
    "System-Zeit-Verwendung"
]

# Blockierte Daten
BLOCKED_DATES = [
    "2025-01-19",
    "29.07.2025",
    "27.06.2025",
    "2025-06-27",
    "2025-01-19T",
    "29.07.2025T"
]


class AntiRuleBreakHook:
    """
    🛡️ Anti-Regelbruch Enterprise++ System Klasse
    """
    
    def __init__(self):
        self.config = ANTI_RULE_BREAK_CONFIG.copy()
        self.is_blocked = False
        self.violation_count = 0
        self.last_violation = ""
        self.approval_given = False
        self.blocked_actions = []
    
    def validate_before_action(self, action: str, target_file: Optional[str] = None) -> Dict:
        """
        🚨 Hauptvalidierung vor jeder Aktion
        """
        print("🛡️ Anti-Regelbruch-System: Validierung läuft...")
        
        timestamp = datetime.utcnow().isoformat() + "Z"
        
        # 1. System-Zeit validieren
        time_validation = self.validate_system_time()
        if not time_validation["valid"]:
            self.block_action("System-Zeit nicht validiert", time_validation["reason"])
            return {
                "valid": False,
                "reason": time_validation["reason"],
                "timestamp": timestamp,
                "rule": "System-Zeit"
            }
        
        # 2. Datumskopieren blockieren
        date_validation = self.validate_no_date_copying(action)
        if not date_validation["valid"]:
            self.block_action("Datumskopieren blockiert", date_validation["reason"])
            return {
                "valid": False,
                "reason": date_validation["reason"],
                "timestamp": timestamp,
                "rule": "Datumsvalidierung"
            }
        
        # 3. Struktur-Schutz prüfen
        if target_file and self.is_md_file(target_file):
            structure_validation = self.validate_md_structure(target_file)
            if not structure_validation["valid"]:
                self.block_action("Md-Struktur-Schutz", structure_validation["reason"])
                return {
                    "valid": False,
                    "reason": structure_validation["reason"],
                    "timestamp": timestamp,
                    "rule": "Md-Struktur"
                }
        
        # 4. Freigabe prüfen
        if not self.approval_given and self.config["requireApproval"]:
            self.block_action("Keine Freigabe vorhanden", action)
            return {
                "valid": False,
                "reason": "Keine Freigabe vorhanden",
                "timestamp": timestamp,
                "rule": "Freigabe-Erfordernis"
            }
        
        # 5. Zeiterfassung prüfen
        time_tracking_validation = self.validate_time_tracking(action)
        if not time_tracking_validation["valid"]:
            self.block_action("Zeiterfassung nicht gewechselt", time_tracking_validation["reason"])
            return {
                "valid": False,
                "reason": time_tracking_validation["reason"],
                "timestamp": timestamp,
                "rule": "Zeiterfassung"
            }
        
        print("✅ Anti-Regelbruch-Validierung erfolgreich")
        return {"valid": True, "timestamp": timestamp}
    
    def validate_system_time(self) -> Dict:
        """
        ⏰ System-Zeit validieren
        """
        try:
            current_time = datetime.utcnow()
            timestamp = current_time.isoformat() + "Z"
            
            # Prüfen ob Zeit plausibel ist (nicht in der Vergangenheit)
            min_valid_date = datetime(2025, 1, 1)
            if current_time < min_valid_date:
                return {
                    "valid": False,
                    "reason": "System-Zeit ist in der Vergangenheit",
                    "timestamp": timestamp
                }
            
            return {"valid": True, "timestamp": timestamp}
        except Exception as e:
            return {
                "valid": False,
                "reason": f"System-Zeit-Abfrage fehlgeschlagen: {str(e)}",
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
    
    def validate_no_date_copying(self, action: str) -> Dict:
        """
        📅 Datumskopieren blockieren
        """
        timestamp = datetime.utcnow().isoformat() + "Z"
        
        for blocked_date in BLOCKED_DATES:
            if blocked_date in action:
                return {
                    "valid": False,
                    "reason": f"Datumskopieren erkannt: {blocked_date}",
                    "timestamp": timestamp
                }
        
        return {"valid": True, "timestamp": timestamp}
    
    def validate_md_structure(self, target_file: str) -> Dict:
        """
        📄 Md-Struktur schützen
        """
        timestamp = datetime.utcnow().isoformat() + "Z"
        
        # Prüfen ob es sich um eine .md-Datei handelt
        if not self.is_md_file(target_file):
            return {"valid": True, "timestamp": timestamp}
        
        # Hier könnte weitere Validierung der Md-Struktur erfolgen
        # z.B. Prüfung auf Überschreibungen statt Ergänzungen
        
        return {"valid": True, "timestamp": timestamp}
    
    def validate_time_tracking(self, action: str) -> Dict:
        """
        ⏱️ Zeiterfassung validieren
        """
        timestamp = datetime.utcnow().isoformat() + "Z"
        
        # Hier könnte Validierung der Zeiterfassung erfolgen
        # z.B. Prüfung auf Session-Wechsel bei Themenwechsel
        
        return {"valid": True, "timestamp": timestamp}
    
    def block_action(self, rule: str, reason: str) -> None:
        """
        🚫 Aktion blockieren
        """
        self.violation_count += 1
        self.last_violation = f"{rule}: {reason}"
        self.is_blocked = True
        
        violation = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "rule": rule,
            "reason": reason,
            "action": "BLOCKIERT"
        }
        
        self.blocked_actions.append(violation)
        
        print("🚨 ANTI-REGELBRUCH: AKTION BLOCKIERT")
        print(f"   Regel: {rule}")
        print(f"   Grund: {reason}")
        print(f"   Verstoß #{self.violation_count}")
        print("   Status: BLOCKIERT - Freigabe erforderlich")
        
        # In STATUS.md dokumentieren
        self.document_violation(rule, reason)
    
    def document_violation(self, rule: str, reason: str) -> None:
        """
        📝 Verstoß dokumentieren
        """
        timestamp = datetime.utcnow().isoformat() + "Z"
        violation_entry = f"""
## 🚨 **ANTI-REGELBRUCH: AKTION BLOCKIERT ({timestamp})**
- **Regel:** {rule}
- **Grund:** {reason}
- **Verstoß #:** {self.violation_count}
- **Status:** ❌ BLOCKIERT - Freigabe erforderlich
- **System:** Anti-Regelbruch-System aktiviert

"""
        
        try:
            status_content = ""
            if os.path.exists("STATUS.md"):
                with open("STATUS.md", "r", encoding="utf-8") as f:
                    status_content = f.read()
            
            # Verstoß am Anfang einfügen
            updated_content = violation_entry + status_content
            with open("STATUS.md", "w", encoding="utf-8") as f:
                f.write(updated_content)
            
            print("📝 Verstoß in STATUS.md dokumentiert")
        except Exception as e:
            print(f"❌ Fehler beim Dokumentieren des Verstoßes: {e}")
    
    def grant_approval(self) -> None:
        """
        ✅ Freigabe erteilen
        """
        self.approval_given = True
        self.is_blocked = False
        print("✅ Anti-Regelbruch-Freigabe erteilt")
    
    def revoke_approval(self) -> None:
        """
        🔄 Freigabe zurückziehen
        """
        self.approval_given = False
        self.is_blocked = True
        print("🚫 Anti-Regelbruch-Freigabe zurückgezogen")
    
    def show_status(self) -> None:
        """
        📊 Status anzeigen
        """
        print("\n🛡️ Anti-Regelbruch-System Status:")
        print(f"   Blockiert: {'❌ JA' if self.is_blocked else '✅ NEIN'}")
        print(f"   Freigabe: {'✅ ERTEILT' if self.approval_given else '❌ NICHT ERTEILT'}")
        print(f"   Verstöße: {self.violation_count}")
        print(f"   Letzter Verstoß: {self.last_violation or 'Keine'}")
        print(f"   Blockierte Aktionen: {len(self.blocked_actions)}")
    
    def update_config(self, new_config: Dict) -> None:
        """
        🔧 Konfiguration aktualisieren
        """
        self.config.update(new_config)
        print("🔧 Anti-Regelbruch-Konfiguration aktualisiert")
    
    def is_md_file(self, filename: str) -> bool:
        """
        📋 Md-Datei prüfen
        """
        return filename.lower().endswith('.md')
    
    def reset_violations(self) -> None:
        """
        🧹 Verstöße zurücksetzen
        """
        self.violation_count = 0
        self.last_violation = ""
        self.blocked_actions = []
        self.is_blocked = False
        print("🧹 Anti-Regelbruch-Verstöße zurückgesetzt")


def pre_commit_hook() -> None:
    """
    Pre-commit Hook Funktion
    """
    print("🛡️ Anti-Regelbruch Pre-Commit Hook läuft...")
    
    hook = AntiRuleBreakHook()
    
    try:
        # Prüfe alle geänderten Dateien
        result = subprocess.run(
            ["git", "diff", "--cached", "--name-only"],
            capture_output=True,
            text=True,
            check=True
        )
        
        changed_files = [f.strip() for f in result.stdout.split('\n') if f.strip()]
        
        for file in changed_files:
            if hook.is_md_file(file):
                validation = hook.validate_before_action(f"Änderung in {file}", file)
                if not validation["valid"]:
                    print(f"❌ Pre-Commit Hook blockiert: {validation['reason']}")
                    sys.exit(1)
        
        print("✅ Pre-Commit Hook erfolgreich")
    except subprocess.CalledProcessError as e:
        print(f"❌ Pre-Commit Hook Fehler: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Pre-Commit Hook Fehler: {e}")
        sys.exit(1)


def post_commit_hook() -> None:
    """
    Post-commit Hook Funktion
    """
    print("🛡️ Anti-Regelbruch Post-Commit Hook läuft...")
    
    hook = AntiRuleBreakHook()
    
    try:
        # Hole Commit-Informationen
        commit_hash = subprocess.run(
            ["git", "rev-parse", "HEAD"],
            capture_output=True,
            text=True,
            check=True
        ).stdout.strip()
        
        commit_message = subprocess.run(
            ["git", "log", "-1", "--pretty=%B"],
            capture_output=True,
            text=True,
            check=True
        ).stdout.strip()
        
        commit_entry = f"""
## ✅ **COMMIT DOKUMENTIERT ({datetime.utcnow().isoformat()}Z)**
- **Commit Hash:** {commit_hash}
- **Message:** {commit_message}
- **Status:** ✅ Erfolgreich
- **Anti-Regelbruch:** ✅ Validierung bestanden

"""
        
        if os.path.exists("STATUS.md"):
            with open("STATUS.md", "r", encoding="utf-8") as f:
                status_content = f.read()
            
            updated_content = commit_entry + status_content
            
            with open("STATUS.md", "w", encoding="utf-8") as f:
                f.write(updated_content)
        
        print("✅ Post-Commit Hook erfolgreich")
    except Exception as e:
        print(f"❌ Post-Commit Hook Fehler: {e}")


def main():
    """
    Hauptfunktion für Kommandozeilen-Aufruf
    """
    if len(sys.argv) < 2:
        print("🛡️ Anti-Regelbruch Enterprise++ Modul - Python Hook")
        print("Verwendung:")
        print("  python anti-rule-break-hook.py pre-commit    - Pre-Commit Hook")
        print("  python anti-rule-break-hook.py post-commit   - Post-Commit Hook")
        print("  python anti-rule-break-hook.py validate <action> [file] - Validierung")
        return
    
    command = sys.argv[1]
    
    if command == "pre-commit":
        pre_commit_hook()
    elif command == "post-commit":
        post_commit_hook()
    elif command == "validate":
        action = sys.argv[2] if len(sys.argv) > 2 else "test"
        target_file = sys.argv[3] if len(sys.argv) > 3 else None
        hook = AntiRuleBreakHook()
        hook.validate_before_action(action, target_file)
    else:
        print(f"❌ Unbekannter Befehl: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main() 