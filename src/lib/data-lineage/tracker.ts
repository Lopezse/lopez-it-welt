/**
 * Data Lineage Tracker - Enterprise++ Standard E.2.6
 * 
 * Data Lineage-Tracking implementieren, Lineage-Daten speichern und abfragen
 */

import { createConnection } from "@/lib/db";
import { logger } from "@/lib/logger";

export interface DataLineageNode {
  id: string;
  type: "source" | "transform" | "destination" | "process";
  name: string;
  description?: string;
  resource_type: string;
  resource_id: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface DataLineageEdge {
  id: string;
  source_node_id: string;
  target_node_id: string;
  relationship_type: "reads" | "writes" | "transforms" | "copies" | "deletes";
  metadata?: Record<string, any>;
  created_at: string;
}

export interface DataLineageEvent {
  id: string;
  node_id: string;
  event_type: "create" | "read" | "update" | "delete" | "transform";
  user_id?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export class DataLineageTracker {
  /**
   * Node erstellen
   */
  async createNode(node: Omit<DataLineageNode, "id" | "created_at">): Promise<DataLineageNode> {
    try {
      const connection = await createConnection();
      const nodeId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      await connection.execute(
        `INSERT INTO enterprise_data_lineage_nodes 
         (id, type, name, description, resource_type, resource_id, metadata, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          nodeId,
          node.type,
          node.name,
          node.description || null,
          node.resource_type,
          node.resource_id,
          JSON.stringify(node.metadata || {}),
        ]
      );

      await connection.end();

      return {
        id: nodeId,
        ...node,
        created_at: new Date().toISOString(),
      };
    } catch (error) {
      logger.error("Fehler beim Erstellen des Data Lineage Nodes", error);
      throw error;
    }
  }

  /**
   * Edge erstellen
   */
  async createEdge(edge: Omit<DataLineageEdge, "id" | "created_at">): Promise<DataLineageEdge> {
    try {
      const connection = await createConnection();
      const edgeId = `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      await connection.execute(
        `INSERT INTO enterprise_data_lineage_edges 
         (id, source_node_id, target_node_id, relationship_type, metadata, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [
          edgeId,
          edge.source_node_id,
          edge.target_node_id,
          edge.relationship_type,
          JSON.stringify(edge.metadata || {}),
        ]
      );

      await connection.end();

      return {
        id: edgeId,
        ...edge,
        created_at: new Date().toISOString(),
      };
    } catch (error) {
      logger.error("Fehler beim Erstellen des Data Lineage Edges", error);
      throw error;
    }
  }

  /**
   * Event erstellen
   */
  async createEvent(event: Omit<DataLineageEvent, "id" | "timestamp">): Promise<DataLineageEvent> {
    try {
      const connection = await createConnection();
      const eventId = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      await connection.execute(
        `INSERT INTO enterprise_data_lineage_events 
         (id, node_id, event_type, user_id, metadata, timestamp)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [
          eventId,
          event.node_id,
          event.event_type,
          event.user_id || null,
          JSON.stringify(event.metadata || {}),
        ]
      );

      await connection.end();

      return {
        id: eventId,
        ...event,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error("Fehler beim Erstellen des Data Lineage Events", error);
      throw error;
    }
  }

  /**
   * Lineage für eine Ressource abrufen
   */
  async getLineageForResource(resourceType: string, resourceId: string): Promise<{
    nodes: DataLineageNode[];
    edges: DataLineageEdge[];
  }> {
    try {
      const connection = await createConnection();

      // Node finden
      const [nodeRows] = await connection.execute(
        `SELECT id, type, name, description, resource_type, resource_id, metadata, created_at
         FROM enterprise_data_lineage_nodes
         WHERE resource_type = ? AND resource_id = ?`,
        [resourceType, resourceId]
      );

      if (!Array.isArray(nodeRows) || nodeRows.length === 0) {
        await connection.end();
        return { nodes: [], edges: [] };
      }

      const node = nodeRows[0] as any;
      const nodeId = node.id;

      // Alle verbundenen Nodes finden (rekursiv)
      const allNodeIds = new Set<string>([nodeId]);
      let foundNew = true;

      while (foundNew) {
        foundNew = false;
        const [edgeRows] = await connection.execute(
          `SELECT source_node_id, target_node_id
           FROM enterprise_data_lineage_edges
           WHERE source_node_id IN (${Array.from(allNodeIds).map(() => "?").join(",")}) 
              OR target_node_id IN (${Array.from(allNodeIds).map(() => "?").join(",")})`,
          [...Array.from(allNodeIds), ...Array.from(allNodeIds)]
        );

        for (const edge of edgeRows as any[]) {
          if (!allNodeIds.has(edge.source_node_id)) {
            allNodeIds.add(edge.source_node_id);
            foundNew = true;
          }
          if (!allNodeIds.has(edge.target_node_id)) {
            allNodeIds.add(edge.target_node_id);
            foundNew = true;
          }
        }
      }

      // Alle Nodes laden
      const [allNodeRows] = await connection.execute(
        `SELECT id, type, name, description, resource_type, resource_id, metadata, created_at
         FROM enterprise_data_lineage_nodes
         WHERE id IN (${Array.from(allNodeIds).map(() => "?").join(",")})`,
        Array.from(allNodeIds)
      );

      // Alle Edges laden
      const [allEdgeRows] = await connection.execute(
        `SELECT id, source_node_id, target_node_id, relationship_type, metadata, created_at
         FROM enterprise_data_lineage_edges
         WHERE source_node_id IN (${Array.from(allNodeIds).map(() => "?").join(",")}) 
            OR target_node_id IN (${Array.from(allNodeIds).map(() => "?").join(",")})`,
        [...Array.from(allNodeIds), ...Array.from(allNodeIds)]
      );

      await connection.end();

      // Parsen
      const nodes = (allNodeRows as any[]).map((row) => ({
        ...row,
        metadata: row.metadata ? JSON.parse(row.metadata) : {},
      }));

      const edges = (allEdgeRows as any[]).map((row) => ({
        ...row,
        metadata: row.metadata ? JSON.parse(row.metadata) : {},
      }));

      return { nodes, edges };
    } catch (error) {
      logger.error("Fehler beim Abrufen der Data Lineage", error);
      throw error;
    }
  }

  /**
   * Alle Nodes abrufen
   */
  async getAllNodes(filters?: {
    type?: string;
    resource_type?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ nodes: DataLineageNode[]; total: number }> {
    try {
      const connection = await createConnection();

      let query = "SELECT id, type, name, description, resource_type, resource_id, metadata, created_at FROM enterprise_data_lineage_nodes WHERE 1=1";
      const params: any[] = [];

      if (filters?.type) {
        query += " AND type = ?";
        params.push(filters.type);
      }

      if (filters?.resource_type) {
        query += " AND resource_type = ?";
        params.push(filters.resource_type);
      }

      // Total count
      const [countRows] = await connection.execute(
        query.replace("SELECT id, type, name, description, resource_type, resource_id, metadata, created_at", "SELECT COUNT(*) as total"),
        params
      );
      const total = Array.isArray(countRows) && countRows.length > 0 ? (countRows[0] as any).total : 0;

      // Limit/Offset
      if (filters?.limit) {
        query += " LIMIT ?";
        params.push(filters.limit);
        if (filters?.offset) {
          query += " OFFSET ?";
          params.push(filters.offset);
        }
      }

      query += " ORDER BY created_at DESC";

      const [rows] = await connection.execute(query, params);

      await connection.end();

      const nodes = (rows as any[]).map((row) => ({
        ...row,
        metadata: row.metadata ? JSON.parse(row.metadata) : {},
      }));

      return { nodes, total };
    } catch (error) {
      logger.error("Fehler beim Abrufen der Data Lineage Nodes", error);
      throw error;
    }
  }

  /**
   * Events für einen Node abrufen
   */
  async getEventsForNode(nodeId: string, limit?: number): Promise<DataLineageEvent[]> {
    try {
      const connection = await createConnection();

      let query = `SELECT id, node_id, event_type, user_id, metadata, timestamp
                   FROM enterprise_data_lineage_events
                   WHERE node_id = ?
                   ORDER BY timestamp DESC`;

      const params: any[] = [nodeId];

      if (limit) {
        query += " LIMIT ?";
        params.push(limit);
      }

      const [rows] = await connection.execute(query, params);

      await connection.end();

      return (rows as any[]).map((row) => ({
        ...row,
        metadata: row.metadata ? JSON.parse(row.metadata) : {},
      }));
    } catch (error) {
      logger.error("Fehler beim Abrufen der Data Lineage Events", error);
      throw error;
    }
  }
}

// Singleton-Instanz
export const dataLineageTracker = new DataLineageTracker();



