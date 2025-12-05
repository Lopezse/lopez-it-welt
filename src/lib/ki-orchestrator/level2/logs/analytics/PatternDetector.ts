/**
 * Pattern Detector - Enterprise++ Standard P8-E
 * 
 * Pattern-Detection für Logs (wiederkehrende Muster, Sequenzen, Korrelationen)
 */

import { logger } from "@/lib/logger";
import type { Log, Pattern, LogCategory, LogRuleID } from "../types";
import { v4 as uuidv4 } from "uuid";

class PatternDetector {
  /**
   * Erkennt wiederkehrende Muster in Logs
   */
  async detectPatterns(logs: Log[]): Promise<Pattern[]> {
    try {
      logger.debug(`Erkenne Patterns in ${logs.length} Logs`);

      if (logs.length === 0) {
        return [];
      }

      const patterns: Pattern[] = [];

      // Frequent Patterns
      const frequentPatterns = await this.detectFrequentPatterns(logs);
      patterns.push(...frequentPatterns);

      // Sequence Patterns
      const sequencePatterns = await this.detectSequencePatterns(logs);
      patterns.push(...sequencePatterns);

      // Correlated Patterns
      const correlatedPatterns = await this.detectCorrelatedPatterns(logs);
      patterns.push(...correlatedPatterns);

      logger.debug(`Pattern-Detection abgeschlossen: ${patterns.length} Patterns gefunden`);
      return patterns;
    } catch (error) {
      logger.error("Fehler bei Pattern-Detection", error);
      return [];
    }
  }

  /**
   * Erkennt häufige Muster (Frequent Pattern Mining)
   */
  async detectFrequentPatterns(logs: Log[]): Promise<Pattern[]> {
    const patterns: Pattern[] = [];
    const minFrequency = 3; // Mindesthäufigkeit für Pattern

    // Gruppiere Logs nach log_rule_id
    const ruleCounts = new Map<LogRuleID, Log[]>();
    for (const log of logs) {
      if (!ruleCounts.has(log.log_rule_id)) {
        ruleCounts.set(log.log_rule_id, []);
      }
      ruleCounts.get(log.log_rule_id)!.push(log);
    }

    // Finde häufige Patterns
    for (const [ruleId, ruleLogs] of ruleCounts.entries()) {
      if (ruleLogs.length >= minFrequency) {
        const category = ruleLogs[0].category;
        const frequency = ruleLogs.length;
        const confidence = Math.min(1, frequency / logs.length);

        patterns.push({
          id: uuidv4(),
          pattern_type: "frequent",
          pattern: `Frequent log rule: ${ruleId}`,
          frequency,
          confidence,
          category,
          log_rule_ids: [ruleId],
          timestamp_start: ruleLogs[0].timestamp,
          timestamp_end: ruleLogs[ruleLogs.length - 1].timestamp,
        });
      }
    }

    return patterns;
  }

  /**
   * Erkennt Sequenz-Patterns (Sequence Mining)
   */
  async detectSequencePatterns(logs: Log[]): Promise<Pattern[]> {
    const patterns: Pattern[] = [];
    const minSequenceLength = 2;
    const minFrequency = 2;

    // Sortiere Logs nach Timestamp
    const sortedLogs = [...logs].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    // Finde wiederkehrende Sequenzen
    const sequences = new Map<string, { count: number; firstOccurrence: Date; lastOccurrence: Date; ruleIds: LogRuleID[] }>();

    for (let i = 0; i <= sortedLogs.length - minSequenceLength; i++) {
      const sequence = sortedLogs
        .slice(i, i + minSequenceLength)
        .map((log) => log.log_rule_id)
        .join(" -> ");

      if (!sequences.has(sequence)) {
        sequences.set(sequence, {
          count: 0,
          firstOccurrence: sortedLogs[i].timestamp,
          lastOccurrence: sortedLogs[i + minSequenceLength - 1].timestamp,
          ruleIds: sortedLogs.slice(i, i + minSequenceLength).map((log) => log.log_rule_id),
        });
      }

      const seqData = sequences.get(sequence)!;
      seqData.count++;
      seqData.lastOccurrence = sortedLogs[i + minSequenceLength - 1].timestamp;
    }

    // Erstelle Patterns für häufige Sequenzen
    for (const [sequence, seqData] of sequences.entries()) {
      if (seqData.count >= minFrequency) {
        const category = sortedLogs.find((log) => seqData.ruleIds.includes(log.log_rule_id))?.category || "System";
        const confidence = Math.min(1, seqData.count / (sortedLogs.length / minSequenceLength));

        patterns.push({
          id: uuidv4(),
          pattern_type: "sequence",
          pattern: sequence,
          frequency: seqData.count,
          confidence,
          category,
          log_rule_ids: seqData.ruleIds,
          timestamp_start: seqData.firstOccurrence,
          timestamp_end: seqData.lastOccurrence,
        });
      }
    }

    return patterns;
  }

  /**
   * Erkennt korrelierte Patterns (Association Rules)
   */
  async detectCorrelatedPatterns(logs: Log[]): Promise<Pattern[]> {
    const patterns: Pattern[] = [];
    const minCorrelation = 0.5; // Mindestkorrelation

    // Gruppiere Logs nach Kategorie
    const categoryGroups = new Map<LogCategory, Log[]>();
    for (const log of logs) {
      if (!categoryGroups.has(log.category)) {
        categoryGroups.set(log.category, []);
      }
      categoryGroups.get(log.category)!.push(log);
    }

    // Finde Korrelationen zwischen Kategorien
    const categories = Array.from(categoryGroups.keys());
    for (let i = 0; i < categories.length; i++) {
      for (let j = i + 1; j < categories.length; j++) {
        const cat1 = categories[i];
        const cat2 = categories[j];
        const logs1 = categoryGroups.get(cat1)!;
        const logs2 = categoryGroups.get(cat2)!;

        // Berechne Korrelation (vereinfacht: zeitliche Nähe)
        const correlation = this.calculateCorrelation(logs1, logs2);

        if (correlation >= minCorrelation) {
          const allLogs = [...logs1, ...logs2].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
          const ruleIds = Array.from(new Set(allLogs.map((log) => log.log_rule_id)));

          patterns.push({
            id: uuidv4(),
            pattern_type: "correlated",
            pattern: `Correlated categories: ${cat1} <-> ${cat2}`,
            frequency: logs1.length + logs2.length,
            confidence: correlation,
            category: cat1, // Primary category
            log_rule_ids: ruleIds,
            timestamp_start: allLogs[0].timestamp,
            timestamp_end: allLogs[allLogs.length - 1].timestamp,
          });
        }
      }
    }

    return patterns;
  }

  /**
   * Berechnet Korrelation zwischen zwei Log-Gruppen (zeitliche Nähe)
   */
  private calculateCorrelation(logs1: Log[], logs2: Log[]): number {
    if (logs1.length === 0 || logs2.length === 0) {
      return 0;
    }

    const timeWindow = 5 * 60 * 1000; // 5 Minuten
    let correlatedCount = 0;

    for (const log1 of logs1) {
      for (const log2 of logs2) {
        const timeDiff = Math.abs(log1.timestamp.getTime() - log2.timestamp.getTime());
        if (timeDiff <= timeWindow) {
          correlatedCount++;
          break; // Nur einmal zählen pro log1
        }
      }
    }

    return Math.min(1, correlatedCount / logs1.length);
  }
}

export const patternDetector = new PatternDetector();





