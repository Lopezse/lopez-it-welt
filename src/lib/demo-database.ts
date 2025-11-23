// Demo-Datenbank für Entwicklung (ohne echte Datenbank)
// In Produktion durch echte Datenbank ersetzen

export interface DemoUser {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  company?: string;
  phone?: string;
  role: string;
  status: "active" | "pending" | "inactive";
  email_verified: boolean;
  two_factor_enabled: boolean;
  two_factor_setup_completed: boolean; // Neu: Setup nur einmal erlaubt
  created_at: string;
}

// Globale Demo-Benutzer-Speicher
const demoUsers: DemoUser[] = [
  {
    id: "demo_customer_1",
    email: "kunde@example.com",
    password: "kunde123",
    first_name: "Max",
    last_name: "Mustermann",
    role: "customer",
    status: "active",
    email_verified: true,
    two_factor_enabled: false,
    two_factor_setup_completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo_customer_2",
    email: "test@example.com",
    password: "test123456",
    first_name: "Test",
    last_name: "User",
    company: "Test GmbH",
    phone: "+49 123 456789",
    role: "customer",
    status: "active",
    email_verified: true,
    two_factor_enabled: false,
    two_factor_setup_completed: false,
    created_at: new Date().toISOString(),
  },
];

// Debug: Alle Benutzer ausgeben
console.log(
  "📋 Demo-Benutzer geladen:",
  demoUsers.map((u) => ({ email: u.email, password: u.password })),
);

// Demo-Datenbank-Funktionen
export const DemoDB = {
  // Benutzer nach E-Mail suchen
  findUserByEmail: (email: string): DemoUser | undefined => {
    return demoUsers.find((user) => user.email === email);
  },

  // Benutzer nach ID suchen
  findUserById: (id: string): DemoUser | undefined => {
    return demoUsers.find((user) => user.id === id);
  },

  // Neuen Benutzer erstellen
  createUser: (userData: Omit<DemoUser, "id" | "created_at">): DemoUser => {
    const newUser: DemoUser = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
    };

    demoUsers.push(newUser);
    console.log("✅ Demo-Benutzer erstellt:", {
      id: newUser.id,
      email: newUser.email,
      name: `${newUser.first_name} ${newUser.last_name}`,
      role: newUser.role,
    });

    return newUser;
  },

  // Alle Benutzer abrufen
  getAllUsers: (): DemoUser[] => {
    return [...demoUsers];
  },

  // Benutzer aktualisieren
  updateUser: (id: string, updates: Partial<DemoUser>): DemoUser | null => {
    const userIndex = demoUsers.findIndex((user) => user.id === id);
    if (userIndex === -1) return null;

    demoUsers[userIndex] = { ...demoUsers[userIndex], ...updates };
    return demoUsers[userIndex];
  },

  // Benutzer löschen
  deleteUser: (id: string): boolean => {
    const userIndex = demoUsers.findIndex((user) => user.id === id);
    if (userIndex === -1) return false;

    demoUsers.splice(userIndex, 1);
    return true;
  },
};
