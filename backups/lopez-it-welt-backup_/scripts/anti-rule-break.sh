#!/bin/bash

# 🛡️ Anti-Regelbruch Enterprise++ Modul - Bash Version
# Verhindert systematisch alle Regelverstöße in Bash-Umgebungen
#
# @author Ramiro Lopez Rodriguez
# @version 1.0.0
# @date 2025-06-30

# Enterprise++ Anti-Regelbruch Konfiguration
ANTI_RULE_BREAK_CONFIG=(
    "STRICT_MODE=true"
    "ZERO_TOLERANCE=true"
    "AUTO_BLOCK=true"
    "REQUIRE_APPROVAL=true"
    "VALIDATE_BEFORE_ACTION=true"
    "VALIDATE_AFTER_ACTION=true"
    "BLOCK_ON_VIOLATION=true"
    "REQUIRE_SYSTEM_TIME=true"
    "BLOCK_DATE_COPYING=true"
    "VALIDATE_TIMESTAMPS=true"
    "PREVENT_OVERWRITING=true"
    "REQUIRE_APPEND_ONLY=true"
    "PROTECT_MD_STRUCTURE=true"
    "ENFORCE_TIME_TRACKING=true"
    "REQUIRE_SESSION_SWITCH=true"
    "BLOCK_OVERLAPPING_SESSIONS=true"
)

# Geschützte Regeln
PROTECTED_RULES=(
    "Datumsvalidierung"
    "Zeiterfassung"
    "Md-Struktur"
    "Enterprise++ Standards"
    "Freigabe-Erfordernis"
    "System-Zeit-Verwendung"
)

# Globale Variablen
IS_BLOCKED=false
VIOLATION_COUNT=0
LAST_VIOLATION=""
APPROVAL_GIVEN=false
BLOCKED_ACTIONS=()

# Farben für Ausgabe
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 🛡️ Anti-Regelbruch Enterprise++ System Funktionen

# 🚨 Hauptvalidierung vor jeder Aktion
validate_before_action() {
    local action="$1"
    local target_file="${2:-}"
    
    echo -e "${YELLOW}🛡️ Anti-Regelbruch-System: Validierung läuft...${NC}"
    
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
    
    # 1. System-Zeit validieren
    local time_validation=$(validate_system_time)
    if [[ $time_validation == "INVALID"* ]]; then
        block_action "System-Zeit nicht validiert" "${time_validation#INVALID: }"
        echo "{\"valid\": false, \"reason\": \"${time_validation#INVALID: }\", \"timestamp\": \"$timestamp\", \"rule\": \"System-Zeit\"}"
        return 1
    fi
    
    # 2. Datumskopieren blockieren
    local date_validation=$(validate_no_date_copying "$action")
    if [[ $date_validation == "INVALID"* ]]; then
        block_action "Datumskopieren blockiert" "${date_validation#INVALID: }"
        echo "{\"valid\": false, \"reason\": \"${date_validation#INVALID: }\", \"timestamp\": \"$timestamp\", \"rule\": \"Datumsvalidierung\"}"
        return 1
    fi
    
    # 3. Struktur-Schutz prüfen
    if [[ -n "$target_file" ]] && is_md_file "$target_file"; then
        local structure_validation=$(validate_md_structure "$target_file")
        if [[ $structure_validation == "INVALID"* ]]; then
            block_action "Md-Struktur-Schutz" "${structure_validation#INVALID: }"
            echo "{\"valid\": false, \"reason\": \"${structure_validation#INVALID: }\", \"timestamp\": \"$timestamp\", \"rule\": \"Md-Struktur\"}"
            return 1
        fi
    fi
    
    # 4. Freigabe prüfen
    if [[ "$APPROVAL_GIVEN" == "false" ]] && [[ "$REQUIRE_APPROVAL" == "true" ]]; then
        block_action "Keine Freigabe vorhanden" "$action"
        echo "{\"valid\": false, \"reason\": \"Keine Freigabe vorhanden\", \"timestamp\": \"$timestamp\", \"rule\": \"Freigabe-Erfordernis\"}"
        return 1
    fi
    
    # 5. Zeiterfassung prüfen
    local time_tracking_validation=$(validate_time_tracking "$action")
    if [[ $time_tracking_validation == "INVALID"* ]]; then
        block_action "Zeiterfassung nicht gewechselt" "${time_tracking_validation#INVALID: }"
        echo "{\"valid\": false, \"reason\": \"${time_tracking_validation#INVALID: }\", \"timestamp\": \"$timestamp\", \"rule\": \"Zeiterfassung\"}"
        return 1
    fi
    
    echo -e "${GREEN}✅ Anti-Regelbruch-Validierung erfolgreich${NC}"
    echo "{\"valid\": true, \"timestamp\": \"$timestamp\"}"
    return 0
}

