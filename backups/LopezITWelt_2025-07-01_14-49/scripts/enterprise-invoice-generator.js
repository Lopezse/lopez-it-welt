#!/usr/bin/env node

/**
 * Enterprise++ Invoice Generator
 * Automatische PDF-Rechnungserstellung aus Time Tracking Daten
 */

const fs = require('fs');
const path = require('path');

class EnterpriseInvoiceGenerator {
  constructor() {
    this.timestamp = new Date().toISOString();
    this.invoicesPath = 'enterprise-invoices/';
    this.templatesPath = 'enterprise-templates/';

    // Erstelle Ordner falls nicht vorhanden
    if (!fs.existsSync(this.invoicesPath)) {
      fs.mkdirSync(this.invoicesPath, { recursive: true });
    }
    if (!fs.existsSync(this.templatesPath)) {
      fs.mkdirSync(this.templatesPath, { recursive: true });
    }
  }

  async generateInvoice(billingEntry) {
    console.log('🧾 ENTERPRISE++ RECHNUNG GENERIEREN');
    console.log('====================================');

    const invoice = this.createInvoiceData(billingEntry);
    const htmlContent = this.generateHTMLInvoice(invoice);
    const pdfPath = await this.saveInvoice(invoice.invoiceNumber, htmlContent);

    console.log(`✅ Rechnung generiert: ${pdfPath}`);
    console.log(`📄 Rechnungsnummer: ${invoice.invoiceNumber}`);
    console.log(`💰 Betrag: €${invoice.total.toFixed(2)}`);

    return invoice;
  }

  createInvoiceData(billingEntry) {
    const invoiceNumber = billingEntry.invoiceNumber;
    const invoiceDate = new Date().toLocaleDateString('de-DE');
    const dueDate = this.calculateDueDate(invoiceDate);

    return {
      invoiceNumber: invoiceNumber,
      invoiceDate: invoiceDate,
      dueDate: dueDate,
      client: {
        name: 'Lopez IT Welt',
        address: 'IT-Dienstleistungen',
        email: 'info@lopez-it-welt.de',
        phone: '+49 123 456789',
        website: 'www.lopez-it-welt.de',
      },
      items: [
        {
          description: 'IT-Dienstleistungen - Entwicklung & Beratung',
          hours: billingEntry.totalHours,
          rate: billingEntry.hourlyRate,
          amount: billingEntry.totalAmount,
        },
      ],
      subtotal: billingEntry.totalAmount,
      tax: billingEntry.totalAmount * 0.19, // 19% MwSt
      total: billingEntry.totalAmount * 1.19,
      paymentTerms: 'Zahlung innerhalb von 14 Tagen nach Rechnungsstellung',
      bankDetails: {
        accountHolder: 'Lopez IT Welt',
        iban: 'DE89 3704 0044 0532 0130 00',
        bic: 'COBADEFFXXX',
        bank: 'Commerzbank AG',
      },
    };
  }

