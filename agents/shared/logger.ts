/**
 * 📝 Logger für Agenten-System
 *
 * Zentrales Logging-System für alle Agenten mit:
 * - Verschiedene Log-Levels (debug, info, warn, error)
 * - JSON-Format für strukturiertes Logging
 * - Datei- und Console-Output
 * - Performance-Tracking
 *
 * @author Lopez IT Welt Team
 * @version 1.0.0
 * @date 2025-01-19
 */

import * as fs from "fs";
import * as path from "path";

// 📋 Log-Level Definitionen
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}

// 📋 Log-Entry Interface
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  agent: string;
  message: string;
  context?: Record<string, any>;
  performance?: {
    duration: number;
    memory: number;
  };
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

/**
 * 📝 Logger Klasse
 */
export class Logger {
  private agent: string;
  private level: LogLevel;
  private logFile: string;
  private maxFileSize: number;
  private maxFiles: number;

  constructor(
    agent: string,
    level: LogLevel = LogLevel.INFO,
    logFile?: string,
    maxFileSize: number = 100 * 1024 * 1024, // 100MB
    maxFiles: number = 10,
  ) {
    this.agent = agent;
    this.level = level;
    this.maxFileSize = maxFileSize;
    this.maxFiles = maxFiles;

    // Log-Datei konfigurieren
    if (logFile) {
      this.logFile = logFile;
    } else {
      const logsDir = path.join(process.cwd(), "logs");
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      this.logFile = path.join(logsDir, `${agent}.log`);
    }
  }

