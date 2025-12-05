/**
 * DB Monitor - Enterprise++ Standard P8-D
 * 
 * Überwacht Datenbank-Performance
 */

import { getConnection } from "@/lib/database";
import type { BaseMetric, DBHealth } from "../types";

class DBMonitor {
  /**
   * Analysiert DB-Health basierend auf Metriken
   */
  analyzeDbHealth(metrics: BaseMetric[]): DBHealth {
    const dbMetrics = metrics.filter((m) => m.category === "db");

    const connectionPoolUsage = this.findMetricValue(dbMetrics, "DB-001");
    const slowQueryCount = this.findMetricValue(dbMetrics, "DB-002");
    const avgSlowQueryTime = this.findMetricValue(dbMetrics, "DB-003");
    const queryRate = this.findMetricValue(dbMetrics, "DB-004");
    const replicationLag = this.findMetricValue(dbMetrics, "DB-005");

    return {
      connectionPoolUsage: connectionPoolUsage || 0,
      slowQueryCount: slowQueryCount || 0,
      avgSlowQueryTime: avgSlowQueryTime || 0,
      queryRate: queryRate || 0,
      replicationLag: replicationLag,
    };
  }

  /**
   * Ruft Connection-Pool-Status ab
   */
  async getConnectionPoolStatus(): Promise<{
    total: number;
    active: number;
    idle: number;
    usage_percent: number;
  }> {
    try {
      const connection = await getConnection();
      // MySQL Connection Pool Status (vereinfacht)
      // In einer echten Implementierung würde man den Pool-Status direkt abfragen
      const [rows] = await connection.execute("SHOW STATUS LIKE 'Threads_connected'");
      const threadsConnected = Array.isArray(rows) && rows.length > 0 ? (rows[0] as any).Value : 0;

      // Geschätzte Werte (sollte durch echten Pool-Status ersetzt werden)
      const total = 20; // Max Connections
      const active = parseInt(threadsConnected) || 0;
      const idle = Math.max(0, total - active);
      const usage_percent = (active / total) * 100;

      return {
        total,
        active,
        idle,
        usage_percent,
      };
    } catch (error) {
      // Fallback bei Fehler
      return {
        total: 20,
        active: 0,
        idle: 20,
        usage_percent: 0,
      };
    }
  }

  /**
   * Überwacht Query-Performance (vereinfacht)
   */
  async monitorQueryPerformance(): Promise<{
    slowQueries: number;
    avgSlowQueryTime: number;
  }> {
    try {
      const connection = await getConnection();
      // MySQL Slow Query Log Status
      const [rows] = await connection.execute("SHOW STATUS LIKE 'Slow_queries'");
      const slowQueries = Array.isArray(rows) && rows.length > 0 ? parseInt((rows[0] as any).Value) : 0;

      // Durchschnittliche Slow-Query-Zeit (vereinfacht, sollte aus Logs kommen)
      const avgSlowQueryTime = slowQueries > 0 ? 2000 : 0; // 2 Sekunden als Schätzwert

      return {
        slowQueries,
        avgSlowQueryTime,
      };
    } catch (error) {
      return {
        slowQueries: 0,
        avgSlowQueryTime: 0,
      };
    }
  }

  /**
   * Überwacht Replication-Lag (falls vorhanden)
   */
  async monitorReplicationLag(): Promise<number | undefined> {
    try {
      const connection = await getConnection();
      // MySQL Replication Status
      const [rows] = await connection.execute("SHOW SLAVE STATUS");
      if (Array.isArray(rows) && rows.length > 0) {
        const row = rows[0] as any;
        const lagSeconds = row.Seconds_Behind_Master;
        return lagSeconds ? lagSeconds * 1000 : undefined; // In Millisekunden
      }
      return undefined;
    } catch (error) {
      // Keine Replication oder Fehler
      return undefined;
    }
  }

  /**
   * Berechnet DB-Health-Score
   */
  calculateDBHealth(metrics: BaseMetric[]): {
    score: number;
    status: "healthy" | "degraded" | "unhealthy" | "critical";
    issues: string[];
  } {
    const dbHealth = this.analyzeDbHealth(metrics);
    let score = 100;
    const issues: string[] = [];

    // Connection Pool Usage
    if (dbHealth.connectionPoolUsage > 95) {
      score -= 20;
      issues.push(`Connection Pool kritisch: ${dbHealth.connectionPoolUsage.toFixed(1)}%`);
    } else if (dbHealth.connectionPoolUsage > 80) {
      score -= 10;
      issues.push(`Connection Pool Warnung: ${dbHealth.connectionPoolUsage.toFixed(1)}%`);
    }

    // Slow Queries
    if (dbHealth.slowQueryCount > 50) {
      score -= 20;
      issues.push(`Viele langsame Queries: ${dbHealth.slowQueryCount}`);
    } else if (dbHealth.slowQueryCount > 10) {
      score -= 10;
      issues.push(`Langsame Queries: ${dbHealth.slowQueryCount}`);
    }

    // Slow Query Time
    if (dbHealth.avgSlowQueryTime > 10000) {
      score -= 15;
      issues.push(`Langsame Query-Zeit kritisch: ${dbHealth.avgSlowQueryTime}ms`);
    } else if (dbHealth.avgSlowQueryTime > 2000) {
      score -= 5;
      issues.push(`Langsame Query-Zeit: ${dbHealth.avgSlowQueryTime}ms`);
    }

    // Replication Lag
    if (dbHealth.replicationLag && dbHealth.replicationLag > 5000) {
      score -= 10;
      issues.push(`Replication-Lag kritisch: ${dbHealth.replicationLag}ms`);
    } else if (dbHealth.replicationLag && dbHealth.replicationLag > 1000) {
      score -= 5;
      issues.push(`Replication-Lag: ${dbHealth.replicationLag}ms`);
    }

    const finalScore = Math.max(0, Math.min(100, score));
    let status: "healthy" | "degraded" | "unhealthy" | "critical";
    if (finalScore >= 90) {
      status = "healthy";
    } else if (finalScore >= 70) {
      status = "degraded";
    } else if (finalScore >= 50) {
      status = "unhealthy";
    } else {
      status = "critical";
    }

    return { score: finalScore, status, issues };
  }

  /**
   * Findet Metrik-Wert nach metric_id
   */
  private findMetricValue(metrics: BaseMetric[], metricId: string): number | undefined {
    const metric = metrics.find((m) => m.metric_id === metricId);
    return metric?.value;
  }
}

export const dbMonitor = new DBMonitor();





