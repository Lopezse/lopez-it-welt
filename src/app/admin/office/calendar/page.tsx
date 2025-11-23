"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaTimes, FaCalendar, FaClock, FaFileAlt, FaBuilding, FaTag, FaTable, FaUsers, FaCheckCircle, FaPlay, FaStop } from "react-icons/fa";

type Appointment = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  status?: string;
  date_start?: string;
  date_end?: string;
};

type Project = {
  id: number;
  project_name: string;
  project_code?: string;
};

type Employee = {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  name?: string;
};

type AppointmentWithEmployee = Appointment & {
  employee_id?: number;
  employee_username?: string;
  employee_first_name?: string;
  employee_last_name?: string;
  employee_email?: string;
  project_name?: string;
  project_code?: string;
  order_id?: number;
  order_title?: string;
  order_no?: string;
  task_id?: number;
  task_title?: string;
  is_billable?: number;
  status?: string;
  time_session_id?: number;
};

export default function CalendarPage() {
  const [items, setItems] = useState<AppointmentWithEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "table" | "day" | "week">("table");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  
  const [newAppointment, setNewAppointment] = useState({
    title: "",
    project_id: "",
    order_id: "",
    task_id: "",
    employee_id: "",
    date_start: "",
    time_start: "",
    duration: "60", // Minuten
    notes: "",
    category: "meeting",
    location: "",
    is_billable: false,
    status: "planned",
  });

  // Termine laden
  const loadAppointments = async () => {
    try {
      const res = await fetch("/api/appointments", { cache: "no-store" });
      if (!res.ok) {
        setItems([]);
        setError(null);
        return;
      }
      const data = await res.json();
      if (data.success && data.data) {
        setItems(Array.isArray(data.data.appointments) ? data.data.appointments : []);
      } else if (Array.isArray(data)) {
        setItems(data);
      } else if (Array.isArray(data.items)) {
        setItems(data.items);
      } else {
        setItems([]);
      }
    } catch (e: any) {
      console.error("Fehler beim Laden der Termine:", e);
      setItems([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  // Projekte laden
  const loadProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setProjects(Array.isArray(data.data.projects) ? data.data.projects : []);
        } else if (Array.isArray(data)) {
          setProjects(data);
        }
      }
    } catch (e: any) {
      console.error("Fehler beim Laden der Projekte:", e);
    }
  };

  // Mitarbeiter laden
  const loadEmployees = async () => {
    try {
      console.log("📥 Lade Mitarbeiter...");
      const res = await fetch("/api/admin/users");
      console.log("📦 Response Status:", res.status, res.statusText);
      
      if (res.ok) {
        const data = await res.json();
        console.log("📦 Response Data:", data);
        
        if (data.success && data.data) {
          const users = Array.isArray(data.data) ? data.data : [];
          console.log(`✅ ${users.length} Mitarbeiter geladen:`, users);
          
          const mappedEmployees = users.map((u: any) => ({
            id: u.id,
            username: u.username,
            first_name: u.first_name,
            last_name: u.last_name,
            email: u.email,
            name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.username || `User ${u.id}`,
          }));
          
          setEmployees(mappedEmployees);
          
          if (mappedEmployees.length === 0) {
            console.warn("⚠️ Keine Mitarbeiter gefunden! Bitte Benutzer in der Datenbank anlegen.");
          }
        } else {
          console.warn("⚠️ Keine Benutzer in Response:", data);
        }
      } else {
        const errorText = await res.text();
        console.error("❌ Fehler beim Laden der Mitarbeiter:", res.status, errorText);
      }
    } catch (e: any) {
      console.error("❌ Fehler beim Laden der Mitarbeiter:", e);
    }
  };

  // Aufträge laden
  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setOrders(Array.isArray(data.data.orders) ? data.data.orders : []);
        } else if (Array.isArray(data)) {
          setOrders(data);
        }
      }
    } catch (e: any) {
      console.error("Fehler beim Laden der Aufträge:", e);
    }
  };

  // Aufgaben laden (nach Projekt gefiltert)
  const loadTasks = async (projectId?: number) => {
    try {
      const url = projectId ? `/api/tasks?project_id=${projectId}` : "/api/tasks";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setTasks(Array.isArray(data.data.tasks) ? data.data.tasks : []);
        } else if (Array.isArray(data)) {
          setTasks(data);
        }
      }
    } catch (e: any) {
      console.error("Fehler beim Laden der Aufgaben:", e);
    }
  };

  // Termin startet automatisch Zeiterfassung
  const startTimeTrackingFromAppointment = async (appointment: AppointmentWithEmployee) => {
    if (!appointment.project_id || !appointment.task_id || !appointment.employee_id) {
      alert("❌ Termin benötigt Projekt, Aufgabe und Mitarbeiter für Zeiterfassung.");
      return;
    }

    try {
      const sessionData = {
        user_id: appointment.employee_id,
        project_id: appointment.project_id,
        order_id: appointment.order_id || null,
        task_id: appointment.task_id,
        taetigkeit: appointment.title,
        category: "meeting",
        priority: "medium",
      };

      const response = await fetch("/api/admin/time-tracking/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
      });

      if (response.ok) {
        const result = await response.json();
        const sessionId = result.id || result.session?.id;
        
        if (sessionId) {
          // Termin mit Session-ID aktualisieren
          await updateAppointmentSession(appointment.id, sessionId);
          alert(`✅ Zeiterfassung gestartet für Termin: ${appointment.title}`);
          loadAppointments();
        }
      } else {
        const error = await response.json();
        alert(`❌ Fehler: ${error.error || "Zeiterfassung konnte nicht gestartet werden"}`);
      }
    } catch (error) {
      console.error("❌ Fehler beim Starten der Zeiterfassung:", error);
      alert("❌ Fehler beim Starten der Zeiterfassung");
    }
  };

  // Termin mit Session-ID aktualisieren
  const updateAppointmentSession = async (appointmentId: string, sessionId: number) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time_session_id: sessionId }),
      });

      if (!response.ok) {
        console.error("❌ Fehler beim Aktualisieren des Termins");
      }
    } catch (error) {
      console.error("❌ Fehler beim Aktualisieren des Termins:", error);
    }
  };

  // Freie Zeiten für einen Tag berechnen
  const getFreeTimeSlots = (date: string, employeeId?: number) => {
    const dayStart = new Date(`${date}T08:00:00`);
    const dayEnd = new Date(`${date}T18:00:00`);
    const slots: { start: Date; end: Date; free: boolean }[] = [];
    
    // Alle 30-Minuten-Slots generieren
    for (let time = new Date(dayStart); time < dayEnd; time.setMinutes(time.getMinutes() + 30)) {
      const slotEnd = new Date(time.getTime() + 30 * 60000);
      slots.push({
        start: new Date(time),
        end: slotEnd,
        free: true,
      });
    }
    
    // Termine für diesen Tag filtern
    const dayAppointments = items.filter((appointment) => {
      const appointmentDate = appointment.date_start || appointment.starts_at;
      if (!appointmentDate) return false;
      
      const appDate = new Date(appointmentDate);
      const selected = new Date(date);
      
      return (
        appDate.getFullYear() === selected.getFullYear() &&
        appDate.getMonth() === selected.getMonth() &&
        appDate.getDate() === selected.getDate() &&
        (!employeeId || appointment.employee_id === employeeId)
      );
    });
    
    // Slots als belegt markieren
    dayAppointments.forEach((appointment) => {
      const start = new Date(appointment.date_start || appointment.starts_at);
      const end = new Date(appointment.date_end || appointment.ends_at);
      
      slots.forEach((slot) => {
        if (slot.start < end && slot.end > start) {
          slot.free = false;
        }
      });
    });
    
    return slots;
  };

  // Mitarbeitername ermitteln
  const getEmployeeName = (appointment: AppointmentWithEmployee): string => {
    // Versuche zuerst in der employees-Liste zu finden
    if (appointment.employee_id) {
      const employee = employees.find(
        (e) => String(e.id) === String(appointment.employee_id) || 
               e.id === parseInt(String(appointment.employee_id))
      );
      if (employee) {
        return employee.name || employee.username || `User ${employee.id}`;
      }
    }
    
    // Fallback: Verwende Daten aus dem Appointment
    if (appointment.employee_first_name && appointment.employee_last_name) {
      return `${appointment.employee_first_name} ${appointment.employee_last_name}`;
    }
    if (appointment.employee_username) {
      return appointment.employee_username;
    }
    if (appointment.employee_email) {
      return appointment.employee_email;
    }
    return "Keine Zuweisung";
  };

  useEffect(() => {
    loadAppointments();
    loadProjects();
    loadEmployees();
    loadOrders();
    loadTasks();
  }, []);

  // Aufgaben neu laden wenn Projekt ausgewählt wird
  useEffect(() => {
    if (newAppointment.project_id) {
      loadTasks(parseInt(newAppointment.project_id));
    } else {
      setTasks([]);
      setNewAppointment({ ...newAppointment, task_id: "" });
    }
  }, [newAppointment.project_id]);

  // Termine nach Mitarbeiter gruppieren
  const appointmentsByEmployee = items.reduce((acc, appointment) => {
    const empId = appointment.employee_id || 0;
    const empKey = String(empId); // Verwende String als Key für UUID-Kompatibilität
    if (!acc[empKey]) {
      acc[empKey] = [];
    }
    acc[empKey].push(appointment);
    return acc;
  }, {} as Record<string, AppointmentWithEmployee[]>);

  // Termin erstellen
  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAppointment.title || !newAppointment.date_start || !newAppointment.time_start) {
      alert("❌ Bitte Titel, Datum und Uhrzeit angeben.");
      return;
    }

    try {
      // Datum und Zeit kombinieren
      const startDateTime = `${newAppointment.date_start}T${newAppointment.time_start}:00`;
      const durationMinutes = parseInt(newAppointment.duration) || 60;
      const startDate = new Date(startDateTime);
      const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
      
      const appointmentData = {
        title: newAppointment.title,
        project_id: newAppointment.project_id ? parseInt(newAppointment.project_id) : null,
        order_id: newAppointment.order_id ? parseInt(newAppointment.order_id) : null,
        task_id: newAppointment.task_id ? parseInt(newAppointment.task_id) : null,
        employee_id: newAppointment.employee_id ? parseInt(newAppointment.employee_id) : null,
        date_start: startDate.toISOString().slice(0, 19).replace("T", " "),
        date_end: endDate.toISOString().slice(0, 19).replace("T", " "),
        notes: newAppointment.notes || null,
        location: newAppointment.location || null,
        is_all_day: false,
        is_billable: newAppointment.is_billable ? 1 : 0,
        status: newAppointment.status || "planned",
        created_by: 1, // Annahme: Admin-User
      };

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Termin erstellt:", data);
        alert("✅ Termin erfolgreich angelegt!");
        
        // Formular zurücksetzen
        setNewAppointment({
          title: "",
          project_id: "",
          order_id: "",
          task_id: "",
          employee_id: "",
          date_start: "",
          time_start: "",
          duration: "60",
          notes: "",
          category: "meeting",
          location: "",
          is_billable: false,
          status: "planned",
        });
        setShowAddForm(false);
        
        // Termine neu laden
        loadAppointments();
      } else {
        const error = await response.json();
        console.error("❌ Fehler beim Erstellen:", error);
        alert(`❌ Fehler: ${error.error || "Termin konnte nicht erstellt werden"}`);
      }
    } catch (error) {
      console.error("❌ Fehler beim Erstellen:", error);
      alert("❌ Fehler beim Erstellen des Termins");
    }
  };

  return (
    <main className="p-6 space-y-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Kalender</h1>
        <div className="flex items-center gap-3">
          {/* Ansichtsmodus */}
          <div className="flex gap-2 border rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
                viewMode === "table"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              title="Enterprise++ Tabellenansicht"
            >
              <FaTable className="h-3 w-3" />
              Tabelle
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Liste
            </button>
            <button
              onClick={() => setViewMode("day")}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === "day"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Tag
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === "week"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Woche
            </button>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="h-4 w-4" />
            Neuen Termin anlegen
          </button>
          <button
            className="underline text-sm"
            onClick={async () => {
            try {
              const res = await fetch("/api/appointments/ical/export");
              if (!res.ok) {
                // Auch bei Fehler versuchen, iCal zu laden (Fallback)
                const blob = await res.blob();
                if (blob.type === "text/calendar" || blob.size > 0) {
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "lopez-appointments.ics";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                  return;
                }
                throw new Error(`iCal Fehler: HTTP ${res.status}`);
              }
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "lopez-appointments.ics";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            } catch (e: any) {
              console.error("iCal-Fehler:", e);
              alert(e?.message || "iCal-Export fehlgeschlagen.");
            }
          }}
        >
          iCal-Export
        </button>
        </div>
      </header>

      {/* Dialog: Neuen Termin anlegen */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">➕ Neuen Termin anlegen</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4">
              {/* Titel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newAppointment.title}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="z.B. Kundengespräch, Abgabe, Zahlung"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Projekt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaBuilding className="inline-block mr-1" />
                    Projekt (optional)
                  </label>
                  <select
                    value={newAppointment.project_id}
                    onChange={(e) =>
                      setNewAppointment({ ...newAppointment, project_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Kein Projekt --</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.project_code ? `${project.project_code} - ` : ""}
                        {project.project_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mitarbeiter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👤 Mitarbeiter <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newAppointment.employee_id}
                    onChange={(e) =>
                      setNewAppointment({ ...newAppointment, employee_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Mitarbeiter auswählen --</option>
                    {employees.length === 0 ? (
                      <option value="" disabled>
                        ⚠️ Keine Mitarbeiter gefunden - Bitte zuerst Benutzer anlegen
                      </option>
                    ) : (
                      employees.map((employee) => (
                        <option key={employee.id} value={String(employee.id)}>
                          {employee.name || employee.username || `User ${employee.id}`}
                        </option>
                      ))
                    )}
                  </select>
                  {employees.length === 0 && (
                    <p className="text-xs text-yellow-600 mt-1">
                      💡 <strong>Lösung:</strong> Führe im Terminal aus: <code className="bg-gray-100 px-1 rounded">npm run users:create</code>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Datum */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendar className="inline-block mr-1" />
                    Datum <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newAppointment.date_start}
                    onChange={(e) =>
                      setNewAppointment({ ...newAppointment, date_start: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Uhrzeit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaClock className="inline-block mr-1" />
                    Uhrzeit (Start) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={newAppointment.time_start}
                    onChange={(e) =>
                      setNewAppointment({ ...newAppointment, time_start: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Dauer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaClock className="inline-block mr-1" />
                  Dauer (Minuten)
                </label>
                <input
                  type="number"
                  value={newAppointment.duration}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, duration: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="15"
                  max="480"
                  step="15"
                  placeholder="60"
                />
                <p className="text-xs text-gray-500 mt-1">Standard: 60 Minuten (1 Stunde)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kategorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaTag className="inline-block mr-1" />
                    Kategorie
                  </label>
                  <select
                    value={newAppointment.category}
                    onChange={(e) =>
                      setNewAppointment({ ...newAppointment, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="delivery">Abgabe</option>
                    <option value="payment">Zahlung</option>
                    <option value="maintenance">Wartung</option>
                    <option value="support">Support</option>
                    <option value="other">Sonstiges</option>
                  </select>
                </div>

                {/* Abrechenbar */}
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAppointment.is_billable}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, is_billable: e.target.checked })
                      }
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      <FaCheckCircle className="inline-block mr-1 text-green-600" />
                      Abrechenbar (für Rechnung)
                    </span>
                  </label>
                </div>
              </div>

              {/* Ort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ort (optional)
                </label>
                <input
                  type="text"
                  value={newAppointment.location}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, location: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="z.B. Büro, Kundenstandort, Online"
                />
              </div>

              {/* Beschreibung */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaFileAlt className="inline-block mr-1" />
                  Beschreibung (optional)
                </label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Weitere Details zum Termin..."
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Termin anlegen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <p>Lade Termine…</p>}
      {error && <p className="text-red-600">Fehler: {error}</p>}

      {!loading && !error && (
        <>
          {/* Mitarbeiter-Übersicht */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">👥 Mitarbeiter-Übersicht</h2>
            <div className="bg-white rounded-lg border p-4">
              {employees.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">⚠️ Keine Mitarbeiter gefunden</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Bitte führe <code className="bg-gray-100 px-2 py-1 rounded">npm run users:create</code> aus, um die Benutzer anzulegen.
                  </p>
                  <p className="text-xs text-gray-500">
                    Erwartete Benutzer:<br />
                    • <strong>r.lopez</strong> - Ramiro Lopez Rodriguez (Chef)<br />
                    • <strong>r.mclean</strong> - Ramiro Lopez Mc Lean (CTO/Sohn)
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {employees.map((employee) => (
                    <div key={employee.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">
                                {employee.name?.charAt(0)?.toUpperCase() || employee.username?.charAt(0)?.toUpperCase() || "?"}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {employee.name || employee.username || `User ${employee.id}`}
                              </div>
                              <div className="text-xs text-gray-500">
                                {employee.username && (
                                  <span className="font-mono">{employee.username}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            {employee.email && (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400">📧</span>
                                <span>{employee.email}</span>
                              </div>
                            )}
                            {employee.first_name && employee.last_name && (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400">👤</span>
                                <span>
                                  {employee.first_name} {employee.last_name}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">🆔</span>
                              <span className="font-mono text-xs">{String(employee.id)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Aktiv
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Übersicht: Termine nach Mitarbeiter */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">📊 Übersicht nach Mitarbeitern</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(appointmentsByEmployee).map(([empId, appointments]) => {
                // employee_id kann VARCHAR(36) UUID oder INT sein
                const employee = employees.find((e) => String(e.id) === String(empId) || e.id === parseInt(empId));
                const empName = employee
                  ? employee.name || employee.username || `User ${employee.id}`
                  : empId === "0"
                    ? "Keine Zuweisung"
                    : `Mitarbeiter ${empId}`;
                
                return (
                  <div key={empId} className="bg-white rounded-lg border p-4">
                    <div className="font-semibold mb-2">
                      👤 {empName}
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        ({appointments.length} {appointments.length === 1 ? "Termin" : "Termine"})
                      </span>
                    </div>
                    <div className="space-y-1">
                      {appointments.slice(0, 3).map((app) => {
                        const startDate = app.date_start || app.starts_at;
                        return (
                          <div key={app.id} className="text-sm text-gray-600">
                            <span className="font-medium">{app.title}</span>
                            {startDate && (
                              <span className="ml-2 text-xs">
                                {new Date(startDate).toLocaleDateString()} {new Date(startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            )}
                          </div>
                        );
                      })}
                      {appointments.length > 3 && (
                        <div className="text-xs text-gray-400">
                          +{appointments.length - 3} weitere...
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {Object.keys(appointmentsByEmployee).length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-8">
                  Keine Termine vorhanden
                </div>
              )}
            </div>
          </div>

          {/* Tagesansicht: Freie Zeiten */}
          {viewMode === "day" && (
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-lg font-semibold">📅 Tagesansicht</h2>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold mb-3">🕐 Verfügbare Zeitslots</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {getFreeTimeSlots(selectedDate).map((slot, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded text-xs text-center ${
                        slot.free
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-red-100 text-red-800 border border-red-300"
                      }`}
                    >
                      <div className="font-medium">
                        {slot.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                        {slot.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div className="text-xs mt-1">{slot.free ? "✅ Frei" : "❌ Belegt"}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Liste: Alle Termine */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              {viewMode === "list" ? "📋 Alle Termine" : "Termine"}
            </h2>
            <ul className="divide-y rounded-lg border">
              {items.length === 0 && (
                <li className="p-4 text-sm">Keine Termine gefunden.</li>
              )}
              {items.map((a) => {
                const startDate = a.date_start || a.starts_at;
                const endDate = a.date_end || a.ends_at;
                return (
                  <li key={a.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{a.title}</div>
                        <div className="text-sm opacity-80 mt-1">
                          {startDate && endDate
                            ? `${new Date(startDate).toLocaleString()} – ${new Date(endDate).toLocaleString()}`
                            : "Keine Zeitangabe"}
                        </div>
                        <div className="flex gap-4 mt-2 text-xs text-gray-600">
                          {a.project_name && (
                            <span>
                              <FaBuilding className="inline mr-1" />
                              {a.project_code ? `${a.project_code} - ` : ""}
                              {a.project_name}
                            </span>
                          )}
                          {a.employee_id && (
                            <span>
                              👤 {getEmployeeName(a)}
                            </span>
                          )}
                        </div>
                      </div>
                      {a.status && (
                        <div className="text-xs opacity-70 ml-4">Status: {a.status}</div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </main>
  );
}

import { useEffect, useState } from "react";
import { FaPlus, FaTimes, FaCalendar, FaClock, FaFileAlt, FaBuilding, FaTag, FaTable, FaUsers, FaCheckCircle, FaPlay, FaStop } from "react-icons/fa";

type Appointment = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  status?: string;
  date_start?: string;
  date_end?: string;
};

type Project = {
  id: number;
  project_name: string;
  project_code?: string;
};

type Employee = {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  name?: string;
};

type AppointmentWithEmployee = Appointment & {
  employee_id?: number;
  employee_username?: string;
  employee_first_name?: string;
  employee_last_name?: string;
  employee_email?: string;
  project_name?: string;
  project_code?: string;
  order_id?: number;
  order_title?: string;
  order_no?: string;
  task_id?: number;
  task_title?: string;
  is_billable?: number;
  status?: string;
  time_session_id?: number;
};

export default function CalendarPage() {
  const [items, setItems] = useState<AppointmentWithEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "table" | "day" | "week">("table");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  
  const [newAppointment, setNewAppointment] = useState({
    title: "",
    project_id: "",
    order_id: "",
    task_id: "",
    employee_id: "",
    date_start: "",
    time_start: "",
    duration: "60", // Minuten
    notes: "",
    category: "meeting",
    location: "",
    is_billable: false,
    status: "planned",
  });

  // Termine laden
  const loadAppointments = async () => {
    try {
      const res = await fetch("/api/appointments", { cache: "no-store" });
      if (!res.ok) {
        setItems([]);
        setError(null);
        return;
      }
      const data = await res.json();
      if (data.success && data.data) {
        setItems(Array.isArray(data.data.appointments) ? data.data.appointments : []);
      } else if (Array.isArray(data)) {
        setItems(data);
      } else if (Array.isArray(data.items)) {
        setItems(data.items);
      } else {
        setItems([]);
      }
    } catch (e: any) {
      console.error("Fehler beim Laden der Termine:", e);
      setItems([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  // Projekte laden
  const loadProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setProjects(Array.isArray(data.data.projects) ? data.data.projects : []);
        } else if (Array.isArray(data)) {
          setProjects(data);
        }
      }
    } catch (e: any) {
      console.error("Fehler beim Laden der Projekte:", e);
    }
  };

  // Mitarbeiter laden
  const loadEmployees = async () => {
    try {
      console.log("📥 Lade Mitarbeiter...");
      const res = await fetch("/api/admin/users");
      console.log("📦 Response Status:", res.status, res.statusText);
      
      if (res.ok) {
        const data = await res.json();
        console.log("📦 Response Data:", data);
        
        if (data.success && data.data) {
          const users = Array.isArray(data.data) ? data.data : [];
          console.log(`✅ ${users.length} Mitarbeiter geladen:`, users);
          
          const mappedEmployees = users.map((u: any) => ({
            id: u.id,
            username: u.username,
            first_name: u.first_name,
            last_name: u.last_name,
            email: u.email,
            name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.username || `User ${u.id}`,
          }));
          
          setEmployees(mappedEmployees);
          
          if (mappedEmployees.length === 0) {
            console.warn("⚠️ Keine Mitarbeiter gefunden! Bitte Benutzer in der Datenbank anlegen.");
          }
        } else {
          console.warn("⚠️ Keine Benutzer in Response:", data);
        }
      } else {
        const errorText = await res.text();
        console.error("❌ Fehler beim Laden der Mitarbeiter:", res.status, errorText);
      }
    } catch (e: any) {
      console.error("❌ Fehler beim Laden der Mitarbeiter:", e);
    }
  };

  // Aufträge laden
  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setOrders(Array.isArray(data.data.orders) ? data.data.orders : []);
        } else if (Array.isArray(data)) {
          setOrders(data);
        }
      }
    } catch (e: any) {
      console.error("Fehler beim Laden der Aufträge:", e);
    }
  };

  // Aufgaben laden (nach Projekt gefiltert)
  const loadTasks = async (projectId?: number) => {
    try {
      const url = projectId ? `/api/tasks?project_id=${projectId}` : "/api/tasks";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setTasks(Array.isArray(data.data.tasks) ? data.data.tasks : []);
        } else if (Array.isArray(data)) {
          setTasks(data);
        }
      }
    } catch (e: any) {
      console.error("Fehler beim Laden der Aufgaben:", e);
    }
  };

  // Termin startet automatisch Zeiterfassung
  const startTimeTrackingFromAppointment = async (appointment: AppointmentWithEmployee) => {
    if (!appointment.project_id || !appointment.task_id || !appointment.employee_id) {
      alert("❌ Termin benötigt Projekt, Aufgabe und Mitarbeiter für Zeiterfassung.");
      return;
    }

    try {
      const sessionData = {
        user_id: appointment.employee_id,
        project_id: appointment.project_id,
        order_id: appointment.order_id || null,
        task_id: appointment.task_id,
        taetigkeit: appointment.title,
        category: "meeting",
        priority: "medium",
      };

      const response = await fetch("/api/admin/time-tracking/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
      });

      if (response.ok) {
        const result = await response.json();
        const sessionId = result.id || result.session?.id;
        
        if (sessionId) {
          // Termin mit Session-ID aktualisieren
          await updateAppointmentSession(appointment.id, sessionId);
          alert(`✅ Zeiterfassung gestartet für Termin: ${appointment.title}`);
          loadAppointments();
        }
      } else {
        const error = await response.json();
        alert(`❌ Fehler: ${error.error || "Zeiterfassung konnte nicht gestartet werden"}`);
      }
    } catch (error) {
      console.error("❌ Fehler beim Starten der Zeiterfassung:", error);
      alert("❌ Fehler beim Starten der Zeiterfassung");
    }
  };

  // Termin mit Session-ID aktualisieren
  const updateAppointmentSession = async (appointmentId: string, sessionId: number) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time_session_id: sessionId }),
      });

      if (!response.ok) {
        console.error("❌ Fehler beim Aktualisieren des Termins");
      }
    } catch (error) {
      console.error("❌ Fehler beim Aktualisieren des Termins:", error);
    }
  };

  // Freie Zeiten für einen Tag berechnen
  const getFreeTimeSlots = (date: string, employeeId?: number) => {
    const dayStart = new Date(`${date}T08:00:00`);
    const dayEnd = new Date(`${date}T18:00:00`);
    const slots: { start: Date; end: Date; free: boolean }[] = [];
    
    // Alle 30-Minuten-Slots generieren
    for (let time = new Date(dayStart); time < dayEnd; time.setMinutes(time.getMinutes() + 30)) {
      const slotEnd = new Date(time.getTime() + 30 * 60000);
      slots.push({
        start: new Date(time),
        end: slotEnd,
        free: true,
      });
    }
    
    // Termine für diesen Tag filtern
    const dayAppointments = items.filter((appointment) => {
      const appointmentDate = appointment.date_start || appointment.starts_at;
      if (!appointmentDate) return false;
      
      const appDate = new Date(appointmentDate);
      const selected = new Date(date);
      
      return (
        appDate.getFullYear() === selected.getFullYear() &&
        appDate.getMonth() === selected.getMonth() &&
        appDate.getDate() === selected.getDate() &&
        (!employeeId || appointment.employee_id === employeeId)
      );
    });
    
    // Slots als belegt markieren
    dayAppointments.forEach((appointment) => {
      const start = new Date(appointment.date_start || appointment.starts_at);
      const end = new Date(appointment.date_end || appointment.ends_at);
      
      slots.forEach((slot) => {
        if (slot.start < end && slot.end > start) {
          slot.free = false;
        }
      });
    });
    
    return slots;
  };

  // Mitarbeitername ermitteln
  const getEmployeeName = (appointment: AppointmentWithEmployee): string => {
    // Versuche zuerst in der employees-Liste zu finden
    if (appointment.employee_id) {
      const employee = employees.find(
        (e) => String(e.id) === String(appointment.employee_id) || 
               e.id === parseInt(String(appointment.employee_id))
      );
      if (employee) {
        return employee.name || employee.username || `User ${employee.id}`;
      }
    }
    
    // Fallback: Verwende Daten aus dem Appointment
    if (appointment.employee_first_name && appointment.employee_last_name) {
      return `${appointment.employee_first_name} ${appointment.employee_last_name}`;
    }
    if (appointment.employee_username) {
      return appointment.employee_username;
    }
    if (appointment.employee_email) {
      return appointment.employee_email;
    }
    return "Keine Zuweisung";
  };

  useEffect(() => {
    loadAppointments();
    loadProjects();
    loadEmployees();
    loadOrders();
    loadTasks();
  }, []);

  // Aufgaben neu laden wenn Projekt ausgewählt wird
  useEffect(() => {
    if (newAppointment.project_id) {
      loadTasks(parseInt(newAppointment.project_id));
    } else {
      setTasks([]);
      setNewAppointment({ ...newAppointment, task_id: "" });
    }
  }, [newAppointment.project_id]);

  // Termine nach Mitarbeiter gruppieren
  const appointmentsByEmployee = items.reduce((acc, appointment) => {
    const empId = appointment.employee_id || 0;
    const empKey = String(empId); // Verwende String als Key für UUID-Kompatibilität
    if (!acc[empKey]) {
      acc[empKey] = [];
    }
    acc[empKey].push(appointment);
    return acc;
  }, {} as Record<string, AppointmentWithEmployee[]>);

  // Termin erstellen
  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAppointment.title || !newAppointment.date_start || !newAppointment.time_start) {
      alert("❌ Bitte Titel, Datum und Uhrzeit angeben.");
      return;
    }

    try {
      // Datum und Zeit kombinieren
      const startDateTime = `${newAppointment.date_start}T${newAppointment.time_start}:00`;
      const durationMinutes = parseInt(newAppointment.duration) || 60;
      const startDate = new Date(startDateTime);
      const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
      
      const appointmentData = {
        title: newAppointment.title,
        project_id: newAppointment.project_id ? parseInt(newAppointment.project_id) : null,
        order_id: newAppointment.order_id ? parseInt(newAppointment.order_id) : null,
        task_id: newAppointment.task_id ? parseInt(newAppointment.task_id) : null,
        employee_id: newAppointment.employee_id ? parseInt(newAppointment.employee_id) : null,
        date_start: startDate.toISOString().slice(0, 19).replace("T", " "),
        date_end: endDate.toISOString().slice(0, 19).replace("T", " "),
        notes: newAppointment.notes || null,
        location: newAppointment.location || null,
        is_all_day: false,
        is_billable: newAppointment.is_billable ? 1 : 0,
        status: newAppointment.status || "planned",
        created_by: 1, // Annahme: Admin-User
      };

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Termin erstellt:", data);
        alert("✅ Termin erfolgreich angelegt!");
        
        // Formular zurücksetzen
        setNewAppointment({
          title: "",
          project_id: "",
          order_id: "",
          task_id: "",
          employee_id: "",
          date_start: "",
          time_start: "",
          duration: "60",
          notes: "",
          category: "meeting",
          location: "",
          is_billable: false,
          status: "planned",
        });
        setShowAddForm(false);
        
        // Termine neu laden
        loadAppointments();
      } else {
        const error = await response.json();
        console.error("❌ Fehler beim Erstellen:", error);
        alert(`❌ Fehler: ${error.error || "Termin konnte nicht erstellt werden"}`);
      }
    } catch (error) {
      console.error("❌ Fehler beim Erstellen:", error);
      alert("❌ Fehler beim Erstellen des Termins");
    }
  };

  return (
    <main className="p-6 space-y-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Kalender</h1>
        <div className="flex items-center gap-3">
          {/* Ansichtsmodus */}
          <div className="flex gap-2 border rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
                viewMode === "table"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              title="Enterprise++ Tabellenansicht"
            >
              <FaTable className="h-3 w-3" />
              Tabelle
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Liste
            </button>
            <button
              onClick={() => setViewMode("day")}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === "day"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Tag
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === "week"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Woche
            </button>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="h-4 w-4" />
            Neuen Termin anlegen
          </button>
          <button
            className="underline text-sm"
            onClick={async () => {
            try {
              const res = await fetch("/api/appointments/ical/export");
              if (!res.ok) {
                // Auch bei Fehler versuchen, iCal zu laden (Fallback)
                const blob = await res.blob();
                if (blob.type === "text/calendar" || blob.size > 0) {
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "lopez-appointments.ics";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                  return;
                }
                throw new Error(`iCal Fehler: HTTP ${res.status}`);
              }
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "lopez-appointments.ics";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            } catch (e: any) {
              console.error("iCal-Fehler:", e);
              alert(e?.message || "iCal-Export fehlgeschlagen.");
            }
          }}
        >
          iCal-Export
        </button>
        </div>
      </header>

      {/* Dialog: Neuen Termin anlegen */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">➕ Neuen Termin anlegen</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4">
              {/* Titel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newAppointment.title}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="z.B. Kundengespräch, Abgabe, Zahlung"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Projekt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaBuilding className="inline-block mr-1" />
                    Projekt (optional)
                  </label>
                  <select
                    value={newAppointment.project_id}
                    onChange={(e) =>
                      setNewAppointment({ ...newAppointment, project_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Kein Projekt --</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.project_code ? `${project.project_code} - ` : ""}
                        {project.project_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mitarbeiter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👤 Mitarbeiter <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newAppointment.employee_id}
                    onChange={(e) =>
                      setNewAppointment({ ...newAppointment, employee_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Mitarbeiter auswählen --</option>
                    {employees.length === 0 ? (
                      <option value="" disabled>
                        ⚠️ Keine Mitarbeiter gefunden - Bitte zuerst Benutzer anlegen
                      </option>
                    ) : (
                      employees.map((employee) => (
                        <option key={employee.id} value={String(employee.id)}>
                          {employee.name || employee.username || `User ${employee.id}`}
                        </option>
                      ))
                    )}
                  </select>
                  {employees.length === 0 && (
                    <p className="text-xs text-yellow-600 mt-1">
                      💡 <strong>Lösung:</strong> Führe im Terminal aus: <code className="bg-gray-100 px-1 rounded">npm run users:create</code>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Datum */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendar className="inline-block mr-1" />
                    Datum <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newAppointment.date_start}
                    onChange={(e) =>
                      setNewAppointment({ ...newAppointment, date_start: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Uhrzeit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaClock className="inline-block mr-1" />
                    Uhrzeit (Start) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={newAppointment.time_start}
                    onChange={(e) =>
                      setNewAppointment({ ...newAppointment, time_start: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Dauer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaClock className="inline-block mr-1" />
                  Dauer (Minuten)
                </label>
                <input
                  type="number"
                  value={newAppointment.duration}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, duration: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="15"
                  max="480"
                  step="15"
                  placeholder="60"
                />
                <p className="text-xs text-gray-500 mt-1">Standard: 60 Minuten (1 Stunde)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kategorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaTag className="inline-block mr-1" />
                    Kategorie
                  </label>
                  <select
                    value={newAppointment.category}
                    onChange={(e) =>
                      setNewAppointment({ ...newAppointment, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="delivery">Abgabe</option>
                    <option value="payment">Zahlung</option>
                    <option value="maintenance">Wartung</option>
                    <option value="support">Support</option>
                    <option value="other">Sonstiges</option>
                  </select>
                </div>

                {/* Abrechenbar */}
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAppointment.is_billable}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, is_billable: e.target.checked })
                      }
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      <FaCheckCircle className="inline-block mr-1 text-green-600" />
                      Abrechenbar (für Rechnung)
                    </span>
                  </label>
                </div>
              </div>

              {/* Ort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ort (optional)
                </label>
                <input
                  type="text"
                  value={newAppointment.location}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, location: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="z.B. Büro, Kundenstandort, Online"
                />
              </div>

              {/* Beschreibung */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaFileAlt className="inline-block mr-1" />
                  Beschreibung (optional)
                </label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Weitere Details zum Termin..."
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Termin anlegen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <p>Lade Termine…</p>}
      {error && <p className="text-red-600">Fehler: {error}</p>}

      {!loading && !error && (
        <>
          {/* Mitarbeiter-Übersicht */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">👥 Mitarbeiter-Übersicht</h2>
            <div className="bg-white rounded-lg border p-4">
              {employees.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">⚠️ Keine Mitarbeiter gefunden</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Bitte führe <code className="bg-gray-100 px-2 py-1 rounded">npm run users:create</code> aus, um die Benutzer anzulegen.
                  </p>
                  <p className="text-xs text-gray-500">
                    Erwartete Benutzer:<br />
                    • <strong>r.lopez</strong> - Ramiro Lopez Rodriguez (Chef)<br />
                    • <strong>r.mclean</strong> - Ramiro Lopez Mc Lean (CTO/Sohn)
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {employees.map((employee) => (
                    <div key={employee.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">
                                {employee.name?.charAt(0)?.toUpperCase() || employee.username?.charAt(0)?.toUpperCase() || "?"}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {employee.name || employee.username || `User ${employee.id}`}
                              </div>
                              <div className="text-xs text-gray-500">
                                {employee.username && (
                                  <span className="font-mono">{employee.username}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            {employee.email && (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400">📧</span>
                                <span>{employee.email}</span>
                              </div>
                            )}
                            {employee.first_name && employee.last_name && (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400">👤</span>
                                <span>
                                  {employee.first_name} {employee.last_name}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">🆔</span>
                              <span className="font-mono text-xs">{String(employee.id)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Aktiv
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Übersicht: Termine nach Mitarbeiter */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">📊 Übersicht nach Mitarbeitern</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(appointmentsByEmployee).map(([empId, appointments]) => {
                // employee_id kann VARCHAR(36) UUID oder INT sein
                const employee = employees.find((e) => String(e.id) === String(empId) || e.id === parseInt(empId));
                const empName = employee
                  ? employee.name || employee.username || `User ${employee.id}`
                  : empId === "0"
                    ? "Keine Zuweisung"
                    : `Mitarbeiter ${empId}`;
                
                return (
                  <div key={empId} className="bg-white rounded-lg border p-4">
                    <div className="font-semibold mb-2">
                      👤 {empName}
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        ({appointments.length} {appointments.length === 1 ? "Termin" : "Termine"})
                      </span>
                    </div>
                    <div className="space-y-1">
                      {appointments.slice(0, 3).map((app) => {
                        const startDate = app.date_start || app.starts_at;
                        return (
                          <div key={app.id} className="text-sm text-gray-600">
                            <span className="font-medium">{app.title}</span>
                            {startDate && (
                              <span className="ml-2 text-xs">
                                {new Date(startDate).toLocaleDateString()} {new Date(startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            )}
                          </div>
                        );
                      })}
                      {appointments.length > 3 && (
                        <div className="text-xs text-gray-400">
                          +{appointments.length - 3} weitere...
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {Object.keys(appointmentsByEmployee).length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-8">
                  Keine Termine vorhanden
                </div>
              )}
            </div>
          </div>

          {/* Tagesansicht: Freie Zeiten */}
          {viewMode === "day" && (
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-lg font-semibold">📅 Tagesansicht</h2>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold mb-3">🕐 Verfügbare Zeitslots</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {getFreeTimeSlots(selectedDate).map((slot, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded text-xs text-center ${
                        slot.free
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-red-100 text-red-800 border border-red-300"
                      }`}
                    >
                      <div className="font-medium">
                        {slot.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                        {slot.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div className="text-xs mt-1">{slot.free ? "✅ Frei" : "❌ Belegt"}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Liste: Alle Termine */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              {viewMode === "list" ? "📋 Alle Termine" : "Termine"}
            </h2>
            <ul className="divide-y rounded-lg border">
              {items.length === 0 && (
                <li className="p-4 text-sm">Keine Termine gefunden.</li>
              )}
              {items.map((a) => {
                const startDate = a.date_start || a.starts_at;
                const endDate = a.date_end || a.ends_at;
                return (
                  <li key={a.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{a.title}</div>
                        <div className="text-sm opacity-80 mt-1">
                          {startDate && endDate
                            ? `${new Date(startDate).toLocaleString()} – ${new Date(endDate).toLocaleString()}`
                            : "Keine Zeitangabe"}
                        </div>
                        <div className="flex gap-4 mt-2 text-xs text-gray-600">
                          {a.project_name && (
                            <span>
                              <FaBuilding className="inline mr-1" />
                              {a.project_code ? `${a.project_code} - ` : ""}
                              {a.project_name}
                            </span>
                          )}
                          {a.employee_id && (
                            <span>
                              👤 {getEmployeeName(a)}
                            </span>
                          )}
                        </div>
                      </div>
                      {a.status && (
                        <div className="text-xs opacity-70 ml-4">Status: {a.status}</div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </main>
  );
}
