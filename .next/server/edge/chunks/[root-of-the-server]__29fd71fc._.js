(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__29fd71fc._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/node:events [external] (node:events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:events", () => require("node:events"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[project]/ [middleware-edge] (unsupported edge import 'fs', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`fs`));
}),
"[project]/ [middleware-edge] (unsupported edge import 'http', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`http`));
}),
"[project]/ [middleware-edge] (unsupported edge import 'https', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`https`));
}),
"[project]/ [middleware-edge] (unsupported edge import 'zlib', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`zlib`));
}),
"[project]/ [middleware-edge] (unsupported edge import 'stream', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`stream`));
}),
"[project]/ [middleware-edge] (unsupported edge import 'net', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`net`));
}),
"[project]/ [middleware-edge] (unsupported edge import 'dns', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`dns`));
}),
"[project]/ [middleware-edge] (unsupported edge import 'os', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`os`));
}),
"[project]/ [middleware-edge] (unsupported edge import 'path', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`path`));
}),
"[project]/ [middleware-edge] (unsupported edge import 'crypto', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`crypto`));
}),
"[project]/ [middleware-edge] (unsupported edge import 'tls', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`tls`));
}),
"[project]/ [middleware-edge] (unsupported edge import 'child_process', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`child_process`));
}),
"[project]/src/lib/email-service.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// EMAIL SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: E-Mail-Versand für Kundenverwaltung
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "EmailService",
    ()=>EmailService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nodemailer$2f$lib$2f$nodemailer$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/nodemailer/lib/nodemailer.js [middleware-edge] (ecmascript)");
;
class EmailService {
    transporter;
    constructor(){
        this.transporter = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nodemailer$2f$lib$2f$nodemailer$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].createTransporter({
            host: process.env.SMTP_HOST || "localhost",
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER || "",
                pass: process.env.SMTP_PASS || ""
            }
        });
    }
    // =====================================================
    // E-MAIL-VERSAND
    // =====================================================
    async sendEmail(emailData) {
        try {
            const mailOptions = {
                from: process.env.SMTP_FROM || "noreply@lopez-it-welt.de",
                to: emailData.to,
                subject: emailData.subject,
                text: emailData.text,
                html: emailData.html
            };
            const result = await this.transporter.sendMail(mailOptions);
            console.log("✅ E-Mail erfolgreich versendet:", result.messageId);
            return true;
        } catch (error) {
            console.error("❌ E-Mail-Versand fehlgeschlagen:", error);
            return false;
        }
    }
    // =====================================================
    // KUNDEN-E-MAILS
    // =====================================================
    async sendCustomerWelcome(customer) {
        const subject = "Willkommen bei Lopez IT Welt";
        const html = this.getWelcomeHTML(customer);
        const text = this.getWelcomeText(customer);
        return await this.sendEmail({
            to: customer.email,
            subject,
            html,
            text
        });
    }
    async sendCustomerUpdate(customer, changes) {
        const subject = "Ihre Kundendaten wurden aktualisiert";
        const html = this.getUpdateHTML(customer, changes);
        const text = this.getUpdateText(customer, changes);
        return await this.sendEmail({
            to: customer.email,
            subject,
            html,
            text
        });
    }
    // =====================================================
    // ADMIN-E-MAILS
    // =====================================================
    async sendAdminNotification(subject, message, adminEmails) {
        const html = this.getAdminNotificationHTML(subject, message);
        const text = this.getAdminNotificationText(subject, message);
        return await this.sendEmail({
            to: adminEmails.join(", "),
            subject,
            html,
            text
        });
    }
    // =====================================================
    // E-MAIL-TEMPLATES
    // =====================================================
    getWelcomeHTML(customer) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Willkommen bei Lopez IT Welt</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f8fafc; }
                    .footer { background: #64748b; color: white; padding: 15px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Willkommen bei Lopez IT Welt</h1>
                    </div>
                    <div class="content">
                        <h2>Hallo ${customer.anrede} ${customer.vorname} ${customer.nachname},</h2>
                        <p>herzlich willkommen in unserem Kundenverwaltungssystem!</p>
                        <p><strong>Ihre Kundendaten:</strong></p>
                        <ul>
                            <li>Kundennummer: ${customer.kundennummer}</li>
                            <li>E-Mail: ${customer.email}</li>
                            <li>Support-Level: ${customer.support_level}</li>
                            <li>Status: ${customer.status}</li>
                        </ul>
                        <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
                        <p>Mit freundlichen Grüßen<br>Ihr Lopez IT Welt Team</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Lopez IT Welt - Vertraulich</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
    getWelcomeText(customer) {
        return `
            Willkommen bei Lopez IT Welt
            
            Hallo ${customer.anrede} ${customer.vorname} ${customer.nachname},
            
            herzlich willkommen in unserem Kundenverwaltungssystem!
            
            Ihre Kundendaten:
            - Kundennummer: ${customer.kundennummer}
            - E-Mail: ${customer.email}
            - Support-Level: ${customer.support_level}
            - Status: ${customer.status}
            
            Bei Fragen stehen wir Ihnen gerne zur Verfügung.
            
            Mit freundlichen Grüßen
            Ihr Lopez IT Welt Team
            
            © 2025 Lopez IT Welt - Vertraulich
        `;
    }
    getUpdateHTML(customer, changes) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Kundendaten aktualisiert</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f8fafc; }
                    .footer { background: #64748b; color: white; padding: 15px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Kundendaten aktualisiert</h1>
                    </div>
                    <div class="content">
                        <h2>Hallo ${customer.anrede} ${customer.vorname} ${customer.nachname},</h2>
                        <p>Ihre Kundendaten wurden erfolgreich aktualisiert.</p>
                        <p><strong>Geänderte Felder:</strong> ${changes.join(", ")}</p>
                        <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
                        <p>Mit freundlichen Grüßen<br>Ihr Lopez IT Welt Team</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Lopez IT Welt - Vertraulich</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
    getUpdateText(customer, changes) {
        return `
            Kundendaten aktualisiert
            
            Hallo ${customer.anrede} ${customer.vorname} ${customer.nachname},
            
            Ihre Kundendaten wurden erfolgreich aktualisiert.
            
            Geänderte Felder: ${changes.join(", ")}
            
            Bei Fragen stehen wir Ihnen gerne zur Verfügung.
            
            Mit freundlichen Grüßen
            Ihr Lopez IT Welt Team
            
            © 2025 Lopez IT Welt - Vertraulich
        `;
    }
    getAdminNotificationHTML(subject, message) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Admin-Benachrichtigung</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f8fafc; }
                    .footer { background: #64748b; color: white; padding: 15px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Admin-Benachrichtigung</h1>
                    </div>
                    <div class="content">
                        <h2>${subject}</h2>
                        <p>${message}</p>
                        <p><strong>Zeitstempel:</strong> ${new Date().toLocaleString("de-DE")}</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Lopez IT Welt - Vertraulich</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
    getAdminNotificationText(subject, message) {
        return `
            Admin-Benachrichtigung
            
            ${subject}
            
            ${message}
            
            Zeitstempel: ${new Date().toLocaleString("de-DE")}
            
            © 2025 Lopez IT Welt - Vertraulich
        `;
    }
    // =====================================================
    // E-MAIL-VALIDIERUNG
    // =====================================================
    async validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    // =====================================================
    // DOMAIN-STRATEGIE METHODS
    // =====================================================
    /**
   * Generiert E-Mail-Adresse basierend auf Domain-Strategie
   * Gesetzliche Namenskonvention: Doppel-Nachname zusammen + Vorname
   */ static generateEmailAddress(userData) {
        const { first_name, last_name, domain_type } = userData;
        // Gesetzliche Namenskonvention: Doppel-Nachname zusammenfügen
        const cleanFirstName = first_name.toLowerCase().replace(/[^a-zäöüß]/g, "");
        const cleanLastName = last_name.toLowerCase().replace(/[^a-zäöüß]/g, "").replace(/\s+/g, "");
        const domain = domain_type === "external" ? "lopezitwelt.de" : "lopez-team.de";
        return `${cleanFirstName}.${cleanLastName}@${domain}`;
    }
    /**
   * Generiert Display-Name für Benutzer
   */ static generateDisplayName(firstName, lastName, role) {
        const fullName = `${firstName} ${lastName}`;
        return role ? `${fullName} - ${role}` : fullName;
    }
    /**
   * Validiert E-Mail-Adresse basierend auf Domain-Strategie
   */ static validateEmailDomain(email, domainType) {
        const expectedDomain = domainType === "external" ? "lopezitwelt.de" : "lopez-team.de";
        return email.endsWith(`@${expectedDomain}`);
    }
    // =====================================================
    // E-MAIL-KONFIGURATION TESTEN
    // =====================================================
    async testConnection() {
        try {
            await this.transporter.verify();
            console.log("✅ E-Mail-Verbindung erfolgreich getestet");
            return true;
        } catch (error) {
            console.error("❌ E-Mail-Verbindung fehlgeschlagen:", error);
            return false;
        }
    }
}
}),
"[project]/src/lib/domain-strategy.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// DOMAIN STRATEGY - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Domain-Strategie Implementation (lopezitwelt.de / lopez-team.de)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "DomainStrategy",
    ()=>DomainStrategy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2d$service$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/email-service.ts [middleware-edge] (ecmascript)");
