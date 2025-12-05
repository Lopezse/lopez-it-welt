# F1-KI-LLAMA-PLAN

## Self-Hosted LLaMA Provider – Vollständige Planung

**Version:** 1.0  
**Stand:** 2025-11-29  
**Status:** 📋 **PLANUNG** (Keine Implementierung)  
**Methode:** ABC-Methode (Analyse → Bauplanung → Kontrolle)  
**Enterprise++ Standard:** IBM/SAP/Siemens-Niveau

---

## 📋 EXECUTIVE SUMMARY

Dieses Dokument definiert die **vollständige Planung für den Self-Hosted LLaMA Provider** in Lopez IT Welt Enterprise++. LLaMA ermöglicht eine vollständig kontrollierte, DSGVO-konforme KI-Verarbeitung ohne Cloud-Abhängigkeit.

**Wichtig:** Dieser Plan ist auf **Einzelunternehmen im Aufbau mit begrenztem Budget** ausgerichtet. Er beginnt mit **kostenlosen Lern- und Testphasen** und skaliert später auf größere Infrastruktur, wenn Projekte, Kunden & Umsatz vorhanden sind.

**Kernprinzipien:**
- ✅ **Budgetfreundlich starten:** Phase L0/L1 ohne zusätzliche Kosten
- ✅ **Self-Hosted:** Vollständige Datenkontrolle
- ✅ **DSGVO-konform:** Daten bleiben intern
- ✅ **Kostenoptimiert:** Günstiger bei hohem Volumen
- ✅ **Erweiterbar:** Fine-Tuning möglich
- ✅ **Fallback:** Cloud-Provider als Backup

**Phasen-Übersicht:**
- **Phase L0 (JETZT):** Lokal auf Windows-PC testen – **0 € zusätzliche Kosten**
- **Phase L1 (Optional):** Auf bestehendem Netcup-Server – **0 € zusätzliche Kosten**
- **Phase L2 (Langfristig):** Dedicated GPU-Server – **ab ~200-600 €/Monat** (wenn Umsatz da ist)
- **Phase L3 (Langfristig):** Eigenes Hardware-Cluster – **einmalig ~3.000-5.000 €** (wenn Umsatz da ist)

---

## 1. LLaMA-ÜBERSICHT

### **1.1 Was ist LLaMA?**

**LLaMA (Large Language Model Meta AI)** ist ein Open-Source-Sprachmodell von Meta, das lokal auf eigenen Servern betrieben werden kann.

**Vorteile:**
- ✅ Vollständige Datenkontrolle (keine Cloud-Abhängigkeit)
- ✅ DSGVO-konform (Daten bleiben intern)
- ✅ Keine API-Kosten (nur Server-Kosten)
- ✅ Fine-Tuning möglich
- ✅ Anpassbar an spezifische Anforderungen

**Nachteile:**
- ⚠️ Initiale Setup-Kosten (GPU-Server)
- ⚠️ Wartung erforderlich
- ⚠️ Qualität möglicherweise niedriger als GPT-4
- ⚠️ Höhere Latenz als Cloud-Provider

---

### **1.2 LLaMA-Modelle**

**Verfügbare Modelle:**

| Modell | Parameter | VRAM | Qualität | Empfehlung |
|--------|-----------|------|----------|------------|
| LLaMA 2 7B | 7 Milliarden | 8-12 GB | Gut | ✅ **Empfohlen für Start** |
| LLaMA 2 13B | 13 Milliarden | 16-20 GB | Sehr gut | Für höhere Qualität |
| LLaMA 2 70B | 70 Milliarden | 80+ GB | Exzellent | Für maximale Qualität |
| LLaMA 3 8B | 8 Milliarden | 10-14 GB | Sehr gut | ✅ **Neueste Version** |
| LLaMA 3 70B | 70 Milliarden | 80+ GB | Exzellent | Für maximale Qualität |

**Empfehlung für Start:**
- **LLaMA 2 7B** oder **LLaMA 3 8B** (ausreichend für Media-Analyse)
- Später aufgrößere Modelle upgraden, wenn nötig

---

## 2. SERVER-ARCHITEKTUR

### **2.1 Hardware-Anforderungen**

#### **Minimum (LLaMA 2 7B):**

```
CPU:     16+ Cores (AMD Ryzen 9 / Intel i9)
RAM:     32 GB (64 GB empfohlen)
GPU:     NVIDIA RTX 3090 (24 GB VRAM) oder RTX 4090 (24 GB VRAM)
Storage: 500 GB NVMe SSD (1 TB empfohlen)
Network: 1 Gbps+
```

#### **Empfohlen (LLaMA 2 13B / LLaMA 3 8B):**

```
CPU:     24+ Cores (AMD Ryzen 9 / Intel i9)
RAM:     64 GB (128 GB empfohlen)
GPU:     NVIDIA RTX 4090 (24 GB VRAM) oder A100 (40/80 GB VRAM)
Storage: 1 TB NVMe SSD (2 TB empfohlen)
Network: 10 Gbps (optional)
```

