<?php
// db_testdata.php – Automatisierte Testdaten-Erstellung und -Löschung
// Aufruf: ?action=insert oder ?action=delete
// Oder: php db_testdata.php insert/delete

$mysqli = new mysqli("localhost", "root", "", "lopez_it_welt_db");
if ($mysqli->connect_errno) {
    http_response_code(500);
    die(json_encode(["error" => "Datenbankverbindung fehlgeschlagen: " . $mysqli->connect_error]));
}

// Unterstützung für Kommandozeile und URL-Parameter
if (php_sapi_name() === 'cli') {
    $action = $argv[1] ?? '';
} else {
    $action = $_GET['action'] ?? '';
}

header('Content-Type: application/json');

if ($action === 'insert') {
    // Testdaten einfügen
    $queries = [
        // Users
        "INSERT INTO users (username, email, password_hash, role) VALUES
        ('admin', 'admin@lopez-team.de', 'test', 'admin'),
        ('support', 'support@lopez-team.de', 'test', 'support')",
        // Kunden
        "INSERT INTO kunden (firmenname, ansprechpartner, email, telefon, adresse) VALUES
        ('Musterfirma AG', 'Max Mustermann', 'max@musterfirma.de', '01234/56789', 'Musterstraße 1, 12345 Musterstadt')",
        // Projekte
        "INSERT INTO projekte (kunden_id, titel, status, beschreibung) VALUES
        (1, 'Website-Relaunch', 'offen', 'Neue Website für Musterfirma AG')",
        // Texte
        "INSERT INTO texte (modul, feld, sprache, inhalt) VALUES
        ('home', 'welcome', 'de', 'Willkommen auf der Lopez IT Welt!'),
        ('home', 'welcome', 'en', 'Welcome to Lopez IT World!')",
        // Produkte
        "INSERT INTO produkte (name, beschreibung, preis, lagerbestand, aktiv) VALUES
        ('IT-Service', 'IT-Support-Paket', 99.00, 10, 1)",
        // Bestellungen
        "INSERT INTO bestellungen (kunde_id, status) VALUES
        (1, 'offen')",
        // Backups
        "INSERT INTO backups (dateiname, typ) VALUES
        ('backup_2024-06-01.sql', 'db')",
        // Zugriffsprotokolle
        "INSERT INTO zugriffsprotokolle (user_id, aktion) VALUES
        (1, 'Login erfolgreich')",
        // Domains
        "INSERT INTO domains (domainname, status) VALUES
        ('lopez-it-welt.de', 'aktiv')",
        // Settings
        "INSERT INTO settings (schluessel, wert) VALUES
        ('site_name', 'Lopez IT Welt')"
    ];
    $success = true;
    foreach ($queries as $sql) {
        if (!$mysqli->query($sql)) {
            $success = false;
            echo json_encode(["error" => $mysqli->error, "query" => $sql]);
            break;
        }
    }
    if ($success) {
        echo json_encode(["success" => true, "message" => "Testdaten erfolgreich eingefügt."]);
    }
    exit;
}

if ($action === 'delete') {
    // Testdaten löschen (alle Einträge löschen)
    $tables = [
        'bestellungen', 'produkte', 'projekte', 'kunden', 'texte', 'users',
        'backups', 'zugriffsprotokolle', 'domains', 'settings'
    ];
    $success = true;
    foreach ($tables as $table) {
        if (!$mysqli->query("DELETE FROM $table")) {
            $success = false;
            echo json_encode(["error" => $mysqli->error, "table" => $table]);
            break;
        }
        // AUTO_INCREMENT zurücksetzen
        $mysqli->query("ALTER TABLE $table AUTO_INCREMENT = 1");
    }
    if ($success) {
        echo json_encode(["success" => true, "message" => "Testdaten erfolgreich gelöscht."]);
    }
    exit;
}

echo json_encode(["error" => "Ungültige Aktion. Nutze ?action=insert oder ?action=delete"]); 