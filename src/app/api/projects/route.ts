// =====================================================
// PROJEKTE API - LOPEZ IT WELT (ENTERPRISE++)
// =====================================================
// Phase 3: Admin Foundation - Projektverwaltung
// =====================================================

import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/database";
import { SessionSecurityService } from "@/lib/session-security";
import { AuditService } from "@/lib/audit-service";

// GET - Alle Projekte laden
export async function GET(request: NextRequest) {
  try {
    // Session validieren
    const sessionToken = request.cookies.get("adm_session")?.value;
    const jwtToken = request.cookies.get("adm_token")?.value;
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const validation = await SessionSecurityService.validateSession(
      sessionToken, jwtToken, clientIp, userAgent
    );

    if (!validation.valid) {
      return NextResponse.json({ success: false, message: "Nicht autorisiert" }, { status: 401 });
    }

    // Permission: admin.projects.view
    const hasViewPermission = validation.session?.permissions.some(p => 
      p === "admin.projects.view" || p.startsWith("admin.projects.")
    );
    if (!hasViewPermission && !validation.session?.roles.includes("Super Admin")) {
      return NextResponse.json({ success: false, message: "Keine Berechtigung" }, { status: 403 });
    }

    const pool = await getConnection();
    
    // Query-Parameter
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const customerId = searchParams.get("customer_id");
    const search = searchParams.get("search");

    let query = `
      SELECT p.*, 
             c.firmenname as company_name, 
             c.vorname, c.nachname, c.email as customer_email,
             u.username as assigned_username
      FROM lopez_projects p
      LEFT JOIN lopez_customers c ON p.customer_id = c.id
      LEFT JOIN lopez_users u ON p.assigned_user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      query += " AND p.status = ?";
      params.push(status);
    }

    if (customerId) {
      query += " AND p.customer_id = ?";
      params.push(customerId);
    }

    if (search) {
      query += " AND (p.project_name LIKE ? OR p.project_code LIKE ? OR p.description LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += " ORDER BY p.created_at DESC";

    const [projects] = await pool.execute(query, params);

    return NextResponse.json({
      success: true,
      data: {
        projects,
        total: (projects as any[]).length,
      },
    });
  } catch (error) {
    console.error("Projekte API Fehler:", error);
    return NextResponse.json({
      success: false,
      message: "Fehler beim Laden der Projekte",
    }, { status: 500 });
  }
}

// POST - Neues Projekt erstellen
export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("adm_session")?.value;
    const jwtToken = request.cookies.get("adm_token")?.value;
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const validation = await SessionSecurityService.validateSession(
      sessionToken, jwtToken, clientIp, userAgent
    );

    if (!validation.valid) {
      return NextResponse.json({ success: false, message: "Nicht autorisiert" }, { status: 401 });
    }

    // Permission: admin.projects.create
    const hasCreatePermission = validation.session?.permissions.some(p => 
      p === "admin.projects.create" || p === "admin.projects.edit"
    );
    if (!hasCreatePermission && !validation.session?.roles.includes("Super Admin")) {
      return NextResponse.json({ success: false, message: "Keine Berechtigung" }, { status: 403 });
    }

    const body = await request.json();
    const {
      project_name,
      description,
      customer_id,
      status = "planned",
      priority = "normal",
      start_date,
      end_date,
      budget_amount,
      assigned_user_id,
    } = body;

    if (!project_name || !customer_id) {
      return NextResponse.json({
        success: false,
        message: "Projektname und Kunde sind Pflichtfelder",
      }, { status: 400 });
    }

    const pool = await getConnection();

    // Projektcode generieren (P-YYYYMMDD-XXX)
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    const [countResult] = await pool.execute(
      "SELECT COUNT(*) as count FROM lopez_projects WHERE DATE(created_at) = CURDATE()"
    );
    const count = (countResult as any[])[0]?.count || 0;
    const projectCode = `P-${dateStr}-${String(count + 1).padStart(3, "0")}`;

    const [result] = await pool.execute(
      `INSERT INTO lopez_projects 
       (project_code, project_name, description, customer_id, status, priority, 
        start_date, end_date, budget_amount, assigned_user_id, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        projectCode,
        project_name,
        description || null,
        customer_id,
        status,
        priority,
        start_date || null,
        end_date || null,
        budget_amount || null,
        assigned_user_id || null,
        validation.session?.userId,
      ]
    );

    const projectId = (result as any).insertId;

    // Audit-Log
    await AuditService.logAudit({
      table_name: "lopez_projects",
      record_id: projectId,
      action: "PROJECT_CREATE",
      user_id: validation.session?.userId || 0,
      username: validation.session?.username || "system",
      ip_address: clientIp,
      user_agent: userAgent,
      session_id: sessionToken || "jwt",
      risk_level: "LOW",
      compliance_category: "DATA_CHANGE",
      new_values: JSON.stringify({ projectCode, project_name, customer_id, status }),
    });

    return NextResponse.json({
      success: true,
      message: "Projekt erfolgreich erstellt",
      data: {
        id: projectId,
        project_code: projectCode,
      },
    });
  } catch (error) {
    console.error("Projekt erstellen Fehler:", error);
    return NextResponse.json({
      success: false,
      message: "Fehler beim Erstellen des Projekts",
    }, { status: 500 });
  }
}
