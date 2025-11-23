/**
 * 🤖 Kontext-Loader für Agenten
 *
 * Stellt allen Agenten Zugriff auf Projekt-Kontexte zur Verfügung:
 * - docs/ (Dokumentation, Checklisten, CI-Richtlinien)
 * - status/ (Cursor-Status, Projekt-Status)
 * - CHANGELOG.md (Änderungshistorie)
 * - config/ (Konfigurationen)
 * - scripts/ (Skripte)
 * - src/ (Quellcode)
 *
 * @author Lopez IT Welt Team
 * @version 1.0.0
 * @date 2025-01-19
 */

import * as fs from "fs";
import * as path from "path";
import { Logger } from "./logger";

// 📋 Typen-Definitionen
export interface Documentation {
  files: string[];
  content: Record<string, string>;
  metadata: Record<string, any>;
}

export interface ProjectStatus {
  environment: string;
  version: string;
  lastDeployment: string;
  health: "healthy" | "warning" | "critical";
  metrics: Record<string, number>;
}

export interface Changelog {
  version: string;
  date: string;
  changes: {
    added: string[];
    changed: string[];
    fixed: string[];
    removed: string[];
  };
  author: string;
}

export interface CIConfiguration {
  workflows: string[];
  environments: string[];
  secrets: string[];
  permissions: Record<string, string[]>;
}

export interface SourceCode {
  files: string[];
  structure: Record<string, any>;
  dependencies: Record<string, string>;
  tests: string[];
}

export interface ContextData {
  docs: Documentation;
  status: ProjectStatus;
  changelog: Changelog;
  ci: CIConfiguration;
  source: SourceCode;
  timestamp: string;
}

/**
 * 🧠 Kontext-Loader Klasse
 *
 * Lädt und verwaltet alle Projekt-Kontexte für Agenten
 */
export class ContextLoader {
  private logger: Logger;
  private basePath: string;
  private cache: Map<string, any>;
  private cacheTimeout: number = 300000; // 5 Minuten

  constructor(basePath: string = process.cwd()) {
    this.basePath = basePath;
    this.logger = new Logger("ContextLoader");
    this.cache = new Map();
  }