;
class DomainStrategy {
    // =====================================================
    // CHEF-BENUTZER ERSTELLEN
    // =====================================================
    /**
   * Erstellt Chef-Benutzer (ramiro.lopezrodriguez)
   */ static createChefUser() {
        return {
            first_name: "Ramiro",
            last_name: "Lopez Rodriguez",
            role: "Chef",
            domain_type: "external"
        };
    }
    /**
   * Erstellt Sohn-Benutzer (ramiro.lopezmclean)
   */ static createSohnUser() {
        return {
            first_name: "Ramiro",
            last_name: "Lopez Mc Lean",
            role: "CTO",
            domain_type: "external"
        };
    }
    // =====================================================
    // E-MAIL-GENERIERUNG
    // =====================================================
    /**
   * Generiert alle E-Mail-Adressen für einen Benutzer
   * Gesetzliche Namenskonvention: Doppel-Nachname zusammen + Vorname
   */ static generateUserEmails(user) {
        const externalEmail = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2d$service$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["EmailService"].generateEmailAddress({
            first_name: user.first_name,
            last_name: user.last_name,
            domain_type: "external"
        });
        const internalEmail = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2d$service$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["EmailService"].generateEmailAddress({
            first_name: user.first_name,
            last_name: user.last_name,
            domain_type: "internal"
        });
        const displayName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2d$service$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["EmailService"].generateDisplayName(user.first_name, user.last_name, user.role);
        return {
            external: externalEmail,
            internal: internalEmail,
            display_name: displayName
        };
    }
    // =====================================================
    // VALIDIERUNG
    // =====================================================
    /**
   * Validiert Domain-Strategie E-Mail-Adressen
   */ static validateDomainStrategy(user) {
        const emails = this.generateUserEmails(user);
        const externalValid = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2d$service$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["EmailService"].validateEmailDomain(emails.external, "external");
        const internalValid = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$email$2d$service$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["EmailService"].validateEmailDomain(emails.internal, "internal");
        return {
            external_valid: externalValid,
            internal_valid: internalValid,
            emails: {
                external: emails.external,
                internal: emails.internal
            }
        };
    }
    // =====================================================
    // DEMO-DATEN
    // =====================================================
    /**
   * Erstellt Demo-Benutzer für Domain-Strategie
   */ static createDemoUsers() {
        return [
            this.createChefUser(),
            this.createSohnUser(),
            {
                first_name: "Max",
                last_name: "Mustermann",
                role: "Support",
                domain_type: "internal"
            },
            {
                first_name: "Anna",
                last_name: "Schmidt",
                role: "Sales",
                domain_type: "internal"
            }
        ];
    }
    // =====================================================
    // SQL-INSERT GENERIERUNG
    // =====================================================
    /**
   * Generiert SQL-Insert für Chef-Benutzer
   * Gesetzliche Namenskonvention: ramiro.lopezrodriguez
   */ static generateChefUserSQL() {
        const chef = this.createChefUser();
        const emails = this.generateUserEmails(chef);
        return `
INSERT INTO lopez_users (
    username, email, email_external, email_internal, password_hash,
    first_name, last_name, display_name, domain_type, status
) VALUES (
    'ramiro.lopezrodriguez',
    '${emails.external}',
    '${emails.external}',
    '${emails.internal}',
    '$2b$12$hashed_password_here', -- In Produktion: echtes Hash
    '${chef.first_name}',
    '${chef.last_name}',
    '${emails.display_name}',
    '${chef.domain_type}',
    'active'
);`;
    }
    /**
   * Generiert SQL-Insert für Sohn-Benutzer
   * Gesetzliche Namenskonvention: ramiro.lopezmclean
   */ static generateSohnUserSQL() {
        const sohn = this.createSohnUser();
        const emails = this.generateUserEmails(sohn);
        return `
INSERT INTO lopez_users (
    username, email, email_external, email_internal, password_hash,
    first_name, last_name, display_name, domain_type, status
) VALUES (
    'ramiro.lopezmclean',
    '${emails.external}',
    '${emails.external}',
    '${emails.internal}',
    '$2b$12$hashed_password_here', -- In Produktion: echtes Hash
    '${sohn.first_name}',
    '${sohn.last_name}',
    '${emails.display_name}',
    '${sohn.domain_type}',
    'active'
);`;
    }
}
}),
"[project]/src/lib/uuid-service.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// UUID SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: UUID v4/v7 Generation für Enterprise++ Sicherheit
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
// Edge Runtime compatible UUID generation
// import { randomBytes, randomUUID } from 'crypto';
// =====================================================
// INTERFACES
// =====================================================
__turbopack_context__.s([
    "UUIDService",
    ()=>UUIDService
]);
class UUIDService {
    // =====================================================
    // UUID GENERATION
    // =====================================================
    /**
   * Generiert UUID v4 (Standard)
   * Nicht erratbar, sicher, weltweit Standard
   */ static generateV4() {
        // Edge Runtime compatible UUID v4 generation
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === "x" ? r : r & 0x3 | 0x8;
            return v.toString(16);
        });
    }
    /**
   * Generiert UUID v7 (Zeitstempel-basiert)
   * Sortierbar, zeitlich geordnet
   */ static generateV7() {
        // UUID v7 Implementation - Edge Runtime compatible
        const timestamp = Date.now();
        const random = new Uint8Array(10);
        crypto.getRandomValues(random);
        // Timestamp (48 bits)
        const timeHigh = timestamp >>> 16 & 0xffff;
        const timeLow = timestamp & 0xffff;
        // Random data (74 bits)
        const random1 = random.readUInt16BE(0) & 0x0fff; // 12 bits
        const random2 = random.readUInt16BE(2) & 0x3fff; // 14 bits
        const random3 = random.readUInt16BE(4) & 0x3fff; // 14 bits
        const random4 = random.readUInt16BE(6) & 0x3fff; // 14 bits
        const random5 = random.readUInt16BE(8) & 0x3fff; // 14 bits
        // Version 7 (0111)
        const version = 0x7000;
        // Variant (10)
        const variant = 0x8000;
        // UUID v7 Format: xxxxxxxx-xxxx-7xxx-xxxx-xxxxxxxxxxxx
        const uuid = [
            timeHigh.toString(16).padStart(4, "0"),
            timeLow.toString(16).padStart(4, "0"),
            "-",
            (random1 | version).toString(16).padStart(4, "0"),
            "-",
            (random2 | variant).toString(16).padStart(4, "0"),
            "-",
            random3.toString(16).padStart(4, "0"),
            "-",
            random4.toString(16).padStart(4, "0"),
            random5.toString(16).padStart(4, "0")
        ].join("");
        return uuid;
    }
    /**
   * Generiert sichere UUID basierend auf Konfiguration
   */ static generate(config = {
        version: "v4",
        secure: true
    }) {
        if (config.version === "v7") {
            return this.generateV7();
        }
        return this.generateV4();
    }
    // =====================================================
    // VALIDATION
    // =====================================================
    /**
   * Validiert UUID Format
   */ static isValid(uuid) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }
    /**
   * Validiert UUID v4
   */ static isV4(uuid) {
        if (!this.isValid(uuid)) return false;
        return uuid[14] === "4";
    }
    /**
   * Validiert UUID v7
   */ static isV7(uuid) {
        if (!this.isValid(uuid)) return false;
        return uuid[14] === "7";
    }
    // =====================================================
    // ENTERPRISE++ FEATURES
    // =====================================================
    /**
   * Generiert Owner UUID (spezielle Kennzeichnung)
   */ static generateOwnerUUID() {
        const uuid = this.generateV4();
        // Owner UUIDs haben spezielle Kennzeichnung
        return `owner_${uuid}`;
    }
    /**
   * Generiert Admin UUID
   */ static generateAdminUUID() {
        return this.generateV4();
    }
    /**
   * Generiert Customer UUID
   */ static generateCustomerUUID() {
        return this.generateV4();
    }
    /**
   * Generiert Session UUID
   */ static generateSessionUUID() {
        return this.generateV4();
    }
    // =====================================================
    // SECURITY FEATURES
    // =====================================================
    /**
   * Generiert sichere Random String
   */ static generateSecureRandom(length = 32) {
        return randomBytes(length).toString("hex");
    }
    /**
   * Generiert Salt für Passwort-Hashing
   */ static generateSalt() {
        return randomBytes(16).toString("hex");
    }
    /**
   * Generiert Pepper für Passwort-Hashing
   */ static generatePepper() {
        return randomBytes(16).toString("hex");
    }
}
}),
"[project]/src/lib/argon2-service.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// ARGON2ID SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Argon2id Passwort-Hashing für Enterprise++ Sicherheit
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "Argon2Service",
    ()=>Argon2Service
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__ = /*#__PURE__*/ __turbopack_context__.i("[externals]/node:buffer [external] (node:buffer, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$argon2$2f$argon2$2e$cjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/argon2/argon2.cjs [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$uuid$2d$service$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/uuid-service.ts [middleware-edge] (ecmascript)");
;
;
class Argon2Service {
    // =====================================================
    // KONFIGURATION
    // =====================================================
    /**
   * Enterprise++ Argon2id Konfiguration
   * DSGVO/ISO27001-konform
   */ static CONFIG = {
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$argon2$2f$argon2$2e$cjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,
        hashLength: 32
    };
    /**
   * Pepper für zusätzliche Sicherheit
   * Sollte in .env gespeichert werden
   */ static PEPPER = process.env.ARGON2_PEPPER || "default-pepper-change-in-production";
    // =====================================================
    // PASSWORD HASHING
    // =====================================================
    /**
   * Hasht Passwort mit Argon2id + Salt + Pepper
   */ static async hashPassword(password) {
        try {
            // Salt generieren
            const salt = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$uuid$2d$service$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["UUIDService"].generateSalt();
            // Pepper hinzufügen
            const passwordWithPepper = password + this.PEPPER;
            // Argon2id Hash generieren
            const hash = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$argon2$2f$argon2$2e$cjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].hash(passwordWithPepper, {
                type: this.CONFIG.type,
                memoryCost: this.CONFIG.memoryCost,
                timeCost: this.CONFIG.timeCost,
                parallelism: this.CONFIG.parallelism,
                hashLength: this.CONFIG.hashLength,
                salt: __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(salt, "hex")
            });
            return {
                hash,
                salt,
                pepper: this.PEPPER,
                config: this.CONFIG
            };
        } catch (error) {
            console.error("Argon2 Hash Fehler:", error);
            throw new Error("Passwort-Hashing fehlgeschlagen");
        }
    }
    /**
   * Verifiziert Passwort gegen Hash
   */ static async verifyPassword(password, hash, salt) {
        try {
            // Pepper hinzufügen
            const passwordWithPepper = password + this.PEPPER;
            // Hash verifizieren
            return await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$argon2$2f$argon2$2e$cjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].verify(hash, passwordWithPepper);
        } catch (error) {
            console.error("Argon2 Verify Fehler:", error);
            return false;
        }
    }
    // =====================================================
    // PASSWORD STRENGTH
    // =====================================================
    /**
   * Prüft Passwort-Stärke (Enterprise++ Standard)
   */ static validatePasswordStrength(password) {
        const requirements = {
            minLength: password.length >= 12,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumbers: /\d/.test(password),
            hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };
        const score = Object.values(requirements).filter(Boolean).length;
        let level;
        if (score < 3) level = "weak";
        else if (score < 4) level = "okay";
        else if (score < 5) level = "strong";
        else level = "very_strong";
        return {
            isValid: requirements.minLength && score >= 4,
            score,
            level,
            requirements
        };
    }
    // =====================================================
    // SECURITY FEATURES
    // =====================================================
    /**
   * Generiert sicheres temporäres Passwort
   */ static generateSecurePassword(length = 16) {
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let password = "";
        for(let i = 0; i < length; i++){
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    }
    /**
   * Prüft ob Passwort in der Historie ist
   */ static async isPasswordInHistory(password, history) {
        for (const oldHash of history){
            if (await this.verifyPassword(password, oldHash, "")) {
                return true;
            }
        }
        return false;
    }
    // =====================================================
    // AUDIT & COMPLIANCE
    // =====================================================
    /**
   * Erstellt Audit-Log für Passwort-Änderung
   */ static createPasswordChangeAudit(userId, action) {
        return {
            user_id: userId,
            action: `password_${action}`,
            severity: "medium",
            compliance_category: "security",
            timestamp: new Date().toISOString(),
            details: {
                hashing_algorithm: "argon2id",
                memory_cost: this.CONFIG.memoryCost,
                time_cost: this.CONFIG.timeCost,
                parallelism: this.CONFIG.parallelism
            }
        };
    }
}
}),
"[project]/ [middleware-edge] (unsupported edge import 'process', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`process`));
}),
"[project]/ [middleware-edge] (unsupported edge import 'timers', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`timers`));
}),
"[project]/ [middleware-edge] (unsupported edge import 'string_decoder', ecmascript)", ((__turbopack_context__, module, exports) => {

__turbopack_context__.n(__import_unsupported(`string_decoder`));
}),
"[project]/src/lib/database.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// DATABASE CONNECTION - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-01-19
// Zweck: MySQL-Datenbankverbindung für Enterprise++ Kundenverwaltung
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "closeConnection",
    ()=>closeConnection,
    "generateKundennummer",
    ()=>generateKundennummer,
    "getConnection",
    ()=>getConnection,
    "initializeDatabase",
    ()=>initializeDatabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mysql2/promise.js [middleware-edge] (ecmascript)");
