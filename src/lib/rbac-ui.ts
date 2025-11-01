export function canSee(menuKey: string, roles: string[] = []) {
  const map: Record<string, string[]> = {
    "office_finance.calendar": ["admin", "finance_manager", "project_lead"],
    "office_finance.invoices": [
      "admin",
      "finance_manager",
      "buchhaltung_readonly",
      "report_viewer",
    ],
  };

  const allowed = map[menuKey] || [];

  return roles.some((r) => allowed.includes(r)) || roles.includes("admin");
}
