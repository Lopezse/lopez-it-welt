#!/usr/bin/env python3
"""
🛡️ Security-Audit-Agent

Kontinuierliche Sicherheitsüberwachung für:
- Vulnerability-Scans bei jedem Commit
- Secrets-Detection
- CVE-Datenbank-Abfragen
- Security-Compliance-Prüfung

@author Lopez IT Welt Team
@version 1.0.0
@date 2025-01-19
"""

import os
import sys
import json
import re
import subprocess
import requests
import hashlib
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from pathlib import Path

# 📋 Security-Audit-Konfiguration
@dataclass
class SecurityConfig:
    scan_frequency: str = "on-commit"
    cve_database: str = "nvd"
    secret_patterns: List[str] = None
    vulnerability_threshold: str = "high"
    auto_block: bool = True
    
    def __post_init__(self):
        if self.secret_patterns is None:
            self.secret_patterns = [
                r"api_key\s*=\s*['\"][^'\"]+['\"]",
                r"password\s*=\s*['\"][^'\"]+['\"]",
                r"token\s*=\s*['\"][^'\"]+['\"]",
                r"secret\s*=\s*['\"][^'\"]+['\"]",
                r"key\s*=\s*['\"][^'\"]+['\"]",
                r"credential\s*=\s*['\"][^'\"]+['\"]",
                r"auth\s*=\s*['\"][^'\"]+['\"]",
                r"private_key\s*=\s*['\"][^'\"]+['\"]",
                r"ssh_key\s*=\s*['\"][^'\"]+['\"]",
                r"access_token\s*=\s*['\"][^'\"]+['\"]"
            ]

# 📋 Security-Issue
@dataclass
class SecurityIssue:
    file: str
    line: int
    column: int
    severity: str  # low, medium, high, critical
    type: str      # vulnerability, secret, cve, dependency
    message: str
    cve_id: Optional[str] = None
    description: Optional[str] = None
    recommendation: Optional[str] = None
    fixed_in: Optional[str] = None

# 📋 Security-Audit-Ergebnis
@dataclass
class SecurityAuditResult:
    timestamp: str
    total_issues: int
    critical_issues: int
    high_issues: int
    medium_issues: int
    low_issues: int
    issues: List[SecurityIssue]
    summary: Dict[str, any]
    passed: bool