;
// =====================================================
// DATENBANK-KONFIGURATION
// =====================================================
const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "lopez_erp",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
// =====================================================
// CONNECTION POOL
// =====================================================
let pool = null;
let isInitialized = false;
async function getConnection() {
    if (!pool) {
        try {
            pool = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].createPool(dbConfig);
            console.log("✅ MySQL Connection Pool erstellt");
            // Test-Verbindung
            const connection = await pool.getConnection();
            console.log("✅ MySQL Verbindung erfolgreich getestet");
            connection.release();
            // Automatische Initialisierung beim ersten Aufruf (nur einmal)
            if (!isInitialized) {
                try {
                    console.log("🔧 Initialisiere Datenbank-Struktur...");
                    await initializeDatabase();
                    isInitialized = true;
                    console.log("✅ Datenbank-Struktur erfolgreich initialisiert");
                } catch (initError) {
                    console.error("⚠️ Datenbank-Initialisierung fehlgeschlagen (wird ignoriert):", initError);
                // Nicht werfen, da die Tabelle möglicherweise bereits existiert
                }
            }
        } catch (error) {
            console.error("❌ MySQL Verbindungsfehler:", error);
            throw error;
        }
    }
    return pool;
}
async function initializeDatabase() {
    try {
        const connection = await getConnection();
        // =====================================================
        // KUNDEN-HAUPTTABELLE
        // =====================================================
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_customers (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                kundennummer VARCHAR(20) UNIQUE NOT NULL,
                customer_type ENUM('privat', 'firma', 'behörde', 'partner') NOT NULL,
                anrede ENUM('Herr', 'Frau', 'Divers', 'Firma', 'Keine Angabe') DEFAULT 'Keine Angabe',
                titel VARCHAR(50),
                vorname VARCHAR(100),
                nachname VARCHAR(100),
                firmenname VARCHAR(255),
                email VARCHAR(255) UNIQUE NOT NULL,
                telefon VARCHAR(50),
                strasse VARCHAR(255),
                plz VARCHAR(20),
                ort VARCHAR(100),
                land VARCHAR(100) DEFAULT 'Deutschland',
                status ENUM('aktiv', 'inaktiv', 'gesperrt') DEFAULT 'aktiv',
                support_level ENUM('Standard', 'Premium', 'SLA 24h', 'SLA 4h') DEFAULT 'Standard',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_kundennummer (kundennummer),
                INDEX idx_email (email),
                INDEX idx_status (status),
                INDEX idx_customer_type (customer_type),
                INDEX idx_support_level (support_level)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // =====================================================
        // KUNDEN-NOTIZEN
        // =====================================================
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_customer_notes (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                customer_id BIGINT NOT NULL,
                note TEXT NOT NULL,
                created_by VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES lopez_customers(id) ON DELETE CASCADE,
                INDEX idx_customer_id (customer_id),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // =====================================================
        // KUNDEN-TAGS
        // =====================================================
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_customer_tags (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                customer_id BIGINT NOT NULL,
                tag_name VARCHAR(50) NOT NULL,
                tag_color VARCHAR(7) DEFAULT '#3B82F6',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES lopez_customers(id) ON DELETE CASCADE,
                UNIQUE KEY unique_customer_tag (customer_id, tag_name),
                INDEX idx_customer_id (customer_id),
                INDEX idx_tag_name (tag_name)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // =====================================================
        // AUDIT-LOGS
        // =====================================================
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_audit_logs (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                table_name VARCHAR(50) NOT NULL,
                record_id BIGINT NOT NULL,
                action ENUM('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', '2FA_SETUP', '2FA_VERIFY', 'PASSWORD_CHANGE', 'ROLE_ASSIGN', 'PERMISSION_GRANT') NOT NULL,
                old_values JSON,
                new_values JSON,
                user_id BIGINT NOT NULL,
                username VARCHAR(100),
                ip_address VARCHAR(45),
                user_agent TEXT,
                session_id VARCHAR(255),
                risk_level ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'LOW',
                compliance_category ENUM('DATA_ACCESS', 'DATA_MODIFICATION', 'AUTHENTICATION', 'AUTHORIZATION', 'SYSTEM_CHANGE', 'SECURITY_EVENT') DEFAULT 'DATA_ACCESS',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_table_record (table_name, record_id),
                INDEX idx_user_id (user_id),
                INDEX idx_username (username),
                INDEX idx_action (action),
                INDEX idx_risk_level (risk_level),
                INDEX idx_compliance_category (compliance_category),
                INDEX idx_created_at (created_at),
                INDEX idx_session_id (session_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // =====================================================
        // RBAC/ABAC SYSTEM
        // =====================================================
        // Benutzer-Tabelle
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_users (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                email_external VARCHAR(255),         -- lopezitwelt.de für externe Kommunikation
                email_internal VARCHAR(255),         -- lopez-team.de für interne Kommunikation
                password_hash VARCHAR(255) NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                display_name VARCHAR(200),           -- "Ramiro Lopez Rodriguez - Admin"
                admin_alias VARCHAR(50),             -- "r.lopez", "r.mclean"
                domain_type ENUM('external', 'internal') DEFAULT 'internal',
                status ENUM('active', 'inactive', 'locked', 'pending') DEFAULT 'pending',
                last_login TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_username (username),
                INDEX idx_email (email),
                INDEX idx_email_external (email_external),
                INDEX idx_email_internal (email_internal),
                INDEX idx_admin_alias (admin_alias),
                INDEX idx_domain_type (domain_type),
                INDEX idx_status (status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // Rollen-Tabelle
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_roles (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL,
                description TEXT,
                level TINYINT NOT NULL DEFAULT 5,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_name (name),
                INDEX idx_level (level)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // Berechtigungen-Tabelle
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_permissions (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                resource VARCHAR(100) NOT NULL,
                action VARCHAR(50) NOT NULL,
                conditions JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_resource_action (resource, action),
                INDEX idx_resource (resource),
                INDEX idx_action (action)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // Benutzer-Rollen-Zuordnung
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_user_roles (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id BIGINT NOT NULL,
                role_id BIGINT NOT NULL,
                assigned_by BIGINT NOT NULL,
                assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP NULL,
                FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
                FOREIGN KEY (role_id) REFERENCES lopez_roles(id) ON DELETE CASCADE,
                FOREIGN KEY (assigned_by) REFERENCES lopez_users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_role (user_id, role_id),
                INDEX idx_user_id (user_id),
                INDEX idx_role_id (role_id),
                INDEX idx_expires_at (expires_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // Rollen-Berechtigungen-Zuordnung
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_role_permissions (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                role_id BIGINT NOT NULL,
                permission_id BIGINT NOT NULL,
                granted BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (role_id) REFERENCES lopez_roles(id) ON DELETE CASCADE,
                FOREIGN KEY (permission_id) REFERENCES lopez_permissions(id) ON DELETE CASCADE,
                UNIQUE KEY unique_role_permission (role_id, permission_id),
                INDEX idx_role_id (role_id),
                INDEX idx_permission_id (permission_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // Sessions-Tabelle
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_sessions (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id BIGINT NOT NULL,
                session_token VARCHAR(255) UNIQUE NOT NULL,
                ip_address VARCHAR(45),
                user_agent TEXT,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_session_token (session_token),
                INDEX idx_expires_at (expires_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // =====================================================
        // 2FA SYSTEM
        // =====================================================
        // 2FA-Secrets-Tabelle
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_user_2fa (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id BIGINT NOT NULL,
                secret VARCHAR(255) NOT NULL,
                backup_codes JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_2fa (user_id),
                INDEX idx_user_id (user_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        // 2FA-Verifikationen-Tabelle
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS lopez_user_2fa_verifications (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id BIGINT NOT NULL,
                token VARCHAR(10) NOT NULL,
                verified BOOLEAN DEFAULT FALSE,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES lopez_users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_token (token),
                INDEX idx_expires_at (expires_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log("✅ Datenbank-Tabellen erfolgreich erstellt/aktualisiert");
    } catch (error) {
        console.error("❌ Datenbank-Initialisierungsfehler:", error);
        throw error;
    }
}
async function closeConnection() {
    if (pool) {
        await pool.end();
        pool = null;
        console.log("✅ MySQL Connection Pool geschlossen");
    }
}
async function generateKundennummer() {
    try {
        const connection = await getConnection();
        // Datums- und Zeitbasiertes Format: YYYYMMDDHHMM-1 (nur ein Trennzeichen vor der Nummer)
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hour = String(now.getHours()).padStart(2, "0");
        const minute = String(now.getMinutes()).padStart(2, "0");
        const prefix = `${year}${month}${day}${hour}${minute}`;
        // Nächste Nummer für diese Stunde/Minute ermitteln
        const [rows] = await connection.execute(`SELECT MAX(CAST(SUBSTRING(kundennummer, 13) AS UNSIGNED)) as max_num 
       FROM lopez_customers 
       WHERE kundennummer LIKE ?`, [
            `${prefix}-%`
        ]);
        const maxNum = rows[0]?.max_num || 0;
        const nextNum = maxNum + 1;
        // Format: YYYYMMDDHHMM-1 (z.B. 202511012210-1)
        return `${prefix}-${nextNum}`;
    } catch (error) {
        console.error("❌ Kundennummer-Generierung fehlgeschlagen:", error);
        // Fallback: Timestamp-basiert
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hour = String(now.getHours()).padStart(2, "0");
        const minute = String(now.getMinutes()).padStart(2, "0");
        const prefix = `${year}${month}${day}${hour}${minute}`;
        return `${prefix}-${String(Date.now()).slice(-1)}`;
    }
}
}),
"[project]/src/lib/enterprise-user-service.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// ENTERPRISE++ USER SERVICE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Enterprise++ Benutzer-Management mit UUID & Argon2id
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "EnterpriseUserService",
    ()=>EnterpriseUserService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$argon2$2d$service$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/argon2-service.ts [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database.ts [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$uuid$2d$service$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/uuid-service.ts [middleware-edge] (ecmascript)");
;
;
;
class EnterpriseUserService {
    // =====================================================
    // USER CREATION
    // =====================================================
    /**
   * Erstellt neuen Enterprise++ Benutzer
   */ static async createUser(userData) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getConnection"])();
            // UUID generieren
            const userId = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$uuid$2d$service$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["UUIDService"].generateV4();
            // Passwort hashen
            const hashResult = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$argon2$2d$service$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["Argon2Service"].hashPassword(userData.password);
            // Display Name generieren
            const displayName = userData.display_name || `${userData.first_name} ${userData.last_name}${userData.role ? ` - ${userData.role}` : ""}`;
            // SQL Insert
            const [result] = await connection.execute(`
                INSERT INTO lopez_enterprise_users (
                    id, username, email, email_external, email_internal,
                    first_name, last_name, display_name, password_hash, salt, pepper,
                    is_owner, is_admin, is_employee, is_customer, role, permissions,
                    domain_type, status, password_changed_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `, [
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
                "pending"
            ]);
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
   */ static async createOwnerUser(userData) {
        const ownerData = {
            ...userData,
            is_owner: true,
            is_admin: true,
            role: "Owner",
            permissions: [
                "*"
            ],
            domain_type: "external"
        };
        return await this.createUser(ownerData);
    }
    /**
   * Erstellt Admin-Benutzer
   */ static async createAdminUser(userData) {
        const adminData = {
            ...userData,
            is_admin: true,
            role: "Admin",
            permissions: [
                "admin.*",
                "user.*",
                "customer.*"
            ],
            domain_type: "external"
        };
        return await this.createUser(adminData);
    }
    /**
   * Erstellt Employee-Benutzer
   */ static async createEmployeeUser(userData) {
        const employeeData = {
            ...userData,
            is_employee: true,
            role: "Employee",
            permissions: [
                "customer.read",
                "customer.update"
            ],
            domain_type: "internal"
        };
        return await this.createUser(employeeData);
    }
    /**
   * Erstellt Customer-Benutzer
   */ static async createCustomerUser(userData) {
        const customerData = {
            ...userData,
            is_customer: true,
            role: "Customer",
            permissions: [
                "profile.read",
                "profile.update"
            ],
            domain_type: "external"
        };
        return await this.createUser(customerData);
    }
    // =====================================================
    // USER RETRIEVAL
    // =====================================================
    /**
   * Lädt Benutzer nach ID
   */ static async getUserById(id) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute(`
                SELECT * FROM lopez_enterprise_users WHERE id = ?
            `, [
                id
            ]);
            const users = rows;
            return users[0] || null;
        } catch (error) {
            console.error("Get User by ID Fehler:", error);
            return null;
        }
    }
    /**
   * Lädt Benutzer nach Username
   */ static async getUserByUsername(username) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute(`
                SELECT * FROM lopez_enterprise_users WHERE username = ?
            `, [
                username
            ]);
            const users = rows;
            return users[0] || null;
        } catch (error) {
            console.error("Get User by Username Fehler:", error);
            return null;
        }
    }
    /**
   * Lädt Chef-Benutzer (Development Mode)
   */ static async getChefUser() {
        return await this.getUserByUsername("ramiro.lopezrodriguez");
    }
    /**
   * Lädt alle Admin-Benutzer
   */ static async getAdminUsers() {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute(`
                SELECT * FROM lopez_enterprise_users 
                WHERE is_admin = true OR is_owner = true
                ORDER BY created_at DESC
            `);
            return rows;
        } catch (error) {
            console.error("Get Admin Users Fehler:", error);
            return [];
        }
    }
    /**
   * Lädt Benutzer nach Email
   */ static async getUserByEmail(email) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute(`
                SELECT * FROM lopez_enterprise_users WHERE email = ? OR email_external = ? OR email_internal = ?
            `, [
                email,
                email,
                email
            ]);
            const users = rows;
            return users[0] || null;
        } catch (error) {
            console.error("Get User by Email Fehler:", error);
            return null;
        }
    }
    /**
   * Lädt alle Benutzer
   */ static async getAllUsers() {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute(`
                SELECT * FROM lopez_enterprise_users ORDER BY created_at DESC
            `);
            return rows;
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
   */ static async updateUser(id, userData) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getConnection"])();
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
            await connection.execute(`
                UPDATE lopez_enterprise_users 
                SET ${updateFields.join(", ")} 
                WHERE id = ?
            `, values);
            return true;
        } catch (error) {
            console.error("Update User Fehler:", error);
            return false;
        }
    }
    /**
   * Ändert Passwort
   */ static async changePassword(id, newPassword) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getConnection"])();
            // Passwort hashen
            const hashResult = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$argon2$2d$service$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["Argon2Service"].hashPassword(newPassword);
            // Passwort aktualisieren
            await connection.execute(`
                UPDATE lopez_enterprise_users 
                SET password_hash = ?, salt = ?, pepper = ?, password_changed_at = NOW() 
                WHERE id = ?
            `, [
                hashResult.hash,
                hashResult.salt,
                hashResult.pepper,
                id
            ]);
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
   */ static async addPasswordToHistory(userId, passwordHash, salt) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getConnection"])();
            await connection.execute(`
                INSERT INTO lopez_password_history (user_id, password_hash, salt) 
                VALUES (?, ?, ?)
            `, [
                userId,
                passwordHash,
                salt
            ]);
            // Alte Passwörter löschen (nur die letzten 5 behalten)
            await connection.execute(`
                DELETE FROM lopez_password_history 
                WHERE user_id = ? AND id NOT IN (
                    SELECT id FROM (
                        SELECT id FROM lopez_password_history 
                        WHERE user_id = ? 
                        ORDER BY created_at DESC 
                        LIMIT 5
                    ) AS recent_passwords
                )
            `, [
                userId,
                userId
            ]);
        } catch (error) {
            console.error("Add Password to History Fehler:", error);
        }
    }
    /**
   * Prüft ob Passwort in der Historie ist
   */ static async isPasswordInHistory(userId, password) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getConnection"])();
            const [rows] = await connection.execute(`
                SELECT password_hash, salt FROM lopez_password_history 
                WHERE user_id = ? 
                ORDER BY created_at DESC
            `, [
                userId
            ]);
            const history = rows;
            for (const entry of history){
                if (await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$argon2$2d$service$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["Argon2Service"].verifyPassword(password, entry.password_hash, entry.salt)) {
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
   */ static async verifyLogin(username, password) {
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
            const isValid = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$argon2$2d$service$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["Argon2Service"].verifyPassword(password, user.password_hash, user.salt);
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
   */ static async lockUser(id, durationMinutes = 30) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getConnection"])();
            const lockedUntil = new Date();
            lockedUntil.setMinutes(lockedUntil.getMinutes() + durationMinutes);
            await connection.execute(`
                UPDATE lopez_enterprise_users 
                SET locked_until = ?, status = 'locked' 
                WHERE id = ?
            `, [
                lockedUntil,
                id
            ]);
            return true;
        } catch (error) {
            console.error("Lock User Fehler:", error);
            return false;
        }
    }
    /**
   * Entsperrt Benutzer-Account
   */ static async unlockUser(id) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getConnection"])();
            await connection.execute(`
                UPDATE lopez_enterprise_users 
                SET locked_until = NULL, failed_login_attempts = 0, status = 'active' 
                WHERE id = ?
            `, [
                id
            ]);
            return true;
        } catch (error) {
            console.error("Unlock User Fehler:", error);
            return false;
        }
    }
    /**
   * Erhöht fehlgeschlagene Login-Versuche
   */ static async incrementFailedLogins(id) {
        try {
            const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getConnection"])();
            await connection.execute(`
                UPDATE lopez_enterprise_users 
                SET failed_login_attempts = failed_login_attempts + 1 
                WHERE id = ?
            `, [
                id
            ]);
            // Nach 5 Versuchen sperren
            const [rows] = await connection.execute(`
                SELECT failed_login_attempts FROM lopez_enterprise_users WHERE id = ?
            `, [
                id
            ]);
            const user = rows[0];
            if (user && user.failed_login_attempts >= 5) {
                await this.lockUser(id, 30);
            }
        } catch (error) {
            console.error("Increment Failed Logins Fehler:", error);
        }
    }
}
}),
"[project]/src/lib/development-mode.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// DEVELOPMENT MODE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Login optional für lokale Entwicklung
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "DevelopmentMode",
    ()=>DevelopmentMode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$domain$2d$strategy$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/domain-strategy.ts [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$enterprise$2d$user$2d$service$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/enterprise-user-service.ts [middleware-edge] (ecmascript)");
;
;
class DevelopmentMode {
    // =====================================================
    // KONFIGURATION
    // =====================================================
    /**
   * Prüft ob Development Mode aktiviert ist
   */ static isEnabled() {
        return ("TURBOPACK compile-time value", "development") === "development" && process.env.DEVELOPMENT_MODE === "true";
    }
    /**
   * Prüft ob Authentication umgangen werden soll
   */ static shouldBypassAuth() {
        return this.isEnabled() && process.env.BYPASS_AUTH === "true";
    }
    /**
   * Gibt Development Mode Konfiguration zurück
   */ static getConfig() {
        return {
            enabled: this.isEnabled(),
            bypassAuth: this.shouldBypassAuth(),
            defaultUser: {
                id: 1,
                username: "ramiro.lopezrodriguez",
                email: "ramiro.lopezrodriguez@lopezitwelt.de",
                first_name: "Ramiro",
                last_name: "Lopez Rodriguez",
                role: "Chef"
            }
        };
    }
    // =====================================================
    // AUTHENTICATION BYPASS
    // =====================================================
    /**
   * Erstellt Mock-User für Development Mode
   */ static createMockUser() {
        if (!this.shouldBypassAuth()) {
            return null;
        }
        return {
            id: "dev-chef-uuid-001",
            username: "ramiro.lopezrodriguez",
            email: "ramiro.lopezrodriguez@lopezitwelt.de",
            email_external: "ramiro.lopezrodriguez@lopezitwelt.de",
            email_internal: "ramiro.lopezrodriguez@lopez-team.de",
            first_name: "Ramiro",
            last_name: "Lopez Rodriguez",
            display_name: "Ramiro Lopez Rodriguez - Chef",
            domain_type: "external",
            status: "active",
            is_owner: true,
            is_admin: true,
            is_employee: true,
            is_customer: false,
            role: "Chef",
            roles: [
                "chef",
                "admin",
                "owner"
            ],
            permissions: [
                "*"
            ],
            two_factor_enabled: false,
            failed_login_attempts: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
    /**
   * Prüft ob Route im Development Mode umgangen werden soll
   */ static shouldBypassRoute(route) {
        if (!this.shouldBypassAuth()) {
            return false;
        }
        // Routen die im Development Mode umgangen werden
        const bypassRoutes = [
            "/api/auth/login",
            "/api/auth/logout",
            "/api/admin/*"
        ];
        return bypassRoutes.some((pattern)=>{
            if (pattern.includes("*")) {
                return route.startsWith(pattern.replace("*", ""));
            }
            return route === pattern;
        });
    }
    // =====================================================
    // MIDDLEWARE
    // =====================================================
    /**
   * Development Mode Middleware
   */ static middleware(req, res, next) {
        if (this.shouldBypassAuth()) {
            // Mock-User in Request einfügen
            req.user = this.createMockUser();
            req.isDevelopmentMode = true;
        // Development Mode: Authentication umgangen
        // Mock-User: ${req.user.display_name}
        }
        next();
    }
    // =====================================================
    // API RESPONSES
    // =====================================================
    /**
   * Erstellt Development Mode Login Response
   */ static createLoginResponse() {
        if (!this.shouldBypassAuth()) {
            return null;
        }
        return {
            success: true,
            message: "Development Mode: Login umgangen",
            user: this.createMockUser(),
            token: "dev-mode-token",
            isDevelopmentMode: true
        };
    }
    /**
   * Erstellt Development Mode Logout Response
   */ static createLogoutResponse() {
        if (!this.shouldBypassAuth()) {
            return null;
        }
        return {
            success: true,
            message: "Development Mode: Logout umgangen",
            isDevelopmentMode: true
        };
    }
    // =====================================================
    // CHEF-BENUTZER MANAGEMENT
    // =====================================================
    /**
   * Erstellt Chef-Benutzer für Development Mode
   */ static async createChefUser() {
        if (!this.isEnabled()) {
            return null;
        }
        try {
            const chefData = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$domain$2d$strategy$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["DomainStrategy"].createChefUser();
            const emails = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$domain$2d$strategy$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["DomainStrategy"].generateUserEmails(chefData);
            const userData = {
                username: "ramiro.lopezrodriguez",
                email: emails.external,
                email_external: emails.external,
                email_internal: emails.internal,
                first_name: chefData.first_name,
                last_name: chefData.last_name,
                display_name: emails.display_name,
                password: "DevMode123!",
                is_owner: true,
                is_admin: true,
                is_employee: true,
                is_customer: false,
                role: "Chef",
                permissions: [
                    "*"
                ],
                domain_type: "external"
            };
            return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$enterprise$2d$user$2d$service$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["EnterpriseUserService"].createUser(userData);
        } catch (error) {
            // Fehler beim Erstellen des Chef-Benutzers: ${error}
            return null;
        }
    }
    /**
   * Prüft ob Chef-Benutzer existiert
   */ static async checkChefUserExists() {
        try {
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$enterprise$2d$user$2d$service$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["EnterpriseUserService"].getUserByUsername("ramiro.lopezrodriguez");
            return user !== null;
        } catch  {
            return false;
        }
    }
    // =====================================================
    // ENVIRONMENT SETUP
    // =====================================================
    /**
   * Setup Development Mode Environment
   */ static async setupEnvironment() {
        if ("TURBOPACK compile-time truthy", 1) {
            // Development Mode verfügbar
            // Um zu aktivieren:
            //   DEVELOPMENT_MODE=true
            //   BYPASS_AUTH=true
            //
            // Beispiel .env.local:
            //   NODE_ENV=development
            //   DEVELOPMENT_MODE=true
            //   BYPASS_AUTH=true
            // Chef-Benutzer prüfen/erstellen
            if (this.isEnabled()) {
                const chefExists = await this.checkChefUserExists();
                if (!chefExists) {
                    // Chef-Benutzer wird erstellt...
                    const chef = await this.createChefUser();
                    if (chef) {
                    // Chef-Benutzer erfolgreich erstellt: ${chef.display_name}
                    } else {
                    // Fehler beim Erstellen des Chef-Benutzers
                    }
                } else {
                // Chef-Benutzer bereits vorhanden
                }
            }
        }
    }
}
}),
"[project]/src/middleware/development-mode.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// DEVELOPMENT MODE MIDDLEWARE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Development Mode Middleware für Next.js
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "apiDevelopmentModeMiddleware",
    ()=>apiDevelopmentModeMiddleware,
    "developmentModeMiddleware",
    ()=>developmentModeMiddleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$development$2d$mode$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/development-mode.ts [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
;
function developmentModeMiddleware(request) {
    // Nur im Development Mode aktivieren
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$development$2d$mode$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["DevelopmentMode"].isEnabled()) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Development Mode Header hinzufügen
    const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$development$2d$mode$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["DevelopmentMode"].shouldBypassAuth()) {
        response.headers.set("X-Development-Mode", "true");
        response.headers.set("X-Bypass-Auth", "true");
    // Development Mode: Middleware aktiv
    // Route: ${request.nextUrl.pathname}
    }
    return response;
}
function apiDevelopmentModeMiddleware(request) {
    // Nur für API-Routen
    if (!request.nextUrl.pathname.startsWith("/api/")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Development Mode: Mock-Response für Auth-Routen
    if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$development$2d$mode$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["DevelopmentMode"].shouldBypassAuth()) {
        const pathname = request.nextUrl.pathname;
        // Login Route
        if (pathname === "/api/auth/login" && request.method === "POST") {
            const mockResponse = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$development$2d$mode$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["DevelopmentMode"].createLoginResponse();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json(mockResponse);
        }
        // Logout Route
        if (pathname === "/api/auth/logout" && request.method === "POST") {
            const mockResponse = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$development$2d$mode$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["DevelopmentMode"].createLogoutResponse();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json(mockResponse);
        }
        // Shop Login Route
        if (pathname === "/api/auth/shop-login" && request.method === "POST") {
            const mockResponse = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$development$2d$mode$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["DevelopmentMode"].createLoginResponse();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json(mockResponse);
        }
        // Register Route - Mock Success
        if (pathname === "/api/auth/register" && request.method === "POST") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                message: "Development Mode: Registrierung umgangen",
                user: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$development$2d$mode$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["DevelopmentMode"].createMockUser(),
                isDevelopmentMode: true
            });
        }
        // Admin Routes - Mock-User hinzufügen
        if (pathname.startsWith("/api/admin/")) {
            const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
            response.headers.set("X-Development-Mode", "true");
            response.headers.set("X-Mock-User", JSON.stringify(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$development$2d$mode$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["DevelopmentMode"].createMockUser()));
            return response;
        }
        // Monitoring Routes - Mock-Daten
        if (pathname.startsWith("/api/monitoring/")) {
            const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
            response.headers.set("X-Development-Mode", "true");
            response.headers.set("X-Mock-Data", "true");
            return response;
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
}),
"[project]/src/middleware/rbac-api-guard.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * RBAC API Guard Middleware
 * Prüft serverseitig alle /api-Routen auf Berechtigungen
 */ __turbopack_context__.s([
    "rbacApiGuard",
    ()=>rbacApiGuard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
// Öffentliche API-Routen (keine Auth erforderlich)
const PUBLIC_ROUTES = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/logout",
    "/api/contact",
    "/api/content/hero",
    "/api/content/header",
    "/api/content/footer",
    "/api/health",
    "/api/monitoring/status",
    "/api/appointments/ical/export",
    "/api/invoices/pdf",
    "/api/invoices",
    "/api/admin/contact-messages/stats"
];
// Office & Finance API-Routen (Admin-Only)
const OFFICE_FINANCE_ROUTES = [
    "/api/projects",
    "/api/orders",
    "/api/tasks",
    "/api/appointments",
    "/api/invoices",
    "/api/einvoice",
    "/api/audit"
];
/**
 * Prüft ob Route öffentlich ist
 */ function isPublicRoute(pathname) {
    return PUBLIC_ROUTES.some((route)=>pathname.startsWith(route));
}
/**
 * Prüft ob Route Office & Finance betrifft
 */ function isOfficeFinanceRoute(pathname) {
    return OFFICE_FINANCE_ROUTES.some((route)=>pathname.startsWith(route));
}
function rbacApiGuard(request) {
    const pathname = request.nextUrl.pathname;
    // Öffentliche Routen ZUERST prüfen (vor Office & Finance)
    if (isPublicRoute(pathname)) {
        return null; // Weiterleitung zur eigentlichen Route
    }
    // Office & Finance Routen: Admin-Only
    // WICHTIG: Nur prüfen wenn Route NICHT öffentlich ist
    // Aber: Prüfe auch auf spezifische Pfade, nicht nur auf startsWith
    if (isOfficeFinanceRoute(pathname)) {
        // Ausnahmen: iCal-Export und PDF-Export sind öffentlich (sollten schon oben abgefangen sein, aber zur Sicherheit)
        if (pathname === "/api/appointments/ical/export" || pathname.startsWith("/api/appointments/ical/") || pathname === "/api/invoices/pdf" || pathname.startsWith("/api/invoices/pdf")) {
            return null; // Öffentlicher Zugriff erlaubt
        }
        // Prüfe Authorization Header
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Authentifizierung erforderlich"
            }, {
                status: 401
            });
        }
        // Token validieren (vereinfacht - sollte durch withAdminAccess ersetzt werden)
        // Für jetzt: Weiterleitung zur Route (mitAdminAccess wird in Route geprüft)
        return null;
    }
    // Alle anderen API-Routen: Standard-RBAC prüfen
    // (kann später erweitert werden)
    return null; // Weiterleitung zur eigentlichen Route
}
}),
"[project]/src/middleware/admin-guard.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// ADMIN GUARD MIDDLEWARE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-11-01
// Zweck: Schutz für /admin/* Routen (erfordert adm_session)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "adminApiGuard",
    ()=>adminApiGuard,
    "adminGuard",
    ()=>adminGuard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