#### **Maximum (LLaMA 2/3 70B):**

```
CPU:     32+ Cores (AMD EPYC / Intel Xeon)
RAM:     128 GB (256 GB empfohlen)
GPU:     NVIDIA A100 (80 GB VRAM) oder H100 (80 GB VRAM)
Storage: 2 TB NVMe SSD (4 TB empfohlen)
Network: 10 Gbps+
```

---

### **2.2 Server-Optionen (nach Phasen)**

#### **Phase L0: Lokaler Windows-PC (JETZT – 0 € zusätzliche Kosten)**

**Voraussetzungen:**
- Windows-PC mit ausreichend RAM (16+ GB empfohlen)
- Optional: NVIDIA GPU (für bessere Performance)

**Vorteile:**
- ✅ **Keine zusätzlichen Kosten** (nutzt vorhandene Hardware)
- ✅ Sofort startbar
- ✅ Perfekt für Lernen und Testen
- ✅ Vollständige Kontrolle

**Nachteile:**
- ⚠️ Langsamer als GPU-Server (bei CPU-only)
- ⚠️ PC muss laufen (nicht 24/7 verfügbar)
- ⚠️ Nicht für produktiven Kundentraffic

**Kosten:** **0 € zusätzlich** (nutzt vorhandene Hardware)

---

#### **Phase L1: Bestehender Netcup-Server (Optional – 0 € zusätzliche Kosten)**

**Voraussetzungen:**
- Bestehender Netcup-Server (VPS/Root-Server)
- CPU-basierte LLaMA-Variante (llama.cpp) oder kleine GPU-Last

**Vorteile:**
- ✅ **Keine zusätzlichen Kosten** (nutzt bestehende Infrastruktur)
- ✅ 24/7 verfügbar
- ✅ Integration in bestehende Architektur
- ✅ Perfekt für Admin/Dev-Nutzung

**Nachteile:**
- ⚠️ Langsamer als GPU-Server (CPU-only)
- ⚠️ Begrenzte Ressourcen (abhängig von Server)
- ⚠️ Nicht für produktiven Kundentraffic

**Kosten:** **0 € zusätzlich** (nutzt bestehende Infrastruktur)

**Hinweis:** Netcup ist hier als Beispiel genannt. Du nutzt aktuell Netcup – dieser Plan passt sich deiner bestehenden Infrastruktur an.

---

#### **Phase L2: Dedicated GPU-Server (Langfristig – ab ~200-600 €/Monat)**

**Voraussetzungen:**
- Projekte, Kunden & Umsatz vorhanden
- Bedarf für produktiven Kundentraffic

**Optionen:**
- **Netcup GPU-Server** (falls verfügbar): ~200-400 €/Monat
- **Hetzner GPU Server** (RTX 4090): ~200-300 €/Monat
- **OVH GPU Server** (RTX 4090): ~250-350 €/Monat
- **Andere Anbieter:** Je nach Verfügbarkeit

**Vorteile:**
- ✅ Dedicated GPU-Hardware
- ✅ Gute Performance
- ✅ 24/7 verfügbar
- ✅ Für produktiven Kundentraffic geeignet

**Nachteile:**
- ⚠️ **Höhere Kosten** (nur wenn Umsatz vorhanden)
- ⚠️ Begrenzte Verfügbarkeit

**Kosten:** **~200-600 €/Monat** (nur wenn Umsatz vorhanden)

**Hinweis:** Hetzner/OVH sind hier nur Beispiele. Du nutzt aktuell Netcup – prüfe, ob Netcup GPU-Server anbietet, oder wähle einen anderen Anbieter.

---

#### **Phase L3: Eigenes Hardware-Cluster (Langfristig – einmalig ~3.000-5.000 €)**

**Voraussetzungen:**
- Stabile Projekte, Kunden & Umsatz
- Hoher Bedarf für produktiven Kundentraffic
- Langfristige Planung

**Vorteile:**
- ✅ Einmalige Kosten
- ✅ Vollständige Kontrolle
- ✅ Langfristig günstiger

**Nachteile:**
- ⚠️ **Hohe initiale Investition** (nur wenn Umsatz vorhanden)
- ⚠️ Wartung erforderlich
- ⚠️ Stromkosten

**Kosten:**
- RTX 4090 PC: ~2.000-3.000 € (einmalig)
- Strom: ~50-100 €/Monat
- Wartung: ~100-200 €/Monat
- **Gesamt (erste 12 Monate): ~2.800-4.200 €** (nur wenn Umsatz vorhanden)

---

### **2.3 Empfehlung nach aktueller Situation**

**JETZT (Phase L0):**
- ✅ **Lokaler Windows-PC** – Sofort startbar, 0 € zusätzliche Kosten
- Ollama installieren
- LLaMA 2 7B oder kleinere Variante (z.B. llama3.2:1b für schnelle Tests)

