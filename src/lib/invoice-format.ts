/**
 * Hilfsfunktionen für Rechnungsformatierung
 * Format: Projekt: {project_name} – Aufgabe: {task_name} — {taetigkeit}
 */

/**
 * Generiert das standardisierte Rechnungsformat für Zeiteinträge
 */
export function formatInvoiceDescription(
  project_name: string | null | undefined,
  task_name: string | null | undefined,
  taetigkeit: string | null | undefined,
): string {
  if (project_name && task_name && taetigkeit) {
    return `Projekt: ${project_name} – Aufgabe: ${task_name} — ${taetigkeit}`;
  }
  // Fallback wenn nicht alle Felder vorhanden
  if (taetigkeit) {
    return taetigkeit;
  }
  return "Zeiterfassung";
}

/**
 * Formatiert einen Zeiteintrag für Rechnungen
 */
export function formatTimeEntryForInvoice(entry: {
  project_name?: string | null;
  task_title?: string | null;
  taetigkeit?: string | null;
  module?: string | null;
}): string {
  return formatInvoiceDescription(
    entry.project_name,
    entry.task_title || entry.task_title,
    entry.taetigkeit || entry.module,
  );
}


 * Hilfsfunktionen für Rechnungsformatierung
 * Format: Projekt: {project_name} – Aufgabe: {task_name} — {taetigkeit}
 */

/**
 * Generiert das standardisierte Rechnungsformat für Zeiteinträge
 */
export function formatInvoiceDescription(
  project_name: string | null | undefined,
  task_name: string | null | undefined,
  taetigkeit: string | null | undefined,
): string {
  if (project_name && task_name && taetigkeit) {
    return `Projekt: ${project_name} – Aufgabe: ${task_name} — ${taetigkeit}`;
  }
  // Fallback wenn nicht alle Felder vorhanden
  if (taetigkeit) {
    return taetigkeit;
  }
  return "Zeiterfassung";
}

/**
 * Formatiert einen Zeiteintrag für Rechnungen
 */
export function formatTimeEntryForInvoice(entry: {
  project_name?: string | null;
  task_title?: string | null;
  taetigkeit?: string | null;
  module?: string | null;
}): string {
  return formatInvoiceDescription(
    entry.project_name,
    entry.task_title || entry.task_title,
    entry.taetigkeit || entry.module,
  );
}



















