// =====================================================
// ENTERPRISE++ USER SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Enterprise++ Benutzer-Management mit UUID & Argon2id
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================

import { Argon2Service } from "./argon2-service";
import { getConnection } from "./database";
import { UUIDService } from "./uuid-service";

// =====================================================
// INTERFACES
// =====================================================

export interface EnterpriseUser {
  id: string;
  username: string;
  email: string;
  email_external?: string;
  email_internal?: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  password_hash: string;
  salt: string;
  pepper: string;
  is_owner: boolean;
  is_admin: boolean;
  is_employee: boolean;
  is_customer: boolean;
  two_factor_enabled: boolean;
  two_factor_secret?: string;
  backup_codes?: string[];
  status: "active" | "inactive" | "locked" | "pending" | "suspended";
  role: string;
  permissions?: string[];
  domain_type: "external" | "internal";
  last_login?: string;
  password_changed_at?: string;
  failed_login_attempts: number;
  locked_until?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  email_external?: string;
  email_internal?: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  password: string;
  is_owner?: boolean;
  is_admin?: boolean;
  is_employee?: boolean;
  is_customer?: boolean;
  role?: string;
  permissions?: string[];
  domain_type?: "external" | "internal";
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  email?: string;
  email_external?: string;
  email_internal?: string;
  status?: "active" | "inactive" | "locked" | "pending" | "suspended";
  role?: string;
  permissions?: string[];
  domain_type?: "external" | "internal";
}

// =====================================================
// ENTERPRISE USER SERVICE CLASS
// =====================================================

export class EnterpriseUserService {
  // =====================================================
  // USER CREATION
  // =====================================================