  /**
   * 🐛 Debug-Log
   */
  async debug(message: string, context?: Record<string, any>): Promise<void> {
    await this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * ℹ️ Info-Log
   */
  async info(message: string, context?: Record<string, any>): Promise<void> {
    await this.log(LogLevel.INFO, message, context);
  }

  /**
   * ⚠️ Warn-Log
   */
  async warn(message: string, context?: Record<string, any>): Promise<void> {
    await this.log(LogLevel.WARN, message, context);
  }

  /**
   * ❌ Error-Log
   */
  async error(message: string, error?: Error, context?: Record<string, any>): Promise<void> {
    await this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * 🚨 Critical-Log
   */
  async critical(message: string, error?: Error, context?: Record<string, any>): Promise<void> {
    await this.log(LogLevel.CRITICAL, message, context, error);
  }

  /**
   * 📊 Performance-Log
   */
  async performance(
    operation: string,
    duration: number,
    context?: Record<string, any>,
  ): Promise<void> {
    const performanceContext = {
      ...context,
      performance: {
        operation,
        duration,
        memory: process.memoryUsage(),
      },
    };

    await this.log(
      LogLevel.INFO,
      `Performance: ${operation} took ${duration}ms`,
      performanceContext,
    );
  }

  /**
   * 🎯 Erfolgs-Log
   */
  async success(message: string, context?: Record<string, any>): Promise<void> {
    const successContext = {
      ...context,
      success: true,
      timestamp: new Date().toISOString(),
    };

    await this.log(LogLevel.INFO, `✅ ${message}`, successContext);
  }

  /**
   * ❌ Fehler-Log
   */
  async failure(message: string, error?: Error, context?: Record<string, any>): Promise<void> {
    const failureContext = {
      ...context,
      success: false,
      timestamp: new Date().toISOString(),
    };

    await this.log(LogLevel.ERROR, `❌ ${message}`, failureContext, error);
  }

  /**
   * 🔄 Start-Log
   */
  async start(operation: string, context?: Record<string, any>): Promise<void> {
    await this.log(LogLevel.INFO, `🚀 Start: ${operation}`, context);
  }

  /**
   * ✅ End-Log
   */
  async end(operation: string, duration: number, context?: Record<string, any>): Promise<void> {
    const endContext = {
      ...context,
      duration,
      memory: process.memoryUsage(),
    };

    await this.log(LogLevel.INFO, `✅ End: ${operation} (${duration}ms)`, endContext);
  }

  /**
   * 📝 Haupt-Log-Methode
   */
  private async log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error,
  ): Promise<void> {
    // Prüfe Log-Level
    if (level < this.level) {
      return;
    }

    const startTime = Date.now();

    // Erstelle Log-Entry
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      agent: this.agent,
      message,
      context,
      performance: {
        duration: 0,
        memory: process.memoryUsage().heapUsed,
      },
    };

    // Füge Error-Informationen hinzu
    if (error) {
      logEntry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    // Formatiere Log-Nachricht
    const formattedMessage = this.formatMessage(logEntry);

    // Console-Output
    this.writeToConsole(logEntry, formattedMessage);

    // File-Output
    await this.writeToFile(formattedMessage);

    // Performance-Tracking
    const endTime = Date.now();
    logEntry.performance!.duration = endTime - startTime;
  }

  /**
   * 📝 Formatiert Log-Nachricht
   */
  private formatMessage(logEntry: LogEntry): string {
    const levelNames = {
      [LogLevel.DEBUG]: "DEBUG",
      [LogLevel.INFO]: "INFO",
      [LogLevel.WARN]: "WARN",
      [LogLevel.ERROR]: "ERROR",
      [LogLevel.CRITICAL]: "CRITICAL",
    };

    const levelName = levelNames[logEntry.level];
    const timestamp = logEntry.timestamp;
    const agent = logEntry.agent;
    const message = logEntry.message;

    // JSON-Format für strukturiertes Logging
    const jsonLog = {
      timestamp,
      level: levelName,
      agent,
      message,
      context: logEntry.context,
      performance: logEntry.performance,
      error: logEntry.error,
    };

    return JSON.stringify(jsonLog);
  }

  /**
   * 🖥️ Console-Output
   */
  private writeToConsole(logEntry: LogEntry, formattedMessage: string): void {
    const levelColors = {
      [LogLevel.DEBUG]: "\x1b[36m", // Cyan
      [LogLevel.INFO]: "\x1b[32m", // Green
      [LogLevel.WARN]: "\x1b[33m", // Yellow
      [LogLevel.ERROR]: "\x1b[31m", // Red
      [LogLevel.CRITICAL]: "\x1b[35m", // Magenta
    };

    const resetColor = "\x1b[0m";
    const color = levelColors[logEntry.level];

    const consoleMessage = `${color}[${logEntry.timestamp}] ${logEntry.agent}: ${logEntry.message}${resetColor}`;

    if (logEntry.level >= LogLevel.ERROR) {
      console.error(consoleMessage);
      if (logEntry.error) {
        console.error(`${color}Error: ${logEntry.error.message}${resetColor}`);
      }
    } else {
      console.log(consoleMessage);
    }
  }

  /**
   * 📄 File-Output
   */
  private async writeToFile(formattedMessage: string): Promise<void> {
    try {
      // Prüfe Dateigröße
      await this.rotateLogFile();

      // Schreibe Log-Entry
      await fs.promises.appendFile(this.logFile, formattedMessage + "\n");
    } catch (error) {
      console.error("Fehler beim Schreiben der Log-Datei:", error);
    }
  }

  /**
   * 🔄 Log-Datei rotieren
   */
  private async rotateLogFile(): Promise<void> {
    try {
      const stats = await fs.promises.stat(this.logFile);

      if (stats.size > this.maxFileSize) {
        // Verschiebe alte Log-Dateien
        for (let i = this.maxFiles - 1; i > 0; i--) {
          const oldFile = `${this.logFile}.${i}`;
          const newFile = `${this.logFile}.${i + 1}`;

          if (fs.existsSync(oldFile)) {
            if (i === this.maxFiles - 1) {
              // Lösche älteste Datei
              await fs.promises.unlink(oldFile);
            } else {
              // Verschiebe Datei
              await fs.promises.rename(oldFile, newFile);
            }
          }
        }

        // Verschiebe aktuelle Log-Datei
        await fs.promises.rename(this.logFile, `${this.logFile}.1`);
      }
    } catch (error) {
      // Ignoriere Fehler bei der Rotation
    }
  }

  /**
   * 📊 Log-Statistiken abrufen
   */
  async getLogStats(): Promise<Record<string, any>> {
    try {
      const stats = await fs.promises.stat(this.logFile);

      return {
        fileSize: stats.size,
        lastModified: stats.mtime,
        agent: this.agent,
        level: this.level,
      };
    } catch (error) {
      return {
        error: "Log-Statistiken konnten nicht abgerufen werden",
        agent: this.agent,
      };
    }
  }

  /**
   * 🧹 Log-Datei leeren
   */
  async clearLog(): Promise<void> {
    try {
      await fs.promises.writeFile(this.logFile, "");
      await this.info("Log-Datei geleert");
    } catch (error) {
      await this.error("Fehler beim Leeren der Log-Datei", error as Error);
    }
  }

  /**
   * 📋 Log-Level ändern
   */
  setLogLevel(level: LogLevel): void {
    this.level = level;
    this.info(`Log-Level auf ${LogLevel[level]} geändert`);
  }

  /**
   * 📁 Log-Datei ändern
   */
  setLogFile(logFile: string): void {
    this.logFile = logFile;
    this.info(`Log-Datei geändert: ${logFile}`);
  }
}

// 📦 Export der Klasse
export default Logger;