class SecurityAuditAgent:
    """
    🛡️ Security-Audit-Agent Klasse
    """
    
    def __init__(self, config: Optional[SecurityConfig] = None):
        self.config = config or SecurityConfig()
        self.results: List[SecurityIssue] = []
        self.cve_cache: Dict[str, Dict] = {}
        
        # Logging-Setup
        self.setup_logging()
        
    def setup_logging(self):
        """📝 Logging-Setup"""
        import logging
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('logs/security-audit.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger('SecurityAuditAgent')
        
    def run(self) -> SecurityAuditResult:
        """
        🚀 Haupt-Methode für Security-Audit
        """
        try:
            self.logger.info("🛡️ Security-Audit-Agent startet...")
            start_time = datetime.now()
            
            # Finde zu scannende Dateien
            files_to_scan = self.find_files_to_scan()
            self.logger.info(f"📁 {len(files_to_scan)} Dateien zum Scannen gefunden")
            
            # Führe Scans durch
            for file_path in files_to_scan:
                self.scan_file(file_path)
            
            # Dependency-Scan
            self.scan_dependencies()
            
            # CVE-Scan
            self.scan_cves()
            
            # Generiere Ergebnis
            result = self.generate_result()
            
            # Speichere Report
            self.save_report(result)
            
            # Prüfe Blockierung
            if self.config.auto_block and result.critical_issues > 0:
                self.logger.critical("🚨 Kritische Security-Issues gefunden - Blockierung aktiviert")
                sys.exit(1)
            
            duration = (datetime.now() - start_time).total_seconds()
            self.logger.info(f"✅ Security-Audit abgeschlossen in {duration:.2f}s")
            
            return result
            
        except Exception as error:
            self.logger.error(f"❌ Security-Audit fehlgeschlagen: {error}")
            raise
    
    def find_files_to_scan(self) -> List[str]:
        """
        🔍 Finde zu scannende Dateien
        """
        files = []
        scan_extensions = ['.py', '.js', '.ts', '.tsx', '.jsx', '.json', '.yml', '.yaml', '.env', '.sh', '.ps1']
        
        for root, dirs, filenames in os.walk('.'):
            # Ignoriere bestimmte Verzeichnisse
            dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '__pycache__', '.venv', 'venv']]
            
            for filename in filenames:
                if any(filename.endswith(ext) for ext in scan_extensions):
                    file_path = os.path.join(root, filename)
                    files.append(file_path)
        
        return files
    
    def scan_file(self, file_path: str):
        """
        📝 Scanne eine einzelne Datei
        """
        try:
            self.logger.debug(f"🔍 Scanne Datei: {file_path}")
            
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                lines = content.split('\n')
            
            # Secrets-Scan
            self.scan_secrets(file_path, lines)
            
            # Vulnerability-Scan
            self.scan_vulnerabilities(file_path, lines)
            
            # Code-Quality-Scan
            self.scan_code_quality(file_path, lines)
            
        except Exception as error:
            self.logger.warning(f"⚠️ Fehler beim Scannen von {file_path}: {error}")
    
    def scan_secrets(self, file_path: str, lines: List[str]):
        """
        🔐 Scanne nach Secrets
        """
        for line_num, line in enumerate(lines, 1):
            for pattern in self.config.secret_patterns:
                matches = re.finditer(pattern, line, re.IGNORECASE)
                
                for match in matches:
                    # Prüfe ob es sich um einen echten Secret handelt
                    if self.is_real_secret(match.group()):
                        issue = SecurityIssue(
                            file=file_path,
                            line=line_num,
                            column=match.start() + 1,
                            severity="critical",
                            type="secret",
                            message=f"Potentieller Secret gefunden: {match.group()[:20]}...",
                            description="Ein Secret wurde im Code gefunden. Dies ist ein Sicherheitsrisiko.",
                            recommendation="Secret in Umgebungsvariable oder Secrets-Manager verschieben"
                        )
                        self.results.append(issue)
    
    def scan_vulnerabilities(self, file_path: str, lines: List[str]):
        """
        🚨 Scanne nach bekannten Vulnerabilities
        """
        vulnerability_patterns = [
            # SQL Injection
            (r"execute\s*\(\s*[\"'].*\+.*[\"']", "SQL Injection Risk"),
            (r"query\s*\(\s*[\"'].*\+.*[\"']", "SQL Injection Risk"),
            
            # XSS
            (r"innerHTML\s*=\s*.*\+", "XSS Risk"),
            (r"document\.write\s*\(\s*.*\+", "XSS Risk"),
            
            # Command Injection
            (r"os\.system\s*\(\s*.*\+", "Command Injection Risk"),
            (r"subprocess\.call\s*\(\s*.*\+", "Command Injection Risk"),
            
            # Hardcoded Credentials
            (r"password\s*=\s*[\"'][^\"']{8,}[\"']", "Hardcoded Password"),
            (r"api_key\s*=\s*[\"'][^\"']{8,}[\"']", "Hardcoded API Key"),
            
            # Weak Crypto
            (r"md5\s*\(", "Weak Hash Function (MD5)"),
            (r"sha1\s*\(", "Weak Hash Function (SHA1)"),
            
            # Debug Code
            (r"console\.log\s*\(", "Debug Code in Production"),
            (r"print\s*\(", "Debug Code in Production"),
            (r"debugger;", "Debug Statement"),
        ]
        
        for line_num, line in enumerate(lines, 1):
            for pattern, message in vulnerability_patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    severity = "high" if "Injection" in message else "medium"
                    
                    issue = SecurityIssue(
                        file=file_path,
                        line=line_num,
                        column=1,
                        severity=severity,
                        type="vulnerability",
                        message=message,
                        description=f"Potentielle Sicherheitslücke gefunden: {message}",
                        recommendation="Code überprüfen und sichere Alternative verwenden"
                    )
                    self.results.append(issue)
    
    def scan_code_quality(self, file_path: str, lines: List[str]):
        """
        📊 Scanne Code-Qualität
        """
        quality_patterns = [
            # Unused Imports
            (r"import\s+[^#\n]+", "Unused Import"),
            
            # Dead Code
            (r"if\s+False:", "Dead Code"),
            (r"if\s+0:", "Dead Code"),
            
            # Magic Numbers
            (r"\b\d{4,}\b", "Magic Number"),
            
            # Long Functions
            (r"def\s+\w+\s*\([^)]*\):", "Long Function"),
        ]
        
        for line_num, line in enumerate(lines, 1):
            for pattern, message in quality_patterns:
                if re.search(pattern, line):
                    issue = SecurityIssue(
                        file=file_path,
                        line=line_num,
                        column=1,
                        severity="low",
                        type="code_quality",
                        message=message,
                        description=f"Code-Qualitätsproblem: {message}",
                        recommendation="Code refactoren und verbessern"
                    )
                    self.results.append(issue)
    
    def scan_dependencies(self):
        """
        📦 Scanne Dependencies
        """
        try:
            # Python Dependencies
            if os.path.exists('requirements.txt'):
                self.scan_python_dependencies()
            
            # Node.js Dependencies
            if os.path.exists('package.json'):
                self.scan_node_dependencies()
                
        except Exception as error:
            self.logger.warning(f"⚠️ Fehler beim Dependency-Scan: {error}")
    
    def scan_python_dependencies(self):
        """
        🐍 Scanne Python Dependencies
        """
        try:
            with open('requirements.txt', 'r') as f:
                requirements = f.read().split('\n')
            
            for requirement in requirements:
                if requirement.strip() and not requirement.startswith('#'):
                    package = requirement.split('==')[0].split('>=')[0].split('<=')[0]
                    self.check_package_vulnerability(package)
                    
        except Exception as error:
            self.logger.warning(f"⚠️ Fehler beim Python Dependency-Scan: {error}")
    
    def scan_node_dependencies(self):
        """
        🟢 Scanne Node.js Dependencies
        """
        try:
            with open('package.json', 'r') as f:
                package_data = json.load(f)
            
            dependencies = package_data.get('dependencies', {})
            dev_dependencies = package_data.get('devDependencies', {})
            
            all_deps = {**dependencies, **dev_dependencies}
            
            for package, version in all_deps.items():
                self.check_package_vulnerability(package, 'npm')
                
        except Exception as error:
            self.logger.warning(f"⚠️ Fehler beim Node.js Dependency-Scan: {error}")
    
    def check_package_vulnerability(self, package: str, package_manager: str = 'pip'):
        """
        🔍 Prüfe Package auf Vulnerabilities
        """
        try:
            # Hier würde die echte CVE-Datenbank-Abfrage stattfinden
            # Für Demo-Zwecke simulieren wir einige bekannte Vulnerabilities
            
            known_vulnerabilities = {
                'requests': ['CVE-2021-33503'],
                'urllib3': ['CVE-2021-33503'],
                'lodash': ['CVE-2021-23337'],
                'moment': ['CVE-2020-7720'],
            }
            
            if package.lower() in known_vulnerabilities:
                for cve_id in known_vulnerabilities[package.lower()]:
                    issue = SecurityIssue(
                        file=f"{package_manager}_dependencies",
                        line=1,
                        column=1,
                        severity="high",
                        type="cve",
                        message=f"Vulnerable Package: {package}",
                        cve_id=cve_id,
                        description=f"Package {package} hat bekannte Vulnerabilities",
                        recommendation=f"Package {package} auf neueste Version aktualisieren",
                        fixed_in="latest"
                    )
                    self.results.append(issue)
                    
        except Exception as error:
            self.logger.debug(f"Fehler beim Prüfen von Package {package}: {error}")
    
    def scan_cves(self):
        """
        🚨 Scanne nach CVEs
        """
        # Hier würde die echte CVE-Datenbank-Abfrage stattfinden
        # Für Demo-Zwecke simulieren wir einige CVEs
        
        simulated_cves = [
            {
                "cve_id": "CVE-2024-0001",
                "severity": "critical",
                "description": "Simulierte kritische Vulnerability",
                "affected_packages": ["requests", "urllib3"]
            }
        ]
        
        for cve in simulated_cves:
            issue = SecurityIssue(
                file="cve_scan",
                line=1,
                column=1,
                severity=cve["severity"],
                type="cve",
                message=f"CVE gefunden: {cve['cve_id']}",
                cve_id=cve["cve_id"],
                description=cve["description"],
                recommendation="Betroffene Packages aktualisieren"
            )
            self.results.append(issue)
    
    def is_real_secret(self, match: str) -> bool:
        """
        🔍 Prüfe ob es sich um einen echten Secret handelt
        """
        # Einfache Heuristik - in der Praxis würde hier eine komplexere Logik stehen
        secret_indicators = [
            'sk_', 'pk_', 'AKIA', 'ghp_', 'gho_', 'ghu_', 'ghs_', 'ghr_',
            'AIza', 'ya29.', '1//', '4/0A', 'AIzaSy'
        ]
        
        return any(indicator in match for indicator in secret_indicators)
    
    def generate_result(self) -> SecurityAuditResult:
        """
        📊 Generiere Security-Audit-Ergebnis
        """
        critical_issues = len([i for i in self.results if i.severity == "critical"])
        high_issues = len([i for i in self.results if i.severity == "high"])
        medium_issues = len([i for i in self.results if i.severity == "medium"])
        low_issues = len([i for i in self.results if i.severity == "low"])
        
        total_issues = len(self.results)
        
        # Bestimme ob Audit bestanden wurde
        passed = critical_issues == 0 and high_issues <= 5
        
        summary = {
            "total_files_scanned": len(set(i.file for i in self.results)),
            "secrets_found": len([i for i in self.results if i.type == "secret"]),
            "vulnerabilities_found": len([i for i in self.results if i.type == "vulnerability"]),
            "cves_found": len([i for i in self.results if i.type == "cve"]),
            "dependencies_scanned": True,
            "recommendations": self.generate_recommendations()
        }
        
        return SecurityAuditResult(
            timestamp=datetime.now().isoformat(),
            total_issues=total_issues,
            critical_issues=critical_issues,
            high_issues=high_issues,
            medium_issues=medium_issues,
            low_issues=low_issues,
            issues=self.results,
            summary=summary,
            passed=passed
        )
    
    def generate_recommendations(self) -> List[str]:
        """
        💡 Generiere Empfehlungen
        """
        recommendations = []
        
        critical_count = len([i for i in self.results if i.severity == "critical"])
        high_count = len([i for i in self.results if i.severity == "high"])
        secret_count = len([i for i in self.results if i.type == "secret"])
        cve_count = len([i for i in self.results if i.type == "cve"])
        
        if critical_count > 0:
            recommendations.append("Kritische Security-Issues sofort beheben")
        
        if high_count > 5:
            recommendations.append("Security-Review durchführen")
        
        if secret_count > 0:
            recommendations.append("Secrets in sichere Speicherorte verschieben")
        
        if cve_count > 0:
            recommendations.append("Betroffene Dependencies aktualisieren")
        
        if len(self.results) > 20:
            recommendations.append("Automatische Security-Scans implementieren")
        
        return recommendations
    
    def save_report(self, result: SecurityAuditResult):
        """
        💾 Speichere Security-Report
        """
        try:
            # Erstelle Reports-Verzeichnis
            os.makedirs('reports', exist_ok=True)
            
            # Konvertiere zu Dict für JSON-Serialisierung
            report_data = {
                "timestamp": result.timestamp,
                "total_issues": result.total_issues,
                "critical_issues": result.critical_issues,
                "high_issues": result.high_issues,
                "medium_issues": result.medium_issues,
                "low_issues": result.low_issues,
                "passed": result.passed,
                "summary": result.summary,
                "issues": [
                    {
                        "file": i.file,
                        "line": i.line,
                        "column": i.column,
                        "severity": i.severity,
                        "type": i.type,
                        "message": i.message,
                        "cve_id": i.cve_id,
                        "description": i.description,
                        "recommendation": i.recommendation,
                        "fixed_in": i.fixed_in
                    }
                    for i in result.issues
                ]
            }
            
            # Speichere JSON-Report
            report_path = f"reports/security-audit-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
            with open(report_path, 'w') as f:
                json.dump(report_data, f, indent=2)
            
            self.logger.info(f"📊 Security-Report gespeichert: {report_path}")
            
            # Console-Output
            self.print_summary(result)
            
        except Exception as error:
            self.logger.error(f"❌ Fehler beim Speichern des Reports: {error}")
    
    def print_summary(self, result: SecurityAuditResult):
        """
        📊 Drucke Zusammenfassung
        """
        print("\n" + "="*60)
        print("🛡️ SECURITY-AUDIT-REPORT")
        print("="*60)
        print(f"📅 Timestamp: {result.timestamp}")
        print(f"📊 Status: {'✅ BESTANDEN' if result.passed else '❌ NICHT BESTANDEN'}")
        print(f"📈 Issues: {result.total_issues} (🔴 {result.critical_issues} kritisch, 🟠 {result.high_issues} hoch)")
        print(f"📋 Zusammenfassung: {result.summary}")
        print("="*60)
        
        if result.issues:
            print("\n🚨 GEFUNDENE ISSUES:")
            for issue in result.issues[:10]:  # Zeige nur die ersten 10
                severity_icon = {"critical": "🔴", "high": "🟠", "medium": "🟡", "low": "🟢"}[issue.severity]
                print(f"{severity_icon} {issue.file}:{issue.line} - {issue.message}")
            
            if len(result.issues) > 10:
                print(f"... und {len(result.issues) - 10} weitere Issues")
        
        if result.summary.get("recommendations"):
            print("\n💡 EMPFEHLUNGEN:")
            for rec in result.summary["recommendations"]:
                print(f"• {rec}")
        
        print("="*60)

# 📦 Haupt-Ausführung
if __name__ == "__main__":
    try:
        # Lade Konfiguration aus Umgebungsvariablen
        config = SecurityConfig()
        
        # Erstelle und starte Security-Audit-Agent
        agent = SecurityAuditAgent(config)
        result = agent.run()
        
        # Exit-Code basierend auf Ergebnis
        sys.exit(0 if result.passed else 1)
        
    except Exception as error:
        print(f"❌ Security-Audit-Agent fehlgeschlagen: {error}")
        sys.exit(1) 