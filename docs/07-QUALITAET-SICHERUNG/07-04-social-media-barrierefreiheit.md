# Social Media Barrierefreiheit-Checkliste

## 📋 Übersicht

Diese Checkliste unterstützt dich bei der barrierefreien und professionellen Gestaltung von Social-Media-Posts für Instagram, Facebook, LinkedIn und Threads.

**🎯 Ziel:** Mit den kleinen Verbesserungen wird es ein perfektes, professionelles Design-System.

## ✅ 1. Bildgestaltung (Grafik, Foto, Video)

### Kontrast und Lesbarkeit

- [ ] Kontrastreiches Design (Text/Bild)
- [ ] Großzügige Schriftgröße (mind. 16 px, optimal 18–20 px)
- [ ] Serifenlose, gut lesbare Schriftart (z.B. Inter, Arial, Helvetica)
- [ ] Keine rein farblichen Hervorhebungen (z.B. Rot allein = nicht barrierefrei)

### Layout und Struktur

- [ ] Keine Textüberfrachtung auf Bildern
- [ ] Einbindung von Icons oder Emojis nur ergänzend, nicht ersetzend
- [ ] Keine GIFs oder flackernden Effekte (Epilepsierisiko)
- [ ] Sinnvolle Layoutstruktur mit logischem Lesefluss

### Responsive Design

- [ ] Quadratische Posts auf Mobilgeräten testen
- [ ] Plattformvorgaben einhalten (z.B. 1080×1080 px bei Instagram)
- [ ] Touch-Targets ausreichend groß
- [ ] Zoom-Funktionalität berücksichtigen

## ✅ 2. Textgestaltung (Begleittext / Caption)

### Sprache und Gliederung

- [ ] Einfache Sprache mit klarer Gliederung
- [ ] Keine Großbuchstaben als Stilmittel (z.B. NICHT SO!)
- [ ] Absätze, Emojis und Aufzählungen sparsam einsetzen
- [ ] #Hashtags mit Großbuchstaben strukturieren (z.B. #DigitalInklusiv statt #digitalinklusiv)

### Barrierefreie Kommunikation

- [ ] Keine Emoji-Listen ohne Text (z.B. ✅🌟🔥 = unverständlich für Screenreader)
- [ ] Wichtige Informationen nicht nur in Emojis
- [ ] Klare und eindeutige Sprache
- [ ] Abkürzungen vermeiden oder erklären

### Hashtag-Strategie

- [ ] Hashtags mit Großbuchstaben für bessere Lesbarkeit
- [ ] Nicht zu viele Hashtags verwenden (max. 5-7)
- [ ] Relevante und beschreibende Hashtags
- [ ] Barrierefreie Hashtag-Namen

## ✅ 3. Barrierefreiheit

### Alternativtexte und Beschreibungen

- [ ] Alternativtext (ALT) für jedes Bild/Grafik (z.B. "Logo Lopez IT Welt – Digital. Global. Sicher.")
- [ ] Untertitel bei Videos verpflichtend (automatisch oder eingebettet)
- [ ] Keine Informationen ausschließlich im Bild – wichtige Infos immer auch im Text
- [ ] Konformität mit BITV/WCAG 2.1 – mind. AA-Niveau

### Screenreader-Kompatibilität

- [ ] Sprache klar und eindeutig benennen, v.a. bei fremdsprachigen Zitaten o. Fachbegriffen
- [ ] Semantische Struktur in Texten
- [ ] Keine rein visuellen Informationen
- [ ] Logische Lesereihenfolge

### Farben und Kontraste

- [ ] Ausreichende Farbkontraste (mind. 4.5:1)
- [ ] Keine rein farbbasierte Unterscheidung
- [ ] Barrierefreie Farbkombinationen
- [ ] Test mit Graustufen-Filter

## ✅ 4. Struktur & Meta

### Corporate Identity

- [ ] Einheitlicher Aufbau nach CI-Vorgaben (Header, Farben, Abstände)
- [ ] Corporate-Design-Farben auf Kontrast prüfen (mit WebAIM / Contrast Checker)
- [ ] Konsistente Markenführung
- [ ] Einheitliche Bildsprache

### Plattform-Optimierung

- [ ] Responsives Design beachten – auch quadratische Posts auf Mobilgeräten testen
- [ ] Plattformvorgaben einhalten (z.B. 1080×1080 px bei Instagram)
- [ ] Optimale Bildgrößen für jede Plattform
- [ ] Cross-Platform-Konsistenz

### Meta-Informationen

- [ ] Beschreibende Captions für alle Posts
- [ ] Relevante Hashtags für bessere Auffindbarkeit
- [ ] Geotagging nur bei Relevanz
- [ ] Personen-Tagging nur mit Einverständnis

## ✅ 5. Qualitätssicherung

### Pre-Post-Check

- [ ] Barrierefreiheit vor Veröffentlichung prüfen
- [ ] Kontrast-Test durchgeführt
- [ ] Screenreader-Test (wenn möglich)
- [ ] Mobile-Ansicht getestet

### Feedback und Optimierung

- [ ] User-Feedback sammeln
- [ ] Engagement-Metriken analysieren
- [ ] Barrierefreiheits-Feedback berücksichtigen
- [ ] Kontinuierliche Verbesserung

### Dokumentation

- [ ] Best Practices dokumentiert
- [ ] Erfolgreiche Posts als Vorlagen
- [ ] Lessons Learned sammeln
- [ ] Team-Schulung für Barrierefreiheit

## 📊 Review-Status

### Checkliste ausfüllen:

- [ ] Alle Punkte durchgegangen
- [ ] Probleme dokumentiert
- [ ] Verbesserungen implementiert
- [ ] Final Review abgeschlossen

### Review-Datum: **\*\***\_\_\_**\*\***

### Reviewer: **\*\*\*\***\_**\*\*\*\***

### Status: ⚠️ In Bearbeitung / ✅ Abgeschlossen / ❌ Probleme gefunden

---

## 🔧 Automatisierte Checks

### Pre-commit Hooks

```bash
# Social Media Qualität
npm run lint:social

# Accessibility-Test
npm run test:a11y

# Kontrast-Check
npm run contrast:check
```

### CI/CD Pipeline

```yaml
# Social Media Quality Check
- name: Social Media Quality
  run: |
    npm run lint:social
    npm run test:a11y
    npm run contrast:check
```

---

## 📝 Notizen

### Gefundene Probleme:

-

### Implementierte Verbesserungen:

-

### Nächste Schritte:

- ***