function adminGuard(request) {
    const pathname = request.nextUrl.pathname;
    // Nur für /admin/* Routen prüfen (nicht für /admin/login selbst)
    if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
        return null;
    }
    // Session-Token aus Cookie extrahieren
    const sessionToken = request.cookies.get("adm_session")?.value;
    if (!sessionToken) {
        // Nicht authentifiziert - Redirect zu Admin-Login
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
    }
    // Session validieren (asynchron - wird in middleware.ts gehandhabt)
    // Hier nur prüfen ob Cookie vorhanden ist
    // Die eigentliche Validierung erfolgt in der API-Route
    return null; // Authentifiziert
}
function adminApiGuard(request) {
    const pathname = request.nextUrl.pathname;
    // Nur für /api/admin/* Routen prüfen
    if (!pathname.startsWith("/api/admin")) {
        return null;
    }
    // Öffentliche Admin-API-Routen (z.B. Login)
    const publicRoutes = [
        "/api/auth/admin/login",
        "/api/auth/admin/logout"
    ];
    if (publicRoutes.includes(pathname)) {
        return null;
    }
    // Session-Token aus Cookie oder Header extrahieren
    const sessionToken = request.cookies.get("adm_session")?.value || request.headers.get("authorization")?.replace("Bearer ", "");
    if (!sessionToken) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Nicht authentifiziert"
        }, {
            status: 401
        });
    }
    // Session muss adm_ Präfix haben
    if (!sessionToken.startsWith("adm_")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Ungültige Session (Admin erforderlich)"
        }, {
            status: 403
        });
    }
    return null; // Authentifiziert
}
}),
"[project]/src/middleware/shop-guard.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// SHOP GUARD MIDDLEWARE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-11-01
// Zweck: Schutz für /account/*, /shop/checkout/* Routen (erfordert shp_session)
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "shopApiGuard",
    ()=>shopApiGuard,
    "shopGuard",
    ()=>shopGuard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
