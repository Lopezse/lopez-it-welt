/**
 * Data Lineage Viewer Component - Enterprise++ Standard E.2.6
 * 
 * Lineage-Graph anzeigen, Lineage-Details anzeigen und Lineage-Filter
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { logger } from "@/lib/logger";
import type { DataLineageNode, DataLineageEdge } from "@/lib/data-lineage/tracker";
import { FaDatabase, FaArrowRight, FaFilter, FaSearch } from "react-icons/fa";

interface DataLineageViewerProps {
  resourceType?: string;
  resourceId?: string;
  onNodeSelect?: (node: DataLineageNode) => void;
}

export function DataLineageViewer({ resourceType, resourceId, onNodeSelect }: DataLineageViewerProps) {
  const [nodes, setNodes] = useState<DataLineageNode[]>([]);
  const [edges, setEdges] = useState<DataLineageEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<DataLineageNode | null>(null);
  const [filters, setFilters] = useState({
    type: "",
    resource_type: "",
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (resourceType && resourceId) {
      loadLineageForResource();
    } else {
      loadAllLineage();
    }
  }, [resourceType, resourceId, filters]);

  const loadLineageForResource = async () => {
    if (!resourceType || !resourceId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/data-lineage/resource/${resourceType}/${resourceId}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Laden der Lineage");
      }

      setNodes(result.data.nodes || []);
      setEdges(result.data.edges || []);
    } catch (err) {
      logger.error("Fehler beim Laden der Data Lineage", err);
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Lineage");
    } finally {
      setLoading(false);
    }
  };

  const loadAllLineage = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (filters.type) params.append("type", filters.type);
      if (filters.resource_type) params.append("resource_type", filters.resource_type);

      const response = await fetch(`/api/admin/data-lineage/nodes?${params.toString()}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Fehler beim Laden der Lineage");
      }

      setNodes(result.data.nodes || []);
      setEdges([]); // Für alle Nodes keine Edges laden (zu groß)
    } catch (err) {
      logger.error("Fehler beim Laden der Data Lineage", err);
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Lineage");
    } finally {
      setLoading(false);
    }
  };

  const getNodeColor = (type: string): string => {
    switch (type) {
      case "source": return "#10b981"; // green
      case "transform": return "#3b82f6"; // blue
      case "destination": return "#f59e0b"; // yellow
      case "process": return "#8b5cf6"; // purple
      default: return "#6b7280"; // gray
    }
  };

  if (loading && nodes.length === 0) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 flex h-64 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Lade Data Lineage...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {/* Filter */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FaFilter className="mr-2" />
            Filter
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Typ
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              >
                <option value="">Alle</option>
                <option value="source">Source</option>
                <option value="transform">Transform</option>
                <option value="destination">Destination</option>
                <option value="process">Process</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ressourcen-Typ
              </label>
              <input
                type="text"
                value={filters.resource_type}
                onChange={(e) => setFilters({ ...filters, resource_type: e.target.value })}
                placeholder="z.B. invoice, backup, media"
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Graph-Visualisierung */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Lineage Graph</h3>
          {nodes.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Keine Nodes gefunden</p>
          ) : (
            <div className="space-y-4">
              {/* Vereinfachte Graph-Darstellung (in Produktion: echte Graph-Visualisierung mit D3.js oder ähnlich) */}
              {nodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => {
                    setSelectedNode(node);
                    if (onNodeSelect) {
                      onNodeSelect(node);
                    }
                  }}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedNode?.id === node.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: getNodeColor(node.type) }}
                    ></div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">{node.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {node.type} • {node.resource_type} • {node.resource_id}
                      </div>
                      {node.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">{node.description}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Edges anzeigen */}
              {edges.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Beziehungen</h4>
                  <div className="space-y-2">
                    {edges.map((edge) => {
                      const sourceNode = nodes.find((n) => n.id === edge.source_node_id);
                      const targetNode = nodes.find((n) => n.id === edge.target_node_id);
                      return (
                        <div key={edge.id} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">{sourceNode?.name || edge.source_node_id}</span>
                          <FaArrowRight className="mx-2" />
                          <span className="font-medium">{targetNode?.name || edge.target_node_id}</span>
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-500">
                            ({edge.relationship_type})
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Node-Details */}
      {selectedNode && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Node-Details</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">ID:</span>{" "}
                <span className="text-gray-900 dark:text-white">{selectedNode.id}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Typ:</span>{" "}
                <span className="text-gray-900 dark:text-white">{selectedNode.type}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Ressourcen-Typ:</span>{" "}
                <span className="text-gray-900 dark:text-white">{selectedNode.resource_type}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Ressourcen-ID:</span>{" "}
                <span className="text-gray-900 dark:text-white">{selectedNode.resource_id}</span>
              </div>
              {selectedNode.description && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Beschreibung:</span>{" "}
                  <span className="text-gray-900 dark:text-white">{selectedNode.description}</span>
                </div>
              )}
              {selectedNode.metadata && Object.keys(selectedNode.metadata).length > 0 && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Metadaten:</span>
                  <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-900 dark:text-white overflow-auto">
                    {JSON.stringify(selectedNode.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}



