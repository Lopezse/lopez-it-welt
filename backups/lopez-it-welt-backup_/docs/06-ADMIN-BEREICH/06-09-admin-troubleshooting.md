# 🔧 Admin-Troubleshooting-Guide - Lopez IT Welt

**Version:** 1.0  
**Datum:** 2025-07-05  
**Status:** 🚧 IN ENTWICKLUNG  
**Autor:** Lopez IT Welt Team

## 📋 **ÜBERSICHT**

Der **Admin-Troubleshooting-Guide** bietet systematische Lösungsansätze für häufige Probleme im Lopez IT Welt System. Er hilft Administratoren bei der schnellen Diagnose und Behebung von System-Problemen.

## 🎯 **TROUBLESHOOTING-METHODIK**

### **Systematischer Ansatz**

```typescript
// Troubleshooting-Prozess
interface TroubleshootingProcess {
  // 1. Problem identifizieren
  identification: {
    symptoms: string[];
    affectedComponents: string[];
    impact: 'low' | 'medium' | 'high' | 'critical';
    userReports: string[];
  };

  // 2. Daten sammeln
  dataCollection: {
    logs: LogEntry[];
    metrics: SystemMetrics;
    errorMessages: string[];
    systemStatus: SystemStatus;
  };

  // 3. Ursache analysieren
  analysis: {
    rootCause: string;
    contributingFactors: string[];
    timeline: EventTimeline[];
    patterns: Pattern[];
  };

  // 4. Lösung implementieren
  solution: {
    steps: TroubleshootingStep[];
    rollbackPlan: RollbackPlan;
    verification: VerificationStep[];
  };

  // 5. Dokumentation
  documentation: {
    issueDescription: string;
    solution: string;
    prevention: string[];
    lessonsLearned: string[];
  };
}
```

## 🔍 **HÄUFIGE PROBLEME**

## 🚨 **VERBINDUNGSPROBLEME**

### **"Connection failed" - Fehler beheben**

#### **Symptome:**

- Verbindungsfehler beim Login
- Timeout-Fehler bei API-Anfragen
- Netzwerk-Unerreichbarkeit

#### **Diagnose-Schritte:**

**1. Internet-Verbindung prüfen**

```bash
# Internet-Verbindung testen
ping 8.8.8.8

# DNS-Auflösung testen
nslookup lopez-it-welt.de

# Router-Status prüfen
traceroute lopez-it-welt.de
```

**2. VPN-Verbindung prüfen**

```bash
# VPN-Status anzeigen
systemctl status openvpn

# VPN-Verbindung testen
ping vpn-gateway.lopez-it-welt.de

# VPN-Logs prüfen
tail -f /var/log/openvpn.log
```

**3. Firewall-Einstellungen prüfen**

```bash
# Firewall-Status anzeigen
sudo ufw status

# Firewall-Regeln prüfen
sudo iptables -L

# Port-Verfügbarkeit testen
telnet lopez-it-welt.de 443
```

#### **Lösungsansätze:**

**1. Internet-Verbindung wiederherstellen**

```bash
# Netzwerk-Interface neu starten
sudo systemctl restart networking

# DHCP-Lease erneuern
sudo dhclient -r
sudo dhclient

# DNS-Cache leeren
sudo systemctl restart systemd-resolved
```

**2. VPN-Verbindung wiederherstellen**

```bash
# VPN-Service neu starten
sudo systemctl restart openvpn

# VPN-Konfiguration prüfen
sudo openvpn --config /etc/openvpn/client.conf --test-crypto

# VPN-Verbindung manuell aufbauen
sudo openvpn --config /etc/openvpn/client.conf
```

**3. Proxy-Einstellungen prüfen**

```bash
# Proxy-Umgebungsvariablen prüfen
echo $http_proxy
echo $https_proxy

# Proxy-Einstellungen zurücksetzen
unset http_proxy
unset https_proxy
```

## 🔐 **AUTHENTIFIZIERUNGSPROBLEME**

### **Login-Probleme beheben**

#### **Symptome:**

- "Invalid credentials" Fehler
- Session-Timeout
- Zwei-Faktor-Authentifizierung fehlgeschlagen

#### **Diagnose-Schritte:**

**1. Benutzer-Credentials prüfen**