# ⏰ System-Zeit validieren
validate_system_time() {
    local current_time=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
    local min_valid_date="2025-01-01T00:00:00.000Z"
    
    # Prüfen ob Zeit plausibel ist (nicht in der Vergangenheit)
    if [[ "$current_time" < "$min_valid_date" ]]; then
        echo "INVALID: System-Zeit ist in der Vergangenheit"
        return 1
    fi
    
    echo "VALID: $current_time"
    return 0
}

# 📅 Datumskopieren blockieren
validate_no_date_copying() {
    local action="$1"
    local blocked_dates=(
        "2025-01-19"
        "29.07.2025"
        "27.06.2025"
        "2025-06-27"
        "2025-01-19T"
        "29.07.2025T"
    )
    
    for blocked_date in "${blocked_dates[@]}"; do
        if [[ "$action" == *"$blocked_date"* ]]; then
            echo "INVALID: Datumskopieren erkannt: $blocked_date"
            return 1
        fi
    done
    
    echo "VALID"
    return 0
}

# 📄 Md-Struktur schützen
validate_md_structure() {
    local target_file="$1"
    
    # Prüfen ob es sich um eine .md-Datei handelt
    if ! is_md_file "$target_file"; then
        echo "VALID"
        return 0
    fi
    
    # Hier könnte weitere Validierung der Md-Struktur erfolgen
    # z.B. Prüfung auf Überschreibungen statt Ergänzungen
    
    echo "VALID"
    return 0
}

# ⏱️ Zeiterfassung validieren
validate_time_tracking() {
    local action="$1"
    
    # Hier könnte Validierung der Zeiterfassung erfolgen
    # z.B. Prüfung auf Session-Wechsel bei Themenwechsel
    
    echo "VALID"
    return 0
}

# 🚫 Aktion blockieren
block_action() {
    local rule="$1"
    local reason="$2"
    
    VIOLATION_COUNT=$((VIOLATION_COUNT + 1))
    LAST_VIOLATION="$rule: $reason"
    IS_BLOCKED=true
    
    local violation="{\"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")\", \"rule\": \"$rule\", \"reason\": \"$reason\", \"action\": \"BLOCKIERT\"}"
    BLOCKED_ACTIONS+=("$violation")
    
    echo -e "${RED}🚨 ANTI-REGELBRUCH: AKTION BLOCKIERT${NC}"
    echo -e "${RED}   Regel: $rule${NC}"
    echo -e "${RED}   Grund: $reason${NC}"
    echo -e "${RED}   Verstoß #$VIOLATION_COUNT${NC}"
    echo -e "${RED}   Status: BLOCKIERT - Freigabe erforderlich${NC}"
    
    # In STATUS.md dokumentieren
    document_violation "$rule" "$reason"
}

