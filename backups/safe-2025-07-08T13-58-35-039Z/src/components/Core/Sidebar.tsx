import {
  FaChartBar,
  FaClock,
  FaDatabase,
  FaFileInvoice,
  FaProjectDiagram,
  FaTicketAlt,
  FaTools,
  FaUserCog,
  FaUsers,
} from "react-icons/fa";

// Beispielhafte Rollen (kann später dynamisch aus Context kommen)
const userRole = "Techniker"; // TODO: Dynamisch aus AuthContext holen

// Menüstruktur nach Rollenmatrix
const menu = [
  {
    label: "CRM",
    icon: <FaUsers />,
    path: "/admin/crm",
    roles: ["Superadmin", "Admin", "Support"],
  },
  {
    label: "Projekte",
    icon: <FaProjectDiagram />,
    path: "/admin/projekte",
    roles: ["Superadmin", "Admin", "Support", "Techniker"],
  },
  {
    label: "Zeiterfassung",
    icon: <FaClock />,
    path: "/admin/time-tracking",
    roles: ["Superadmin", "Admin", "Support", "Techniker"],
  },
  {
    label: "Support-Tickets",
    icon: <FaTicketAlt />,
    path: "/admin/support",
    roles: ["Superadmin", "Admin", "Support", "Techniker"],
  },
  {
    label: "Monitoring",
    icon: <FaChartBar />,
    path: "/admin/monitoring",
    roles: ["Superadmin", "Admin", "Techniker"],
  },
  {
    label: "System-Logs",
    icon: <FaDatabase />,
    path: "/admin/logs",
    roles: ["Superadmin", "Admin", "Techniker"],
  },
  {
    label: "Backups",
    icon: <FaFileInvoice />,
    path: "/admin/backups",
    roles: ["Superadmin", "Admin", "Techniker"],
  },
  {
    label: "IT-Doku",
    icon: <FaTools />,
    path: "/admin/it-doku",
    roles: ["Superadmin", "Admin", "Techniker", "Support"],
  },
  {
    label: "Shop",
    icon: <FaUserCog />,
    path: "/admin/shop",
    roles: ["Superadmin", "Admin", "Shop-Admin"],
  },
  {
    label: "Abrechnung",
    icon: <FaFileInvoice />,
    path: "/admin/abrechnung",
    roles: ["Superadmin", "Admin"],
  },
];

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-black text-white flex flex-col shadow-lg">
      <div className="h-20 flex items-center justify-center border-b border-gray-800 text-2xl font-bold tracking-wide">
        Lopez IT Welt
      </div>
      <nav className="flex-1 py-6 px-2 space-y-2">
        {menu
          .filter((item) => item.roles.includes(userRole))
          .map((item) => (
            <a
              key={item.label}
              href={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-lg font-medium"
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
      </nav>
      <div className="p-4 border-t border-gray-800 text-xs text-gray-400">
        <span>Angemeldet als:</span> <b>{userRole}</b>
      </div>
    </aside>
  );
}