  /**
   * 📚 Lädt die gesamte Dokumentation
   */
  async loadDocs(): Promise<Documentation> {
    const cacheKey = "docs";
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const docsPath = path.join(this.basePath, "docs");
      const files = await this.scanDirectory(docsPath, [".md", ".mdx", ".txt"]);

      const content: Record<string, string> = {};
      const metadata: Record<string, any> = {};

      for (const file of files) {
        const filePath = path.join(docsPath, file);
        const fileContent = await fs.promises.readFile(filePath, "utf-8");
        content[file] = fileContent;

        // Extrahiere Metadaten aus Markdown
        const metadataMatch = fileContent.match(/^---\n([\s\S]*?)\n---/);
        if (metadataMatch) {
          try {
            metadata[file] = JSON.parse(metadataMatch[1]);
          } catch (e) {
            metadata[file] = { title: file };
          }
        }
      }

      const docs: Documentation = {
        files,
        content,
        metadata,
      };

      this.setCached(cacheKey, docs);
      this.logger.info(`Dokumentation geladen: ${files.length} Dateien`);
      return docs;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error("Fehler beim Laden der Dokumentation:", error);
      } else {
        this.logger.error("Fehler beim Laden der Dokumentation:", new Error(String(error)));
      }
      throw new Error(`Dokumentation konnte nicht geladen werden: ${error}`);
    }
  }

  /**
   * 📊 Lädt den Projekt-Status
   */
  async loadStatus(): Promise<ProjectStatus> {
    const cacheKey = "status";
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const statusPath = path.join(this.basePath, "status");
      const statusFiles = await this.scanDirectory(statusPath, [".json", ".yml", ".yaml"]);

      let status: ProjectStatus = {
        environment: process.env.NODE_ENV || "development",
        version: "1.0.0",
        lastDeployment: new Date().toISOString(),
        health: "healthy",
        metrics: {},
      };

      // Lade Status-Dateien
      for (const file of statusFiles) {
        const filePath = path.join(statusPath, file);
        const fileContent = await fs.promises.readFile(filePath, "utf-8");

        try {
          const fileStatus = JSON.parse(fileContent);
          status = { ...status, ...fileStatus };
        } catch (e) {
          this.logger.warn(`Status-Datei ${file} konnte nicht geparst werden`);
        }
      }

      // Lade package.json für Version
      try {
        const packagePath = path.join(this.basePath, "package.json");
        const packageContent = await fs.promises.readFile(packagePath, "utf-8");
        const packageJson = JSON.parse(packageContent);
        status.version = packageJson.version || status.version;
      } catch (e) {
        this.logger.warn("package.json konnte nicht geladen werden");
      }

      this.setCached(cacheKey, status);
      this.logger.info("Projekt-Status geladen");
      return status;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error("Fehler beim Laden des Projekt-Status:", error);
      } else {
        this.logger.error("Fehler beim Laden des Projekt-Status:", new Error(String(error)));
      }
      throw new Error(`Projekt-Status konnte nicht geladen werden: ${error}`);
    }
  }

  /**
   * 📝 Lädt das Changelog
   */
  async loadChangelog(): Promise<Changelog> {
    const cacheKey = "changelog";
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const changelogPath = path.join(this.basePath, "CHANGELOG.md");
      const changelogContent = await fs.promises.readFile(changelogPath, "utf-8");

      // Parse Changelog
      const changelog: Changelog = this.parseChangelog(changelogContent);

      this.setCached(cacheKey, changelog);
      this.logger.info("Changelog geladen");
      return changelog;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error("Fehler beim Laden des Changelogs:", error);
      } else {
        this.logger.error("Fehler beim Laden des Changelogs:", new Error(String(error)));
      }
      throw new Error(`Changelog konnte nicht geladen werden: ${error}`);
    }
  }

  /**
   * 🔧 Lädt CI/CD-Konfigurationen
   */
  async loadCIConfig(): Promise<CIConfiguration> {
    const cacheKey = "ci";
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const ciPath = path.join(this.basePath, ".github", "workflows");
      const workflows = await this.scanDirectory(ciPath, [".yml", ".yaml"]);

      const configPath = path.join(this.basePath, "config");
      const configFiles = await this.scanDirectory(configPath, [".json", ".js", ".ts"]);

      const ci: CIConfiguration = {
        workflows,
        environments: ["development", "staging", "production"],
        secrets: ["AGENT_API_KEY", "SLACK_WEBHOOK_URL", "EMAIL_SMTP_CONFIG", "VAULT_TOKEN"],
        permissions: {
          styleguard: ["comment", "suggest"],
          "security-audit": ["scan", "block", "alert"],
          "deploy-buddy": ["suggest", "block"],
          "monitoring-waecher": ["alert", "escalate"],
          "compliance-checker": ["check", "block", "report"],
          "ai-test-agent": ["generate", "run", "analyze"],
          "snapshot-archivierung": ["create", "archive"],
        },
      };

      this.setCached(cacheKey, ci);
      this.logger.info("CI/CD-Konfiguration geladen");
      return ci;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error("Fehler beim Laden der CI/CD-Konfiguration:", error);
      } else {
        this.logger.error("Fehler beim Laden der CI/CD-Konfiguration:", new Error(String(error)));
      }
      throw new Error(`CI/CD-Konfiguration konnte nicht geladen werden: ${error}`);
    }
  }

  /**
   * 💻 Lädt Quellcode-Informationen
   */
  async loadSourceCode(): Promise<SourceCode> {
    const cacheKey = "source";
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const srcPath = path.join(this.basePath, "src");
      const files = await this.scanDirectory(srcPath, [".ts", ".tsx", ".js", ".jsx"]);

      const structure: Record<string, any> = {};
      const dependencies: Record<string, string> = {};
      const tests: string[] = [];

      // Analysiere Dateistruktur
      for (const file of files) {
        const filePath = path.join(srcPath, file);
        const relativePath = path.relative(srcPath, filePath);
        const dir = path.dirname(relativePath);

        if (!structure[dir]) {
          structure[dir] = [];
        }
        structure[dir].push(file);

        // Identifiziere Tests
        if (file.includes(".test.") || file.includes(".spec.")) {
          tests.push(file);
        }
      }

      // Lade Dependencies
      try {
        const packagePath = path.join(this.basePath, "package.json");
        const packageContent = await fs.promises.readFile(packagePath, "utf-8");
        const packageJson = JSON.parse(packageContent);
        dependencies.dependencies = packageJson.dependencies || {};
        dependencies.devDependencies = packageJson.devDependencies || {};
      } catch (e) {
        this.logger.warn("Dependencies konnten nicht geladen werden");
      }

      const source: SourceCode = {
        files,
        structure,
        dependencies,
        tests,
      };

      this.setCached(cacheKey, source);
      this.logger.info(`Quellcode geladen: ${files.length} Dateien`);
      return source;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error("Fehler beim Laden des Quellcodes:", error);
      } else {
        this.logger.error("Fehler beim Laden des Quellcodes:", new Error(String(error)));
      }
      throw new Error(`Quellcode konnte nicht geladen werden: ${error}`);
    }
  }

  /**
   * 🧠 Lädt alle Kontexte auf einmal
   */
  async loadAllContexts(): Promise<ContextData> {
    try {
      const [docs, status, changelog, ci, source] = await Promise.all([
        this.loadDocs(),
        this.loadStatus(),
        this.loadChangelog(),
        this.loadCIConfig(),
        this.loadSourceCode(),
      ]);

      const contextData: ContextData = {
        docs,
        status,
        changelog,
        ci,
        source,
        timestamp: new Date().toISOString(),
      };

      this.logger.info("Alle Kontexte erfolgreich geladen");
      return contextData;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error("Fehler beim Laden aller Kontexte:", error);
      } else {
        this.logger.error("Fehler beim Laden aller Kontexte:", new Error(String(error)));
      }
      throw new Error(`Kontexte konnten nicht geladen werden: ${error}`);
    }
  }

  /**
   * 🔍 Sucht in allen Kontexten
   */
  async searchContexts(query: string): Promise<Record<string, string[]>> {
    try {
      const contexts = await this.loadAllContexts();
      const results: Record<string, string[]> = {};

      // Suche in Dokumentation
      results.docs = [];
      for (const [file, content] of Object.entries(contexts.docs.content)) {
        if (content.toLowerCase().includes(query.toLowerCase())) {
          results.docs.push(file);
        }
      }

      // Suche in Quellcode
      results.source = [];
      for (const file of contexts.source.files) {
        try {
          const filePath = path.join(this.basePath, "src", file);
          const content = await fs.promises.readFile(filePath, "utf-8");
          if (content.toLowerCase().includes(query.toLowerCase())) {
            results.source.push(file);
          }
        } catch (e) {
          // Ignoriere Dateien, die nicht gelesen werden können
        }
      }

      this.logger.info(`Kontext-Suche abgeschlossen: ${query}`);
      return results;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error("Fehler bei der Kontext-Suche:", error);
      } else {
        this.logger.error("Fehler bei der Kontext-Suche:", new Error(String(error)));
      }
      throw new Error(`Kontext-Suche fehlgeschlagen: ${error}`);
    }
  }

  /**
   * 🗂️ Scant ein Verzeichnis nach Dateien
   */
  private async scanDirectory(dirPath: string, extensions: string[]): Promise<string[]> {
    const files: string[] = [];

    try {
      const items = await fs.promises.readdir(dirPath, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dirPath, item.name);

        if (item.isDirectory()) {
          const subFiles = await this.scanDirectory(fullPath, extensions);
          files.push(...subFiles.map((f) => path.join(item.name, f)));
        } else if (item.isFile()) {
          const ext = path.extname(item.name);
          if (extensions.includes(ext)) {
            files.push(item.name);
          }
        }
      }
    } catch (error) {
      this.logger.warn(`Verzeichnis ${dirPath} konnte nicht gescannt werden: ${error}`);
    }

    return files;
  }

  /**
   * 📝 Parst Changelog-Inhalt
   */
  private parseChangelog(content: string): Changelog {
    const lines = content.split("\n");
    const changelog: Changelog = {
      version: "1.0.0",
      date: new Date().toISOString(),
      changes: {
        added: [],
        changed: [],
        fixed: [],
        removed: [],
      },
      author: "Lopez IT Welt Team",
    };

    let currentSection = "";
    let inVersionBlock = false;

    for (const line of lines) {
      // Version-Block erkennen
      if (line.match(/^## \[(\d+\.\d+\.\d+)\]/)) {
        const versionMatch = line.match(/^## \[(\d+\.\d+\.\d+)\]/);
        if (versionMatch) {
          changelog.version = versionMatch[1];
          inVersionBlock = true;
        }
      }

      // Sektionen erkennen
      if (inVersionBlock) {
        if (line.includes("### Added")) currentSection = "added";
        else if (line.includes("### Changed")) currentSection = "changed";
        else if (line.includes("### Fixed")) currentSection = "fixed";
        else if (line.includes("### Removed")) currentSection = "removed";
        else if (line.startsWith("##"))
          break; // Nächste Version
        else if (line.startsWith("- ") && currentSection) {
          const change = line.substring(2).trim();
          changelog.changes[currentSection as keyof typeof changelog.changes].push(change);
        }
      }
    }

    return changelog;
  }

  /**
   * 💾 Cache-Management
   */
  private getCached(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setCached(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * 🧹 Cache leeren
   */
  clearCache(): void {
    this.cache.clear();
    this.logger.info("Cache geleert");
  }

  /**
   * 🔄 Cache-Status abfragen
   */
  getCacheStatus(): Record<string, any> {
    const status: Record<string, any> = {};

    for (const [key, value] of this.cache.entries()) {
      status[key] = {
        timestamp: value.timestamp,
        age: Date.now() - value.timestamp,
        valid: Date.now() - value.timestamp < this.cacheTimeout,
      };
    }

    return status;
  }
}

// 📦 Export der Klasse
export default ContextLoader;
