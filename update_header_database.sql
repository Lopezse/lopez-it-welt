-- Vollständige Header-Datenbank-Integration
-- Erstellt: 2025-09-14

USE lopez_it_welt;

-- Header-Tabelle erweitern
ALTER TABLE content_header 
ADD COLUMN logo_styling JSON,
ADD COLUMN control_elements JSON,
ADD COLUMN mobile_menu_text VARCHAR(100),
ADD COLUMN language_options JSON,
ADD COLUMN button_texts JSON,
ADD COLUMN aria_labels JSON;

-- Vollständige Header-Daten aktualisieren
UPDATE content_header SET 
  logo_text = 'Lopez IT Welt',
  logo_icon = 'LW',
  logo_styling = '{"lopez_color": "#FFD700", "it_welt_gradient": "linear-gradient(135deg, #007BFF 0%, #0056B3 100%)", "icon_size": "40px", "text_size": "22px"}',
  navigation_items = '[
    {"label": "Startseite", "link": "/", "type": "nav"},
    {"label": "Leistungen", "link": "/leistungen", "type": "nav"},
    {"label": "Projekte", "link": "/projekte", "type": "nav"},
    {"label": "Über uns", "link": "/ueber-uns", "type": "nav"},
    {"label": "Kontakt", "link": "/kontakt", "type": "nav"},
    {"label": "Webshop", "link": "/webshop", "type": "button", "style": "primary"}
  ]',
  mobile_menu_text = 'Menü',
  language_options = '[
    {"code": "de", "label": "DE", "active": true},
    {"code": "en", "label": "EN", "active": false},
    {"code": "es", "label": "ES", "active": false}
  ]',
  control_elements = '{
    "dark_mode": {"icon": "moon", "text": "Dark Mode", "aria_label": "Dark Mode umschalten"},
    "accessibility": {"icon": "accessibility", "text": "Barrierefreiheit", "aria_label": "Barrierefreiheit umschalten"},
    "login": {"text": "Anmelden", "link": "/login", "aria_label": "Zur Anmeldung"}
  }',
  button_texts = '{
    "webshop": "Webshop",
    "login": "Anmelden",
    "menu_open": "Menü öffnen",
    "menu_close": "Menü schließen"
  }',
  aria_labels = '{
    "main_nav": "Hauptnavigation",
    "mobile_nav": "Mobile Navigation",
    "logo": "Zur Startseite",
    "language_switch": "Sprache wechseln",
    "dark_mode_toggle": "Dark Mode umschalten",
    "accessibility_toggle": "Barrierefreiheit umschalten"
  }',
  language_switch = true,
  is_active = true,
  updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Testdaten anzeigen
SELECT * FROM content_header WHERE id = 1;