**Optional (Phase L1):**
- ✅ **Bestehender Netcup-Server** – Integration testen, 0 € zusätzliche Kosten
- llama.cpp für CPU-basierte Variante
- Nur für Admin/Dev-Nutzung

**Langfristig (Phase L2/L3 – nur wenn Umsatz vorhanden):**
- ✅ **Dedicated GPU-Server** (Phase L2) – Wenn produktiver Kundentraffic benötigt wird
- ✅ **Eigenes Hardware** (Phase L3) – Wenn langfristig hoher Bedarf besteht

---

## 3. SOFTWARE-STACK

### **3.1 Betriebssystem**

**Phase L0 (Windows-PC):**
- ✅ **Windows 10/11** – Ollama läuft nativ auf Windows
- Keine Linux-Installation erforderlich

**Phase L1 (Netcup-Server):**
- ✅ **Ubuntu 22.04 LTS** oder **Debian** (je nach Server)
- Beste CUDA-Unterstützung (falls GPU verfügbar)
- Große Community
- Umfangreiche Dokumentation

**Phase L2/L3 (Dedicated Server/Eigenes Hardware):**
- ✅ **Ubuntu 22.04 LTS** – Empfohlen
- Beste CUDA-Unterstützung
- Große Community
- Umfangreiche Dokumentation

---

### **3.2 CUDA & Treiber**

**CUDA Version:** 12.0+ (für neueste GPU-Treiber)

**Installation:**
```bash
# NVIDIA Treiber
sudo apt update
sudo apt install nvidia-driver-535

# CUDA Toolkit
wget https://developer.download.nvidia.com/compute/cuda/12.0.0/local_installers/cuda_12.0.0_525.60.13_linux.run
sudo sh cuda_12.0.0_525.60.13_linux.run
```

---

### **3.3 LLaMA-Server-Optionen**

#### **Option 1: Ollama (Empfohlen für Phase L0/L1/L2)**

**Vorteile:**
- ✅ Einfache Installation (Windows & Linux)
- ✅ Automatisches Model-Management
- ✅ REST API
- ✅ Gute Dokumentation
- ✅ Läuft auf Windows nativ

**Nachteile:**
- ⚠️ Weniger Kontrolle über Inferenz-Parameter

**Installation (Windows - Phase L0):**
```powershell
# Ollama für Windows herunterladen
# https://ollama.com/download/windows

# Oder via Winget
winget install Ollama.Ollama

# LLaMA-Modell downloaden (kleinere Variante für Tests)
ollama pull llama3.2:1b
# oder
ollama pull llama2:7b

# Server starten (läuft automatisch als Service)
```

**Installation (Linux - Phase L1/L2):**
```bash
curl -fsSL https://ollama.com/install.sh | sh

# LLaMA-Modell downloaden
ollama pull llama2:7b
# oder
ollama pull llama3:8b

# Server starten
ollama serve
```

**API:**
```bash
# Text-Generierung
curl http://localhost:11434/api/generate -d '{
  "model": "llama2:7b",
  "prompt": "Analysiere dieses Bild: ...",
  "stream": false
}'
```

---

#### **Option 2: vLLM (Empfohlen für Produktion)**

**Vorteile:**
- ✅ Sehr schnelle Inferenz
- ✅ Optimierte GPU-Nutzung
- ✅ Batch-Processing
- ✅ Hohe Throughput

**Nachteile:**
- ⚠️ Komplexere Installation
- ⚠️ Mehr Konfiguration erforderlich

**Installation:**
```bash
pip install vllm

# Server starten
python -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Llama-2-7b-chat-hf \
  --port 8000
```

**API (OpenAI-kompatibel):**
```bash
curl http://localhost:8000/v1/completions -H "Content-Type: application/json" -d '{
  "model": "meta-llama/Llama-2-7b-chat-hf",
  "prompt": "Analysiere dieses Bild: ...",
  "max_tokens": 500
}'
```

---

#### **Option 3: llama.cpp (Für CPU/kleine GPUs - Phase L1)**

**Vorteile:**
- ✅ Läuft auch auf CPU (perfekt für Netcup-Server ohne GPU)
- ✅ Sehr effizient
- ✅ Geringer Speicherverbrauch
- ✅ Ideal für Phase L1 (bestehender Server)

**Nachteile:**
- ⚠️ Langsamer als GPU-basierte Lösungen
- ⚠️ Weniger Features

**Installation (Phase L1 - Netcup-Server):**
```bash
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
make

# Server starten
./server -m models/llama-2-7b.gguf -c 4096
```

---

### **3.4 Empfehlung nach Phasen**

**Phase L0 (JETZT - Windows-PC):**
- ✅ **Ollama** – Einfachste Installation auf Windows, sofort startbar

**Phase L1 (Optional - Netcup-Server):**
- ✅ **Ollama** (wenn genug Ressourcen) oder **llama.cpp** (für CPU-only)