  /**
   * Erstellt neuen Enterprise++ Benutzer
   */
  static async createUser(userData: CreateUserData): Promise<EnterpriseUser> {
    try {
      const connection = await getConnection();

      // UUID generieren
      const userId = UUIDService.generateV4();

      // Passwort hashen
      const hashResult = await Argon2Service.hashPassword(userData.password);

      // Display Name generieren
      const displayName =
        userData.display_name ||
        `${userData.first_name} ${userData.last_name}${userData.role ? ` - ${userData.role}` : ""}`;

      // SQL Insert
      const [result] = await connection.execute(
        `
                INSERT INTO lopez_enterprise_users (
                    id, username, email, email_external, email_internal,
                    first_name, last_name, display_name, password_hash, salt, pepper,
                    is_owner, is_admin, is_employee, is_customer, role, permissions,
                    domain_type, status, password_changed_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `,
        [
          userId,
          userData.username,
          userData.email,
          userData.email_external || null,
          userData.email_internal || null,
          userData.first_name,
          userData.last_name,
          displayName,
          hashResult.hash,
          hashResult.salt,
          hashResult.pepper,
          userData.is_owner || false,
          userData.is_admin || false,
          userData.is_employee || false,
          userData.is_customer || false,
          userData.role || "user",
          JSON.stringify(userData.permissions || []),
          userData.domain_type || "internal",
          "pending",
        ],
      );

      // Passwort-Historie speichern
      await this.addPasswordToHistory(userId, hashResult.hash, hashResult.salt);

      // Benutzer laden und zurückgeben
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error("Benutzer konnte nicht erstellt werden");
      }

      return user;
    } catch (error) {
      console.error("Enterprise User Creation Fehler:", error);
      throw new Error("Benutzer konnte nicht erstellt werden");
    }
  }

  /**
   * Erstellt Owner-Benutzer (Chef)
   */
  static async createOwnerUser(userData: CreateUserData): Promise<EnterpriseUser> {
    const ownerData = {
      ...userData,
      is_owner: true,
      is_admin: true,
      role: "Owner",
      permissions: ["*"],
      domain_type: "external" as const,
    };

    return await this.createUser(ownerData);
  }

  /**
   * Erstellt Admin-Benutzer
   */
  static async createAdminUser(userData: CreateUserData): Promise<EnterpriseUser> {
    const adminData = {
      ...userData,
      is_admin: true,
      role: "Admin",
      permissions: ["admin.*", "user.*", "customer.*"],
      domain_type: "external" as const,
    };

    return await this.createUser(adminData);
  }

  /**
   * Erstellt Employee-Benutzer
   */
  static async createEmployeeUser(userData: CreateUserData): Promise<EnterpriseUser> {
    const employeeData = {
      ...userData,
      is_employee: true,
      role: "Employee",
      permissions: ["customer.read", "customer.update"],
      domain_type: "internal" as const,
    };

    return await this.createUser(employeeData);
  }

  /**
   * Erstellt Customer-Benutzer
   */
  static async createCustomerUser(userData: CreateUserData): Promise<EnterpriseUser> {
    const customerData = {
      ...userData,
      is_customer: true,
      role: "Customer",
      permissions: ["profile.read", "profile.update"],
      domain_type: "external" as const,
    };

    return await this.createUser(customerData);
  }

  // =====================================================
  // USER RETRIEVAL
  // =====================================================

  /**
   * Lädt Benutzer nach ID
   */
  static async getUserById(id: string): Promise<EnterpriseUser | null> {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute(
        `
                SELECT * FROM lopez_enterprise_users WHERE id = ?
            `,
        [id],
      );

      const users = rows as EnterpriseUser[];
      return users[0] || null;
    } catch (error) {
      console.error("Get User by ID Fehler:", error);
      return null;
    }
  }

  /**
   * Lädt Benutzer nach Username
   */
  static async getUserByUsername(username: string): Promise<EnterpriseUser | null> {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute(
        `
                SELECT * FROM lopez_enterprise_users WHERE username = ?
            `,
        [username],
      );

      const users = rows as EnterpriseUser[];
      return users[0] || null;
    } catch (error) {
      console.error("Get User by Username Fehler:", error);
      return null;
    }
  }

  /**
   * Lädt Chef-Benutzer (Development Mode)
   */
  static async getChefUser(): Promise<EnterpriseUser | null> {
    return await this.getUserByUsername("ramiro.lopezrodriguez");
  }

  /**
   * Lädt alle Admin-Benutzer
   */
  static async getAdminUsers(): Promise<EnterpriseUser[]> {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute(
        `
                SELECT * FROM lopez_enterprise_users 
                WHERE is_admin = true OR is_owner = true
                ORDER BY created_at DESC
            `,
      );

      return rows as EnterpriseUser[];
    } catch (error) {
      console.error("Get Admin Users Fehler:", error);
      return [];
    }
  }

  /**
   * Lädt Benutzer nach Email
   */
  static async getUserByEmail(email: string): Promise<EnterpriseUser | null> {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute(
        `
                SELECT * FROM lopez_enterprise_users WHERE email = ? OR email_external = ? OR email_internal = ?
            `,
        [email, email, email],
      );

      const users = rows as EnterpriseUser[];
      return users[0] || null;
    } catch (error) {
      console.error("Get User by Email Fehler:", error);
      return null;
    }
  }

  /**
   * Lädt alle Benutzer
   */
  static async getAllUsers(): Promise<EnterpriseUser[]> {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute(`
                SELECT * FROM lopez_enterprise_users ORDER BY created_at DESC
            `);

      return rows as EnterpriseUser[];
    } catch (error) {
      console.error("Get All Users Fehler:", error);
      return [];
    }
  }

  // =====================================================
  // USER UPDATES
  // =====================================================

  /**
   * Aktualisiert Benutzer
   */
  static async updateUser(id: string, userData: UpdateUserData): Promise<boolean> {
    try {
      const connection = await getConnection();

      // Update-Felder dynamisch erstellen
      const updateFields = [];
      const values = [];

      if (userData.first_name) {
        updateFields.push("first_name = ?");
        values.push(userData.first_name);
      }
      if (userData.last_name) {
        updateFields.push("last_name = ?");
        values.push(userData.last_name);
      }
      if (userData.display_name) {
        updateFields.push("display_name = ?");
        values.push(userData.display_name);
      }
      if (userData.email) {
        updateFields.push("email = ?");
        values.push(userData.email);
      }
      if (userData.email_external) {
        updateFields.push("email_external = ?");
        values.push(userData.email_external);
      }
      if (userData.email_internal) {
        updateFields.push("email_internal = ?");
        values.push(userData.email_internal);
      }
      if (userData.status) {
        updateFields.push("status = ?");
        values.push(userData.status);
      }
      if (userData.role) {
        updateFields.push("role = ?");
        values.push(userData.role);
      }
      if (userData.permissions) {
        updateFields.push("permissions = ?");
        values.push(JSON.stringify(userData.permissions));
      }
      if (userData.domain_type) {
        updateFields.push("domain_type = ?");
        values.push(userData.domain_type);
      }

      if (updateFields.length === 0) {
        return false;
      }

      updateFields.push("updated_at = NOW()");
      values.push(id);

      await connection.execute(
        `
                UPDATE lopez_enterprise_users 
                SET ${updateFields.join(", ")} 
                WHERE id = ?
            `,
        values,
      );

      return true;
    } catch (error) {
      console.error("Update User Fehler:", error);
      return false;
    }
  }

  /**
   * Ändert Passwort
   */
  static async changePassword(id: string, newPassword: string): Promise<boolean> {
    try {
      const connection = await getConnection();

      // Passwort hashen
      const hashResult = await Argon2Service.hashPassword(newPassword);

      // Passwort aktualisieren
      await connection.execute(
        `
                UPDATE lopez_enterprise_users 
                SET password_hash = ?, salt = ?, pepper = ?, password_changed_at = NOW() 
                WHERE id = ?
            `,
        [hashResult.hash, hashResult.salt, hashResult.pepper, id],
      );

      // Passwort-Historie speichern
      await this.addPasswordToHistory(id, hashResult.hash, hashResult.salt);

      return true;
    } catch (error) {
      console.error("Change Password Fehler:", error);
      return false;
    }
  }

  // =====================================================
  // PASSWORD HISTORY
  // =====================================================

  /**
   * Fügt Passwort zur Historie hinzu
   */
  static async addPasswordToHistory(
    userId: string,
    passwordHash: string,
    salt: string,
  ): Promise<void> {
    try {
      const connection = await getConnection();

      await connection.execute(
        `
                INSERT INTO lopez_password_history (user_id, password_hash, salt) 
                VALUES (?, ?, ?)
            `,
        [userId, passwordHash, salt],
      );

      // Alte Passwörter löschen (nur die letzten 5 behalten)
      await connection.execute(
        `
                DELETE FROM lopez_password_history 
                WHERE user_id = ? AND id NOT IN (
                    SELECT id FROM (
                        SELECT id FROM lopez_password_history 
                        WHERE user_id = ? 
                        ORDER BY created_at DESC 
                        LIMIT 5
                    ) AS recent_passwords
                )
            `,
        [userId, userId],
      );
    } catch (error) {
      console.error("Add Password to History Fehler:", error);
    }
  }

  /**
   * Prüft ob Passwort in der Historie ist
   */
  static async isPasswordInHistory(userId: string, password: string): Promise<boolean> {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute(
        `
                SELECT password_hash, salt FROM lopez_password_history 
                WHERE user_id = ? 
                ORDER BY created_at DESC
            `,
        [userId],
      );

      const history = rows as { password_hash: string; salt: string }[];

      for (const entry of history) {
        if (await Argon2Service.verifyPassword(password, entry.password_hash, entry.salt)) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Check Password History Fehler:", error);
      return false;
    }
  }

  // =====================================================
  // AUTHENTICATION
  // =====================================================

  /**
   * Verifiziert Benutzer-Login
   */
  static async verifyLogin(username: string, password: string): Promise<EnterpriseUser | null> {
    try {
      // Benutzer laden
      let user = await this.getUserByUsername(username);
      if (!user) {
        user = await this.getUserByEmail(username);
      }

      if (!user) {
        return null;
      }

      // Passwort verifizieren
      const isValid = await Argon2Service.verifyPassword(password, user.password_hash, user.salt);
      if (!isValid) {
        return null;
      }

      // Status prüfen
      if (user.status !== "active") {
        return null;
      }

      // Account gesperrt?
      if (user.locked_until && new Date(user.locked_until) > new Date()) {
        return null;
      }

      return user;
    } catch (error) {
      console.error("Verify Login Fehler:", error);
      return null;
    }
  }

  // =====================================================
  // SECURITY FEATURES
  // =====================================================

  /**
   * Sperrt Benutzer-Account
   */
  static async lockUser(id: string, durationMinutes: number = 30): Promise<boolean> {
    try {
      const connection = await getConnection();
      const lockedUntil = new Date();
      lockedUntil.setMinutes(lockedUntil.getMinutes() + durationMinutes);

      await connection.execute(
        `
                UPDATE lopez_enterprise_users 
                SET locked_until = ?, status = 'locked' 
                WHERE id = ?
            `,
        [lockedUntil, id],
      );

      return true;
    } catch (error) {
      console.error("Lock User Fehler:", error);
      return false;
    }
  }

  /**
   * Entsperrt Benutzer-Account
   */
  static async unlockUser(id: string): Promise<boolean> {
    try {
      const connection = await getConnection();

      await connection.execute(
        `
                UPDATE lopez_enterprise_users 
                SET locked_until = NULL, failed_login_attempts = 0, status = 'active' 
                WHERE id = ?
            `,
        [id],
      );

      return true;
    } catch (error) {
      console.error("Unlock User Fehler:", error);
      return false;
    }
  }

  /**
   * Erhöht fehlgeschlagene Login-Versuche
   */
  static async incrementFailedLogins(id: string): Promise<void> {
    try {
      const connection = await getConnection();

      await connection.execute(
        `
                UPDATE lopez_enterprise_users 
                SET failed_login_attempts = failed_login_attempts + 1 
                WHERE id = ?
            `,
        [id],
      );

      // Nach 5 Versuchen sperren
      const [rows] = await connection.execute(
        `
                SELECT failed_login_attempts FROM lopez_enterprise_users WHERE id = ?
            `,
        [id],
      );

      const user = (rows as any[])[0];
      if (user && user.failed_login_attempts >= 5) {
        await this.lockUser(id, 30);
      }
    } catch (error) {
      console.error("Increment Failed Logins Fehler:", error);
    }
  }
}
