# F1-KI-SKALIERUNGSPLAN

## Skalierungsplan für größere Server oder zweite Maschine

**Version:** 1.0  
**Stand:** 2025-11-29  
**Status:** 📋 **PLANUNG** (Keine Implementierung)  
**Methode:** ABC-Methode (Analyse → Bauplanung → Kontrolle)  
**Enterprise++ Standard:** IBM/SAP/Siemens-Niveau

---

## 📋 EXECUTIVE SUMMARY

Dieses Dokument definiert den **vollständigen Skalierungsplan** für die KI-Integration in Lopez IT Welt Enterprise++. Der Plan beschreibt, wie die KI-Architektur auf größere Server oder eine zweite Maschine erweitert werden kann, ohne das bestehende System zu beeinträchtigen.

**Kernprinzipien:**
- ✅ **Horizontal skalierbar:** Mehrere Server parallel
- ✅ **Vertical skalierbar:** Größere Server-Ressourcen
- ✅ **Self-Hosted:** LLaMA auf separater Maschine
- ✅ **Zero-Downtime:** Keine Ausfallzeiten bei Skalierung
- ✅ **Kostenoptimiert:** Optimale Ressourcennutzung

---

## 1. SKALIERUNGS-STRATEGIEN

### **1.1 Horizontal Scaling (mehrere Server)**

**Zweck:** Mehrere API-Server parallel betreiben

**Architektur:**
```
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                        │
│              (Nginx / HAProxy / Cloudflare)             │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  API Server 1│  │  API Server 2│  │  API Server 3│
│  (Next.js)   │  │  (Next.js)   │  │  (Next.js)   │
│              │  │              │  │              │
│  • Orchestrator│  │  • Orchestrator│  │  • Orchestrator│
│  • MediaAI    │  │  • MediaAI    │  │  • MediaAI    │
│  • Provider  │  │  • Provider  │  │  • Provider  │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   MySQL      │  │   Redis      │  │  File Storage│
│  (Shared DB) │  │  (Sessions)  │  │  (Media)     │
└──────────────┘  └──────────────┘  └──────────────┘
```

**Vorteile:**
- ✅ Hohe Verfügbarkeit (Redundanz)
- ✅ Lastverteilung
- ✅ Einfache Erweiterung (weitere Server hinzufügen)

**Nachteile:**
- ⚠️ Shared State Management erforderlich
- ⚠️ Session-Management (Redis)
- ⚠️ File Storage (Shared Storage)

**Implementierung:**
1. Load Balancer konfigurieren
2. Mehrere API-Server deployen
3. Shared Database (MySQL)
4. Shared File Storage (NFS/S3)
5. Redis für Sessions

---

### **1.2 Vertical Scaling (größere Server)**

**Zweck:** Mehr CPU/RAM/GPU auf einem Server

**Architektur:**
```
┌─────────────────────────────────────────────────────────┐
│              Single Server (Upgraded)                    │
│  ─────────────────────────────────────────────────────  │
│  • CPU: 16+ Cores                                       │
│  • RAM: 64+ GB                                          │
│  • GPU: NVIDIA RTX 4090 (optional, für LLaMA)          │
│  • Storage: NVMe SSD                                    │
│                                                          │
│  • Next.js API                                          │
│  • Orchestrator                                         │
│  • MediaAI                                              │
│  • Provider (OpenAI, Google, Azure)                    │
│  • MySQL (lokal oder remote)                            │
│  • Redis (optional, für Caching)                        │
└─────────────────────────────────────────────────────────┘
```

**Vorteile:**
- ✅ Einfache Implementierung (keine Architektur-Änderungen)
- ✅ Geringere Latenz (keine Netzwerk-Hops)
- ✅ GPU-Support für Self-Hosted LLaMA

**Nachteile:**
- ⚠️ Single Point of Failure
- ⚠️ Begrenzte Skalierbarkeit (Hardware-Limits)
- ⚠️ Höhere Kosten pro Server

**Implementierung:**
1. Server-Upgrade (CPU/RAM/GPU)
2. MySQL-Optimierung (Indizes, Query-Optimierung)
3. Redis für Caching (optional)
4. Monitoring erweitern

---

### **1.3 Hybrid Scaling (Kombination)**

**Zweck:** Beste Kombination aus Horizontal und Vertical Scaling

**Architektur:**
```
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                        │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  API Server 1│  │  API Server 2│  │  API Server 3│
│  (16 Cores)  │  │  (16 Cores)  │  │  (16 Cores)  │
│  (64 GB RAM) │  │  (64 GB RAM) │  │  (64 GB RAM) │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   MySQL      │  │   Redis       │  │  File Storage │
│  (32 Cores)  │  │  (8 GB RAM)   │  │  (S3/NFS)     │
│  (128 GB RAM)│  │               │  │               │
└──────────────┘  └──────────────┘  └──────────────┘
```