**Phase L2 (Langfristig - Dedicated GPU-Server):**
- ✅ **Ollama** – Einfachste Installation und Wartung

**Phase L3 (Langfristig - Eigenes Hardware):**
- ✅ **vLLM** – Beste Performance und Throughput

---

## 4. PROVIDER-IMPLEMENTIERUNG

### **4.1 LLaMAProvider Interface**

```typescript
// src/lib/media/ai/providers/LLaMAProvider.ts

import type { MediaAIProvider } from "./types";
import type { FullAIAnalysisResult, AnalysisOptions } from "../types";

export class LLaMAProvider implements MediaAIProvider {
    private serverUrl: string;
    private model: string;
    private apiKey?: string;

    constructor(config: {
        endpoint: string;
        model?: string;
        apiKey?: string;
    }) {
        this.serverUrl = config.endpoint || "http://localhost:11434";
        this.model = config.model || "llama2:7b";
        this.apiKey = config.apiKey;
    }

    getName(): string {
        return "llama";
    }

    getVersion(): string {
        return "1.0.0";
    }

    async isAvailable(): Promise<ProviderStatus> {
        try {
            const response = await fetch(`${this.serverUrl}/api/tags`, {
                method: "GET",
                headers: this.getHeaders(),
            });

            if (response.ok) {
                return {
                    available: true,
                };
            } else {
                return {
                    available: false,
                    error: `Server returned ${response.status}`,
                };
            }
        } catch (error) {
            return {
                available: false,
                error: error instanceof Error ? error.message : "Unbekannter Fehler",
            };
        }
    }

    async analyzeImage(
        imageBuffer: Buffer,
        mimeType: string,
        options?: AnalysisOptions
    ): Promise<FullAIAnalysisResult> {
        // Konvertiere Bild zu Base64
        const base64Image = imageBuffer.toString("base64");

        // Erstelle Prompt für LLaMA
        const prompt = this.createAnalysisPrompt(base64Image, mimeType, options);

        // LLaMA API-Call
        const response = await fetch(`${this.serverUrl}/api/generate`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify({
                model: this.model,
                prompt: prompt,
                stream: false,
                options: {
                    temperature: 0.7,
                    top_p: 0.9,
                    max_tokens: 500,
                },
            }),
        });

        if (!response.ok) {
            throw new ProviderError(
                `LLaMA API error: ${response.statusText}`,
                "llama",
                "API_ERROR",
                true
            );
        }

        const result = await response.json();
        return this.parseLLaMAResponse(result, imageBuffer, mimeType);
    }

    estimateCost(imageSize: number, options?: AnalysisOptions): CostEstimate {
        // Self-Hosted: Keine API-Kosten, nur Server-Kosten
        // Kosten pro Request = Server-Kosten / erwartete Requests pro Monat
        const monthlyServerCost = 300; // Beispiel: 300 USD/Monat
        const expectedRequestsPerMonth = 10000;
        const costPerRequest = monthlyServerCost / expectedRequestsPerMonth;

        return {
            provider: "llama",
            operation: "analyze",
            costUsd: costPerRequest * (imageSize / 1024 / 1024), // Pro MB
            imagesProcessed: 1,
        };
    }

    private getHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (this.apiKey) {
            headers["Authorization"] = `Bearer ${this.apiKey}`;
        }

        return headers;
    }

    private createAnalysisPrompt(
        base64Image: string,
        mimeType: string,
        options?: AnalysisOptions
    ): string {
        const language = options?.language || "de";
        const context = options?.context || "";
        const intendedUse = options?.intendedUse || "";

        return `Du bist ein Experte für Bildanalyse. Analysiere das folgende Bild im Base64-Format.

Bild-Format: ${mimeType}
Kontext: ${context}
Verwendungszweck: ${intendedUse}

Bitte gib eine vollständige Analyse im folgenden JSON-Format zurück:

{
  "tagging": {
    "tags": ["tag1", "tag2", "tag3"],
    "confidence": 0.95
  },
  "altText": {
    "text": "Beschreibung des Bildes",
    "language": "${language}"
  },
  "quality": {
    "score": 0.9,
    "issues": []
  },
  "category": {
    "category": "Kategorie",
    "confidence": 0.95
  },
  "personDetection": {
    "hasPerson": false,
    "confidence": 0.0
  }
}

