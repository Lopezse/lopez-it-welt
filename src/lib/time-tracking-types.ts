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
  // Office & Finance Integration
  project_id?: number;
  order_id?: number;
  task_id?: number;
  // Problem-Flag & Lernsystem
  ursache?: string;
  lektion?: string;
  naechster_schritt?: string;
  // Abrechnungs-Flags
  approved?: number;
  invoiced?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSessionData {
  user_id: number;
  module?: string;
  taetigkeit: string; // Pflichtfeld
  ausloeser?: string;
  problem?: boolean;
  category?: string;
  priority?: string;
  start_time?: string;
  status?: "active" | "completed" | "interrupted" | "paused";
  // Office & Finance Integration (Pflichtfelder)
  project_id?: number; // Pflichtfeld
  order_id?: number;
  task_id?: number; // Pflichtfeld
  // Problem-Flag & Lernsystem
  ursache?: string;
  lektion?: string;
  naechster_schritt?: string;
  // Abrechnungs-Flags
  approved?: number;
  invoiced?: number;
}

export interface CompleteSessionData {
  id: number;
  end_time?: string;
  status: "completed" | "interrupted" | "paused";
  problem?: string;
}

  start_time?: string;
  status?: "active" | "completed" | "interrupted" | "paused";
  // Office & Finance Integration (Pflichtfelder)
  project_id?: number; // Pflichtfeld
  order_id?: number;
  task_id?: number; // Pflichtfeld
  // Problem-Flag & Lernsystem
  ursache?: string;
  lektion?: string;
  naechster_schritt?: string;
  // Abrechnungs-Flags
  approved?: number;
  invoiced?: number;
}

export interface CompleteSessionData {
  id: number;
  end_time?: string;
  status: "completed" | "interrupted" | "paused";
  problem?: string;
}