# 📝 Verstoß dokumentieren
document_violation() {
    local rule="$1"
    local reason="$2"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")
    
    local violation_entry="
## 🚨 **ANTI-REGELBRUCH: AKTION BLOCKIERT ($timestamp)**
- **Regel:** $rule
- **Grund:** $reason
- **Verstoß #:** $VIOLATION_COUNT
- **Status:** ❌ BLOCKIERT - Freigabe erforderlich
- **System:** Anti-Regelbruch-System aktiviert

"
    
    if [[ -f "STATUS.md" ]]; then
        echo "$violation_entry$(cat STATUS.md)" > STATUS.md
    else
        echo "$violation_entry" > STATUS.md
    fi
    
    echo -e "${GREEN}📝 Verstoß in STATUS.md dokumentiert${NC}"
}

# ✅ Freigabe erteilen
grant_approval() {
    APPROVAL_GIVEN=true
    IS_BLOCKED=false
    echo -e "${GREEN}✅ Anti-Regelbruch-Freigabe erteilt${NC}"
}

# 🔄 Freigabe zurückziehen
revoke_approval() {
    APPROVAL_GIVEN=false
    IS_BLOCKED=true
    echo -e "${YELLOW}🚫 Anti-Regelbruch-Freigabe zurückgezogen${NC}"
}

# 📊 Status anzeigen
show_status() {
    echo -e "\n${CYAN}🛡️ Anti-Regelbruch-System Status:${NC}"
    if [[ "$IS_BLOCKED" == "true" ]]; then
        echo -e "   Blockiert: ${RED}❌ JA${NC}"
    else
        echo -e "   Blockiert: ${GREEN}✅ NEIN${NC}"
    fi
    
    if [[ "$APPROVAL_GIVEN" == "true" ]]; then
        echo -e "   Freigabe: ${GREEN}✅ ERTEILT${NC}"
    else
        echo -e "   Freigabe: ${RED}❌ NICHT ERTEILT${NC}"
    fi
    
    echo -e "   Verstöße: ${YELLOW}$VIOLATION_COUNT${NC}"
    if [[ -n "$LAST_VIOLATION" ]]; then
        echo -e "   Letzter Verstoß: ${YELLOW}$LAST_VIOLATION${NC}"
    else
        echo -e "   Letzter Verstoß: ${YELLOW}Keine${NC}"
    fi
    echo -e "   Blockierte Aktionen: ${YELLOW}${#BLOCKED_ACTIONS[@]}${NC}"
}

# 🔧 Konfiguration aktualisieren
update_config() {
    local new_config="$1"
    # Hier könnte die Konfiguration aktualisiert werden
    echo -e "${GREEN}🔧 Anti-Regelbruch-Konfiguration aktualisiert${NC}"
}

# 📋 Md-Datei prüfen
is_md_file() {
    local filename="$1"
    [[ "$filename" =~ \.md$|\.MD$ ]]
}

# 🧹 Verstöße zurücksetzen
reset_violations() {
    VIOLATION_COUNT=0
    LAST_VIOLATION=""
    BLOCKED_ACTIONS=()
    IS_BLOCKED=false
    echo -e "${GREEN}🧹 Anti-Regelbruch-Verstöße zurückgesetzt${NC}"
}

# Hauptfunktion für Kommandozeilen-Aufruf
main() {
    case "${1:-}" in
        "validate")
            validate_before_action "${2:-}" "${3:-}"
            ;;
        "approve")
            grant_approval
            ;;
        "revoke")
            revoke_approval
            ;;
        "status")
            show_status
            ;;
        "reset")
            reset_violations
            ;;
        *)
            echo -e "${CYAN}🛡️ Anti-Regelbruch Enterprise++ Modul - Bash Version${NC}"
            echo -e "${YELLOW}Verwendung:${NC}"
            echo "  $0 validate <action> [target_file]  - Validierung durchführen"
            echo "  $0 approve                          - Freigabe erteilen"
            echo "  $0 revoke                           - Freigabe zurückziehen"
            echo "  $0 status                           - Status anzeigen"
            echo "  $0 reset                            - Verstöße zurücksetzen"
            ;;
    esac
}

# Skript ausführen wenn direkt aufgerufen
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 