function shopGuard(request) {
    const pathname = request.nextUrl.pathname;
    // Nur für /account/* und /shop/checkout/* Routen prüfen
    const protectedPaths = [
        "/account",
        "/shop/checkout"
    ];
    const isProtected = protectedPaths.some((path)=>pathname.startsWith(path));
    if (!isProtected) {
        return null;
    }
    // Öffentliche Shop-Routen (Login, Register)
    const publicRoutes = [
        "/account/login",
        "/account/register",
        "/shop/login"
    ];
    if (publicRoutes.includes(pathname)) {
        return null;
    }
    // Session-Token aus Cookie extrahieren
    const sessionToken = request.cookies.get("shp_session")?.value;
    if (!sessionToken) {
        // Nicht authentifiziert - Redirect zu Shop-Login
        const loginUrl = new URL("/account/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
    }
    // Session muss shp_ Präfix haben
    if (!sessionToken.startsWith("shp_")) {
        const loginUrl = new URL("/account/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
    }
    return null; // Authentifiziert
}
function shopApiGuard(request) {
    const pathname = request.nextUrl.pathname;
    // Nur für /api/shop/* Routen prüfen (nicht /api/auth/shop/* - die haben eigene Guards)
    if (!pathname.startsWith("/api/shop")) {
        return null;
    }
    // Öffentliche Shop-API-Routen
    const publicRoutes = [
        "/api/auth/shop/login",
        "/api/auth/shop/logout"
    ];
    if (publicRoutes.includes(pathname)) {
        return null;
    }
    // Session-Token aus Cookie oder Header extrahieren
    const sessionToken = request.cookies.get("shp_session")?.value || request.headers.get("authorization")?.replace("Bearer ", "");
    if (!sessionToken) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Nicht authentifiziert"
        }, {
            status: 401
        });
    }
    // Session muss shp_ Präfix haben
    if (!sessionToken.startsWith("shp_")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Ungültige Session (Shop erforderlich)"
        }, {
            status: 403
        });
    }
    return null; // Authentifiziert
}
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// NEXT.JS MIDDLEWARE - LOPEZ IT WELT
// =====================================================
// Erstellt: 2025-09-20
// Zweck: Next.js Middleware mit Development Mode
// Status: ✅ VOLLSTÄNDIG IMPLEMENTIERT
// =====================================================
__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$middleware$2f$development$2d$mode$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/middleware/development-mode.ts [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$middleware$2f$rbac$2d$api$2d$guard$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/middleware/rbac-api-guard.ts [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$middleware$2f$admin$2d$guard$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/middleware/admin-guard.ts [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$middleware$2f$shop$2d$guard$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/middleware/shop-guard.ts [middleware-edge] (ecmascript)");
;
;
;
;
function middleware(request) {
    const pathname = request.nextUrl.pathname;
    // API-Routen
    if (pathname.startsWith("/api/")) {
        // Admin API Guard (vor RBAC)
        const adminApiResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$middleware$2f$admin$2d$guard$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["adminApiGuard"])(request);
        if (adminApiResult) {
            return adminApiResult; // Blockiert Anfrage (401/403)
        }
        // Shop API Guard
        const shopApiResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$middleware$2f$shop$2d$guard$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["shopApiGuard"])(request);
        if (shopApiResult) {
            return shopApiResult; // Blockiert Anfrage (401/403)
        }
        // RBAC Guard (nur für /api/admin/* - serverseitige Berechtigungsprüfung)
        if (pathname.startsWith("/api/admin")) {
            const rbacResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$middleware$2f$rbac$2d$api$2d$guard$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["rbacApiGuard"])(request);
            if (rbacResult) {
                return rbacResult; // Blockiert Anfrage (401/403)
            }
        }
        // Development Mode Middleware
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$middleware$2f$development$2d$mode$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["apiDevelopmentModeMiddleware"])(request);
    }
    // Admin-Routen (/admin/*)
    const adminResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$middleware$2f$admin$2d$guard$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["adminGuard"])(request);
    if (adminResult) {
        return adminResult; // Redirect zu /admin/login
    }
    // Shop-Routen (/account/*, /shop/checkout/*)
    const shopResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$middleware$2f$shop$2d$guard$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["shopGuard"])(request);
    if (shopResult) {
        return shopResult; // Redirect zu /account/login
    }
    // Alle anderen Routen
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$middleware$2f$development$2d$mode$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["developmentModeMiddleware"])(request);
}
const config = {
    matcher: [
        /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */ "/((?!_next/static|_next/image|favicon.ico|public).*)"
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__29fd71fc._.js.map