**Vorteile:**
- ✅ Beste Performance (Horizontal + Vertical)
- ✅ Hohe Verfügbarkeit
- ✅ Optimale Ressourcennutzung

**Nachteile:**
- ⚠️ Komplexere Architektur
- ⚠️ Höhere Kosten
- ⚠️ Mehr Wartung

---

## 2. SELF-HOSTED KI (LLAMA)

### **2.1 LLaMA-Server-Architektur**

**Zweck:** Self-Hosted LLaMA auf separater Maschine

**Architektur:**
```
┌─────────────────────────────────────────────────────────┐
│              Main Server (API)                          │
│  ─────────────────────────────────────────────────────  │
│  • Next.js API                                          │
│  • Orchestrator                                         │
│  • MediaAI                                              │
│  • Provider (OpenAI, Google, Azure)                    │
└─────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/WebSocket
                            │
┌─────────────────────────────────────────────────────────┐
│            LLaMA Server (GPU-Server)                    │
│  ─────────────────────────────────────────────────────  │
│  • CPU: 16+ Cores                                       │
│  • RAM: 128+ GB                                         │
│  • GPU: NVIDIA RTX 4090 / A100                          │
│  • Storage: NVMe SSD (1+ TB)                            │
│                                                          │
│  • LLaMA 2/3 Server (Ollama / vLLM)                      │
│  • Model: llama-2-7b-chat / llama-3-8b-instruct         │
│  • API: HTTP/WebSocket                                  │
└─────────────────────────────────────────────────────────┘
```

**Vorteile:**
- ✅ Vollständige Datenkontrolle
- ✅ Keine Cloud-Abhängigkeit
- ✅ DSGVO-konform (Daten bleiben intern)
- ✅ Günstiger bei hohem Volumen (>10.000 Bilder/Monat)

**Nachteile:**
- ⚠️ Initiale Setup-Kosten (GPU-Server)
- ⚠️ Wartung erforderlich
- ⚠️ Qualität möglicherweise niedriger als Cloud-Provider

**Kosten (Schätzung):**
- GPU-Server: ~$200-500/Monat (Cloud) oder ~$2000-5000 (Kauf)
- Strom: ~$50-100/Monat
- Wartung: ~$100-200/Monat
- **Gesamt: ~$350-800/Monat (Cloud) oder ~$2150-5300 (Kauf + Betrieb)**

---

### **2.2 LLaMA-Server-Setup**

**Hardware-Anforderungen:**
- CPU: 16+ Cores (AMD Ryzen 9 / Intel i9)
- RAM: 128+ GB
- GPU: NVIDIA RTX 4090 (24 GB VRAM) oder A100 (40/80 GB VRAM)
- Storage: 1+ TB NVMe SSD
- Netzwerk: 1 Gbps+

**Software-Stack:**
- OS: Ubuntu 22.04 LTS
- CUDA: 12.0+
- Python: 3.10+
- Ollama / vLLM / llama.cpp

**Setup-Schritte:**
1. GPU-Server bereitstellen
2. CUDA installieren
3. Ollama/vLLM installieren
4. LLaMA-Modell downloaden
5. API-Server konfigurieren
6. Provider in Main Server registrieren

---

### **2.3 LLaMA-Provider-Integration**