```bash
# Datenbank-Verbindung testen
mysql -u admin -p -h db.lopez-it-welt.de

# Benutzer-Status prüfen
SELECT id, email, is_active, last_login_at
FROM users
WHERE email = 'admin@lopez-it-welt.de';
```

**2. Session-Management prüfen**

```bash
# Redis-Verbindung testen
redis-cli -h redis.lopez-it-welt.de ping

# Session-Daten prüfen
redis-cli -h redis.lopez-it-welt.de KEYS "session:*"
```

**3. JWT-Token validieren**

```bash
# Token-Dekodierung
echo "YOUR_JWT_TOKEN" | base64 -d

# Token-Expiration prüfen
jwt decode YOUR_JWT_TOKEN
```

#### **Lösungsansätze:**

**1. Passwort zurücksetzen**

```sql
-- Admin-Passwort zurücksetzen
UPDATE users
SET password_hash = 'new_hashed_password'
WHERE email = 'admin@lopez-it-welt.de';
```

**2. Session-Cache leeren**

```bash
# Redis-Cache leeren
redis-cli -h redis.lopez-it-welt.de FLUSHALL

# Session-Cookies löschen
rm -rf ~/.lopez-it-welt/sessions/*
```

**3. Zwei-Faktor-Authentifizierung umgehen**

```sql
-- 2FA temporär deaktivieren
UPDATE users
SET two_factor_enabled = false
WHERE email = 'admin@lopez-it-welt.de';
```

## 🗄️ **DATENBANK-PROBLEME**

### **MySQL-Verbindungsprobleme**

#### **Symptome:**

- "Database connection failed"
- Langsame Datenbankabfragen
- Connection pool exhausted

#### **Diagnose-Schritte:**

**1. Datenbank-Verbindung testen**

```bash
# MySQL-Status prüfen
sudo systemctl status mysql

# Verbindung testen
mysql -u root -p -e "SELECT 1;"

# Connection pool prüfen
mysql -u root -p -e "SHOW PROCESSLIST;"
```

**2. Datenbank-Performance prüfen**

```bash
# Langsame Queries identifizieren
mysql -u root -p -e "
SELECT query, COUNT(*) as count, AVG(duration) as avg_duration
FROM mysql.slow_log
WHERE start_time > DATE_SUB(NOW(), INTERVAL 1 HOUR)
GROUP BY query
ORDER BY avg_duration DESC
LIMIT 10;
"
```

**3. Datenbank-Logs prüfen**

```bash
# MySQL-Error-Log
sudo tail -f /var/log/mysql/error.log

# MySQL-Slow-Log
sudo tail -f /var/log/mysql/slow.log
```

#### **Lösungsansätze:**

**1. MySQL-Service neu starten**

```bash
# MySQL sicher stoppen
sudo mysqladmin shutdown

# MySQL starten
sudo systemctl start mysql

# MySQL-Status prüfen
sudo systemctl status mysql
```

**2. Connection pool optimieren**

```sql
-- Connection pool Einstellungen
SET GLOBAL max_connections = 200;
SET GLOBAL wait_timeout = 600;
SET GLOBAL interactive_timeout = 600;
```

**3. Datenbank-Performance optimieren**

```sql
-- Query-Cache aktivieren
SET GLOBAL query_cache_type = 1;
SET GLOBAL query_cache_size = 256M;

-- InnoDB-Buffer optimieren
SET GLOBAL innodb_buffer_pool_size = 4G;
```

### **Redis-Verbindungsprobleme**

#### **Symptome:**

- "Redis connection failed"
- Cache-Misses
- Session-Verlust

#### **Diagnose-Schritte:**

**1. Redis-Verbindung testen**

```bash
# Redis-Status prüfen
sudo systemctl status redis-server

# Redis-Verbindung testen
redis-cli ping

# Redis-Memory prüfen
redis-cli info memory
```

**2. Redis-Performance prüfen**

```bash
# Redis-Statistiken
redis-cli info stats

# Redis-Keys prüfen
redis-cli KEYS "*"

# Redis-Memory-Usage
redis-cli info memory
```

#### **Lösungsansätze:**

**1. Redis-Service neu starten**

```bash
# Redis stoppen
sudo systemctl stop redis-server

# Redis starten
sudo systemctl start redis-server

# Redis-Status prüfen
sudo systemctl status redis-server
```

**2. Redis-Memory optimieren**