Bild (Base64): ${base64Image.substring(0, 1000)}...`;
    }

    private parseLLaMAResponse(
        result: any,
        imageBuffer: Buffer,
        mimeType: string
    ): FullAIAnalysisResult {
        // Parse LLaMA Response
        // LLaMA gibt Text zurück, muss zu JSON geparst werden
        const responseText = result.response || "";
        
        // Versuche JSON aus Response zu extrahieren
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new ProviderError(
                "LLaMA response does not contain valid JSON",
                "llama",
                "API_ERROR",
                false
            );
        }

        const parsed = JSON.parse(jsonMatch[0]);

        return {
            tagging: {
                tags: parsed.tagging?.tags || [],
                confidence: parsed.tagging?.confidence || 0.0,
            },
            altText: {
                text: parsed.altText?.text || "",
                language: parsed.altText?.language || "de",
            },
            quality: {
                score: parsed.quality?.score || 0.0,
                issues: parsed.quality?.issues || [],
            },
            category: {
                category: parsed.category?.category || "unknown",
                confidence: parsed.category?.confidence || 0.0,
            },
            personDetection: {
                hasPerson: parsed.personDetection?.hasPerson || false,
                confidence: parsed.personDetection?.confidence || 0.0,
            },
            metadata: {
                provider: "llama",
                model: this.model,
                processingTimeMs: result.total_duration || 0,
                timestamp: new Date().toISOString(),
            },
        };
    }
}
```

---

### **4.2 Integration in ProviderFactory**

```typescript
// src/lib/media/ai/provider-factory.ts

import { LLaMAProvider } from "./providers/LLaMAProvider";

export class ProviderFactory {
    static createProvider(config: ProviderConfig): MediaAIProvider {
        const providerName = config.provider.toLowerCase();

        switch (providerName) {
            // ... bestehende Provider ...
            case "llama":
                return new LLaMAProvider({
                    endpoint: config.endpoint || process.env.LLAMA_SERVER_URL || "http://localhost:11434",
                    model: config.model || process.env.LLAMA_MODEL || "llama2:7b",
                    apiKey: config.apiKey || process.env.LLAMA_API_KEY,
                });
            // ...
        }
    }
}
```

---

### **4.3 Config-Erweiterung**

```typescript
// src/lib/media/ai/config.ts

export const AI_CONFIG: Record<string, AIServiceConfig> = {
    // ... bestehende Config ...
    llama: {
        enabled: process.env.MEDIA_AI_PROVIDER === "llama",
        provider: "llama",
        endpoint: process.env.LLAMA_SERVER_URL || "http://localhost:11434",
        model: process.env.LLAMA_MODEL || "llama2:7b",
        timeout_ms: parseInt(process.env.LLAMA_TIMEOUT || "60000"),
        retry_attempts: 3,
    },
};
```

---

## 5. DEPLOYMENT

### **5.1 Phase L0: Windows-PC Setup (JETZT – 0 € zusätzliche Kosten)**

**Schritte:**

1. **Ollama für Windows installieren**
   ```powershell
   # Option 1: Download von https://ollama.com/download/windows
   # Option 2: Via Winget
   winget install Ollama.Ollama
   ```

2. **LLaMA-Modell downloaden (kleinere Variante für schnelle Tests)**
   ```powershell
   # Für schnelle Tests (weniger RAM)
   ollama pull llama3.2:1b
   
   # Oder für bessere Qualität (mehr RAM erforderlich)
   ollama pull llama2:7b
   # oder
   ollama pull llama3:8b
   ```

3. **Ollama starten**
   - Ollama läuft automatisch als Windows-Service
   - Oder manuell: `ollama serve`

4. **Testen**
   ```powershell
   curl http://localhost:11434/api/tags
   ```

5. **Integration in Lopez IT Welt**
   - Environment-Variable: `LLAMA_SERVER_URL=http://localhost:11434`
   - Provider auswählen: `MEDIA_AI_PROVIDER=llama`

**Kosten:** **0 € zusätzlich** (nutzt vorhandene Hardware)

---

### **5.2 Phase L1: Netcup-Server Setup (Optional – 0 € zusätzliche Kosten)**

**Schritte:**

1. **SSH-Zugang zum Netcup-Server**
   ```bash
   ssh user@netcup-server
   ```

2. **Ollama installieren (wenn genug Ressourcen)**
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ```

   **ODER llama.cpp (für CPU-only, weniger Ressourcen)**
   ```bash
   git clone https://github.com/ggerganov/llama.cpp
   cd llama.cpp
   make
   ```

3. **LLaMA-Modell downloaden**
   ```bash
   # Ollama
   ollama pull llama2:7b
   
   # Oder llama.cpp (Model separat downloaden)
   # Model von Hugging Face herunterladen
   ```

4. **Ollama als Service starten (Linux)**
   ```bash
   # Systemd Service erstellen
   sudo nano /etc/systemd/system/ollama.service
   ```

   ```ini
   [Unit]
   Description=Ollama LLaMA Server
   After=network.target

   [Service]
   Type=simple
   User=ollama
   ExecStart=/usr/local/bin/ollama serve
   Restart=always
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```

   ```bash
   sudo systemctl enable ollama
   sudo systemctl start ollama
   ```

5. **Firewall konfigurieren (falls aktiv)**
   ```bash
   sudo ufw allow 11434/tcp
   ```

6. **Testen**
   ```bash
   curl http://localhost:11434/api/tags
   ```

7. **Integration in Lopez IT Welt**
   - Environment-Variable: `LLAMA_SERVER_URL=http://netcup-server:11434`
   - Provider auswählen: `MEDIA_AI_PROVIDER=llama`
   - **Nur für Admin/Dev-Nutzung** (kein produktiver Kundentraffic)