**Implementierung:**
```typescript
// src/lib/media/ai/providers/LLaMAProvider.ts
export class LLaMAProvider implements MediaAIProvider {
    private serverUrl: string;
    private model: string;

    constructor(config: ProviderConfig) {
        this.serverUrl = config.endpoint || "http://llama-server:8080";
        this.model = config.model || "llama-2-7b-chat";
    }

    async analyzeImage(
        imageBuffer: Buffer,
        mimeType: string,
        options?: AnalysisOptions
    ): Promise<FullAIAnalysisResult> {
        // Konvertiere Bild zu Base64
        const base64Image = imageBuffer.toString("base64");

        // LLaMA API-Call
        const response = await fetch(`${this.serverUrl}/api/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: this.model,
                prompt: `Analysiere dieses Bild: ${base64Image}`,
                stream: false,
            }),
        });

        const result = await response.json();
        return this.parseLLaMAResponse(result);
    }
}
```

---

## 3. DATENBANK-SKALIERUNG

### **3.1 MySQL-Skalierung**

**Strategien:**
- **Read Replicas:** Mehrere Read-Replicas für Leselast
- **Sharding:** Datenbank-Sharding für sehr große Datenmengen
- **Connection Pooling:** Optimierte Connection-Pools
- **Query-Optimierung:** Indizes, Query-Caching

**Architektur:**
```
┌─────────────────────────────────────────────────────────┐
│              MySQL Master (Write)                        │
│  ─────────────────────────────────────────────────────  │
│  • Alle Write-Operationen                              │
│  • Replication zu Replicas                              │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ MySQL Replica│  │ MySQL Replica│  │ MySQL Replica│
│   (Read)     │  │   (Read)     │  │   (Read)     │
└──────────────┘  └──────────────┘  └──────────────┘
```

**Implementierung:**
1. MySQL Master konfigurieren
2. Read Replicas erstellen
3. Prisma-Config erweitern (Read/Write-Split)
4. Connection Pooling optimieren

---

### **3.2 Redis-Caching**

**Zweck:** Caching für häufige Abfragen

**Verwendung:**
- Session-Management
- Provider-Status-Caching
- Analyse-Ergebnis-Caching (optional)
- Rate-Limit-Tracking

**Architektur:**
```
┌─────────────────────────────────────────────────────────┐
│              Redis Cluster                               │
│  ─────────────────────────────────────────────────────  │
│  • Session Storage                                       │
│  • Provider Status Cache                                │
│  • Rate Limit Tracking                                  │
│  • Analysis Result Cache (optional)                     │
└─────────────────────────────────────────────────────────┘
```

**Implementierung:**
1. Redis installieren
2. Redis-Client in Next.js integrieren
3. Session-Management auf Redis umstellen
4. Caching-Strategien implementieren

---

## 4. FILE-STORAGE-SKALIERUNG

### **4.1 Shared File Storage**

**Strategien:**
- **NFS:** Network File System für lokale Server
- **S3:** Amazon S3 / MinIO für Cloud-Storage
- **CDN:** Content Delivery Network für Media-Dateien

**Architektur:**
```
┌─────────────────────────────────────────────────────────┐
│              API Servers                                │
│  ─────────────────────────────────────────────────────  │
│  • Media-Upload                                         │
│  • Media-Download                                       │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Shared File Storage                         │
│  ─────────────────────────────────────────────────────  │
│  Option 1: NFS (Network File System)                   │
│  Option 2: S3 (Amazon S3 / MinIO)                      │
│  Option 3: CDN (Cloudflare / CloudFront)               │
└─────────────────────────────────────────────────────────┘
```

**Implementierung:**
1. NFS/S3/CDN konfigurieren
2. Media-Upload auf Shared Storage umstellen
3. Media-Download optimieren (CDN)
4. Backup-Strategie implementieren

---

## 5. QUEUE-SYSTEM

### **5.1 Async-Task-Queue**

**Zweck:** Asynchrone Verarbeitung von KI-Tasks

**Strategien:**
- **In-Memory Queue:** Einfache Queue im Hauptprozess
- **Redis Queue:** Redis-basierte Queue (Bull/BullMQ)
- **Message Queue:** RabbitMQ / Apache Kafka

**Architektur:**
```
┌─────────────────────────────────────────────────────────┐
│              API Server                                  │
│  ─────────────────────────────────────────────────────  │
│  • Task-Enqueue                                         │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Queue System                               │
│  ─────────────────────────────────────────────────────  │
│  Option 1: Redis Queue (Bull/BullMQ)                   │
│  Option 2: RabbitMQ                                     │
│  Option 3: Apache Kafka                                 │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Worker Processes                            │
│  ─────────────────────────────────────────────────────  │
│  • Task-Processing                                      │
│  • Provider-Aufrufe                                     │
│  • Ergebnis-Speicherung                                │
└─────────────────────────────────────────────────────────┘
```

**Implementierung:**
1. Queue-System auswählen (Redis Queue empfohlen)
2. Worker-Processes erstellen
3. Task-Enqueue in API integrieren
4. Monitoring erweitern

---

## 6. MONITORING & ALERTING

### **6.1 System-Monitoring**

**Komponenten:**
- CPU-Auslastung
- RAM-Auslastung
- Disk-I/O
- Network-I/O
- Database-Performance
- Queue-Depth
- Provider-Status

**Tools:**
- Prometheus + Grafana
- Datadog
- New Relic
- Custom Monitoring (bereits vorhanden)

---

### **6.2 Alerting**

**Alerts:**
- CPU > 80%
- RAM > 90%
- Disk > 90%
- Database-Slow-Queries
- Queue-Depth > 1000
- Provider-Ausfall
- Kosten-Limit erreicht

**Kanäle:**
- E-Mail
- Slack
- PagerDuty
- Webhook

---

## 7. MIGRATIONSPFAD

### **7.1 Phase 1: Vertical Scaling (Sofort)**

**Schritte:**
1. Server-Upgrade (CPU/RAM)
2. MySQL-Optimierung
3. Redis für Caching
4. Monitoring erweitern

**Zeitrahmen:** 1-2 Wochen  
**Kosten:** ~$100-200/Monat (Server-Upgrade)

---

### **7.2 Phase 2: Horizontal Scaling (Q1 2025)**

**Schritte:**
1. Load Balancer konfigurieren
2. Zweiten API-Server deployen
3. Shared File Storage (NFS/S3)
4. Session-Management auf Redis umstellen

**Zeitrahmen:** 2-4 Wochen  
**Kosten:** ~$200-400/Monat (zusätzlicher Server)

---

### **7.3 Phase 3: Self-Hosted LLaMA (Q2 2025)**

**Schritte:**
1. GPU-Server bereitstellen
2. LLaMA-Server installieren
3. LLaMA-Provider implementieren
4. Integration in Main Server

**Zeitrahmen:** 4-6 Wochen  
**Kosten:** ~$350-800/Monat (GPU-Server)

---

### **7.4 Phase 4: Advanced Scaling (Q3-Q4 2025)**

**Schritte:**
1. MySQL Read Replicas
2. Queue-System (Redis Queue)
3. CDN für Media-Dateien
4. Advanced Monitoring

**Zeitrahmen:** 4-8 Wochen  
**Kosten:** ~$300-600/Monat (zusätzliche Infrastruktur)

---

## 8. KOSTEN-OPTIMIERUNG

### **8.1 Kosten-Übersicht**

**Aktuell (Single Server):**
- Server: ~$50-100/Monat
- OpenAI API: ~$20-300/Monat (abhängig von Volumen)
- **Gesamt: ~$70-400/Monat**

**Phase 1 (Vertical Scaling):**
- Server: ~$150-200/Monat
- OpenAI API: ~$20-300/Monat
- **Gesamt: ~$170-500/Monat**

**Phase 2 (Horizontal Scaling):**
- Server: ~$300-400/Monat (2 Server)
- OpenAI API: ~$20-300/Monat
- **Gesamt: ~$320-700/Monat**

**Phase 3 (Self-Hosted LLaMA):**
- Server: ~$300-400/Monat (2 API Server)
- GPU-Server: ~$350-800/Monat
- OpenAI API: ~$0-100/Monat (reduziert durch LLaMA)
- **Gesamt: ~$650-1300/Monat**

**Phase 4 (Advanced Scaling):**
- Server: ~$500-800/Monat (3+ API Server)
- GPU-Server: ~$350-800/Monat
- Database: ~$100-200/Monat (Read Replicas)
- CDN: ~$50-100/Monat
- OpenAI API: ~$0-100/Monat
- **Gesamt: ~$1000-2000/Monat**

---

### **8.2 Kosten-Optimierung-Strategien**

**Strategien:**
1. **Provider-Auswahl:** Günstigster Provider für jede Aufgabe
2. **Caching:** Analyse-Ergebnisse cachen
3. **Batch-Processing:** Mehrere Bilder gleichzeitig verarbeiten
4. **Self-Hosted:** LLaMA für hohes Volumen
5. **CDN:** Media-Dateien über CDN ausliefern

---

## 9. ZUSAMMENFASSUNG

**Kernpunkte:**
- ✅ **Horizontal skalierbar:** Mehrere Server parallel
- ✅ **Vertical skalierbar:** Größere Server-Ressourcen
- ✅ **Self-Hosted:** LLaMA auf separater Maschine
- ✅ **Zero-Downtime:** Keine Ausfallzeiten bei Skalierung
- ✅ **Kostenoptimiert:** Optimale Ressourcennutzung

**Migrationspfad:**
1. Phase 1: Vertical Scaling (Sofort)
2. Phase 2: Horizontal Scaling (Q1 2025)
3. Phase 3: Self-Hosted LLaMA (Q2 2025)
4. Phase 4: Advanced Scaling (Q3-Q4 2025)

**Nächste Schritte:**
1. Risikoprüfung durchführen (F1-KI-RISIKOPRÜFUNG.md)
2. Implementierungsphase F.1 vorbereiten

---

**Enterprise++ KI-Architekt-Agent**  
*Analyse → Planung → Kontrolle*  
*Stand: 2025-11-29*