```bash
# Redis-Memory-Limit setzen
redis-cli CONFIG SET maxmemory 512mb

# Redis-Eviction-Policy setzen
redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

## 🌐 **API-PROBLEME**

### **API-Verbindungsprobleme**

#### **Symptome:**

- "API endpoint not found"
- "Internal server error"
- "Gateway timeout"

#### **Diagnose-Schritte:**

**1. API-Endpunkt testen**

```bash
# API-Health-Check
curl -X GET https://api.lopez-it-welt.de/v1/health

# API-Status prüfen
curl -X GET https://api.lopez-it-welt.de/v1/status

# API-Version prüfen
curl -X GET https://api.lopez-it-welt.de/v1/version
```

**2. API-Logs prüfen**

```bash
# Application-Logs
sudo tail -f /var/log/lopez-it-welt/application.log

# Error-Logs
sudo tail -f /var/log/lopez-it-welt/error.log

# Access-Logs
sudo tail -f /var/log/nginx/access.log
```

**3. API-Performance testen**

```bash
# API-Response-Time testen
curl -w "@curl-format.txt" -o /dev/null -s https://api.lopez-it-welt.de/v1/health

# API-Load-Test
ab -n 1000 -c 10 https://api.lopez-it-welt.de/v1/health
```

#### **Lösungsansätze:**

**1. API-Service neu starten**

```bash
# Application-Service neu starten
sudo systemctl restart lopez-it-welt

# Nginx neu starten
sudo systemctl restart nginx