**Kosten:** **0 € zusätzlich** (nutzt bestehende Infrastruktur)

---

### **5.3 Phase L2: Dedicated GPU-Server Setup (Langfristig – ab ~200-600 €/Monat)**

**Schritte:**

1. **GPU-Server bereitstellen**
   - Netcup GPU-Server (falls verfügbar)
   - Oder anderer Anbieter (Hetzner, OVH, etc.)

2. **Ubuntu 22.04 LTS installieren**
   ```bash
   # NVIDIA Treiber installieren
   sudo apt update
   sudo apt install nvidia-driver-535
   
   # CUDA installieren (optional, für vLLM)
   ```

3. **Ollama installieren**
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ```

4. **LLaMA-Modell downloaden**
   ```bash
   ollama pull llama2:7b
   # oder
   ollama pull llama3:8b
   ```

5. **Ollama als Service starten**
   ```bash
   sudo systemctl enable ollama
   sudo systemctl start ollama
   ```

6. **Firewall konfigurieren**
   ```bash
   sudo ufw allow 11434/tcp
   ```

7. **Testen**
   ```bash
   curl http://localhost:11434/api/tags
   ```

**Kosten:** **~200-600 €/Monat** (nur wenn Umsatz vorhanden)

---

### **5.2 Main Server Integration**

**Environment-Variablen:**
```bash
# .env
MEDIA_AI_PROVIDER=llama
LLAMA_SERVER_URL=http://llama-server:11434
LLAMA_MODEL=llama2:7b
LLAMA_API_KEY=optional-api-key
LLAMA_TIMEOUT=60000
```

**Provider auswählen:**
```typescript
// In MediaAIService oder Config
const provider = getProvider(); // Lädt LLaMAProvider wenn MEDIA_AI_PROVIDER=llama
```

---

## 6. MONITORING & WARTUNG

### **6.1 Health-Checks**

**Implementierung:**
```typescript
// Regelmäßige Health-Checks
setInterval(async () => {
    const provider = ProviderFactory.getProvider();
    if (provider.getName() === "llama") {
        const status = await provider.isAvailable();
        if (!status.available) {
            logger.error(`LLaMA Server nicht verfügbar: ${status.error}`);
            // Alert an Admin
        }
    }
}, 60000); // Jede Minute
```

---

### **6.2 Performance-Monitoring**

**Metriken:**
- Response-Zeit
- Throughput (Requests/Sekunde)
- GPU-Auslastung
- VRAM-Nutzung
- Fehlerrate

**Tools:**
- Prometheus + Grafana
- Ollama Metrics (falls verfügbar)
- Custom Monitoring

---

### **6.3 Wartung**

**Regelmäßige Aufgaben:**
- ✅ Model-Updates (neue LLaMA-Versionen)
- ✅ Server-Updates (OS, CUDA, Treiber)
- ✅ Backup (Model-Dateien, Config)
- ✅ Performance-Optimierung

**Automatisierung:**
- ✅ Automatische Updates (optional)
- ✅ Automatische Backups
- ✅ Automatische Health-Checks

---

## 7. KOSTEN-ANALYSE

### **7.1 Kosten-Vergleich nach Phasen**

**Phase L0 (JETZT – Windows-PC):**
- ✅ **0 € zusätzliche Kosten** (nutzt vorhandene Hardware)
- Strom: ~5-10 €/Monat (wenn PC zusätzlich läuft, sonst 0 €)
- **Gesamt: ~0-10 €/Monat**

**Phase L1 (Optional – Netcup-Server):**
- ✅ **0 € zusätzliche Kosten** (nutzt bestehende Infrastruktur)
- Keine zusätzlichen Serverkosten
- **Gesamt: 0 €/Monat**

**Phase L2 (Langfristig – Dedicated GPU-Server):**
- Server: ~200-600 €/Monat (Netcup, Hetzner, OVH oder anderer Anbieter)
- **Gesamt: ~200-600 €/Monat** (nur wenn Umsatz vorhanden)

**Phase L3 (Langfristig – Eigenes Hardware):**
- Hardware: ~3.000-5.000 € (einmalig)
- Strom: ~50-100 €/Monat
- Wartung: ~100-200 €/Monat
- **Gesamt (erste 12 Monate): ~2.800-4.200 €** (nur wenn Umsatz vorhanden)

**Cloud-Provider (OpenAI) zum Vergleich:**
- 10.000 Bilder/Monat: ~200-300 €
- 100.000 Bilder/Monat: ~2.000-3.000 €

**Break-Even-Point (Phase L2 vs. OpenAI):**
- Bei ~15.000-20.000 Bildern/Monat ist LLaMA günstiger
- Bei höherem Volumen wird LLaMA deutlich günstiger

**Wichtig:** Phase L0 und L1 kosten **JETZT nichts zusätzlich**. Phase L2 und L3 kommen nur, wenn Projekte, Kunden & Umsatz vorhanden sind.

---

### **7.2 Kosten-Optimierung**

**Strategien:**
1. **Batch-Processing:** Mehrere Bilder gleichzeitig verarbeiten
2. **Caching:** Wiederholte Anfragen cachen
3. **Model-Auswahl:** Kleinere Modelle für einfache Aufgaben
4. **Server-Optimierung:** GPU-Auslastung optimieren

---

## 8. FINE-TUNING

### **8.1 Fine-Tuning-Strategie**

**Zweck:** LLaMA auf spezifische Aufgaben (Media-Analyse) anpassen

**Vorgehen:**
1. **Daten sammeln:** Beispiele für Media-Analysen
2. **Fine-Tuning:** LLaMA auf Daten trainieren
3. **Evaluation:** Qualität prüfen
4. **Deployment:** Fine-Tuned Model deployen

**Tools:**
- Hugging Face Transformers
- LoRA (Low-Rank Adaptation) für effizientes Fine-Tuning
- Unsloth (optimiertes Fine-Tuning)

---

### **8.2 Fine-Tuning-Implementierung (Zukünftig)**

**Phase F.3 (Q3 2025):**
- Fine-Tuning-Pipeline
- Custom Model-Deployment
- A/B-Testing (Standard vs. Fine-Tuned)

---

## 9. SICHERHEIT

### **9.1 API-Sicherheit**

**Maßnahmen:**
- ✅ API-Key-Authentifizierung (optional)
- ✅ Rate-Limiting
- ✅ Firewall-Regeln
- ✅ VPN-Zugang (optional)

---

### **9.2 Daten-Sicherheit**

**Maßnahmen:**
- ✅ Verschlüsselte Verbindung (HTTPS)
- ✅ Keine Logs von Bilddaten
- ✅ Automatische Löschung nach Verarbeitung
- ✅ DSGVO-konform (Daten bleiben intern)

---

## 10. MIGRATIONSPFAD

### **10.1 Phase L0 – Lern- & Testphase (JETZT – 0 € zusätzliche Kosten)**

**Zweck:** LLaMA lokal auf Windows-PC testen, Verständnis aufbauen, erste Use-Cases ausprobieren

**Schritte:**
1. ✅ Ollama auf Windows-PC installieren
2. ✅ LLaMA-Modell downloaden (llama3.2:1b für schnelle Tests oder llama2:7b)
3. ✅ LLaMAProvider implementieren (Code vorbereiten)
4. ✅ Integration in ProviderFactory testen
5. ✅ Erste Use-Cases testen:
   - Media-KI (Bildanalyse)
   - Text-Generierung
   - DSGVO-Helfer (Textanalyse, Zusammenfassungen)
6. ✅ Erfahrung und Gefühl für Qualität/Performance sammeln

**Zeitrahmen:** 1-2 Wochen  
**Kosten:** **0 € zusätzlich** (nutzt vorhandene Hardware)

**Ziel:** Erfahrung sammeln, ohne zusätzliche Kosten

---

### **10.2 Phase L1 – Interne Integration (Optional – 0 € zusätzliche Kosten)**

**Zweck:** LLaMA auf bestehendem Netcup-Server integrieren, Architektur testen, ohne produktiven Kundentraffic

**Schritte:**
1. ✅ Ollama oder llama.cpp auf Netcup-Server installieren
2. ✅ LLaMA-Modell downloaden (CPU-optimierte Variante)
3. ✅ LLaMAProvider vollständig implementieren
4. ✅ Integration in ProviderFactory
5. ✅ Integration in bestehende Architektur testen
6. ✅ Nur für Admin/Dev-Nutzung aktivieren
7. ✅ Architektur und Performance testen

**Zeitrahmen:** 2-3 Wochen  
**Kosten:** **0 € zusätzlich** (nutzt bestehende Infrastruktur)

**Ziel:** Architektur testen, ohne zusätzliche Fixkosten

**Hinweis:** Diese Phase ist optional. Du kannst direkt von L0 zu L2 springen, wenn du später einen Dedicated GPU-Server benötigst.

---

### **10.3 Phase L2 – Dedicated GPU-Server (Langfristig – ab ~200-600 €/Monat)**

**Voraussetzung:** Projekte, Kunden & Umsatz vorhanden, Bedarf für produktiven Kundentraffic

**Zweck:** Produktiver Einsatz mit Dedicated GPU-Hardware

**Schritte:**
1. ✅ GPU-Server bereitstellen (Netcup, Hetzner, OVH oder anderer Anbieter)
2. ✅ Ollama installieren und konfigurieren
3. ✅ LLaMA 2 7B oder LLaMA 3 8B downloaden
4. ✅ LLaMAProvider produktiv einsetzen
5. ✅ Integration in ProviderFactory
6. ✅ Testing und Evaluation
7. ✅ Fallback-Strategie implementieren (Cloud-Provider als Backup)
8. ✅ Monitoring und Wartung einrichten

**Zeitrahmen:** 4-6 Wochen  
**Kosten:** **~200-600 €/Monat** (nur wenn Umsatz vorhanden)

**Ziel:** Produktiver Einsatz mit guter Performance

**Hinweis:** Hetzner/OVH sind hier nur Beispiele. Du nutzt aktuell Netcup – prüfe, ob Netcup GPU-Server anbietet, oder wähle einen anderen Anbieter.

---

### **10.4 Phase L3 – Eigenes Hardware-Cluster (Langfristig – einmalig ~3.000-5.000 €)**

**Voraussetzung:** Stabile Projekte, Kunden & Umsatz, hoher Bedarf für produktiven Kundentraffic, langfristige Planung

**Zweck:** Maximale Kontrolle und langfristige Kostenoptimierung

**Schritte:**
1. ✅ Eigenes Hardware (On-Premise) oder größerer Server
2. ✅ vLLM für bessere Performance
3. ✅ LLaMA 2 13B oder größeres Modell
4. ✅ Fine-Tuning-Pipeline
5. ✅ Advanced Monitoring
6. ✅ Backup-Strategie

**Zeitrahmen:** 6-8 Wochen  
**Kosten:** **~500-1000 €/Monat** (oder einmalig ~3.000-5.000 € + Strom/Wartung)

**Ziel:** Langfristige Kostenoptimierung bei hohem Volumen

---

### **10.5 Klare Kostenübersicht**

| Phase | Zeitpunkt | Kosten | Zweck |
|-------|-----------|--------|-------|
| **L0** | **JETZT** | **0 €** | Lernen, Testen, Erfahrung sammeln |
| **L1** | Optional | **0 €** | Architektur testen auf bestehender Infrastruktur |
| **L2** | Langfristig (wenn Umsatz da) | **~200-600 €/Monat** | Produktiver Einsatz mit Dedicated GPU |
| **L3** | Langfristig (wenn Umsatz da) | **~3.000-5.000 € einmalig** | Langfristige Kostenoptimierung |

**Wichtig:** Phase L2 und L3 kommen nur, wenn Projekte, Kunden & Umsatz vorhanden sind. JETZT kannst du mit Phase L0 starten – ohne zusätzliche Kosten.

---

## 11. ZUSAMMENFASSUNG

**Kernpunkte:**
- ✅ **Budgetfreundlich starten:** Phase L0/L1 ohne zusätzliche Kosten
- ✅ **Self-Hosted:** Vollständige Datenkontrolle
- ✅ **DSGVO-konform:** Daten bleiben intern
- ✅ **Kostenoptimiert:** Günstiger bei hohem Volumen (>15.000 Bilder/Monat)
- ✅ **Erweiterbar:** Fine-Tuning möglich
- ✅ **Fallback:** Cloud-Provider als Backup

**Was du JETZT machen kannst (ohne Mehrkosten):**
- ✅ **Phase L0:** Ollama auf Windows-PC installieren, LLaMA testen, Erfahrung sammeln
- ✅ **Phase L1 (Optional):** LLaMA auf bestehendem Netcup-Server integrieren, Architektur testen

**Was später kommt (wenn Projekte, Kunden & Umsatz da sind):**
- ✅ **Phase L2:** Dedicated GPU-Server (~200-600 €/Monat) für produktiven Kundentraffic
- ✅ **Phase L3:** Eigenes Hardware-Cluster (~3.000-5.000 € einmalig) für langfristige Kostenoptimierung

**Empfehlung für JETZT:**
- ✅ **Phase L0 starten:** Ollama auf Windows-PC, LLaMA 2 7B oder llama3.2:1b testen
- ✅ Erfahrung sammeln, Use-Cases ausprobieren
- ✅ LLaMAProvider-Code vorbereiten (später implementieren)

**Empfehlung für später (wenn Umsatz vorhanden):**
- ✅ **Phase L2:** Dedicated GPU-Server (Netcup, Hetzner, OVH oder anderer Anbieter)
- ✅ **Phase L3:** Eigenes Hardware mit vLLM für maximale Performance

**Nächste Schritte (JETZT):**
1. ✅ Ollama auf Windows-PC installieren (Phase L0)
2. ✅ LLaMA-Modell downloaden (llama3.2:1b für schnelle Tests)
3. ✅ Erste Tests durchführen
4. ✅ LLaMAProvider-Code vorbereiten (später implementieren)

**Wichtig:** Dieser Plan passt sich deiner aktuellen Situation an. Du startest mit Phase L0 (0 €), sammelst Erfahrung, und skalierst später auf Phase L2/L3, wenn Projekte, Kunden & Umsatz vorhanden sind – **ohne Neubau**, da die Architektur von Anfang an darauf ausgelegt ist.

---

**Enterprise++ KI-Architekt-Agent**  
*Analyse → Planung → Kontrolle*  
*Stand: 2025-11-29*

