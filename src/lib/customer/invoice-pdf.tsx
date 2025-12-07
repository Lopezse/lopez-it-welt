// =====================================================
// RECHNUNG PDF TEMPLATE
// =====================================================
// Verwendet @react-pdf/renderer
// Enterprise++ Design
// =====================================================

import React from "react";
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet
} from "@react-pdf/renderer";
import { Invoice } from "./invoice-service";

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1e293b"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40
  },
  logo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563eb"
  },
  logoSubtitle: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 2
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b"
  },
  invoiceNumber: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#64748b",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1
  },
  addressBlock: {
    lineHeight: 1.5
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4
  },
  label: {
    color: "#64748b"
  },
  value: {
    fontWeight: "bold"
  },
  table: {
    marginTop: 20,
    marginBottom: 20
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    padding: 8,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0"
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9"
  },
  colDescription: {
    flex: 3
  },
  colQuantity: {
    flex: 1,
    textAlign: "center"
  },
  colPrice: {
    flex: 1,
    textAlign: "right"
  },
  colTotal: {
    flex: 1,
    textAlign: "right"
  },
  totals: {
    marginTop: 20,
    alignItems: "flex-end"
  },
  totalRow: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    paddingVertical: 4
  },
  totalLabel: {
    color: "#64748b"
  },
  totalValue: {
    fontWeight: "bold"
  },
  grandTotal: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    paddingVertical: 8,
    marginTop: 4,
    borderTopWidth: 2,
    borderTopColor: "#2563eb"
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: "bold"
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2563eb"
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40
  },
  footerText: {
    fontSize: 8,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 1.5
  },
  notes: {
    marginTop: 30,
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 4
  },
  notesTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 4
  },
  notesText: {
    fontSize: 9,
    color: "#64748b",
    lineHeight: 1.4
  },
  statusBadge: {
    position: "absolute",
    top: 40,
    right: 40,
    padding: "4 12",
    borderRadius: 4,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase"
  },
  statusPaid: {
    backgroundColor: "#dcfce7",
    color: "#166534"
  },
  statusSent: {
    backgroundColor: "#fef3c7",
    color: "#92400e"
  },
  statusDraft: {
    backgroundColor: "#f1f5f9",
    color: "#475569"
  }
});

// =====================================================
// TYPEN
// =====================================================

interface InvoicePdfProps {
  invoice: Invoice;
  customer: {
    company_name?: string;
    first_name?: string;
    last_name?: string;
    street?: string;
    postal_code?: string;
    city?: string;
    country?: string;
    email?: string;
  };
  company?: {
    name: string;
    street: string;
    postal_code: string;
    city: string;
    country: string;
    email: string;
    phone: string;
    vat_id: string;
    bank_name: string;
    iban: string;
    bic: string;
  };
}

// =====================================================
// DEFAULTS
// =====================================================

const DEFAULT_COMPANY = {
  name: "Lopez IT Welt",
  street: "Musterstraße 123",
  postal_code: "12345",
  city: "Musterstadt",
  country: "Deutschland",
  email: "rechnungen@lopez-it-welt.de",
  phone: "+49 123 456789",
  vat_id: "DE123456789",
  bank_name: "Musterbank",
  iban: "DE89 3704 0044 0532 0130 00",
  bic: "COBADEFFXXX"
};

// =====================================================
// HELPER
// =====================================================

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(amount);
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// =====================================================
// COMPONENT
// =====================================================

export const InvoicePdf: React.FC<InvoicePdfProps> = ({ 
  invoice, 
  customer, 
  company = DEFAULT_COMPANY 
}) => {
  const customerName = customer.company_name || 
    `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 
    'Kunde';

  const getStatusStyle = () => {
    switch (invoice.status) {
      case 'paid': return styles.statusPaid;
      case 'sent': 
      case 'overdue': return styles.statusSent;
      default: return styles.statusDraft;
    }
  };

  const getStatusLabel = () => {
    switch (invoice.status) {
      case 'paid': return 'Bezahlt';
      case 'sent': return 'Offen';
      case 'overdue': return 'Überfällig';
      case 'cancelled': return 'Storniert';
      default: return 'Entwurf';
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Status Badge */}
        <View style={[styles.statusBadge, getStatusStyle()]}>
          <Text>{getStatusLabel()}</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>{company.name}</Text>
            <Text style={styles.logoSubtitle}>Enterprise++ IT-Solutions</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.invoiceTitle}>RECHNUNG</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoice_number}</Text>
          </View>
        </View>

        {/* Adressen */}
        <View style={{ flexDirection: "row", marginBottom: 30 }}>
          {/* Absender */}
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Von</Text>
            <View style={styles.addressBlock}>
              <Text>{company.name}</Text>
              <Text>{company.street}</Text>
              <Text>{company.postal_code} {company.city}</Text>
              <Text>{company.country}</Text>
              <Text style={{ marginTop: 4 }}>{company.email}</Text>
              <Text>USt-IdNr.: {company.vat_id}</Text>
            </View>
          </View>

          {/* Empfänger */}
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>An</Text>
            <View style={styles.addressBlock}>
              <Text style={{ fontWeight: "bold" }}>{customerName}</Text>
              {customer.street && <Text>{customer.street}</Text>}
              {(customer.postal_code || customer.city) && (
                <Text>{customer.postal_code} {customer.city}</Text>
              )}
              {customer.country && <Text>{customer.country}</Text>}
              {customer.email && <Text style={{ marginTop: 4 }}>{customer.email}</Text>}
            </View>
          </View>
        </View>

        {/* Rechnungsdetails */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Rechnungsdatum:</Text>
            <Text style={styles.value}>{formatDate(invoice.invoice_date)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fällig am:</Text>
            <Text style={styles.value}>{formatDate(invoice.due_date)}</Text>
          </View>
          {invoice.paid_at && (
            <View style={styles.row}>
              <Text style={styles.label}>Bezahlt am:</Text>
              <Text style={styles.value}>{formatDate(invoice.paid_at)}</Text>
            </View>
          )}
        </View>

        {/* Positionen */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDescription}>Beschreibung</Text>
            <Text style={styles.colQuantity}>Menge</Text>
            <Text style={styles.colPrice}>Einzelpreis</Text>
            <Text style={styles.colTotal}>Gesamt</Text>
          </View>
          
          {invoice.line_items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colDescription}>{item.description}</Text>
              <Text style={styles.colQuantity}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{formatCurrency(item.unit_price)}</Text>
              <Text style={styles.colTotal}>{formatCurrency(item.total)}</Text>
            </View>
          ))}
        </View>

        {/* Summen */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Netto</Text>
            <Text style={styles.totalValue}>{formatCurrency(invoice.net_amount)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>MwSt. ({invoice.tax_rate}%)</Text>
            <Text style={styles.totalValue}>{formatCurrency(invoice.tax_amount)}</Text>
          </View>
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>Gesamtbetrag</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(invoice.gross_amount)}</Text>
          </View>
        </View>

        {/* Notizen */}
        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Hinweise</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer mit Bankdaten */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Bankverbindung: {company.bank_name} | IBAN: {company.iban} | BIC: {company.bic}
          </Text>
          <Text style={styles.footerText}>
            {company.name} | {company.street} | {company.postal_code} {company.city} | {company.phone}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePdf;







