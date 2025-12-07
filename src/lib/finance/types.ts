/**
 * Finance Types - Enterprise++ Standard
 * 
 * Single Source of Truth für alle Finanz-bezogenen Typen
 * 
 * @author Lopez IT Welt Enterprise++
 * @version 1.0.0
 * @date 2025-12-07
 */

// =====================================================
// INVOICE TYPES
// =====================================================

/**
 * Invoice Status Enum
 */
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

/**
 * Invoice Item - Rechnungsposition
 */
export interface InvoiceItem {
  id?: number;
  invoice_id?: number;
  pos: number;
  item_text: string;
  qty: number;
  unit: string;
  unit_price: number;
  net_line: number;
}

/**
 * Admin Invoice - Vollständiges Rechnungs-Interface für Admin-Bereich
 * 
 * SINGLE SOURCE OF TRUTH für alle Admin-Invoice-Komponenten:
 * - invoices/[id]/page.tsx
 * - InvoiceDetailView.tsx
 * - InvoiceEditForm.tsx
 */
export interface AdminInvoice {
  id: string | number;
  invoice_number: string;
  customer_id?: string;
  company_name?: string;
  vorname?: string;
  nachname?: string;
  customer_email?: string;
  project_id?: number;
  project_name?: string;
  project_code?: string;
  order_id?: number;
  issue_date: string;
  service_date?: string;
  payment_terms?: string;
  currency?: string;
  net_amount: number;
  tax_rate: number;
  tax_amount: number;
  gross_amount: number;
  status: InvoiceStatus;
  hash_sha256?: string;
  pdf_path?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  items?: InvoiceItem[];
}

// =====================================================
// POLICY TYPES
// =====================================================

/**
 * Policy Type Enum
 */
export type PolicyType = "security" | "compliance" | "data" | "access" | "audit";

/**
 * Policy Status Enum
 */
export type PolicyStatus = "draft" | "active" | "archived";

/**
 * Admin Policy - Interface für Richtlinien
 * 
 * SINGLE SOURCE OF TRUTH für alle Policy-Komponenten:
 * - policies/page.tsx
 * - PolicyEditor.tsx
 */
export interface AdminPolicy {
  id: string;
  name: string;
  description: string;
  category: string;
  type: PolicyType | string;
  status: PolicyStatus | string;
  content?: string;
  version: number;
  effective_date?: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Admin Policy Input - Interface für neue/zu bearbeitende Policies
 * (id ist optional bei Neuanlage)
 */
export interface AdminPolicyInput {
  id?: string;
  name: string;
  description: string;
  category: string;
  type: PolicyType | string;
  status: PolicyStatus | string;
  content?: string;
  version: number;
  effective_date?: string;
  expiry_date?: string;
}

