export interface TimeSession {
  id: number;
  user_id: number;
  module: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  taetigkeit: string; // Beschreibung der Aktion
  status: "active" | "completed" | "interrupted" | "paused";
  problem?: string; // Falls z.B. mehrfach erklärt werden musste, Fehler, Missverständnisse
  ausloeser?: string; // z.B. LOG.md, data-store, admin-dashboard
  category: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSessionData {
  user_id: number;
  module: string;
  taetigkeit: string; // Pflichtfeld
  ausloeser?: string;
  problem?: string;
  category?: string;
  priority?: string;
  start_time?: string;
  status?: "active" | "completed" | "interrupted" | "paused";
}

export interface CompleteSessionData {
  id: number;
  end_time?: string;
  status: "completed" | "interrupted" | "paused";
  problem?: string;
}