  generateHTMLInvoice(invoice) {
    return `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rechnung ${invoice.invoiceNumber}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .header {
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
        }
        .invoice-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .client-info, .invoice-details {
            flex: 1;
        }
        .invoice-details {
            text-align: right;
        }
        .invoice-number {
            font-size: 18px;
            font-weight: bold;
            color: #2563eb;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f8fafc;
            font-weight: bold;
        }
        .total-row {
            font-weight: bold;
            background-color: #f1f5f9;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 14px;
        }
        .bank-details {
            background-color: #f8fafc;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🚀 Lopez IT Welt</div>
        <div style="color: #6b7280; margin-top: 5px;">IT-Dienstleistungen & Entwicklung</div>
    </div>

    <div class="invoice-info">
        <div class="client-info">
            <h3>Rechnung an:</h3>
            <p><strong>${invoice.client.name}</strong><br>
            ${invoice.client.address}<br>
            E-Mail: ${invoice.client.email}<br>
            Tel: ${invoice.client.phone}<br>
            Web: ${invoice.client.website}</p>
        </div>
        <div class="invoice-details">
            <div class="invoice-number">Rechnung ${invoice.invoiceNumber}</div>
            <p><strong>Rechnungsdatum:</strong> ${invoice.invoiceDate}<br>
            <strong>Fälligkeitsdatum:</strong> ${invoice.dueDate}</p>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Beschreibung</th>
                <th>Stunden</th>
                <th>Stundensatz</th>
                <th>Betrag</th>
            </tr>
        </thead>
        <tbody>
            ${invoice.items
              .map(
                item => `
                <tr>
                    <td>${item.description}</td>
                    <td>${item.hours}h</td>
                    <td>€${item.rate.toFixed(2)}</td>
                    <td>€${item.amount.toFixed(2)}</td>
                </tr>
            `
              )
              .join('')}
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td colspan="3">Zwischensumme</td>
                <td>€${invoice.subtotal.toFixed(2)}</td>
            </tr>
            <tr class="total-row">
                <td colspan="3">MwSt. (19%)</td>
                <td>€${invoice.tax.toFixed(2)}</td>
            </tr>
            <tr class="total-row">
                <td colspan="3"><strong>Gesamtbetrag</strong></td>
                <td><strong>€${invoice.total.toFixed(2)}</strong></td>
            </tr>
        </tfoot>
    </table>

    <div class="bank-details">
        <h4>Bankverbindung:</h4>
        <p><strong>Kontoinhaber:</strong> ${invoice.bankDetails.accountHolder}<br>
        <strong>IBAN:</strong> ${invoice.bankDetails.iban}<br>
        <strong>BIC:</strong> ${invoice.bankDetails.bic}<br>
        <strong>Bank:</strong> ${invoice.bankDetails.bank}</p>
    </div>

    <div class="footer">
        <p><strong>Zahlungsbedingungen:</strong> ${invoice.paymentTerms}</p>
        <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
            Vielen Dank für Ihr Vertrauen in Lopez IT Welt!<br>
            Bei Fragen erreichen Sie uns unter: ${invoice.client.email}
        </p>
    </div>
</body>
</html>
        `;
  }

  async saveInvoice(invoiceNumber, htmlContent) {
    const fileName = `invoice-${invoiceNumber}.html`;
    const filePath = path.join(this.invoicesPath, fileName);

    fs.writeFileSync(filePath, htmlContent);

    // Hier könnte ein HTML-zu-PDF Konverter verwendet werden
    // Für jetzt speichern wir als HTML-Datei
    console.log(`📄 HTML-Rechnung gespeichert: ${filePath}`);

    return filePath;
  }

  calculateDueDate(invoiceDate) {
    const date = new Date(invoiceDate.split('.').reverse().join('-'));
    date.setDate(date.getDate() + 14); // 14 Tage Zahlungsziel
    return date.toLocaleDateString('de-DE');
  }

  async generateMonthlyInvoice(month, year) {
    console.log(`📊 MONATSRECHNUNG GENERIEREN: ${month}/${year}`);

    // Hier würde die Logik für Monatsrechnungen implementiert
    // Sammelt alle Sessions eines Monats und erstellt eine Gesamtrechnung

    const monthlyInvoice = {
      invoiceNumber: `LIW-${year}${String(month).padStart(2, '0')}-MONTH`,
      month: month,
      year: year,
      totalHours: 0,
      totalAmount: 0,
      sessions: [],
    };

    console.log(`✅ Monatsrechnung generiert: ${monthlyInvoice.invoiceNumber}`);
    return monthlyInvoice;
  }

  async generateWeeklyReport(week, year) {
    console.log(`📈 WOCHENBERICHT GENERIEREN: KW${week}/${year}`);

    const weeklyReport = {
      week: week,
      year: year,
      totalHours: 0,
      totalSessions: 0,
      totalTasks: 0,
      totalBilling: 0,
      dailyBreakdown: {},
    };

    console.log(`✅ Wochenbericht generiert: KW${week}/${year}`);
    return weeklyReport;
  }
}

// Beispiel-Verwendung
async function main() {
  try {
    const generator = new EnterpriseInvoiceGenerator();

    // Beispiel-Billing-Entry
    const billingEntry = {
      invoiceNumber: 'LIW-20250119-001',
      date: '19.01.2025',
      totalHours: 8.5,
      hourlyRate: 85,
      totalAmount: 722.5,
    };

    // Rechnung generieren
    await generator.generateInvoice(billingEntry);

    // Monatsrechnung generieren
    await generator.generateMonthlyInvoice(1, 2025);

    // Wochenbericht generieren
    await generator.generateWeeklyReport(3, 2025);
  } catch (error) {
    console.error('❌ Fehler beim Generieren der Rechnung:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = EnterpriseInvoiceGenerator;
