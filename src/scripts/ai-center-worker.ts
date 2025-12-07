#!/usr/bin/env npx ts-node
/**
 * =====================================================
 * AI CENTER WORKER
 * =====================================================
 * Background Worker für autonomen Agent-Workflow
 * 
 * Führt automatisch Agent-B (Builder) und Agent-C (Reviewer) aus
 * Loop: B → C → B bis alle Fehler behoben
 * 
 * @phase 1.8
 * @author Agent-B (AI Center)
 * 
 * Usage:
 *   pnpm ai-center:worker
 *   pnpm ai-center:worker --once  (nur ein Job)
 * =====================================================
 */

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// -------------------------------------------------
// CONFIGURATION
// -------------------------------------------------

const CONFIG = {
  API_BASE: process.env.AI_CENTER_API || "http://localhost:3000/api/admin/ai-center",
  WORKER_ID: `worker-${process.pid}-${Date.now()}`,
  POLL_INTERVAL_MS: 5000, // 5 Sekunden
  MAX_EXECUTION_TIME_MS: 300000, // 5 Minuten pro Job
  SINGLE_RUN: process.argv.includes("--once"),
};

// -------------------------------------------------
// LOGGING
// -------------------------------------------------

function log(level: "INFO" | "WARN" | "ERROR" | "SUCCESS", message: string, data?: unknown) {
  const timestamp = new Date().toISOString();
  const emoji = {
    INFO: "ℹ️",
    WARN: "⚠️",
    ERROR: "❌",
    SUCCESS: "✅",
  }[level];
  
  console.log(`[${timestamp}] ${emoji} ${level}: ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

// -------------------------------------------------
// API HELPERS
// -------------------------------------------------

async function fetchNextJob(): Promise<{ job: Job; task: Task } | null> {
  try {
    const response = await fetch(`${CONFIG.API_BASE}/jobs/next`, {
      headers: { "X-Worker-ID": CONFIG.WORKER_ID },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const result = await response.json();
    return result.data?.job ? result.data : null;
  } catch (error) {
    log("ERROR", "Fehler beim Abrufen des nächsten Jobs", error);
    return null;
  }
}

async function completeJob(jobId: number, result: JobResult, nextAgent?: "B" | "C"): Promise<void> {
  try {
    await fetch(`${CONFIG.API_BASE}/jobs/${jobId}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Worker-ID": CONFIG.WORKER_ID,
      },
      body: JSON.stringify({
        result,
        logs: result.logs,
        next_agent: nextAgent,
      }),
    });
  } catch (error) {
    log("ERROR", `Fehler beim Abschließen von Job #${jobId}`, error);
  }
}

async function failJob(jobId: number, errorMessage: string, logs?: string): Promise<void> {
  try {
    await fetch(`${CONFIG.API_BASE}/jobs/${jobId}/fail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Worker-ID": CONFIG.WORKER_ID,
      },
      body: JSON.stringify({
        error_message: errorMessage,
        logs,
        should_retry: true,
      }),
    });
  } catch (error) {
    log("ERROR", `Fehler beim Markieren von Job #${jobId} als fehlgeschlagen`, error);
  }
}

// -------------------------------------------------
// AGENT EXECUTORS
// -------------------------------------------------

interface Job {
  id: number;
  task_id: number;
  phase: string;
  agent: "B" | "C";
  input_files: string[] | null;
  input_params: Record<string, unknown> | null;
}

interface Task {
  title: string;
  description: string;
  task_status: string;
}

interface JobResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  logs: string;
  files_processed?: number;
}

async function executeAgentB(job: Job): Promise<JobResult> {
  log("INFO", `🔨 Agent-B (Builder) startet für Job #${job.id}`);
  
  const logs: string[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    // Agent-B: Code generieren / bearbeiten
    // Hier würde normalerweise die Code-Generierung stattfinden
    // Für jetzt: Prüfen ob Dateien existieren
    
    if (job.input_files && job.input_files.length > 0) {
      logs.push(`Prüfe ${job.input_files.length} Dateien...`);
      
      for (const file of job.input_files) {
        try {
          const fs = await import("fs/promises");
          await fs.access(file);
          logs.push(`✅ ${file} existiert`);
        } catch {
          warnings.push(`⚠️ ${file} nicht gefunden`);
        }
      }
    }
    
    logs.push("Agent-B abgeschlossen");
    
    return {
      success: errors.length === 0,
      errors,
      warnings,
      logs: logs.join("\n"),
      files_processed: job.input_files?.length || 0,
    };
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    errors.push(errorMsg);
    return {
      success: false,
      errors,
      warnings,
      logs: logs.join("\n") + `\n❌ ${errorMsg}`,
    };
  }
}

async function executeAgentC(job: Job): Promise<JobResult> {
  log("INFO", `🔍 Agent-C (Reviewer) startet für Job #${job.id}`);
  
  const logs: string[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    // Agent-C: Lint + TypeCheck ausführen
    
    if (job.input_files && job.input_files.length > 0) {
      const files = job.input_files.join(" ");
      
      // -------------------------------------------------
      // 1. ESLint
      // -------------------------------------------------
      logs.push("Running ESLint...");
      try {
        const { stdout: lintOut } = await execAsync(
          `npx eslint ${files} --format json`,
          { timeout: 60000 }
        );
        
        const lintResults = JSON.parse(lintOut);
        const lintErrors = lintResults.reduce((acc: number, r: { errorCount: number }) => acc + r.errorCount, 0);
        const lintWarnings = lintResults.reduce((acc: number, r: { warningCount: number }) => acc + r.warningCount, 0);
        
        if (lintErrors > 0) {
          errors.push(`ESLint: ${lintErrors} Fehler`);
        }
        if (lintWarnings > 0) {
          warnings.push(`ESLint: ${lintWarnings} Warnungen`);
        }
        
        logs.push(`ESLint: ${lintErrors} Fehler, ${lintWarnings} Warnungen`);
        
      } catch (lintError) {
        // ESLint exit code != 0 bei Fehlern
        const errMsg = lintError instanceof Error ? lintError.message : String(lintError);
        if (errMsg.includes("error")) {
          errors.push("ESLint hat Fehler gefunden");
        }
        logs.push(`ESLint Output: ${errMsg.slice(0, 500)}`);
      }
      
      // -------------------------------------------------
      // 2. TypeScript Check
      // -------------------------------------------------
      logs.push("Running TypeScript Check...");
      try {
        await execAsync(
          `npx tsc --noEmit ${files}`,
          { timeout: 120000 }
        );
        logs.push("TypeScript: Keine Fehler");
      } catch (tscError) {
        const errMsg = tscError instanceof Error ? tscError.message : String(tscError);
        errors.push("TypeScript-Fehler gefunden");
        logs.push(`TypeScript Output: ${errMsg.slice(0, 500)}`);
      }
      
    } else {
      logs.push("Keine Dateien zum Prüfen angegeben");
    }
    
    logs.push("Agent-C abgeschlossen");
    
    return {
      success: errors.length === 0,
      errors,
      warnings,
      logs: logs.join("\n"),
      files_processed: job.input_files?.length || 0,
    };
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    errors.push(errorMsg);
    return {
      success: false,
      errors,
      warnings,
      logs: logs.join("\n") + `\n❌ ${errorMsg}`,
    };
  }
}

// -------------------------------------------------
// MAIN WORKER LOOP
// -------------------------------------------------

async function processJob(jobData: { job: Job; task: Task }): Promise<void> {
  const { job, task } = jobData;
  
  log("INFO", `📋 Starte Job #${job.id}`, {
    phase: job.phase,
    agent: job.agent,
    task: task?.title,
  });
  
  try {
    let result: JobResult;
    
    // Agent ausführen
    if (job.agent === "B") {
      result = await executeAgentB(job);
    } else {
      result = await executeAgentC(job);
    }
    
    // Ergebnis verarbeiten
    if (result.success) {
      log("SUCCESS", `Job #${job.id} erfolgreich`);
      
      // Wenn Agent-B erfolgreich → Agent-C starten
      // Wenn Agent-C erfolgreich → Done
      const nextAgent = job.agent === "B" ? "C" : undefined;
      await completeJob(job.id, result, nextAgent);
      
    } else {
      log("WARN", `Job #${job.id} mit Fehlern`, result.errors);
      
      // Wenn Agent-C Fehler findet → zurück zu Agent-B
      if (job.agent === "C" && result.errors.length > 0) {
        await completeJob(job.id, result, "B");
      } else {
        await failJob(job.id, result.errors.join("; "), result.logs);
      }
    }
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    log("ERROR", `Job #${job.id} Fehler`, error);
    await failJob(job.id, errorMsg);
  }
}

async function workerLoop(): Promise<void> {
  log("INFO", `🚀 AI Center Worker gestartet`, {
    worker_id: CONFIG.WORKER_ID,
    api_base: CONFIG.API_BASE,
    single_run: CONFIG.SINGLE_RUN,
  });
  
  while (true) {
    try {
      // Nächsten Job abrufen
      const jobData = await fetchNextJob();
      
      if (jobData) {
        await processJob(jobData);
      } else {
        log("INFO", "Keine Jobs verfügbar, warte...");
      }
      
      // Bei --once nach erstem Job beenden
      if (CONFIG.SINGLE_RUN) {
        log("INFO", "Single-Run Modus: Beende Worker");
        break;
      }
      
      // Warten vor nächster Abfrage
      await new Promise(resolve => setTimeout(resolve, CONFIG.POLL_INTERVAL_MS));
      
    } catch (error) {
      log("ERROR", "Worker-Loop Fehler", error);
      await new Promise(resolve => setTimeout(resolve, CONFIG.POLL_INTERVAL_MS * 2));
    }
  }
}

// -------------------------------------------------
// START
// -------------------------------------------------

console.log("");
console.log("========================================");
console.log("  AI CENTER WORKER");
console.log("  Enterprise++ Agent Orchestration");
console.log("========================================");
console.log("");

workerLoop().catch(error => {
  log("ERROR", "Worker abgestürzt", error);
  process.exit(1);
});