# PM2-Prozesse neu starten
pm2 restart all
```

**2. API-Cache leeren**

```bash
# Application-Cache leeren
sudo rm -rf /var/cache/lopez-it-welt/*

# Nginx-Cache leeren
sudo rm -rf /var/cache/nginx/*

# Redis-Cache leeren
redis-cli FLUSHALL
```

## 🔒 **SICHERHEITSPROBLEME**

### **SSL/TLS-Probleme**

#### **Symptome:**

- "SSL certificate error"
- "Connection not secure"
- "Certificate expired"

#### **Diagnose-Schritte:**

**1. SSL-Zertifikat prüfen**

```bash
# Zertifikat-Validität prüfen
openssl s_client -connect lopez-it-welt.de:443 -servername lopez-it-welt.de

# Zertifikat-Details anzeigen
openssl x509 -in /etc/ssl/certs/lopez-it-welt.crt -text -noout

# Zertifikat-Expiration prüfen
openssl x509 -in /etc/ssl/certs/lopez-it-welt.crt -noout -dates
```

**2. SSL-Konfiguration prüfen**

```bash
# Nginx-SSL-Konfiguration prüfen
sudo nginx -t

# SSL-Konfiguration testen
sslscan lopez-it-welt.de
```

#### **Lösungsansätze:**

**1. SSL-Zertifikat erneuern**

```bash
# Let's Encrypt-Zertifikat erneuern
sudo certbot renew

# Zertifikat-Status prüfen
sudo certbot certificates
```

**2. SSL-Konfiguration optimieren**

```nginx
# Nginx-SSL-Konfiguration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
ssl_prefer_server_ciphers off;
```

### **Firewall-Probleme**

#### **Symptome:**

- "Connection refused"
- "Port blocked"
- "Access denied"

#### **Diagnose-Schritte:**

**1. Firewall-Status prüfen**

```bash
# UFW-Status
sudo ufw status

# iptables-Regeln
sudo iptables -L

# Port-Verfügbarkeit testen
netstat -tulpn | grep :80
netstat -tulpn | grep :443
```

**2. Port-Verfügbarkeit testen**

```bash
# Port 80 testen
telnet lopez-it-welt.de 80

# Port 443 testen
telnet lopez-it-welt.de 443

# Port 3000 testen (API)
telnet lopez-it-welt.de 3000
```

#### **Lösungsansätze:**

**1. Firewall-Regeln anpassen**

```bash
# HTTP-Port freigeben
sudo ufw allow 80/tcp

# HTTPS-Port freigeben
sudo ufw allow 443/tcp

# API-Port freigeben
sudo ufw allow 3000/tcp
```

**2. Firewall zurücksetzen**

```bash
# UFW zurücksetzen
sudo ufw --force reset

# UFW aktivieren
sudo ufw enable

# Standard-Regeln setzen
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## 📊 **PERFORMANCE-PROBLEME**

### **Langsame Antwortzeiten**

#### **Symptome:**

- "Request timeout"
- "Slow response"
- "High latency"

#### **Diagnose-Schritte:**

**1. System-Ressourcen prüfen**

```bash
# CPU-Auslastung
top -bn1 | grep "Cpu(s)"

# Memory-Auslastung
free -h

# Disk-Auslastung
df -h

# Network-Statistiken
netstat -i
```

**2. Application-Performance prüfen**

```bash
# Node.js-Prozesse
ps aux | grep node

# PM2-Status
pm2 status

# Application-Logs
tail -f /var/log/lopez-it-welt/application.log
```

#### **Lösungsansätze:**

**1. System-Ressourcen optimieren**

```bash
# Memory-Swap aktivieren
sudo swapon -a

# CPU-Limits anpassen
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

**2. Application-Optimierung**

```bash
# PM2-Cluster-Modus
pm2 start ecosystem.config.js --env production

# Node.js-Memory-Limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Application-Restart
pm2 restart all
```

## 🔍 **LOGGING-PROBLEME**

### **Log-Dateien nicht verfügbar**

#### **Symptome:**

- "Log file not found"
- "Permission denied"
- "Disk space full"

#### **Diagnose-Schritte:**

**1. Log-Verzeichnis prüfen**

```bash
# Log-Verzeichnis-Existenz
ls -la /var/log/lopez-it-welt/

# Log-Datei-Berechtigungen
ls -la /var/log/lopez-it-welt/*.log

# Disk-Space prüfen
df -h /var/log
```

**2. Log-Rotation prüfen**

```bash
# Logrotate-Konfiguration
cat /etc/logrotate.d/lopez-it-welt

# Logrotate-Status
sudo logrotate -d /etc/logrotate.d/lopez-it-welt
```

#### **Lösungsansätze:**

**1. Log-Berechtigungen korrigieren**

```bash
# Log-Verzeichnis erstellen
sudo mkdir -p /var/log/lopez-it-welt

# Berechtigungen setzen
sudo chown -R lopez-it-welt:lopez-it-welt /var/log/lopez-it-welt
sudo chmod -R 755 /var/log/lopez-it-welt
```

**2. Log-Rotation konfigurieren**

```bash
# Logrotate-Konfiguration erstellen
sudo tee /etc/logrotate.d/lopez-it-welt << EOF
/var/log/lopez-it-welt/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 lopez-it-welt lopez-it-welt
    postrotate
        systemctl reload lopez-it-welt
    endscript
}
EOF
```

## 🚨 **NOTFALL-PROZEDUREN**

### **System-Notfall-Wiederherstellung**

#### **Kritische System-Probleme:**

**1. System komplett neu starten**

```bash
# Graceful Shutdown
sudo systemctl stop lopez-it-welt
sudo systemctl stop nginx
sudo systemctl stop mysql
sudo systemctl stop redis-server

# System neu starten
sudo reboot

# Services nach Reboot starten
sudo systemctl start mysql
sudo systemctl start redis-server
sudo systemctl start lopez-it-welt
sudo systemctl start nginx
```

**2. Datenbank-Wiederherstellung**

```bash
# Datenbank-Backup wiederherstellen
mysql -u root -p lopez_it_welt < backup_2025-07-05.sql

# Datenbank-Integrität prüfen
mysqlcheck -u root -p --all-databases

# Datenbank-Optimierung
mysql -u root -p -e "OPTIMIZE TABLE users, ai_agents, chat_sessions;"
```

**3. Application-Wiederherstellung**

```bash
# Application-Reset
sudo rm -rf /var/cache/lopez-it-welt/*
sudo rm -rf /tmp/lopez-it-welt/*

# Dependencies neu installieren
npm ci --production

# Application neu starten
pm2 delete all
pm2 start ecosystem.config.js --env production
```

### **Kontakt-Informationen**

**Notfall-Kontakte:**

- **System-Admin:** +49 123 456789
- **DevOps-Team:** devops@lopez-it-welt.de
- **Security-Team:** security@lopez-it-welt.de
- **24/7 Support:** support@lopez-it-welt.de

**Escalation-Prozess:**

1. **Level 1:** System-Admin (30 Min.)
2. **Level 2:** DevOps-Team (1 Stunde)
3. **Level 3:** Security-Team (2 Stunden)
4. **Level 4:** Management (4 Stunden)

---

**Letzte Aktualisierung:** 2025-07-05  
**Nächste Überprüfung:** 2025-07-06
