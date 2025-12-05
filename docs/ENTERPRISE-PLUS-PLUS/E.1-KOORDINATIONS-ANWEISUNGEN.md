# 🎯 Koordinations-Anweisungen für Agent B und Agent C

**Version:** 1.0  
**Stand:** 29.11.2025  
**Status:** ✅ **AKTIV**

---

## ⚠️ WICHTIG: Kommunikations-Regeln

**Du (Benutzer) kommunizierst NUR mit Agent A.**

**Agent B und Agent C kommunizieren NUR mit Agent A, NICHT mit dir!**

---

## 📋 ANWEISUNGEN FÜR AGENT B (BUILDER)

### **Nach Implementierung:**

**Agent B meldet Completion NUR an Agent A:**

```
"Agent A, E.1.X implementiert, bereit für Review durch Agent C."
```

**Agent B kommuniziert NICHT direkt mit dem Benutzer!**

**Agent B wartet auf Anweisung von Agent A für nächste Schritte.**

---

## 📋 ANWEISUNGEN FÜR AGENT C (REVIEWER)

### **Nach Review:**

**Agent C meldet Ergebnis NUR an Agent A:**

```
"Agent A, Review abgeschlossen: 2025-11-29 12:23:49

Reviewer: Agent C
Status: ✅ E.1.X PRODUKTIONSREIF

Agent A kann den Status aktualisieren und E.1.Y vorbereiten."
```

**Oder bei Problemen:**

```
"Agent A, Review abgeschlossen: 2025-11-29 12:23:49

Reviewer: Agent C
Status: ⚠️ E.1.X MIT ANMERKUNGEN

Anmerkungen:
- [Liste der Anmerkungen]

Agent A koordiniert Nachbesserungen mit Agent B."
```

**Agent C kommuniziert NICHT direkt mit dem Benutzer!**

**Agent C wartet auf Anweisung von Agent A für nächste Schritte.**

---

## ✅ ERFOLGSKRITERIEN

**System funktioniert richtig, wenn:**
- ✅ Agent B meldet Completion NUR an Agent A
- ✅ Agent C meldet Review-Ergebnis NUR an Agent A
- ✅ Du (Benutzer) bekommst nur finale Meldungen von Agent A
- ✅ Keine direkte Kommunikation zwischen dir und Agent B/C

---

**Agent A (Planner & Coordinator)**  
*Koordinations-Anweisungen aktiv*



